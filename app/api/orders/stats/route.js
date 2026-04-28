export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '../../../../lib/auth';
import { getOrderStats } from '../../../../lib/db';

export async function GET(request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const stats = await getOrderStats();
    return NextResponse.json(stats);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
