'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Newspaper, 
  Edit3,
  Plus,
  Trash2,
  Eye,
  Search,
  LayoutDashboard,
  Info,
  Scale,
  Shield,
  ClipboardList,
  ChevronRight,
  ChevronDown,
  LogOut,
  RefreshCw,
  ExternalLink,
  Building2,
  Save,
  X,
  Clock
} from 'lucide-react';
import { Category } from "@/utils/category";
import { useRouter } from 'next/navigation';

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
  updated_at: string;
}

interface ContentData {
  id: number;
  title: string;
  description?: string;
  category_id: number | null;
  created_date: string;
  banner_image?: string;
}

interface MenuItem {
  title: string;
  href: string;
  type: 'static' | 'category' | 'departments' | 'org_sections' | 'history_events';
  staticTypes?: string[];
  categoryHref?: string;
}

// History event interface
interface HistoryEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
}

// Organization section interface
interface OrgSectionItem {
  id: string;
  content: string;
  sort_order: number;
}

interface OrgSection {
  id: string;
  section_type: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  items: OrgSectionItem[];
}

interface MenuSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: MenuItem[];
}

// Menu бүтэц - MenuBar-тай адилхан
const menuStructure: Record<string, MenuSection> = {
  about: {
    title: 'Бидний тухай',
    icon: Info,
    color: 'blue',
    items: [
      { title: 'Эрхэм зорилго', href: '/about/mission', type: 'static', staticTypes: ['mission', 'vision', 'goal'] },
      { title: 'Бүтэц, зохион байгуулалт (Хэлтсүүд)', href: '/about/structure', type: 'departments' },
      { title: 'Байгууллагын танилцуулга', href: '/about/intro', type: 'org_sections' },
      { title: 'Түүхэн замнал', href: '/about/history', type: 'history_events' },
    ]
  },
  law: {
    title: 'Хууль, Эрх зүй',
    icon: Scale,
    color: 'green',
    items: [
      { title: 'Худалдан авах ажиллагааны хууль', href: '/law/procurement', type: 'category', categoryHref: 'huuli-togtoomj' },
      { title: 'Байгууллагын хууль тогтоомж', href: '/law/organization', type: 'category', categoryHref: 'baiguullagiin-huuli-togtoomj' },
    ]
  },
  news: {
    title: 'Мэдээ, мэдээлэл',
    icon: Newspaper,
    color: 'purple',
    items: [
      { title: 'Үйл явдлын мэдээ', href: '/category/uil-yvdliin-medee', type: 'category', categoryHref: 'uil-yvdliin-medee' },
      { title: 'Видео мэдээ', href: '/category/video-medee', type: 'category', categoryHref: 'video-medee' },
    ]
  },
  activities: {
    title: 'Ил тод байдал',
    icon: Eye,
    color: 'indigo',
    items: [
      { title: 'Бодлогын баримт бичиг', href: '/category/strateg-tolovlogoo-tailan', type: 'category', categoryHref: 'strateg-tolovlogoo-tailan' },
      { title: 'Стратеги төлөвлөгөө', href: '/category/strateg-tolovlogoo', type: 'category', categoryHref: 'strateg-tolovlogoo' },
      { title: 'Төлөвлөгөө, тайлан', href: '/category/tolovlogoo-tailan', type: 'category', categoryHref: 'tolovlogoo-tailan' },
      { title: 'Статистик мэдээ', href: '/category/statistic', type: 'category', categoryHref: 'statistic' },
    ]
  },
  tender: {
    title: 'Тендер',
    icon: ClipboardList,
    color: 'orange',
    items: [
      { title: 'Тендерийн урилга', href: '/category/tender-urilga', type: 'category', categoryHref: 'tender-urilga' },
      { title: 'A3 гэрчилгээтэй хүний нөөц', href: '/category/a3-gerchilgee', type: 'category', categoryHref: 'a3-gerchilgee' },
      { title: 'Захиалагчдад зөвлөмж', href: '/category/zovlomj', type: 'category', categoryHref: 'zovlomj' },
    ]
  },
  anticorruption: {
    title: 'Авилгын эсрэг',
    icon: Shield,
    color: 'red',
    items: [
      { title: 'Төлөвлөгөө, тайлан', href: '/category/at-tolovlogoo-tailan', type: 'category', categoryHref: 'at-tolovlogoo-tailan' },
      { title: 'Хасум хянасан дүгнэлт', href: '/category/hasum-report', type: 'category', categoryHref: 'hasum-report' },
    ]
  },
};

// Статик контент төрлүүдийн нэрс
const staticTypeLabels: Record<string, string> = {
  mission: 'Эрхэм зорилго',
  vision: 'Алсын харалт',
  goal: 'Стратегийн зорилтууд',
  structure: 'Бүтэц, зохион байгуулалт',
  intro: 'Байгууллагын танилцуулга',
  history: 'Түүхэн замнал',
};

// Хэлтсийн interface - API-аас ирэх формат
interface DepartmentAPI {
  id: string;
  name: string;
  short_name: string;
  description: string;
  responsibilities: string[];
  contact_person: string;
  contact_position: string;
  contact_room: string;
  contact_phone: string;
  contact_email: string;
  color: string;
  sort_order: number;
  is_director: boolean;
}

// Frontend-д ашиглах формат
interface Department {
  id: string;
  name: string;
  shortName: string;
  description: string;
  responsibilities: string[];
  contact: {
    person: string;
    position: string;
    room: string;
    phone: string;
    email: string;
  };
  color: string;
  sortOrder: number;
  isDirector: boolean;
}

// API response-г frontend формат руу хөрвүүлэх
const transformDepartment = (dept: DepartmentAPI): Department => ({
  id: dept.id,
  name: dept.name,
  shortName: dept.short_name,
  description: dept.description || '',
  responsibilities: dept.responsibilities || [],
  contact: {
    person: dept.contact_person || '',
    position: dept.contact_position || '',
    room: dept.contact_room || '',
    phone: dept.contact_phone || '',
    email: dept.contact_email || ''
  },
  color: dept.color || 'from-blue-500 to-blue-600',
  sortOrder: dept.sort_order || 0,
  isDirector: dept.is_director || false
});

export default function AdminPage() {
  const router = useRouter();
  const [staticContents, setStaticContents] = useState<StaticContent[]>([]);
  const [allContents, setAllContents] = useState<ContentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit states
  const [editingStatic, setEditingStatic] = useState<StaticContent | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [isSaving, setIsSaving] = useState(false);
  
  // Department states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptForm, setDeptForm] = useState<Department | null>(null);
  const [savingDept, setSavingDept] = useState(false);

  // Organization sections states
  const [orgSections, setOrgSections] = useState<OrgSection[]>([]);
  const [editingOrgSection, setEditingOrgSection] = useState<OrgSection | null>(null);
  const [orgSectionForm, setOrgSectionForm] = useState<OrgSection | null>(null);
  const [savingOrgSection, setSavingOrgSection] = useState(false);

  // History events states
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([]);
  const [editingHistory, setEditingHistory] = useState<HistoryEvent | null>(null);
  const [historyForm, setHistoryForm] = useState<HistoryEvent | null>(null);
  const [savingHistory, setSavingHistory] = useState(false);

  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [staticRes, contentRes, deptRes, orgRes] = await Promise.all([
        fetch('/api/static-content'),
        fetch('/api/content'),
        fetch('/api/departments'),
        fetch('/api/organization-sections')
      ]);
      
      if (staticRes.ok) setStaticContents(await staticRes.json());
      if (contentRes.ok) setAllContents(await contentRes.json());
      if (deptRes.ok) {
        const deptData: DepartmentAPI[] = await deptRes.json();
        setDepartments(deptData.map(transformDepartment));
      }
      if (orgRes.ok) {
        setOrgSections(await orgRes.json());
      }

      const historyRes = await fetch('/api/history-events');
      if (historyRes.ok) {
        setHistoryEvents(await historyRes.json());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save department
  const handleSaveDept = async () => {
    if (!deptForm) return;
    setSavingDept(true);
    try {
      const isNew = !departments.find(d => d.id === editingDept?.id);
      const url = isNew ? '/api/departments' : `/api/departments/${editingDept?.id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deptForm)
      });

      if (res.ok) {
        await fetchData();
        setEditingDept(null);
        setDeptForm(null);
      }
    } catch (error) {
      console.error('Error saving department:', error);
    } finally {
      setSavingDept(false);
    }
  };

  // Delete department
  const handleDeleteDept = async (id: string) => {
    if (!confirm('Энэ хэлтсийг устгах уу?')) return;
    try {
      const res = await fetch(`/api/departments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
        setEditingDept(null);
        setDeptForm(null);
      }
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  // Save organization section
  const handleSaveOrgSection = async () => {
    if (!orgSectionForm) return;
    setSavingOrgSection(true);
    try {
      const isNew = !orgSections.find(s => s.id === editingOrgSection?.id);
      const url = isNew ? '/api/organization-sections' : `/api/organization-sections/${editingOrgSection?.id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orgSectionForm)
      });

      if (res.ok) {
        await fetchData();
        setEditingOrgSection(null);
        setOrgSectionForm(null);
      }
    } catch (error) {
      console.error('Error saving org section:', error);
    } finally {
      setSavingOrgSection(false);
    }
  };

  // Delete organization section
  const handleDeleteOrgSection = async (id: string) => {
    if (!confirm('Энэ хэсгийг устгах уу?')) return;
    try {
      const res = await fetch(`/api/organization-sections/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
        setEditingOrgSection(null);
        setOrgSectionForm(null);
      }
    } catch (error) {
      console.error('Error deleting org section:', error);
    }
  };

  // Save history event
  const handleSaveHistory = async () => {
    if (!historyForm) return;
    setSavingHistory(true);
    try {
      const isNew = !historyEvents.find(e => e.id === editingHistory?.id);
      const url = isNew ? '/api/history-events' : `/api/history-events/${editingHistory?.id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyForm)
      });

      if (res.ok) {
        await fetchData();
        setEditingHistory(null);
        setHistoryForm(null);
      }
    } catch (error) {
      console.error('Error saving history event:', error);
    } finally {
      setSavingHistory(false);
    }
  };

  // Delete history event
  const handleDeleteHistory = async (id: string) => {
    if (!confirm('Энэ үйл явдлыг устгах уу?')) return;
    try {
      const res = await fetch(`/api/history-events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
        setEditingHistory(null);
        setHistoryForm(null);
      }
    } catch (error) {
      console.error('Error deleting history event:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get contents by category href
  const getContentsByCategory = (categoryHref: string) => {
    const cat = Category.find(c => c.href === categoryHref);
    return cat ? allContents.filter(c => c.category_id === cat.id) : [];
  };

  // Get static content by type
  const getStaticByType = (type: string) => {
    return staticContents.find(c => c.type === type);
  };

  // Toggle expanded item
  const toggleExpand = (key: string) => {
    setExpandedItems(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Edit static content
  const handleEditStatic = (content: StaticContent) => {
    setEditingStatic(content);
    setEditForm({ title: content.title, content: content.content });
  };

  const handleSaveStatic = async () => {
    if (!editingStatic) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/static-content/${editingStatic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        await fetchData();
        setEditingStatic(null);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete content
  const handleDelete = async (id: number, type: 'static' | 'content') => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    try {
      const url = type === 'static' ? `/api/static-content/${id}` : `/api/content/${id}`;
      await fetch(url, { method: 'DELETE' });
      await fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  // Stats
  const stats = {
    static: staticContents.length,
    content: allContents.length,
    categories: Category.length
  };

  // Color classes
  const colorClasses: Record<string, { bg: string; text: string; light: string }> = {
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
    green: { bg: 'bg-green-600', text: 'text-green-600', light: 'bg-green-50' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50' },
    indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-50' },
    orange: { bg: 'bg-orange-600', text: 'text-orange-600', light: 'bg-orange-50' },
    red: { bg: 'bg-red-600', text: 'text-red-600', light: 'bg-red-50' },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex-shrink-0 fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">Админ удирдлага</h1>
          <p className="text-slate-400 text-sm mt-1">Цэсний бүтцээр удирдах</p>
        </div>
        
        <nav className="p-4 space-y-1">
          {/* Dashboard */}
          <button
            onClick={() => setActiveMenu('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeMenu === 'dashboard' ? 'bg-blue-600' : 'hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Хянах самбар</span>
          </button>

          {/* Menu Items */}
          {Object.entries(menuStructure).map(([key, menu]) => {
            const Icon = menu.icon;
            const isActive = activeMenu === key;
            const itemCount = menu.items.reduce((sum, item) => {
              if (item.type === 'static') {
                return sum + (item.staticTypes?.filter(t => getStaticByType(t)).length || 0);
              }
              return sum + (item.categoryHref ? getContentsByCategory(item.categoryHref).length : 0);
            }, 0);

            return (
              <button
                key={key}
                onClick={() => setActiveMenu(key)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-600' : 'hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{menu.title}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-700'}`}>
                  {itemCount}
                </span>
              </button>
            );
          })}

        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900">
          <button 
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Нүүр хуудас руу</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        {/* Dashboard */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Хянах самбар</h2>
                <p className="text-gray-600 mt-1">Контентуудын ерөнхий мэдээлэл</p>
              </div>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Шинэчлэх
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.static}</div>
                <div className="text-gray-600 text-sm mt-1">Статик контент</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500 rounded-lg">
                    <Newspaper className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.content}</div>
                <div className="text-gray-600 text-sm mt-1">Мэдээ, контент</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500 rounded-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.categories}</div>
                <div className="text-gray-600 text-sm mt-1">Ангилал</div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Түргэн холбоосууд</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(menuStructure).map(([key, menu]) => {
                  const Icon = menu.icon;
                  const colors = colorClasses[menu.color];
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveMenu(key)}
                      className={`p-4 rounded-xl ${colors.light} hover:shadow-md transition-all text-center`}
                    >
                      <Icon className={`w-8 h-8 ${colors.text} mx-auto mb-2`} />
                      <span className="text-sm font-medium text-gray-700">{menu.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Menu Content Pages */}
        {Object.entries(menuStructure).map(([key, menu]) => {
          if (activeMenu !== key) return null;
          
          const Icon = menu.icon;
          const colors = colorClasses[menu.color];

          return (
            <div key={key} className="space-y-6">
              {/* Header */}
              <div className={`${colors.bg} text-white rounded-2xl p-6`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{menu.title}</h2>
                    <p className="text-white/80 mt-1">{menu.items.length} дэд хэсэг</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {menu.items.map((item, idx) => {
                  const itemKey = `${key}-${idx}`;
                  const isExpanded = expandedItems.includes(itemKey);
                  
                  // Get content based on type
                  let contents: ContentData[] = [];
                  let staticItems: StaticContent[] = [];
                  
                  if (item.type === 'static' && item.staticTypes) {
                    staticItems = item.staticTypes
                      .map(t => getStaticByType(t))
                      .filter(Boolean) as StaticContent[];
                  } else if (item.type === 'category' && item.categoryHref) {
                    contents = getContentsByCategory(item.categoryHref);
                  }

                  const totalCount = item.type === 'static' ? staticItems.length : contents.length;

                  return (
                    <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      {/* Item Header */}
                      <button
                        onClick={() => toggleExpand(itemKey)}
                        className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${colors.light}`}>
                            <FileText className={`w-5 h-5 ${colors.text}`} />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.href}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            totalCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {totalCount} контент
                          </span>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="border-t bg-gray-50 p-5">
                          {/* Static Content */}
                          {item.type === 'static' && item.staticTypes && (
                            <div className="space-y-4">
                              {item.staticTypes.map(type => {
                                const content = getStaticByType(type);
                                return (
                                  <div key={type} className="bg-white rounded-lg border p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-medium text-gray-900">{staticTypeLabels[type]}</h4>
                                      {content && (
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => handleEditStatic(content)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                          >
                                            <Edit3 className="w-4 h-4" />
                                            Засах
                                          </button>
                                          <button
                                            onClick={() => handleDelete(content.id, 'static')}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                    {content ? (
                                      <div>
                                        <p className="text-sm text-gray-600 mb-2"><strong>Гарчиг:</strong> {content.title}</p>
                                        <div 
                                          className="text-sm text-gray-500 line-clamp-2"
                                          dangerouslySetInnerHTML={{ __html: content.content || '<em>Агуулга байхгүй</em>' }}
                                        />
                                        <p className="text-xs text-gray-400 mt-2">
                                          Шинэчилсэн: {new Date(content.updated_at).toLocaleDateString('mn-MN')}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="text-center py-4">
                                        <p className="text-gray-500 text-sm mb-3">Контент бүртгэгдээгүй</p>
                                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                          <Plus className="w-4 h-4" />
                                          Нэмэх
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Departments Content */}
                          {item.type === 'departments' && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-gray-600">{departments.length} хэлтэс бүртгэлтэй</p>
                                <div className="flex gap-2">
                                  <a
                                    href="/about/structure"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    Хуудас харах
                                  </a>
                                  <button
                                    onClick={() => {
                                      const newDept: Department = {
                                        id: '',
                                        name: 'Шинэ хэлтэс',
                                        shortName: 'Шинэ',
                                        description: 'Хэлтсийн тайлбар',
                                        responsibilities: ['Чиг үүрэг 1'],
                                        contact: {
                                          person: '',
                                          position: 'Хэлтсийн дарга',
                                          room: '',
                                          phone: '',
                                          email: ''
                                        },
                                        color: 'from-blue-500 to-blue-600',
                                        sortOrder: departments.length,
                                        isDirector: false
                                      };
                                      setEditingDept(newDept);
                                      setDeptForm(newDept);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Шинэ хэлтэс
                                  </button>
                                </div>
                              </div>

                              {departments.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                  <p className="text-gray-500 mb-2">Хэлтэс бүртгэгдээгүй</p>
                                  <p className="text-sm text-gray-400">Шинэ хэлтэс нэмэх товч дарна уу</p>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {departments.map((dept) => (
                                    <div 
                                      key={dept.id} 
                                      className="bg-white rounded-lg border p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className={`w-3 h-10 rounded-full bg-gradient-to-b ${dept.color}`} />
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-gray-900">{dept.name}</h4>
                                            {dept.isDirector && (
                                              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Удирдлага</span>
                                            )}
                                          </div>
                                          <p className="text-sm text-gray-500">{dept.contact.person} • {dept.contact.phone}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => {
                                            setEditingDept(dept);
                                            setDeptForm({ ...dept });
                                          }}
                                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                        >
                                          <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteDept(dept.id)}
                                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Organization Sections Content */}
                          {item.type === 'org_sections' && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-gray-600">{orgSections.length} хэсэг бүртгэлтэй</p>
                                <div className="flex gap-2">
                                  <a
                                    href="/about/intro"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    Хуудас харах
                                  </a>
                                  <button
                                    onClick={() => {
                                      const newSection: OrgSection = {
                                        id: '',
                                        section_type: 'info_card',
                                        title: 'Шинэ хэсэг',
                                        description: '',
                                        icon: 'Building2',
                                        color: 'from-blue-500 to-blue-600',
                                        sort_order: orgSections.length,
                                        is_active: true,
                                        items: []
                                      };
                                      setEditingOrgSection(newSection);
                                      setOrgSectionForm(newSection);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Шинэ хэсэг
                                  </button>
                                </div>
                              </div>

                              {/* Section Type Tabs */}
                              <div className="flex gap-2 mb-4 flex-wrap">
                                {['info_card', 'values', 'responsibilities'].map(type => {
                                  const count = orgSections.filter(s => s.section_type === type).length;
                                  const labels: Record<string, string> = {
                                    'info_card': 'Мэдээллийн карт',
                                    'values': 'Үнэт зүйлс',
                                    'responsibilities': 'Үүрэг хариуцлага'
                                  };
                                  return (
                                    <span key={type} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                      {labels[type]}: {count}
                                    </span>
                                  );
                                })}
                              </div>

                              {orgSections.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                                  <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                  <p className="text-gray-500 mb-2">Хэсэг бүртгэгдээгүй</p>
                                  <p className="text-sm text-gray-400">Шинэ хэсэг нэмэх товч дарна уу</p>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {orgSections.map((section) => (
                                    <div 
                                      key={section.id} 
                                      className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                          <div className={`w-3 h-10 rounded-full bg-gradient-to-b ${section.color}`} />
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <h4 className="font-medium text-gray-900">{section.title}</h4>
                                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                                {section.section_type === 'info_card' ? 'Карт' : 
                                                 section.section_type === 'values' ? 'Үнэт зүйл' : 'Үүрэг'}
                                              </span>
                                              {section.items.length > 0 && (
                                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                                  {section.items.length} жагсаалт
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-1">
                                              {section.description || 'Тайлбар байхгүй'}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => {
                                              setEditingOrgSection(section);
                                              setOrgSectionForm({ ...section });
                                            }}
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                          >
                                            <Edit3 className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteOrgSection(section.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* History Events Content */}
                          {item.type === 'history_events' && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-gray-600">{historyEvents.length} үйл явдал бүртгэлтэй</p>
                                <div className="flex gap-2">
                                  <a
                                    href="/about/history"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    Хуудас харах
                                  </a>
                                  <button
                                    onClick={() => {
                                      const newEvent: HistoryEvent = {
                                        id: '',
                                        year: new Date().getFullYear().toString(),
                                        title: 'Шинэ үйл явдал',
                                        description: '',
                                        icon: 'Calendar',
                                        color: 'from-blue-500 to-blue-600',
                                        sort_order: historyEvents.length,
                                        is_active: true
                                      };
                                      setEditingHistory(newEvent);
                                      setHistoryForm(newEvent);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Шинэ үйл явдал
                                  </button>
                                </div>
                              </div>

                              {historyEvents.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                  <p className="text-gray-500 mb-2">Үйл явдал бүртгэгдээгүй</p>
                                  <p className="text-sm text-gray-400">Шинэ үйл явдал нэмэх товч дарна уу</p>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {historyEvents.map((event) => (
                                    <div 
                                      key={event.id} 
                                      className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center text-white font-bold`}>
                                            {event.year}
                                          </div>
                                          <div>
                                            <h4 className="font-medium text-gray-900">{event.title}</h4>
                                            <p className="text-sm text-gray-500 line-clamp-1">{event.description}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => {
                                              setEditingHistory(event);
                                              setHistoryForm({ ...event });
                                            }}
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                          >
                                            <Edit3 className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteHistory(event.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Category Content */}
                          {item.type === 'category' && (
                            <div>
                              {/* Search */}
                              <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Хайх..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>

                              {contents.length === 0 ? (
                                <div className="text-center py-8 bg-white rounded-lg border">
                                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                  <p className="text-gray-500 mb-4">Контент байхгүй</p>
                                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                    <Plus className="w-4 h-4" />
                                    Шинэ контент нэмэх
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {contents
                                    .filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map(content => (
                                      <div key={content.id} className="bg-white rounded-lg border p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-medium text-gray-900 truncate">{content.title}</h4>
                                          <p className="text-sm text-gray-500">
                                            {new Date(content.created_date).toLocaleDateString('mn-MN')}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                          <a
                                            href={`/news/${content.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                          >
                                            <Eye className="w-4 h-4" />
                                          </a>
                                          <button
                                            onClick={() => handleDelete(content.id, 'content')}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      </main>

      {/* Edit Modal */}
      {editingStatic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Контент засах</h3>
                <p className="text-sm text-gray-500">{staticTypeLabels[editingStatic.type]}</p>
              </div>
              <button
                onClick={() => setEditingStatic(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Гарчиг</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Агуулга (HTML)</label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setEditingStatic(null)}
                className="px-6 py-2.5 border rounded-lg hover:bg-gray-100 transition-colors"
              >
                Цуцлах
              </button>
              <button
                onClick={handleSaveStatic}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Хадгалж байна...' : 'Хадгалах'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Department Edit Modal */}
      {editingDept && deptForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className={`bg-gradient-to-r ${deptForm.color} text-white p-6`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">
                  {departments.find(d => d.id === editingDept.id) ? 'Хэлтэс засах' : 'Шинэ хэлтэс нэмэх'}
                </h3>
                <button
                  onClick={() => {
                    setEditingDept(null);
                    setDeptForm(null);
                  }}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Хэлтсийн нэр</label>
                  <input
                    type="text"
                    value={deptForm.name}
                    onChange={(e) => setDeptForm(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Товч нэр</label>
                  <input
                    type="text"
                    value={deptForm.shortName}
                    onChange={(e) => setDeptForm(prev => prev ? { ...prev, shortName: e.target.value } : null)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тайлбар</label>
                <textarea
                  value={deptForm.description}
                  onChange={(e) => setDeptForm(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Өнгө</label>
                <div className="flex gap-2">
                  {[
                    'from-blue-500 to-blue-600',
                    'from-green-500 to-green-600',
                    'from-purple-500 to-purple-600',
                    'from-orange-500 to-orange-600',
                    'from-red-500 to-red-600',
                    'from-pink-500 to-pink-600',
                    'from-teal-500 to-teal-600',
                  ].map(color => (
                    <button
                      key={color}
                      onClick={() => setDeptForm(prev => prev ? { ...prev, color } : null)}
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} ${
                        deptForm.color === color ? 'ring-4 ring-offset-2 ring-blue-500' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Чиг үүрэг</label>
                <div className="space-y-2">
                  {deptForm.responsibilities.map((resp, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => {
                          const newResps = [...deptForm.responsibilities];
                          newResps[idx] = e.target.value;
                          setDeptForm(prev => prev ? { ...prev, responsibilities: newResps } : null);
                        }}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          const newResps = deptForm.responsibilities.filter((_, i) => i !== idx);
                          setDeptForm(prev => prev ? { ...prev, responsibilities: newResps } : null);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setDeptForm(prev => prev ? { 
                        ...prev, 
                        responsibilities: [...prev.responsibilities, ''] 
                      } : null);
                    }}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Чиг үүрэг нэмэх
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Холбоо барих</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Хариуцагч</label>
                    <input
                      type="text"
                      value={deptForm.contact.person}
                      onChange={(e) => setDeptForm(prev => prev ? { 
                        ...prev, 
                        contact: { ...prev.contact, person: e.target.value } 
                      } : null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Албан тушаал</label>
                    <input
                      type="text"
                      value={deptForm.contact.position}
                      onChange={(e) => setDeptForm(prev => prev ? { 
                        ...prev, 
                        contact: { ...prev.contact, position: e.target.value } 
                      } : null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Өрөө</label>
                    <input
                      type="text"
                      value={deptForm.contact.room}
                      onChange={(e) => setDeptForm(prev => prev ? { 
                        ...prev, 
                        contact: { ...prev.contact, room: e.target.value } 
                      } : null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Утас</label>
                    <input
                      type="text"
                      value={deptForm.contact.phone}
                      onChange={(e) => setDeptForm(prev => prev ? { 
                        ...prev, 
                        contact: { ...prev.contact, phone: e.target.value } 
                      } : null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">И-мэйл</label>
                    <input
                      type="email"
                      value={deptForm.contact.email}
                      onChange={(e) => setDeptForm(prev => prev ? { 
                        ...prev, 
                        contact: { ...prev.contact, email: e.target.value } 
                      } : null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="px-6 pb-6 flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deptForm.isDirector}
                  onChange={(e) => setDeptForm(prev => prev ? { ...prev, isDirector: e.target.checked } : null)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Удирдах түвшин</span>
              </label>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Эрэмбэ:</label>
                <input
                  type="number"
                  value={deptForm.sortOrder}
                  onChange={(e) => setDeptForm(prev => prev ? { ...prev, sortOrder: parseInt(e.target.value) || 0 } : null)}
                  className="w-20 px-2 py-1 border rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              {editingDept.id && (
                <button
                  onClick={() => handleDeleteDept(editingDept.id)}
                  className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Устгах
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button
                  onClick={() => {
                    setEditingDept(null);
                    setDeptForm(null);
                  }}
                  className="px-6 py-2.5 border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleSaveDept}
                  disabled={savingDept}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingDept ? 'Хадгалж байна...' : 'Хадгалах'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Organization Section Edit Modal */}
      {editingOrgSection && orgSectionForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className={`bg-gradient-to-r ${orgSectionForm.color} text-white p-6`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">
                  {orgSections.find(s => s.id === editingOrgSection.id) ? 'Хэсэг засах' : 'Шинэ хэсэг нэмэх'}
                </h3>
                <button
                  onClick={() => {
                    setEditingOrgSection(null);
                    setOrgSectionForm(null);
                  }}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Section Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Хэсгийн төрөл</label>
                <select
                  value={orgSectionForm.section_type}
                  onChange={(e) => setOrgSectionForm(prev => prev ? { ...prev, section_type: e.target.value } : null)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="info_card">Мэдээллийн карт</option>
                  <option value="values">Үнэт зүйлс (жагсаалттай)</option>
                  <option value="responsibilities">Үүрэг хариуцлага (жагсаалттай)</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Гарчиг</label>
                <input
                  type="text"
                  value={orgSectionForm.title}
                  onChange={(e) => setOrgSectionForm(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description (for info_card) */}
              {orgSectionForm.section_type === 'info_card' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Тайлбар</label>
                  <textarea
                    value={orgSectionForm.description || ''}
                    onChange={(e) => setOrgSectionForm(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Дүрс</label>
                <select
                  value={orgSectionForm.icon}
                  onChange={(e) => setOrgSectionForm(prev => prev ? { ...prev, icon: e.target.value } : null)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Building2">Building2 - Байгууллага</option>
                  <option value="Target">Target - Зорилго</option>
                  <option value="TrendingUp">TrendingUp - Өсөлт</option>
                  <option value="Users">Users - Хэрэглэгчид</option>
                  <option value="Award">Award - Шагнал</option>
                  <option value="Shield">Shield - Хамгаалалт</option>
                  <option value="Globe">Globe - Дэлхий</option>
                  <option value="Heart">Heart - Зүрх</option>
                  <option value="Zap">Zap - Аянга</option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Өнгө</label>
                <div className="flex gap-2">
                  {[
                    'from-blue-500 to-blue-600',
                    'from-purple-500 to-purple-600',
                    'from-green-500 to-green-600',
                    'from-orange-500 to-orange-600',
                    'from-red-500 to-red-600',
                    'from-teal-500 to-teal-600',
                  ].map(color => (
                    <button
                      key={color}
                      onClick={() => setOrgSectionForm(prev => prev ? { ...prev, color } : null)}
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} ${
                        orgSectionForm.color === color ? 'ring-4 ring-offset-2 ring-blue-500' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Items (for values and responsibilities) */}
              {(orgSectionForm.section_type === 'values' || orgSectionForm.section_type === 'responsibilities') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Жагсаалт</label>
                  <div className="space-y-2">
                    {orgSectionForm.items.map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={item.content}
                          onChange={(e) => {
                            const newItems = [...orgSectionForm.items];
                            newItems[idx] = { ...item, content: e.target.value };
                            setOrgSectionForm(prev => prev ? { ...prev, items: newItems } : null);
                          }}
                          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Жагсаалтын зүйл"
                        />
                        <button
                          onClick={() => {
                            const newItems = orgSectionForm.items.filter((_, i) => i !== idx);
                            setOrgSectionForm(prev => prev ? { ...prev, items: newItems } : null);
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newItem: OrgSectionItem = { id: '', content: '', sort_order: orgSectionForm.items.length };
                        setOrgSectionForm(prev => prev ? { ...prev, items: [...prev.items, newItem] } : null);
                      }}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Жагсаалт нэмэх
                    </button>
                  </div>
                </div>
              )}

              {/* Sort Order */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Эрэмбэ:</label>
                  <input
                    type="number"
                    value={orgSectionForm.sort_order}
                    onChange={(e) => setOrgSectionForm(prev => prev ? { ...prev, sort_order: parseInt(e.target.value) || 0 } : null)}
                    className="w-20 px-2 py-1 border rounded-lg text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={orgSectionForm.is_active}
                    onChange={(e) => setOrgSectionForm(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Идэвхтэй</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              {editingOrgSection.id && (
                <button
                  onClick={() => handleDeleteOrgSection(editingOrgSection.id)}
                  className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Устгах
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button
                  onClick={() => {
                    setEditingOrgSection(null);
                    setOrgSectionForm(null);
                  }}
                  className="px-6 py-2.5 border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleSaveOrgSection}
                  disabled={savingOrgSection}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingOrgSection ? 'Хадгалж байна...' : 'Хадгалах'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Event Edit Modal */}
      {editingHistory && historyForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className={`bg-gradient-to-r ${historyForm.color} text-white p-6`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">
                  {historyEvents.find(e => e.id === editingHistory.id) ? 'Үйл явдал засах' : 'Шинэ үйл явдал нэмэх'}
                </h3>
                <button
                  onClick={() => {
                    setEditingHistory(null);
                    setHistoryForm(null);
                  }}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Он</label>
                <input
                  type="text"
                  value={historyForm.year}
                  onChange={(e) => setHistoryForm(prev => prev ? { ...prev, year: e.target.value } : null)}
                  placeholder="2024"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Гарчиг</label>
                <input
                  type="text"
                  value={historyForm.title}
                  onChange={(e) => setHistoryForm(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тайлбар</label>
                <textarea
                  value={historyForm.description}
                  onChange={(e) => setHistoryForm(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Дүрс</label>
                <select
                  value={historyForm.icon}
                  onChange={(e) => setHistoryForm(prev => prev ? { ...prev, icon: e.target.value } : null)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Calendar">Calendar - Хуанли</option>
                  <option value="Building2">Building2 - Байгууллага</option>
                  <option value="TrendingUp">TrendingUp - Өсөлт</option>
                  <option value="Award">Award - Шагнал</option>
                  <option value="Globe">Globe - Дэлхий</option>
                  <option value="MapPin">MapPin - Байршил</option>
                  <option value="Star">Star - Од</option>
                  <option value="Target">Target - Зорилго</option>
                  <option value="Users">Users - Хэрэглэгчид</option>
                  <option value="Zap">Zap - Аянга</option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Өнгө</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    'from-blue-500 to-blue-600',
                    'from-green-500 to-green-600',
                    'from-purple-500 to-purple-600',
                    'from-orange-500 to-orange-600',
                    'from-red-500 to-red-600',
                    'from-teal-500 to-teal-600',
                    'from-pink-500 to-pink-600',
                    'from-indigo-500 to-indigo-600',
                  ].map(color => (
                    <button
                      key={color}
                      onClick={() => setHistoryForm(prev => prev ? { ...prev, color } : null)}
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} ${
                        historyForm.color === color ? 'ring-4 ring-offset-2 ring-blue-500' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Sort Order & Active */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Эрэмбэ:</label>
                  <input
                    type="number"
                    value={historyForm.sort_order}
                    onChange={(e) => setHistoryForm(prev => prev ? { ...prev, sort_order: parseInt(e.target.value) || 0 } : null)}
                    className="w-20 px-2 py-1 border rounded-lg text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={historyForm.is_active}
                    onChange={(e) => setHistoryForm(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Идэвхтэй</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              {editingHistory.id && (
                <button
                  onClick={() => handleDeleteHistory(editingHistory.id)}
                  className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Устгах
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button
                  onClick={() => {
                    setEditingHistory(null);
                    setHistoryForm(null);
                  }}
                  className="px-6 py-2.5 border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleSaveHistory}
                  disabled={savingHistory}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingHistory ? 'Хадгалж байна...' : 'Хадгалах'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
