import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Filter, ChevronDown, SlidersHorizontal, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { shopProducts } from '../shopProducts';
import { getLocalProducts } from '../pages/Localproductsstore';

import heroImg1 from '../images/Kundan_Bangels/Kundan_Bangels4.png';
import heroImg5 from '../images/kundan_jhumkas/kundan_jhumkas1.png';
import heroImg6 from '../images/traditional_jhumkas/traditional_jhumkas1.png';
import prodImg1 from '../images/kundan_modern_earings/kundan_modern_earings1.png';
import prodImg2 from '../images/silk_thread_jhumkas/silk_thread_jhumkas1.png';
import prodImg3 from '../images/Kundan_Bangels/Kundan_Bangels10.png';
import prodImg4 from '../images/studs/studs7.jpg';
import prodImg5 from '../images/Kundan_Bangels/Kundan_Bangels20.png';

const categories = ['Bangles', 'Earrings'];

const subCategories: Record<string, string[]> = {
  'Earrings': ['Studs', 'Jhumkas', 'Modern Jhumkas', 'Silk Thread Jhumkas', 'Traditional Jhumkas'],
  'Bangles':  ['Traditional', 'Modern', 'Bridal'],
};

const subCategoryImages: Record<string, Record<string, string>> = {
  Earrings: {
    'Studs':               prodImg4,
    'Jhumkas':             heroImg5,
    'Modern Jhumkas':      prodImg1,
    'Silk Thread Jhumkas': prodImg2,
    'Traditional Jhumkas': heroImg6,
  },
  Bangles: {
    'Traditional': heroImg1,
    'Modern':      prodImg3,
    'Bridal':      prodImg5,
  },
};

const priceRanges = [
  { label: 'Under ₹500',       min: 0,    max: 499.99  },
  { label: '₹500 - ₹1,000',   min: 500,  max: 999.99  },
  { label: '₹1,000 - ₹2,000', min: 1000, max: 1999.99 },
  { label: 'Over ₹2,000',      min: 2000, max: 10000   },
];

const sizes = ['2.2', '2.4', '2.6', '2.8', '2.10', '2.12'];

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile]         = useState(false);
  const [currentPage, setCurrentPage]   = useState(1);
  const [allProducts, setAllProducts]   = useState(() => [...shopProducts, ...getLocalProducts()]);

  // Scroll to top whenever the Shop component mounts or location changes
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, location.search]); // Trigger on path or search params change

  // Additional scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Re-read localStorage every time Shop page is visited
  useEffect(() => {
    setAllProducts([...shopProducts, ...getLocalProducts()]);
  }, []);

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    priceRange: true,
    sizes: true,
  });
  const itemsPerPage = 12;

  const activeCategory    = searchParams.get('category');
  const activeSubCategory = searchParams.get('subCategory');
  const activePriceRange  = searchParams.get('priceRange');
  const activeSize        = searchParams.get('size');
  const searchQuery       = searchParams.get('q') || '';

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scroll to top when filters change or page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, activeCategory, activeSubCategory, activePriceRange, activeSize]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      if (activeCategory    && product.category    !== activeCategory)    return false;
      if (activeSubCategory && product.subCategory !== activeSubCategory) return false;
      if (activePriceRange) {
        const range = priceRanges.find(r => r.label === activePriceRange);
        if (range && (product.price < range.min || product.price > range.max)) return false;
      }
      if (activeSize && (!product.sizes || !product.sizes.includes(activeSize))) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const text = `${product.name} ${product.category} ${product.subCategory} ${product.description}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [activeCategory, activeSubCategory, activePriceRange, activeSize, searchQuery, allProducts]);

  const totalPages        = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasActiveFilters  = !!(activeCategory || activeSubCategory || activePriceRange || activeSize || searchQuery);
  const activeFilterCount = [activeCategory, activeSubCategory, activePriceRange, activeSize].filter(Boolean).length;

  const toggleCategory = (cat: string) => {
    const p = new URLSearchParams(searchParams);
    if (activeCategory === cat) { p.delete('category'); p.delete('subCategory'); }
    else { p.set('category', cat); p.delete('subCategory'); }
    setSearchParams(p);
    setCurrentPage(1);
    if (isMobile) setIsFilterOpen(false);
  };

  const toggleSubCategory = (sub: string) => {
    const p = new URLSearchParams(searchParams);
    activeSubCategory === sub ? p.delete('subCategory') : p.set('subCategory', sub);
    setSearchParams(p);
    setCurrentPage(1);
    if (isMobile) setIsFilterOpen(false);
  };

  const setPriceRange = (label: string) => {
    const p = new URLSearchParams(searchParams);
    activePriceRange === label ? p.delete('priceRange') : p.set('priceRange', label);
    setSearchParams(p);
    setCurrentPage(1);
    if (isMobile) setIsFilterOpen(false);
  };

  const setSize = (size: string) => {
    const p = new URLSearchParams(searchParams);
    activeSize === size ? p.delete('size') : p.set('size', size);
    setSearchParams(p);
    setCurrentPage(1);
    if (isMobile) setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchParams({});
    setCurrentPage(1);
    if (isMobile) setIsFilterOpen(false);
  };

  const toggleSection = (section: 'categories' | 'priceRange' | 'sizes') => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const FilterContent = () => (
    <div className="space-y-8">

      {/* Categories */}
      <div>
        <button onClick={() => toggleSection('categories')}
          className="w-full font-serif font-bold text-lg mb-4 flex items-center justify-between py-2 hover:text-brand-deep-green transition-colors">
          Categories
          <ChevronDown size={16} className={`transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.categories && (
          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat}>
                <button onClick={() => toggleCategory(cat)}
                  className={`w-full text-left text-sm py-1 transition-colors flex items-center justify-between
                    ${activeCategory === cat ? 'text-brand-deep-green font-bold' : 'text-stone-600 hover:text-brand-gold'}`}>
                  {cat}
                  {activeCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-brand-deep-green" />}
                </button>
                {activeCategory === cat && subCategories[cat] && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="pl-4 mt-2 space-y-2 border-l border-stone-100 ml-1">
                    {subCategories[cat].map(sub => (
                      <button key={sub} onClick={() => toggleSubCategory(sub)}
                        className={`w-full text-left text-xs py-1 transition-colors
                          ${activeSubCategory === sub ? 'text-brand-gold font-bold' : 'text-stone-400 hover:text-brand-gold'}`}>
                        {sub}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <button onClick={() => toggleSection('priceRange')}
          className="w-full font-serif font-bold text-lg mb-4 flex items-center justify-between py-2 hover:text-brand-deep-green transition-colors">
          Price Range
          <ChevronDown size={16} className={`transition-transform ${expandedSections.priceRange ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.priceRange && (
          <div className="space-y-3">
            {priceRanges.map(range => (
              <button key={range.label} onClick={() => setPriceRange(range.label)}
                className={`w-full text-left text-sm py-1 transition-colors flex items-center justify-between
                  ${activePriceRange === range.label ? 'text-brand-deep-green font-bold' : 'text-stone-600 hover:text-brand-gold'}`}>
                {range.label}
                {activePriceRange === range.label && <div className="w-1.5 h-1.5 rounded-full bg-brand-deep-green" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sizes */}
      <div>
        <button onClick={() => toggleSection('sizes')}
          className="w-full font-serif font-bold text-lg mb-4 flex items-center justify-between py-2 hover:text-brand-deep-green transition-colors">
          Bangle Sizes
          <ChevronDown size={16} className={`transition-transform ${expandedSections.sizes ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.sizes && (
          <div className="grid grid-cols-3 gap-2">
            {sizes.map(size => (
              <button key={size} onClick={() => setSize(size)}
                className={`border py-2 text-xs rounded transition-colors
                  ${activeSize === size ? 'bg-brand-deep-green text-white border-brand-deep-green' : 'border-stone-200 hover:border-brand-deep-green hover:text-brand-deep-green'}`}>
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );

  return (
    <div className="bg-brand-bg-green min-h-screen py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Our Collection</h1>
            <p className="text-stone-500 text-sm">Showing {filteredProducts.length} exquisite pieces</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-grow md:w-64">
              <input type="text" placeholder="Search products..." value={searchQuery}
                onChange={(e) => {
                  const p = new URLSearchParams(searchParams);
                  e.target.value ? p.set('q', e.target.value) : p.delete('q');
                  setSearchParams(p);
                }}
                className="w-full bg-white border border-stone-200 rounded-full px-6 py-2 pl-12 focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            </div>
            <button onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="relative flex items-center gap-2 bg-white border border-stone-200 px-6 py-2 rounded-full hover:bg-stone-50 transition-colors">
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-deep-green text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Desktop sidebar */}
          {!isMobile && (
            <AnimatePresence>
              {isFilterOpen && (
                <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="w-64 flex-shrink-0">
                  <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                    {hasActiveFilters && (
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-stone-100">
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</span>
                        <button onClick={clearFilters}
                          className="text-xs font-bold text-brand-deep-green bg-brand-light-green px-3 py-1.5 rounded-full hover:bg-brand-deep-green hover:text-white transition-all">
                          Clear All
                        </button>
                      </div>
                    )}
                    <FilterContent />
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          )}

          {/* Mobile bottom drawer */}
          {isMobile && (
            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setIsFilterOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40" />
                  <motion.div
                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-100 sticky top-0 bg-white">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal size={18} className="text-brand-deep-green" />
                        <h3 className="font-serif font-bold text-lg">Filters</h3>
                        {activeFilterCount > 0 && (
                          <span className="bg-brand-deep-green text-white text-xs px-2 py-0.5 rounded-full font-bold">
                            {activeFilterCount} active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                          <button onClick={clearFilters}
                            className="text-xs font-bold text-brand-deep-green bg-brand-light-green px-3 py-1.5 rounded-full hover:bg-brand-deep-green hover:text-white transition-all">
                            Clear All
                          </button>
                        )}
                        <button onClick={() => setIsFilterOpen(false)}
                          className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="px-6 py-5"><FilterContent /></div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          )}

          {/* Product area */}
          <div className="flex-grow min-w-0">

            {/* Subcategory circles — appear when category is active */}
            {activeCategory && subCategories[activeCategory] && (
              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-4">
                  {activeCategory} — Browse by Style
                </p>
                <div className="flex flex-wrap gap-5">
                  {subCategories[activeCategory].map(sub => {
                    const img      = subCategoryImages[activeCategory]?.[sub];
                    const isActive = activeSubCategory === sub;
                    return (
                      <button key={sub} onClick={() => toggleSubCategory(sub)}
                        className="flex flex-col items-center gap-2 group">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm
                          ${isActive
                            ? 'border-brand-deep-green scale-110 shadow-md ring-2 ring-brand-deep-green/30'
                            : 'border-stone-200 group-hover:border-brand-gold group-hover:scale-105'}`}>
                          {img
                            ? <img src={img} alt={sub} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-brand-light-green" />
                          }
                        </div>
                        <span className={`text-xs text-center max-w-[68px] leading-tight font-medium transition-colors
                          ${isActive ? 'text-brand-deep-green font-bold' : 'text-stone-500 group-hover:text-brand-deep-green'}`}>
                          {sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeCategory && (
                  <span className="flex items-center gap-1 bg-brand-deep-green text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    {activeCategory}
                    <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete('category'); p.delete('subCategory'); setSearchParams(p); }} className="hover:opacity-70 ml-0.5">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {activeSubCategory && (
                  <span className="flex items-center gap-1 bg-brand-gold text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    {activeSubCategory}
                    <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete('subCategory'); setSearchParams(p); }} className="hover:opacity-70 ml-0.5">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {activePriceRange && (
                  <span className="flex items-center gap-1 bg-stone-700 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    {activePriceRange}
                    <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete('priceRange'); setSearchParams(p); }} className="hover:opacity-70 ml-0.5">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {activeSize && (
                  <span className="flex items-center gap-1 bg-stone-500 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    Size {activeSize}
                    <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete('size'); setSearchParams(p); }} className="hover:opacity-70 ml-0.5">
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products */}
            <div>
              {paginatedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {paginatedProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center space-x-4">
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}
                        className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors">
                        <ChevronDown className="rotate-90" size={18} />
                      </button>
                      <div className="flex items-center space-x-2">
                        {[...Array(totalPages)].map((_, i) => (
                          <button key={i} onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${currentPage === i + 1 ? 'bg-brand-deep-green text-white' : 'hover:bg-white'}`}>
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}
                        className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors">
                        <ChevronDown className="-rotate-90" size={18} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-200">
                  <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                    <Filter size={32} />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2">No products found</h3>
                  <p className="text-stone-400 text-sm mb-6">Try adjusting your filters</p>
                  <button onClick={clearFilters} className="bg-brand-deep-green text-white px-8 py-2 rounded-full font-medium">
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
