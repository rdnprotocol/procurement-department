import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileText, ExternalLink, Calendar, ArrowRight, Download, BookOpen, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Худалдан авах ажиллагааны хууль тогтоомж | Худалдан авах ажиллагааны газар",
  description: "Төрийн болон орон нутгийн өмчийн хөрөнгөөр бараа, ажил, үйлчилгээ худалдан авах тухай хуулиуд",
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

export default async function ProcurementLawPage() {
  const supabase = createSupabaseServerClient();

  // Худалдан авах ажиллагааны хууль тогтоомж (procurement_law type)
  const { data: procurementLaws } = await supabase
    .from('law_documents')
    .select('*')
    .eq('type', 'procurement_law')
    .order('created_at', { ascending: false });

  // Мөн contents хүснэгтээс хуучин өгөгдөл (category_id: 3)
  const { data: laws } = await supabase
    .from('contents')
    .select('*')
    .eq('category_id', 3)
    .order('created_date', { ascending: false });

  const keyLaws = [
    {
      title: "Төрийн болон орон нутгийн өмчийн хөрөнгөөр бараа, ажил, үйлчилгээ худалдан авах тухай хууль",
      icon: Scale,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Засгийн газрын тогтоол, журам",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Сангийн сайдын тушаал",
      icon: BookOpen,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Нүүр</Link>
          <span>/</span>
          <Link href="/law" className="hover:text-emerald-600 transition-colors">Хууль, Эрх зүй</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Худалдан авах ажиллагааны хууль тогтоомж</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Худалдан авах ажиллагааны талаар хууль тогтоомж
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Төрийн болон орон нутгийн өмчийн хөрөнгөөр бараа, ажил, үйлчилгээ 
            худалдан авах ажиллагаатай холбоотой хууль тогтоомжууд
          </p>
        </div>

        {/* Key Laws Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {keyLaws.map((law, index) => {
            const Icon = law.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${law.color} rounded-xl mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{law.title}</h3>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Law Documents */}
          <div className="lg:col-span-2 space-y-6">
            {/* Law Documents from Admin */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-t-xl">
                <CardTitle className="text-xl flex items-center gap-3">
                  <LinkIcon className="w-6 h-6" />
                  Хууль тогтоомжийн холбоосууд
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {procurementLaws && procurementLaws.length > 0 ? (
                  <div className="space-y-4">
                    {procurementLaws.map((doc: LawDocument) => (
                      <a
                        key={doc.id}
                        href={doc.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors group"
                      >
                        <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                          <LinkIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors mb-1">
                            {doc.title}
                          </h3>
                          {doc.description && (
                            <p className="text-sm text-gray-500 mb-1">{doc.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(doc.created_at).toLocaleDateString('mn-MN')}</span>
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-all flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <LinkIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Хууль тогтоомжийн холбоос байршуулаагүй байна
                    </h3>
                    <p className="text-gray-600">
                      Админ хэсгээс хууль тогтоомж нэмнэ үү
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Internal Documents from contents table */}
            {laws && laws.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <FileText className="w-6 h-6" />
                    Бусад баримт бичиг
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {laws.map((law: ContentItem) => (
                      <Link
                        key={law.id}
                        href={`/news/${law.id}`}
                        className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors group"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                            {law.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(law.created_date).toLocaleDateString('mn-MN')}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* External Links */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Холбогдох эх сурвалж
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <a
                    href="https://www.legalinfo.mn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <ExternalLink className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                          legalinfo.mn
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Монгол Улсын хууль тогтоомжийн нэгдсэн сан
                        </p>
                      </div>
                    </div>
                  </a>
                  <a
                    href="https://www.tender.gov.mn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <ExternalLink className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors text-sm">
                          tender.gov.mn
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Төрийн худалдан авах ажиллагааны цахим систем
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Quick Download */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Download className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Жишиг баримт бичиг</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Тендерийн баримт бичгийн загвар, маягтууд
                </p>
                <a
                  href="https://www.tender.gov.mn/mn/document/list"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Татаж авах
                  <ArrowRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Анхааруулга</h3>
                    <p className="text-sm text-gray-600">
                      Хууль тогтоомжийн хамгийн сүүлийн хувилбарыг legalinfo.mn 
                      болон tender.gov.mn сайтаас шалгана уу.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}

