import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  Users, 
  Briefcase, 
  Phone, 
  Mail, 
  MapPin,
  Network,
  UserCircle,
  FileText
} from "lucide-react";

export const revalidate = 3600; // 1 цаг тутамд revalidate хийнэ

export default async function StructurePage() {
  const supabase = createSupabaseServerClient();

  // Structure контентийг database-аас авах
  const { data: structureContent } = await supabase
    .from('static_contents')
    .select('*')
    .eq('type', 'structure')
    .single();

  // Байгууллагын бүтцийн мэдээлэл
  const organizationStructure = {
    mainOffice: {
      name: "Нийслэлийн Худалдан авах ажиллагааны газар",
      departments: [
        {
          name: "Захиргаа, санхүүгийн хэлтэс",
          responsibilities: [
            "Худалдан авах ажиллагааг ил тод, өрсөлдөх тэгш боломжтой, үр ашигтай, хэмнэлттэй, хариуцлагатай байх зарчимд нийцүүлэн хууль тогтоомжийн дагуу зохион байгуулах",
            "Төсвийн ерөнхийлөн захирагчийн худалдан авах ажиллагааны төлөвлөгөөг боловсруулж, батлуулах, хэрэгжүүлэх",
            "Төсвийн ерөнхийлөн захирагчийн худалдан авах ажиллагааны ерөнхий төлөвлөгөөг цахим системээр батлуулах, төлөвлөгөөнд өөрчлөлт оруулах, эрх шилжүүлэх, төлөвлөгөө батлах ажлыг холбогдох хууль, журмын дагуу гүйцэтгэх"
          ],
          contact: {
            person: "Төлөвлөгөө, тайлан хариуцсан мэргэжилтний албан үүргийг түр орлон гүйцэтгэгч Б.Мөнхдэлгэр",
            room: "716 тоот өрөө",
            phone: "75757807"
          }
        }
      ]
    }
  };

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#24276B] to-[#3d42a0] rounded-2xl mb-6 shadow-lg">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Бүтэц, зохион байгуулалт
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Байгууллагын бүтэц, хэлтэсүүд, чиг үүрэг болон холбоо барих мэдээлэл
          </p>
        </div>

        {/* Structure Content from Database */}
        {structureContent && (
          <Card className="mb-12 shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white rounded-t-xl">
              <CardTitle className="text-2xl flex items-center gap-3">
                <FileText className="w-6 h-6" />
                {structureContent.title || "Байгууллагын бүтэц"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: structureContent.content || "" }}
              />
            </CardContent>
          </Card>
        )}

        {/* Organizational Structure */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Network className="w-8 h-8 text-[#24276B]" />
            Байгууллагын бүтэц
          </h2>

          {/* Main Office Card */}
          <Card className="mb-8 shadow-lg border-2 border-[#24276B]/10 hover:border-[#24276B]/30 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Building2 className="w-7 h-7" />
                {organizationStructure.mainOffice.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {organizationStructure.mainOffice.departments.map((dept, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#24276B]/10 rounded-lg">
                      <Users className="w-5 h-5 text-[#24276B]" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{dept.name}</h3>
                  </div>

                  {/* Responsibilities */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Чиг үүрэг:
                    </h4>
                    <ul className="space-y-3 ml-6">
                      {dept.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact Information */}
                  {dept.contact && (
                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200">
                      <CardContent className="pt-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Холбоо барих мэдээлэл:
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <UserCircle className="w-5 h-5 text-[#24276B] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Хариуцсан мэргэжилтэн:</p>
                              <p className="text-gray-700">{dept.contact.person}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-[#24276B] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Байршил:</p>
                              <p className="text-gray-700">{dept.contact.room}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-[#24276B] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Утас:</p>
                              <a href={`tel:${dept.contact.phone}`} className="text-[#24276B] hover:underline">
                                {dept.contact.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Organizational Chart Visualization */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Network className="w-8 h-8 text-[#24276B]" />
            Байгууллагын бүтцийн диаграм
          </h2>
          
          <Card className="shadow-lg border-0">
            <CardContent className="pt-8">
              <div className="flex flex-col items-center">
                {/* Top Level - Main Office */}
                <div className="relative mb-8">
                  <div className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white px-8 py-4 rounded-xl shadow-lg min-w-[300px] text-center">
                    <Building2 className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-semibold text-lg">{organizationStructure.mainOffice.name}</p>
                  </div>
                  
                  {/* Connector Line */}
                  <div className="absolute left-1/2 -bottom-8 w-0.5 h-8 bg-gray-300 transform -translate-x-1/2" />
                </div>

                {/* Department Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                  {organizationStructure.mainOffice.departments.map((dept, index) => (
                    <div key={index} className="relative">
                      <div className="bg-white border-2 border-[#24276B]/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                        <Users className="w-8 h-8 mx-auto mb-3 text-[#24276B]" />
                        <p className="font-semibold text-gray-900">{dept.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="bg-gradient-to-br from-[#24276B]/5 to-[#3d42a0]/5 border border-[#24276B]/20">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#24276B]" />
              Дэлгэрэнгүй мэдээлэл авах
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Байгууллагын бүтэц, зохион байгуулалт, чиг үүрэгтэй холбоотой дэлгэрэнгүй мэдээллийг 
              дээрх холбоо барих мэдээллээр авах боломжтой. Бид таны асуулт, санал хүсэлтийг хүлээн авч, 
              хариу өгөхөд бэлэн байна.
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
