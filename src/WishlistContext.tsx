import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './types';
import { apiService } from './services/apiService';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('saksaas_user'));

  // ── Sync from backend when user logs in ──────────────────────────────────
  const syncFromBackend = async () => {
    try {
      const items = await apiService.getWishlist();
      setWishlist(items);
      // Also persist locally as fallback
      localStorage.setItem('wishlist', JSON.stringify(items));
    } catch {
      // If not logged in or error, fall back to localStorage
      const saved = localStorage.getItem('wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    }
  };

  // ── On mount: load wishlist ───────────────────────────────────────────────
  useEffect(() => {
    if (isLoggedIn) {
      syncFromBackend();
    } else {
      // Guest: use localStorage
      const saved = localStorage.getItem('wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    }
  }, [isLoggedIn]);

  // ── Listen for login/logout events ───────────────────────────────────────
  useEffect(() => {
    const onLogin = () => {
      setIsLoggedIn(true);
      syncFromBackend();
    };
    const onLogout = () => {
      setIsLoggedIn(false);
      setWishlist([]);
      localStorage.removeItem('wishlist');
    };
    window.addEventListener('saksaas-login', onLogin);
    window.addEventListener('saksaas-logout', onLogout);
    return () => {
      window.removeEventListener('saksaas-login', onLogin);
      window.removeEventListener('saksaas-logout', onLogout);
    };
  }, []);

  // ── Save to localStorage whenever wishlist changes ────────────────────────
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    if (wishlist.find(item => item.id === product.id)) return;
    setWishlist(prev => [...prev, product]);
    // Sync to backend (fire-and-forget)
    if (isLoggedIn) {
      apiService.addToWishlist(product.id).catch(console.error);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
    if (isLoggedIn) {
      apiService.removeFromWishlist(productId).catch(console.error);
    }
  };

  const isInWishlist = (productId: string) => wishlist.some(item => item.id === productId);

  const toggleWishlist = (product: Product) => {
    isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};