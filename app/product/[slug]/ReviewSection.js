'use client';
import { useState } from 'react';

export default function ReviewSection({ product }) {
  const [form, setForm] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState(product.reviews || []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.slug}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReviews(prev => [...prev, { ...form, createdAt: new Date().toISOString() }]);
      setSuccess(true);
      setForm({ name: '', email: '', rating: 5, comment: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>

      {reviews.length > 0 ? (
        <div className="space-y-4 mb-10">
          {reviews.map((r, i) => (
            <div key={r._id || i} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{r.name}</p>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className={`text-sm ${s <= r.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                </div>
                <time className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
              </div>
              <p className="text-gray-600 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-8">No reviews yet. Be the first to review this product!</p>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Write a Review</h3>
        {success ? (
          <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
            ✅ Thank you! Your review has been submitted.
            <button className="ml-3 text-green-600 underline" onClick={() => setSuccess(false)}>Write another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })} className={`text-2xl transition-colors ${s <= form.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 min-w-[44px] min-h-[44px]`}>★</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment <span className="text-red-500">*</span></label>
              <textarea required rows={4} value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} placeholder="Share your experience with this product..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors min-h-[48px]">
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
