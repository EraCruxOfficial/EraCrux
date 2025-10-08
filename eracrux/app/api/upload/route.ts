import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { uploadToS3 } from "@/lib/s3";
import { db } from "@/db/drizzle";
import { csvFile } from "@/db/schema";
import { auth } from "@/lib/auth";


export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  try {
    const formData = await req.formData();
    const file: File | null = formData.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      return NextResponse.json({ error: "Only CSV files are allowed" }, { status: 400 });
    }

    // Generate unique identifiers
    const fileId = randomUUID();
    const s3Key = `csv-uploads/${fileId}/${file.name}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to S3
    const s3Url = await uploadToS3(buffer, s3Key, file.type);

    // Save metadata to database
    const [dbResult] = await db.insert(csvFile).values({
      id: fileId,
      filename: `${fileId}.csv`,
      originalName: file.name,
      s3Url: s3Url,
      s3Key: s3Key,
      fileSize: file.size,
      contentType: file.type || 'text/csv',
      userId: userId, // You'll need to get this from your auth system
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      id: fileId,
      s3Url: s3Url,
      filename: file.name
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}