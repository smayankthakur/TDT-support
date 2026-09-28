import { NextResponse } from 'next/server';

// Placeholder: connect this to your newsletter / WhatsApp list provider.
export async function POST(req: Request) {
  try {
    const { email, phone, source } = await req.json();
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Please enter a valid email address' }, { status: 400 });
    }
    console.log('[subscribe]', { email, phone, source });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}
