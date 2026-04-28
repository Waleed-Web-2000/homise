export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '../../../../lib/auth';
import { getProductBySlug, updateProduct, deleteProduct } from '../../../../lib/db';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function GET(request, { params }) {
  try {
    const product = await getProductBySlug(params.slug);
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    // Handle image uploads
    const imageFiles = formData.getAll('images');
    const imageUrls = [];
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
        const { data: uploadData, error } = await supabaseAdmin.storage
          .from('product-images')
          .upload(fileName, arrayBuffer, { contentType: file.type });
        if (!error && uploadData) {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('product-images')
            .getPublicUrl(uploadData.path);
          imageUrls.push(publicUrl);
        }
      }
    }
    if (imageUrls.length > 0) data.images = imageUrls;

    // params.slug is actually the ID for PUT/DELETE from admin
    const product = await updateProduct(params.slug, data);
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    await deleteProduct(params.slug);
    return NextResponse.json({ message: 'Product deleted' });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
