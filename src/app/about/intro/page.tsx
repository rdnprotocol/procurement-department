import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Info, Award, Users, Target, TrendingUp } from "lucide-react";

export const revalidate = 3600; // 1 цаг тутамд revalidate хийнэ

export default async function IntroPage() {
  const supabase = createSupabaseServerClient();

  // Intro контентийг database-аас авах
  const { data: introContent } = await supabase
    .from('static_contents')
    .select('*')
    .eq('type', 'intro')
    .single();

  // Байгууллагын үндсэн мэдээлэл
  const organizationInfo = [
    {
      icon: Building2,
      title: "Байгууллагын нэр",
      description: "Нийслэлийн Худалдан авах ажиллагааны газар",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100/50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Target,
      title: "Эрхэм зорилго",
      description: "Худалдан авах ажиллагааг ил тод, өрсөлдөх тэгш боломжтой, үр ашигтай, хариуцлагатай зохион байгуулахад оршино",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100/50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: TrendingUp,
      title: "Алсын харалт",
      description: "Нийслэлийн бүтээн байгуулалтад манлайлан оролцогч мэргэшсэн байгууллага байна",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100/50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Users,
      title: "Үйл ажиллагаа",
      description: "Худалдан авах ажиллагааны төлөвлөлт, зохион байгуулалт, хэрэгжүүлэлт",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100/50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#24276B] to-[#3d42a0] rounded-2xl mb-6 shadow-lg">
            <Info className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Байгууллагын танилцуулга
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Нийслэлийн Худалдан авах ажиллагааны газрын танилцуулга, үйл ажиллагаа, зорилго, харалт
          </p>
        </div>

        {/* Main Content from Database */}
        {introContent && (
          <Card className="mb-12 shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white rounded-t-xl">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Building2 className="w-6 h-6" />
                {introContent.title || "Байгууллагын танилцуулга"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700 prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: introContent.content || "Байгууллагын танилцуулга оруулаагүй байна" }}
              />
            </CardContent>
          </Card>
        )}

        {/* Organization Info Cards */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Байгууллагын үндсэн мэдээлэл
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {organizationInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${info.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className={`${info.iconBg} ${info.iconColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {info.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <p className="text-gray-700 leading-relaxed">
                      {info.description}
                    </p>
                  </CardContent>

                  {/* Decorative Element */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${info.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white">
              <CardTitle className="text-xl flex items-center gap-3">
                <Award className="w-6 h-6" />
                Бидний үнэт зүйлс
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Ил тод байдал - Бүх үйл ажиллагааг ил тод, нээлттэй явуулах</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Шударга байдал - Өрсөлдөх тэгш боломжтой орчинг бүрдүүлэх</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Хариуцлага - Үр дүнтэй, хэмнэлттэй ажиллагаа явуулах</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Мэргэжлийн чанар - Мэргэжлийн өндөр түвшний үйлчилгээ үзүүлэх</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white">
              <CardTitle className="text-xl flex items-center gap-3">
                <Users className="w-6 h-6" />
                Бидний үүрэг
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Худалдан авах ажиллагааны төлөвлөлт, зохион байгуулалт</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Тендер зарлал, явуулах ажлыг зохион байгуулах</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Худалдан авах ажиллагааны тайлан, статистик мэдээлэл</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Хууль тогтоомжийн дагуу зөв хэрэгжүүлэлтийг хангах</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        {!introContent && (
          <Card className="mt-12 bg-gradient-to-br from-[#24276B]/5 to-[#3d42a0]/5 border border-[#24276B]/20">
            <CardContent className="pt-6 text-center">
              <Info className="w-12 h-12 mx-auto mb-4 text-[#24276B]" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Байгууллагын танилцуулга оруулаагүй байна
              </h3>
              <p className="text-gray-600">
                Админ хэсэгт нэвтэрч, байгууллагын танилцуулга мэдээллийг оруулна уу.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
}
