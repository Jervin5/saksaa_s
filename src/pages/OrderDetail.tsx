import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Package, Truck, Calendar, MapPin, CreditCard, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Order, OrderItem } from '../types';

export const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<(Order & { items: OrderItem[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!id) return;
      try {
        const data = await apiService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id, navigate]);

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (!order) return null;

  return (
    <div className="bg-brand-bg-green min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <button 
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-stone-500 hover:text-brand-deep-green mb-8 font-medium transition-colors"
        >
          <ChevronLeft size={18} />
          Back to Orders
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Order Details</h1>
            <p className="text-stone-500">Order ID: <span className="font-bold text-stone-800">{order.OrderID}</span></p>
          </div>
          <div className="flex items-center gap-2 bg-brand-light-green text-brand-deep-green px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest">
            <Truck size={16} />
            {order.Status}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Info */}
          <div className="md:col-span-2 space-y-8">
            {/* Items */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-8">
                <Package className="text-brand-deep-green" size={24} />
                <h2 className="text-2xl font-serif font-bold">Items Ordered</h2>
              </div>
              <div className="space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-6 pb-6 border-b border-stone-100 last:border-0 last:pb-0">
                    <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.ImageURL} alt={item.Name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-serif font-bold text-lg text-stone-800 mb-1">{item.Name}</h3>
                      <p className="text-sm text-stone-500 mb-2">Quantity: {item.Quantity} • Size: {item.Size}</p>
                      <p className="font-bold text-brand-deep-green">₹{item.Price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="text-brand-deep-green" size={24} />
                <h2 className="text-2xl font-serif font-bold">Order Timeline</h2>
              </div>
              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-100">
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-brand-deep-green flex items-center justify-center text-white">
                    <CheckCircle2 size={14} />
                  </div>
                  <p className="font-bold text-stone-800">Order Placed</p>
                  <p className="text-sm text-stone-500">{new Date(order.OrderDate).toLocaleDateString()}</p>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-brand-deep-green flex items-center justify-center text-white">
                    <CheckCircle2 size={14} />
                  </div>
                  <p className="font-bold text-stone-800">Payment Confirmed</p>
                  <p className="text-sm text-stone-500">March 1, 2024 • 10:45 AM</p>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-brand-deep-green flex items-center justify-center text-white">
                    <Truck size={14} />
                  </div>
                  <p className="font-bold text-stone-800">Shipped</p>
                  <p className="text-sm text-stone-500">March 2, 2024 • 02:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Shipping Address */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-brand-deep-green" size={20} />
                <h2 className="text-xl font-serif font-bold">Shipping To</h2>
              </div>
              <div className="text-sm text-stone-600 space-y-1">
                <p className="text-stone-600 leading-relaxed">{order.ShippingAddress}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-brand-deep-green" size={20} />
                <h2 className="text-xl font-serif font-bold">Payment</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Method</span>
                  <span className="font-medium text-stone-800">{order.PaymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Status</span>
                  <span className="text-emerald-600 font-bold">Paid</span>
                </div>
                <div className="border-t border-stone-100 pt-4 flex justify-between font-bold text-stone-900">
                  <span>Total Paid</span>
                  <span className="text-brand-deep-green">₹{order.TotalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
