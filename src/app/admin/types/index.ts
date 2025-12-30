import type { LucideIcon } from 'lucide-react';

export interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
  updated_at: string;
}

export interface ContentStats {
  total: number;
  byCategory: Record<string, number>;
}

export interface ContentData {
  id: number;
  title: string;
  category_id: number | null;
  created_date: string;
}

export interface CategoryData {
  id: number;
  mongolian_name: string;
  href: string;
}

export interface MenuItem {
  type?: string;
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  content?: StaticContent;
  contents?: ContentData[];
  category?: CategoryData | null;
  categoryId?: number;
  categoryHref?: string | null;
  parentTitle?: string;
  description?: string;
}

export interface MenuStructureItem {
  type?: string;
  categoryHref?: string | null;
  label: string;
  href: string;
  parentTitle?: string;
  description?: string;
}

export interface MenuStructure {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  items: MenuStructureItem[];
}

export interface MenuGroup {
  id: string;
  menuTitle: string;
  MenuIcon: LucideIcon;
  menuData: MenuStructure;
  items: MenuItem[];
}

