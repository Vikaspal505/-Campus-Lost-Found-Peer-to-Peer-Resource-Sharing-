'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ITEM_CATEGORIES } from '@/types';
import { mockStore } from '@/lib/mockStore';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ReportFound() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');

  const commonLocations = [
    'Main Gate Security Desk',
    'Library Reading Hall',
    'CS Block Corridor Bench',
    'Mechanical Workshop Counter',
    'Canteen Billing Desk',
    'Sports Complex Desk',
  ];

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const finalImage = imagePreview || customImageUrl || '';

      mockStore.addItem({
        type: 'found',
        category: formData.category,
        description: formData.description,
        location: formData.location,
        imageUrl: finalImage,
        status: 'open',
        userId: user.uid,
        userName: user.name,
        userEmail: user.email,
      });

      alert('🎉 Found item reported successfully! We are checking for matching lost reports.');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error reporting item:', error);
      alert('Failed to report item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Found Item Report
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Report a Found Item</h2>
            <p className="text-xs text-slate-500 mt-1">
              Help reunite an item with its owner. You can also hand it to campus security or keep it safe while coordinating.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Item Category <span className="text-emerald-600">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
                <option value="">Select Category</option>
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Found Item Description <span className="text-emerald-600">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what you found (color, type, brand). Avoid mentioning secret passcodes or internal contents so the owner can prove ownership..."
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Where Was It Found? <span className="text-emerald-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Workshop Area Corridor Bench or Library Desk #22"
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all mb-2"
              />
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-slate-400 font-medium">Common safe points:</span>
                {commonLocations.slice(0, 4).map((loc) => (
                  <button
                    type="button"
                    key={loc}
                    onClick={() => setFormData({ ...formData, location: loc })}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload or URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Item Photo (Optional)
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-4 cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 transition-all text-center">
                    <svg className="w-6 h-6 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-semibold text-emerald-600">Choose File</span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, WEBP</span>
                    <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                  </label>
                </div>

                <div>
                  <input
                    type="url"
                    placeholder="Or paste an image URL..."
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {(imagePreview || customImageUrl) && (
                    <div className="mt-2 relative h-20 w-24 rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={imagePreview || customImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setCustomImageUrl('');
                        }}
                        className="absolute top-1 right-1 w-4 h-4 bg-slate-900/80 text-white rounded-full text-[10px] flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reporter Info */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Found by:</span>
                <span>{user.name} ({user.email})</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">Campus Good Samaritan</span>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Publishing Report...' : 'Publish Found Item Report'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
