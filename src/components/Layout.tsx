import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ChevronDown, Phone, Mail, MapPin, Instagram, Facebook, Twitter, Bookmark, Bell } from 'lucide-react';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/apiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

// ─── Notification Bell ────────────────────────────────────────────────────────
const NotificationBell = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [open, setOpen]                   = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const data = await apiService.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // not logged in or failed — ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds for new notifications
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Re-fetch when user logs in
  useEffect(() => {
    const onLogin = () => fetchNotifications();
    const onLogout = () => { setNotifications([]); setUnreadCount(0); };
    window.addEventListener('saksaas-login', onLogin);
    window.addEventListener('saksaas-logout', onLogout);
    return () => {
      window.removeEventListener('saksaas-login', onLogin);
      window.removeEventListener('saksaas-logout', onLogout);
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkRead = async (notif: any) => {
    if (!notif.IsRead) {
      await apiService.markNotificationRead(notif.NotificationID).catch(() => {});
      setNotifications(prev => prev.map(n => n.NotificationID === notif.NotificationID ? { ...n, IsRead: '1' } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    if (notif.LinkURL) {
      navigate(notif.LinkURL);
      setOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    await apiService.markAllRead().catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, IsRead: '1' })));
    setUnreadCount(0);
  };

  return (
    <div ref={ref} className="relative flex items-center">
      <button onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center text-stone-700 hover:text-brand-deep-green transition-colors">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead}
                  className="text-xs text-brand-deep-green hover:underline font-medium">
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-stone-400">
                  <Bell size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div key={notif.NotificationID}
                    onClick={() => handleMarkRead(notif)}
                    className={`px-4 py-3 border-b border-stone-50 cursor-pointer hover:bg-stone-50 transition-colors ${!notif.IsRead || notif.IsRead === '0' ? 'bg-brand-bg-green' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notif.IsRead || notif.IsRead === '0' ? 'bg-brand-deep-green' : 'bg-transparent'}`} />
                      <div>
                        <p className="text-sm font-bold text-stone-800 leading-tight">{notif.Title}</p>
                        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{notif.Message}</p>
                        <p className="text-[10px] text-stone-300 mt-1">
                          {new Date(notif.CreatedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-stone-100 text-center">
                <Link to="/orders" onClick={() => setOpen(false)}
                  className="text-xs text-brand-deep-green hover:underline font-medium">
                  View all orders →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setMobileMenu]   = useState(false);
  const [isSearchOpen, setSearchOpen]       = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');
  const { totalItems } = useCart();
  const { wishlist }   = useWishlist();
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fromStorage = () => {
      const raw = localStorage.getItem('saksaas_user');
      setUser(raw ? JSON.parse(raw) : null);
    };
    fromStorage();
    window.addEventListener('storage', fromStorage);
    window.addEventListener('saksaas-login', fromStorage);
    window.addEventListener('saksaas-logout', () => setUser(null));
    return () => {
      window.removeEventListener('storage', fromStorage);
      window.removeEventListener('saksaas-login', fromStorage);
      window.removeEventListener('saksaas-logout', () => setUser(null));
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenu(false);
    setSearchOpen(false);
    const raw = localStorage.getItem('saksaas_user');
    setUser(raw ? JSON.parse(raw) : null);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home',              path: '/' },
    { name: 'Shop',              path: '/shop', hasMegaMenu: true },
    { name: 'Customise Your Set', path: '/customise' },
    { name: 'About Us',          path: '/about' },
    { name: 'FAQs',              path: '/faqs' },
    { name: 'Contact Us',        path: '/contact' },
  ];

  return (
    <header className={cn(
      'fixed top-0 left-0 w-full z-50 transition-all duration-300',
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-bold tracking-widest text-brand-deep-green">
          SAKSAA'S
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map(link => (
            <div key={link.name} className="relative group">
              <Link to={link.path}
                className={cn(
                  'text-sm font-medium uppercase tracking-wider hover:text-brand-deep-green transition-colors flex items-center gap-1',
                  location.pathname === link.path ? 'text-brand-deep-green' : 'text-stone-700'
                )}>
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
                        <li><Link to="/shop?filter=trending"   className="text-sm hover:text-brand-deep-green">Trending</Link></li>
                        <li><Link to="/shop?filter=new"        className="text-sm hover:text-brand-deep-green">New Arrivals</Link></li>
                        <li><Link to="/shop?filter=under500"   className="text-sm hover:text-brand-deep-green">Under ₹500</Link></li>
                      </ul>
                    </div>
                    <div className="bg-brand-light-green p-4 rounded-md">
                      <img src="https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=300"
                        alt="Promo" className="rounded mb-2 w-full h-32 object-cover" />
                      <p className="text-xs font-medium text-brand-deep-green">Handmade with Love</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <button onClick={() => setSearchOpen(!isSearchOpen)}
            className="text-stone-700 hover:text-brand-deep-green transition-colors">
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {user ? (
            <>
              {/* Notification bell — only shown when logged in */}
              <NotificationBell />

              <Link to="/wishlist" className="relative text-stone-700 hover:text-brand-deep-green transition-colors">
                <Bookmark size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-deep-green text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative text-stone-700 hover:text-brand-deep-green transition-colors">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-deep-green text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <div className="relative group">
                <button className="w-10 h-10 rounded-full overflow-hidden bg-brand-deep-green text-white flex items-center justify-center font-bold hover:bg-opacity-90 transition-all ring-2 ring-transparent hover:ring-brand-deep-green/30">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost/saksaas${user.profileImage}`}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user.fullName?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-white shadow-lg rounded-lg border border-stone-100 py-2 w-48">
                    <p className="px-4 py-2 text-sm font-medium text-stone-700 truncate">{user.fullName}</p>
                    <Link to="/orders"  className="block px-4 py-2 text-sm hover:bg-stone-50 transition-colors">My Orders</Link>
                    <Link to="/account" className="block px-4 py-2 text-sm hover:bg-stone-50 transition-colors">Account</Link>
                    {user.role === 'Admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-brand-deep-green font-bold hover:bg-brand-light-green transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login"
              className="flex items-center gap-2 bg-brand-deep-green text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-opacity-90 transition-all">
              <User size={16} /> Login
            </Link>
          )}

          <button className="lg:hidden text-stone-700" onClick={() => setMobileMenu(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-stone-100 p-4 z-40">
            <form onSubmit={handleSearch} className="container mx-auto max-w-2xl relative">
              <input type="text" placeholder="Search for jewellery, collections..." autoFocus
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-brand-bg-green border border-stone-200 rounded-full px-12 py-3 focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-deep-green font-bold text-sm hover:underline">
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-t border-stone-100 overflow-hidden">
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              {navLinks.map(link => (
                <Link key={link.name} to={link.path}
                  className="text-lg font-medium text-stone-700 hover:text-brand-deep-green">{link.name}</Link>
              ))}
              {!user ? (
                <Link to="/login"
                  className="inline-flex items-center gap-2 bg-brand-deep-green text-white px-6 py-3 rounded-full font-bold w-fit">
                  <User size={16} /> Login / Register
                </Link>
              ) : (
                <>
                  <Link to="/wishlist" className="text-lg font-medium text-stone-700 hover:text-brand-deep-green">
                    Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                  </Link>
                  <Link to="/cart" className="text-lg font-medium text-stone-700 hover:text-brand-deep-green">
                    Cart {totalItems > 0 && `(${totalItems})`}
                  </Link>
                  <Link to="/orders"  className="text-lg font-medium text-stone-700 hover:text-brand-deep-green">My Orders</Link>
                  <Link to="/account" className="text-lg font-medium text-stone-700 hover:text-brand-deep-green">Account</Link>
                  {user.role === 'Admin' && (
                    <Link to="/admin" className="text-lg font-medium text-brand-deep-green font-bold">Admin Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="text-left text-lg font-medium text-red-500">Logout</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="bg-stone-900 text-stone-300 pt-16 pb-8">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="space-y-6">
          <Link to="/" className="text-2xl font-serif font-bold tracking-widest text-white">SAKSAAS</Link>
          <p className="text-sm leading-relaxed">Handcrafting elegance since 2015. We bring you the finest artisan jewellery that celebrates Indian heritage.</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3"><MapPin size={18} className="text-brand-light-green" /><span className="text-sm">123 Artisan Lane, Bangalore, Karnataka</span></div>
            <div className="flex items-center gap-3"><Phone size={18} className="text-brand-light-green" /><span className="text-sm">+91 98765 43210</span></div>
            <div className="flex items-center gap-3"><Mail size={18} className="text-brand-light-green" /><span className="text-sm">hello@saksaas.com</span></div>
          </div>
        </div>
        <div>
          <h4 className="text-white font-serif text-lg font-bold mb-6">Customer Service</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/shipping-policy"   className="hover:text-brand-light-green transition-colors">Shipping Policy</Link></li>
            <li><Link to="/returns-exchanges" className="hover:text-brand-light-green transition-colors">Returns & Exchanges</Link></li>
            <li><Link to="/order-tracking"    className="hover:text-brand-light-green transition-colors">Order Tracking</Link></li>
            <li><Link to="/contact"           className="hover:text-brand-light-green transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-serif text-lg font-bold mb-6">My Account</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/login"    className="hover:text-brand-light-green transition-colors">Login / Register</Link></li>
            <li><Link to="/orders"   className="hover:text-brand-light-green transition-colors">My Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-brand-light-green transition-colors">Wishlist</Link></li>
            <li><Link to="/account" className="hover:text-brand-light-green transition-colors">Account Details</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-serif text-lg font-bold mb-6">Information</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about"          className="hover:text-brand-light-green transition-colors">Our Story</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-brand-light-green transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="hover:text-brand-light-green transition-colors">Terms of Service</Link></li>
            <div className="flex space-x-4 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brand-light-green hover:text-white transition-all">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-stone-500">© {new Date().getFullYear()} SAKSAAS Artisan Jewellery. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale" />
        </div>
      </div>
    </div>
  </footer>
);

// ─── WhatsApp float ───────────────────────────────────────────────────────────
const WhatsAppButton = () => (
  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="whatsapp-float">
    <Phone size={24} />
  </a>
);

// ─── Layout ───────────────────────────────────────────────────────────────────
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <ScrollToTop />
    <Navbar />
    <main className="flex-grow pt-[72px]">{children}</main>
    <Footer />
    <WhatsAppButton />
  </div>
);