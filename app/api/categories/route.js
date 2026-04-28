export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '../../../lib/auth';
import { getCategories, createCategory } from '../../../lib/db';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const name = formData.get('name');
    const slug = formData.get('slug');
    let image = '';

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
        image = publicUrl;
      }
    }

    const category = await createCategory({ name, slug, image });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
