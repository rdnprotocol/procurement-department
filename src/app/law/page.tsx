import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, BookOpen, Gavel, ExternalLink, ArrowRight, Link as LinkIcon, Download } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Хууль, Эрх зүй | Худалдан авах ажиллагааны газар",
  description: "Худалдан авах ажиллагааны болон байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомжууд",
};

export const revalidate = 60;

interface LawDocument {
  id: number;
  title: string;
  type: string;
  url: string | null;
  file_url: string | null;
  description: string | null;
  created_at: string;
}

export default async function LawPage() {
  const supabase = createSupabaseServerClient();

  // Бүх төрлийн хууль тогтоомжийн тоог татах
  const { data: procurementLaws } = await supabase
    .from('law_documents')
    .select('*')
    .eq('type', 'procurement_law')
    .order('created_at', { ascending: false })
    .limit(3);

  const { data: lawLinks } = await supabase
    .from('law_documents')
    .select('*')
    .eq('type', 'law_link')
    .order('created_at', { ascending: false })
    .limit(3);

  const { data: directorOrders } = await supabase
    .from('law_documents')
    .select('*')
    .eq('type', 'director_order')
    .order('created_at', { ascending: false })
    .limit(3);

  const quickLinks = [
    {
      title: "tender.gov.mn",
      description: "Төрийн худалдан авах ажиллагааны цахим систем",
      href: "https://www.tender.gov.mn",
      icon: ExternalLink,
    },
    {
      title: "legalinfo.mn",
      description: "Монгол Улсын хууль тогтоомжийн нэгдсэн сан",
      href: "https://www.legalinfo.mn",
      icon: ExternalLink,
    },
  ];

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Хууль, Эрх зүй
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Худалдан авах ажиллагаа болон байгууллагын үйл ажиллагаанд хамаарах 
            хууль тогтоомж, дүрэм журмууд
          </p>
        </div>

        {/* Main Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Худалдан авах ажиллагааны хууль тогтоомж */}
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Scale className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    Худалдан авах ажиллагааны талаар хууль тогтоомж
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <p className="text-gray-600 mb-6">
                Төрийн болон орон нутгийн өмчийн хөрөнгөөр бараа, ажил, үйлчилгээ худалдан авах тухай хуулиуд
              </p>

              {/* Recent items */}
              {procurementLaws && procurementLaws.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {procurementLaws.map((doc: LawDocument) => (
                    <a
                      key={doc.id}
                      href={doc.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors group/item"
                    >
                      <div className="flex items-center gap-3">
                        <LinkIcon className="w-5 h-5 text-emerald-500" />
                        <span className="font-medium text-gray-700 truncate">{doc.title}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover/item:text-emerald-600 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500 text-sm mb-6">
                  Хууль тогтоомж нэмэгдээгүй байна
                </div>
              )}

              {/* View all link */}
              <Link
                href="/law/procurement"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Дэлгэрэнгүй үзэх
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Байгууллагын хууль тогтоомж */}
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомж
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <p className="text-gray-600 mb-6">
                Байгууллагын өдөр тутмын үйл ажиллагаанд хамаарах дүрэм, журам, тушаалууд
              </p>

              {/* Recent items */}
              <div className="space-y-3 mb-6">
                {lawLinks && lawLinks.length > 0 ? (
                  lawLinks.slice(0, 2).map((doc: LawDocument) => (
                    <a
                      key={doc.id}
                      href={doc.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors group/item"
                    >
                      <div className="flex items-center gap-3">
                        <LinkIcon className="w-5 h-5 text-blue-500" />
                        <span className="font-medium text-gray-700 truncate">{doc.title}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover/item:text-blue-600 flex-shrink-0" />
                    </a>
                  ))
                ) : null}
                
                {directorOrders && directorOrders.length > 0 ? (
                  directorOrders.slice(0, 1).map((doc: LawDocument) => (
                    <a
                      key={doc.id}
                      href={doc.file_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors group/item"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-purple-500" />
                        <span className="font-medium text-gray-700 truncate">{doc.title}</span>
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">PDF</span>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 group-hover/item:text-purple-600 flex-shrink-0" />
                    </a>
                  ))
                ) : null}

                {(!lawLinks || lawLinks.length === 0) && (!directorOrders || directorOrders.length === 0) && (
                  <div className="py-4 text-center text-gray-500 text-sm">
                    Хууль тогтоомж нэмэгдээгүй байна
                  </div>
                )}
              </div>

              {/* View all link */}
              <Link
                href="/law/organization"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Дэлгэрэнгүй үзэх
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Холбогдох сайтууд
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group"
                >
                  <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Gavel className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Хууль эрх зүйн мэдээлэл
                </h3>
                <p className="text-gray-600 text-sm">
                  Энэхүү хэсэгт нийслэлийн худалдан авах ажиллагааны газрын үйл ажиллагаанд 
                  хамааралтай хууль тогтоомж, дүрэм журам, шийдвэр тушаалуудыг байршуулсан болно. 
                  Хууль тогтоомжийн өөрчлөлтийг тухай бүрт шинэчилж байршуулна.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

