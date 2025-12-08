import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileText, BookOpen, Gavel, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Хууль, Эрх зүй | Худалдан авах ажиллагааны газар",
  description: "Худалдан авах ажиллагааны болон байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомжууд",
};

export default function LawPage() {
  const lawCategories = [
    {
      title: "Худалдан авах ажиллагааны талаар хууль тогтоомж",
      description: "Төрийн болон орон нутгийн өмчийн хөрөнгөөр бараа, ажил, үйлчилгээ худалдан авах тухай хуулиуд",
      icon: Scale,
      href: "/law/procurement",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100/50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      items: [
        { title: "Хууль тогтоомж", href: "/category/huuli-togtoomj" },
        { title: "Жишиг баримт бичиг", href: "https://www.tender.gov.mn/mn/document/list", external: true },
      ],
    },
    {
      title: "Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомж",
      description: "Байгууллагын өдөр тутмын үйл ажиллагаанд хамаарах дүрэм, журам, тушаалууд",
      icon: BookOpen,
      href: "/law/organization",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100/50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      items: [
        { title: "Хууль тогтоомж", href: "/category/baiguullagiin-huuli-togtoomj" },
        { title: "Газрын даргын тушаал", href: "/category/dargiin-tushaal" },
      ],
    },
  ];

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
          {lawCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <CardHeader className={`bg-gradient-to-r ${category.color} text-white`}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">
                        {category.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-6">
                    {category.description}
                  </p>

                  {/* Sub items */}
                  <div className="space-y-3 mb-6">
                    {category.items.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group/item"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <span className="font-medium text-gray-700">{item.title}</span>
                        </div>
                        {item.external ? (
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover/item:text-gray-600" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover/item:text-gray-600 group-hover/item:translate-x-1 transition-transform" />
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* View all link */}
                  <Link
                    href={category.href}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${category.color} text-white font-medium hover:opacity-90 transition-opacity`}
                  >
                    Дэлгэрэнгүй үзэх
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
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

