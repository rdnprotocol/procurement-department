'use client';

import { useEffect, useState } from 'react';
import {
  Save,
  Loader2,
  Phone,
  MapPin,
  Mail,
  Globe,
  Facebook,
  Clock,
  User,
  Building2,
  Inbox,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  Info,
} from 'lucide-react';

interface ContactInfo {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  address_main: string;
  address_secondary: string;
  map_url: string;
  map_embed_url: string;
  phone: string;
  email: string;
  website: string;
  website_url: string;
  facebook_url: string;
  facebook_label: string;
  meeting_hours: string;
  director_organization: string;
  director_department: string;
  director_position: string;
  director_person: string;
  director_room: string;
  director_phone: string;
}

interface ContactMessage {
  id: number;
  subject: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const FIELD_LABELS: Record<keyof Omit<ContactInfo, 'id'>, { label: string; icon: React.ComponentType<{ className?: string }>; type?: string; placeholder?: string; }> = {
  hero_title: { label: 'Hero - Гарчиг', icon: Info, placeholder: 'Холбоо барих' },
  hero_subtitle: { label: 'Hero - Дэд гарчиг', icon: Info, type: 'textarea', placeholder: 'Богино тайлбар' },
  address_main: { label: 'Хаяг - Үндсэн', icon: MapPin, placeholder: 'Аймаг, сум, баг' },
  address_secondary: { label: 'Хаяг - Нэмэлт', icon: MapPin, placeholder: 'Байр, давхар' },
  map_url: { label: 'Газрын зургийн линк', icon: MapPin, placeholder: 'https://maps.app.goo.gl/...' },
  map_embed_url: { label: 'Газрын зургийн embed URL', icon: MapPin, type: 'textarea', placeholder: 'https://www.google.com/maps?q=...&output=embed' },
  phone: { label: 'Утасны дугаар', icon: Phone, type: 'tel', placeholder: '+976 7755-3579' },
  email: { label: 'И-мэйл', icon: Mail, type: 'email', placeholder: 'info@example.mn' },
  website: { label: 'Вэбсайт (харагдах текст)', icon: Globe, placeholder: 'example.mn' },
  website_url: { label: 'Вэбсайт холбоос', icon: Globe, placeholder: 'https://example.mn' },
  facebook_url: { label: 'Facebook холбоос', icon: Facebook, placeholder: 'https://facebook.com/...' },
  facebook_label: { label: 'Facebook нэр', icon: Facebook, placeholder: 'Хуудасны нэр' },
  meeting_hours: { label: 'Иргэд хүлээн авах цаг', icon: Clock, placeholder: 'Мягмар, Баасан 15:00-17:00' },
  director_organization: { label: 'Байгууллагын нэр', icon: Building2, placeholder: 'Төв аймгийн ХААГ' },
  director_department: { label: 'Хариуцсан хэлтэс', icon: Building2, placeholder: 'Захиргаа, санхүүгийн хэлтэс' },
  director_position: { label: 'Албан тушаал', icon: User, placeholder: 'Зохион байгуулагч' },
  director_person: { label: 'Хариуцагч хүний нэр', icon: User, placeholder: 'Б.Булгантамир' },
  director_room: { label: 'Өрөөний дугаар', icon: MapPin, placeholder: '716 тоот өрөө' },
  director_phone: { label: 'Хариуцагчийн утас', icon: Phone, type: 'tel', placeholder: '7755-3579' },
};

const SECTIONS: { title: string; fields: (keyof Omit<ContactInfo, 'id'>)[] }[] = [
  {
    title: 'Hero хэсэг',
    fields: ['hero_title', 'hero_subtitle'],
  },
  {
    title: 'Хаяг ба газрын зураг',
    fields: ['address_main', 'address_secondary', 'map_url', 'map_embed_url'],
  },
  {
    title: 'Үндсэн холбоо',
    fields: ['phone', 'email', 'website', 'website_url'],
  },
  {
    title: 'Сошиал & Хуваарь',
    fields: ['facebook_url', 'facebook_label', 'meeting_hours'],
  },
  {
    title: 'Дэлгэрэнгүй мэдээлэл (маягтын доорх)',
    fields: [
      'director_organization',
      'director_department',
      'director_position',
      'director_person',
      'director_room',
      'director_phone',
    ],
  },
];

export const ContactSection = () => {
  const [info, setInfo] = useState<ContactInfo | null>(null);
  const [form, setForm] = useState<ContactInfo | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'messages'>('info');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [infoRes, msgRes] = await Promise.all([
        fetch('/api/contact-info'),
        fetch('/api/contact-messages'),
      ]);

      if (infoRes.ok) {
        const data = await infoRes.json();
        setInfo(data);
        setForm(data);
      }

      if (msgRes.ok) {
        const data = await msgRes.json();
        setMessages(data || []);
      }
    } catch (e) {
      console.error('Error fetching contact data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ContactInfo, value: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const res = await fetch('/api/contact-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setInfo(data.data || form);
        setSavedAt(new Date().toLocaleTimeString('mn-MN'));
      } else {
        const data = await res.json();
        alert(data?.error || 'Хадгалахад алдаа гарлаа');
      }
    } catch (e) {
      console.error('Error saving contact info:', e);
      alert('Хадгалахад алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (info) {
      setForm({ ...info });
    }
  };

  const isDirty = form && info && JSON.stringify(form) !== JSON.stringify(info);

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      const res = await fetch(`/api/contact-messages/${msg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: !msg.is_read }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error('Error toggling read:', e);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Энэ хүсэлтийг устгах уу?')) return;
    try {
      const res = await fetch(`/api/contact-messages/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (selectedMessage?.id === id) setSelectedMessage(null);
        await fetchData();
      }
    } catch (e) {
      console.error('Error deleting message:', e);
    }
  };

  if (loading || !form) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'info'
              ? 'border-violet-600 text-violet-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Info className="w-4 h-4" />
          Мэдээлэл засах
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'messages'
              ? 'border-violet-600 text-violet-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Ирсэн хүсэлтүүд
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* INFO TAB */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <AlertCircle className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  /contact хуудасны мэдээллийг засах
                </p>
                <p className="text-xs text-gray-600">
                  Энд хийсэн өөрчлөлт нь шууд хэрэглэгчийн талд харагдана
                </p>
              </div>
            </div>
            {savedAt && (
              <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                ✓ Хадгалсан: {savedAt}
              </span>
            )}
          </div>

          {/* Form sections */}
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {section.fields.map((field) => {
                  const meta = FIELD_LABELS[field];
                  const Icon = meta.icon;
                  const value = (form[field] as string) || '';
                  const isTextarea = meta.type === 'textarea';
                  const fullWidth = isTextarea;
                  return (
                    <div
                      key={field}
                      className={fullWidth ? 'md:col-span-2' : ''}
                    >
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        {meta.label}
                      </label>
                      {isTextarea ? (
                        <textarea
                          value={value}
                          onChange={(e) => handleChange(field, e.target.value)}
                          placeholder={meta.placeholder}
                          rows={3}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm resize-none"
                        />
                      ) : (
                        <input
                          type={meta.type || 'text'}
                          value={value}
                          onChange={(e) => handleChange(field, e.target.value)}
                          placeholder={meta.placeholder}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Action bar */}
          <div className="sticky bottom-4 bg-white border border-gray-200 shadow-lg rounded-xl p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isDirty ? (
                <span className="flex items-center gap-2 text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Хадгалаагүй өөрчлөлт байна
                </span>
              ) : (
                <span className="flex items-center gap-2 text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  Бүх өөрчлөлт хадгалагдсан
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                disabled={!isDirty || saving}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Сэргээх
              </button>
              <a
                href="/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Урьдчилан харах
              </a>
              <button
                onClick={handleSave}
                disabled={!isDirty || saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Хадгалж байна...' : 'Хадгалах'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages list */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Нийт {messages.length} хүсэлт
              </h3>
              <button
                onClick={fetchData}
                className="p-1.5 text-gray-500 hover:bg-white rounded-lg transition-colors"
                title="Шинэчлэх"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Хүсэлт ирээгүй байна</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === msg.id ? 'bg-violet-50' : ''
                    } ${!msg.is_read ? 'border-l-4 border-l-violet-500' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p
                        className={`text-sm truncate ${
                          msg.is_read ? 'text-gray-600' : 'font-bold text-gray-900'
                        }`}
                      >
                        {msg.name}
                      </p>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(msg.created_at).toLocaleDateString('mn-MN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {msg.subject && (
                      <p className="text-xs text-gray-700 font-medium mb-1 truncate">
                        {msg.subject}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {msg.message}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {selectedMessage.subject || '(Гарчиггүй)'}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          {selectedMessage.name}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>
                          {new Date(selectedMessage.created_at).toLocaleString(
                            'mn-MN'
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleRead(selectedMessage)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title={
                          selectedMessage.is_read
                            ? 'Уншаагүй болгох'
                            : 'Уншсан болгох'
                        }
                      >
                        {selectedMessage.is_read ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Устгах"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedMessage.email && (
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">И-мэйл</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedMessage.email}
                          </p>
                        </div>
                      </a>
                    )}
                    {selectedMessage.phone && (
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Phone className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Утас</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedMessage.phone}
                          </p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Текст
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Дэлгэрэнгүй харах хүсэлтээ зүүн талаас сонгоно уу
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
