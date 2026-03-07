import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Customise } from './pages/Customise';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { Orders } from './pages/Orders';
import { Wishlist } from './pages/Wishlist';
import { AccountDetails } from './pages/AccountDetails';
import { Checkout } from './pages/Checkout';
import { OrderDetail } from './pages/OrderDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsExchanges from './pages/ReturnsExchanges';
import OrderTracking from './pages/OrderTracking';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/"                  element={<Home />} />
              <Route path="/shop"              element={<Shop />} />
              <Route path="/product/:id"       element={<ProductDetail />} />
              <Route path="/customise"         element={<Customise />} />
              <Route path="/about"             element={<About />} />
              <Route path="/faqs"              element={<FAQ />} />
              <Route path="/contact"           element={<Contact />} />
              <Route path="/cart"              element={<Cart />} />
              <Route path="/login"             element={<Login />} />
              <Route path="/checkout"          element={<Checkout />} />
              <Route path="/orders"            element={<Orders />} />
              <Route path="/order/:id"         element={<OrderDetail />} />
              <Route path="/wishlist"          element={<Wishlist />} />
              <Route path="/account"           element={<AccountDetails />} />
              <Route path="/admin"             element={<AdminDashboard />} />
              <Route path="/shipping-policy"   element={<ShippingPolicy />} />
              <Route path="/returns-exchanges" element={<ReturnsExchanges />} />
              <Route path="/order-tracking"    element={<OrderTracking />} />
              <Route path="/privacy-policy"    element={<PrivacyPolicy />} />
              <Route path="/terms-of-service"  element={<TermsOfService />} />

              {/* Catch-all — any unknown URL shows 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}