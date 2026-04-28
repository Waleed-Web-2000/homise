-- ============================================================
-- HOMISEPK — Supabase SQL Setup
-- Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

-- ─── CATEGORIES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PRODUCTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  original_price NUMERIC(10,2),
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT TRUE,
  sku TEXT UNIQUE,
  rating_average NUMERIC(3,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REVIEWS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORDERS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_fee NUMERIC(10,2) DEFAULT 199,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'Pending'
    CHECK (status IN ('Pending','Processing','Shipped','Delivered','Cancelled')),
  payment_method TEXT DEFAULT 'Cash on Delivery',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BLOGS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT DEFAULT '',
  image TEXT DEFAULT '',
  author TEXT DEFAULT 'Homisepk Team',
  published BOOLEAN DEFAULT FALSE,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- PUBLIC: anyone can read categories
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT USING (true);

-- PUBLIC: anyone can read products
CREATE POLICY "Public can read products"
  ON products FOR SELECT USING (true);

-- PUBLIC: anyone can read published blogs
CREATE POLICY "Public can read published blogs"
  ON blogs FOR SELECT USING (published = true);

-- PUBLIC: anyone can read reviews
CREATE POLICY "Public can read reviews"
  ON reviews FOR SELECT USING (true);

-- PUBLIC: anyone can insert a review
CREATE POLICY "Public can insert reviews"
  ON reviews FOR INSERT WITH CHECK (true);

-- PUBLIC: anyone can place an order
CREATE POLICY "Public can insert orders"
  ON orders FOR INSERT WITH CHECK (true);

-- SERVICE ROLE: full access (used by server-side supabaseAdmin — bypasses RLS)
-- No additional policies needed; service_role key bypasses RLS automatically.

-- ─── UPDATED_AT TRIGGER for products ────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── SEED DATA ──────────────────────────────────────────────

-- Insert category
INSERT INTO categories (name, slug)
VALUES ('Best Items', 'best-items')
ON CONFLICT (slug) DO NOTHING;

-- Insert products (uses the category we just inserted)
INSERT INTO products (
  name, slug, sku, description, price, original_price,
  stock, in_stock, featured, category_id,
  rating_average, rating_count,
  meta_title, meta_description
)
SELECT
  'Smart Gun Massager for Deep Tissue Percussion Therapy & Muscle Recovery',
  'gun-massager',
  'HMK-GM-001',
  'Powerful percussion therapy device for deep tissue massage and muscle recovery. Features 6 interchangeable massage heads, 20 adjustable speed settings, and a quiet brushless motor. Rechargeable battery lasts up to 6 hours. Ideal for athletes, office workers, and anyone suffering from muscle pain or tension.',
  2499, 3500,
  50, true, true,
  (SELECT id FROM categories WHERE slug = 'best-items'),
  4.5, 12,
  'Smart Gun Massager - Deep Tissue Percussion Therapy | Homisepk',
  'Buy Smart Gun Massager at Rs. 2499 in Pakistan. 6 massage heads, 20 speed settings. Cash on Delivery. Fast shipping 3-5 days. 7-day easy returns.'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
  name, slug, sku, description, price, original_price,
  stock, in_stock, featured, category_id,
  rating_average, rating_count,
  meta_title, meta_description
)
SELECT
  '2-in-1 Rechargeable Eyebrow Trimmer & Painless Facial Hair Remover for Women – Portable Electric Epilator with Precision Head',
  'eyebrow-trimmer',
  'HMK-ET-002',
  'Dual-function beauty device that trims eyebrows with precision and removes unwanted facial hair painlessly. Features a rechargeable USB design, precision trimming head, and LED light. Compact, portable, and waterproof. Perfect for on-the-go grooming.',
  1299, 1699,
  75, true, true,
  (SELECT id FROM categories WHERE slug = 'best-items'),
  4.3, 8,
  '2-in-1 Eyebrow Trimmer & Facial Hair Remover | Homisepk',
  'Buy 2-in-1 Rechargeable Eyebrow Trimmer at Rs. 1299 in Pakistan. Painless, portable, rechargeable. Cash on Delivery. 7-day returns.'
ON CONFLICT (slug) DO NOTHING;

-- Done! Verify with:
-- SELECT * FROM categories;
-- SELECT name, slug, price FROM products;
