import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, ShieldCheck, ArrowRight, ChevronLeft, MapPin, Truck } from 'lucide-react';
import { useCart } from '../CartContext';
import { apiService } from '../services/apiService';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    line1: '',
    city: '',
    pincode: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await apiService.getProfile();
        setAddress({
          fullName: profile.fullName,
          phone: profile.phone || '',
          line1: profile.addressLine1 || '',
          city: profile.city || '',
          pincode: profile.pincode || ''
        });
      } catch (err) {
        // Not logged in, that's fine, they can fill it manually
      }
    };
    fetchProfile();
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const shippingAddress = `${address.fullName}, ${address.line1}, ${address.city}, ${address.pincode}. Phone: ${address.phone}`;
      const orderData = {
        items: cart,
        totalAmount: totalPrice + (totalPrice > 1500 ? 0 : 100) + (totalPrice * 0.03),
        paymentMethod,
        shippingAddress
      };

      await apiService.createOrder(orderData);
      alert('Payment Successful! Your order has been placed.');
      clearCart();
      navigate('/orders');
    } catch (err) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg-green min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-stone-500 hover:text-brand-deep-green mb-8 font-medium transition-colors"
        >
          <ChevronLeft size={18} />
          Back to Cart
        </button>

        <h1 className="text-4xl font-serif font-bold mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-brand-deep-green" size={24} />
                <h2 className="text-2xl font-serif font-bold">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+91 98765 43210" 
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Address Line 1</label>
                  <input 
                    type="text" 
                    placeholder="House No, Building Name, Street" 
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-700">City</label>
                  <input 
                    type="text" 
                    placeholder="Bangalore" 
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Pincode</label>
                  <input 
                    type="text" 
                    placeholder="560001" 
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" 
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-brand-deep-green" size={24} />
                <h2 className="text-2xl font-serif font-bold">Payment Method</h2>
              </div>
              <div className="space-y-4">
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-brand-deep-green bg-brand-light-green/20' : 'border-stone-100 hover:border-stone-200'}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-brand-deep-green' : 'border-stone-300'}`}>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-brand-deep-green" />}
                  </div>
                  <span className="font-bold text-stone-800">Credit / Debit Card</span>
                </label>
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-brand-deep-green bg-brand-light-green/20' : 'border-stone-100 hover:border-stone-200'}`}>
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-brand-deep-green' : 'border-stone-300'}`}>
                    {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-brand-deep-green" />}
                  </div>
                  <span className="font-bold text-stone-800">UPI / Google Pay / PhonePe</span>
                </label>
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-deep-green bg-brand-light-green/20' : 'border-stone-100 hover:border-stone-200'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-brand-deep-green' : 'border-stone-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-brand-deep-green" />}
                  </div>
                  <span className="font-bold text-stone-800">Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-8 space-y-4 pt-8 border-t border-stone-100"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-700">CVV</label>
                      <input type="password" placeholder="•••" className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 sticky top-24">
              <h2 className="text-2xl font-serif font-bold mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">{totalPrice > 1500 ? 'FREE' : '₹100'}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Tax (GST 3%)</span>
                  <span>₹{(totalPrice * 0.03).toLocaleString()}</span>
                </div>
                <div className="border-t border-stone-100 pt-4 flex justify-between text-xl font-bold text-stone-900">
                  <span>Total</span>
                  <span className="text-brand-deep-green">₹{(totalPrice + (totalPrice > 1500 ? 0 : 100) + (totalPrice * 0.03)).toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={loading || !address.fullName || !address.line1 || !address.city || !address.pincode}
                className="w-full bg-stone-900 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-deep-green transition-all shadow-lg mb-6 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Pay Now'}
                <ArrowRight size={20} />
              </button>

              <div className="bg-brand-light-green p-4 rounded-xl border border-brand-deep-green/10 flex items-center gap-3">
                <ShieldCheck className="text-brand-deep-green" size={24} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-deep-green">
                  100% Secure Transaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
