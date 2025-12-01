import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data: staticContents, error } = await supabase
      .from('static_contents')
      .select('*')
      .order('type');

    if (error) {
      throw error;
    }

    return NextResponse.json(staticContents);
  } catch (error) {
    console.error('Error fetching static contents:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const { title, content, type } = await request.json();

    // Validate required fields
    if (!title || !type) {
      return NextResponse.json(
        { error: 'Гарчиг болон төрөл шаардлагатай' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['mission', 'vision', 'goal', 'history', 'structure', 'intro'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Хүчингүй төрөл' },
        { status: 400 }
      );
    }

    const { data: newContent, error } = await supabase
      .from('static_contents')
      .insert({
        title,
        content: content || '',
        type,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Статик контент амжилттай үүсгэлээ',
      data: newContent,
    });
  } catch (error) {
    console.error('Error creating static content:', error);
    return NextResponse.json(
      { error: 'Статик контент үүсгэхэд алдаа гарлаа' },
      { status: 500 }
    );
  }
}