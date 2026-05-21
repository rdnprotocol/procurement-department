-- Store aggregated visitor counts by day instead of raw page view events.

CREATE TABLE IF NOT EXISTS visitor_daily_stats (
  day DATE PRIMARY KEY,
  views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If the previous raw event table exists, preserve totals by folding it into
-- the daily aggregate table, then remove the raw events to avoid unbounded data.
DO $$
BEGIN
  IF to_regclass('public.visitor_events') IS NOT NULL THEN
    INSERT INTO visitor_daily_stats (day, views)
    SELECT created_at::date AS day, COUNT(*)::integer AS views
    FROM visitor_events
    GROUP BY created_at::date
    ON CONFLICT (day) DO UPDATE
    SET
      views = visitor_daily_stats.views + EXCLUDED.views,
      updated_at = NOW();
  END IF;
END;
$$;

DROP TABLE IF EXISTS visitor_events;

CREATE OR REPLACE FUNCTION increment_visitor_daily_stats(stat_day DATE DEFAULT CURRENT_DATE)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO visitor_daily_stats (day, views, updated_at)
  VALUES (stat_day, 1, NOW())
  ON CONFLICT (day) DO UPDATE
  SET
    views = visitor_daily_stats.views + 1,
    updated_at = NOW();
END;
$$;

ALTER TABLE visitor_daily_stats ENABLE ROW LEVEL SECURITY;

-- Keep visitor_daily_stats private. The app reads/writes through service-role API routes.
