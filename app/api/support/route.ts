import { NextResponse } from 'next/server';

const SCRIPT_URL =
  process.env.SUPPORT_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbxTORdBwBPxISkYarVlJiSVzMF-ZOFwWhLyZ50k82O1jGWhFjdRiVll5dHP9bhTfo_7vA/exec';

const ISSUES = ['login_after_sub', 'billing', 'technical', 'other'];
const MAX_IMAGE_CHARS = 3_500_000; // ~2.5 MB file after base64

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: 'error', message: 'Invalid request' }, { status: 400 });
  }

  const { name, email, issue, description, paymentScreenshot, errorScreenshot } = body as Record<string, any>;

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof description !== 'string' || !description.trim() ||
    !ISSUES.includes(issue)
  ) {
    return NextResponse.json({ status: 'error', message: 'Please check the form fields' }, { status: 400 });
  }
  for (const img of [paymentScreenshot, errorScreenshot]) {
    if (img && (typeof img !== 'string' || img.length > MAX_IMAGE_CHARS)) {
      return NextResponse.json({ status: 'error', message: 'Screenshot is too large' }, { status: 413 });
    }
  }

  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: '',
        issue,
        description: description.trim(),
        paymentScreenshot: paymentScreenshot || null,
        errorScreenshot: errorScreenshot || null,
      }),
      redirect: 'follow',
    });
    const result = await res.json();
    if (result.status === 'success') return NextResponse.json({ status: 'success' });
    return NextResponse.json({ status: 'error', message: result.message || 'Submission failed' }, { status: 502 });
  } catch (err) {
    console.error('[support] upstream failure', err);
    return NextResponse.json({ status: 'error', message: 'Could not reach support desk' }, { status: 502 });
  }
}
