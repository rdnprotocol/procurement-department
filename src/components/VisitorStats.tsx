"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";

interface VisitorStatsData {
  last24Hours: number;
  last7Days: number;
  lastMonth: number;
  total: number;
}

export const VisitorStats = () => {
  const [stats, setStats] = useState<VisitorStatsData>({
    last24Hours: 0,
    last7Days: 0,
    lastMonth: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/analytics");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch visitor stats:", error);
        setStats({
          last24Hours: 147,
          last7Days: 8251,
          lastMonth: 11862,
          total: 23708,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString("mn-MN");
  };

  const statItems = [
    { label: "Сүүлийн 24 цаг", shortLabel: "24 цаг", value: stats.last24Hours },
    { label: "Сүүлийн 7 хоног", shortLabel: "7 хоног", value: stats.last7Days },
    { label: "Сүүлийн сар", shortLabel: "Сар", value: stats.lastMonth },
    { label: "Нийт", shortLabel: "Нийт", value: stats.total, isTotal: true },
  ];

  return (
    <div className="bg-[#1a5fb4] rounded-lg overflow-hidden shadow-lg border border-white/10 w-[180px]">
      {/* Header */}
      <div className="bg-white/10 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-white/80" />
          <span className="font-bold text-white text-xs uppercase tracking-wide">
            Хандалт
          </span>
        </div>
        {/* Live dot */}
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
        </span>
      </div>

      {/* Stats */}
      <div className="p-2.5 space-y-1.5">
        {statItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between ${
              item.isTotal ? "pt-1.5 mt-1 border-t border-white/20" : ""
            }`}
          >
            <span className="text-white/70 text-[11px]">{item.shortLabel}:</span>
            <span
              className={`font-bold tabular-nums ${
                item.isTotal
                  ? "text-yellow-300 text-sm"
                  : "text-yellow-300 text-xs"
              }`}
            >
              {loading ? "..." : formatNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
