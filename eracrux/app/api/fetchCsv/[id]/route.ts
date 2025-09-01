
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { csvFile } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get file metadata from database
    const [fileData] = await db
      .select()
      .from(csvFile)
      .where(eq(csvFile.id, params.id))
      .limit(1);

    if (!fileData) {
      return NextResponse.json(
        { error: "File not found" }, 
        { status: 404 }
      );
    }

    // Fetch the actual CSV content from S3
    const response = await fetch(fileData.s3Url);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file from S3" }, 
        { status: 500 }
      );
    }

    const csvContent = await response.text();

    return NextResponse.json({
      success: true,
      data: {
        id: fileData.id,
        filename: fileData.originalName,
        s3Url: fileData.s3Url,
        csvContent: csvContent,
        metadata: {
          fileSize: fileData.fileSize,
          contentType: fileData.contentType,
          createdAt: fileData.createdAt,
          updatedAt: fileData.updatedAt,
        }
      }
    });

  } catch (error) {
    console.error('Error fetching CSV data:', error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}