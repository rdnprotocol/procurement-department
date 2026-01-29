import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ClipboardList, Gavel, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { enhanceHtmlForInlinePdfEmbeds } from "@/utils/enhanceHtml";
import { getProvinceBySlug } from "@/utils/provinces";

export const revalidate = 60;

export default async function ProvincePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const province = getProvinceBySlug(slug);
  if (!province) notFound();

  const supabase = createSupabaseServerClient();

  const plansType = `province-${slug}-plans`;
  const tenderType = `province-${slug}-tender`;

  const { data: staticContents } = await supabase
    .from("static_contents")
    .select("*")
    .in("type", [plansType, tenderType]);

  const getContent = (type: string) =>
    (staticContents || []).find((c) => c.type === type);

  const plans = getContent(plansType);
  const tender = getContent(tenderType);

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Нүүр
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Сумд</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{province.title}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {province.title} сум
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Төлөвлөгөө болон тендер шалгаруулалтын мэдээлэл
          </p>
        </div>

        <div className="space-y-8">
          {/* Plans */}
          <Card id="plans" className="border-0 shadow-lg overflow-hidden scroll-mt-24">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-5">
              <CardTitle className="text-lg font-semibold flex items-center gap-3">
                <ClipboardList className="w-6 h-6" />
                {plans?.title || "Төлөвлөгөө"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {plans?.content ? (
                <div
                  className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: enhanceHtmlForInlinePdfEmbeds(plans.content),
                  }}
                />
              ) : (
                <div className="text-center py-10">
                  <ClipboardList className="w-12 h-12 text-emerald-600 opacity-30 mx-auto mb-3" />
                  <p className="text-gray-500">Мэдээлэл оруулаагүй байна</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Админ хэсгээс мэдээлэл оруулна уу
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tender result */}
          <Card id="tender-result" className="border-0 shadow-lg overflow-hidden scroll-mt-24">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5">
              <CardTitle className="text-lg font-semibold flex items-center gap-3">
                <Gavel className="w-6 h-6" />
                {tender?.title || "Тендер шалгаруулалт"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {tender?.content ? (
                <div
                  className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: enhanceHtmlForInlinePdfEmbeds(tender.content),
                  }}
                />
              ) : (
                <div className="text-center py-10">
                  <FileText className="w-12 h-12 text-orange-600 opacity-30 mx-auto mb-3" />
                  <p className="text-gray-500">Мэдээлэл оруулаагүй байна</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Админ хэсгээс мэдээлэл оруулна уу
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <ArrowRight className="w-4 h-4" />
            Нүүр хуудас руу
          </Link>
        </div>
      </div>
    </Container>
  );
}

