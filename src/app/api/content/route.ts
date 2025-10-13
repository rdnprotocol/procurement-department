// app/api/content/route.ts
import pool from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  let client;
  try {
    client = await pool.connect();

    const result = await client.query(`
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
      ORDER BY c.created_date DESC
    `);

    // Group content with their items
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
    console.error("❌ Content API error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: "Failed to fetch content", details: errorMessage },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, banner_image, created_date, category_id, items } = body;

    if (!title || !created_date || !category_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    const insertContentQuery = `
      INSERT INTO content (title, banner_image, created_date, category_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    const contentRes = await client.query(insertContentQuery, [
      title,
      banner_image,
      created_date,
      category_id,
    ]);

    const contentId = contentRes.rows[0].id;

    if (Array.isArray(items) && items.length > 0) {
      const insertItemQuery = `
        INSERT INTO content_item (content_id, text, image)
        VALUES ($1, $2, $3)
      `;

      for (const item of items) {
        await client.query(insertItemQuery, [
          contentId,
          item.text || null,
          item.image || null,
        ]);
      }
    }

    client.release();

    return NextResponse.json({ message: "Content created", id: contentId });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 }
    );
  }
}
