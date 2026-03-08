import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Package, Image as ImageIcon, Edit3, Check, X,
  Upload, TrendingUp, Star, Sparkles, ChevronDown, Search,
} from 'lucide-react';
import { Product } from '../types';
import {
  getLocalProducts,
  saveLocalProduct,
  updateLocalProduct,
  compressImage,
} from '../pages/Localproductsstore';

const ALL_CATEGORIES = ['Bangles', 'Earrings'];

const SUB_CATEGORIES: Record<string, string[]> = {
  Earrings: ['Studs', 'Jhumkas', 'Modern Jhumkas', 'Silk Thread Jhumkas', 'Traditional Jhumkas'],
  Bangles:  ['Traditional', 'Modern', 'Bridal'],
};

const FLAGS = [
  { key: 'trending'   as const, label: 'Trending',    icon: TrendingUp },
  { key: 'topSelling' as const, label: 'Top Selling', icon: Star       },
  { key: 'newArrival' as const, label: 'New Arrival', icon: Sparkles   },
];

const EMPTY: Partial<Product> = {
  name: '', price: 0, category: 'Earrings', subCategory: '',
  description: '', image: '', images: [],
  trending: false, topSelling: false, newArrival: true, under500: false, sizes: [],
};

export const AdminDashboard = () => {
  const [activeTab, setActiveTab]   = useState<'add' | 'inventory'>('add');
  const [newProduct, setNewProduct] = useState<Partial<Product>>(EMPTY);
  const [success, setSuccess]       = useState(false);
  const [saveError, setSaveError]   = useState('');
  const [uploading, setUploading]   = useState(false);

  // Inventory state — load straight from localStorage
  const [products, setProducts]       = useState<Product[]>([]);
  const [loading, setLoading]         = useState(false);
  const [filterCat, setFilterCat]     = useState('All');
  const [searchQ, setSearchQ]         = useState('');
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editData, setEditData]       = useState<Partial<Product>>({});
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  // Load products from localStorage when inventory tab opens
  useEffect(() => {
    if (activeTab === 'inventory') {
      setLoading(true);
      const local = getLocalProducts();
      setProducts(local);
      setLoading(false);
    }
  }, [activeTab]);

  // ── IMAGE UPLOAD ──────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) { console.log('❌ No file selected'); return; }
    console.log('📁 File selected:', file.name, Math.round(file.size/1024), 'KB');
    setUploading(true);
    try {
      const base64 = await compressImage(file);
      console.log('✅ Compressed base64 length:', base64.length, 'chars');
      setNewProduct(p => ({ ...p, image: base64, images: [base64] }));
    } catch (err) {
      console.error('❌ Compression failed:', err);
      setSaveError('Image compression failed. Try a smaller image or paste a URL.');
    } finally {
      setUploading(false);
    }
  };

  // ── PUBLISH PRODUCT ──────────────────────────────
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    console.log('🚀 Publish clicked. newProduct:', newProduct);

    if (!newProduct.image) {
      console.log('❌ No image set');
      setSaveError('Please upload an image or paste an image URL.');
      return;
    }

    const product: Product = {
      ...(newProduct as Product),
      id:      `local_${Date.now()}`,
      inStock: true,
      under500: (newProduct.price ?? 0) < 500,
      images:  [newProduct.image!],
    };
    console.log('💾 Saving product:', product.name, '| image starts with:', product.image?.substring(0, 30));

    const saved = saveLocalProduct(product);
    console.log('💾 Save result:', saved);
    console.log('📦 localStorage now:', localStorage.getItem('saksaas_admin_products')?.substring(0, 100));

    if (saved) {
      setSuccess(true);
      setNewProduct(EMPTY);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setSaveError('Failed to save — localStorage may be full. Try using an image URL instead of uploading.');
    }
  };

  // ── EDIT ─────────────────────────────────────────
  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditData({
      name:       product.name,
      price:      product.price,
      trending:   product.trending,
      topSelling: product.topSelling,
      newArrival: product.newArrival,
      inStock:    product.inStock !== false,
    });
  };

  const saveEdit = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...editData } : p));
    updateLocalProduct(id, editData);
    setEditingId(null);
    setEditData({});
  };

  // ── STOCK TOGGLE ─────────────────────────────────
  const toggleStock = (product: Product) => {
    const newStock = product.inStock === false ? true : false;
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: newStock } : p));
    updateLocalProduct(product.id, { inStock: newStock });
  };

  // ── GROUP BY CATEGORY ─────────────────────────────
  const grouped = ALL_CATEGORIES.reduce<Record<string, Product[]>>((acc, cat) => {
    const filtered = products.filter(p => {
      const matchCat = filterCat === 'All' || p.category === filterCat;
      const matchG   = p.category === cat;
      const matchQ   = !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase());
      return matchCat && matchG && matchQ;
    });
    if (filtered.length > 0) acc[cat] = filtered;
    return acc;
  }, {});

  const totalOutStock = products.filter(p => p.inStock === false).length;

  return (
    <div className="bg-brand-bg-green min-h-screen">

      {/* Top bar */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-deep-green rounded-lg flex items-center justify-center">
                <Package size={16} className="text-white" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg leading-none">SAKSAAS Admin</h1>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">Dashboard</p>
              </div>
            </div>
            <div className="flex bg-stone-100 p-1 rounded-xl">
              {(['add', 'inventory'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all
                    ${activeTab === tab ? 'bg-white text-brand-deep-green shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>
                  {tab === 'add' ? '+ Add Product' : 'Inventory'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-10">
        <AnimatePresence mode="wait">

          {/* ════ ADD PRODUCT ════ */}
          {activeTab === 'add' && (
            <motion.div key="add"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="font-serif font-bold text-xl mb-2">Overview</h2>
                {[
                  { label: 'Total Added',  value: getLocalProducts().length,  icon: Package,    color: 'bg-brand-light-green text-brand-deep-green' },
                  { label: 'Out of Stock', value: totalOutStock,               icon: X,          color: 'bg-red-50 text-red-500'                     },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 border border-stone-100 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
                    </div>
                  </div>
                ))}
                <div className="bg-stone-900 rounded-2xl p-5 text-white">
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Products are saved in browser storage and appear instantly on the Shop page. Use image URLs for best performance.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
                <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-light-green rounded-xl flex items-center justify-center">
                    <Plus size={18} className="text-brand-deep-green" />
                  </div>
                  Add New Product
                </h2>

                <form onSubmit={handleAddProduct} className="space-y-5">

                  {/* Name + Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Product Name</label>
                      <input type="text" required value={newProduct.name}
                        onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20"
                        placeholder="e.g. Royal Kundan Jhumkas" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Price (₹)</label>
                      <input type="number" required min={1} value={newProduct.price || ''}
                        onChange={e => setNewProduct(p => ({ ...p, price: Number(e.target.value) }))}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20"
                        placeholder="0" />
                    </div>
                  </div>

                  {/* Category + SubCategory */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Category</label>
                      <select value={newProduct.category}
                        onChange={e => setNewProduct(p => ({ ...p, category: e.target.value as any, subCategory: '' }))}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20">
                        {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Sub-Category</label>
                      <select value={newProduct.subCategory}
                        onChange={e => setNewProduct(p => ({ ...p, subCategory: e.target.value }))}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20">
                        <option value="">Select type...</option>
                        {newProduct.category && SUB_CATEGORIES[newProduct.category]?.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Description</label>
                    <textarea value={newProduct.description}
                      onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                      rows={2} placeholder="Short product description..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20 resize-none" />
                  </div>

                  {/* Image */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                      Product Image
                    </label>
                    <div className="flex gap-3 items-start">
                      {/* Upload button */}
                      <label className={`flex-1 flex items-center justify-center h-12 bg-stone-50 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                        ${uploading ? 'border-brand-gold opacity-60' : 'border-stone-200 hover:border-brand-deep-green'}`}>
                        <Upload size={16} className="text-stone-400 mr-2" />
                        <span className="text-xs text-stone-500 font-medium">
                          {uploading ? 'Compressing...' : 'Upload image'}
                        </span>
                        <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
                      </label>
                      {/* URL input */}
                      <input type="text" value={newProduct.image?.startsWith('data:') ? '' : (newProduct.image || '')}
                        onChange={e => setNewProduct(p => ({ ...p, image: e.target.value, images: [e.target.value] }))}
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20"
                        placeholder="Or paste image URL..." />
                      {/* Preview */}
                      <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0 flex items-center justify-center">
                        {newProduct.image
                          ? <img src={newProduct.image} className="w-full h-full object-cover" alt="preview" />
                          : <ImageIcon size={18} className="text-stone-300" />
                        }
                      </div>
                    </div>
                    {newProduct.image?.startsWith('data:') && (
                      <p className="text-[10px] text-emerald-600 font-medium">✓ Image uploaded and compressed successfully</p>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Product Tags</label>
                    <div className="flex flex-wrap gap-3">
                      {FLAGS.map(({ key, label, icon: Icon }) => {
                        const active = !!newProduct[key];
                        return (
                          <button key={key} type="button"
                            onClick={() => setNewProduct(p => ({ ...p, [key]: !p[key] }))}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all
                              ${active
                                ? 'bg-brand-deep-green text-white border-brand-deep-green'
                                : 'bg-white text-stone-500 border-stone-200 hover:border-brand-deep-green hover:text-brand-deep-green'}`}>
                            <Icon size={13} />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Error */}
                  {saveError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100">
                      ⚠ {saveError}
                    </div>
                  )}

                  <button type="submit" disabled={uploading}
                    className="w-full bg-brand-deep-green text-white font-bold py-4 rounded-xl hover:bg-stone-900 transition-all text-sm tracking-wide disabled:opacity-50">
                    Publish Product
                  </button>

                  <AnimatePresence>
                    {success && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center text-sm font-bold border border-emerald-100">
                        ✓ Product saved! Go to Shop page to see it.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>
          )}

          {/* ════ INVENTORY ════ */}
          {activeTab === 'inventory' && (
            <motion.div key="inventory"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="space-y-6">

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="font-serif font-bold text-2xl">Inventory</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-grow sm:w-56">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input type="text" placeholder="Search products..." value={searchQ}
                      onChange={e => setSearchQ(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" />
                  </div>
                  <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                    className="bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20">
                    <option value="All">All Categories</option>
                    {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="bg-white rounded-2xl p-20 text-center text-stone-400 text-sm">Loading...</div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center text-stone-400 text-sm">
                  No products added yet. Use the <strong>Add Product</strong> tab to add your first product.
                </div>
              ) : Object.keys(grouped).length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center text-stone-400 text-sm">No products match your filter.</div>
              ) : (
                Object.entries(grouped).map(([cat, catProducts]) => (
                  <div key={cat} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">

                    <button onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-light-green rounded-lg flex items-center justify-center">
                          <Package size={15} className="text-brand-deep-green" />
                        </div>
                        <span className="font-serif font-bold text-lg">{cat}</span>
                        <span className="bg-stone-100 text-stone-500 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {catProducts.length}
                        </span>
                        {catProducts.filter(p => p.inStock === false).length > 0 && (
                          <span className="bg-red-50 text-red-500 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {catProducts.filter(p => p.inStock === false).length} out of stock
                          </span>
                        )}
                      </div>
                      <ChevronDown size={18} className={`text-stone-400 transition-transform ${expandedCat === cat ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {(expandedCat === cat || (expandedCat === null && cat === Object.keys(grouped)[0])) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                          className="overflow-hidden">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-stone-50 border-t border-stone-100">
                                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">Product</th>
                                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400 hidden sm:table-cell">Sub-Category</th>
                                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">Tags</th>
                                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">Stock</th>
                                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Price</th>
                                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                              {catProducts.map(product => {
                                const isInStock = product.inStock !== false;
                                return (
                                  <tr key={product.id} className="hover:bg-stone-50/60 transition-colors">

                                    {/* Product */}
                                    <td className="px-6 py-3">
                                      <div className="flex items-center gap-3">
                                        <img src={product.image} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" alt={product.name} />
                                        {editingId === product.id ? (
                                          <input type="text" value={editData.name ?? product.name}
                                            onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                                            className="border border-stone-200 rounded-lg px-2 py-1 text-sm w-40 focus:outline-none" />
                                        ) : (
                                          <span className="font-semibold text-stone-800 text-sm">{product.name}</span>
                                        )}
                                      </div>
                                    </td>

                                    {/* Sub-category */}
                                    <td className="px-6 py-3 hidden sm:table-cell">
                                      <span className="text-xs text-stone-400">{product.subCategory || '—'}</span>
                                    </td>

                                    {/* Tags */}
                                    <td className="px-6 py-3">
                                      <div className="flex gap-1.5 flex-wrap">
                                        {editingId === product.id ? (
                                          FLAGS.map(({ key, label }) => {
                                            const active = !!(editData[key] ?? product[key]);
                                            return (
                                              <button key={key} type="button"
                                                onClick={() => setEditData(d => ({ ...d, [key]: !active }))}
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all
                                                  ${active ? 'bg-brand-deep-green text-white border-brand-deep-green' : 'bg-white text-stone-400 border-stone-200'}`}>
                                                {label}
                                              </button>
                                            );
                                          })
                                        ) : (
                                          <>
                                            {product.trending   && <span className="text-[10px] font-bold bg-amber-50  text-amber-600  px-2 py-0.5 rounded-full">Trending</span>}
                                            {product.topSelling && <span className="text-[10px] font-bold bg-blue-50   text-blue-600   px-2 py-0.5 rounded-full">Top Selling</span>}
                                            {product.newArrival && <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">New</span>}
                                          </>
                                        )}
                                      </div>
                                    </td>

                                    {/* Stock toggle — click directly */}
                                    <td className="px-6 py-3">
                                      <button type="button" onClick={() => toggleStock(product)}
                                        className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full border transition-all
                                          ${isInStock
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                                            : 'bg-red-50 text-red-500 border-red-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                        {isInStock ? 'Available' : 'Out of Stock'}
                                      </button>
                                    </td>

                                    {/* Price */}
                                    <td className="px-6 py-3 text-right">
                                      {editingId === product.id ? (
                                        <div className="flex items-center justify-end gap-1">
                                          <span className="text-stone-400 text-sm">₹</span>
                                          <input type="number" value={editData.price ?? product.price}
                                            onChange={e => setEditData(d => ({ ...d, price: Number(e.target.value) }))}
                                            className="w-20 border border-stone-200 rounded-lg px-2 py-1 text-sm font-bold text-right focus:outline-none" />
                                        </div>
                                      ) : (
                                        <span className="font-bold text-brand-deep-green text-sm">₹{product.price.toLocaleString()}</span>
                                      )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-3">
                                      <div className="flex items-center justify-center gap-2">
                                        {editingId === product.id ? (
                                          <>
                                            <button onClick={() => saveEdit(product.id)}
                                              className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 flex items-center justify-center">
                                              <Check size={14} />
                                            </button>
                                            <button onClick={() => { setEditingId(null); setEditData({}); }}
                                              className="w-8 h-8 bg-stone-100 text-stone-400 rounded-lg hover:bg-stone-200 flex items-center justify-center">
                                              <X size={14} />
                                            </button>
                                          </>
                                        ) : (
                                          <button onClick={() => startEdit(product)}
                                            className="w-8 h-8 bg-brand-light-green text-brand-deep-green rounded-lg hover:bg-brand-deep-green hover:text-white transition-all flex items-center justify-center">
                                            <Edit3 size={14} />
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};