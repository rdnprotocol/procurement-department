'use client';

import { FileText, Newspaper } from 'lucide-react';
import { ContentStats } from '../types';

interface MainTabsProps {
  activeTab: 'static' | 'content';
  setActiveTab: (tab: 'static' | 'content') => void;
  staticContentsCount: number;
  contentStats: ContentStats;
}

export function MainTabs({ activeTab, setActiveTab, staticContentsCount, contentStats }: MainTabsProps) {
  return (
    <div className="mb-6">
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('static')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'static'
              ? 'text-[#24276B] border-b-2 border-[#24276B]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Статик мэдээлэл
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
              {staticContentsCount}
            </span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'content'
              ? 'text-[#24276B] border-b-2 border-[#24276B]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            Мэдээ, контентууд
            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
              {contentStats.total}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

