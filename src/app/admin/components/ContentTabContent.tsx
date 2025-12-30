'use client';

import { AdminContentsTable } from "@/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Newspaper } from 'lucide-react';

interface ContentTabContentProps {
  contentTotal: number;
}

export function ContentTabContent({ contentTotal }: ContentTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Edit className="w-6 h-6 text-purple-600" />
            Засах боломжтой мэдээ, контентууд
          </h2>
          <span className="text-sm text-gray-500">
            {contentTotal} контент
          </span>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardTitle className="text-xl flex items-center gap-2">
              <Newspaper className="w-6 h-6" />
              Бүх мэдээ, контентууд
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AdminContentsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



