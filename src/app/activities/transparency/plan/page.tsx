import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  Calendar, 
  FileCheck,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { enhanceHtmlForInlinePdfEmbeds } from "@/utils/enhanceHtml";

export const metadata = {
  title: "Төлөвлөгөө, тайлан | Худалдан авах ажиллагааны газар",
  description: "Байгууллагын төлөвлөгөө, тайлангийн мэдээлэл",
};

export const revalidate = 60;

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
}

const planSections = [
  {
    type: "plan-intro",
    title: "Танилцуулга",
    icon: ClipboardList,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    type: "plan-annual",
    title: "Жилийн төлөвлөгөө",
    icon: Calendar,
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    type: "plan-report",
    title: "Гүйцэтгэлийн тайлан",
    icon: FileCheck,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export default async function PlanPage() {
  const supabase = createSupabaseServerClient();

  const { data: staticContents } = await supabase
    .from('static_contents')
    .select('*')
    .in('type', planSections.map(s => s.type))
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
          <Link href="/" className="hover:text-green-600 transition-colors">Нүүр</Link>
          <span>/</span>
          <Link href="/activities/transparency" className="hover:text-green-600 transition-colors">Ил тод байдал</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Төлөвлөгөө, тайлан</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 shadow-lg">
            <ClipboardList className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Төлөвлөгөө, тайлан
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Байгууллагын жилийн ажлын төлөвлөгөө болон 
            гүйцэтгэлийн тайлангийн ил тод байдал
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {planSections.map((section) => {
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
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <ClipboardList className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Төлөвлөгөө, тайлан</h3>
                  <p className="text-sm text-gray-600">
                    Байгууллагын ажлын төлөвлөгөө, гүйцэтгэл
                  </p>
                </div>
              </div>
              <Link
                href="/activities/transparency"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
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
            <Link href="/contact" className="text-green-600 hover:underline font-medium">
              холбоо барих
            </Link>{" "}
            хуудсаар хандана уу.
          </p>
        </div>
      </div>
    </Container>
  );
}
