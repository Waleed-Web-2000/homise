export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { signToken, isValidAdmin } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password required' }, { status: 400 });
    }
    if (!isValidAdmin(username, password)) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const token = await signToken({ username, role: 'admin' });
    return NextResponse.json({ token, username });
  } catch (err) {
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
