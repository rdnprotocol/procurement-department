import type { LucideIcon } from 'lucide-react';
import { 
  Info, 
  Scale, 
  EyeOff, 
  ClipboardList, 
  Shield, 
  Phone 
} from 'lucide-react';

// Local type definition
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

// Menu бүтэц - статик контентуудыг menu-ийн дагуу бүлэглэх
export const staticMenuStructure: Record<string, MenuStructure> = {
  'Бидний тухай': {
    icon: Info,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100/50',
    items: [
      { type: 'mission', href: '/about/mission', label: 'Эрхэм зорилго' },
      { type: 'vision', href: '/about/mission', label: 'Алсын харалт' },
      { type: 'goal', href: '/about/mission', label: 'Стратегийн зорилтууд' },
      { type: 'structure', href: '/about/structure', label: 'Бүтэц, зохион байгуулалт' },
      { type: 'intro', href: '/about/intro', label: 'Байгууллагын танилцуулга' },
      { type: 'history', href: '/about/history', label: 'Түүхэн замнал' },
    ]
  }
};

// Menu бүтэц - Хууль эрх зүй цэсийн category-ууд
export const lawMenuStructure: Record<string, MenuStructure> = {
  'Хууль, Эрх зүй': {
    icon: Scale,
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-50 to-green-100/50',
    items: [
      {
        categoryHref: 'huuli-togtoomj',
        label: 'Хууль тогтоомж',
        parentTitle: 'Худалдан авах ажиллагааны талаар хууль тогтоомж',
        href: '/category/huuli-togtoomj'
      },
      {
        categoryHref: 'baiguullagiin-huuli-togtoomj',
        label: 'Хууль тогтоомж',
        parentTitle: 'Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомж',
        href: '/category/baiguullagiin-huuli-togtoomj',
        description: 'Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомжууд'
      },
      {
        categoryHref: 'dargiin-tushaal',
        label: 'Газрын даргын тушаал',
        parentTitle: 'Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомж',
        href: '/category/dargiin-tushaal',
        description: 'Газрын даргын гаргасан тушаал, шийдвэрүүд'
      }
    ]
  }
};

// Menu бүтэц - Ил тод байдал цэсийн category-ууд
export const activitiesMenuStructure: Record<string, MenuStructure> = {
  'Ил тод байдал': {
    icon: EyeOff,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100/50',
    items: [
      {
        categoryHref: 'strateg-tolovlogoo-tailan',
        label: 'Бодлогын баримт бичиг, хууль тогтоомж',
        parentTitle: 'Үйл ажиллагааны ил тод байдал',
        href: '/category/strateg-tolovlogoo-tailan',
        description: 'Бодлогын баримт бичиг, хууль тогтоомж'
      },
      {
        categoryHref: 'strateg-tolovlogoo',
        label: 'Стратеги төлөвлөгөө',
        parentTitle: 'Үйл ажиллагааны ил тод байдал',
        href: '/category/strateg-tolovlogoo',
        description: 'Стратеги төлөвлөгөө'
      },
      {
        categoryHref: 'tolovlogoo-tailan',
        label: 'Төлөвлөгөө, тайлан',
        parentTitle: 'Үйл ажиллагааны ил тод байдал',
        href: '/category/tolovlogoo-tailan',
        description: 'Төлөвлөгөө, тайлан'
      }
    ]
  }
};

// Menu бүтэц - Тендер цэсийн category-ууд
export const tenderMenuStructure: Record<string, MenuStructure> = {
  'Тендер': {
    icon: ClipboardList,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'from-orange-50 to-orange-100/50',
    items: [
      {
        categoryHref: 'tolovlogoo-tailan',
        label: 'Төлөвлөгөө, тайлан',
        parentTitle: 'Тендер',
        href: '/category/tolovlogoo-tailan',
        description: 'Төлөвлөгөө, тайлан'
      }
    ]
  }
};

// Menu бүтэц - Авилгын эсрэг цэсийн category-ууд
export const anticorruptionMenuStructure: Record<string, MenuStructure> = {
  'Авилгын эсрэг': {
    icon: Shield,
    color: 'from-red-500 to-red-600',
    bgColor: 'from-red-50 to-red-100/50',
    items: [
      {
        categoryHref: 'at-tolovlogoo-tailan',
        label: 'Төлөвлөгөө, тайлан',
        parentTitle: 'Авилгын эсрэг',
        href: '/category/at-tolovlogoo-tailan',
        description: 'Төлөвлөгөө, тайлан'
      },
      {
        categoryHref: 'hasum-report',
        label: 'Хасум хянасан дүгнэлт',
        parentTitle: 'Авилгын эсрэг',
        href: '/category/hasum-report',
        description: 'Хасум хянасан дүгнэлт'
      }
    ]
  }
};

// Menu бүтэц - Холбоо барих
export const contactMenuStructure: Record<string, MenuStructure> = {
  'Холбоо барих': {
    icon: Phone,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'from-teal-50 to-teal-100/50',
    items: [
      {
        categoryHref: null,
        label: 'Холбоо барих',
        parentTitle: 'Холбоо барих',
        href: '/contact',
        description: 'Байгууллагын холбоо барих мэдээлэл'
      }
    ]
  }
};

