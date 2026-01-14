'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Phone, 
  Mail, 
  MapPin,
  ExternalLink,
  Edit,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export function ContactSection() {
  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-100 rounded-xl">
              <Phone className="w-8 h-8 text-teal-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Холбоо барих мэдээлэл</h3>
              <p className="text-sm text-gray-600 mb-4">
                Холбоо барих хуудасны мэдээллийг шууд код дотор тохируулсан байгаа. 
                Өөрчлөх шаардлагатай бол <code className="bg-gray-200 px-1 rounded">/contact/page.tsx</code> файлыг засна уу.
              </p>
              <Link
                href="/contact"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Хуудас харах
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Details Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-teal-600" />
              Утас
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-gray-900">+976 11-XXXXXX</p>
            <p className="text-xs text-gray-500 mt-1">Ажлын өдрүүдэд</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 text-teal-600" />
              Имэйл
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-gray-900">info@example.gov.mn</p>
            <p className="text-xs text-gray-500 mt-1">Албан хэрэг</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-teal-600" />
              Хаяг
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-gray-900">Улаанбаатар хот</p>
            <p className="text-xs text-gray-500 mt-1">Засгийн газрын байр</p>
          </CardContent>
        </Card>
      </div>

      {/* Working Hours */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            Ажлын цаг
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Даваа - Баасан</p>
              <p className="text-gray-600">09:00 - 18:00</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Бямба</p>
              <p className="text-gray-600">Амарна</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Ням</p>
              <p className="text-gray-600">Амарна</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Үдийн цай</p>
              <p className="text-gray-600">13:00 - 14:00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Note */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Edit className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Засах зааварчилгаа</h4>
            <p className="text-sm text-amber-700 mt-1">
              Холбоо барих мэдээллийг өөрчлөхийн тулд <code className="bg-amber-100 px-1 rounded">src/app/contact/page.tsx</code> файлыг 
              засварлана уу. Тус файл дотор утас, имэйл, хаяг, ажлын цагийн мэдээлэл агуулагдана.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}







