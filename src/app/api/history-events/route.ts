import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('history_events')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching history events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('history_events')
      .insert({
        year: body.year,
        title: body.title,
        description: body.description,
        icon: body.icon || 'Calendar',
        color: body.color || 'from-blue-500 to-blue-600',
        sort_order: body.sort_order || 0,
        is_active: body.is_active !== false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating history event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}





