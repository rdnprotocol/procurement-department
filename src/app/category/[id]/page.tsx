"use client";

import { Container, Loading } from "@/components/assets";
import { Calendar } from "@/components/ui/calendar";
import { GetIdByHref, GetMongolianNameByHref } from "@/utils/category";
import { getValidImagePath } from "@/utils/imageUtils";
import {
  BadgeCheck,
  ClipboardList,
  FileText,
  Lightbulb,
  Newspaper,
  Scale,
  Search,
  Shield,
  Video,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ContentItem {
  id: number;
  text: string;
  image: string;
}

interface ContentData {
  id: number;
  title: string;
  banner_image: string;
  created_date: string;
  category_id: number;
  items: ContentItem[];
}

type CategoryTheme = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  parent: { title: string; href: string };
};

export default function CategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [date] = useState<Date>(new Date());
  const [contents, setContents] = useState<ContentData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const slug = Array.isArray(id) ? id[0] : id;

  // Redirect legacy tender category paths to new tender routes (transparency-like routing)
  const legacyTenderRedirect = useMemo(() => {
    const s = String(slug || "");
    if (s === "tolovlogoo-tailan") return "/activities/tender/plan";
    if (s === "a3-gerchilgee") return "/activities/tender/a3";
    if (s === "zovlomj") return "/activities/tender/zovlomj";
    return null;
  }, [slug]);

  useEffect(() => {
    if (legacyTenderRedirect) {
      router.replace(legacyTenderRedirect);
    }
  }, [legacyTenderRedirect, router]);

  const theme: CategoryTheme = useMemo(() => {
    const name = GetMongolianNameByHref(slug) || "Мэдээ, мэдээлэл";

    const map: Record<string, CategoryTheme> = {
      // Tender submenu pages
      "tolovlogoo-tailan": {
        title: "Төлөвлөгөө, тайлан",
        description: "Тендертэй холбоотой төлөвлөгөө, тайлан, нийтлэлүүд",
        icon: ClipboardList,
        gradient: "from-emerald-500 to-emerald-600",
        parent: { title: "Тендер", href: "/#tender" },
      },
      "a3-gerchilgee": {
        title: "А3 гэрчилгээтэй хүний нөөц",
        description: "А3 гэрчилгээтэй мэргэжилтнүүд, мэдээлэл, нийтлэлүүд",
        icon: BadgeCheck,
        gradient: "from-orange-500 to-orange-600",
        parent: { title: "Тендер", href: "/#tender" },
      },
      zovlomj: {
        title: "Захиалагчдад зөвлөмж",
        description: "Захиалагчдад зориулсан зөвлөмж, гарын авлага, мэдээлэл",
        icon: Lightbulb,
        gradient: "from-indigo-500 to-indigo-600",
        parent: { title: "Тендер", href: "/#tender" },
      },

      // News
      "uil-yvdliin-medee": {
        title: name,
        description: "Үйл явдлын мэдээ, нийтлэлүүд",
        icon: Newspaper,
        gradient: "from-purple-500 to-purple-600",
        parent: { title: "Мэдээ, мэдээлэл", href: "/#news" },
      },
      "video-medee": {
        title: name,
        description: "Видео мэдээ, контентууд",
        icon: Video,
        gradient: "from-fuchsia-500 to-fuchsia-600",
        parent: { title: "Мэдээ, мэдээлэл", href: "/#news" },
      },

      // Anti-corruption
      "at-tolovlogoo-tailan": {
        title: name,
        description: "Авилгын эсрэг төлөвлөгөө, тайлан, мэдээ",
        icon: Shield,
        gradient: "from-red-500 to-red-600",
        parent: { title: "Авилгын эсрэг", href: "/#anticorruption" },
      },
      "hasum-report": {
        title: name,
        description: "ХАСУМ хянасан дүгнэлтүүд",
        icon: FileText,
        gradient: "from-rose-500 to-rose-600",
        parent: { title: "Авилгын эсрэг", href: "/#anticorruption" },
      },

      // Law
      "huuli-togtoomj": {
        title: name,
        description: "Худалдан авах ажиллагаатай холбоотой хууль тогтоомж",
        icon: Scale,
        gradient: "from-green-500 to-green-600",
        parent: { title: "Хууль, Эрх зүй", href: "/law/procurement" },
      },
      "baiguullagiin-huuli-togtoomj": {
        title: name,
        description: "Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомж",
        icon: Scale,
        gradient: "from-teal-500 to-teal-600",
        parent: { title: "Хууль, Эрх зүй", href: "/law/organization" },
      },
    };

    return (
      map[String(slug)] || {
        title: name,
        description: "Мэдээ, мэдээллийн жагсаалт",
        icon: FileText,
        gradient: "from-blue-500 to-blue-600",
        parent: { title: "Нүүр", href: "/" },
      }
    );
  }, [slug]);

  const filteredContents = useMemo(() => {
    if (!contents) return [];
    const q = query.trim().toLowerCase();
    if (!q) return contents;
    return contents.filter((c) => (c.title || "").toLowerCase().includes(q));
  }, [contents, query]);

  const getCategoryData = useCallback(async () => {
    try {
      const categoryId = GetIdByHref(slug);
      if (!categoryId) {
        router.push("/");
        return;
      }

      setLoading(true);
      const res = await fetch(`/api/category/${categoryId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        router.push("/");
        return;
      }

      const data: ContentData[] = await res.json();
      setContents(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch content");
    } finally {
      setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    if (id) {
      getCategoryData();
    }
  }, [id, getCategoryData]);

  if (loading) {
    return <Loading />;
  }

  if (legacyTenderRedirect) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </Container>
    );
  }

  if (!contents) {
    return;
  }

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-10 px-4">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Нүүр
          </Link>
          <span>/</span>
          <Link href={theme.parent.href} className="hover:text-indigo-600 transition-colors">
            {theme.parent.title}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{theme.title}</span>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm mb-10">
          <div className="absolute inset-0">
            <Image src="/tov-aimag.jpg" alt="Banner" fill className="object-cover" priority />
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-85`} />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm">
                <theme.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold">{theme.title}</h1>
                <p className="text-white/85 mt-2 max-w-3xl">{theme.description}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/90">
                  <span className="px-3 py-1 rounded-full bg-white/15">Нийт: {contents.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Гарчгаар хайх..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            {filteredContents.length === 0 ? (
              <div className="text-center py-14 rounded-3xl border-2 border-dashed bg-white">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <theme.icon className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-gray-700 font-medium">Мэдээлэл олдсонгүй</p>
                <p className="text-sm text-gray-500 mt-1">Хайлтын үгээ өөрчлөөд дахин оролдоно уу.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContents.map((content) => (
                  <Link key={content.id} href={`/news/${content.id}`} className="group block">
                    <div className="bg-white rounded-3xl border shadow-sm hover:shadow-md transition-all overflow-hidden">
                      <div className="flex flex-col sm:flex-row gap-4 p-4">
                        <div className="relative w-full sm:w-56 h-40 sm:h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={getValidImagePath(content.banner_image)}
                            alt={content.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2">
                              {content.title}
                            </h3>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors flex-shrink-0 mt-1" />
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(content.created_date).toISOString().slice(0, 10)}
                          </p>
                          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                            {content.items?.[0]?.text || "Дэлгэрэнгүй мэдээллийг үзэх"}
                          </p>
                        </div>
                      </div>
                      <div className={`h-1 bg-gradient-to-r ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Огноо</h3>
              <Calendar mode="single" selected={date} className="rounded-md border shadow-sm w-fit" />
            </div>
            <div className="bg-white rounded-3xl border shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Товч мэдээлэл</h3>
              <p className="text-sm text-gray-600">Энэ хэсэгт нийтлэгдсэн мэдээллүүдийг жагсаалтаар харуулж байна.</p>
            </div>
          </aside>
        </div>
      </div>
    </Container>
  );
}
