'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from 'lucide-react';

export function HelpSection() {
  return (
    <Card className="mt-8 border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          Тусламж
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Статик мэдээлэл:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Байгууллагын танилцуулга, эрхэм зорилго, алсын харалт зэрэг мэдээллийг засах</li>
              <li>• Rich text editor ашиглан форматлаж засах боломжтой</li>
              <li>• Title болон content хоёрыг засах боломжтой</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Мэдээ, контентууд:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Мэдээ, мэдээлэл, тендер зарлал нэмэх, засах</li>
              <li>• Зураг, PDF файл хавсаргах боломжтой</li>
              <li>• Ангилал, огноо зэрэг мэдээллийг удирдах</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

