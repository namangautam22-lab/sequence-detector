import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const { sample_id } = await req.json();

  if (!sample_id || !/^sample_[1-5]$/.test(sample_id)) {
    return NextResponse.json({ error: "Invalid sample_id" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "samples", `${sample_id}.json`);
  const data = JSON.parse(readFileSync(filePath, "utf-8"));

  return NextResponse.json({ mode: "demo", predictions: data });
}
