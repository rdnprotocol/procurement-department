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
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching department:', error);
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
    
    const { data, error } = await supabase
      .from('departments')
      .update({
        name: body.name,
        short_name: body.shortName,
        description: body.description,
        responsibilities: body.responsibilities || [],
        contact_person: body.contact?.person,
        contact_position: body.contact?.position,
        contact_room: body.contact?.room,
        contact_phone: body.contact?.phone,
        contact_email: body.contact?.email,
        color: body.color,
        sort_order: body.sortOrder,
        is_director: body.isDirector
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating department:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
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
    
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting department:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}





