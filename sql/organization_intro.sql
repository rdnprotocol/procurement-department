-- Organization Intro sections table
-- Run this SQL in your Supabase SQL Editor

-- Байгууллагын танилцуулга хэсгүүд (Үндсэн мэдээлэл, Үнэт зүйлс, Үүрэг гэх мэт)
CREATE TABLE IF NOT EXISTS organization_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_type VARCHAR(50) NOT NULL, -- 'info_card', 'values', 'responsibilities', 'hero'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- lucide icon name
    color VARCHAR(100) DEFAULT 'from-blue-500 to-blue-600',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Хэсэг бүрийн жагсаалт (list items)
CREATE TABLE IF NOT EXISTS organization_section_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID REFERENCES organization_sections(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_org_sections_type ON organization_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_org_sections_sort ON organization_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_org_section_items_section ON organization_section_items(section_id);

-- Enable RLS
ALTER TABLE organization_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_section_items ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read organization_sections" ON organization_sections
    FOR SELECT USING (true);
CREATE POLICY "Allow public read organization_section_items" ON organization_section_items
    FOR SELECT USING (true);

-- Authenticated manage access
CREATE POLICY "Allow authenticated manage organization_sections" ON organization_sections
    FOR ALL USING (true);
CREATE POLICY "Allow authenticated manage organization_section_items" ON organization_section_items
    FOR ALL USING (true);

-- Insert sample data: Info Cards
INSERT INTO organization_sections (section_type, title, description, icon, color, sort_order)
VALUES 
('info_card', 'Байгууллагын нэр', 'Төв аймгийн Худалдан авах ажиллагааны газар', 'Building2', 'from-blue-500 to-blue-600', 1),
('info_card', 'Эрхэм зорилго', 'Худалдан авах ажиллагааг ил тод, өрсөлдөх тэгш боломжтой, үр ашигтай, хариуцлагатай зохион байгуулахад оршино', 'Target', 'from-purple-500 to-purple-600', 2),
('info_card', 'Алсын харалт', 'Төв аймгийн бүтээн байгуулалтад манлайлан оролцогч мэргэшсэн байгууллага байна', 'TrendingUp', 'from-green-500 to-green-600', 3),
('info_card', 'Үйл ажиллагаа', 'Худалдан авах ажиллагааны төлөвлөлт, зохион байгуулалт, хэрэгжүүлэлт', 'Users', 'from-orange-500 to-orange-600', 4);

-- Insert Values section
INSERT INTO organization_sections (section_type, title, description, icon, color, sort_order)
VALUES ('values', 'Бидний үнэт зүйлс', NULL, 'Award', 'from-[#24276B] to-[#3d42a0]', 5);

-- Get the values section id and insert items
DO $$
DECLARE
    values_id UUID;
    resp_id UUID;
BEGIN
    SELECT id INTO values_id FROM organization_sections WHERE section_type = 'values' LIMIT 1;
    
    INSERT INTO organization_section_items (section_id, content, sort_order)
    VALUES 
    (values_id, 'Ил тод байдал - Бүх үйл ажиллагааг ил тод, нээлттэй явуулах', 1),
    (values_id, 'Шударга байдал - Өрсөлдөх тэгш боломжтой орчинг бүрдүүлэх', 2),
    (values_id, 'Хариуцлага - Үр дүнтэй, хэмнэлттэй ажиллагаа явуулах', 3),
    (values_id, 'Мэргэжлийн чанар - Мэргэжлийн өндөр түвшний үйлчилгээ үзүүлэх', 4);

    -- Insert Responsibilities section
    INSERT INTO organization_sections (section_type, title, description, icon, color, sort_order)
    VALUES ('responsibilities', 'Бидний үүрэг', NULL, 'Users', 'from-[#24276B] to-[#3d42a0]', 6)
    RETURNING id INTO resp_id;

    INSERT INTO organization_section_items (section_id, content, sort_order)
    VALUES 
    (resp_id, 'Худалдан авах ажиллагааны төлөвлөлт, зохион байгуулалт', 1),
    (resp_id, 'Тендер зарлал, явуулах ажлыг зохион байгуулах', 2),
    (resp_id, 'Худалдан авах ажиллагааны тайлан, статистик мэдээлэл', 3),
    (resp_id, 'Хууль тогтоомжийн дагуу зөв хэрэгжүүлэлтийг хангах', 4);
END $$;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_org_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER org_sections_updated_at_trigger
    BEFORE UPDATE ON organization_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_org_sections_updated_at();







