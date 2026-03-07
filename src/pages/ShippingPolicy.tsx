import React from 'react';
import { motion } from 'motion/react';
import { Truck, Package, Clock, ShieldCheck } from 'lucide-react';

const ShippingPolicy = () => {
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
            Shipping Policy
          </motion.h1>
          <p className="text-brand-light-green/80 max-w-2xl mx-auto">
            Everything you need to know about how we get our handcrafted jewellery to your doorstep.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-brand-bg-green rounded-2xl">
              <Truck className="mx-auto text-brand-deep-green mb-4" size={32} />
              <h3 className="font-bold mb-2">Free Shipping</h3>
              <p className="text-sm text-stone-600">On all orders above ₹999</p>
            </div>
            <div className="text-center p-6 bg-brand-bg-green rounded-2xl">
              <Clock className="mx-auto text-brand-deep-green mb-4" size={32} />
              <h3 className="font-bold mb-2">Delivery Time</h3>
              <p className="text-sm text-stone-600">5-7 business days across India</p>
            </div>
            <div className="text-center p-6 bg-brand-bg-green rounded-2xl">
              <ShieldCheck className="mx-auto text-brand-deep-green mb-4" size={32} />
              <h3 className="font-bold mb-2">Secure Packaging</h3>
              <p className="text-sm text-stone-600">Tamper-proof & insured</p>
            </div>
          </div>

          <div className="prose prose-stone max-w-none">
            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">1. Processing Time</h2>
            <p className="mb-6">
              All our jewellery is handcrafted with care. Orders are typically processed within 2-3 business days. During peak seasons or sales, processing may take up to 5 business days. You will receive a notification once your order has been shipped.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">2. Shipping Rates & Estimates</h2>
            <p className="mb-4">
              Shipping charges for your order will be calculated and displayed at checkout.
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Standard Shipping:</strong> Free for orders over ₹999. For orders below ₹999, a flat fee of ₹80 applies.</li>
              <li><strong>Express Shipping:</strong> Available for ₹150 flat fee (2-3 business days delivery).</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">3. International Shipping</h2>
            <p className="mb-6">
              Currently, we only ship within India. We are working on expanding our reach to international customers soon. Stay tuned!
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">4. Tracking Your Order</h2>
            <p className="mb-6">
              Once your order has shipped, you will receive an email containing a tracking number and a link to track your package. You can also track your order directly on our <a href="/order-tracking" className="text-brand-deep-green font-bold hover:underline">Order Tracking</a> page.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">5. Damages & Issues</h2>
            <p className="mb-6">
              SAKSAAS is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier or our support team directly to file a claim. Please save all packaging material and damaged goods before filing a claim.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
