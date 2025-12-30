"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Link2, Calendar, ChevronRight, ChevronLeft } from "lucide-react";

interface TenderData {
  id: number;
  title: string;
  description: string;
  banner_image: string;
  created_date: string;
  category_id: number;
}

// Түр жишээ мэдээлэл (API-аас ирэх хүртэл)
const sampleTenders: TenderData[] = [
  {
    id: 1001,
    title: "ТХААГ/202504059/01/0",
    description: "Балж голд төмөр бетон гүүр шинээр барих зураг төсөв /Хэнтий, Дадал сум/",
    banner_image: "",
    created_date: "2025-05-09",
    category_id: 14
  },
  {
    id: 1002,
    title: "ТХААГ/202504089/01/0",
    description: "Сургуулийн барилгын өргөтгөл, 960 суудал - Дархан-Уул, Дархан сум, Оюуны ирээдүй цогцолбор сургууль (холболтын зураг, төсөв)",
    banner_image: "",
    created_date: "2025-05-08",
    category_id: 14
  },
  {
    id: 1003,
    title: "ТХААГ/202504096/01/0",
    description: "Дархан-Уул аймгийн Дархан суманд 2 га талбайд ТЭЗҮС хийж шинээр \"Хүүхэд хамгаалал, хөгжлийн төв\"-ийг байгуулах хэсэгчилсэн ерөнхий төлөвлөгөө",
    banner_image: "",
    created_date: "2025-05-08",
    category_id: 14
  },
  {
    id: 1004,
    title: "ТХААГ/202504102/01/0",
    description: "Төв аймгийн Зуунмод сумын 3-р багт шинэ хороолол байгуулах дэд бүтцийн ажил",
    banner_image: "",
    created_date: "2025-05-07",
    category_id: 14
  },
  {
    id: 1005,
    title: "ТХААГ/202504115/01/0",
    description: "Эрдэнэт хотын төвийн замын засвар шинэчлэлтийн ажил",
    banner_image: "",
    created_date: "2025-05-06",
    category_id: 14
  },
  {
    id: 1006,
    title: "ТХААГ/202504128/01/0",
    description: "Улаанбаатар хотын гэр хороололд цэвэр усны шугам татах ажил",
    banner_image: "",
    created_date: "2025-05-05",
    category_id: 14
  }
];

export function TenderInvitation() {
  const [tenders, setTenders] = useState<TenderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const visibleItems = 3; // Нэг дор харуулах тоо

  useEffect(() => {
    fetchTenders();
  }, []);

  async function fetchTenders() {
    try {
      setLoading(true);
      // Category ID 14 = Тендерийн урилга (tender-urilga)
      const res = await fetch("/api/category/14", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data: TenderData[] = await res.json();
        // API-аас мэдээлэл ирвэл ашиглах, байхгүй бол жишээ мэдээлэл
        setTenders(data.length > 0 ? data : sampleTenders);
      } else {
        // API амжилтгүй бол жишээ мэдээлэл
        setTenders(sampleTenders);
      }
    } catch (err) {
      console.error("Error fetching tenders:", err);
      // Алдаа гарвал жишээ мэдээлэл
      setTenders(sampleTenders);
    } finally {
      setLoading(false);
    }
  }

  const maxIndex = Math.max(0, tenders.length - visibleItems);

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

  // Auto slide every 4 seconds
  useEffect(() => {
    if (tenders.length <= visibleItems) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [tenders.length, nextSlide]);

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Тендерийн урилга
            </h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-10"></div>
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Link2 className="w-5 h-5 text-gray-300" />
                      </div>
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 ">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Тендерийн урилга
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Empty State */}
        {tenders.length === 0 ? (
          <div className="text-center py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Link2 className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-100 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-500">Тендерийн урилга одоогоор байхгүй байна</p>
          </div>
        ) : (
          <>
            {/* Cards Container */}
            <div className="relative">
              {/* Navigation Arrows */}
              {tenders.length > visibleItems && (
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
                {tenders.map((tender) => (
                  <div
                    key={tender.id}
                    className="w-full md:w-[calc(33.333%-16px)] flex-shrink-0"
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 overflow-hidden group h-full">
                    <div className="p-6">
                      {/* Code/Title with Icon */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <Link2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 line-clamp-1 flex-1 pt-1">
                          {tender.title.length > 25 
                            ? tender.title.slice(0, 25) + " ..." 
                            : tender.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm line-clamp-3 mb-6 min-h-[60px]">
                        {tender.description || tender.title}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(tender.created_date).toLocaleDateString('en-CA')}
                          </span>
                        </div>

                        {/* Detail Button */}
                        <Link
                          href={`/news/${tender.id}`}
                          className="flex items-center gap-1 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors group/btn"
                        >
                          Дэлгэрэнгүй
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  </div>
                ))}
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            {tenders.length > visibleItems && (
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
                href="/category/tender-urilga"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Бүх тендерийн урилга
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
