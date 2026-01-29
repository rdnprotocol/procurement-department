import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  FileText, 
  ArrowRight,
  Clock,
  MapPin,
  Users,
  Phone
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Иргэд хүлээн авах уулзалт | Худалдан авах ажиллагааны газар",
  description: "Иргэдийг хүлээн авах уулзалтын хуваарь",
};

export const revalidate = 60;

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
}

const meetingsSections = [
  {
    type: "meetings-intro",
    title: "Танилцуулга",
    icon: Calendar,
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    type: "meetings-schedule",
    title: "Уулзалтын хуваарь",
    icon: Clock,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

export default async function MeetingsPage() {
  const supabase = createSupabaseServerClient();

  // Fetch static contents for Meetings
  const { data: staticContents } = await supabase
    .from('static_contents')
    .select('*')
    .in('type', meetingsSections.map(s => s.type))
    .order('type');

  const getContentByType = (type: string): StaticContent | undefined => {
    return (staticContents || []).find(c => c.type === type);
  };

  const hasContent = (type: string): boolean => {
    const content = getContentByType(type);
    return !!content && !!content.content;
  };

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-rose-600 transition-colors">Нүүр</Link>
          <span>/</span>
          <Link href="/activities/transparency" className="hover:text-rose-600 transition-colors">Ил тод байдал</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Иргэд хүлээн авах уулзалт</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl mb-6 shadow-lg">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Иргэд хүлээн авах уулзалт
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Иргэдийг хүлээн авах цагийн хуваарь болон уулзалтын мэдээлэл
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Хаяг байршил</h3>
                  <p className="text-gray-600 text-sm">
                    Төв аймаг, Зуунмод сум, Засаг захиргааны 2-р байр
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-100 rounded-xl">
                  <Phone className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Холбоо барих</h3>
                  <p className="text-gray-600 text-sm">
                    Утас: 70273939<br />
                    И-мэйл: info@procurement.tov.gov.mn
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {meetingsSections.map((section) => {
            const Icon = section.icon;
            const content = getContentByType(section.type);
            const hasData = hasContent(section.type);

            return (
              <Card key={section.type} className="border-0 shadow-lg overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${section.color} text-white p-5`}>
                  <CardTitle className="text-lg font-semibold flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    {content?.title || section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {hasData ? (
                    <div 
                      className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
                      dangerouslySetInnerHTML={{ __html: content!.content }}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <Icon className={`w-12 h-12 ${section.iconColor} opacity-30 mx-auto mb-3`} />
                      <p className="text-gray-500">Мэдээлэл оруулаагүй байна</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Админ хэсгээс мэдээлэл оруулна уу
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Card */}
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-br from-rose-50 to-rose-100/50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-100 rounded-xl">
                  <Calendar className="w-8 h-8 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Цаг авах</h3>
                  <p className="text-sm text-gray-600">
                    Урьдчилан цаг авахыг хүсвэл холбоо барих хуудас руу очно уу
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  Холбоо барих
                </Link>
                <Link
                  href="/activities/transparency"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-rose-600 rounded-lg hover:bg-rose-50 transition-colors text-sm font-medium border border-rose-200"
                >
                  <ArrowRight className="w-4 h-4" />
                  Ил тод байдал
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Уулзалтын цаг урьдчилан авахыг зөвлөж байна.{" "}
            <Link href="/contact" className="text-rose-600 hover:underline font-medium">
              Холбоо барих
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}
