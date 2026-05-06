import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_CONTACT_INFO = {
  id: 1,
  hero_title: "Холбоо барих",
  hero_subtitle:
    "Худалдан авах ажиллагаатай холбоотой санал, хүсэлт, гомдлоо бидэнтэй хуваалцана уу",
  address_main: "Төв аймаг, Зуунмод сум, 6-р баг",
  address_secondary: "Төр захиргааны 2-р байр",
  map_url: "https://maps.app.goo.gl/9BbHsXsCJ1e4ehv3A",
  map_embed_url:
    "https://www.google.com/maps?q=Zuunmod,Tov+Aimag,Mongolia&hl=mn&z=14&output=embed",
  phone: "+976 7755-3579",
  email: "tuvprocurement@tov.gov.mn",
  website: "ub-procurement.mn",
  website_url: "https://ub-procurement.mn",
  facebook_url: "#",
  facebook_label: "Төв аймгийн Худалдан авах ажиллагааны газар",
  meeting_hours: "Мягмар, Баасан 15:00 - 17:00",
  director_organization: "Төв аймгийн Худалдан авах ажиллагааны газар",
  director_department: "Захиргаа, санхүүгийн хэлтэс",
  director_position: "Уг тагч, зохион байгуулагч",
  director_person: "",
  director_room: "716 тоот өрөө",
  director_phone: "7755-3579",
};

const ALLOWED_FIELDS = Object.keys(DEFAULT_CONTACT_INFO).filter(
  (k) => k !== "id"
);

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching contact info:", error);
      // Хүснэгт байхгүй эсвэл алдаатай үед default утга буцаах
      return NextResponse.json(DEFAULT_CONTACT_INFO);
    }

    if (!data) {
      return NextResponse.json(DEFAULT_CONTACT_INFO);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(DEFAULT_CONTACT_INFO);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const body = await request.json();

    // Зөвшөөрөгдсөн талбаруудаас сонгох
    const updateData: Record<string, string> = {};
    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Шинэчлэх талбар байхгүй байна" },
        { status: 400 }
      );
    }

    // Upsert ажиллуулах (мөр байхгүй бол шинээр үүсгэх)
    const { data, error } = await supabase
      .from("contact_info")
      .upsert({ id: 1, ...updateData }, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Error updating contact info:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Холбоо барих мэдээлэл амжилттай шинэчлэгдлээ",
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
