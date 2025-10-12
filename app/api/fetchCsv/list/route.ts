// app/api/fetchCsv/list/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { csvFile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    // ✅ Authenticate
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // ✅ Fetch all CSVs uploaded by this user
    const files = await db
      .select()
      .from(csvFile)
      .where(eq(csvFile.userId, userId));

    return NextResponse.json({
      success: true,
      files: files.map((f) => ({
        id: f.id,
        filename: f.originalName,
        createdAt: f.createdAt,
        fileSize: f.fileSize,
        contentType: f.contentType,
      })),
    });
  } catch (error) {
    console.error("Error fetching user CSVs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
