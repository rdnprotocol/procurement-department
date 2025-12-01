-- Create static_contents table
CREATE TABLE IF NOT EXISTS static_contents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL CHECK (type IN ('mission', 'vision', 'goal', 'history', 'structure')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC', NOW())
);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('UTC', NOW());
    RETURN NEW;   
END;
$$ language 'plpgsql';

CREATE TRIGGER update_static_contents_updated_at
    BEFORE UPDATE ON static_contents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default values
INSERT INTO static_contents (title, content, type) VALUES
('Эрхэм зорилго', 'Байгууллагын эрхэм зорилго оруулна уу', 'mission'),
('Алсын харалт', 'Байгууллагын алсын харалт оруулна уу', 'vision'),
('Стратегийн зорилтууд', 'Байгууллагын стратегийн зорилтуудыг оруулна уу', 'goal')
ON CONFLICT DO NOTHING;