import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Scale, 
  FileText, 
  Users,
  ArrowRight,
  ExternalLink,
  BookOpen
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Ёс зүйн дэд хороо | Худалдан авах ажиллагааны газар",
  description: "Ёс зүйн дэд хорооны мэдээлэл",
};

export const revalidate = 60;

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
}

const ethicsSections = [
  {
    type: "ethics-intro",
    title: "Танилцуулга",
    icon: Scale,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    type: "ethics-activity",
    title: "Үйл ажиллагаа",
    icon: FileText,
    color: "from-violet-500 to-violet-600",
    bgColor: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    type: "ethics-members",
    title: "Бүрэлдэхүүн",
    icon: Users,
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-100",
    iconColor: "text-rose-600",
  },
];

const externalLinks = [
  {
    title: "Хууль, Журам",
    href: "https://ec.gov.mn/law",
    icon: BookOpen,
  },
  {
    title: "Ажиллах Журам",
    href: "https://ec.gov.mn/shiidver",
    icon: FileText,
  },
];

export default async function EthicsPage() {
  const supabase = createSupabaseServerClient();

  // Fetch static contents for Ethics
  const { data: staticContents } = await supabase
    .from('static_contents')
    .select('*')
    .in('type', ethicsSections.map(s => s.type))
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
          <Link href="/" className="hover:text-indigo-600 transition-colors">Нүүр</Link>
          <span>/</span>
          <Link href="/activities/transparency" className="hover:text-indigo-600 transition-colors">Ил тод байдал</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Ёс зүйн дэд хороо</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ёс зүйн дэд хороо
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Байгууллагын ёс зүйн дэд хорооны үйл ажиллагаа, бүрэлдэхүүн, 
            хууль журмын мэдээлэл
          </p>
        </div>

        {/* External Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {externalLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 hover:border-indigo-300 transition-colors group"
              >
                <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{link.title}</p>
                  <p className="text-sm text-gray-500">Гадаад холбоос</p>
                </div>
                <ExternalLink className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
              </a>
            );
          })}
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {ethicsSections.map((section) => {
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
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Scale className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Ёс зүйн дэд хорооны мэдээлэл</h3>
                  <p className="text-sm text-gray-600">
                    Байгууллагын ёс зүйн ил тод байдал
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://ec.gov.mn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ёс зүйн хороо
                </a>
                <Link
                  href="/activities/transparency"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium border border-indigo-200"
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
            Мэдээлэл авах болон санал хүсэлт илгээхийг хүсвэл{" "}
            <Link href="/contact" className="text-indigo-600 hover:underline font-medium">
              холбоо барих
            </Link>{" "}
            хуудсаар хандана уу.
          </p>
        </div>
      </div>
    </Container>
  );
}
