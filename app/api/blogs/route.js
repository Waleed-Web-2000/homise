export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '../../../lib/auth';
import { getBlogs, createBlog } from '../../../lib/db';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export async function GET(request) {
  try {
    // Admin can see all (drafts too)
    const auth = await getAuthFromRequest(request).catch(() => null);
    const publishedOnly = !auth;
    const blogs = await getBlogs(publishedOnly);
    return NextResponse.json(blogs);
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

    const blog = await createBlog(data);
    return NextResponse.json(blog, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
