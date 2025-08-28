import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file: File | null = formData.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(),"public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const id = randomUUID();
  const filePath = path.join(uploadDir, `${id}.csv`);
  await writeFile(filePath, buffer);

  return NextResponse.json({ success: true, id });
}
