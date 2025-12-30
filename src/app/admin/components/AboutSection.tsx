'use client';

import { ContentCard } from "@/components/ContentCard";
import { CreateStaticContent } from "@/components/CreateStaticContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target, 
  Eye, 
  TrendingUp, 
  Building2, 
  Info, 
  History,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { StaticContent } from '../types';

interface AboutSectionProps {
  staticContents: StaticContent[];
  onUpdate: () => void;
}

const aboutItems = [
  { type: 'mission', label: 'Эрхэм зорилго', icon: Target, color: 'blue' },
  { type: 'vision', label: 'Алсын харалт', icon: Eye, color: 'purple' },
  { type: 'goal', label: 'Стратегийн зорилтууд', icon: TrendingUp, color: 'green' },
  { type: 'structure', label: 'Бүтэц, зохион байгуулалт', icon: Building2, color: 'orange' },
  { type: 'intro', label: 'Байгууллагын танилцуулга', icon: Info, color: 'teal' },
  { type: 'history', label: 'Түүхэн замнал', icon: History, color: 'rose' },
];

export function AboutSection({ staticContents, onUpdate }: AboutSectionProps) {
  const getContent = (type: string) => staticContents.find(c => c.type === type);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aboutItems.map((item) => {
          const Icon = item.icon;
          const content = getContent(item.type);
          const hasContent = !!content;

          return (
            <Card 
              key={item.type} 
              className={`border-0 shadow-md hover:shadow-lg transition-shadow ${
                hasContent ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-${item.color}-100`}>
                      <Icon className={`w-4 h-4 text-${item.color}-600`} />
                    </div>
                    {item.label}
                  </CardTitle>
                  {hasContent ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {content ? (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">
                      Сүүлд шинэчилсэн: {new Date(content.updated_at).toLocaleDateString('mn-MN')}
                    </p>
                    <ContentCard 
                      content={content}
                      onUpdate={onUpdate}
                    />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-3">Контент оруулаагүй</p>
                    <CreateStaticContent 
                      onSuccess={onUpdate}
                      defaultType={item.type}
                    />
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

