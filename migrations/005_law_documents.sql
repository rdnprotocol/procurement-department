-- Migration: Create law_documents table
-- Run this SQL to create the table for managing law documents

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

-- Types explanation:
-- 'law_link' - Байгууллагын хууль тогтоомж (legalinfo.mn линк)
-- 'director_order' - Газрын даргын тушаал (PDF файл)
-- 'procurement_law' - Худалдан авах ажиллагааны хууль тогтоомж (legalinfo.mn линк)

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_law_documents_type ON law_documents(type);
CREATE INDEX IF NOT EXISTS idx_law_documents_created_at ON law_documents(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE law_documents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your security needs)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'law_documents' AND policyname = 'Allow all operations on law_documents'
  ) THEN
    CREATE POLICY "Allow all operations on law_documents" ON law_documents
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_law_documents_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_law_documents_updated_at ON law_documents;
CREATE TRIGGER update_law_documents_updated_at
  BEFORE UPDATE ON law_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_law_documents_updated_at_column();

