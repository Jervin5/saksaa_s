import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
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
            Privacy Policy
          </motion.h1>
          <p className="text-brand-light-green/80 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-4 bg-brand-bg-green rounded-2xl">
              <Shield className="mx-auto text-brand-deep-green mb-2" size={24} />
              <h3 className="text-xs font-bold">Secure Data</h3>
            </div>
            <div className="text-center p-4 bg-brand-bg-green rounded-2xl">
              <Lock className="mx-auto text-brand-deep-green mb-2" size={24} />
              <h3 className="text-xs font-bold">Encrypted</h3>
            </div>
            <div className="text-center p-4 bg-brand-bg-green rounded-2xl">
              <Eye className="mx-auto text-brand-deep-green mb-2" size={24} />
              <h3 className="text-xs font-bold">Transparent</h3>
            </div>
            <div className="text-center p-4 bg-brand-bg-green rounded-2xl">
              <FileText className="mx-auto text-brand-deep-green mb-2" size={24} />
              <h3 className="text-xs font-bold">Compliant</h3>
            </div>
          </div>

          <div className="prose prose-stone max-w-none">
            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us when you:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Create an account or update your profile.</li>
              <li>Make a purchase or place an order.</li>
              <li>Sign up for our newsletter or marketing communications.</li>
              <li>Contact our customer support team.</li>
              <li>Participate in a survey, contest, or promotion.</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Process and fulfill your orders, including sending emails to confirm your order status and shipment.</li>
              <li>Communicate with you about products, services, offers, and events.</li>
              <li>Personalize your shopping experience and provide content and features that match your interests.</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">3. Sharing of Information</h2>
            <p className="mb-6">
              We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this policy. We may share information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">4. Data Security</h2>
            <p className="mb-6">
              We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems and are required to keep the information confidential.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">5. Your Choices</h2>
            <p className="mb-6">
              You may opt out of receiving promotional communications from us by following the instructions in those communications or by logging into your account and updating your preferences. If you opt out, we may still send you non-promotional communications, such as those about your account or our ongoing business relations.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">6. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy, please contact us at <span className="font-bold">privacy@saksaas.com</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
