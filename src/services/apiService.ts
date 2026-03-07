import { User, Order, OrderItem, Product } from '../types';
import { products as mockProducts } from '../data';
import { shopProducts } from '../shopProducts';

const API_BASE_URL = 'http://localhost/saksaas/auth.php';

const getMockUser = (): User | null => {
  const stored = localStorage.getItem('saksaas_user');
  return stored ? JSON.parse(stored) : null;
};

export const apiService = {
  // --- AUTH ---
  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Login failed');

    localStorage.setItem('saksaas_token', 'session_active');
    localStorage.setItem('saksaas_user', JSON.stringify(data.user));
    window.dispatchEvent(new Event('saksaas-login'));
    return { token: 'session_active', user: data.user };
  },

  async signup(userData: { fullName: string; email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}?action=signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Signup failed');
    return data;
  },

  logout() {
    localStorage.removeItem('saksaas_token');
    localStorage.removeItem('saksaas_user');
    window.dispatchEvent(new Event('saksaas-logout'));
  },

  getCurrentUser(): User | null {
    return getMockUser();
  },

  // --- PROFILE ---
  async getProfile(): Promise<User> {
    const user = getMockUser();
    if (!user) throw new Error('Not logged in');
    const response = await fetch(`${API_BASE_URL}?action=getProfile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    });
    const data = await response.json();
    if (data.success) return data.user;
    return user;
  },

  async updateProfile(userData: Partial<User>) {
    const current = getMockUser();
    if (!current) throw new Error('User not found');
    
    const response = await fetch(`${API_BASE_URL}?action=updateProfile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userData, email: current.email }),
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    
    const updated = { ...current, ...userData };
    localStorage.setItem('saksaas_user', JSON.stringify(updated));
    return updated;
  },

  // ✅ FIXED: Upload Function
  async uploadProfileImage(email: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', file); // Sending as 'image'

    const response = await fetch(`${API_BASE_URL}?action=uploadImage`, {
      method: 'POST',
      body: formData, // No JSON headers here!
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message);

    // Update local storage so image displays immediately
    const current = getMockUser();
    if (current) {
        localStorage.setItem('saksaas_user', JSON.stringify({ ...current, profileImage: data.imageUrl }));
    }
    return data.imageUrl;
  },

  // ✅ FIXED: Missing changePassword Function
  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}?action=changePassword`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, currentPassword, newPassword }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return true;
  },

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    return [...shopProducts, ...mockProducts];
  },

  async getProductById(id: string): Promise<Product> {
    const p = [...shopProducts, ...mockProducts].find(item => item.id === id);
    if (!p) throw new Error('Product not found');
    return p;
  }
};