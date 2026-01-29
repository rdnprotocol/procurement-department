"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/assets";
import { Card, CardContent } from "@/components/ui/card";
import { 
  History, 
  Calendar, 
  Award, 
  TrendingUp, 
  Building2,
  Clock,
  MapPin,
  Globe,
  Loader2,
  Star,
  Target,
  Users,
  Zap,
  Shield,
  Heart
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  History, Calendar, Award, TrendingUp, Building2, Clock, MapPin, Globe,
  Star, Target, Users, Zap, Shield, Heart
};

interface HistoryEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
}

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
}

export default function HistoryPage() {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [historyContent, setHistoryContent] = useState<StaticContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, staticRes] = await Promise.all([
        fetch('/api/history-events'),
        fetch('/api/static-content')
      ]);

      if (eventsRes.ok) {
        setEvents(await eventsRes.json());
      }

      if (staticRes.ok) {
        const staticData = await staticRes.json();
        const history = staticData.find((s: StaticContent) => s.type === 'history');
        if (history) setHistoryContent(history);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Уншиж байна...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-[#24276B] via-[#3d42a0] to-[#5a5fd4] p-8 md:p-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <History className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Түүхэн замнал
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Байгууллагын үүсэл, хөгжил, онцлох үйл явдлууд болон түүхэн мэдээлэл
            </p>
          </div>
        </div>

        {/* Main Content from Database */}
        {/* {historyContent && (
          <Card className="mb-12 shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Clock className="w-6 h-6" />
                {historyContent.title || "Түүхэн замнал"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700 prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: historyContent.content }}
              />
            </CardContent>
          </Card>
        )} */}

        {/* Timeline Section */}
        {events.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Онцлох үйл явдлууд
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#24276B] to-[#3d42a0] mx-auto rounded-full" />
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#24276B] via-[#3d42a0] to-[#5a5fd4] transform md:-translate-x-1/2 rounded-full" />

              {/* Timeline Items */}
              <div className="space-y-12">
                {events.map((event, index) => {
                  const IconComponent = iconMap[event.icon] || Calendar;
                  const isEven = index % 2 === 0;
                  
                  return (
                    <div
                      key={event.id}
                      className={`relative flex items-center ${
                        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                      } flex-col gap-6`}
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute left-8 md:left-1/2 w-8 h-8 rounded-full bg-gradient-to-r ${event.color} border-4 border-white shadow-lg transform md:-translate-x-1/2 z-10 flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>

                      {/* Year Badge (Desktop) */}
                      <div className={`hidden md:block absolute left-1/2 ${isEven ? 'translate-x-8' : '-translate-x-20'} transform`}>
                        <span className={`px-4 py-1.5 bg-gradient-to-r ${event.color} text-white text-sm font-bold rounded-full shadow-lg`}>
                          {event.year}
                        </span>
                      </div>

                      {/* Content Card */}
                      <div className={`w-full md:w-5/12 ${isEven ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'} ml-16 md:ml-0`}>
                        <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group overflow-hidden">
                          <div className={`h-2 bg-gradient-to-r ${event.color}`} />
                          <CardContent className="pt-6 pb-6">
                            {/* Year Badge (Mobile) */}
                            <span className={`md:hidden inline-block px-3 py-1 bg-gradient-to-r ${event.color} text-white text-xs font-bold rounded-full mb-3`}>
                              {event.year}
                            </span>
                            
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-xl bg-gradient-to-br ${event.color} group-hover:scale-110 transition-transform duration-300`}>
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                  {event.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                  {event.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Жилийн туршлага', value: `${new Date().getFullYear() - 2020}+`, icon: Calendar, color: 'from-blue-500 to-blue-600' },
            { label: 'Тендерийн урилга', value: '100+', icon: Award, color: 'from-green-500 to-green-600' },
            { label: 'Сумдын тоо', value: '27', icon: MapPin, color: 'from-purple-500 to-purple-600' },
            { label: 'Ажилтнууд', value: '50+', icon: Users, color: 'from-orange-500 to-orange-600' },
          ].map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                <div className={`h-1.5 bg-gradient-to-r ${stat.color}`} />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <StatIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {!historyContent && events.length === 0 && (
          <Card className="bg-gradient-to-br from-[#24276B]/5 to-[#3d42a0]/5 border border-[#24276B]/20">
            <CardContent className="py-12 text-center">
              <History className="w-16 h-16 mx-auto mb-4 text-[#24276B]/50" />
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
