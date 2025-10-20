import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Файлын төрлийг тодорхойлох
    let typeCategory = "other";
    let storageFolder = "other";

    if (file.type.startsWith("image/")) {
      typeCategory = "image";
      storageFolder = "images";
    } else if (file.type === "application/pdf") {
      typeCategory = "pdf";
      storageFolder = "documents";
    }

    // Файлын нэрийг unique болгох
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;

    // Supabase руу файл upload хийх
    const supabase = createSupabaseServerClient();
    
    const { data: uploadData, error } = await supabase
      .storage
      .from("procurement")
      .upload(`${storageFolder}/${fileName}`, file, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    // Файлын public URL-г авах
    const { data: publicUrl } = supabase
      .storage
      .from("procurement")
      .getPublicUrl(`${storageFolder}/${fileName}`);

    return NextResponse.json({
      success: true,
      url: publicUrl.publicUrl,
      type: typeCategory,
      path: uploadData.path
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown error occurred" 
      },
      { status: 500 }
    );
  }
}
