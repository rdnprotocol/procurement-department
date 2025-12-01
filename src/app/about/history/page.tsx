import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  History, 
  Calendar, 
  Award, 
  TrendingUp, 
  Building2,
  Clock,
  MapPin
} from "lucide-react";

export const revalidate = 3600; // 1 цаг тутамд revalidate хийнэ

export default async function HistoryPage() {
  const supabase = createSupabaseServerClient();

  // History контентийг database-аас авах
  const { data: historyContent } = await supabase
    .from('static_contents')
    .select('*')
    .eq('type', 'history')
    .single();

  // Түүхэн онцлох үйл явдлууд (жишээ мэдээлэл)
  const historicalEvents = [
    {
      year: "2020",
      title: "Байгууллагын үүсэл",
      description: "Нийслэлийн Худалдан авах ажиллагааны газар байгуулагдсан",
      icon: Building2,
      color: "from-blue-500 to-blue-600",
    },
    {
      year: "2021",
      title: "Цахим системийн нэвтрүүлэлт",
      description: "Худалдан авах ажиллагааны цахим системийг нэвтрүүлж, ил тод байдлыг сайжруулсан",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
    {
      year: "2022",
      title: "Хууль тогтоомжийн шинэчлэл",
      description: "Худалдан авах ажиллагааны хууль тогтоомжийг шинэчлэн, сайжруулсан",
      icon: Award,
      color: "from-purple-500 to-purple-600",
    },
    {
      year: "2023",
      title: "Олон улсын хамтын ажиллагаа",
      description: "Олон улсын байгууллагуудтай хамтран ажиллаж, туршлага солилцсон",
      icon: MapPin,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#24276B] to-[#3d42a0] rounded-2xl mb-6 shadow-lg">
            <History className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Түүхэн замнал
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Байгууллагын үүсэл, хөгжил, онцлох үйл явдлууд болон түүхэн мэдээлэл
          </p>
        </div>

        {/* Main Content from Database */}
        {historyContent && (
          <Card className="mb-12 shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white rounded-t-xl">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Clock className="w-6 h-6" />
                {historyContent.title || "Түүхэн замнал"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700 prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: historyContent.content || "Түүхэн замнал оруулаагүй байна" }}
              />
            </CardContent>
          </Card>
        )}

        {/* Timeline Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Онцлох үйл явдлууд
          </h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#24276B] to-[#3d42a0] transform md:-translate-x-1/2" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {historicalEvents.map((event, index) => {
                const Icon = event.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div
                    key={index}
                    className={`relative flex items-center ${
                      isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                    } flex-col gap-6`}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-8 md:left-1/2 w-6 h-6 rounded-full bg-gradient-to-r ${event.color} border-4 border-white shadow-lg transform md:-translate-x-1/2 z-10 flex items-center justify-center`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>

                    {/* Content Card */}
                    <div className={`w-full md:w-5/12 ${isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'} ml-16 md:ml-0`}>
                      <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                        <CardHeader className={`bg-gradient-to-r ${event.color} text-white`}>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl flex items-center gap-2">
                              <Calendar className="w-5 h-5" />
                              {event.year}
                            </CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                              <Icon className="w-5 h-5" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {event.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white">
              <CardTitle className="text-xl flex items-center gap-3">
                <Award className="w-6 h-6" />
                Бидний амжилтууд
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Худалдан авах ажиллагааны ил тод байдлыг сайжруулсан</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Цахим системийг нэвтрүүлж, үйлчилгээний чанарыг дээшлүүлсэн</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Хууль тогтоомжийн дагуу зөв хэрэгжүүлэлтийг хангасан</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Иргэд, байгууллагуудын итгэлцлийг олж авсан</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white">
              <CardTitle className="text-xl flex items-center gap-3">
                <TrendingUp className="w-6 h-6" />
                Хөгжлийн чиглэл
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Цахим системийн үргэлжлүүлэн сайжруулах</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Мэргэжлийн чадварыг дээшлүүлэх</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Олон улсын хамтын ажиллагааг өргөжүүлэх</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#24276B] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">Ил тод байдлыг цаашид сайжруулах</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        {!historyContent && (
          <Card className="mt-12 bg-gradient-to-br from-[#24276B]/5 to-[#3d42a0]/5 border border-[#24276B]/20">
            <CardContent className="pt-6 text-center">
              <History className="w-12 h-12 mx-auto mb-4 text-[#24276B]" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Түүхэн замнал оруулаагүй байна
              </h3>
              <p className="text-gray-600">
                Админ хэсэгт нэвтэрч, байгууллагын түүхэн замналын мэдээллийг оруулна уу.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
}
