export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '../../../../lib/auth';
import { getCategoryBySlug, updateCategory, deleteCategory } from '../../../../lib/db';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

// GET /api/categories/[slug] — public, returns category + its products
export async function GET(request, { params }) {
  try {
    const data = await getCategoryBySlug(params.id);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Category not found' }, { status: 404 });
  }
}

// PUT /api/categories/[id] — admin only
export async function PUT(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const data = { name: formData.get('name'), slug: formData.get('slug') };

    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const fileName = `cat-${Date.now()}.${imageFile.name.split('.').pop()}`;
      const { data: uploadData } = await supabaseAdmin.storage
        .from('product-images')
        .upload(fileName, arrayBuffer, { contentType: imageFile.type });
      if (uploadData) {
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(uploadData.path);
        data.image = publicUrl;
      }
    }

    const category = await updateCategory(params.id, data);
    return NextResponse.json(category);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// DELETE /api/categories/[id] — admin only
export async function DELETE(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    await deleteCategory(params.id);
    return NextResponse.json({ message: 'Category deleted' });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
