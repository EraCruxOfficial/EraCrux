import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { csvFile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Require authentication
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = session.user.id;

    // ✅ Get file metadata from DB
    const [fileData] = await db
      .select()
      .from(csvFile)
      .where(eq(csvFile.id, id))
      .limit(1);

    if (!fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // ✅ Enforce ownership
    if (fileData.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Generate short-lived signed URL
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileData.s3Key,
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    // ✅ Fetch file content securely
    const response = await fetch(signedUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file from S3" },
        { status: 500 }
      );
    }

    const csvContent = await response.text();

    // ✅ Return safe structured response
    return NextResponse.json({
      success: true,
      data: {
        id: fileData.id,
        filename: fileData.originalName,
        csvContent,
        metadata: {
          fileSize: fileData.fileSize,
          contentType: fileData.contentType,
          createdAt: fileData.createdAt,
          updatedAt: fileData.updatedAt,
        },
      },
    });
  } catch (error: any) {
    console.error("🧨 Error fetching CSV data:");
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);
    console.error("Full error object:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
