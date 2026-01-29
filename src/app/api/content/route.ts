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
    
    // Check content-type to determine if it's FormData or JSON
    const contentType = request.headers.get('content-type') || '';
    
    console.log('Content-Type:', contentType);
    
    let title: string;
    let description: string | null = null;
    let contentText: string | null = null;
    let category_id: number;
    let banner_image: string | null = null;
    let items: { text: string; image: string }[] | null = null;

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (from CreateNewsForm)
      const formData = await request.formData();
      
      title = formData.get('title') as string;
      description = formData.get('description') as string || null;
      contentText = formData.get('content') as string || null;
      const categoryIdStr = formData.get('category_id') as string;
      category_id = parseInt(categoryIdStr, 10);
      
      const file = formData.get('file') as File | null;
      
      if (!title || !category_id || isNaN(category_id)) {
        return NextResponse.json(
          { error: "Гарчиг болон ангилал шаардлагатай" },
          { status: 400 }
        );
      }

      // Handle file upload if provided
      if (file && file.size > 0) {
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `upload/${fileName}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('content')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          // Fallback: save to public folder path
          banner_image = `/upload/${fileName}`;
        } else {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('content')
            .getPublicUrl(filePath);
          banner_image = urlData.publicUrl;
        }
      }
      
    } else if (contentType.includes('application/json')) {
      // Handle JSON data
      let data;
      try {
        const rawBody = await request.text();
        console.log('Raw body:', rawBody.substring(0, 200));
        data = JSON.parse(rawBody);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return NextResponse.json(
          { error: "JSON формат буруу байна", details: String(parseError) },
          { status: 400 }
        );
      }
      
      console.log('Parsed data:', JSON.stringify(data, null, 2));
      
      title = data.title;
      description = data.description || null;
      contentText = data.content || null;
      banner_image = data.banner_image || null;
      category_id = typeof data.category_id === 'number' ? data.category_id : parseInt(data.category_id, 10);
      items = data.items || null;

      if (!title) {
        return NextResponse.json(
          { error: "Гарчиг шаардлагатай" },
          { status: 400 }
        );
      }
      
      if (!category_id || isNaN(category_id)) {
        return NextResponse.json(
          { error: "Ангилал сонгоно уу" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Дэмжигдээгүй content-type: " + contentType },
        { status: 400 }
      );
    }

    // Мэдээг хадгалах
    const { data: content, error: insertError } = await supabase
      .from('content')
      .insert({
        title,
        description,
        content: contentText,
        banner_image,
        created_date: new Date().toISOString(),
        category_id,
        type: 'content',
        status: 'active'
      })
      .select()
      .single();

    if (insertError) {
      throw new Error('Контент хадгалахад алдаа гарлаа: ' + insertError.message);
    }

    // Content items хадгалах (only for JSON format with items)
    if (items && items.length > 0) {
      const contentItems = items.map((item: { text: string; image: string }, index: number) => ({
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
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Контент амжилттай нэмэгдлээ',
      data: content
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
