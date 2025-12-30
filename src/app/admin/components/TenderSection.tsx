'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  ExternalLink,
  Plus,
  ClipboardList,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import CreateNewsForm from '@/components/CreateNewsForm';
import { ContentData } from '../types';
import { Category } from '@/utils/category';

interface TenderSectionProps {
  allContents: ContentData[];
}

export function TenderSection({ allContents }: TenderSectionProps) {
  const category = Category.find(c => c.href === 'tolovlogoo-tailan');
  const contents = category 
    ? allContents.filter(c => c.category_id === category.id) 
    : [];

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <ClipboardList className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{contents.length}</div>
                <div className="text-gray-600">Нийт төлөвлөгөө, тайлан</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Шинэ нэмэх</h3>
                <p className="text-sm text-gray-500">Төлөвлөгөө, тайлан оруулах</p>
              </div>
              <CreateNewsForm 
                defaultCategoryId={category?.id}
                buttonText={<><Plus className="w-4 h-4" /> Нэмэх</>}
                buttonClassName="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Төлөвлөгөө, тайлан
            </CardTitle>
            <Link
              href="/category/tolovlogoo-tailan"
              target="_blank"
              className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Бүгдийг харах
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {contents.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {contents.map((content) => (
                <div 
                  key={content.id} 
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FileText className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{content.title}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(content.created_date).toLocaleDateString('mn-MN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Контент байхгүй байна</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



