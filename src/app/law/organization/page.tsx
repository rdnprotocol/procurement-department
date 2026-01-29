import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Gavel, Calendar, ArrowRight, Building2, ClipboardList, ExternalLink, Link as LinkIcon, Download } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Байгууллагын хууль тогтоомж | Худалдан авах ажиллагааны газар",
  description: "Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомж, дүрэм журам, тушаалууд",
};

export const revalidate = 60; // Revalidate every 60 seconds

interface ContentItem {
  id: number;
  title: string;
  banner_image: string;
  created_date: string;
  category_id: number;
}

interface LawDocument {
  id: number;
  title: string;
  type: string;
  url: string | null;
  file_url: string | null;
  description: string | null;
  created_at: string;
}

export default async function OrganizationLawPage() {
  const supabase = createSupabaseServerClient();

  // law_documents хүснэгтээс - Байгууллагын хууль тогтоомж (law_link)
  const { data: lawLinks } = await supabase
    .from('law_documents')
    .select('*')
    .eq('type', 'law_link')
    .order('created_at', { ascending: false });

  // law_documents хүснэгтээс - Газрын даргын тушаал (director_order)
  const { data: directorOrderDocs } = await supabase
    .from('law_documents')
    .select('*')
    .eq('type', 'director_order')
    .order('created_at', { ascending: false });

  // Мөн contents хүснэгтээс хуучин өгөгдөл
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
                  <div className="text-3xl font-bold text-gray-900">{(lawLinks?.length || 0) + (orgLaws?.length || 0)}</div>
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
                  <div className="text-3xl font-bold text-gray-900">{(directorOrderDocs?.length || 0) + (directorOrders?.length || 0)}</div>
                  <div className="text-gray-600">Газрын даргын тушаал</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Хууль тогтоомж - law_link */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  Хууль тогтоомж
                </CardTitle>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {(lawLinks?.length || 0) + (orgLaws?.length || 0)} бичвэр
                </span>
              </div>
              <p className="text-white/80 text-sm mt-1">
                Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомжууд
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              {(lawLinks && lawLinks.length > 0) || (orgLaws && orgLaws.length > 0) ? (
                <div className="space-y-3">
                  {/* Law links from law_documents */}
                  {lawLinks?.map((doc: LawDocument) => (
                    <a
                      key={`law-${doc.id}`}
                      href={doc.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <LinkIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {doc.title}
                        </h3>
                        {doc.description && (
                          <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(doc.created_at).toLocaleDateString('mn-MN')}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all flex-shrink-0" />
                    </a>
                  ))}
                  
                  {/* Contents from contents table */}
                  {orgLaws?.slice(0, 5).map((content: ContentItem) => (
                    <Link
                      key={`content-${content.id}`}
                      href={`/news/${content.id}`}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
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
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-gray-900 font-medium mb-1">
                    Бичвэр байршуулаагүй байна
                  </h3>
                  <p className="text-sm text-gray-500">
                    Админ хэсгээс хууль тогтоомж нэмнэ үү
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Газрын даргын тушаал - director_order */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Gavel className="w-6 h-6" />
                  Газрын даргын тушаал
                </CardTitle>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {(directorOrderDocs?.length || 0) + (directorOrders?.length || 0)} бичвэр
                </span>
              </div>
              <p className="text-white/80 text-sm mt-1">
                Газрын даргын гаргасан тушаал, шийдвэрүүд
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              {(directorOrderDocs && directorOrderDocs.length > 0) || (directorOrders && directorOrders.length > 0) ? (
                <div className="space-y-3">
                  {/* Director orders from law_documents (PDF) */}
                  {directorOrderDocs?.map((doc: LawDocument) => (
                    <a
                      key={`order-${doc.id}`}
                      href={doc.file_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors group"
                    >
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Download className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                          {doc.title}
                        </h3>
                        {doc.description && (
                          <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(doc.created_at).toLocaleDateString('mn-MN')}</span>
                          <span className="text-purple-600 text-xs font-medium bg-purple-100 px-2 py-0.5 rounded">PDF</span>
                        </div>
                      </div>
                      <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-all flex-shrink-0" />
                    </a>
                  ))}
                  
                  {/* Director orders from contents table */}
                  {directorOrders?.slice(0, 5).map((content: ContentItem) => (
                    <Link
                      key={`content-order-${content.id}`}
                      href={`/news/${content.id}`}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors group"
                    >
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                          {content.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(content.created_date).toLocaleDateString('mn-MN')}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-gray-900 font-medium mb-1">
                    Тушаал байршуулаагүй байна
                  </h3>
                  <p className="text-sm text-gray-500">
                    Админ хэсгээс тушаал нэмнэ үү
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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

