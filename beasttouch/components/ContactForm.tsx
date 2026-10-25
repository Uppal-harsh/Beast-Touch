'use client';

import { useState, type FormEvent } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setStatus('sending');
    setMessage('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.get('name'),
          email: fields.get('email'),
          message: fields.get('message'),
          company: fields.get('company'),
        }),
      });
      const result: { message?: string } = await response.json();
      if (!response.ok) throw new Error(result.message || 'Could not send your message. Please try again.');
      form.reset();
      setStatus('sent');
      setMessage('Thanks. Your message has been sent.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Could not send your message. Please try again.');
    }
  }

  return <form className="contact-form" onSubmit={submit}>
    <label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" minLength={2} maxLength={100} required autoComplete="name" />
    <label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" maxLength={254} required autoComplete="email" />
    <label htmlFor="contact-message">Your message</label><textarea id="contact-message" name="message" minLength={10} maxLength={4000} rows={7} required />
    <div className="contact-honeypot" aria-hidden="true"><label htmlFor="contact-company">Company website</label><input id="contact-company" name="company" tabIndex={-1} autoComplete="off" /></div>
    <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
    <p role="status" aria-live="polite" className={status === 'error' ? 'form-error' : ''}>{message}</p>
  </form>;
}
