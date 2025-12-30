"use client";

import { useEffect, useState } from "react";

export function StatsBanner() {
  const [tenderCount, setTenderCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch counts from API
    const fetchCounts = async () => {
      try {
        // Fetch tender invitations count
        const tenderRes = await fetch("/api/tender");
        if (tenderRes.ok) {
          const tenderData = await tenderRes.json();
          setTenderCount(tenderData.length || 0);
        }

        // Fetch news count
        const newsRes = await fetch("/api/content");
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setNewsCount(newsData.length || 0);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
    setIsVisible(true);
  }, []);

  // Animated counter hook
  const useCounter = (target: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible || target === 0) return;
      
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * target));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }, [target, duration, isVisible]);

    return count;
  };

  const animatedTenderCount = useCounter(tenderCount);
  const animatedNewsCount = useCounter(newsCount);

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/tov-aimag.jpg')",
        }}
      />
      
      {/* Blue Overlay */}
      <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Title Section */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Иргэн төвтэй төрийн
              <br />
              үйлчилгээ
            </h2>
            <div className="w-16 h-1 bg-white mt-4 mx-auto md:mx-0 rounded-full" />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-12 md:gap-16">
            {/* Tender Invitations */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {animatedTenderCount > 0 ? `${animatedTenderCount}+` : "0+"}
              </div>
              <div className="text-sm md:text-base text-white/80 font-medium">
                Тендерийн урилга
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-16 bg-white/30 hidden md:block" />

            {/* News & Information */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {animatedNewsCount > 0 ? `${animatedNewsCount}+` : "0+"}
              </div>
              <div className="text-sm md:text-base text-white/80 font-medium">
                Мэдээ, мэдээлэл
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

