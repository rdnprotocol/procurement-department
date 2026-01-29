import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching departments:', error);
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
      .from('departments')
      .insert({
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
        sort_order: body.sortOrder || 0,
        is_director: body.isDirector || false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating department:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}







