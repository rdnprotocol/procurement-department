import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { enhanceHtmlForInlinePdfEmbeds } from "@/utils/enhanceHtml";

export const metadata = {
  title: "Статистик мэдээ | Худалдан авах ажиллагааны газар",
  description: "Худалдан авалтын статистик мэдээлэл",
};

export const revalidate = 60;

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
}

const statsSections = [
  {
    type: "stats-intro",
    title: "Танилцуулга",
    icon: BarChart3,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    type: "stats-procurement",
    title: "Худалдан авалтын статистик",
    icon: PieChart,
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    type: "stats-annual",
    title: "Жилийн статистик",
    icon: TrendingUp,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
];

export default async function StatisticsPage() {
  const supabase = createSupabaseServerClient();

  const { data: staticContents } = await supabase
    .from('static_contents')
    .select('*')
    .in('type', statsSections.map(s => s.type))
    .order('type');

  const getContentByType = (type: string): StaticContent | undefined => {
    return (staticContents || []).find(c => c.type === type);
  };

  const hasContent = (type: string): boolean => {
    const content = getContentByType(type);
    return !!content && !!content.content;
  };

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-orange-600 transition-colors">Нүүр</Link>
          <span>/</span>
          <Link href="/activities/transparency" className="hover:text-orange-600 transition-colors">Ил тод байдал</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Статистик мэдээ</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Статистик мэдээ
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Худалдан авах ажиллагааны статистик мэдээлэл, 
            тоон үзүүлэлт, дүн шинжилгээ
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {statsSections.map((section) => {
            const Icon = section.icon;
            const content = getContentByType(section.type);
            const hasData = hasContent(section.type);

            return (
              <Card key={section.type} className="border-0 shadow-lg overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${section.color} text-white p-5`}>
                  <CardTitle className="text-lg font-semibold flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    {content?.title || section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {hasData ? (
                    <div 
                      className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
                      dangerouslySetInnerHTML={{ __html: enhanceHtmlForInlinePdfEmbeds(content!.content) }}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <Icon className={`w-12 h-12 ${section.iconColor} opacity-30 mx-auto mb-3`} />
                      <p className="text-gray-500">Мэдээлэл оруулаагүй байна</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Админ хэсгээс мэдээлэл оруулна уу
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Card */}
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Статистик мэдээ</h3>
                  <p className="text-sm text-gray-600">
                    Худалдан авах ажиллагааны тоон мэдээлэл
                  </p>
                </div>
              </div>
              <Link
                href="/activities/transparency"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                <ArrowRight className="w-4 h-4" />
                Ил тод байдал руу буцах
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Мэдээлэл авах болон санал хүсэлт илгээхийг хүсвэл{" "}
            <Link href="/contact" className="text-orange-600 hover:underline font-medium">
              холбоо барих
            </Link>{" "}
            хуудсаар хандана уу.
          </p>
        </div>
      </div>
    </Container>
  );
}
