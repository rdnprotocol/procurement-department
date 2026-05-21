import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

interface DailyStatRow {
  day: string;
  views: number;
}

const emptyStats = {
  today: 0,
  last24Hours: 0,
  last7Days: 0,
  lastMonth: 0,
  total: 0,
  isConfigured: false,
};

function toUtcDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(days: number) {
  return toUtcDay(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
}

function isAnalyticsNotConfigured(error: { code?: string; message?: string }) {
  return (
    error.code === "PGRST202" ||
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    error.message?.includes("visitor_daily_stats") ||
    error.message?.includes("increment_visitor_daily_stats")
  );
}

async function hasDailyStatsTable() {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("visitor_daily_stats")
    .select("day")
    .limit(1);

  if (!error) {
    return true;
  }

  if (isAnalyticsNotConfigured(error)) {
    return false;
  }

  throw error;
}

function sumViews(rows: DailyStatRow[], fromDay?: string) {
  return rows.reduce((sum, row) => {
    if (fromDay && row.day < fromDay) {
      return sum;
    }

    return sum + (Number(row.views) || 0);
  }, 0);
}

export async function GET() {
  try {
    if (!(await hasDailyStatsTable())) {
      return NextResponse.json(emptyStats);
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("visitor_daily_stats")
      .select("day, views")
      .order("day", { ascending: false });

    if (error) {
      throw error;
    }

    const rows = (data || []) as DailyStatRow[];
    const today = toUtcDay(new Date());
    const todayViews = sumViews(rows, today);
    const last7Days = sumViews(rows, daysAgo(6));
    const lastMonth = sumViews(rows, daysAgo(29));
    const total = sumViews(rows);

    return NextResponse.json({
      today: todayViews,
      last24Hours: todayViews,
      last7Days,
      lastMonth,
      total,
      isConfigured: true,
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    return NextResponse.json(emptyStats);
  }
}

export async function POST() {
  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.rpc("increment_visitor_daily_stats", {
      stat_day: toUtcDay(new Date()),
    });

    if (error) {
      if (isAnalyticsNotConfigured(error)) {
        return NextResponse.json({ success: false, isConfigured: false });
      }

      throw error;
    }

    return NextResponse.json({ success: true, isConfigured: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json({ success: false, isConfigured: false });
  }
}
