'use client';

import { useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { 
  FileText, 
  Target, 
  Eye, 
  TrendingUp, 
  History, 
  Building2, 
  Info,
  FileCheck
} from 'lucide-react';
import { Category } from '@/utils/category';
import { StaticContent, ContentData, MenuGroup } from '../types';
import {
  staticMenuStructure,
  lawMenuStructure,
  activitiesMenuStructure,
  tenderMenuStructure,
  anticorruptionMenuStructure,
  contactMenuStructure
} from '../config/menuStructure';

// Local types for menu structure
interface MenuStructureItem {
  type?: string;
  categoryHref?: string | null;
  label: string;
  href: string;
  parentTitle?: string;
  description?: string;
}

interface MenuStructure {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  items: MenuStructureItem[];
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'mission':
      return Target;
    case 'vision':
      return Eye;
    case 'goal':
      return TrendingUp;
    case 'history':
      return History;
    case 'structure':
      return Building2;
    case 'intro':
      return Info;
    default:
      return FileText;
  }
};

function groupStaticContents(
  menuStructure: Record<string, MenuStructure>,
  staticContents: StaticContent[]
) {
  return Object.entries(menuStructure).map(([menuTitle, menuData]) => {
    const MenuIcon = menuData.icon;
    const menuItems = menuData.items.map((item: MenuStructureItem) => {
      const content = item.type 
        ? staticContents.find(c => c.type === item.type) 
        : undefined;
      return {
        ...item,
        content,
        icon: item.type ? getTypeIcon(item.type) : FileCheck
      };
    });

    return {
      menuTitle,
      MenuIcon,
      menuData,
      items: menuItems
    };
  });
}

function groupCategoryContents(
  menuStructure: Record<string, MenuStructure>,
  allContents: ContentData[]
) {
  return Object.entries(menuStructure).map(([menuTitle, menuData]) => {
    const MenuIcon = menuData.icon;
    const menuItems = menuData.items.map((item: MenuStructureItem) => {
      const category = item.categoryHref 
        ? Category.find(cat => cat.href === item.categoryHref) 
        : null;
      const categoryId = category?.id;
      const contents = categoryId 
        ? allContents.filter(c => c.category_id === categoryId) 
        : [];
      
      return {
        ...item,
        category,
        categoryId,
        contents,
        icon: FileCheck
      };
    });

    return {
      menuTitle,
      MenuIcon,
      menuData,
      items: menuItems
    };
  });
}

export function useMenuGroups(
  staticContents: StaticContent[],
  allContents: ContentData[]
): MenuGroup[] {
  return useMemo(() => {
    // Статик контентууд
    const groupedStaticContents = groupStaticContents(staticMenuStructure, staticContents);

    // Category-д суурилсан контентууд
    const groupedLawContents = groupCategoryContents(lawMenuStructure, allContents);
    const groupedActivitiesContents = groupCategoryContents(activitiesMenuStructure, allContents);
    const groupedTenderContents = groupCategoryContents(tenderMenuStructure, allContents);
    const groupedAnticorruptionContents = groupCategoryContents(anticorruptionMenuStructure, allContents);
    const groupedContactContents = groupCategoryContents(contactMenuStructure, allContents);

    // Бүх menu-уудыг цуглуулах
    return [
      ...groupedStaticContents.map(g => ({ ...g, id: 'about' })),
      ...groupedLawContents.map(g => ({ ...g, id: 'law' })),
      ...groupedActivitiesContents.map(g => ({ ...g, id: 'activities' })),
      ...groupedTenderContents.map(g => ({ ...g, id: 'tender' })),
      ...groupedAnticorruptionContents.map(g => ({ ...g, id: 'anticorruption' })),
      ...groupedContactContents.map(g => ({ ...g, id: 'contact' }))
    ];
  }, [staticContents, allContents]);
}
