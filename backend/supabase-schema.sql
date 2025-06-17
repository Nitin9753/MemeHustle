 -- Create memes table
CREATE TABLE memes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  caption TEXT,
  vibe TEXT,
  upvotes INTEGER DEFAULT 0,
  owner_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bids table
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meme_id UUID REFERENCES memes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  credits INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX memes_upvotes_idx ON memes(upvotes DESC);
CREATE INDEX memes_created_at_idx ON memes(created_at DESC);
CREATE INDEX bids_meme_id_idx ON bids(meme_id);
CREATE INDEX bids_credits_idx ON bids(credits DESC);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_memes_updated_at
BEFORE UPDATE ON memes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bids_updated_at
BEFORE UPDATE ON bids
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional)
INSERT INTO memes (title, image_url, tags, caption, vibe, upvotes, owner_id)
VALUES 
('Doge HODL', 'https://picsum.photos/seed/doge/400/300', ARRAY['crypto', 'funny'], 'When you buy at ATH but still HODL', 'Diamond Hands Energy', 69, 'cyberpunk420'),
('Matrix Glitch', 'https://picsum.photos/seed/matrix/400/300', ARRAY['hacker', 'tech'], 'When the code finally compiles after 100 errors', 'Digital Dystopia Vibes', 42, 'neo_hacker'),
('Stonks Only Go Up', 'https://picsum.photos/seed/stonks/400/300', ARRAY['finance', 'crypto'], 'POV: Your portfolio after following Reddit advice', 'Neon Market Chaos', 100, 'wallstreetcyber');