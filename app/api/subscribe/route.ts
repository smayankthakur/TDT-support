import { NextResponse } from 'next/server';

// The same newsletter as the website footer: thedivinetarotonline.com/api/subscribe adds the email
// (and optional WhatsApp number) to the list and sends the welcome email. Nothing is stored or logged here.
const NEWSLETTER_API = 'https://thedivinetarotonline.com/api/subscribe';

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ message: 'Please enter a valid email address' }, { status: 400 });
  }
  const raw = typeof body.phone === 'string' ? body.phone : typeof body.whatsapp === 'string' ? body.whatsapp : '';
  const whatsapp = raw.replace(/[^\d+]/g, '').slice(0, 16);
  if (whatsapp && whatsapp.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ message: 'Please enter a valid WhatsApp number' }, { status: 400 });
  }
  try {
    const res = await fetch(NEWSLETTER_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, whatsapp: whatsapp || undefined }),
      signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) return NextResponse.json({ ok: true });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json({ message: data?.message || data?.error || 'Could not subscribe right now' }, { status: res.status === 400 ? 400 : 502 });
  } catch {
    return NextResponse.json({ message: 'Could not subscribe right now. Please try again.' }, { status: 502 });
  }
}
