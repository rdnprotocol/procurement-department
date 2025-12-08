import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Gavel, Calendar, ArrowRight, Building2, ClipboardList } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Байгууллагын хууль тогтоомж | Худалдан авах ажиллагааны газар",
  description: "Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомж, дүрэм журам, тушаалууд",
};

export const revalidate = 3600;

interface ContentItem {
  id: number;
  title: string;
  banner_image: string;
  created_date: string;
  category_id: number;
}

export default async function OrganizationLawPage() {
  const supabase = createSupabaseServerClient();

  // Байгууллагын хууль тогтоомж category (id: 4)
  const { data: orgLaws } = await supabase
    .from('contents')
    .select('*')
    .eq('category_id', 4)
    .order('created_date', { ascending: false });

  // Газрын даргын тушаал category (id: 5)
  const { data: directorOrders } = await supabase
    .from('contents')
    .select('*')
    .eq('category_id', 5)
    .order('created_date', { ascending: false });

  const categories = [
    {
      id: "laws",
      title: "Хууль тогтоомж",
      description: "Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомжууд",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      contents: orgLaws || [],
      href: "/category/baiguullagiin-huuli-togtoomj",
    },
    {
      id: "orders",
      title: "Газрын даргын тушаал",
      description: "Газрын даргын гаргасан тушаал, шийдвэрүүд",
      icon: Gavel,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      contents: directorOrders || [],
      href: "/category/dargiin-tushaal",
    },
  ];

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">Нүүр</Link>
          <span>/</span>
          <Link href="/law" className="hover:text-blue-600 transition-colors">Хууль, Эрх зүй</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Байгууллагын хууль тогтоомж</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомж
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Байгууллагын өдөр тутмын үйл ажиллагаанд хамаарах хууль тогтоомж, 
            дүрэм журам, газрын даргын тушаал шийдвэрүүд
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{orgLaws?.length || 0}</div>
                  <div className="text-gray-600">Хууль тогтоомж</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Gavel className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{directorOrders?.length || 0}</div>
                  <div className="text-gray-600">Газрын даргын тушаал</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id} className="border-0 shadow-lg overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${category.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-3">
                      <Icon className="w-6 h-6" />
                      {category.title}
                    </CardTitle>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {category.contents.length} бичвэр
                    </span>
                  </div>
                  <p className="text-white/80 text-sm mt-1">
                    {category.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  {category.contents.length > 0 ? (
                    <div className="space-y-3">
                      {category.contents.slice(0, 5).map((content: ContentItem) => (
                        <Link
                          key={content.id}
                          href={`/news/${content.id}`}
                          className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                        >
                          <div className={`p-2 ${category.bgColor} rounded-lg`}>
                            <FileText className={`w-5 h-5 ${category.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                              {content.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(content.created_date).toLocaleDateString('mn-MN')}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </Link>
                      ))}
                      
                      {category.contents.length > 5 && (
                        <div className="text-center pt-4 border-t border-gray-100">
                          <Link
                            href={category.href}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${category.color} text-white font-medium hover:opacity-90 transition-opacity`}
                          >
                            Бүгдийг харах ({category.contents.length})
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-gray-900 font-medium mb-1">
                        Бичвэр байршуулаагүй байна
                      </h3>
                      <p className="text-sm text-gray-500">
                        Удахгүй бичвэрүүд нэмэгдэнэ
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Хууль тогтоомж</h3>
                  <p className="text-sm text-gray-600">
                    Байгууллагын үйл ажиллагаанд хамаарах хууль, дүрэм, журам, 
                    заавар зэргийг энд байршуулсан болно.
                  </p>
                  <Link
                    href="/category/baiguullagiin-huuli-togtoomj"
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 mt-2"
                  >
                    Дэлгэрэнгүй
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Gavel className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Газрын даргын тушаал</h3>
                  <p className="text-sm text-gray-600">
                    Газрын даргын гаргасан тушаал, шийдвэрүүдийг тухай бүрт 
                    нийтэлж байна.
                  </p>
                  <Link
                    href="/category/dargiin-tushaal"
                    className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 mt-2"
                  >
                    Дэлгэрэнгүй
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

