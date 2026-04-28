// Server-side DB functions — use supabaseAdmin (bypasses RLS)
// Import this only in server components or API routes, NEVER in client components

import { supabaseAdmin } from './supabaseAdmin';

// ─── PRODUCTS ───────────────────────────────────────────────────────────────

export async function getProducts({ featured, inStock, categorySlug } = {}) {
  let query = supabaseAdmin
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .order('created_at', { ascending: false });

  if (featured === true || featured === 'true') query = query.eq('featured', true);
  if (inStock === true || inStock === 'true') query = query.eq('in_stock', true);
  if (categorySlug) {
    const { data: cat } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    if (cat) query = query.eq('category_id', cat.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(normalizeProduct);
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, category:categories(id, name, slug), reviews(*)')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return normalizeProduct(data);
}

export async function getProductById(id) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return normalizeProduct(data);
}

export async function createProduct(data) {
  const row = toProductRow(data);
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return normalizeProduct(product);
}

export async function updateProduct(id, data) {
  const row = toProductRow(data);
  row.updated_at = new Date().toISOString();
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .update(row)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return normalizeProduct(product);
}

export async function deleteProduct(id) {
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function addReview(productSlug, { name, email, rating, comment }) {
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('id, rating_average, rating_count')
    .eq('slug', productSlug)
    .single();
  if (!product) throw new Error('Product not found');

  const { error } = await supabaseAdmin
    .from('reviews')
    .insert({ product_id: product.id, name, email, rating: Number(rating), comment });
  if (error) throw error;

  // Recalculate average
  const { data: reviews } = await supabaseAdmin
    .from('reviews')
    .select('rating')
    .eq('product_id', product.id);

  const count = reviews.length;
  const average = count > 0
    ? parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1))
    : 0;

  await supabaseAdmin
    .from('products')
    .update({ rating_average: average, rating_count: count })
    .eq('id', product.id);

  return { average, count };
}

// ─── CATEGORIES ─────────────────────────────────────────────────────────────

export async function getCategories() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function getCategoryBySlug(slug) {
  const { data: category, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;

  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .eq('category_id', category.id)
    .order('created_at', { ascending: false });

  return { category, products: (products || []).map(normalizeProduct) };
}

export async function createCategory(data) {
  const { data: cat, error } = await supabaseAdmin
    .from('categories')
    .insert({ name: data.name, slug: data.slug, image: data.image || '' })
    .select()
    .single();
  if (error) throw error;
  return cat;
}

export async function updateCategory(id, data) {
  const update = {};
  if (data.name) update.name = data.name;
  if (data.slug) update.slug = data.slug;
  if (data.image !== undefined) update.image = data.image;
  const { data: cat, error } = await supabaseAdmin
    .from('categories')
    .update(update)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return cat;
}

export async function deleteCategory(id) {
  const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ─── ORDERS ─────────────────────────────────────────────────────────────────

export async function createOrder(data) {
  const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = 199;
  const total = subtotal + shippingFee;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .insert({
      full_name: data.fullName,
      mobile: data.mobile,
      city: data.city,
      address: data.address,
      items: data.items,
      subtotal,
      shipping_fee: shippingFee,
      total,
      notes: data.notes || '',
      payment_method: 'Cash on Delivery',
      status: 'Pending'
    })
    .select()
    .single();
  if (error) throw error;
  return normalizeOrder(order);
}

export async function getOrders() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeOrder);
}

export async function getOrderById(id) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return normalizeOrder(data);
}

export async function updateOrderStatus(id, status) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return normalizeOrder(data);
}

export async function getOrderStats() {
  const [{ count: totalOrders }, { data: revenueData }, { count: totalProducts }, { count: totalBlogs }, { data: recentOrders }] =
    await Promise.all([
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('total').neq('status', 'Cancelled'),
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('blogs').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
    ]);

  const totalRevenue = (revenueData || []).reduce((s, o) => s + (o.total || 0), 0);
  return {
    totalOrders: totalOrders || 0,
    totalRevenue,
    totalProducts: totalProducts || 0,
    totalBlogs: totalBlogs || 0,
    recentOrders: (recentOrders || []).map(normalizeOrder)
  };
}

// ─── BLOGS ──────────────────────────────────────────────────────────────────

export async function getBlogs(publishedOnly = true) {
  let query = supabaseAdmin.from('blogs').select('*').order('created_at', { ascending: false });
  if (publishedOnly) query = query.eq('published', true);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getBlogBySlug(slug) {
  const { data, error } = await supabaseAdmin
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  if (error) throw error;
  return data;
}

export async function createBlog(data) {
  const { data: blog, error } = await supabaseAdmin
    .from('blogs')
    .insert({
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt || '',
      image: data.image || '',
      author: data.author || 'Homisepk Team',
      published: data.published === 'true' || data.published === true,
      meta_title: data.metaTitle || '',
      meta_description: data.metaDescription || ''
    })
    .select()
    .single();
  if (error) throw error;
  return blog;
}

export async function updateBlog(id, data) {
  const update = {};
  if (data.title) update.title = data.title;
  if (data.slug) update.slug = data.slug;
  if (data.content) update.content = data.content;
  if (data.excerpt !== undefined) update.excerpt = data.excerpt;
  if (data.image !== undefined) update.image = data.image;
  if (data.published !== undefined) update.published = data.published === 'true' || data.published === true;
  if (data.metaTitle !== undefined) update.meta_title = data.metaTitle;
  if (data.metaDescription !== undefined) update.meta_description = data.metaDescription;

  const { data: blog, error } = await supabaseAdmin
    .from('blogs')
    .update(update)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return blog;
}

export async function deleteBlog(id) {
  const { error } = await supabaseAdmin.from('blogs').delete().eq('id', id);
  if (error) throw error;
}

// ─── NORMALIZERS (snake_case → camelCase for frontend) ───────────────────────

function normalizeProduct(p) {
  if (!p) return p;
  return {
    _id: p.id,
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    originalPrice: p.original_price,
    images: p.images || [],
    category: p.category || null,
    stock: p.stock,
    inStock: p.in_stock,
    sku: p.sku,
    ratings: { average: p.rating_average || 0, count: p.rating_count || 0 },
    reviews: (p.reviews || []).map(r => ({
      _id: r.id,
      name: r.name,
      email: r.email,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at
    })),
    featured: p.featured,
    metaTitle: p.meta_title,
    metaDescription: p.meta_description,
    createdAt: p.created_at,
    updatedAt: p.updated_at
  };
}

function normalizeOrder(o) {
  if (!o) return o;
  return {
    _id: o.id,
    id: o.id,
    fullName: o.full_name,
    mobile: o.mobile,
    city: o.city,
    address: o.address,
    items: o.items || [],
    subtotal: o.subtotal,
    shippingFee: o.shipping_fee,
    total: o.total,
    status: o.status,
    paymentMethod: o.payment_method,
    notes: o.notes,
    createdAt: o.created_at
  };
}

function toProductRow(data) {
  const row = {};
  if (data.name !== undefined) row.name = data.name;
  if (data.slug !== undefined) row.slug = data.slug;
  if (data.description !== undefined) row.description = data.description;
  if (data.price !== undefined) row.price = Number(data.price);
  if (data.originalPrice !== undefined) row.original_price = Number(data.originalPrice) || null;
  if (data.images !== undefined) row.images = data.images;
  if (data.category !== undefined) row.category_id = data.category || null;
  if (data.stock !== undefined) row.stock = Number(data.stock);
  if (data.inStock !== undefined) row.in_stock = data.inStock === 'true' || data.inStock === true;
  if (data.sku !== undefined) row.sku = data.sku || null;
  if (data.featured !== undefined) row.featured = data.featured === 'true' || data.featured === true;
  if (data.metaTitle !== undefined) row.meta_title = data.metaTitle;
  if (data.metaDescription !== undefined) row.meta_description = data.metaDescription;
  return row;
}
