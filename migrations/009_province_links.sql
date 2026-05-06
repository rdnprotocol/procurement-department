-- Province menu links: NavBar-ын "Сумд" цэсний дэд линкийг засах боломжтой болгох
CREATE TABLE IF NOT EXISTS province_links (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    plans_url TEXT,
    tender_url TEXT,
    plans_label TEXT DEFAULT 'Төлөвлөгөө',
    tender_label TEXT DEFAULT 'Тендер шалгаруулалт',
    sort_order INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC', NOW())
);

-- updated_at trigger
DROP TRIGGER IF EXISTS update_province_links_updated_at ON province_links;
CREATE TRIGGER update_province_links_updated_at
    BEFORE UPDATE ON province_links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Анхдагч өгөгдөл (өмнө нь /utils/provinces.ts-д жагсаасан 27 сум)
INSERT INTO province_links (slug, title, sort_order) VALUES
    ('altanbulag', 'Алтанбулаг', 1),
    ('argalant', 'Аргалант', 2),
    ('arkhust', 'Архуст', 3),
    ('batsumber', 'Батсүмбэр', 4),
    ('bayan', 'Баян', 5),
    ('bayandelger', 'Баяндэлгэр', 6),
    ('bayanjargalan', 'Баянжаргалан', 7),
    ('bayan-unjul', 'Баян-Өнжүүл', 8),
    ('bayankhangai', 'Баянхангай', 9),
    ('bayantsagaan', 'Баянцагаан', 10),
    ('bayantsogt', 'Баянцогт', 11),
    ('bayanchandmani', 'Баянчандмань', 12),
    ('bornuur', 'Борнуур', 13),
    ('buren', 'Бүрэн', 14),
    ('delgerkhaan', 'Дэлгэрхаан', 15),
    ('jargalant', 'Жаргалант', 16),
    ('zaamar', 'Заамар', 17),
    ('zuunmod', 'Зуунмод', 18),
    ('lun', 'Лүн', 19),
    ('mungunmorit', 'Мөнгөнморьт', 20),
    ('undurshireet', 'Өндөрширээт', 21),
    ('sumber', 'Сүмбэр', 22),
    ('sergelen', 'Сэргэлэн', 23),
    ('ugtaaltsaidam', 'Угтаалцайдам', 24),
    ('tseel', 'Цээл', 25),
    ('erdene', 'Эрдэнэ', 26),
    ('erdenesant', 'Эрдэнэсант', 27)
ON CONFLICT (slug) DO NOTHING;
