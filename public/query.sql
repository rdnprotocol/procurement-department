-- User
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- store hashed password
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content
CREATE TABLE content (
id SERIAL PRIMARY KEY,
banner_image TEXT,
title TEXT NOT NULL,
created_date DATE NOT NULL,
category_id INTEGER NOT NULL
);

-- Content-item
CREATE TABLE content_item (
id SERIAL PRIMARY KEY,
content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
text TEXT,
image TEXT
);
