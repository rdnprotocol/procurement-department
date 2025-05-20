// app/api/news/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const { title, date, content } = await req.json();

  if (!title || !date || !content) {
    return NextResponse.json(
      { success: false, error: "Бүх талбарыг бөглөнө үү" },
      { status: 400 }
    );
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-zа-яөүё0-9 -]/gi, "")
    .replace(/\s+/g, "-");

  const frontmatter = `---\ntitle: "${title}"\ndate: "${date}"\n---\n`;
  const markdown = frontmatter + content;

  const filePath = path.join(process.cwd(), "src/content/news", `${slug}.md`);

  try {
    fs.writeFileSync(filePath, markdown);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
