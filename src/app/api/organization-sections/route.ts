import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    
    // Get all sections with their items
    const { data: sections, error } = await supabase
      .from('organization_sections')
      .select(`
        *,
        items:organization_section_items(*)
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching organization sections:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Sort items within each section
    const sortedSections = sections?.map(section => ({
      ...section,
      items: section.items?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order) || []
    }));

    return NextResponse.json(sortedSections || []);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const body = await request.json();
    
    // Insert section
    const { data: section, error: sectionError } = await supabase
      .from('organization_sections')
      .insert({
        section_type: body.section_type,
        title: body.title,
        description: body.description,
        icon: body.icon,
        color: body.color,
        sort_order: body.sort_order || 0,
        is_active: body.is_active !== false
      })
      .select()
      .single();

    if (sectionError) {
      console.error('Error creating section:', sectionError);
      return NextResponse.json({ error: sectionError.message }, { status: 500 });
    }

    // Insert items if provided
    if (body.items && body.items.length > 0) {
      const itemsToInsert = body.items.map((item: { content: string }, index: number) => ({
        section_id: section.id,
        content: item.content,
        sort_order: index
      }));

      const { error: itemsError } = await supabase
        .from('organization_section_items')
        .insert(itemsToInsert);

      if (itemsError) {
        console.error('Error creating items:', itemsError);
      }
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}





