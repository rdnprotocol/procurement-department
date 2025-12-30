"use client";

import { useEffect, useState, useRef } from "react";
import { FileText, Newspaper, Users, Building2 } from "lucide-react";

export function StatsBanner() {
  const [tenderCount, setTenderCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
  }, []);

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animated counter hook
  const useCounter = (target: number, duration: number = 2500) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible || target === 0) return;
      
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(Math.floor(easeOutExpo * target));

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
    }, [target, duration]);

    return count;
  };

  const animatedTenderCount = useCounter(tenderCount);
  const animatedNewsCount = useCounter(newsCount);

  const stats = [
    {
      icon: FileText,
      count: animatedTenderCount,
      label: "Тендерийн урилга",
      color: "from-blue-500 to-blue-600",
      delay: "0ms"
    },
    {
      icon: Newspaper,
      count: animatedNewsCount,
      label: "Мэдээ, мэдээлэл",
      color: "from-emerald-500 to-emerald-600",
      delay: "100ms"
    },
    {
      icon: Users,
      count: 27,
      label: "Сумдын тоо",
      color: "from-amber-500 to-amber-600",
      delay: "200ms"
    },
    {
      icon: Building2,
      count: 95,
      label: "Ажилтнууд",
      color: "from-purple-500 to-purple-600",
      delay: "300ms"
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: "url('/tov-aimag.jpg')",
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/85 to-blue-900/90" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Иргэн төвтэй төрийн үйлчилгээ
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto rounded-full" />
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            Төв аймгийн Худалдан авах ажиллагааны газрын үйл ажиллагааны тоон мэдээлэл
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`
                  group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 
                  border border-white/20 hover:border-white/40
                  transform transition-all duration-500 hover:scale-105 hover:-translate-y-1
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ 
                  transitionDelay: stat.delay,
                }}
              >
                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Count */}
                <div className="text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight">
                  {stat.count > 0 ? stat.count.toLocaleString() : "0"}
                  <span className="text-2xl text-white/60">+</span>
                </div>
                
                {/* Label */}
                <div className="text-sm text-white/70 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

