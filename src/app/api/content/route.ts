// app/api/content/route.ts
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check environment variables first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('Debug: Checking Supabase config:', {
      hasUrl: !!supabaseUrl,
      urlPrefix: supabaseUrl?.substring(0, 10),
      hasKey: !!supabaseKey,
      keyLength: supabaseKey?.length
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Missing Supabase credentials:", {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      });
      return NextResponse.json(
        { 
          error: "Supabase configuration missing", 
          details: "Please check .env.local configuration" 
        },
        { status: 500 }
      );
    }

    console.log('Debug: Creating Supabase client...');
    const supabase = createSupabaseServerClient();

    // Get all content
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select(`
        *,
        content_item (
          id,
          text,
          image,
          order_index
        )
      `)
      .order('created_date', { ascending: false });

    if (contentError) {
      throw contentError;
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("❌ Content API error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: "Failed to fetch content", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    
    // JSON data авах
    const data = await request.json();
    const { title, banner_image, created_date, category_id, items } = data;

    if (!title || !banner_image || !created_date || !category_id || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Бүх талбаруудыг бөглөнө үү" },
        { status: 400 }
      );
    }

    // Мэдээг хадгалах
    const { data: content, error: insertError } = await supabase
      .from('content')
      .insert({
        title,
        description: data.description || null,
        content: data.content || null,
        banner_image,
        created_date,
        category_id,
        type: 'content',
        status: data.status || 'active'
      })
      .select()
      .single();

    if (insertError) {
      throw new Error('Контент хадгалахад алдаа гарлаа: ' + insertError.message);
    }

    // Content items хадгалах
    const contentItems = items.map((item: any, index: number) => ({
      content_id: content.id,
      text: item.text,
      image: item.image,
      order_index: index
    }));

    const { error: itemsError } = await supabase
      .from('content_item')
      .insert(contentItems);

    if (itemsError) {
      throw new Error('Контентийн элементүүдийг хадгалахад алдаа гарлаа: ' + itemsError.message);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Контент амжилттай нэмэгдлээ' 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message || 'Алдаа гарлаа' 
      },
      { status: 500 }
    );
  }
}
