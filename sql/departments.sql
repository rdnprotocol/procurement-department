-- Departments table for organization structure
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100) NOT NULL,
    description TEXT,
    responsibilities TEXT[] DEFAULT '{}',
    contact_person VARCHAR(255),
    contact_position VARCHAR(255),
    contact_room VARCHAR(100),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    color VARCHAR(100) DEFAULT 'from-blue-500 to-blue-600',
    sort_order INTEGER DEFAULT 0,
    is_director BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for sorting
CREATE INDEX IF NOT EXISTS idx_departments_sort_order ON departments(sort_order);

-- Enable RLS (Row Level Security)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON departments
    FOR SELECT USING (true);

-- Create policy for authenticated users to manage departments
CREATE POLICY "Allow authenticated users to manage departments" ON departments
    FOR ALL USING (true);

-- Insert sample data
INSERT INTO departments (name, short_name, description, responsibilities, contact_person, contact_position, contact_room, contact_phone, contact_email, color, sort_order, is_director)
VALUES 
(
    'Газрын дарга',
    'Газрын дарга',
    'Төв аймгийн Худалдан авах ажиллагааны газрын үйл ажиллагааг удирдан зохион байгуулна.',
    ARRAY['Байгууллагын үйл ажиллагааг удирдах', 'Стратеги төлөвлөгөө боловсруулах', 'Гадаад харилцааг хариуцах', 'Хэлтсүүдийн ажлыг уялдуулах'],
    'Ц.Ганзориг',
    'Газрын дарга',
    '710 тоот өрөө',
    '7755-3570',
    'director@tov.gov.mn',
    'from-[#24276B] to-[#3d42a0]',
    0,
    TRUE
),
(
    'Захиргаа, санхүүгийн хэлтэс',
    'Захиргаа, санхүү',
    'Байгууллагын захиргааны болон санхүүгийн үйл ажиллагааг хариуцан ажиллана.',
    ARRAY['Байгууллагын өдөр тутмын захиргааны үйл ажиллагааг зохион байгуулах', 'Санхүүгийн төлөвлөгөө, тайлан боловсруулах', 'Хүний нөөцийн бодлого, шийдвэрийг хэрэгжүүлэх', 'Дотоод хяналт, шалгалт хийх'],
    'Б.Мөнхдэлгэр',
    'Хэлтсийн дарга',
    '716 тоот өрөө',
    '7755-3579',
    'admin@tov.gov.mn',
    'from-blue-500 to-blue-600',
    1,
    FALSE
),
(
    'Худалдан авах ажиллагааны хэлтэс',
    'Худалдан авалт',
    'Төсвийн хөрөнгөөр бараа, ажил, үйлчилгээ худалдан авах ажиллагааг зохион байгуулна.',
    ARRAY['Тендер шалгаруулалт зохион байгуулах', 'Худалдан авах ажиллагааны төлөвлөгөө боловсруулах', 'Гэрээний хэрэгжилтэд хяналт тавих', 'Захиалагч байгууллагуудад мэргэжлийн зөвлөгөө өгөх', 'Тендерийн баримт бичиг боловсруулах'],
    'Д.Батбаяр',
    'Хэлтсийн дарга',
    '718 тоот өрөө',
    '7755-3580',
    'procurement@tov.gov.mn',
    'from-green-500 to-green-600',
    2,
    FALSE
),
(
    'Хяналт, шинжилгээ үнэлгээний хэлтэс',
    'Хяналт, үнэлгээ',
    'Худалдан авах ажиллагааны хяналт, шинжилгээ, үнэлгээг хариуцан ажиллана.',
    ARRAY['Худалдан авах ажиллагаанд хяналт тавих', 'Гэрээний биелэлтийг хянах', 'Үр дүнгийн шинжилгээ хийх', 'Тайлан, судалгаа боловсруулах', 'Сумдын худалдан авах ажиллагаанд дэмжлэг үзүүлэх'],
    'Э.Оюунчимэг',
    'Хэлтсийн дарга',
    '720 тоот өрөө',
    '7755-3581',
    'monitoring@tov.gov.mn',
    'from-purple-500 to-purple-600',
    3,
    FALSE
);

-- Trigger to update updated_at on changes
CREATE OR REPLACE FUNCTION update_departments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER departments_updated_at_trigger
    BEFORE UPDATE ON departments
    FOR EACH ROW
    EXECUTE FUNCTION update_departments_updated_at();

