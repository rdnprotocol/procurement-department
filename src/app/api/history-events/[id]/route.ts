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
      .from('history_events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching history event:', error);
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
      .from('history_events')
      .update({
        year: body.year,
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

    if (error) {
      console.error('Error updating history event:', error);
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
      .from('history_events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting history event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

