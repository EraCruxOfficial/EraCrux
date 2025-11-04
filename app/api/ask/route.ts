import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import csv from "csvtojson";
import fs from "fs/promises";
import path from "path";
import * as math from "mathjs";

export const runtime = "nodejs";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string });

// Simple cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = math.dot(a, b) as number;
  const normA = math.norm(a) as number;
  const normB = math.norm(b) as number;
  return dot / (normA * normB);
}

// Deterministic embedding function (synchronous)
// Note: This is a weak substitute for real embeddings
function embedText(text: string): number[] {
  const dim = 256;
  const vec = new Array<number>(dim).fill(0);
  
  // Use word-level features for slightly better semantic representation
  const words = text.toLowerCase().split(/\s+/);
  
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    vec[i % dim] += code;
  }
  
  // Add word-level features
  for (const word of words) {
    const hash = Array.from(word).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    vec[hash % dim] += 10;
  }
  
  // Non-linear transform and normalize
  for (let i = 0; i < dim; i++) {
    vec[i] = Math.tanh(vec[i] / 1000);
  }
  
  const norm = (math.norm(vec) as number) || 1;
  return vec.map((v) => v / norm);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const question = formData.get("question") as string | null;

    if (!file || !question) {
      return NextResponse.json(
        { error: "Missing file or question." },
        { status: 400 }
      );
    }

    // Save uploaded CSV
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = path.join("/tmp", file.name);
    await fs.writeFile(tempPath, buffer);

    // Read CSV into JSON
    const csvData = await csv().fromFile(tempPath);
    
    // Clean up temp file
    await fs.unlink(tempPath).catch(() => {});

    if (!csvData || csvData.length === 0) {
      return NextResponse.json(
        { error: "CSV is empty or invalid." },
        { status: 400 }
      );
    }

    // Generate embeddings for each row
    const rowTexts = csvData.map((row, idx) => {
      // Include column headers in the text for better matching
      const fields = Object.entries(row)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      return `Row ${idx + 1}: ${fields}`;
    });

    const rowEmbeddings = rowTexts.map((text) => embedText(text));

    // Embed the user question
    const queryEmbedding = embedText(question);

    // Compute cosine similarity and rank rows
    const rankedRows = csvData
      .map((row, idx) => ({
        row,
        score: cosineSimilarity(queryEmbedding, rowEmbeddings[idx]),
        index: idx,
      }))
      .sort((a, b) => b.score - a.score);

    // Select top rows within token budget (roughly 3 chars per token)
    const MAX_CHARS = 8000; // Leave room for prompt and response
    let totalChars = 0;
    const selectedRows = [];

    for (const { row, score } of rankedRows) {
      const str = JSON.stringify(row);
      if (totalChars + str.length > MAX_CHARS) break;
      
      selectedRows.push(row);
      totalChars += str.length;
    }

    // If no rows selected due to size, take at least the top one
    if (selectedRows.length === 0 && rankedRows.length > 0) {
      selectedRows.push(rankedRows[0].row);
    }

    // Get column headers for context
    const headers = Object.keys(csvData[0] || {});

    // Build optimized prompt
    const prompt = `You are a data analysis assistant. Answer the user's question using ONLY the CSV data provided below.

Dataset contains ${csvData.length} total rows. Columns: ${headers.join(", ")}

Most Relevant Rows (${selectedRows.length} shown):
${JSON.stringify(selectedRows, null, 2)}

User Question: ${question}

Instructions:
- Answer concisely and factually
- Cite specific values/statistics from the data
- If the answer requires information not in the shown rows, state that clearly
- Use proper formatting for numbers and percentages
`;
    // Query Groq LLM
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // Lower temperature for more factual responses
      max_tokens: 1000,
    });

    const answer = response.choices?.[0]?.message?.content || "No response generated";

    return NextResponse.json({
      answer,
      metadata: {
        totalRows: csvData.length,
        rowsAnalyzed: selectedRows.length,
        columns: headers,
      },
    });
  } catch (err) {
    console.error("Error in /api/ask:", err);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
