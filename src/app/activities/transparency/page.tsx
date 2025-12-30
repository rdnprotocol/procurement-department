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
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Үйл ажиллагааны ил тод байдал | Худалдан авах ажиллагааны газар",
  description: "Байгууллагын үйл ажиллагааны ил тод байдлын мэдээлэл",
};

export const revalidate = 60;

interface ContentItem {
  id: number;
  title: string;
  created_date: string;
  category_id: number;
}

const transparencyCategories = [
  {
    id: "policy",
    title: "Бодлогын баримт бичиг, хууль тогтоомж",
    description: "Байгууллагын бодлого, дүрэм журам, хууль тогтоомжууд",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    categoryId: 10, // strateg-tolovlogoo-tailan
    href: "/category/strateg-tolovlogoo-tailan",
  },
  {
    id: "strategy",
    title: "Стратеги төлөвлөгөө",
    description: "Байгууллагын стратеги төлөвлөгөө, зорилтууд",
    icon: ClipboardList,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    categoryId: 6, // strateg-tolovlogoo
    href: "/category/strateg-tolovlogoo",
  },
  {
    id: "plan",
    title: "Төлөвлөгөө, тайлан",
    description: "Жилийн төлөвлөгөө, гүйцэтгэлийн тайлан",
    icon: BarChart3,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    categoryId: 7, // tolovlogoo-tailan
    href: "/category/tolovlogoo-tailan",
  },
  {
    id: "statistics",
    title: "Худалдан авалтын статистик мэдээ",
    description: "Худалдан авах ажиллагааны статистик мэдээлэл",
    icon: BarChart3,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    categoryId: 11, // statistic
    href: "/category/statistic",
  },
  {
    id: "complaints",
    title: "Өргөдөл, гомдлын шийдвэрлэлт тайлан",
    description: "Иргэд, байгууллагаас ирсэн өргөдөл, гомдлын шийдвэрлэлт",
    icon: MessageSquare,
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
    categoryId: 14, // complaints
    href: "/category/complaints",
  },
  {
    id: "meetings",
    title: "Иргэд хүлээн авах уулзалтын хуваарь",
    description: "Иргэдийг хүлээн авах цагийн хуваарь",
    icon: Calendar,
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-100",
    iconColor: "text-rose-600",
    categoryId: 15, // citizen-meetings
    href: "/category/citizen-meetings",
  },
];

export default async function TransparencyPage() {
  const supabase = createSupabaseServerClient();

  // Fetch contents for all categories
  const categoryIds = transparencyCategories.map(c => c.categoryId);
  const { data: contents } = await supabase
    .from('contents')
    .select('*')
    .in('category_id', categoryIds)
    .order('created_date', { ascending: false });

  // Group contents by category
  const contentsByCategory = transparencyCategories.reduce((acc, cat) => {
    acc[cat.id] = (contents || []).filter(c => c.category_id === cat.categoryId);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  // Calculate total contents
  const totalContents = Object.values(contentsByCategory).reduce(
    (sum, items) => sum + items.length, 
    0
  );

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-purple-600 transition-colors">Нүүр</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Үйл ажиллагааны ил тод байдал</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Eye className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Үйл ажиллагааны ил тод байдал
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Байгууллагын үйл ажиллагааны ил тод байдлыг хангах хүрээнд 
            нийтэлж буй мэдээ, мэдээлэл, тайлан
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {transparencyCategories.map((category) => {
            const Icon = category.icon;
            const count = contentsByCategory[category.id]?.length || 0;
            
            return (
              <Card key={category.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-4 pb-3 text-center">
                  <div className={`inline-flex items-center justify-center w-10 h-10 ${category.bgColor} rounded-lg mb-2`}>
                    <Icon className={`w-5 h-5 ${category.iconColor}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{category.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transparencyCategories.map((category) => {
            const Icon = category.icon;
            const categoryContents = contentsByCategory[category.id] || [];

            return (
              <Card key={category.id} className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col rounded-xl !p-0 !gap-0">
                <CardHeader className={`bg-gradient-to-r ${category.color} text-white p-5 !m-0 rounded-t-xl !gap-0`}>
                  <CardTitle className="text-lg font-semibold flex items-center gap-3">
                    <Icon className="w-6 h-6 flex-shrink-0" />
                    <span>{category.title}</span>
                  </CardTitle>
                  <p className="text-white/90 text-sm mt-3 leading-relaxed">
                    {category.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col">
                  {categoryContents.length > 0 ? (
                    <div className="space-y-2 flex-1">
                      {categoryContents.slice(0, 3).map((content) => (
                        <Link
                          key={content.id}
                          href={`/news/${content.id}`}
                          className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                        >
                          <FileText className={`w-4 h-4 ${category.iconColor} mt-0.5 flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                              {content.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(content.created_date).toLocaleDateString('mn-MN')}
                            </p>
                          </div>
                        </Link>
                      ))}
                      
                      {categoryContents.length > 3 && (
                        <Link
                          href={category.href}
                          className={`flex items-center justify-center gap-2 p-2 rounded-lg bg-gradient-to-r ${category.color} text-white text-sm font-medium hover:opacity-90 transition-opacity`}
                        >
                          Бүгдийг харах ({categoryContents.length})
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 flex-1 flex flex-col items-center justify-center">
                      <Icon className={`w-10 h-10 ${category.iconColor} opacity-30 mb-2`} />
                      <p className="text-sm text-gray-500">Мэдээлэл байхгүй</p>
                    </div>
                  )}
                  
                  {categoryContents.length > 0 && categoryContents.length <= 3 && (
                    <Link
                      href={category.href}
                      className="flex items-center justify-center gap-2 mt-3 p-2 rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Бүгдийг харах
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* External Links */}
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Eye className="w-8 h-8 text-purple-600" />
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Шилэн данс
                </a>
                <a
                  href="https://www.info.mn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium border border-purple-200"
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
            <Link href="/contact" className="text-purple-600 hover:underline font-medium">
              холбоо барих
            </Link>{" "}
            хуудсаар хандана уу.
          </p>
        </div>
      </div>
    </Container>
  );
}

