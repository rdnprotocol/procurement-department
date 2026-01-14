'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  ExternalLink,
  Plus,
  Shield,
  ClipboardCheck,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import CreateNewsForm from '@/components/CreateNewsForm';
import { ContentData } from '../types';
import { Category } from '@/utils/category';

interface AnticorruptionSectionProps {
  allContents: ContentData[];
}

const anticorruptionCategories = [
  { 
    categoryHref: 'at-tolovlogoo-tailan',
    label: 'Төлөвлөгөө, тайлан',
    description: 'Авилгын эсрэг төлөвлөгөө, тайлан',
    icon: ClipboardCheck,
    color: 'red'
  },
  { 
    categoryHref: 'hasum-report',
    label: 'ХАСУМ хянасан дүгнэлт',
    description: 'Хувийн ашиг сонирхлын мэдүүлэг хянасан дүгнэлт',
    icon: FileText,
    color: 'rose'
  },
];

export function AnticorruptionSection({ allContents }: AnticorruptionSectionProps) {
  const getContentsForCategory = (categoryHref: string) => {
    const category = Category.find(cat => cat.href === categoryHref);
    if (!category) return [];
    return allContents.filter(c => c.category_id === category.id);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {anticorruptionCategories.map((cat) => {
          const Icon = cat.icon;
          const contents = getContentsForCategory(cat.categoryHref);
          
          return (
            <Card key={cat.categoryHref} className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <Icon className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{contents.length}</div>
                    <div className="text-gray-600 text-sm">{cat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {anticorruptionCategories.map((cat) => {
          const Icon = cat.icon;
          const contents = getContentsForCategory(cat.categoryHref);
          const category = Category.find(c => c.href === cat.categoryHref);

          return (
            <Card key={cat.categoryHref} className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    {cat.label}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/category/${cat.categoryHref}`}
                      target="_blank"
                      className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <CreateNewsForm 
                      defaultCategoryId={category?.id}
                      buttonText={<Plus className="w-4 h-4" />}
                      buttonClassName="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {contents.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {contents.map((content) => (
                      <div 
                        key={content.id} 
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-red-600 flex-shrink-0" />
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
                  <div className="text-center py-6">
                    <Shield className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Контент байхгүй</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}







