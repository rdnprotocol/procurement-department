import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: "No file uploaded" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), "public", "upload");

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filePath = join(uploadDir, file.name);
  await writeFile(filePath, buffer);

  let typeCategory = "other";
  if (file.type.startsWith("image/")) {
    typeCategory = "image";
  } else if (file.type === "application/pdf") {
    typeCategory = "pdf";
  }

  return NextResponse.json({
    success: true,
    url: `/upload/${file.name}`,
    type: typeCategory,
  });
}
