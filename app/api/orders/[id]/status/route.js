export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '../../../../../lib/auth';
import { updateOrderStatus } from '../../../../../lib/db';

const VALID_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export async function PUT(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { status } = await request.json();
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }
    const order = await updateOrderStatus(params.id, status);
    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
