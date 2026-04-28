export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '../../../lib/auth';
import { createOrder, getOrders } from '../../../lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    const { fullName, mobile, city, address, items } = data;
    if (!fullName || !mobile || !city || !address || !items?.length) {
      return NextResponse.json({ message: 'Required fields missing' }, { status: 400 });
    }
    const order = await createOrder(data);
    return NextResponse.json({ message: 'Order placed successfully', orderId: order.id, order }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
