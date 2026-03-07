import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { Trash2, ShoppingBag, ArrowRight, ChevronLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="w-20 h-20 bg-brand-light-green rounded-full flex items-center justify-center mx-auto mb-8 text-brand-deep-green">
          <ShoppingBag size={40} />
        </div>
        <h1 className="text-4xl font-serif font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-stone-500 mb-10 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our beautiful collection and find something you love!
        </p>
        <Link to="/shop" className="inline-block bg-stone-900 text-white px-10 py-4 rounded-full font-bold hover:bg-brand-deep-green transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg-green min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold mb-12">Your Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <motion.div 
                key={`${item.id}-${item.selectedSize}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col sm:flex-row gap-6"
              >
                <div className="w-full sm:w-32 aspect-[4/5] rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow flex flex-col justify-between py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-stone-800 mb-1">{item.name}</h3>
                      <p className="text-sm text-stone-500 mb-2">Category: {item.category}</p>
                      {item.selectedSize && (
                        <span className="inline-block bg-brand-light-green text-brand-deep-green text-[10px] font-bold uppercase px-2 py-1 rounded">
                          Size: {item.selectedSize}
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-brand-deep-green text-xl">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center border border-stone-200 rounded-full p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-50"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            <Link to="/shop" className="inline-flex items-center gap-2 text-stone-500 hover:text-brand-deep-green font-medium transition-colors">
              <ChevronLeft size={18} />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
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
                onClick={() => navigate('/checkout')}
                className="w-full bg-stone-900 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-deep-green transition-all shadow-lg mb-6"
              >
                Checkout Now
                <ArrowRight size={20} />
              </button>

              <div className="bg-brand-light-green p-4 rounded-xl border border-brand-deep-green/10 flex items-center gap-3">
                <ShieldCheck className="text-brand-deep-green" size={24} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-deep-green">
                  100% Secure Checkout Guaranteed
                </p>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4 opacity-40 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
