export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '../../../../lib/auth';
import { getBlogBySlug, updateBlog, deleteBlog } from '../../../../lib/db';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function GET(request, { params }) {
  try {
    const blog = await getBlogBySlug(params.slug);
    return NextResponse.json(blog);
  } catch {
    return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const fileName = `blog-${Date.now()}.${imageFile.name.split('.').pop()}`;
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

    const blog = await updateBlog(params.slug, data);
    return NextResponse.json(blog);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    await deleteBlog(params.slug);
    return NextResponse.json({ message: 'Blog deleted' });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
