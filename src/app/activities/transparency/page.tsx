import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Eye, 
  FileText, 
  ClipboardList, 
  BarChart3, 
  MessageSquare,
  Calendar,
  ArrowRight,
  ExternalLink,
  Users,
  Target,
  Shield,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Ил тод байдал | Худалдан авах ажиллагааны газар",
  description: "Байгууллагын ил тод байдлын мэдээлэл",
};

export const revalidate = 60;

// Ил тод байдлын хуудсуудын тохиргоо
const transparencyPages = [
  {
    id: "policy",
    title: "Бодлогын баримт бичиг",
    description: "Хууль тогтоомж, дүрэм журам, бодлогын баримт бичгүүд",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    href: "/activities/transparency/policy",
    staticTypes: ['policy-intro', 'policy-documents', 'policy-rules'],
  },
  {
    id: "strategy",
    title: "Стратеги төлөвлөгөө",
    description: "Байгууллагын стратеги төлөвлөгөө, зорилтууд",
    icon: Target,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    href: "/activities/transparency/strategy",
    staticTypes: ['strategy-intro', 'strategy-goals', 'strategy-plan'],
  },
  {
    id: "plan",
    title: "Төлөвлөгөө, тайлан",
    description: "Жилийн төлөвлөгөө, гүйцэтгэлийн тайлан",
    icon: ClipboardList,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    href: "/activities/transparency/plan",
    staticTypes: ['plan-intro', 'plan-annual', 'plan-report'],
  },
  {
    id: "statistics",
    title: "Статистик мэдээ",
    description: "Худалдан авах ажиллагааны статистик мэдээлэл",
    icon: BarChart3,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    href: "/activities/transparency/statistics",
    staticTypes: ['stats-intro', 'stats-procurement', 'stats-annual'],
  },
  {
    id: "complaints",
    title: "Өргөдөл, гомдлын шийдвэрлэлт",
    description: "Иргэд, байгууллагаас ирсэн өргөдөл, гомдлын шийдвэрлэлт",
    icon: MessageSquare,
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
    href: "/activities/transparency/complaints",
    staticTypes: ['complaints-intro', 'complaints-report'],
  },
  {
    id: "meetings",
    title: "Иргэд хүлээн авах уулзалт",
    description: "Иргэдийг хүлээн авах цагийн хуваарь",
    icon: Calendar,
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-100",
    iconColor: "text-rose-600",
    href: "/activities/transparency/meetings",
    staticTypes: ['meetings-intro', 'meetings-schedule'],
  },
  {
    id: "hr",
    title: "Хүний нөөц",
    description: "Хүний нөөцийн мэдээлэл, төлөвлөгөө, тайлан",
    icon: Users,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
    href: "/activities/transparency/hr",
    staticTypes: ['hr-intro', 'hr-plan', 'hr-report', 'hr-stats'],
  },
  {
    id: "monitoring",
    title: "Хяналт шалгалт",
    description: "Дотоод болон гадаад хяналт шалгалтын мэдээлэл",
    icon: CheckCircle,
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
    href: "/activities/monitoring",
    staticTypes: ['monitoring-intro', 'monitoring-internal', 'monitoring-government', 'monitoring-client'],
  },
  {
    id: "ethics",
    title: "Ёс зүйн дэд хороо",
    description: "Ёс зүйн дэд хорооны үйл ажиллагаа",
    icon: Shield,
    color: "from-violet-500 to-violet-600",
    bgColor: "bg-violet-100",
    iconColor: "text-violet-600",
    href: "/activities/ethics",
    staticTypes: ['ethics-intro', 'ethics-activity', 'ethics-members'],
  },
];

export default async function TransparencyPage() {
  const supabase = createSupabaseServerClient();

  // Fetch all static contents for transparency pages
  const allStaticTypes = transparencyPages.flatMap(p => p.staticTypes);
  const { data: staticContents } = await supabase
    .from('static_contents')
    .select('*')
    .in('type', allStaticTypes);

  // Check if page has content
  const hasContent = (staticTypes: string[]): boolean => {
    if (!staticContents) return false;
    return staticTypes.some(type => {
      const content = staticContents.find(c => c.type === type);
      return content && content.content;
    });
  };

  // Get content count for page
  const getContentCount = (staticTypes: string[]): number => {
    if (!staticContents) return 0;
    return staticTypes.filter(type => {
      const content = staticContents.find(c => c.type === type);
      return content && content.content;
    }).length;
  };

  // Total content count
  const totalContents = staticContents?.filter(c => c.content).length || 0;

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Нүүр</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Ил тод байдал</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Eye className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ил тод байдал
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Байгууллагын үйл ажиллагааны ил тод байдлыг хангах хүрээнд 
            нийтэлж буй мэдээ, мэдээлэл, тайлан
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 md:grid-cols-9 gap-3 mb-12">
          {transparencyPages.map((page) => {
            const Icon = page.icon;
            const count = getContentCount(page.staticTypes);
            const hasData = hasContent(page.staticTypes);
            
            return (
              <Link
                key={page.id}
                href={page.href}
                className={`p-3 rounded-xl text-center transition-all hover:shadow-lg ${
                  hasData ? 'bg-white shadow-md' : 'bg-gray-50'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 ${page.bgColor} rounded-lg mb-2`}>
                  <Icon className={`w-5 h-5 ${page.iconColor}`} />
                </div>
                <div className={`text-xl font-bold ${hasData ? 'text-gray-900' : 'text-gray-400'}`}>
                  {count}/{page.staticTypes.length}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transparencyPages.map((page) => {
            const Icon = page.icon;
            const hasData = hasContent(page.staticTypes);
            const contentCount = getContentCount(page.staticTypes);

            return (
              <Link
                key={page.id}
                href={page.href}
                className="group"
              >
                <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-all flex flex-col rounded-xl !p-0 !gap-0 h-full">
                  <CardHeader className={`bg-gradient-to-r ${page.color} text-white p-5 !m-0 rounded-t-xl !gap-0`}>
                    <CardTitle className="text-lg font-semibold flex items-center gap-3">
                      <Icon className="w-6 h-6 flex-shrink-0" />
                      <span>{page.title}</span>
                    </CardTitle>
                    <p className="text-white/90 text-sm mt-3 leading-relaxed">
                      {page.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 flex flex-col justify-between">
                    {hasData ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm text-gray-700">Бүртгэсэн мэдээлэл</span>
                          <span className="font-semibold text-green-600">{contentCount}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Нийт {page.staticTypes.length} хэсэг
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Icon className={`w-10 h-10 ${page.iconColor} opacity-30 mx-auto mb-2`} />
                        <p className="text-sm text-gray-500">Мэдээлэл оруулаагүй байна</p>
                      </div>
                    )}
                    
                    <div className={`flex items-center justify-center gap-2 mt-4 p-3 rounded-lg transition-colors ${
                      hasData 
                        ? 'bg-gray-50 text-gray-700 group-hover:bg-indigo-50 group-hover:text-indigo-600' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
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
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Eye className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Ил тод байдлын тухай</h3>
                  <p className="text-sm text-gray-600">
                    Нийт {totalContents} мэдээлэл байршуулсан байна
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://www.shilendans.gov.mn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Шилэн данс
                </a>
                <a
                  href="https://www.info.mn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium border border-indigo-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  Мэдээллийн ил тод байдал
                </a>
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
