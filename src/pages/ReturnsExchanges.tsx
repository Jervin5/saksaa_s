import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw, ShieldCheck, HelpCircle } from 'lucide-react';

const ReturnsExchanges = () => {
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
            Returns & Exchanges
          </motion.h1>
          <p className="text-brand-light-green/80 max-w-2xl mx-auto">
            Your satisfaction is our priority. If you're not completely happy with your purchase, we're here to help.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-brand-bg-green rounded-2xl">
              <RefreshCw className="mx-auto text-brand-deep-green mb-4" size={32} />
              <h3 className="font-bold mb-2">7-Day Return</h3>
              <p className="text-sm text-stone-600">Easy returns within 7 days of delivery</p>
            </div>
            <div className="text-center p-6 bg-brand-bg-green rounded-2xl">
              <ShieldCheck className="mx-auto text-brand-deep-green mb-4" size={32} />
              <h3 className="font-bold mb-2">Quality Guarantee</h3>
              <p className="text-sm text-stone-600">Full refund for defective items</p>
            </div>
            <div className="text-center p-6 bg-brand-bg-green rounded-2xl">
              <HelpCircle className="mx-auto text-brand-deep-green mb-4" size={32} />
              <h3 className="font-bold mb-2">Easy Support</h3>
              <p className="text-sm text-stone-600">Dedicated team for your queries</p>
            </div>
          </div>

          <div className="prose prose-stone max-w-none">
            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">1. Return Policy</h2>
            <p className="mb-6">
              We have a 7-day return policy, which means you have 7 days after receiving your item to request a return. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">2. Non-Returnable Items</h2>
            <p className="mb-4">
              Certain types of items cannot be returned, like:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Customized or personalized jewellery sets.</li>
              <li>Items on clearance or final sale.</li>
              <li>Earrings (for hygiene reasons, unless defective).</li>
              <li>Gift cards.</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">3. Exchanges</h2>
            <p className="mb-6">
              The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item. For size exchanges (e.g., bangles), please contact us within 48 hours of delivery.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">4. Refunds</h2>
            <p className="mb-6">
              We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">5. How to Start a Return</h2>
            <p className="mb-6">
              To start a return, you can contact us at <span className="font-bold">returns@saksaas.com</span>. If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchanges;
