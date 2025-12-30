'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ContentCard } from "@/components/ContentCard";
import CreateNewsForm from '@/components/CreateNewsForm';
import { CreateStaticContent } from "@/components/CreateStaticContent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle } from 'lucide-react';
import { MenuGroup, MenuItem } from '../types';
import { LawDocumentsSection } from './LawDocumentsSection';

interface MenuTabContentProps {
  group: MenuGroup;
  fetchContents: () => void;
}

export function MenuTabContent({ group, fetchContents }: MenuTabContentProps) {
  const { menuTitle, MenuIcon, items, id } = group;

  return (
    <div className="space-y-4">
      <div className={`bg-gradient-to-r ${group.menuData.color} text-white p-4 rounded-lg`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <MenuIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{menuTitle}</h3>
            <p className="text-sm text-white/90">
              {items.some((item: MenuItem) => 'content' in item && item.content)
                ? `${items.filter((item: MenuItem) => 'content' in item && item.content).length} / ${items.length} контент`
                : `${items.reduce((sum: number, item: MenuItem) => sum + (item.contents?.length || 0), 0)} контент`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Law Documents Manager - Only show on law tab */}
      {id === 'law' && <LawDocumentsSection />}
      
      <Accordion type="multiple" className="w-full">
        {items.map((item: MenuItem, itemIndex: number) => {
          const Icon = item.icon;
          const content = 'content' in item ? item.content : null;
          const contents = 'contents' in item ? (item.contents || []) : [];
          
          return (
            <AccordionItem 
              key={itemIndex} 
              value={`item-${id}-${itemIndex}`}
              className="border-b last:border-b-0"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center gap-3 flex-1 text-left">
                  <div className={`p-2 rounded-lg ${
                    (content || (contents && contents.length > 0))
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">
                        {item.label}
                      </span>
                      {(content || (contents && contents.length > 0)) && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {content ? 'Засах боломжтой' : `${contents.length} контент`}
                        </span>
                      )}
                      {!content && (!contents || contents.length === 0) && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                          Контент байхгүй
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.href} • {content 
                        ? `Сүүлд шинэчилсэн: ${new Date(content.updated_at).toLocaleDateString('mn-MN')}`
                        : item.description || item.parentTitle || 'Контент нэмэх шаардлагатай'
                      }
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                {content ? (
                  <div className="pt-2">
                    <ContentCard 
                      content={content}
                      onUpdate={fetchContents}
                    />
                  </div>
                ) : (contents && contents.length > 0) ? (
                  <div className="pt-2 space-y-2">
                    <div className="text-sm font-medium text-gray-700 mb-3">
                      Энэ category-д {contents.length} контент байна. Бүх контентуудыг харах, засах:
                    </div>
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Category:</strong> {item.category?.mongolian_name || item.label}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Холбоос:</strong> <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{item.href}</a>
                      </p>
                      <div className="flex gap-2">
                        <a 
                          href={item.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                        >
                          Хуудас харах
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                    <CardContent className="py-8 text-center">
                      <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Контент олдсонгүй
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {content ? 'Энэ хуудасны контентийг нэмэх шаардлагатай' : 'Энэ category-д контент нэмэх шаардлагатай'}
                      </p>
                      {content ? (
                        <CreateStaticContent onSuccess={fetchContents} />
                      ) : (
                        <CreateNewsForm />
                      )}
                    </CardContent>
                  </Card>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

