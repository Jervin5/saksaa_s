import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Package, MapPin, CheckCircle } from 'lucide-react';

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    
    // Simulate API call
    setTimeout(() => {
      setTrackingResult({
        status: 'In Transit',
        lastUpdate: 'Arrived at Bangalore Hub',
        estimatedDelivery: 'March 15, 2026',
        steps: [
          { status: 'Order Placed', date: 'March 10, 2026', completed: true },
          { status: 'Processed', date: 'March 11, 2026', completed: true },
          { status: 'Shipped', date: 'March 12, 2026', completed: true },
          { status: 'In Transit', date: 'March 13, 2026', completed: false },
          { status: 'Out for Delivery', date: '-', completed: false },
          { status: 'Delivered', date: '-', completed: false },
        ]
      });
      setIsTracking(false);
    }, 1500);
  };

  return (
    <div className="bg-brand-bg-green min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-brand-deep-green text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            Track Your Order
          </motion.h1>
          <p className="text-brand-light-green/80 max-w-2xl mx-auto">
            Stay updated on your handcrafted jewellery's journey to you.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto">
          <form onSubmit={handleTrack} className="space-y-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Order Number</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. #SAK-12345"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full bg-brand-bg-green border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-bg-green border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20"
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={isTracking}
              className="w-full bg-brand-deep-green text-white font-bold py-4 rounded-xl hover:bg-brand-deep-green/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isTracking ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={20} />
                  Track Order
                </>
              )}
            </button>
          </form>

          {trackingResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-stone-100 pt-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-serif font-bold text-brand-deep-green">Order Status: {trackingResult.status}</h3>
                  <p className="text-sm text-stone-500">Last update: {trackingResult.lastUpdate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase text-stone-400">Est. Delivery</p>
                  <p className="font-bold text-brand-deep-green">{trackingResult.estimatedDelivery}</p>
                </div>
              </div>

              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-100">
                {trackingResult.steps.map((step: any, index: number) => (
                  <div key={index} className="flex gap-6 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${step.completed ? 'bg-brand-deep-green text-white' : 'bg-stone-100 text-stone-400'}`}>
                      {step.completed ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-current rounded-full" />}
                    </div>
                    <div>
                      <h4 className={`font-bold ${step.completed ? 'text-stone-900' : 'text-stone-400'}`}>{step.status}</h4>
                      <p className="text-sm text-stone-500">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
