'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Newspaper, Settings } from 'lucide-react';

interface StatisticsCardsProps {
  staticContentsCount: number;
  contentTotal: number;
}

export function StatisticsCards({ staticContentsCount, contentTotal }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">Статик контентууд</CardTitle>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{staticContentsCount}</div>
          <p className="text-xs text-gray-600 mt-1">Нийт статик мэдээлэл</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">Мэдээ, контентууд</CardTitle>
            <Newspaper className="w-5 h-5 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{contentTotal}</div>
          <p className="text-xs text-gray-600 mt-1">Нийт мэдээ, контент</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">Удирдлага</CardTitle>
            <Settings className="w-5 h-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">2</div>
          <p className="text-xs text-gray-600 mt-1">Удирдах хэсэг</p>
        </CardContent>
      </Card>
    </div>
  );
}
