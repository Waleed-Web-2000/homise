export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '../../../../lib/auth';
import { getOrderById } from '../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const order = await getOrderById(params.id);
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }
}
