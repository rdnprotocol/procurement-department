import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, TrendingUp } from "lucide-react";
import { enhanceHtmlForInlinePdfEmbeds } from "@/utils/enhanceHtml";

export const revalidate = 3600; // 1 цаг тутамд revalidate хийнэ

export default async function MissionPage() {
  const supabase = createSupabaseServerClient();

  const { data: contents } = await supabase
    .from('static_contents')
    .select('*')
    .in('type', ['mission', 'vision', 'goal'])
    .order('created_at', { ascending: true });

  const missionContent = contents?.find(c => c.type === 'mission');
  const visionContent = contents?.find(c => c.type === 'vision');
  const goalContent = contents?.find(c => c.type === 'goal');

  const sections = [
    {
      content: missionContent,
      title: "Эрхэм зорилго",
      icon: Target,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100/50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      content: visionContent,
      title: "Алсын харалт",
      icon: Eye,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100/50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      content: goalContent,
      title: "Стратегийн зорилтууд",
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100/50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Эрхэм зорилго, Алсын харалт, Стратегийн зорилтууд
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Байгууллагын үндсэн үнэт зүйлс, зорилго, харалт болон стратегийн зорилтууд
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const displayTitle = section.content?.title || section.title;
            const displayContent = section.content?.content || `${section.title} оруулаагүй байна`;

            return (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`${section.iconBg} ${section.iconColor} p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {displayTitle}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div 
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700"
                    dangerouslySetInnerHTML={{ __html: enhanceHtmlForInlinePdfEmbeds(displayContent) }}
                  />
                </CardContent>

                {/* Decorative Element */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </Card>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Бидний үнэт зүйлс
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Бид ил тод, шударга, хариуцлагатай, үр ашигтай ажиллагаа явуулах зарчмаар 
              ажиллаж, нийслэлийн бүтээн байгуулалтад идэвхтэй оролцож байна.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
