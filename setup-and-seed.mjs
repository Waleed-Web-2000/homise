import { createClient } from "@supabase/supabase-js";

// Homedeals (source)
const homedeals = createClient(
  "https://gscxhfggqsezrmquwmoc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzY3hoZmdncXNlenJtcXV3bW9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQxMTU5OSwiZXhwIjoyMDkwOTg3NTk5fQ._LptJjmJUre1uSIqeecvyzJXgqEoY6KHEA2Dk_0wJvQ"
);

// Homisepk (destination)
const homise = createClient(
  "https://jlqwedpkgraktjqgpjmd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpscXdlZHBrZ3Jha3RqcWdwam1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzM3NDkyMywiZXhwIjoyMDkyOTUwOTIzfQ.AUUDjW4awWQ8UIfuCvthbfvgp29lO7wJHotjy3eHw_c"
);

// ── Step 1: Create tables ────────────────────────────────────────────────────
async function createTables() {
  const sql = `
    CREATE TABLE IF NOT EXISTS categories (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      image TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

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
      sku TEXT,
      rating_average NUMERIC(3,1) DEFAULT 0,
      rating_count INTEGER DEFAULT 0,
      featured BOOLEAN DEFAULT FALSE,
      meta_title TEXT DEFAULT '',
      meta_description TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
      comment TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      full_name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      city TEXT NOT NULL,
      address TEXT NOT NULL,
      items JSONB NOT NULL DEFAULT '[]',
      subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
      shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 199,
      total NUMERIC(10,2) NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Pending',
      payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery',
      notes TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

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
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  console.log("Note: Make sure to run supabase-tables.sql in Supabase SQL Editor first if tables don't exist");
}

// ── Step 2: Fetch products from homedeals ────────────────────────────────────
const SLUGS = [
  "one-step-hot-air-brush-dryer-styler",
  "muscle-relaxation-gun-massager",
];

async function seedProducts() {
  for (const slug of SLUGS) {
    console.log(`\nFetching: ${slug}`);

    const { data: p, error } = await homedeals
      .from("products")
      .select("*, category:collections(*)")
      .eq("slug", slug)
      .single();

    if (error || !p) {
      console.error(`  ✗ Not found in homedeals: ${error?.message}`);
      continue;
    }

    // Map homedeals schema → homisepk schema
    const product = {
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      price: p.price,
      original_price: p.original_price || null,
      images: p.images || (p.image ? [p.image] : []),
      stock: p.stock ?? 50,
      in_stock: (p.stock ?? 50) > 0,
      featured: p.featured || false,
      meta_title: p.seo_title || p.name,
      meta_description: p.seo_description || p.description?.slice(0, 160) || "",
    };

    // Handle category
    if (p.category) {
      // Check if category exists
      let { data: cat } = await homise
        .from("categories")
        .select("id")
        .eq("slug", p.category.slug)
        .single();

      if (!cat) {
        const { data: newCat } = await homise
          .from("categories")
          .insert({ name: p.category.name, slug: p.category.slug, image: p.category.image || "" })
          .select()
          .single();
        cat = newCat;
      }
      if (cat) product.category_id = cat.id;
    }

    // Insert product
    const { error: insertError } = await homise
      .from("products")
      .upsert(product, { onConflict: "slug" });

    if (insertError) {
      console.error(`  ✗ Insert failed: ${insertError.message}`);
    } else {
      console.log(`  ✓ Inserted: ${p.name}`);
    }
  }
}

await createTables();
await seedProducts();
console.log("\n✅ Done! Now update Vercel env vars with new Supabase credentials.");
