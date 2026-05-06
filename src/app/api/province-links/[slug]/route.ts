import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createSupabaseServerClient();
    const body = await request.json();

    const updateData: Record<string, string | number | null> = {};
    const allowed = [
      "title",
      "plans_url",
      "tender_url",
      "plans_label",
      "tender_label",
      "sort_order",
    ];

    for (const key of allowed) {
      if (body[key] !== undefined) {
        updateData[key] = body[key] === "" ? null : body[key];
      }
    }

    // Upsert ашиглан мөр байхгүй бол шинээр үүсгэх
    const { data, error } = await supabase
      .from("province_links")
      .upsert(
        {
          slug,
          title: body.title || slug,
          ...updateData,
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (error) {
      console.error("Error updating province link:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
