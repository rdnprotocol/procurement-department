-- Update content table structure
ALTER TABLE content
  DROP CONSTRAINT content_category_id_fkey,
  ADD COLUMN content TEXT,
  ADD COLUMN type TEXT,
  ADD COLUMN status TEXT,
  ADD COLUMN description TEXT,
  ALTER COLUMN category_id DROP NOT NULL,
  ADD CONSTRAINT content_category_id_fkey 
    FOREIGN KEY (category_id) 
    REFERENCES categories(id) 
    ON DELETE CASCADE;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);