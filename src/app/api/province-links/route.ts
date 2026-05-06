import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import { PROVINCES } from "@/utils/provinces";

// HTML entity decode (хамгийн түгээмэл entity-уудыг буцаах)
function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// HTML контентоос эхний URL-ийг таних (admin-д URL хоосон үед автоматаар ашиглах)
function extractFirstUrl(html: string | null | undefined): string | null {
  if (!html) return null;
  // 1. <a href="https://..."> хайх
  const anchorMatch = html.match(/<a[^>]+href=["'](https?:\/\/[^"']+)["']/i);
  if (anchorMatch) return decodeHtmlEntities(anchorMatch[1]);
  // 2. plain text-аас https:// эсвэл http:// хайх (HTML тагаас гадуурх)
  const stripped = html.replace(/<[^>]+>/g, " ");
  const plainMatch = stripped.match(/https?:\/\/[^\s<>"']+/);
  if (plainMatch) return decodeHtmlEntities(plainMatch[0]);
  return null;
}

interface ProvinceLinkRow {
  slug: string;
  title: string;
  plans_url: string | null;
  tender_url: string | null;
  plans_label: string | null;
  tender_label: string | null;
  sort_order: number;
}

function defaultRow(slug: string, title: string, idx: number): ProvinceLinkRow {
  return {
    slug,
    title,
    plans_url: null,
    tender_url: null,
    plans_label: "Төлөвлөгөө",
    tender_label: "Тендер шалгаруулалт",
    sort_order: idx + 1,
  };
}

// static_contents-аас URL-уудыг автоматаар таниулж бөглөх
async function enrichWithStaticContent(
  rows: ProvinceLinkRow[]
): Promise<ProvinceLinkRow[]> {
  // зөвхөн URL хоосон сумдын төрлүүдийг шалгах хэрэгтэй
  const slugsNeeded = rows
    .filter((r) => !r.plans_url || !r.tender_url)
    .map((r) => r.slug);

  if (slugsNeeded.length === 0) return rows;

  const types: string[] = [];
  for (const slug of slugsNeeded) {
    types.push(`province-${slug}-plans`);
    types.push(`province-${slug}-tender`);
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data: contents, error } = await supabase
      .from("static_contents")
      .select("type, content")
      .in("type", types);

    if (error || !contents) return rows;

    const contentMap = new Map<string, string>();
    for (const c of contents) {
      contentMap.set(c.type, c.content || "");
    }

    return rows.map((r) => {
      const next = { ...r };
      if (!next.plans_url) {
        const html = contentMap.get(`province-${r.slug}-plans`);
        const url = extractFirstUrl(html);
        if (url) next.plans_url = url;
      }
      if (!next.tender_url) {
        const html = contentMap.get(`province-${r.slug}-tender`);
        const url = extractFirstUrl(html);
        if (url) next.tender_url = url;
      }
      return next;
    });
  } catch (e) {
    console.error("Error enriching with static content:", e);
    return rows;
  }
}

// Хүснэгт байхгүй эсвэл бичлэг дутуу үед үндсэн өгөгдөл буцаах
function buildFallback(): ProvinceLinkRow[] {
  return PROVINCES.map((p, idx) => defaultRow(p.slug, p.title, idx));
}

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("province_links")
      .select("*")
      .order("sort_order", { ascending: true });

    let rows: ProvinceLinkRow[];

    if (error || !data || data.length === 0) {
      console.error("province_links unavailable, using fallback:", error);
      rows = buildFallback();
    } else {
      const map = new Map(data.map((d: ProvinceLinkRow) => [d.slug, d]));
      rows = PROVINCES.map((p, idx) => {
        const existing = map.get(p.slug);
        if (existing) return existing as ProvinceLinkRow;
        return defaultRow(p.slug, p.title, idx);
      });
    }

    // Хоосон URL-ыг static_contents-ээс автоматаар бөглөх
    const enriched = await enrichWithStaticContent(rows);
    return NextResponse.json(enriched);
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
