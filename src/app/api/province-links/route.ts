import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import { PROVINCES } from "@/utils/provinces";

// Хүснэгт байхгүй эсвэл бичлэг дутуу үед үндсэн өгөгдөл буцаах
function buildFallback() {
  return PROVINCES.map((p, idx) => ({
    slug: p.slug,
    title: p.title,
    plans_url: null as string | null,
    tender_url: null as string | null,
    plans_label: "Төлөвлөгөө",
    tender_label: "Тендер шалгаруулалт",
    sort_order: idx + 1,
  }));
}

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("province_links")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching province links:", error);
      return NextResponse.json(buildFallback());
    }

    if (!data || data.length === 0) {
      return NextResponse.json(buildFallback());
    }

    // DB-д байгаа болон fallback-аас цогц жагсаалт буцаах
    const map = new Map(data.map((d) => [d.slug, d]));
    const merged = PROVINCES.map((p, idx) => {
      const existing = map.get(p.slug);
      if (existing) return existing;
      return {
        slug: p.slug,
        title: p.title,
        plans_url: null,
        tender_url: null,
        plans_label: "Төлөвлөгөө",
        tender_label: "Тендер шалгаруулалт",
        sort_order: idx + 1,
      };
    });
    return NextResponse.json(merged);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(buildFallback());
  }
}

// Олон сумыг нэг дор шинэчлэх (admin-аас bulk update хийхэд тохиромжтой)
export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Body нь массив байх ёстой" },
        { status: 400 }
      );
    }

    const rows = body
      .filter((r) => r && typeof r.slug === "string")
      .map((r) => ({
        slug: r.slug,
        title: r.title || r.slug,
        plans_url: r.plans_url || null,
        tender_url: r.tender_url || null,
        plans_label: r.plans_label || "Төлөвлөгөө",
        tender_label: r.tender_label || "Тендер шалгаруулалт",
        sort_order: r.sort_order ?? 0,
      }));

    const { data, error } = await supabase
      .from("province_links")
      .upsert(rows, { onConflict: "slug" })
      .select();

    if (error) {
      console.error("Error updating province links:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Сумдын линкүүд амжилттай шинэчлэгдлээ",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
