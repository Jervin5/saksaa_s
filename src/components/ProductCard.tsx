import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Bookmark, X, LogIn, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

// ─── Login Prompt Modal ───────────────────────────────────────────────────────
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-[101] px-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm pointer-events-auto relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
              >
                <X size={16} />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 bg-brand-light-green rounded-full flex items-center justify-center mx-auto mb-6 text-brand-deep-green">
                <Sparkles size={28} />
              </div>

              {/* Text */}
              <h2 className="text-2xl font-serif font-bold text-stone-900 text-center mb-2">
                Login Required
              </h2>
              <p className="text-stone-500 text-sm text-center leading-relaxed mb-8">
                {action === 'cart'
                  ? 'Please login to add items to your cart and proceed to checkout.'
                  : 'Please login to save items to your wishlist and access them anytime.'}
              </p>

              {/* Buttons */}
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

// ─── Product Card ─────────────────────────────────────────────────────────────
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'cart' | 'wishlist'>('cart');

  // ✅ Reactive — updates when user logs in or out anywhere in the app
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => !!localStorage.getItem('saksaas_user')
  );

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

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock === false) return;

    if (!isLoggedIn) {
      setModalAction('cart');
      setShowModal(true);
      return; // ✅ STOP here — do NOT navigate or add to cart
    }

    addToCart(product);
    navigate('/cart');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      setModalAction('wishlist');
      setShowModal(true);
      return; // ✅ STOP here — do NOT toggle wishlist
    }

    toggleWishlist(product);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 product-card-hover"
      >
        <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          {product.newArrival && (
            <span className="absolute top-2 left-2 bg-brand-deep-green text-white text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">
              New
            </span>
          )}
          {product.trending && !product.newArrival && (
            <span className="absolute top-2 left-2 bg-brand-gold text-white text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">
              Trending
            </span>
          )}
          {product.inStock === false && (
            <span className="absolute bottom-2 left-2 bg-red-500 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded">
              Out of Stock
            </span>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm ${
              isLoggedIn && isInWishlist(product.id)
                ? 'bg-brand-deep-green text-white'
                : 'bg-white/80 text-stone-400 hover:text-brand-deep-green'
            }`}
          >
            <Bookmark
              size={14}
              fill={isLoggedIn && isInWishlist(product.id) ? 'currentColor' : 'none'}
            />
          </button>
        </Link>

        <div className="p-3 text-center">
          <Link to={`/product/${product.id}`} className="block mb-0.5">
            <h3 className="font-serif text-sm font-medium text-stone-800 group-hover:text-brand-deep-green transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-brand-deep-green text-xs font-bold mb-2">₹{product.price.toLocaleString()}</p>

          <button
            onClick={handleBuyNow}
            disabled={product.inStock === false}
            className={`w-full py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
              product.inStock === false
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-stone-900 text-white hover:bg-brand-deep-green'
            }`}
          >
            <ShoppingCart size={12} />
            {product.inStock === false ? 'Out of Stock' : 'Buy Now'}
          </button>
        </div>
      </motion.div>

      {/* Login prompt modal */}
      <LoginPromptModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        action={modalAction}
      />
    </>
  );
};