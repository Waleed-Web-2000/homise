export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export async function POST(request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || file.size === 0) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(fileName, arrayBuffer, { contentType: file.type, upsert: false });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
