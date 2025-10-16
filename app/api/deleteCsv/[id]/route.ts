import { NextResponse } from "next/server"
import { db } from "@/db/drizzle"
import { csvFile } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"

const s3 = new S3Client({ region: process.env.AWS_REGION })

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Authenticate user
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const userId = session.user.id

    // ✅ Fetch file record
    const [fileData] = await db
      .select()
      .from(csvFile)
      .where(eq(csvFile.id, id))
      .limit(1)

    if (!fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // ✅ Check file ownership
    if (fileData.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // ✅ Delete from S3
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileData.s3Key,
      })
      await s3.send(command)
    } catch (s3Error: any) {
      console.error("🧨 Error deleting from S3:", s3Error)
      return NextResponse.json(
        { error: "Failed to delete file from S3" },
        { status: 500 }
      )
    }

    // ✅ Delete record from DB
    await db.delete(csvFile).where(eq(csvFile.id, id))

    // ✅ Respond success
    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
      id,
    })
  } catch (error: any) {
    console.error("🧨 Error deleting CSV file:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
