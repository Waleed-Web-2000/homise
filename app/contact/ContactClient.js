'use client';
import { useState } from 'react';

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-green-800 font-bold text-lg mb-2">Message Sent!</h3>
              <p className="text-green-700 text-sm">Thank you for contacting us. We will get back to you within 24 hours.</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }} className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="03XXXXXXXXX" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors min-h-[48px]">
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-5">
            <div className="flex gap-4">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-semibold text-gray-800">Address</p>
                <p className="text-gray-600 text-sm mt-1">F46 1st floor hyderi gold mark mall<br />north nazimabad block h<br />Karachi 74700</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">📞</span>
              <div>
                <p className="font-semibold text-gray-800">Phone</p>
                <a href="tel:03218797321" className="text-red-600 hover:underline text-sm">03218797321</a>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <a href="mailto:support@homisepk.com" className="text-red-600 hover:underline text-sm">support@homisepk.com</a>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">🕐</span>
              <div>
                <p className="font-semibold text-gray-800">Working Hours</p>
                <p className="text-gray-600 text-sm mt-1">Monday – Saturday<br />11:00 AM – 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
