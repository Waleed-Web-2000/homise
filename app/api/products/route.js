export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '../../../lib/auth';
import { getProducts, createProduct } from '../../../lib/db';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      featured: searchParams.get('featured'),
      inStock: searchParams.get('inStock'),
      categorySlug: searchParams.get('category')
    };
    const products = await getProducts(params);
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    // Handle image uploads to Supabase Storage
    const imageFiles = formData.getAll('images');
    const imageUrls = [];
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
        const { data: uploadData, error } = await supabaseAdmin.storage
          .from('product-images')
          .upload(fileName, arrayBuffer, { contentType: file.type, upsert: false });
        if (!error && uploadData) {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('product-images')
            .getPublicUrl(uploadData.path);
          imageUrls.push(publicUrl);
        }
      }
    }
    data.images = imageUrls;

    const product = await createProduct(data);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
