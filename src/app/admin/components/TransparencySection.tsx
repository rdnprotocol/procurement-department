'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  ClipboardList, 
  BarChart3,
  ExternalLink,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import CreateNewsForm from '@/components/CreateNewsForm';
import { ContentData } from '../types';
import { Category } from '@/utils/category';

interface TransparencySectionProps {
  allContents: ContentData[];
}

const transparencyCategories = [
  { 
    categoryHref: 'strateg-tolovlogoo-tailan',
    label: 'Бодлогын баримт бичиг, хууль тогтоомж',
    description: 'Бодлогын баримт бичиг, хууль тогтоомж',
    icon: FileText,
    color: 'blue'
  },
  { 
    categoryHref: 'strateg-tolovlogoo',
    label: 'Стратеги төлөвлөгөө',
    description: 'Стратеги төлөвлөгөө',
    icon: ClipboardList,
    color: 'purple'
  },
  { 
    categoryHref: 'tolovlogoo-tailan',
    label: 'Төлөвлөгөө, тайлан',
    description: 'Төлөвлөгөө, тайлан',
    icon: BarChart3,
    color: 'green'
  },
];

export function TransparencySection({ allContents }: TransparencySectionProps) {
  const getContentsForCategory = (categoryHref: string) => {
    const category = Category.find(cat => cat.href === categoryHref);
    if (!category) return [];
    return allContents.filter(c => c.category_id === category.id);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {transparencyCategories.map((cat) => {
          const Icon = cat.icon;
          const contents = getContentsForCategory(cat.categoryHref);
          const category = Category.find(c => c.href === cat.categoryHref);

          return (
            <Card key={cat.categoryHref} className="border-0 shadow-md">
              <CardHeader className={`bg-gradient-to-r from-${cat.color}-500 to-${cat.color}-600 text-white rounded-t-lg`}>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-900">{contents.length}</div>
                  <p className="text-xs text-gray-500">Нийт контент</p>
                </div>
                
                {contents.length > 0 && (
                  <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                    {contents.slice(0, 3).map((content) => (
                      <div key={content.id} className="text-xs p-2 bg-gray-50 rounded truncate">
                        {content.title}
                      </div>
                    ))}
                    {contents.length > 3 && (
                      <p className="text-xs text-gray-400 text-center">
                        +{contents.length - 3} бусад...
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    href={`/category/${cat.categoryHref}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Харах
                  </Link>
                  <CreateNewsForm 
                    defaultCategoryId={category?.id}
                    buttonText={<><Plus className="w-3 h-3" /> Нэмэх</>}
                    buttonClassName="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700 transition-colors"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}



