'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  Save,
  RefreshCw,
  ExternalLink,
  Search,
  AlertCircle,
  RotateCcw,
  ClipboardList,
  Gavel,
  Link as LinkIcon,
} from 'lucide-react';
import { PROVINCES } from '@/utils/provinces';

interface ProvinceLink {
  slug: string;
  title: string;
  plans_url: string | null;
  tender_url: string | null;
  plans_label: string | null;
  tender_label: string | null;
  sort_order: number;
}

const DEFAULT_PLANS_LABEL = 'Төлөвлөгөө';
const DEFAULT_TENDER_LABEL = 'Тендер шалгаруулалт';

export const ProvinceLinksSection = () => {
  const [links, setLinks] = useState<ProvinceLink[]>([]);
  const [original, setOriginal] = useState<ProvinceLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/province-links');
      if (res.ok) {
        const data: ProvinceLink[] = await res.json();
        // Хэрэв API-ээс дутуу ирвэл PROVINCES-аас нөхөж бөглөх
        const merged = PROVINCES.map((p, idx) => {
          const existing = data.find((d) => d.slug === p.slug);
          if (existing) return existing;
          return {
            slug: p.slug,
            title: p.title,
            plans_url: null,
            tender_url: null,
            plans_label: DEFAULT_PLANS_LABEL,
            tender_label: DEFAULT_TENDER_LABEL,
            sort_order: idx + 1,
          } as ProvinceLink;
        });
        setLinks(merged);
        setOriginal(JSON.parse(JSON.stringify(merged)));
      }
    } catch (e) {
      console.error('Error fetching province links:', e);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (
    slug: string,
    field: keyof ProvinceLink,
    value: string
  ) => {
    setLinks((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, [field]: value } : p))
    );
  };

  const resetRow = (slug: string) => {
    const orig = original.find((p) => p.slug === slug);
    if (!orig) return;
    setLinks((prev) =>
      prev.map((p) => (p.slug === slug ? { ...orig } : p))
    );
  };

  const clearRow = (slug: string) => {
    setLinks((prev) =>
      prev.map((p) =>
        p.slug === slug
          ? { ...p, plans_url: '', tender_url: '' }
          : p
      )
    );
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/province-links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(links),
      });
      if (res.ok) {
        await fetchLinks();
        setSavedAt(new Date().toLocaleTimeString('mn-MN'));
      } else {
        const err = await res.json();
        alert(err?.error || 'Хадгалахад алдаа гарлаа');
      }
    } catch (e) {
      console.error('Error saving province links:', e);
      alert('Хадгалахад алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };

  const isDirty = JSON.stringify(links) !== JSON.stringify(original);
  const dirtyCount = links.filter((l, idx) => {
    const orig = original[idx];
    if (!orig) return true;
    return (
      l.plans_url !== orig.plans_url ||
      l.tender_url !== orig.tender_url ||
      l.plans_label !== orig.plans_label ||
      l.tender_label !== orig.tender_label
    );
  }).length;

  const filtered = links.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <AlertCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Сумдын цэсний &quot;Төлөвлөгөө&quot; ба &quot;Тендер шалгаруулалт&quot; линкийг засах
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              URL хоосон бол анхдагч <code className="px-1 bg-white rounded">/province/[slug]</code>{' '}
              хуудас руу үсэрнэ. URL оруулсан бол шууд тэр хаяг руу үсэрнэ
              (https://... хэлбэрийн гадаад линк боломжтой).
            </p>
          </div>
        </div>
        {savedAt && (
          <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full whitespace-nowrap">
            ✓ {savedAt}
          </span>
        )}
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Сум хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          />
        </div>
        <button
          onClick={fetchLinks}
          disabled={saving}
          className="p-2.5 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          title="Шинэчлэх"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-sm">Үр дүн олдсонгүй</p>
          </div>
        ) : (
          filtered.map((p) => {
            const orig = original.find((o) => o.slug === p.slug);
            const rowDirty =
              orig &&
              (p.plans_url !== orig.plans_url ||
                p.tender_url !== orig.tender_url ||
                p.plans_label !== orig.plans_label ||
                p.tender_label !== orig.tender_label);
            return (
              <div
                key={p.slug}
                className={`bg-white rounded-xl border-2 p-4 transition-all ${
                  rowDirty
                    ? 'border-amber-300 shadow-md bg-amber-50/30'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                      {p.sort_order}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {p.title} сум
                      </h3>
                      <p className="text-xs text-gray-500">slug: {p.slug}</p>
                    </div>
                    {rowDirty && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        өөрчилсөн
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href={`/province/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                      title="Сумын хуудсыг харах"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => clearRow(p.slug)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="URL-уудыг цэвэрлэх"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    {rowDirty && (
                      <button
                        onClick={() => resetRow(p.slug)}
                        className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        Сэргээх
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plans */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                      <ClipboardList className="w-4 h-4" />
                      Төлөвлөгөө
                    </div>
                    <input
                      type="text"
                      value={p.plans_label || ''}
                      onChange={(e) =>
                        updateField(p.slug, 'plans_label', e.target.value)
                      }
                      placeholder="Цэсэнд харагдах нэр"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={p.plans_url || ''}
                        onChange={(e) =>
                          updateField(p.slug, 'plans_url', e.target.value)
                        }
                        placeholder={`/province/${p.slug}#plans`}
                        className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Tender */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-700">
                      <Gavel className="w-4 h-4" />
                      Тендер шалгаруулалт
                    </div>
                    <input
                      type="text"
                      value={p.tender_label || ''}
                      onChange={(e) =>
                        updateField(p.slug, 'tender_label', e.target.value)
                      }
                      placeholder="Цэсэнд харагдах нэр"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={p.tender_url || ''}
                        onChange={(e) =>
                          updateField(p.slug, 'tender_url', e.target.value)
                        }
                        placeholder={`/province/${p.slug}#tender-result`}
                        className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 bg-white border border-gray-200 shadow-lg rounded-xl p-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {isDirty ? (
            <span className="flex items-center gap-2 text-amber-600">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              {dirtyCount} сум өөрчлөгдсөн
            </span>
          ) : (
            <span className="flex items-center gap-2 text-gray-500">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              Бүх өөрчлөлт хадгалагдсан
            </span>
          )}
        </div>
        <button
          onClick={saveAll}
          disabled={!isDirty || saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Хадгалж байна...' : 'Бүгдийг хадгалах'}
        </button>
      </div>
    </div>
  );
};
