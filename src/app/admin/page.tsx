'use client';

import { useEffect, useState } from 'react';
import { Container } from "@/components/assets";
import { ContentCard } from "@/components/ContentCard";
import CreateNewsForm from '@/components/CreateNewsForm';
import { AdminContentsTable } from "@/components";
import { CreateStaticContent } from "@/components/CreateStaticContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Newspaper, 
  Settings, 
  Edit, 
  BarChart3,
  Target,
  Eye,
  TrendingUp,
  History,
  Building2,
  Info,
  CheckCircle2,
  AlertCircle,
  Scale,
  FileCheck,
  EyeOff,
  ClipboardList,
  Shield,
  Phone
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Category } from "@/utils/category";

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
  updated_at: string;
}

interface ContentStats {
  total: number;
  byCategory: Record<string, number>;
}

interface MenuItem {
  type?: string;
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  content?: StaticContent;
  contents?: ContentData[];
  category?: { id: number; mongolian_name: string; href: string } | null;
  categoryId?: number;
  categoryHref?: string | null;
  parentTitle?: string;
  description?: string;
}

interface ContentData {
  id: number;
  title: string;
  category_id: number | null;
  created_date: string;
}

export default function AdminPage() {
  const [staticContents, setStaticContents] = useState<StaticContent[]>([]);
  const [allContents, setAllContents] = useState<ContentData[]>([]);
  const [contentStats, setContentStats] = useState<ContentStats>({ total: 0, byCategory: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'static' | 'content'>('static');
  const [activeMenuTab, setActiveMenuTab] = useState<string>('about');

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/static-content');
      if (!response.ok) {
        throw new Error('Failed to fetch contents');
      }
      const data = await response.json();
      setStaticContents(data);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContentStats = async () => {
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        const data: ContentData[] = await response.json();
        setAllContents(data);
        setContentStats({
          total: data.length || 0,
          byCategory: {}
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchContents();
    fetchContentStats();
  }, []);

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


  // Menu бүтэц - статик контентуудыг menu-ийн дагуу бүлэглэх
  const staticMenuStructure = {
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
  const lawMenuStructure = {
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
  const activitiesMenuStructure = {
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
  const tenderMenuStructure = {
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
  const anticorruptionMenuStructure = {
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
  const contactMenuStructure = {
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

  // Статик контентуудыг menu-ийн дагуу бүлэглэх
  const groupedStaticContents = Object.entries(staticMenuStructure).map(([menuTitle, menuData]) => {
    const MenuIcon = menuData.icon;
    const menuItems = menuData.items.map(item => {
      const content = staticContents.find(c => c.type === item.type);
      return {
        ...item,
        content,
        icon: getTypeIcon(item.type)
      };
    });

    return {
      menuTitle,
      MenuIcon,
      menuData,
      items: menuItems
    };
  });

  // Хууль эрх зүй цэсийн category-уудыг menu-ийн дагуу бүлэглэх
  const groupedLawContents = Object.entries(lawMenuStructure).map(([menuTitle, menuData]) => {
    const MenuIcon = menuData.icon;
    const menuItems = menuData.items.map(item => {
      const category = Category.find(cat => cat.href === item.categoryHref);
      const categoryId = category?.id;
      const contents = categoryId ? allContents.filter(c => c.category_id === categoryId) : [];
      
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

  // Ил тод байдал цэсийн category-уудыг menu-ийн дагуу бүлэглэх
  const groupedActivitiesContents = Object.entries(activitiesMenuStructure).map(([menuTitle, menuData]) => {
    const MenuIcon = menuData.icon;
    const menuItems = menuData.items.map(item => {
      const category = item.categoryHref ? Category.find(cat => cat.href === item.categoryHref) : null;
      const categoryId = category?.id;
      const contents = categoryId ? allContents.filter(c => c.category_id === categoryId) : [];
      
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

  // Тендер цэсийн category-уудыг menu-ийн дагуу бүлэглэх
  const groupedTenderContents = Object.entries(tenderMenuStructure).map(([menuTitle, menuData]) => {
    const MenuIcon = menuData.icon;
    const menuItems = menuData.items.map(item => {
      const category = item.categoryHref ? Category.find(cat => cat.href === item.categoryHref) : null;
      const categoryId = category?.id;
      const contents = categoryId ? allContents.filter(c => c.category_id === categoryId) : [];
      
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

  // Авилгын эсрэг цэсийн category-уудыг menu-ийн дагуу бүлэглэх
  const groupedAnticorruptionContents = Object.entries(anticorruptionMenuStructure).map(([menuTitle, menuData]) => {
    const MenuIcon = menuData.icon;
    const menuItems = menuData.items.map(item => {
      const category = item.categoryHref ? Category.find(cat => cat.href === item.categoryHref) : null;
      const categoryId = category?.id;
      const contents = categoryId ? allContents.filter(c => c.category_id === categoryId) : [];
      
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

  // Холбоо барих цэсийн category-уудыг menu-ийн дагуу бүлэглэх
  const groupedContactContents = Object.entries(contactMenuStructure).map(([menuTitle, menuData]) => {
    const MenuIcon = menuData.icon;
    const menuItems = menuData.items.map(item => {
      const category = item.categoryHref ? Category.find(cat => cat.href === item.categoryHref) : null;
      const categoryId = category?.id;
      const contents = categoryId ? allContents.filter(c => c.category_id === categoryId) : [];
      
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

  // Бүх menu-уудыг цуглуулах (tab-уудын хувьд)
  const allMenuGroups = [
    ...groupedStaticContents.map(g => ({ ...g, id: 'about' })),
    ...groupedLawContents.map(g => ({ ...g, id: 'law' })),
    ...groupedActivitiesContents.map(g => ({ ...g, id: 'activities' })),
    ...groupedTenderContents.map(g => ({ ...g, id: 'tender' })),
    ...groupedAnticorruptionContents.map(g => ({ ...g, id: 'anticorruption' })),
    ...groupedContactContents.map(g => ({ ...g, id: 'contact' }))
  ];

  if (isLoading) {
    return (
      <Container>
        <div className="py-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Уншиж байна...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
          <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#24276B] to-[#3d42a0] bg-clip-text text-transparent">
                Админ удирдлага
              </h1>
              <p className="text-gray-600">Бүх контентуудыг удирдах, засах, нэмэх</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Систем идэвхтэй</span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Статик контентууд</CardTitle>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{staticContents.length}</div>
              <p className="text-xs text-gray-600 mt-1">Нийт статик мэдээлэл</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Мэдээ, контентууд</CardTitle>
                <Newspaper className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{contentStats.total}</div>
              <p className="text-xs text-gray-600 mt-1">Нийт мэдээ, контент</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Удирдлага</CardTitle>
                <Settings className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">2</div>
              <p className="text-xs text-gray-600 mt-1">Удирдах хэсэг</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
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
                  {staticContents.length}
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
        
        {/* Tab Content */}
        {activeTab === 'static' && (
          <div className="space-y-6">
            {/* Static Contents List - Menu бүтцийн дагуу */}
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
                  {/* Menu Tabs */}
                  <div className="border-b border-gray-200">
                    <div className="flex gap-2 overflow-x-auto">
                      {allMenuGroups.map((group) => {
                        const { menuTitle, MenuIcon, items, id } = group;
                        const itemCount = items.some((item: MenuItem) => 'content' in item && item.content) 
                          ? items.filter((item: MenuItem) => 'content' in item && item.content).length 
                          : items.reduce((sum: number, item: MenuItem) => sum + (item.contents?.length || 0), 0);
                        
                        return (
                          <button
                            key={id}
                            onClick={() => setActiveMenuTab(id)}
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

                  {/* Tab Content */}
                  {allMenuGroups.map((group) => {
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
        )}

        {/* Remove all old accordion code - replaced with tab system above - all old code removed */}

        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Contents List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  <Edit className="w-6 h-6 text-purple-600" />
                  Засах боломжтой мэдээ, контентууд
                </h2>
                <span className="text-sm text-gray-500">
                  {contentStats.total} контент
                </span>
              </div>

              {/* Бүх контентуудыг харах хэсэг */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Newspaper className="w-6 h-6" />
                    Бүх мэдээ, контентууд
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <AdminContentsTable />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              Тусламж
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Статик мэдээлэл:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Байгууллагын танилцуулга, эрхэм зорилго, алсын харалт зэрэг мэдээллийг засах</li>
                  <li>• Rich text editor ашиглан форматлаж засах боломжтой</li>
                  <li>• Title болон content хоёрыг засах боломжтой</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Мэдээ, контентууд:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Мэдээ, мэдээлэл, тендер зарлал нэмэх, засах</li>
                  <li>• Зураг, PDF файл хавсаргах боломжтой</li>
                  <li>• Ангилал, огноо зэрэг мэдээллийг удирдах</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
