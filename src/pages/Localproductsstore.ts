import { Product } from '../types';

const KEY = 'saksaas_admin_products';

// ── READ ──────────────────────────────────────────────
export const getLocalProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
};

// ── SAVE ──────────────────────────────────────────────
export const saveLocalProduct = (product: Product): boolean => {
  try {
    const existing = getLocalProducts();
    const updated = [...existing, product];
    localStorage.setItem(KEY, JSON.stringify(updated));
    console.log('✅ Saved to localStorage. Total products:', updated.length);
    return true;
  } catch (err) {
    console.error('❌ localStorage save failed:', err);
    return false;
  }
};

// ── UPDATE ────────────────────────────────────────────
export const updateLocalProduct = (id: string, changes: Partial<Product>): void => {
  try {
    const existing = getLocalProducts();
    const updated = existing.map(p => p.id === id ? { ...p, ...changes } : p);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('❌ localStorage update failed:', err);
  }
};

// ── DELETE ────────────────────────────────────────────
export const deleteLocalProduct = (id: string): void => {
  try {
    const existing = getLocalProducts();
    localStorage.setItem(KEY, JSON.stringify(existing.filter(p => p.id !== id)));
  } catch (err) {
    console.error('❌ localStorage delete failed:', err);
  }
};

// ── IMAGE COMPRESSION ────────────────────────────────
// Compresses image to max 500px wide at 70% quality → ~60-100KB
export const compressImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX_SIZE = 500;
        let { width, height } = img;

        // Scale down if too large
        if (width > MAX_SIZE || height > MAX_SIZE) {
          const ratio = Math.min(MAX_SIZE / width, MAX_SIZE / height);
          width  = Math.round(width  * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }

        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', 0.7);
        console.log('🖼 Compressed image size:', Math.round(base64.length / 1024), 'KB');
        resolve(base64);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });