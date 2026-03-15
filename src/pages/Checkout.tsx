import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, ShieldCheck, ArrowRight, ChevronLeft, MapPin } from 'lucide-react';
import { useCart } from '../CartContext';
import { apiService } from '../services/apiService';

// ─── Razorpay loaded via <script src="https://checkout.razorpay.com/v1/checkout.js"> in index.html
declare const window: any;

const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_ID'; // ← replace with your Key ID from razorpay.com

export const Checkout = () => {
  const navigate  = useNavigate();
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: '', phone: '', line1: '', city: '', pincode: ''
  });

  // Pre-fill address from user profile
  useEffect(() => {
    const prefill = async () => {
      try {
        const profile = await apiService.getProfile();
        setAddress({
          fullName: profile.fullName      || '',
          phone:    profile.phone         || '',
          line1:    profile.addressLine1  || '',
          city:     profile.city          || '',
          pincode:  profile.pincode       || '',
        });
      } catch {
        // not logged in or no profile — user fills manually
      }
    };
    prefill();
  }, []);

  const shippingFee  = totalPrice > 1500 ? 0 : 100;
  const gst          = totalPrice * 0.03;
  const finalAmount  = totalPrice + shippingFee + gst;
  const isFormValid  = address.fullName && address.line1 && address.city && address.pincode;

  const shippingAddress = `${address.fullName}, ${address.line1}, ${address.city}, ${address.pincode}. Phone: ${address.phone}`;

  // Shared item shape for both createOrder and createRazorpayOrder
  const orderItems = cart.map(item => ({
    productId:    item.id,
    id:           item.id,
    name:         item.name,
    image:        item.image,
    imageURL:     item.image,
    price:        item.price,
    quantity:     item.quantity,
    qty:          item.quantity,
    selectedSize: item.selectedSize,
    size:         item.selectedSize,
  }));

  // ── COD: direct createOrder ───────────────────────────────────────────────
  const handleCOD = async () => {
    setLoading(true);
    try {
      await apiService.createOrder({
        items:           orderItems,
        totalAmount:     finalAmount,
        paymentMethod:   'cod',
        shippingAddress,
      });
      clearCart();
      navigate('/orders');
    } catch (err: any) {
      alert(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Card / UPI: Razorpay flow ─────────────────────────────────────────────
  // const handleRazorpay = async () => {
  //   setLoading(true);
  //   try {
  //     const user = apiService.getCurrentUser();
  //     if (!user) { navigate('/login'); return; }

  //     // Step 1: Create a Razorpay order on backend → get razorpayOrderId
  //     const rzpRes = await apiService.createRazorpayOrder({
  //       amount:          finalAmount,
  //       shippingAddress,
  //       items:           orderItems,
  //       paymentMethod,
  //     });

  //     if (!rzpRes.success) throw new Error(rzpRes.message);

  //     // Step 2: Open the Razorpay popup
  //     const options = {
  //       key:         RAZORPAY_KEY_ID,
  //       amount:      rzpRes.amount,         // in paise
  //       currency:    'INR',
  //       name:        'SAKSAAS',
  //       description: 'Handcrafted Jewellery',
  //       order_id:    rzpRes.razorpayOrderId,
  //       prefill: {
  //         name:    address.fullName,
  //         email:   user.email,
  //         contact: address.phone,
  //       },
  //       theme: { color: '#166534' },

  //       // Step 3: After successful payment, verify on backend
  //       handler: async (response: any) => {
  //         try {
  //           const verifyRes = await apiService.verifyPayment({
  //             razorpay_order_id:   response.razorpay_order_id,
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_signature:  response.razorpay_signature,
  //             internalOrderId:     rzpRes.internalOrderId,
  //           });
  //           if (verifyRes.success) {
  //             clearCart();
  //             navigate('/orders');
  //           } else {
  //             alert('Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
  //           }
  //         } catch (err: any) {
  //           alert('Payment received but order confirmation failed. Contact support.');
  //         }
  //       },
  //       modal: {
  //         ondismiss: () => {
  //           setLoading(false);
  //           alert('Payment cancelled. Your cart is still saved.');
  //         },
  //       },
  //     };

  //     const rzp = new window.Razorpay(options);
  //     rzp.on('payment.failed', (response: any) => {
  //       setLoading(false);
  //       alert(`Payment failed: ${response.error.description}`);
  //     });
  //     rzp.open();

  //   } catch (err: any) {
  //     alert(err.message || 'Payment setup failed. Please try again.');
  //     setLoading(false);
  //   }
  // };

 const handleRazorpay = async () => {
  setLoading(true);
  try {
    const user = apiService.getCurrentUser();
    if (!user) { navigate('/login'); return; }

    // 1. Create the order (Added isMockTest here)
    const rzpRes = await apiService.createRazorpayOrder({
      amount: finalAmount,
      shippingAddress,
      items: orderItems,
      paymentMethod,
      // @ts-ignore
      isMockTest: true // This tells PHP "Don't call real Razorpay"
    });

    if (!rzpRes.success) throw new Error(rzpRes.message);

    // 2. SIMULATION: Wait 2 seconds
    console.log("Simulating payment gateway...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Call Verify API
    const verifyRes = await apiService.verifyPayment({
      razorpay_order_id:   rzpRes.razorpayOrderId,
      razorpay_payment_id: "mock_payment_" + Date.now(),
      razorpay_signature:  "mock_signature",
      internalOrderId:     rzpRes.internalOrderId,
      // @ts-ignore
      isMockTest:          true 
    });

    if (verifyRes.success) {
      alert("Payment Successful (Simulated)!");
      clearCart();
      navigate('/orders'); 
    } else {
      throw new Error("Simulation failed");
    }

  } catch (err: any) {
    console.error("Payment Error:", err);
    alert(err.message || 'Payment setup failed.');
  } finally {
    setLoading(false);
  }
};

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    paymentMethod === 'cod' ? handleCOD() : handleRazorpay();
  };

  return (
    <div className="bg-brand-bg-green min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <button onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-stone-500 hover:text-brand-deep-green mb-8 font-medium transition-colors">
          <ChevronLeft size={18} /> Back to Cart
        </button>

        <h1 className="text-4xl font-serif font-bold mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <form onSubmit={handlePayment} className="lg:col-span-2 space-y-8">

            {/* Shipping Address */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-brand-deep-green" size={24} />
                <h2 className="text-2xl font-serif font-bold">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Full Name</label>
                  <input type="text" placeholder="John Doe" required value={address.fullName}
                    onChange={e => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Phone</label>
                  <input type="tel" placeholder="+91 98765 43210" value={address.phone}
                    onChange={e => setAddress({ ...address, phone: e.target.value })}
                    className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Address Line 1</label>
                  <input type="text" placeholder="House No, Building, Street" required value={address.line1}
                    onChange={e => setAddress({ ...address, line1: e.target.value })}
                    className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-700">City</label>
                  <input type="text" placeholder="Bangalore" required value={address.city}
                    onChange={e => setAddress({ ...address, city: e.target.value })}
                    className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Pincode</label>
                  <input type="text" placeholder="560001" required value={address.pincode}
                    onChange={e => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" />
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
                {[
                  { value: 'card', label: 'Credit / Debit Card' },
                  { value: 'upi',  label: 'UPI / Google Pay / PhonePe' },
                  { value: 'cod',  label: 'Cash on Delivery' },
                ].map(({ value, label }) => (
                  <label key={value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === value ? 'border-brand-deep-green bg-brand-light-green/20' : 'border-stone-100 hover:border-stone-200'}`}>
                    <input type="radio" name="payment" value={value} checked={paymentMethod === value}
                      onChange={e => setPaymentMethod(e.target.value)} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === value ? 'border-brand-deep-green' : 'border-stone-300'}`}>
                      {paymentMethod === value && <div className="w-2.5 h-2.5 rounded-full bg-brand-deep-green" />}
                    </div>
                    <span className="font-bold text-stone-800">{label}</span>
                  </label>
                ))}
              </div>

              {/* Razorpay note for card/UPI */}
              {paymentMethod !== 'cod' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-stone-100">
                  <div className="bg-brand-light-green p-4 rounded-xl border border-brand-deep-green/10 flex items-center gap-3">
                    <ShieldCheck className="text-brand-deep-green flex-shrink-0" size={20} />
                    <p className="text-xs text-brand-deep-green font-medium">
                      Secure payment powered by Razorpay. You'll be redirected to a secure payment page.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-4 opacity-50 grayscale">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo.svg" alt="GPay" className="h-5" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-3" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Mobile submit button */}
            <div className="lg:hidden">
              <button type="submit" disabled={loading || !isFormValid}
                className="w-full bg-stone-900 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-deep-green transition-all shadow-lg disabled:opacity-50">
                {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                <ArrowRight size={20} />
              </button>
            </div>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 sticky top-24">
              <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>

              {/* Cart items preview */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {cart.map(item => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg flex-shrink-0" referrerPolicy="no-referrer" />
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                      {item.selectedSize && <p className="text-xs text-stone-400">Size: {item.selectedSize}</p>}
                      <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-brand-deep-green flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8 border-t border-stone-100 pt-4">
                <div className="flex justify-between text-stone-600 text-sm">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600 text-sm">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? 'text-emerald-600 font-medium' : ''}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 text-sm">
                  <span>Tax (GST 3%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="border-t border-stone-100 pt-3 flex justify-between text-xl font-bold text-stone-900">
                  <span>Total</span>
                  <span className="text-brand-deep-green">₹{finalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment as any}
                disabled={loading || !isFormValid}
                className="hidden lg:flex w-full bg-stone-900 text-white py-4 rounded-full font-bold items-center justify-center gap-2 hover:bg-brand-deep-green transition-all shadow-lg mb-6 disabled:opacity-50">
                {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                <ArrowRight size={20} />
              </button>

              <div className="bg-brand-light-green p-4 rounded-xl border border-brand-deep-green/10 flex items-center gap-3">
                <ShieldCheck className="text-brand-deep-green flex-shrink-0" size={24} />
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
