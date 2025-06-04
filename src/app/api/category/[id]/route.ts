import pool from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
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
      WHERE c.category_id = $1
      ORDER BY c.created_date DESC
    `,
      [categoryId]
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contentMap: { [key: number]: any } = {};

    result.rows.forEach((row) => {
      if (!contentMap[row.content_id]) {
        contentMap[row.content_id] = {
          id: row.content_id,
          title: row.title,
          banner_image: row.banner_image,
          created_date: row.created_date,
          category_id: row.category_id,
          items: [],
        };
      }

      if (row.item_id) {
        contentMap[row.content_id].items.push({
          id: row.item_id,
          text: row.text,
          image: row.image,
        });
      }
    });

    const contentList = Object.values(contentMap);
    return NextResponse.json(contentList);
  } catch (error) {
    console.error("Error fetching category content:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
