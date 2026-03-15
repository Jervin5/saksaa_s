import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Bookmark, X, LogIn, Sparkles, Truck, RotateCcw, ShieldCheck, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { useWishlist } from '../WishlistContext';
import { shopProducts } from '../shopProducts';
import { products as dataProducts } from '../data';

// All local products — never calls the empty DB for lookups
const ALL_PRODUCTS: Product[] = [...shopProducts, ...dataProducts];

const sizes = ['2.2', '2.4', '2.6', '2.8', '2.10', '2.12'];

// ─── Login Prompt Modal ───────────────────────────────────────────────────────
interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'cart' | 'wishlist';
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose, action }) => {
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-[101] px-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm pointer-events-auto relative">
              <button onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors">
                <X size={16} />
              </button>
              <div className="w-16 h-16 bg-brand-light-green rounded-full flex items-center justify-center mx-auto mb-6 text-brand-deep-green">
                <Sparkles size={28} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900 text-center mb-2">Login Required</h2>
              <p className="text-stone-500 text-sm text-center leading-relaxed mb-8">
                {action === 'cart'
                  ? 'Please login to add items to your cart and proceed to checkout.'
                  : 'Please login to save items to your wishlist and access them anytime.'}
              </p>
              <button onClick={() => { onClose(); navigate('/login'); }}
                className="w-full bg-brand-deep-green text-white py-3.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg mb-3">
                <LogIn size={18} /> Login to Continue
              </button>
              <button onClick={onClose}
                className="w-full border border-stone-200 text-stone-600 py-3 rounded-full font-medium text-sm hover:bg-stone-50 transition-colors">
                Continue Browsing
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Product Detail Page ──────────────────────────────────────────────────────
export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart }             = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate                  = useNavigate();

  const [product, setProduct]               = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading]               = useState(true);
  const [selectedImage, setSelectedImage]   = useState(0);
  const [selectedSize, setSelectedSize]     = useState(sizes[1]);
  const [quantity, setQuantity]             = useState(1);
  const [activeTab, setActiveTab]           = useState('description');
  const [isLoggedIn, setIsLoggedIn]         = useState(() => !!localStorage.getItem('saksaas_user'));
  const [showModal, setShowModal]           = useState(false);
  const [modalAction, setModalAction]       = useState<'cart' | 'wishlist'>('cart');

  useEffect(() => {
    const onLogin   = () => setIsLoggedIn(true);
    const onLogout  = () => setIsLoggedIn(false);
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem('saksaas_user'));
    window.addEventListener('saksaas-login',  onLogin);
    window.addEventListener('saksaas-logout', onLogout);
    window.addEventListener('storage',        onStorage);
    return () => {
      window.removeEventListener('saksaas-login',  onLogin);
      window.removeEventListener('saksaas-logout', onLogout);
      window.removeEventListener('storage',        onStorage);
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setSelectedImage(0);

    // 1. Look up in local products first (instant, no API needed)
    const localProduct = ALL_PRODUCTS.find(p => p.id === id);

    if (localProduct) {
      setProduct(localProduct);
      // Related = same category, not same product, in stock
      const related = ALL_PRODUCTS
        .filter(p => p.category === localProduct.category && p.id !== id && p.inStock !== false)
        .slice(0, 6);
      setRelatedProducts(related);
      setLoading(false);
    } else {
      // 2. Not a local product — try backend (for admin-added DB products)
      const fetchFromBackend = async () => {
        try {
          const { apiService } = await import('../services/apiService');
          const p = await apiService.getProductById(id);
          setProduct(p);
          const all = await apiService.getProducts();
          setRelatedProducts(
            all.filter(item => item.category === p.category && item.id !== id && item.inStock !== false).slice(0, 6)
          );
        } catch {
          // Truly not found anywhere
          setProduct(null);
          setRelatedProducts(
            ALL_PRODUCTS.filter(p => p.inStock !== false).slice(0, 3)
          );
        } finally {
          setLoading(false);
        }
      };
      fetchFromBackend();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product?.inStock === false) return;
    if (!isLoggedIn) { setModalAction('cart'); setShowModal(true); return; }
    addToCart(product!, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    if (product?.inStock === false) return;
    if (!isLoggedIn) { setModalAction('cart'); setShowModal(true); return; }
    addToCart(product!, quantity, selectedSize);
    navigate('/cart');
  };

  const handleWishlist = () => {
    if (!isLoggedIn) { setModalAction('wishlist'); setShowModal(true); return; }
    toggleWishlist(product!);
  };

  if (loading) {
    return (
      <div className="bg-brand-bg-green min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-deep-green border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-stone-500 font-serif">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show out-of-stock page when product exists but is genuinely out of stock
  if (product && product.inStock === false) {
    return (
      <div className="bg-brand-bg-green min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-stone-100 mb-12">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={32} className="text-red-400" />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-3 text-stone-800">Out of Stock</h1>
            <p className="text-stone-500 mb-2 text-lg font-serif">{product.name}</p>
            <p className="text-stone-400 mb-8 text-sm">
              This item is currently out of stock. Check back soon or explore similar products below.
            </p>
            <Link to="/shop"
              className="inline-block bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-deep-green transition-all">
              Browse All Products
            </Link>
          </div>
          {relatedProducts.length > 0 && (
            <>
              <h2 className="text-2xl font-serif font-bold mb-8 text-left">Similar Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {relatedProducts.slice(0, 6).map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Product genuinely not found (invalid URL)
  if (!product) {
    return (
      <div className="bg-brand-bg-green min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-stone-100 mb-12">
            <h1 className="text-3xl font-serif font-bold mb-3">Product Not Found</h1>
            <p className="text-stone-500 mb-8">This product may have been removed. Browse our collection below.</p>
            <Link to="/shop"
              className="inline-block bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-deep-green transition-all">
              Browse All Products
            </Link>
          </div>
          {relatedProducts.length > 0 && (
            <>
              <h2 className="text-2xl font-serif font-bold mb-8 text-left">You Might Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Full Product Detail ───────────────────────────────────────────────────
  return (
    <>
      <div className="bg-brand-bg-green min-h-screen py-12">
        <div className="container mx-auto px-4">

          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-stone-500 mb-12 uppercase tracking-widest flex-wrap gap-y-1">
            <Link to="/"    className="hover:text-brand-deep-green">Home</Link>
            <ChevronRight size={12} />
            <Link to="/shop" className="hover:text-brand-deep-green">Shop</Link>
            <ChevronRight size={12} />
            <Link to={`/shop?category=${product.category}`} className="hover:text-brand-deep-green">{product.category}</Link>
            <ChevronRight size={12} />
            <span className="text-stone-800 font-bold">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">

            {/* Image Gallery */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto max-h-[600px]">
                {(product.images?.length ? product.images : [product.image]).map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-brand-deep-green' : 'border-transparent'
                    }`}>
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="flex-grow aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={(product.images?.length ? product.images : [product.image])[selectedImage] || product.image}
                    alt={product.name}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {product.trending   && <span className="bg-brand-gold text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Trending</span>}
                  {product.newArrival && <span className="bg-brand-deep-green text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">New Arrival</span>}
                </div>
                <h1 className="text-4xl font-serif font-bold text-stone-900 mb-3">{product.name}</h1>
                <p className="text-stone-500 text-sm mb-6 leading-relaxed">{product.description}</p>
                <p className="text-4xl font-bold text-brand-deep-green">₹{product.price.toLocaleString()}</p>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-stone-700 mb-3">Select Size</label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button key={size} onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'border-brand-deep-green bg-brand-deep-green text-white'
                            : 'border-stone-200 hover:border-brand-gold'
                        }`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-stone-700 mb-3">Quantity</label>
                <div className="flex items-center w-32 border-2 border-stone-200 rounded-full p-1">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors text-lg font-bold">−</button>
                  <span className="flex-grow text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors text-lg font-bold">+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleAddToCart}
                  className="flex-grow py-4 rounded-full font-bold flex items-center justify-center gap-2 bg-stone-900 text-white hover:bg-brand-deep-green transition-all">
                  <ShoppingCart size={20} /> Add to Cart
                </button>
                <button onClick={handleBuyNow}
                  className="flex-grow py-4 rounded-full font-bold bg-brand-gold text-white hover:bg-brand-deep-green transition-all">
                  Buy Now
                </button>
                <button onClick={handleWishlist}
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                    isLoggedIn && isInWishlist(product.id)
                      ? 'border-brand-deep-green bg-brand-deep-green text-white'
                      : 'border-stone-200 hover:border-brand-deep-green hover:text-brand-deep-green'
                  }`}>
                  <Bookmark size={20} fill={isLoggedIn && isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-stone-200">
                {[
                  { icon: Truck,      label: 'Free Shipping'  },
                  { icon: RotateCcw,  label: '7 Day Return'   },
                  { icon: ShieldCheck,label: 'Secure Payment' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="text-center space-y-2">
                    <Icon size={20} className="mx-auto text-stone-400" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{label}</p>
                  </div>
                ))}
              </div>

              {/* Payment Icons */}
              <div className="flex flex-wrap items-center gap-4 opacity-60 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"     alt="Visa"       className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"  alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo.svg"  alt="GPay"       className="h-5" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png"         alt="UPI"        className="h-4" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-20">
            <div className="flex border-b border-stone-200 mb-8">
              {['description', 'shipping info'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-brand-deep-green' : 'text-stone-400 hover:text-stone-600'
                  }`}>
                  {tab}
                  {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-deep-green" />}
                </button>
              ))}
            </div>
            <div className="max-w-4xl text-stone-600 leading-relaxed">
              {activeTab === 'description' ? (
                <div className="space-y-4">
                  <p>This exquisite piece is a testament to the skill and dedication of our master artisans. Each element is carefully handcrafted using traditional techniques perfected over generations.</p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>Material: High-quality gold plated brass with semi-precious stones</li>
                    <li>Craftsmanship: Hand-engraved traditional patterns</li>
                    <li>Occasion: Festive, Wedding, Party Wear</li>
                    <li>Care: Keep away from moisture and perfumes. Store in a dry, cool place.</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>We take great care in packaging and shipping your artisan jewellery to ensure it reaches you in perfect condition.</p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>Processing Time: 2–3 business days</li>
                    <li>Shipping Time: 5–7 business days across India</li>
                    <li>Free shipping on orders above ₹1,500</li>
                    <li>Tracking details shared via email and WhatsApp</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-12">
                <h2 className="text-3xl font-serif font-bold">You May Also Like</h2>
                <Link to="/shop" className="text-brand-deep-green font-medium hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      </div>

      <LoginPromptModal isOpen={showModal} onClose={() => setShowModal(false)} action={modalAction} />
    </>
  );
};