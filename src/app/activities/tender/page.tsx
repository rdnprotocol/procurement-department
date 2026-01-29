import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClipboardList,
  BadgeCheck,
  Lightbulb,
  ExternalLink,
  ArrowRight,
  FileText,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Тендер | Худалдан авах ажиллагааны газар",
  description: "Тендерийн мэдээлэл, төлөвлөгөө тайлан, зөвлөмж, A3 хүний нөөц",
};

export const revalidate = 60;

const tenderPages = [
  {
    id: "plan",
    title: "Төлөвлөгөө, тайлан",
    description: "Тендертэй холбоотой төлөвлөгөө, тайлан, мэдээлэл",
    icon: ClipboardList,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
    href: "/activities/tender/plan",
    staticTypes: ["tender-plan"],
  },
  {
    id: "a3",
    title: "A3 гэрчилгээтэй хүний нөөц",
    description: "A3 гэрчилгээтэй мэргэжилтнүүдийн мэдээлэл",
    icon: BadgeCheck,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    href: "/activities/tender/a3",
    staticTypes: ["tender-a3"],
  },
  {
    id: "zovlomj",
    title: "Захиалагчдад зөвлөмж",
    description: "Захиалагчдад зориулсан зөвлөмж, гарын авлага",
    icon: Lightbulb,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
    href: "/activities/tender/zovlomj",
    staticTypes: ["tender-zovlomj"],
  },
];

const externalLinks = [
  { title: "Тендерийн урилга", href: "https://www.tender.gov.mn/mn/invitation" },
  { title: "Тендер шалгаруулалтын үр дүн", href: "https://user.tender.gov.mn/mn/result/" },
  { title: "Цахим дэлгүүр", href: "https://www.tender.gov.mn/mn/eshop" },
];

export default async function TenderPage() {
  const supabase = createSupabaseServerClient();

  const allStaticTypes = tenderPages.flatMap((p) => p.staticTypes);
  const { data: staticContents } = await supabase
    .from("static_contents")
    .select("*")
    .in("type", allStaticTypes);

  const hasContent = (staticTypes: string[]): boolean => {
    if (!staticContents) return false;
    return staticTypes.some((type) => {
      const c = staticContents.find((x) => x.type === type);
      return c && c.content;
    });
  };

  const totalContents = staticContents?.filter((c) => c.content).length || 0;

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            Нүүр
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Тендер</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Тендер</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Тендерийн мэдээлэл, төлөвлөгөө тайлан, зөвлөмж болон холбогдох холбоосууд
          </p>
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenderPages.map((page) => {
            const Icon = page.icon;
            const hasData = hasContent(page.staticTypes);
            return (
              <Link key={page.id} href={page.href} className="group">
                <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-all flex flex-col rounded-xl !p-0 !gap-0 h-full">
                  <CardHeader className={`bg-gradient-to-r ${page.color} text-white p-5 !m-0 rounded-t-xl !gap-0`}>
                    <CardTitle className="text-lg font-semibold flex items-center gap-3">
                      <Icon className="w-6 h-6 flex-shrink-0" />
                      <span>{page.title}</span>
                    </CardTitle>
                    <p className="text-white/90 text-sm mt-3 leading-relaxed">{page.description}</p>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 flex flex-col justify-between">
                    {hasData ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm text-gray-700">Мэдээлэл байршуулсан</span>
                        <span className="font-semibold text-green-600">✓</span>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Icon className={`w-10 h-10 ${page.iconColor} opacity-30 mx-auto mb-2`} />
                        <p className="text-sm text-gray-500">Мэдээлэл оруулаагүй байна</p>
                      </div>
                    )}

                    <div
                      className={`flex items-center justify-center gap-2 mt-4 p-3 rounded-lg transition-colors ${
                        hasData
                          ? "bg-gray-50 text-gray-700 group-hover:bg-orange-50 group-hover:text-orange-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span className="text-sm font-medium">Дэлгэрэнгүй</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* External Links */}
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <ExternalLink className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Гадаад холбоосууд</h3>
                  <p className="text-sm text-gray-600">Нийт {totalContents} мэдээлэл байршуулсан байна</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {externalLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium border border-orange-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {l.title}
                  </a>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

