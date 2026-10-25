import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type ContactInput = { name?: unknown; email?: unknown; message?: unknown; company?: unknown };

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get('host')) return NextResponse.json({ message: 'This request is not allowed.' }, { status: 403 });
    } catch {
      return NextResponse.json({ message: 'This request is not allowed.' }, { status: 403 });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return NextResponse.json({ message: 'The contact form is temporarily unavailable.' }, { status: 503 });

  let input: ContactInput;
  try {
    const raw = await request.text();
    if (raw.length > 10000) return NextResponse.json({ message: 'Your message is too long.' }, { status: 413 });
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid message');
    input = parsed as ContactInput;
  } catch {
    return NextResponse.json({ message: 'Please check your details and try again.' }, { status: 400 });
  }

  if (input.company) return NextResponse.json({ message: 'Thanks. Your message has been sent.' });
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  if (name.length < 2 || name.length > 100 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || message.length > 4000) {
    return NextResponse.json({ message: 'Please enter a valid name, email, and message.' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'New BeastTouch contact message',
        text: `From: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return NextResponse.json({ message: 'Could not send your message. Please try again later.' }, { status: 502 });
    return NextResponse.json({ message: 'Thanks. Your message has been sent.' });
  } catch {
    return NextResponse.json({ message: 'Could not send your message. Please try again later.' }, { status: 502 });
  }
}
