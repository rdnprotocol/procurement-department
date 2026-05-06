-- Contact info singleton table
-- Энэ хүснэгт нь зөвхөн нэг мөртэй (id = 1)
CREATE TABLE IF NOT EXISTS contact_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    -- Hero section
    hero_title TEXT DEFAULT 'Холбоо барих',
    hero_subtitle TEXT DEFAULT 'Худалдан авах ажиллагаатай холбоотой санал, хүсэлт, гомдлоо бидэнтэй хуваалцана уу',

    -- Address
    address_main TEXT DEFAULT 'Төв аймаг, Зуунмод сум, 6-р баг',
    address_secondary TEXT DEFAULT 'Төр захиргааны 2-р байр',
    map_url TEXT DEFAULT 'https://maps.app.goo.gl/9BbHsXsCJ1e4ehv3A',
    map_embed_url TEXT DEFAULT 'https://www.google.com/maps?q=Zuunmod,Tov+Aimag,Mongolia&hl=mn&z=14&output=embed',

    -- Contact details
    phone TEXT DEFAULT '+976 7755-3579',
    email TEXT DEFAULT 'tuvprocurement@tov.gov.mn',
    website TEXT DEFAULT 'ub-procurement.mn',
    website_url TEXT DEFAULT 'https://ub-procurement.mn',

    -- Social
    facebook_url TEXT DEFAULT '#',
    facebook_label TEXT DEFAULT 'Төв аймгийн Худалдан авах ажиллагааны газар',

    -- Reception schedule
    meeting_hours TEXT DEFAULT 'Мягмар, Баасан 15:00 - 17:00',

    -- Director / detailed contact (footer of form)
    director_organization TEXT DEFAULT 'Төв аймгийн Худалдан авах ажиллагааны газар',
    director_department TEXT DEFAULT 'Захиргаа, санхүүгийн хэлтэс',
    director_position TEXT DEFAULT 'Уг тагч, зохион байгуулагч',
    director_person TEXT DEFAULT '',
    director_room TEXT DEFAULT '716 тоот өрөө',
    director_phone TEXT DEFAULT '7755-3579',

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC', NOW()),
    CONSTRAINT contact_info_singleton CHECK (id = 1)
);

-- Default row нэмэх
INSERT INTO contact_info (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- updated_at trigger (өмнө үүсгэгдсэн update_updated_at_column функцийг ашиглана)
DROP TRIGGER IF EXISTS update_contact_info_updated_at ON contact_info;
CREATE TRIGGER update_contact_info_updated_at
    BEFORE UPDATE ON contact_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Contact messages: маягтаар ирсэн санал хүсэлтүүд
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    subject TEXT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC', NOW())
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
