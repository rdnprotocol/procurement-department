'use client';

import { Card, CardContent } from "@/components/ui/card";
import { CreateStaticContent } from "@/components/CreateStaticContent";
import { Edit, AlertCircle } from 'lucide-react';
import { StaticContent, MenuGroup } from '../types';
import { MenuTabsNavigation } from './MenuTabsNavigation';
import { MenuTabContent } from './MenuTabContent';

interface StaticTabProps {
  staticContents: StaticContent[];
  allMenuGroups: MenuGroup[];
  activeMenuTab: string;
  setActiveMenuTab: (tab: string) => void;
  fetchContents: () => void;
}

export function StaticTab({ 
  staticContents, 
  allMenuGroups, 
  activeMenuTab, 
  setActiveMenuTab, 
  fetchContents 
}: StaticTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Edit className="w-6 h-6 text-[#24276B]" />
            Засах боломжтой статик контентууд
          </h2>
          <span className="text-sm text-gray-500">
            {staticContents.length} контент
          </span>
        </div>

        {staticContents && staticContents.length > 0 ? (
          <div className="space-y-6">
            <MenuTabsNavigation 
              allMenuGroups={allMenuGroups}
              activeMenuTab={activeMenuTab}
              setActiveMenuTab={setActiveMenuTab}
            />

            {allMenuGroups.map((group) => {
              if (activeMenuTab !== group.id) return null;
              
              return (
                <MenuTabContent 
                  key={group.id}
                  group={group}
                  fetchContents={fetchContents}
                />
              );
            })}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Статик контент олдсонгүй
              </h3>
              <p className="text-gray-600 mb-4">
                Шинэ статик контент нэмэх товч дараад нэмнэ үү.
              </p>
              <CreateStaticContent onSuccess={fetchContents} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

