import { createSupabaseServerClient } from "@/lib/supabaseClient";
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
    const supabase = createSupabaseServerClient();

    // Get all content items for the category with their related items
    const { data, error } = await supabase
      .from('content')
      .select(`
        id,
        title,
        banner_image,
        created_date,
        category_id,
        content_item (
          id,
          text,
          image
        )
      `)
      .eq('category_id', categoryId)
      .order('created_date', { ascending: false });

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Database query failed", details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Transform the data to match the expected format
    const contentList = data.map(content => ({
      id: content.id,
      title: content.title,
      banner_image: content.banner_image,
      created_date: content.created_date,
      category_id: content.category_id,
      items: content.content_item || []
    }));

    return NextResponse.json(contentList);
  } catch (error) {
    console.error("Error fetching category content:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: "Failed to fetch category content", details: errorMessage },
      { status: 500 }
    );
  }
}
