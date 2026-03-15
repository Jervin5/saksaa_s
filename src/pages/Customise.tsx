import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Upload, ShoppingCart, Check, X, Send } from 'lucide-react';
import { useCart } from '../CartContext';
import { apiService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

import customImg1 from '../images/Kundan_Bangels/Kundan_Bangels4.png';
import customImg2 from '../images/kundan_jhumkas/kundan_jhumkas3.png';
import customImg3 from '../images/kundan_modern_earings/kundan_modern_earings3.png';
import customImg4 from '../images/silk_thread_jhumkas/silk_thread_jhumkas3.jpeg';

const sizes = ['2.2', '2.4', '2.6', '2.8', '2.10', '2.12'];
const bangleTypes = [
  { id: 'normal',  name: 'Normal 10mm',  price: 100 },
  { id: 'broad',   name: 'Broad 20mm',   price: 200 },
  { id: 'hanging', name: 'Hanging 10mm', price: 150 },
];
const colorThemes = [
  { name: 'Gold',         color: '#D4AF37' },
  { name: 'Silver',       color: '#C0C0C0' },
  { name: 'Rose Gold',    color: '#E0BFB8' },
  { name: 'Antique Gold', color: '#B8860B' },
  { name: 'White Gold',   color: '#F5F5DC' },
  { name: 'Champagne',    color: '#F7E7CE' },
  { name: 'Copper',       color: '#B87333' },
  { name: 'Bronze',       color: '#CD7F32' },
  { name: 'Platinum',     color: '#E5E4E2' },
  { name: 'Black',        color: '#2C2C2C' },
  { name: 'Red',          color: '#DC143C' },
  { name: 'Blue',         color: '#4169E1' },
  { name: 'Green',        color: '#228B22' },
];
const occasions = ['Wedding', 'Festival', 'Casual', 'Party Wear', 'Gifting', 'Other'];
const budgetRanges = ['Under ₹500', '₹500 - ₹1,000', '₹1,000 - ₹2,000', '₹2,000 - ₹5,000', 'Over ₹5,000'];

export const Customise = () => {
  const { addToCart } = useCart();
  const navigate      = useNavigate();
  const [selectedSize,  setSelectedSize]  = useState(sizes[1]);
  const [hand,          setHand]          = useState<'One' | 'Both'>('Both');
  const [quantities,    setQuantities]    = useState<Record<string, number>>({ normal: 2, broad: 1, hanging: 1 });
  const [selectedColor, setSelectedColor] = useState(colorThemes[0]);
  const [outfitPhoto,   setOutfitPhoto]   = useState<File | null>(null);
  const [outfitPreview, setOutfitPreview] = useState<string | null>(null);
  const [comment,       setComment]       = useState('');
  const [occasion,      setOccasion]      = useState('');
  const [budget,        setBudget]        = useState('');

  // ── Submission state ──────────────────────────────────────────────────────
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [submitError, setSubmitError] = useState('');

  const basePrice = 1200;
  const totalPrice = useMemo(() => {
    const typesTotal = bangleTypes.reduce((sum, type) => sum + type.price * quantities[type.id], 0);
    return (basePrice + typesTotal) * (hand === 'Both' ? 2 : 1);
  }, [quantities, hand]);

  const handleQuantityChange = (id: string, delta: number) =>
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, prev[id] + delta) }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setOutfitPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setOutfitPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setOutfitPreview(null);
    }
  };

  const removePhoto = () => { setOutfitPhoto(null); setOutfitPreview(null); };

  /** Add to cart (local) — for immediate checkout without submitting a request */
  const handleAddToCart = () => {
    const customProduct = {
      id:          `custom-${Date.now()}`,
      name:        `Customised Bangle Set (${selectedSize}, ${hand} Hand, ${selectedColor.name})`,
      price:       totalPrice,
      category:    'Bangles' as const,
      image:       customImg1,
      images:      [customImg1],
      description: `Customised set with ${selectedColor.name} theme. Hand: ${hand}, Size: ${selectedSize}.`,
    };
    addToCart(customProduct, 1, selectedSize);
    navigate('/cart');
  };

  /** Submit custom request to backend */
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = apiService.getCurrentUser();
    if (!user) { navigate('/login'); return; }

    setSubmitting(true);
    setSubmitError('');
    try {
      const preferences = [
        `Size: ${selectedSize}`,
        `Hand: ${hand}`,
        `Color: ${selectedColor.name}`,
        ...bangleTypes.filter(t => quantities[t.id] > 0).map(t => `${t.name}: ${quantities[t.id]}`),
        comment ? `Notes: ${comment}` : '',
      ].filter(Boolean).join(' | ');

      await apiService.submitCustomRequest({
        occasion:     occasion || 'General',
        budgetRange:  budget || 'Not specified',
        preferences,
        outfitImage:  outfitPhoto,
      });
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-brand-bg-green min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-brand-light-green rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-brand-deep-green" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">Request Submitted!</h2>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Our artisans will review your customisation request and contact you within 24 hours to discuss the details.
          </p>
          <div className="space-y-3">
            <button onClick={() => navigate('/account')}
              className="w-full bg-stone-900 text-white py-3 rounded-full font-bold hover:bg-brand-deep-green transition-all">
              View My Requests
            </button>
            <button onClick={() => { setSubmitted(false); }}
              className="w-full border border-stone-200 text-stone-600 py-3 rounded-full font-medium hover:bg-stone-50 transition-colors">
              Submit Another Request
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg-green min-h-screen py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Customise Your Set</h1>
          <p className="text-stone-500 max-w-xl mx-auto">
            Design your dream bangle set — choose your style, size, and colour, then submit a request to our artisans.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* LEFT: Customisation Form */}
          <div className="lg:col-span-2 space-y-8">

            {/* Upload outfit photo */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <h2 className="text-2xl font-serif font-bold mb-6">Upload Your Outfit Photo</h2>
              {outfitPreview ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                  <img src={outfitPreview} alt="Outfit" className="w-full h-full object-cover" />
                  <button onClick={removePhoto}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition-colors">
                    <X size={16} className="text-red-500" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-brand-deep-green text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-bold">
                    <Check size={12} /> Photo uploaded
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-stone-200 rounded-2xl cursor-pointer hover:border-brand-deep-green hover:bg-brand-bg-green transition-all">
                  <Upload size={32} className="text-stone-300 mb-3" />
                  <p className="text-stone-500 font-medium">Click to upload your outfit photo</p>
                  <p className="text-stone-400 text-xs mt-1">JPEG, PNG, WEBP (max 5MB)</p>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              )}
            </div>

            {/* Bangle customisation */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <h2 className="text-2xl font-serif font-bold mb-6">Configure Your Set</h2>

              {/* Size */}
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase tracking-wider text-stone-700 mb-3">Bangle Size</label>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all ${
                        selectedSize === s
                          ? 'border-brand-deep-green bg-brand-deep-green text-white'
                          : 'border-stone-200 hover:border-brand-deep-green'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Hand */}
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase tracking-wider text-stone-700 mb-3">Number of Hands</label>
                <div className="flex gap-4">
                  {(['One', 'Both'] as const).map(h => (
                    <button key={h} onClick={() => setHand(h)}
                      className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${
                        hand === h
                          ? 'border-brand-deep-green bg-brand-light-green text-brand-deep-green'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}>{h} Hand</button>
                  ))}
                </div>
              </div>

              {/* Bangle types */}
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase tracking-wider text-stone-700 mb-3">Bangle Types & Quantity</label>
                <div className="space-y-4">
                  {bangleTypes.map(type => (
                    <div key={type.id} className="flex items-center justify-between p-4 bg-brand-bg-green rounded-xl">
                      <div>
                        <p className="font-bold text-stone-800">{type.name}</p>
                        <p className="text-sm text-stone-500">₹{type.price} per bangle</p>
                      </div>
                      <div className="flex items-center border border-stone-200 rounded-full p-1 bg-white">
                        <button onClick={() => handleQuantityChange(type.id, -1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100">-</button>
                        <span className="w-8 text-center font-bold text-sm">{quantities[type.id]}</span>
                        <button onClick={() => handleQuantityChange(type.id, 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colour */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-stone-700 mb-3">
                  Colour Theme — <span className="text-brand-deep-green">{selectedColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {colorThemes.map(theme => (
                    <button key={theme.name} onClick={() => setSelectedColor(theme)} title={theme.name}
                      className={`w-8 h-8 rounded-full border-4 transition-all ${
                        selectedColor.name === theme.name ? 'border-brand-deep-green scale-110' : 'border-white shadow-sm hover:scale-105'
                      }`}
                      style={{ backgroundColor: theme.color }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Request details (occasion, budget, notes) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <h2 className="text-2xl font-serif font-bold mb-6">Request Details</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-stone-700 mb-3">Occasion</label>
                  <div className="flex flex-wrap gap-3">
                    {occasions.map(occ => (
                      <button key={occ} onClick={() => setOccasion(occ)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                          occasion === occ
                            ? 'bg-brand-deep-green text-white border-brand-deep-green'
                            : 'border-stone-200 text-stone-600 hover:border-brand-deep-green'
                        }`}>{occ}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-stone-700 mb-3">Budget Range</label>
                  <div className="flex flex-wrap gap-3">
                    {budgetRanges.map(b => (
                      <button key={b} onClick={() => setBudget(b)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                          budget === b
                            ? 'bg-brand-deep-green text-white border-brand-deep-green'
                            : 'border-stone-200 text-stone-600 hover:border-brand-deep-green'
                        }`}>{b}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-stone-700 mb-2">Additional Notes</label>
                  <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)}
                    placeholder="Any specific design preferences, colours, or requirements?"
                    className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20 resize-none" />
                </div>
              </div>
            </div>

            {/* Inspiration images */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <h2 className="text-2xl font-serif font-bold mb-6">Inspiration Designs</h2>
              <div className="grid grid-cols-4 gap-4">
                {[customImg1, customImg2, customImg3, customImg4].map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden">
                    <img src={img} alt={`Design ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Sticky summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
              <h2 className="text-2xl font-serif font-bold mb-6">Your Custom Set</h2>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Size</span><span className="font-bold text-stone-800">{selectedSize}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Hands</span><span className="font-bold text-stone-800">{hand}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Colour</span>
                  <span className="font-bold text-stone-800 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full inline-block border border-stone-200" style={{ backgroundColor: selectedColor.color }} />
                    {selectedColor.name}
                  </span>
                </div>
                {bangleTypes.filter(t => quantities[t.id] > 0).map(t => (
                  <div key={t.id} className="flex justify-between text-stone-600">
                    <span>{t.name}</span>
                    <span className="font-bold text-stone-800">×{quantities[t.id]} = ₹{(t.price * quantities[t.id]).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-stone-100 pt-3 flex justify-between text-xl font-bold">
                  <span>Total Est.</span>
                  <span className="text-brand-deep-green">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {submitError && (
                <p className="text-red-500 text-xs mb-4 bg-red-50 p-3 rounded-xl">{submitError}</p>
              )}

              {/* Submit to backend */}
              <button onClick={handleSubmitRequest} disabled={submitting}
                className="w-full bg-brand-deep-green text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg mb-4 disabled:opacity-50">
                <Send size={18} />
                {submitting ? 'Submitting...' : 'Submit Request to Artisan'}
              </button>

              {/* Add to cart directly */}
              <button onClick={handleAddToCart}
                className="w-full border-2 border-stone-900 text-stone-900 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-stone-900 hover:text-white transition-all">
                <ShoppingCart size={18} />
                Add to Cart & Buy Now
              </button>

              <p className="text-xs text-stone-400 text-center mt-4 leading-relaxed">
                Submitting a request is free. Our team will contact you within 24 hours to confirm the design and price.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};