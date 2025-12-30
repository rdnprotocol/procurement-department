-- History Events table for timeline
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS history_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Calendar',
    color VARCHAR(100) DEFAULT 'from-blue-500 to-blue-600',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_history_events_sort ON history_events(sort_order);
CREATE INDEX IF NOT EXISTS idx_history_events_year ON history_events(year);

-- Enable RLS
ALTER TABLE history_events ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read history_events" ON history_events
    FOR SELECT USING (true);

-- Authenticated manage access
CREATE POLICY "Allow authenticated manage history_events" ON history_events
    FOR ALL USING (true);

-- Insert sample data
INSERT INTO history_events (year, title, description, icon, color, sort_order)
VALUES 
('2020', 'Байгууллагын үүсэл', 'Төв аймгийн Худалдан авах ажиллагааны газар байгуулагдсан', 'Building2', 'from-blue-500 to-blue-600', 1),
('2021', 'Цахим системийн нэвтрүүлэлт', 'Худалдан авах ажиллагааны цахим системийг нэвтрүүлж, ил тод байдлыг сайжруулсан', 'TrendingUp', 'from-green-500 to-green-600', 2),
('2022', 'Хууль тогтоомжийн шинэчлэл', 'Худалдан авах ажиллагааны хууль тогтоомжийг шинэчлэн, сайжруулсан', 'Award', 'from-purple-500 to-purple-600', 3),
('2023', 'Олон улсын хамтын ажиллагаа', 'Олон улсын байгууллагуудтай хамтран ажиллаж, туршлага солилцсон', 'Globe', 'from-orange-500 to-orange-600', 4),
('2024', 'Үйл ажиллагааны өргөжүүлэлт', 'Сумдын худалдан авах ажиллагаанд дэмжлэг үзүүлж эхэлсэн', 'MapPin', 'from-teal-500 to-teal-600', 5);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_history_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER history_events_updated_at_trigger
    BEFORE UPDATE ON history_events
    FOR EACH ROW
    EXECUTE FUNCTION update_history_events_updated_at();

