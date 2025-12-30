-- Supabase SQL Migration: law_documents table
-- Run this SQL in your Supabase SQL Editor

-- Create the law_documents table
CREATE TABLE IF NOT EXISTS law_documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('law_link', 'director_order', 'procurement_law')),
  url TEXT, -- For legalinfo.mn links
  file_url TEXT, -- For PDF files
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Types:
-- 'law_link' - Байгууллагын хууль тогтоомж (legalinfo.mn линк)
-- 'director_order' - Газрын даргын тушаал (PDF файл)
-- 'procurement_law' - Худалдан авах ажиллагааны хууль тогтоомж (legalinfo.mn линк)

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_law_documents_type ON law_documents(type);
CREATE INDEX IF NOT EXISTS idx_law_documents_created_at ON law_documents(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE law_documents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations on law_documents" ON law_documents
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_law_documents_updated_at
  BEFORE UPDATE ON law_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional - uncomment to insert sample data)
/*
-- Худалдан авах ажиллагааны хууль тогтоомж (procurement_law)
INSERT INTO law_documents (title, type, url, description) VALUES
('Төрийн болон орон нутгийн өмчийн хөрөнгөөр бараа, ажил, үйлчилгээ худалдан авах тухай хууль', 'procurement_law', 'https://legalinfo.mn/mn/detail?lawId=12256', '2005 оны 12 дугаар сарын 01-ний өдөр баталсан'),
('Төрийн худалдан авах ажиллагааны журам', 'procurement_law', 'https://www.tender.gov.mn/mn/document/list', 'Засгийн газрын тогтоолоор батлагдсан журам');

-- Байгууллагын хууль тогтоомж (law_link)
INSERT INTO law_documents (title, type, url, description) VALUES
('Төрийн албаны тухай хууль', 'law_link', 'https://legalinfo.mn/mn/detail?lawId=12012', 'Төрийн албаны тухай хууль тогтоомж'),
('Хөдөлмөрийн тухай хууль', 'law_link', 'https://legalinfo.mn/mn/detail?lawId=16172', 'Хөдөлмөрийн харилцааны хууль');

-- Газрын даргын тушаал (director_order)
INSERT INTO law_documents (title, type, file_url, description) VALUES
('Тушаал №А/01 - Ажлын хэсэг байгуулах тухай', 'director_order', '/uploads/tushaal_a01.pdf', '2024 оны 1-р сарын тушаал'),
('Тушаал №А/02 - Дүрэм батлах тухай', 'director_order', '/uploads/tushaal_a02.pdf', '2024 оны 2-р сарын тушаал');
*/

-- View the table structure
-- SELECT * FROM law_documents;

