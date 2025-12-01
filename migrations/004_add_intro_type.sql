-- Add 'intro' type to static_contents table
ALTER TABLE static_contents 
DROP CONSTRAINT IF EXISTS static_contents_type_check;

ALTER TABLE static_contents 
ADD CONSTRAINT static_contents_type_check 
CHECK (type IN ('mission', 'vision', 'goal', 'history', 'structure', 'intro'));

-- Insert default intro content if it doesn't exist
INSERT INTO static_contents (title, content, type) VALUES
('Байгууллагын танилцуулга', 'Байгууллагын танилцуулга оруулна уу', 'intro')
ON CONFLICT DO NOTHING;

