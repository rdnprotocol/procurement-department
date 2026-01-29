import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    let query = supabase
      .from('law_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching law documents:', error);
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
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: 'Гарчиг оруулна уу' }, { status: 400 });
    }

    if (!body.type) {
      return NextResponse.json({ error: 'Төрөл сонгоно уу' }, { status: 400 });
    }

    // For law_link and procurement_law, URL is required
    if ((body.type === 'law_link' || body.type === 'procurement_law') && !body.url) {
      return NextResponse.json({ error: 'Холбоос оруулна уу' }, { status: 400 });
    }

    // For director_order, file_url is required
    if (body.type === 'director_order' && !body.file_url) {
      return NextResponse.json({ error: 'PDF файл оруулна уу' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('law_documents')
      .insert({
        title: body.title,
        type: body.type,
        url: body.url || null,
        file_url: body.file_url || null,
        description: body.description || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating law document:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



