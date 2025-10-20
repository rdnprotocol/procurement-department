import { createSupabaseServerClient } from "@/lib/supabaseClient";
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
    const supabase = createSupabaseServerClient();

    // Get content with its items using a single query
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
      .eq('id', contentId)
      .single();

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch content", details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Transform the response to match the expected format
    const content = {
      id: data.id,
      title: data.title,
      banner_image: data.banner_image,
      created_date: data.created_date,
      category_id: data.category_id,
      items: (data.content_item || []) as ContentItem[]
    };

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching content by ID:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: "Failed to fetch content", details: errorMessage },
      { status: 500 }
    );
  }
}
