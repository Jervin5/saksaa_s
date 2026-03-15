/**
 * ============================================================================
 *  SAKSAAS — Complete API Service
 *  All calls go to a single PHP file: auth.php?action=<action>
 *  Frontend → Backend mapping documented on every method
 * ============================================================================
 */

import { User, Order, OrderItem, Product } from '../types';

const API_BASE = 'http://localhost/saksaas/auth.php';

// ─── helpers ─────────────────────────────────────────────────────────────────

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('saksaas_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** POST with JSON body */
async function post<T = any>(action: string, body: object): Promise<T> {
  const res = await fetch(`${API_BASE}?action=${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || `${action} failed`);
  return data;
}

/** POST with FormData (multipart — for file uploads) */
async function postForm<T = any>(action: string, form: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}?action=${action}`, {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || `${action} failed`);
  return data;
}

/** GET with optional query params */
async function get<T = any>(action: string, params: Record<string, string> = {}): Promise<T> {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${API_BASE}?${qs}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || `${action} failed`);
  return data;
}

// ============================================================================
export const apiService = {

  // ═══════════════════════════════════════════════════════════════
  //  AUTH
  //  Used in: Login.tsx
  // ═══════════════════════════════════════════════════════════════

  /** Login → stores user in localStorage, fires 'saksaas-login' event */
  async login(credentials: { email: string; password: string }) {
    const data = await post('login', credentials);
    localStorage.setItem('saksaas_token', 'session_active');
    localStorage.setItem('saksaas_user', JSON.stringify(data.user));
    window.dispatchEvent(new Event('saksaas-login'));
    return { token: 'session_active', user: data.user as User };
  },

  /** Signup → creates account (does NOT auto-login) */
  async signup(userData: { fullName: string; email: string; password: string }) {
    return post('signup', userData);
  },

  /** Logout → clears localStorage, fires 'saksaas-logout' event */
  logout() {
    localStorage.removeItem('saksaas_token');
    localStorage.removeItem('saksaas_user');
    window.dispatchEvent(new Event('saksaas-logout'));
  },

  /** Returns currently logged-in user from localStorage (no API call) */
  getCurrentUser(): User | null {
    return getStoredUser();
  },

  // ═══════════════════════════════════════════════════════════════
  //  PROFILE
  //  Used in: AccountDetails.tsx, Checkout.tsx
  // ═══════════════════════════════════════════════════════════════

  /** Fetch fresh profile from DB — used on AccountDetails load & Checkout auto-fill */
  async getProfile(): Promise<User> {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    const data = await post<{ user: User }>('getProfile', { email: user.email });
    return data.user;
  },

  /** Save updated profile fields — used on AccountDetails save button */
  async updateProfile(userData: Partial<User>) {
    const current = getStoredUser();
    if (!current) throw new Error('Not logged in');
    const data = await post('updateProfile', { ...userData, email: current.email });
    const updated = { ...current, ...userData };
    localStorage.setItem('saksaas_user', JSON.stringify(updated));
    return updated;
  },

  /** Upload profile photo — used in AccountDetails image upload button */
  async uploadProfileImage(email: string, file: File): Promise<string> {
    const form = new FormData();
    form.append('email', email);
    form.append('image', file);
    const data = await postForm<{ imageUrl: string }>('uploadImage', form);
    const current = getStoredUser();
    if (current) {
      localStorage.setItem('saksaas_user', JSON.stringify({ ...current, profileImage: data.imageUrl }));
    }
    return data.imageUrl;
  },

  /** Change password — used in AccountDetails security tab */
  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<boolean> {
    await post('changePassword', { email, currentPassword, newPassword });
    return true;
  },

  // ═══════════════════════════════════════════════════════════════
  //  CATEGORIES  (public)
  //  Used in: Shop.tsx filter sidebar
  // ═══════════════════════════════════════════════════════════════

  /** Fetch all categories with sub-categories — used in Shop.tsx filter chips */
  async getCategories() {
    const data = await get<{ categories: any[] }>('getCategories');
    return data.categories;
  },

  // ═══════════════════════════════════════════════════════════════
  //  PRODUCTS  (public)
  //  Used in: Home.tsx, Shop.tsx, ProductDetail.tsx
  // ═══════════════════════════════════════════════════════════════

  /**
   * Fetch products with optional filters.
   * Params: category, sub, search, sort, trending, newArrival, topSelling, under500
   * Used in: Home.tsx (trending/new/topSelling sections), Shop.tsx grid
   */
  async getProducts(params: Record<string, string> = {}): Promise<Product[]> {
    const data = await get<{ products: Product[] }>('getProducts', params);
    return data.products;
  },

  /** Fetch single product by ID — used in ProductDetail.tsx */
  async getProductById(id: string): Promise<Product> {
    const data = await get<{ product: Product }>('getProductById', { id });
    return data.product;
  },

  // ═══════════════════════════════════════════════════════════════
  //  ORDERS
  //  Used in: Checkout.tsx (COD), Orders.tsx, OrderDetail.tsx
  // ═══════════════════════════════════════════════════════════════

  /**
   * Create an order directly (COD only).
   * Card/UPI orders go through createRazorpayOrder + verifyPayment instead.
   * Used in: Checkout.tsx when paymentMethod === 'cod'
   */
  async createOrder(orderData: {
    items: any[];
    totalAmount: number;
    paymentMethod: string;
    shippingAddress: string;
  }) {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    return post('createOrder', { ...orderData, email: user.email });
  },

  /** Fetch all orders for current user — used in Orders.tsx list */
  async getOrders(): Promise<Order[]> {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    const data = await post<{ orders: Order[] }>('getOrders', { email: user.email });
    return data.orders;
  },

  /**
   * Fetch a single order with items + tracking history.
   * Used in: OrderDetail.tsx
   */
  async getOrderById(orderId: string | number): Promise<Order & { items: OrderItem[]; tracking: any[] }> {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    const data = await post<{ order: Order; items: OrderItem[]; tracking: any[] }>(
      'getOrderById',
      { email: user.email, orderId: Number(orderId) }
    );
    // Merge order + items into one object for backward compatibility with OrderDetail.tsx
    return { ...data.order, items: data.items, tracking: data.tracking } as any;
  },

  /**
   * Cancel an order (only if status = 'Processing').
   * Used in: Orders.tsx cancel button
   */
  async cancelOrder(orderId: number): Promise<void> {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    await post('cancelOrder', { email: user.email, orderId });
  },

  // ═══════════════════════════════════════════════════════════════
  //  ORDER TRACKING  (public)
  //  Used in: OrderTracking.tsx search form
  // ═══════════════════════════════════════════════════════════════

  /**
   * Look up an order by order number + email.
   * Returns the order, full tracking timeline, and estimated delivery date.
   * Used in: OrderTracking.tsx
   */
  async getTrackingByNumber(orderNumber: string, email: string) {
    return post('getTrackingByNumber', { orderNumber, email });
  },

  // ═══════════════════════════════════════════════════════════════
  //  WISHLIST
  //  Used in: Wishlist.tsx, WishlistContext.tsx, ProductCard.tsx
  // ═══════════════════════════════════════════════════════════════

  /** Fetch all wishlist items for current user from DB */
  async getWishlist(): Promise<Product[]> {
    const user = getStoredUser();
    if (!user) return [];
    const data = await post<{ wishlist: Product[] }>('getWishlist', { email: user.email });
    return data.wishlist;
  },

  /** Add product to wishlist in DB */
  async addToWishlist(productId: string | number): Promise<void> {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    await post('addToWishlist', { email: user.email, productId: Number(productId) });
  },

  /** Remove product from wishlist in DB */
  async removeFromWishlist(productId: string | number): Promise<void> {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    await post('removeFromWishlist', { email: user.email, productId: Number(productId) });
  },

  // ═══════════════════════════════════════════════════════════════
  //  NOTIFICATIONS
  //  Used in: Layout.tsx notification bell
  // ═══════════════════════════════════════════════════════════════

  /** Fetch notifications + unread count — used in Layout.tsx bell icon */
  async getNotifications() {
    const user = getStoredUser();
    if (!user) return { notifications: [], unreadCount: 0 };
    return post('getNotifications', { email: user.email });
  },

  /** Mark a single notification as read — used when user clicks a notification */
  async markNotificationRead(notificationId: number): Promise<void> {
    const user = getStoredUser();
    if (!user) return;
    await post('markNotificationRead', { email: user.email, notificationId });
  },

  /** Mark all notifications as read — used in "Mark all read" button */
  async markAllRead(): Promise<void> {
    const user = getStoredUser();
    if (!user) return;
    await post('markAllRead', { email: user.email });
  },

  // ═══════════════════════════════════════════════════════════════
  //  CUSTOM REQUESTS
  //  Used in: Customise.tsx, AccountDetails.tsx
  // ═══════════════════════════════════════════════════════════════

  /**
   * Submit a customisation request with optional outfit image.
   * Used in: Customise.tsx form submit button
   */
  async submitCustomRequest(requestData: {
    occasion: string;
    budgetRange: string;
    preferences: string;
    outfitImage?: File | null;
  }) {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    const form = new FormData();
    form.append('email', user.email);
    form.append('occasion', requestData.occasion);
    form.append('budgetRange', requestData.budgetRange);
    form.append('preferences', requestData.preferences);
    if (requestData.outfitImage) {
      form.append('outfitImage', requestData.outfitImage);
    }
    return postForm('submitCustomRequest', form);
  },

  /** Fetch user's own custom requests — used in AccountDetails.tsx */
  async getMyCustomRequests() {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    const data = await post<{ requests: any[] }>('getMyCustomRequests', { email: user.email });
    return data.requests;
  },

  // ═══════════════════════════════════════════════════════════════
  //  PAYMENT — RAZORPAY
  //  Used in: Checkout.tsx (card / UPI flow)
  // ═══════════════════════════════════════════════════════════════

  /**
   * Step 1: Create a Razorpay order on backend.
   * PHP saves a PENDING order in DB, calls Razorpay API, returns razorpay_order_id.
   * Used in: Checkout.tsx before opening Razorpay popup
   */
  async createRazorpayOrder(orderData: {
    amount: number;
    shippingAddress: string;
    items: any[];
    paymentMethod: string;
  }) {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    return post('createRazorpayOrder', { ...orderData, email: user.email });
  },

  /**
   * Step 2: Verify Razorpay payment signature after customer pays.
   * PHP checks HMAC-SHA256 signature → marks order as Processing.
   * Used in: Checkout.tsx Razorpay popup handler() callback
   */
  async verifyPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    internalOrderId: number;
  }) {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    return post('verifyPayment', { ...paymentData, email: user.email });
  },

  // ═══════════════════════════════════════════════════════════════
  //  ADMIN
  //  Used in: AdminDashboard.tsx
  // ═══════════════════════════════════════════════════════════════

  /** Dashboard stats — used in AdminDashboard.tsx top stats cards */
  async adminGetDashboardStats() {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    return post('adminGetDashboardStats', { email: user.email });
  },

  /** All orders — used in AdminDashboard.tsx orders tab */
  async adminGetAllOrders() {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    const data = await post<{ orders: any[] }>('adminGetAllOrders', { email: user.email });
    return data.orders;
  },

  /** Update order status — used in AdminDashboard.tsx status dropdown */
  async adminUpdateOrderStatus(orderId: number, status: string, location?: string, trackingNumber?: string) {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    return post('adminUpdateOrderStatus', {
      email: user.email, orderId, status, location: location || '', trackingNumber: trackingNumber || ''
    });
  },

  /** All users list — used in AdminDashboard.tsx users tab */
  async adminGetAllUsers() {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    const data = await post<{ users: any[] }>('adminGetAllUsers', { email: user.email });
    return data.users;
  },

  /**
   * Add a new product with image upload.
   * Used in: AdminDashboard.tsx add product form
   */
  async adminAddProduct(productData: {
    name: string; description: string; price: number;
    categoryId: number; subCategoryId?: number; stockQty: number;
    isTrending: number; isTopSelling: number; isNewArrival: number; isUnder500: number;
    sizes: string; image: File; extraImages?: File[];
  }) {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    const form = new FormData();
    form.append('email', user.email);
    Object.entries(productData).forEach(([k, v]) => {
      if (k === 'image') { form.append('image', v as File); }
      else if (k === 'extraImages') { (v as File[]).forEach(f => form.append('extraImages[]', f)); }
      else { form.append(k, String(v)); }
    });
    return postForm('adminAddProduct', form);
  },

  /** Edit product details — used in AdminDashboard.tsx edit modal */
  async adminUpdateProduct(productData: {
    productId: number; name: string; description: string; price: number;
    categoryId: number; subCategoryId?: number; stockQty: number;
    isTrending: number; isTopSelling: number; isNewArrival: number; isUnder500: number;
  }) {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    return post('adminUpdateProduct', { ...productData, email: user.email });
  },

  /** Delete product — used in AdminDashboard.tsx delete button */
  async adminDeleteProduct(productId: number) {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    return post('adminDeleteProduct', { email: user.email, productId });
  },

  /** Get product by ID (admin version with gallery IDs) — used in AdminDashboard.tsx edit form */
  async adminGetProductById(productId: number) {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    const data = await post<{ product: any }>('adminGetProductById', { email: user.email, productId });
    return data.product;
  },

  /** All custom requests — used in AdminDashboard.tsx custom requests tab */
  async adminGetCustomRequests() {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    const data = await post<{ requests: any[] }>('adminGetCustomRequests', { email: user.email });
    return data.requests;
  },

  /** Update custom request status — used in AdminDashboard.tsx */
  async adminUpdateCustomRequestStatus(requestId: number, status: string, adminNotes?: string) {
    const user = getStoredUser();
    if (!user) throw new Error('Not logged in');
    return post('adminUpdateCustomRequestStatus', {
      email: user.email, requestId, status, adminNotes: adminNotes || ''
    });
  },
};