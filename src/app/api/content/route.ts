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

    // Get all news content
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('*')
      .eq('type', 'news')
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
    
    // Form data авах
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const file = formData.get('file') as File | null;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Гарчиг болон агуулга оруулна уу" },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // Хэрэв зураг байвал upload хийх
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error('Зураг байршуулахад алдаа гарлаа: ' + uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    // Get category_id
    const category_id = formData.get('category_id');

    // Мэдээг хадгалах
    const { error: insertError } = await supabase
      .from('content')
      .insert({
        title,
        description,
        content,
        banner_image: imageUrl,
        created_date: new Date().toISOString(),
        type: 'news',
        status: 'active',
        category_id: category_id ? parseInt(category_id as string) : null
      });

    if (insertError) {
      throw new Error('Мэдээ хадгалахад алдаа гарлаа: ' + insertError.message);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Мэдээ амжилттай нэмэгдлээ' 
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
