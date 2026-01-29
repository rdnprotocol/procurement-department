import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { enhanceHtmlForInlinePdfEmbeds } from "@/utils/enhanceHtml";

export const metadata = {
  title: "A3 гэрчилгээтэй хүний нөөц | Тендер",
  description: "A3 гэрчилгээтэй хүний нөөцийн мэдээлэл",
};

export const revalidate = 60;

export default async function TenderA3Page() {
  const supabase = createSupabaseServerClient();

  const { data } = await supabase
    .from("static_contents")
    .select("*")
    .eq("type", "tender-a3")
    .maybeSingle();

  const hasData = !!data?.content;

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            Нүүр
          </Link>
          <span>/</span>
          <Link href="/activities/tender" className="hover:text-orange-600 transition-colors">
            Тендер
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">A3 гэрчилгээтэй хүний нөөц</span>
        </nav>

        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5">
            <CardTitle className="text-lg font-semibold flex items-center gap-3">
              <BadgeCheck className="w-6 h-6" />
              {data?.title || "A3 гэрчилгээтэй хүний нөөц"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {hasData ? (
              <div
                className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
                dangerouslySetInnerHTML={{ __html: enhanceHtmlForInlinePdfEmbeds(data!.content) }}
              />
            ) : (
              <div className="text-center py-10">
                <BadgeCheck className="w-12 h-12 text-orange-600 opacity-30 mx-auto mb-3" />
                <p className="text-gray-500">Мэдээлэл оруулаагүй байна</p>
                <p className="text-sm text-gray-400 mt-1">Админ хэсгээс мэдээлэл оруулна уу</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link
            href="/activities/tender"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
          >
            <ArrowRight className="w-4 h-4" />
            Тендер рүү буцах
          </Link>
        </div>
      </div>
    </Container>
  );
}

