'use client';

import { MenuItem, MenuGroup } from '../types';

interface MenuTabsProps {
  menuGroups: MenuGroup[];
  activeMenuTab: string;
  onTabChange: (id: string) => void;
}

export function MenuTabs({ menuGroups, activeMenuTab, onTabChange }: MenuTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-2 overflow-x-auto">
        {menuGroups.map((group) => {
          const { menuTitle, MenuIcon, items, id } = group;
          const itemCount = items.some((item: MenuItem) => 'content' in item && item.content) 
            ? items.filter((item: MenuItem) => 'content' in item && item.content).length 
            : items.reduce((sum: number, item: MenuItem) => sum + (item.contents?.length || 0), 0);
          
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
                activeMenuTab === id
                  ? 'text-[#24276B] border-[#24276B]'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <MenuIcon className="w-4 h-4" />
                {menuTitle}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeMenuTab === id
                    ? 'bg-[#24276B]/10 text-[#24276B]'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {itemCount}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}







