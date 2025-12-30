'use client';

import { Edit } from 'lucide-react';
import { MenuGroup, MenuItem, StaticContent, ContentData } from '../types';
import { MenuTabs } from './MenuTabs';
import { LawDocumentsSection } from './LawDocumentsSection';
import { AboutSection } from './AboutSection';
import { TransparencySection } from './TransparencySection';
import { TenderSection } from './TenderSection';
import { AnticorruptionSection } from './AnticorruptionSection';
import { ContactSection } from './ContactSection';

interface StaticTabContentProps {
  staticContentsCount: number;
  staticContents: StaticContent[];
  allContents: ContentData[];
  menuGroups: MenuGroup[];
  activeMenuTab: string;
  onMenuTabChange: (id: string) => void;
  onUpdate: () => void;
}

export function StaticTabContent({
  staticContentsCount,
  staticContents,
  allContents,
  menuGroups,
  activeMenuTab,
  onMenuTabChange,
  onUpdate
}: StaticTabContentProps) {
  
  // Tab тус бүрт харуулах section
  const renderSectionContent = (id: string) => {
    switch (id) {
      case 'about':
        return <AboutSection staticContents={staticContents} onUpdate={onUpdate} />;
      case 'law':
        return <LawDocumentsSection />;
      case 'activities':
        return <TransparencySection allContents={allContents} />;
      case 'tender':
        return <TenderSection allContents={allContents} />;
      case 'anticorruption':
        return <AnticorruptionSection allContents={allContents} />;
      case 'contact':
        return <ContactSection />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Edit className="w-6 h-6 text-[#24276B]" />
            Засах боломжтой контентууд
          </h2>
          <span className="text-sm text-gray-500">
            {staticContentsCount} статик контент
          </span>
        </div>

        <div className="space-y-6">
          <MenuTabs
            menuGroups={menuGroups}
            activeMenuTab={activeMenuTab}
            onTabChange={onMenuTabChange}
          />

          {menuGroups.map((group) => {
            const { menuTitle, MenuIcon, items, id } = group;
            
            if (activeMenuTab !== id) return null;
            
            return (
              <div key={id} className="space-y-4">
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

                {renderSectionContent(id)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
