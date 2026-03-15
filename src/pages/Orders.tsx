import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Truck, Clock, ChevronRight, ShoppingBag, CheckCircle2, MapPin, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Order } from '../types';

const TrackingTimeline = ({ status, orderDate }: { status: string; orderDate: string }) => {
  const steps = [
    { label: 'Placed',    icon: Package,      isCompleted: true },
    { label: 'Processed', icon: Clock,        isCompleted: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status) },
    { label: 'Shipped',   icon: Truck,        isCompleted: ['Shipped', 'Out for Delivery', 'Delivered'].includes(status) },
    { label: 'Delivered', icon: CheckCircle2, isCompleted: status === 'Delivered' },
  ];

  if (status === 'Cancelled') {
    return (
      <div className="mt-6 pt-6 border-t border-stone-100">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
          <XCircle size={20} className="text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm font-medium">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-stone-100">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-stone-100 -z-0" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-brand-deep-green transition-all duration-1000 -z-0"
          style={{ width: `${(steps.filter(s => s.isCompleted).length - 1) / (steps.length - 1) * 100}%` }} />
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${step.isCompleted ? 'bg-brand-deep-green text-white' : 'bg-white border-2 border-stone-200 text-stone-300'}`}>
              <step.icon size={14} />
            </div>
            <p className={`text-[10px] font-bold mt-2 uppercase tracking-wider ${step.isCompleted ? 'text-brand-deep-green' : 'text-stone-400'}`}>
              {step.label}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-stone-500 bg-stone-50 p-3 rounded-xl">
        <MapPin size={14} className="text-brand-deep-green" />
        <span>Current Status: <span className="font-bold text-stone-800">{status}</span></span>
        <span className="mx-2">•</span>
        <span>Last Update: {new Date(orderDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export const Orders = () => {
  const [orders, setOrders]                 = useState<Order[]>([]);
  const [loading, setLoading]               = useState(true);
  const [expandedTracking, setExpanded]     = useState<number | null>(null);
  const [cancellingId, setCancellingId]     = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const data = await apiService.getOrders();
      setOrders(data);
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      await apiService.cancelOrder(orderId);
      // Refresh orders list
      await fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Could not cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return (
    <div className="py-20 text-center">
      <div className="w-10 h-10 border-4 border-brand-deep-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-stone-500">Loading orders...</p>
    </div>
  );

  return (
    <div className="bg-brand-bg-green min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-serif font-bold">My Orders</h1>
          <Link to="/shop" className="text-brand-deep-green font-medium hover:underline flex items-center gap-2">
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
        </div>

        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-100 text-center">
              <Package size={48} className="mx-auto text-stone-300 mb-4" />
              <h3 className="text-xl font-serif font-bold mb-2">No Orders Yet</h3>
              <p className="text-stone-500 mb-8">You haven't placed any orders yet.</p>
              <Link to="/shop" className="inline-block bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-deep-green transition-all">
                Shop Now
              </Link>
            </div>
          ) : (
            orders.map(order => (
              <motion.div key={order.OrderID} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col gap-6">

                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Order ID</p>
                      <p className="font-bold text-stone-800">#{order.OrderID}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Date</p>
                      <p className="font-medium text-stone-600">{new Date(order.OrderDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        order.Status === 'Delivered'  ? 'bg-emerald-100 text-emerald-700' :
                        order.Status === 'Cancelled'  ? 'bg-red-100 text-red-600' :
                        'bg-brand-light-green text-brand-deep-green'
                      }`}>
                        {order.Status}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Total</p>
                      <p className="font-bold text-brand-deep-green">₹{Number(order.TotalAmount).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {order.Status !== 'Cancelled' && (
                    <div className="w-full md:w-48 mt-4 md:mt-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Progress</span>
                        <span className="text-[10px] font-bold text-brand-deep-green uppercase tracking-widest">
                          {order.Status === 'Delivered'        ? '100%' :
                           order.Status === 'Out for Delivery' ? '85%'  :
                           order.Status === 'Shipped'          ? '65%'  :
                           order.Status === 'Processing'       ? '40%'  : '15%'}
                        </span>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-deep-green transition-all duration-1000" style={{
                          width: order.Status === 'Delivered'        ? '100%' :
                                 order.Status === 'Out for Delivery' ? '85%'  :
                                 order.Status === 'Shipped'          ? '65%'  :
                                 order.Status === 'Processing'       ? '40%'  : '15%'
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                    {order.Status !== 'Cancelled' && (
                      <button
                        onClick={() => setExpanded(expandedTracking === order.OrderID ? null : order.OrderID)}
                        className={`flex-grow md:flex-grow-0 px-5 py-3 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                          expandedTracking === order.OrderID
                            ? 'bg-brand-deep-green text-white'
                            : 'bg-brand-light-green text-brand-deep-green hover:bg-brand-deep-green hover:text-white'
                        }`}>
                        <Truck size={16} />
                        {expandedTracking === order.OrderID ? 'Hide Tracking' : 'Track Order'}
                      </button>
                    )}
                    <Link to={`/order/${order.OrderID}`}
                      className="flex-grow md:flex-grow-0 px-5 py-3 border border-stone-200 rounded-full text-sm font-bold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
                      Details <ChevronRight size={16} />
                    </Link>
                    {/* Cancel button — only shown when Processing */}
                    {order.Status === 'Processing' && (
                      <button
                        onClick={() => handleCancel(order.OrderID)}
                        disabled={cancellingId === order.OrderID}
                        className="flex-grow md:flex-grow-0 px-5 py-3 border border-red-200 text-red-500 rounded-full text-sm font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                        <XCircle size={16} />
                        {cancellingId === order.OrderID ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded tracking timeline */}
                {expandedTracking === order.OrderID && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                    <TrackingTimeline status={order.Status} orderDate={order.OrderDate} />
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Package,    title: 'Track Order',   desc: 'Real-time tracking for all active orders.' },
            { icon: Truck,      title: 'Free Shipping', desc: 'On all orders above ₹1,500 across India.' },
            { icon: Clock,      title: '24/7 Support',  desc: 'Our team is here to help you anytime.' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-stone-100 text-center space-y-4">
              <div className="w-12 h-12 bg-brand-light-green rounded-full flex items-center justify-center mx-auto text-brand-deep-green">
                <item.icon size={24} />
              </div>
              <h3 className="font-serif font-bold text-lg">{item.title}</h3>
              <p className="text-stone-500 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};