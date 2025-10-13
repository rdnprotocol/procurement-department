-- Seed data for procurement department
-- Created: 2025-10-10

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Мэдээ мэдээлэл', 'Ерөнхий мэдээ мэдээлэл'),
('Тендер зарлал', 'Худалдан авалтын тендер зарлалууд'),
('Хуулийн мэдээлэл', 'Холбогдох хууль, дүрэм журам'),
('Сургалт', 'Боловсрол дээшлүүлэх сургалтууд'),
('Тайлан', 'Үйл ажиллагааны тайлангууд')
ON CONFLICT DO NOTHING;

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password) VALUES
('admin', 'admin@procurement.gov.mn', '$2b$10$BFI.rgqGmbXWp/6et4B0MuzrW9jg29ty5G5NlydD4QjjpctDQ0dpe')
ON CONFLICT (email) DO NOTHING;

-- Insert sample content
INSERT INTO content (banner_image, title, created_date, category_id) VALUES
('/news-image-1.jpg', '2025 оны худалдан авалтын журам', '2025-01-15', 1),
('/city.png', 'Барилгын материалын тендер зарлал', '2025-02-01', 2),
('/file.jpg', 'Худалдан авалтын мэргэжилтний сургалт', '2025-03-10', 4)
ON CONFLICT DO NOTHING;