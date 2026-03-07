import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ChevronDown, Phone, Mail, MapPin, Instagram, Facebook, Twitter, Bookmark } from 'lucide-react';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('saksaas_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleStorageChange = () => {
      const updated = localStorage.getItem('saksaas_user');
      setUser(updated ? JSON.parse(updated) : null);
    };

    const handleLogin = () => {
      const updated = localStorage.getItem('saksaas_user');
      setUser(updated ? JSON.parse(updated) : null);
    };

    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('saksaas-login', handleLogin);
    window.addEventListener('saksaas-logout', handleLogout);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('saksaas-login', handleLogin);
      window.removeEventListener('saksaas-logout', handleLogout);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    const storedUser = localStorage.getItem('saksaas_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Nav links are always visible — logged in or not
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop', hasMegaMenu: true },
    { name: 'Customise Your Set', path: '/customise' },
    { name: 'About Us', path: '/about' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-serif font-bold tracking-widest text-brand-deep-green">
          SAKSAAS
        </Link>

        {/* Desktop Nav — always shown */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <Link
                to={link.path}
                className={cn(
                  "text-sm font-medium uppercase tracking-wider hover:text-brand-deep-green transition-colors flex items-center gap-1",
                  location.pathname === link.path ? "text-brand-deep-green" : "text-stone-700"
                )}
              >
                {link.name}
                {link.hasMegaMenu && <ChevronDown size={14} />}
              </Link>

              {link.hasMegaMenu && (
                <div className="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-white shadow-2xl rounded-lg p-8 w-[600px] grid grid-cols-3 gap-8 border border-stone-100">
                    <div>
                      <h4 className="font-serif font-bold mb-4 text-brand-deep-green border-b pb-2">Categories</h4>
                      <ul className="space-y-2">
                        <li><Link to="/shop?category=Bangles" className="text-sm hover:text-brand-deep-green">Bangles</Link></li>
                        <li><Link to="/shop?category=Earrings" className="text-sm hover:text-brand-deep-green">Earrings</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold mb-4 text-brand-deep-green border-b pb-2">Collections</h4>
                      <ul className="space-y-2">
                        <li><Link to="/shop?filter=trending" className="text-sm hover:text-brand-deep-green">Trending</Link></li>
                        <li><Link to="/shop?filter=new" className="text-sm hover:text-brand-deep-green">New Arrivals</Link></li>
                        <li><Link to="/shop?filter=under500" className="text-sm hover:text-brand-deep-green">Under ₹500</Link></li>
                      </ul>
                    </div>
                    <div className="bg-brand-light-green p-4 rounded-md">
                      <img
                        src="https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=300"
                        alt="Promo"
                        className="rounded mb-2 w-full h-32 object-cover"
                      />
                      <p className="text-xs font-medium text-brand-deep-green">Handmade with Love</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-5">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-stone-700 hover:text-brand-deep-green transition-colors"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {user ? (
            <>
              {/* Wishlist icon — only when logged in */}
              <Link to="/wishlist" className="relative text-stone-700 hover:text-brand-deep-green transition-colors">
                <Bookmark size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-deep-green text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart icon — only when logged in */}
              <Link to="/cart" className="relative text-stone-700 hover:text-brand-deep-green transition-colors">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-deep-green text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User profile dropdown */}
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-brand-deep-green text-white flex items-center justify-center font-bold hover:bg-opacity-90 transition-all">
                  {user.fullName?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || 'U'}
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-white shadow-lg rounded-lg border border-stone-100 py-2 w-48">
                    <p className="px-4 py-2 text-sm font-medium text-stone-700 truncate">
                      {user.fullName || user.name || 'User'}
                    </p>
                    <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-stone-50 transition-colors">My Orders</Link>
                    <Link to="/account" className="block px-4 py-2 text-sm hover:bg-stone-50 transition-colors">Account</Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('saksaas_user');
                        localStorage.removeItem('saksaas_token');
                        window.dispatchEvent(new Event('saksaas-logout'));
                        setUser(null);
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Not logged in — show only Login icon */
            <Link
              to="/login"
              className="flex items-center gap-2 bg-brand-deep-green text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-opacity-90 transition-all"
            >
              <User size={16} />
              Login
            </Link>
          )}

          <button
            className="lg:hidden text-stone-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-stone-100 p-4 z-40"
          >
            <form onSubmit={handleSearch} className="container mx-auto max-w-2xl relative">
              <input
                type="text"
                placeholder="Search for jewellery, collections..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-bg-green border border-stone-200 rounded-full px-12 py-3 focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20"
              />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-deep-green font-bold text-sm hover:underline">
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-stone-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-lg font-medium text-stone-700 hover:text-brand-deep-green"
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-brand-deep-green text-white px-6 py-3 rounded-full font-bold w-fit"
                >
                  <User size={16} />
                  Login / Register
                </Link>
              )}
              {user && (
                <>
                  <Link to="/wishlist" className="text-lg font-medium text-stone-700 hover:text-brand-deep-green">Wishlist</Link>
                  <Link to="/cart" className="text-lg font-medium text-stone-700 hover:text-brand-deep-green">Cart {totalItems > 0 && `(${totalItems})`}</Link>
                  <Link to="/orders" className="text-lg font-medium text-stone-700 hover:text-brand-deep-green">My Orders</Link>
                  <Link to="/account" className="text-lg font-medium text-stone-700 hover:text-brand-deep-green">Account</Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('saksaas_user');
                      localStorage.removeItem('saksaas_token');
                      window.dispatchEvent(new Event('saksaas-logout'));
                      setUser(null);
                      navigate('/');
                    }}
                    className="text-left text-lg font-medium text-red-500 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-serif font-bold tracking-widest text-white">
              SAKSAAS
            </Link>
            <p className="text-sm leading-relaxed">
              Handcrafting elegance since 2015. We bring you the finest artisan jewellery that celebrates Indian heritage with a contemporary soul.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-brand-light-green" />
                <span className="text-sm">123 Artisan Lane, Bangalore, Karnataka</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-brand-light-green" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-brand-light-green" />
                <span className="text-sm">hello@saksaas.com</span>
              </div>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-serif text-lg font-bold mb-6">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shipping-policy" className="hover:text-brand-light-green transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns-exchanges" className="hover:text-brand-light-green transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/order-tracking" className="hover:text-brand-light-green transition-colors">Order Tracking</Link></li>
              <li><Link to="/contact" className="hover:text-brand-light-green transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="text-white font-serif text-lg font-bold mb-6">My Account</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/login" className="hover:text-brand-light-green transition-colors">Login / Register</Link></li>
              <li><Link to="/orders" className="hover:text-brand-light-green transition-colors">My Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-brand-light-green transition-colors">Wishlist</Link></li>
              <li><Link to="/account" className="hover:text-brand-light-green transition-colors">Account Details</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white font-serif text-lg font-bold mb-6">Information</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-brand-light-green transition-colors">Our Story</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-brand-light-green transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-brand-light-green transition-colors">Terms of Service</Link></li>
              <div className="flex space-x-4 mt-6">
                <button className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brand-light-green hover:text-white transition-all">
                  <Instagram size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brand-light-green hover:text-white transition-all">
                  <Facebook size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brand-light-green hover:text-white transition-all">
                  <Twitter size={18} />
                </button>
              </div>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} SAKSAAS Artisan Jewellery. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const WhatsAppButton = () => (
  <a
    href="https://wa.me/919876543210"
    target="_blank"
    rel="noopener noreferrer"
    className="whatsapp-float"
  >
    <Phone size={24} />
  </a>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[72px]">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};