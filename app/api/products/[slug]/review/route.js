export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { addReview } from '../../../../../lib/db';

export async function POST(request, { params }) {
  try {
    const { name, email, rating, comment } = await request.json();
    if (!name || !email || !rating || !comment) {
      return NextResponse.json({ message: 'All fields required' }, { status: 400 });
    }
    const ratings = await addReview(params.slug, { name, email, rating, comment });
    return NextResponse.json({ message: 'Review added', ratings }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
