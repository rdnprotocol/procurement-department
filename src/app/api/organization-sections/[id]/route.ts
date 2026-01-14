import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('organization_sections')
      .select(`
        *,
        items:organization_section_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching section:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServerClient();
    const body = await request.json();
    
    // Update section
    const { data: section, error: sectionError } = await supabase
      .from('organization_sections')
      .update({
        section_type: body.section_type,
        title: body.title,
        description: body.description,
        icon: body.icon,
        color: body.color,
        sort_order: body.sort_order,
        is_active: body.is_active
      })
      .eq('id', id)
      .select()
      .single();

    if (sectionError) {
      console.error('Error updating section:', sectionError);
      return NextResponse.json({ error: sectionError.message }, { status: 500 });
    }

    // Update items if provided
    if (body.items !== undefined) {
      // Delete existing items
      await supabase
        .from('organization_section_items')
        .delete()
        .eq('section_id', id);

      // Insert new items
      if (body.items && body.items.length > 0) {
        const itemsToInsert = body.items.map((item: { content: string }, index: number) => ({
          section_id: id,
          content: item.content,
          sort_order: index
        }));

        const { error: itemsError } = await supabase
          .from('organization_section_items')
          .insert(itemsToInsert);

        if (itemsError) {
          console.error('Error updating items:', itemsError);
        }
      }
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServerClient();
    
    // Items will be deleted automatically due to CASCADE
    const { error } = await supabase
      .from('organization_sections')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting section:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}





