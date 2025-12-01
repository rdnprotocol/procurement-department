'use client';

import { EditStaticContent } from './EditStaticContent';

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
  updated_at: string;
}

interface StaticContentsSectionProps {
  contents: StaticContent[];
}

export function StaticContentsSection({ contents }: StaticContentsSectionProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Цэсний контентууд</h2>
      <div className="grid gap-6">
        {contents?.map((content) => (
          <EditStaticContent 
            key={content.id} 
            content={content}
          />
        ))}
      </div>
    </div>
  );
}