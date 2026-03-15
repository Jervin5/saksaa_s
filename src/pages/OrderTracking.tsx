import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Package, CheckCircle, Truck, Clock } from 'lucide-react';
import { apiService } from '../services/apiService';

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [result, setResult]           = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await apiService.getTrackingByNumber(orderNumber.replace('#', '').trim(), email.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'No order found. Please check your order number and email.');
    } finally {
      setLoading(false);
    }
  };

  // Map backend status to ordered steps for the timeline
  const buildSteps = (currentStatus: string, tracking: any[]) => {
    const statusOrder = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const cancelledStatuses = ['Cancelled'];

    if (cancelledStatuses.includes(currentStatus)) {
      return tracking.map(t => ({ ...t, completed: true, isCancelled: true }));
    }

    const currentIdx = statusOrder.findIndex(s =>
      s.toLowerCase() === currentStatus.toLowerCase() || currentStatus.toLowerCase().includes(s.toLowerCase())
    );

    return statusOrder.map((label, idx) => {
      const trackingEntry = tracking.find(t =>
        t.Status.toLowerCase().includes(label.toLowerCase()) || label.toLowerCase().includes(t.Status.toLowerCase())
      );
      return {
        Status:      label,
        Description: trackingEntry?.Description || '',
        EventTime:   trackingEntry?.EventTime || '',
        Location:    trackingEntry?.Location || '',
        completed:   idx <= currentIdx,
      };
    });
  };

  return (
    <div className="bg-brand-bg-green min-h-screen pb-20">
      {/* Hero */}
      <section className="bg-brand-deep-green text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Track Your Order
          </motion.h1>
          <p className="text-brand-light-green/80 max-w-2xl mx-auto">
            Stay updated on your handcrafted jewellery's journey to you.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">

          {/* Search form */}
          <form onSubmit={handleTrack} className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Order Number</label>
                <input type="text" required placeholder="e.g. 42 or #SAK-42"
                  value={orderNumber} onChange={e => setOrderNumber(e.target.value)}
                  className="w-full bg-brand-bg-green border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Email Address</label>
                <input type="email" required placeholder="your@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-brand-bg-green border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-brand-deep-green text-white font-bold py-4 rounded-xl hover:bg-brand-deep-green/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Search size={20} /> Track Order</>
              }
            </button>
          </form>

          {/* Tracking result */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="border-t border-stone-100 pt-8">

              {/* Status header */}
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-brand-deep-green">
                    Order #{result.order.OrderID}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">
                    Status: <span className="font-bold text-stone-800">{result.order.Status}</span>
                  </p>
                  {result.order.LastUpdateLocation && (
                    <p className="text-xs text-stone-400 mt-0.5">
                      Last seen: {result.order.LastUpdateLocation}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase text-stone-400">Est. Delivery</p>
                  <p className="font-bold text-brand-deep-green">{result.estimatedDelivery}</p>
                </div>
              </div>

              {/* Shipping address */}
              {result.order.ShippingAddress && (
                <div className="bg-brand-bg-green rounded-xl p-4 mb-8 text-sm text-stone-600">
                  <p className="font-bold text-stone-800 mb-1">Delivering to:</p>
                  <p>{result.order.ShippingAddress}</p>
                </div>
              )}

              {/* Timeline */}
              {result.order.Status === 'Cancelled' ? (
                <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
                  <p className="text-red-600 font-bold text-lg mb-2">Order Cancelled</p>
                  <p className="text-red-400 text-sm">This order was cancelled. Refund (if prepaid) will be processed within 5-7 business days.</p>
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-100">
                  {buildSteps(result.order.Status, result.tracking || []).map((step: any, idx: number) => (
                    <div key={idx} className="flex gap-6 relative">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                        step.completed ? 'bg-brand-deep-green text-white' : 'bg-stone-100 text-stone-300'
                      }`}>
                        {step.completed
                          ? <CheckCircle size={14} />
                          : step.Status === 'Shipped' || step.Status === 'Out for Delivery'
                          ? <Truck size={12} />
                          : step.Status === 'Delivered'
                          ? <Package size={12} />
                          : <Clock size={12} />
                        }
                      </div>
                      <div className="flex-grow pb-2">
                        <h4 className={`font-bold text-sm ${step.completed ? 'text-stone-900' : 'text-stone-400'}`}>
                          {step.Status}
                        </h4>
                        {step.Description && (
                          <p className={`text-xs mt-0.5 ${step.completed ? 'text-stone-500' : 'text-stone-300'}`}>
                            {step.Description}
                          </p>
                        )}
                        {step.Location && (
                          <p className="text-xs text-stone-400 mt-0.5">📍 {step.Location}</p>
                        )}
                        {step.EventTime && (
                          <p className="text-xs text-stone-300 mt-0.5">
                            {new Date(step.EventTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;