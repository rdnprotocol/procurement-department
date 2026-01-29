import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  ClipboardList, 
  BarChart3,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Хүний нөөц | Худалдан авах ажиллагааны газар",
  description: "Хүний нөөцийн ил тод байдлын мэдээлэл",
};

export const revalidate = 60;

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
}

const hrSections = [
  {
    type: "hr-intro",
    title: "Танилцуулга",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    type: "hr-plan",
    title: "Төлөвлөгөө",
    icon: ClipboardList,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    type: "hr-report",
    title: "Тайлан",
    icon: FileText,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    type: "hr-stats",
    title: "Статистик мэдээ",
    icon: BarChart3,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

export default async function HRPage() {
  const supabase = createSupabaseServerClient();

  // Fetch static contents for HR
  const { data: staticContents } = await supabase
    .from('static_contents')
    .select('*')
    .in('type', hrSections.map(s => s.type))
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
          <Link href="/" className="hover:text-blue-600 transition-colors">Нүүр</Link>
          <span>/</span>
          <Link href="/activities/transparency" className="hover:text-blue-600 transition-colors">Ил тод байдал</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Хүний нөөц</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Хүний нөөц
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Байгууллагын хүний нөөцийн ил тод байдлыг хангах хүрээнд 
            нийтэлж буй мэдээ, мэдээлэл, тайлан
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {hrSections.map((section) => {
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
                      dangerouslySetInnerHTML={{ __html: content!.content }}
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
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Хүний нөөцийн мэдээлэл</h3>
                  <p className="text-sm text-gray-600">
                    Байгууллагын хүний нөөцийн ил тод байдал
                  </p>
                </div>
              </div>
              <Link
                href="/activities/transparency"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
            <Link href="/contact" className="text-blue-600 hover:underline font-medium">
              холбоо барих
            </Link>{" "}
            хуудсаар хандана уу.
          </p>
        </div>
      </div>
    </Container>
  );
}
