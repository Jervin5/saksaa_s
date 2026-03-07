import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Bookmark, X, LogIn, Sparkles, Truck, RotateCcw, ShieldCheck, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { useWishlist } from '../WishlistContext';

const sizes = ['2.2', '2.4', '2.6', '2.8', '2.10', '2.12'];

// ─── Reusable Login Prompt Modal ──────────────────────────────────────────────
interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'cart' | 'wishlist';
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose, action }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-[101] px-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm pointer-events-auto relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
              >
                <X size={16} />
              </button>
              <div className="w-16 h-16 bg-brand-light-green rounded-full flex items-center justify-center mx-auto mb-6 text-brand-deep-green">
                <Sparkles size={28} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900 text-center mb-2">
                Login Required
              </h2>
              <p className="text-stone-500 text-sm text-center leading-relaxed mb-8">
                {action === 'cart'
                  ? 'Please login to add items to your cart and proceed to checkout.'
                  : 'Please login to save items to your wishlist and access them anytime.'}
              </p>
              <button
                onClick={handleLogin}
                className="w-full bg-brand-deep-green text-white py-3.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg mb-3"
              >
                <LogIn size={18} />
                Login to Continue
              </button>
              <button
                onClick={onClose}
                className="w-full border border-stone-200 text-stone-600 py-3 rounded-full font-medium text-sm hover:bg-stone-50 transition-colors"
              >
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
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // ✅ Reactive login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => !!localStorage.getItem('saksaas_user')
  );

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'cart' | 'wishlist'>('cart');

  useEffect(() => {
    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem('saksaas_user'));

    window.addEventListener('saksaas-login', handleLogin);
    window.addEventListener('saksaas-logout', handleLogout);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('saksaas-login', handleLogin);
      window.removeEventListener('saksaas-logout', handleLogout);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const all = await apiService.getProducts();
        setRelatedProducts(all.filter(item => item.inStock !== false).slice(0, 6));
        try {
          const p = await apiService.getProductById(id);
          setProduct(p);
          setRelatedProducts(
            all.filter(item => item.category === p.category && item.id !== id && item.inStock !== false).slice(0, 6)
          );
        } catch (err) {
          console.error('Product not found:', err);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ── Guarded handlers ─────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (product?.inStock === false) return;
    if (!isLoggedIn) {
      setModalAction('cart');
      setShowModal(true);
      return; // ✅ Stop — no cart action
    }
    addToCart(product!, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    if (product?.inStock === false) return;
    if (!isLoggedIn) {
      setModalAction('cart');
      setShowModal(true);
      return; // ✅ Stop — no navigation
    }
    addToCart(product!, quantity, selectedSize);
    navigate('/cart');
  };

  const handleWishlist = () => {
    if (!isLoggedIn) {
      setModalAction('wishlist');
      setShowModal(true);
      return; // ✅ Stop — no wishlist toggle
    }
    toggleWishlist(product!);
  };

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  if (!product) {
    return (
      <div className="bg-brand-bg-green min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <div className="mb-8">
              <h1 className="text-5xl font-serif font-bold mb-4 text-stone-800">Oops!</h1>
              <p className="text-2xl text-stone-600 mb-6">This product doesn't exist</p>
              <p className="text-stone-500 mb-8 text-lg">
                The product you're looking for might be out of stock or has been removed from our collection.
              </p>
              <div className="space-y-4">
                <Link
                  to="/shop"
                  className="inline-block bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-deep-green transition-all"
                >
                  Browse All Products
                </Link>
                <p className="text-stone-400 text-sm">or explore our popular categories below</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <Link
                to="/shop?category=Bangles"
                className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all group"
              >
                <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2 group-hover:text-brand-deep-green">Bangles</h3>
                <p className="text-stone-500 text-sm mb-4">Explore our beautiful collection of traditional and modern bangles</p>
                <span className="text-brand-deep-green font-medium text-sm">Shop Bangles →</span>
              </Link>
              <Link
                to="/shop?category=Earrings"
                className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all group"
              >
                <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2 group-hover:text-brand-deep-green">Earrings</h3>
                <p className="text-stone-500 text-sm mb-4">Discover our elegant collection of jhumkas, studs, and hanging earrings</p>
                <span className="text-brand-deep-green font-medium text-sm">Shop Earrings →</span>
              </Link>
            </div>

            <div>
              <h2 className="text-3xl font-serif font-bold mb-8 text-stone-800">You Might Like These</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.length > 0 ? (
                  relatedProducts.slice(0, 3).map(p => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all group"
                    >
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-serif font-bold text-stone-800 mb-2 line-clamp-2">{p.name}</h3>
                        <p className="text-brand-deep-green font-bold text-lg">₹{p.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-stone-500">No products found, but check back soon!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-brand-bg-green min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-stone-500 mb-12 uppercase tracking-widest">
            <Link to="/" className="hover:text-brand-deep-green">Home</Link>
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
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto max-h-[600px] scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-brand-deep-green' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="flex-grow aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage] || product.image}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {product.trending && (
                    <span className="bg-brand-gold text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      Trending
                    </span>
                  )}
                  {product.newArrival && (
                    <span className="bg-brand-deep-green text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      New Arrival
                    </span>
                  )}
                  {product.inStock === false && (
                    <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-serif font-bold text-stone-900 mb-3">{product.name}</h1>
                <p className="text-stone-500 text-sm mb-6">{product.description}</p>
                <p className="text-4xl font-bold text-brand-deep-green">₹{product.price.toLocaleString()}</p>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-stone-700 mb-3">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'border-brand-deep-green bg-brand-deep-green text-white'
                            : 'border-stone-200 hover:border-brand-gold'
                        }`}
                      >
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
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="flex-grow text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.inStock === false}
                  className={`flex-grow py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${
                    product.inStock === false
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-stone-900 text-white hover:bg-brand-deep-green'
                  }`}
                >
                  <ShoppingCart size={20} />
                  {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={product.inStock === false}
                  className={`flex-grow py-4 rounded-full font-bold transition-all ${
                    product.inStock === false
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-brand-gold text-white hover:bg-brand-deep-green'
                  }`}
                >
                  {product.inStock === false ? 'Out of Stock' : 'Buy Now'}
                </button>

                {/* Wishlist */}
                <button
                  onClick={handleWishlist}
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                    isLoggedIn && isInWishlist(product.id)
                      ? 'border-brand-deep-green bg-brand-deep-green text-white'
                      : 'border-stone-200 hover:border-brand-deep-green hover:text-brand-deep-green'
                  }`}
                >
                  <Bookmark
                    size={20}
                    fill={isLoggedIn && isInWishlist(product.id) ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-stone-200">
                <div className="text-center space-y-2">
                  <Truck size={20} className="mx-auto text-stone-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Free Shipping</p>
                </div>
                <div className="text-center space-y-2">
                  <RotateCcw size={20} className="mx-auto text-stone-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">7 Day Return</p>
                </div>
                <div className="text-center space-y-2">
                  <ShieldCheck size={20} className="mx-auto text-stone-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Secure Payment</p>
                </div>
              </div>

              {/* Payment Icons */}
              <div className="flex flex-wrap items-center gap-4 opacity-60 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo.svg" alt="GPay" className="h-5" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-4" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-20">
            <div className="flex border-b border-stone-200 mb-8">
              {['description', 'shipping info'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-brand-deep-green' : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-deep-green" />
                  )}
                </button>
              ))}
            </div>
            <div className="max-w-4xl">
              {activeTab === 'description' ? (
                <div className="space-y-6 text-stone-600 leading-relaxed">
                  <p>
                    This exquisite piece is a testament to the skill and dedication of our master artisans.
                    Each element is carefully handcrafted using traditional techniques that have been perfected over generations.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Material: High-quality gold plated brass with semi-precious stones</li>
                    <li>Weight: 45 grams</li>
                    <li>Craftsmanship: Hand-engraved traditional patterns</li>
                    <li>Occasion: Festive, Wedding, Party Wear</li>
                    <li>Care: Keep away from moisture and perfumes. Store in a dry, cool place.</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-6 text-stone-600 leading-relaxed">
                  <p>We take great care in packaging and shipping your artisan jewellery to ensure it reaches you in perfect condition.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Processing Time: 2-3 business days</li>
                    <li>Shipping Time: 5-7 business days across India</li>
                    <li>Free shipping on orders above ₹1,500</li>
                    <li>Tracking details will be shared via email and WhatsApp</li>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Login prompt modal */}
      <LoginPromptModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        action={modalAction}
      />
    </>
  );
};