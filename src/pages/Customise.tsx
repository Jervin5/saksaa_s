import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Upload, ShoppingCart, Check, X } from 'lucide-react';
import { useCart } from '../CartContext';

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
  { name: 'Gold',        color: '#D4AF37' },
  { name: 'Silver',      color: '#C0C0C0' },
  { name: 'Rose Gold',   color: '#E0BFB8' },
  { name: 'Antique Gold',color: '#B8860B' },
  { name: 'White Gold',  color: '#F5F5DC' },
  { name: 'Champagne',   color: '#F7E7CE' },
  { name: 'Copper',      color: '#B87333' },
  { name: 'Bronze',      color: '#CD7F32' },
  { name: 'Platinum',    color: '#E5E4E2' },
  { name: 'Black',       color: '#2C2C2C' },
  { name: 'Red',         color: '#DC143C' },
  { name: 'Blue',        color: '#4169E1' },
  { name: 'Green',       color: '#228B22' },
];

export const Customise = () => {
  const { addToCart } = useCart();
  const [selectedSize,  setSelectedSize]  = useState(sizes[1]);
  const [hand,          setHand]          = useState<'One' | 'Both'>('Both');
  const [quantities,    setQuantities]    = useState<Record<string, number>>({ normal: 2, broad: 1, hanging: 1 });
  const [selectedColor, setSelectedColor] = useState(colorThemes[0]);
  const [outfitPhoto,   setOutfitPhoto]   = useState<File | null>(null);
  const [outfitPreview, setOutfitPreview] = useState<string | null>(null);
  const [comment,       setComment]       = useState('');

  const basePrice = 1200;
  const totalPrice = useMemo(() => {
    const typesTotal = bangleTypes.reduce((sum, type) => sum + type.price * quantities[type.id], 0);
    return (basePrice + typesTotal) * (hand === 'Both' ? 2 : 1);
  }, [quantities, hand]);

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, prev[id] + delta) }));
  };

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

  const handleAddToCart = () => {
    const customProduct = {
      id: `custom-${Date.now()}`,
      name: `Customised Bangle Set (${selectedSize}, ${hand} Hand)`,
      price: totalPrice,
      category: 'Bangles' as const,
      image: 'https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=800'],
      description: `Customised set with ${selectedColor.name} theme. Hand: ${hand}, Size: ${selectedSize}.`,
    };
    addToCart(customProduct, 1, selectedSize);
    alert('Customised set added to cart!');
  };

  return (
    <div className="bg-brand-bg-green min-h-screen py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Customise Your Set</h1>
          <p className="text-stone-500 max-w-xl mx-auto">
            Design your dream bangle set — choose your style, size, and colour.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── LEFT: Preview ─────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Main preview box */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-stone-100 max-w-md mx-auto relative">
              {outfitPreview ? (
                /* Show uploaded outfit photo as the preview background */
                <>
                  <img src={outfitPreview} alt="Your outfit" className="w-full h-full object-cover" />
                  {/* Overlay with design summary */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs opacity-80 mb-0.5">Your Custom Design</p>
                        <p className="font-serif font-bold">{selectedColor.name} · Size {selectedSize} · {hand} Hand</p>
                      </div>
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex-shrink-0"
                        style={{ backgroundColor: selectedColor.color }}
                      />
                    </div>
                    <p className="text-lg font-bold mt-2">₹{totalPrice.toLocaleString()}</p>
                  </div>
                </>
              ) : (
                /* Default design preview when no photo uploaded */
                <div className="w-full h-full bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-8">
                  <div className="text-center space-y-5">
                    {/* Bangle visual */}
                    <div className="relative flex justify-center items-center">
                      <div
                        className="w-24 h-24 rounded-full border-4 shadow-lg flex items-center justify-center"
                        style={{ borderColor: selectedColor.color, backgroundColor: `${selectedColor.color}20` }}
                      >
                        <div className="w-14 h-14 rounded-full border-2" style={{ borderColor: selectedColor.color }} />
                        <div className="absolute -top-2 -right-2 bg-brand-deep-green text-white text-xs px-2 py-1 rounded-full font-bold">
                          {selectedSize}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-stone-800">Your Custom Design</h3>
                      <p className="text-xs text-stone-500">{selectedColor.name} · {hand} Hand</p>
                      <div className="flex flex-wrap justify-center gap-1 mt-1">
                        {Object.entries(quantities).filter(([, qty]) => qty > 0).map(([type, qty]) => (
                          <span key={type} className="bg-stone-200 px-2 py-0.5 rounded text-xs capitalize">
                            {type} ×{qty}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-2 bg-brand-light-green rounded-lg">
                      <p className="text-sm font-bold text-brand-deep-green">₹{totalPrice.toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-stone-400 italic">Upload your outfit photo to see how it looks ↑</p>
                  </div>
                </div>
              )}
            </div>

            {/* Inspiration gallery */}
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
              {[
                { img: customImg1, name: 'Kundan Bangles' },
                { img: customImg2, name: 'Kundan Jhumkas' },
                { img: customImg3, name: 'Modern Earrings' },
                { img: customImg4, name: 'Silk Thread' },
              ].map((item, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-stone-200 cursor-pointer hover:border-brand-deep-green transition-colors relative group">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs font-bold text-center px-2">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* How it works — simplified */}
            <div className="bg-white rounded-2xl p-5 border border-stone-100 max-w-md mx-auto">
              <h4 className="font-serif font-bold text-sm mb-3 text-stone-800">How It Works</h4>
              <div className="space-y-2 text-xs text-stone-600">
                <p>📸 <span className="font-medium">Upload your outfit</span> — we'll match your jewellery to your look.</p>
                <p>🎨 <span className="font-medium">Choose size, type & colour</span> — handcrafted by our artisans.</p>
                <p>🚚 <span className="font-medium">Delivered in 7–10 days</span> — quality checked before shipping.</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Customisation Form ──────────────────────────────────── */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-stone-100 space-y-9">

            {/* STEP 1 — Upload outfit photo (moved to top) */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-700 mb-4">
                1. Upload Outfit Photo
                <span className="ml-2 text-xs font-normal text-stone-400 normal-case tracking-normal">(optional)</span>
              </h3>

              {outfitPreview ? (
                /* Show thumbnail with remove button */
                <div className="relative w-full h-32 rounded-2xl overflow-hidden border-2 border-brand-deep-green">
                  <img src={outfitPreview} alt="Outfit preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={removePhoto}
                      className="bg-white text-stone-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <X size={12} /> Remove photo
                    </button>
                  </div>
                  <div className="absolute top-2 right-2 bg-brand-deep-green text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Check size={10} /> Uploaded
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-200 rounded-2xl cursor-pointer hover:bg-stone-50 hover:border-brand-deep-green/40 transition-colors">
                  <Upload className="w-7 h-7 mb-2 text-stone-400" />
                  <p className="text-sm text-stone-500 font-medium">Click to upload outfit photo</p>
                  <p className="text-xs text-stone-400 mt-1">PNG, JPG or JPEG · Max 5MB</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              )}
            </section>

            {/* STEP 2 — Size */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-700 mb-4">2. Select Bangle Size</h3>
              <div className="flex flex-wrap gap-3">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all ${selectedSize === size ? 'border-brand-deep-green bg-brand-deep-green text-white' : 'border-stone-200 hover:border-brand-gold'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </section>

            {/* STEP 3 — Hand */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-700 mb-4">3. Hand Preference</h3>
              <div className="flex gap-4">
                {(['One', 'Both'] as const).map(option => (
                  <button
                    key={option}
                    onClick={() => setHand(option)}
                    className={`flex-grow py-3 rounded-full border-2 font-bold transition-all ${hand === option ? 'border-brand-deep-green bg-brand-deep-green text-white' : 'border-stone-200 hover:border-brand-gold'}`}
                  >
                    {option} Hand
                  </button>
                ))}
              </div>
            </section>

            {/* STEP 4 — Bangle types */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-700 mb-4">4. Bangle Types & Quantities</h3>
              <div className="space-y-3">
                {bangleTypes.map(type => (
                  <div key={type.id} className="flex items-center justify-between p-4 bg-brand-bg-green rounded-xl">
                    <div>
                      <p className="font-bold text-stone-800 text-sm">{type.name}</p>
                      <p className="text-xs text-stone-500">+₹{type.price} per piece</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleQuantityChange(type.id, -1)} className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50 text-lg font-bold">−</button>
                      <span className="w-4 text-center font-bold text-sm">{quantities[type.id]}</span>
                      <button onClick={() => handleQuantityChange(type.id, 1)}  className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50 text-lg font-bold">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* STEP 5 — Color */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-700 mb-4">
                5. Choose Colour
                <span className="ml-2 text-xs font-normal text-stone-400 normal-case tracking-normal">— {selectedColor.name}</span>
              </h3>
              <div className="grid grid-cols-7 gap-3">
                {colorThemes.map((theme, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(theme)}
                    title={theme.name}
                    className={`aspect-square rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor.name === theme.name
                        ? 'border-brand-deep-green scale-110 shadow-lg'
                        : 'border-stone-300 hover:border-brand-gold hover:scale-105'
                    }`}
                    style={{ backgroundColor: theme.color }}
                  >
                    {selectedColor.name === theme.name && (
                      <Check size={14} className="text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* STEP 6 — Special requests */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-700 mb-4">6. Special Requests</h3>
              <textarea
                rows={3}
                placeholder="E.g. I want more pearls on the broad bangles..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20 resize-none text-sm"
              />
            </section>

            {/* Price & CTA */}
            <div className="pt-6 border-t border-stone-100 flex items-center justify-between gap-6">
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Estimated Total</p>
                <p className="text-3xl font-bold text-brand-deep-green">₹{totalPrice.toLocaleString()}</p>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-grow bg-stone-900 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-deep-green transition-all shadow-lg"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};