import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import csv from "csvtojson";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string });

export async function POST(req: Request) {
  try {
    // Parse form data directly (Next.js supports this)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const question = formData.get("question") as string | null;

    if (!file || !question) {
      return NextResponse.json({ error: "Missing file or question." }, { status: 400 });
    }

    // Save the uploaded file temporarily to /tmp
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = path.join("/tmp", file.name);
    await fs.writeFile(tempPath, buffer);

    // Parse CSV
    const csvData = await csv().fromFile(tempPath);
    const sampleData = csvData.slice(0, 5);

    // Create prompt
    const prompt = `
You are a data analysis assistant.
Answer questions based on the following CSV data.

CSV Data Sample:
${JSON.stringify(sampleData)}

User question: ${question}
`;

    // Query Groq
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    const answer = response.choices?.[0]?.message?.content || "No response";

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Error in /api/ask:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
