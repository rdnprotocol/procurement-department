import pool from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

interface ContentItem {
  id: number;
  text: string;
  image: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contentId = parseInt(id);

  if (isNaN(contentId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    const result = await client.query(
      `
      SELECT
        c.id AS content_id,
        c.title,
        c.banner_image,
        c.created_date,
        c.category_id,
        ci.id AS item_id,
        ci.text,
        ci.image
      FROM content c
      LEFT JOIN content_item ci ON c.id = ci.content_id
      WHERE c.id = $1
    `,
      [contentId]
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    const content = {
      id: result.rows[0].content_id,
      title: result.rows[0].title,
      banner_image: result.rows[0].banner_image,
      created_date: result.rows[0].created_date,
      category_id: result.rows[0].category_id,
      items: [] as ContentItem[],
    };

    for (const row of result.rows) {
      if (row.item_id) {
        content.items.push({
          id: row.item_id,
          text: row.text,
          image: row.image,
        });
      }
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching content by ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
