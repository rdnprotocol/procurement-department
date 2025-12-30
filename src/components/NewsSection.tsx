"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, AlignLeft } from "lucide-react";

interface ContentData {
  id: number;
  title: string;
  banner_image: string;
  created_date: string;
  category_id: number;
  items?: { text?: string }[];
}

export function NewsSection() {
  const [news, setNews] = useState<ContentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const visibleItems = 3; // Нэг дор харуулах тоо

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      setLoading(true);
      const res = await fetch("/api/content", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data: ContentData[] = await res.json();
        // Sort by date descending
        const sorted = data.sort((a, b) => 
          new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
        );
        setNews(sorted);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  }

  const maxIndex = Math.max(0, news.length - visibleItems);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 800);
  }, [maxIndex, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsTransitioning(false), 800);
  }, [maxIndex, isTransitioning]);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (news.length <= visibleItems) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [news.length, nextSlide]);

  // Format date parts
  const formatDateParts = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return { year, monthDay: `${month}-${day}` };
  };

  // Get description from items or title
  const getDescription = (item: ContentData) => {
    if (item.items && item.items.length > 0 && item.items[0].text) {
      // Strip HTML tags
      const text = item.items[0].text.replace(/<[^>]*>/g, '');
      return text.length > 150 ? text.slice(0, 150) + '...' : text;
    }
    return item.title;
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Мэдээ, мэдээлэл
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Мэдээ, мэдээлэл
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <div className="text-center py-12 text-gray-500">
          Мэдээ одоогоор байхгүй байна
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Мэдээ, мэдээлэл
        </h2>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      {/* Cards Container */}
      <div className="relative">
        {/* Navigation Arrows */}
        {news.length > visibleItems && (
          <>
            <button
              onClick={prevSlide}
              disabled={isTransitioning}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors hidden md:flex items-center justify-center disabled:opacity-50"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isTransitioning}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors hidden md:flex items-center justify-center disabled:opacity-50"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </>
        )}

        {/* Sliding Cards Container */}
        <div className="overflow-hidden">
          <div 
            className="flex gap-6 transition-transform duration-700 ease-in-out"
            style={{ 
              transform: `translateX(calc(-${currentIndex} * (33.333% + 8px)))` 
            }}
          >
          {news.map((item) => {
            const { year, monthDay } = formatDateParts(item.created_date);
            
            return (
              <div
                key={item.id}
                className="w-full md:w-[calc(33.333%-16px)] flex-shrink-0"
              >
                <Link
                  href={`/news/${item.id}`}
                  className="block bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden group h-full"
                >
                {/* Image with Date Overlay */}
                <div className="relative h-48 overflow-hidden">
                  {item.banner_image ? (
                    <img
                      src={item.banner_image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                      <span className="text-white/30 text-6xl font-bold">📰</span>
                    </div>
                  )}
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-blue-600 text-white rounded-lg overflow-hidden shadow-lg">
                      <div className="px-3 py-1 text-center">
                        <div className="text-lg font-bold">{year}</div>
                      </div>
                      <div className="bg-blue-700 px-3 py-1.5 text-center">
                        <div className="text-sm font-semibold">{monthDay}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors min-h-[48px]">
                    {item.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      📅 {new Date(item.created_date).toLocaleDateString('en-CA')}
                    </span>
                    <span className="flex items-center gap-1">
                      <AlignLeft className="w-4 h-4" />
                      Мэдээ мэдээлэл
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {getDescription(item)}
                  </p>
                </div>
                </Link>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      {news.length > visibleItems && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 800);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                currentIndex === index
                  ? "bg-blue-600 w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* View All Link */}
      <div className="text-center mt-8">
        <Link
          href="/category/uil-yvdliin-medee"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Бүх мэдээ харах
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

