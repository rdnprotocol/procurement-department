"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, Info, Award, Users, Target, TrendingUp, 
  Loader2, Sparkles, CheckCircle2, ArrowRight,
  Globe, Shield, Zap, Heart
} from "lucide-react";
import Link from "next/link";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2, Info, Award, Users, Target, TrendingUp, 
  Globe, Shield, Zap, Heart, Sparkles, CheckCircle2
};

interface SectionItem {
  id: string;
  content: string;
  sort_order: number;
}

interface OrganizationSection {
  id: string;
  section_type: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  sort_order: number;
  items: SectionItem[];
}

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
}

export default function IntroPage() {
  const [sections, setSections] = useState<OrganizationSection[]>([]);
  const [introContent, setIntroContent] = useState<StaticContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sectionsRes, staticRes] = await Promise.all([
        fetch('/api/organization-sections'),
        fetch('/api/static-content')
      ]);

      if (sectionsRes.ok) {
        const data = await sectionsRes.json();
        setSections(data);
      }

      if (staticRes.ok) {
        const staticData = await staticRes.json();
        const intro = staticData.find((s: StaticContent) => s.type === 'intro');
        if (intro) setIntroContent(intro);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const infoCards = sections.filter(s => s.section_type === 'info_card');
  const valuesSection = sections.find(s => s.section_type === 'values');
  const responsibilitiesSection = sections.find(s => s.section_type === 'responsibilities');

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; iconBg: string; iconColor: string; border: string }> = {
      'from-blue-500 to-blue-600': { bg: 'from-blue-50 to-blue-100/50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', border: 'border-blue-200' },
      'from-purple-500 to-purple-600': { bg: 'from-purple-50 to-purple-100/50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', border: 'border-purple-200' },
      'from-green-500 to-green-600': { bg: 'from-green-50 to-green-100/50', iconBg: 'bg-green-100', iconColor: 'text-green-600', border: 'border-green-200' },
      'from-orange-500 to-orange-600': { bg: 'from-orange-50 to-orange-100/50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', border: 'border-orange-200' },
      'from-red-500 to-red-600': { bg: 'from-red-50 to-red-100/50', iconBg: 'bg-red-100', iconColor: 'text-red-600', border: 'border-red-200' },
      'from-teal-500 to-teal-600': { bg: 'from-teal-50 to-teal-100/50', iconBg: 'bg-teal-100', iconColor: 'text-teal-600', border: 'border-teal-200' },
    };
    return colorMap[color] || { bg: 'from-blue-50 to-blue-100/50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', border: 'border-blue-200' };
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
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Info className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Байгууллагын танилцуулга
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Төв аймгийн Худалдан авах ажиллагааны газрын танилцуулга, үйл ажиллагаа, зорилго, харалт
            </p>
          </div>
        </div>

        {/* Main Content from Database */}
        {introContent && (
          <Card className="mb-12 shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Building2 className="w-6 h-6" />
                {introContent.title || "Байгууллагын танилцуулга"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700 prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: introContent.content }}
              />
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        {infoCards.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Байгууллагын үндсэн мэдээлэл
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#24276B] to-[#3d42a0] mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {infoCards.map((info) => {
                const IconComponent = iconMap[info.icon] || Building2;
                const colors = getColorClasses(info.color);
                
                return (
                  <Card
                    key={info.id}
                    className={`group relative overflow-hidden border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${colors.border}`}
                  >
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Top Gradient Bar */}
                    <div className={`h-1.5 bg-gradient-to-r ${info.color}`} />
                    
                    <CardContent className="relative z-10 pt-6 pb-6">
                      <div className={`${colors.iconBg} ${colors.iconColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-800">
                        {info.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {info.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Values and Responsibilities */}
        {(valuesSection || responsibilitiesSection) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {valuesSection && (
              <Card className="shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-shadow duration-500">
                <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Award className="w-6 h-6" />
                    {valuesSection.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-6">
                  <ul className="space-y-4">
                    {valuesSection.items.map((item, index) => (
                      <li 
                        key={item.id} 
                        className="flex items-start gap-4 group/item"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#24276B] to-[#3d42a0] flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 leading-relaxed pt-1">{item.content}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {responsibilitiesSection && (
              <Card className="shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-shadow duration-500">
                <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Users className="w-6 h-6" />
                    {responsibilitiesSection.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-6">
                  <ul className="space-y-4">
                    {responsibilitiesSection.items.map((item, index) => (
                      <li 
                        key={item.id} 
                        className="flex items-start gap-4 group/item"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#24276B] to-[#3d42a0] flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 leading-relaxed pt-1">{item.content}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Бидэнтэй холбогдох
                </h3>
                <p className="text-gray-600 max-w-lg">
                  Худалдан авах ажиллагаатай холбоотой асуулт, санал хүсэлтийг бидэнтэй хуваалцаарай.
                </p>
              </div>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Холбоо барих
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {!introContent && infoCards.length === 0 && (
          <Card className="mt-12 bg-gradient-to-br from-[#24276B]/5 to-[#3d42a0]/5 border border-[#24276B]/20">
            <CardContent className="py-12 text-center">
              <Info className="w-16 h-16 mx-auto mb-4 text-[#24276B]/50" />
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
