import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  FileText, 
  ArrowRight,
  CheckCircle2,
  Clock
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Өргөдөл, гомдлын шийдвэрлэлт | Худалдан авах ажиллагааны газар",
  description: "Өргөдөл, гомдлын шийдвэрлэлтийн тайлан",
};

export const revalidate = 60;

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
}

const complaintsSections = [
  {
    type: "complaints-intro",
    title: "Танилцуулга",
    icon: MessageSquare,
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    type: "complaints-report",
    title: "Шийдвэрлэлтийн тайлан",
    icon: FileText,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
];

export default async function ComplaintsPage() {
  const supabase = createSupabaseServerClient();

  // Fetch static contents for Complaints
  const { data: staticContents } = await supabase
    .from('static_contents')
    .select('*')
    .in('type', complaintsSections.map(s => s.type))
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
          <Link href="/" className="hover:text-teal-600 transition-colors">Нүүр</Link>
          <span>/</span>
          <Link href="/activities/transparency" className="hover:text-teal-600 transition-colors">Ил тод байдал</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Өргөдөл, гомдлын шийдвэрлэлт</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Өргөдөл, гомдлын шийдвэрлэлт
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Иргэд, байгууллагаас ирүүлсэн өргөдөл, гомдлын шийдвэрлэлтийн 
            мэдээлэл, тайлан
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl mb-3">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">—</div>
              <p className="text-sm text-gray-500 mt-1">Нийт өргөдөл</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <p className="text-sm text-gray-500 mt-1">Шийдвэрлэлтийн хувь</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">30</div>
              <p className="text-sm text-gray-500 mt-1">Дундаж хоног</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {complaintsSections.map((section) => {
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
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100/50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-100 rounded-xl">
                  <MessageSquare className="w-8 h-8 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Өргөдөл, гомдол илгээх</h3>
                  <p className="text-sm text-gray-600">
                    Та санал хүсэлт, өргөдөл гомдол илгээх бол холбоо барих хуудас руу очно уу
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  Холбоо барих
                </Link>
                <Link
                  href="/activities/transparency"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-teal-600 rounded-lg hover:bg-teal-50 transition-colors text-sm font-medium border border-teal-200"
                >
                  <ArrowRight className="w-4 h-4" />
                  Ил тод байдал
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Өргөдөл, гомдлыг хуулийн хугацаанд шийдвэрлэж хариу өгөхийг анхаарна уу.{" "}
            <Link href="/contact" className="text-teal-600 hover:underline font-medium">
              Холбоо барих
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}
