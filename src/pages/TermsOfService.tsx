import React from 'react';
import { motion } from 'motion/react';
import { FileText, Scale, AlertCircle, HelpCircle } from 'lucide-react';

const TermsOfService = () => {
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
            Terms of Service
          </motion.h1>
          <p className="text-brand-light-green/80 max-w-2xl mx-auto">
            Please read these terms carefully before using our website or services.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-4 bg-brand-bg-green rounded-2xl">
              <FileText className="mx-auto text-brand-deep-green mb-2" size={24} />
              <h3 className="text-xs font-bold">Agreement</h3>
            </div>
            <div className="text-center p-4 bg-brand-bg-green rounded-2xl">
              <Scale className="mx-auto text-brand-deep-green mb-2" size={24} />
              <h3 className="text-xs font-bold">Legal</h3>
            </div>
            <div className="text-center p-4 bg-brand-bg-green rounded-2xl">
              <AlertCircle className="mx-auto text-brand-deep-green mb-2" size={24} />
              <h3 className="text-xs font-bold">Liability</h3>
            </div>
            <div className="text-center p-4 bg-brand-bg-green rounded-2xl">
              <HelpCircle className="mx-auto text-brand-deep-green mb-2" size={24} />
              <h3 className="text-xs font-bold">Support</h3>
            </div>
          </div>

          <div className="prose prose-stone max-w-none">
            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing or using the SAKSAAS website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on SAKSAAS's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
              <li>Attempt to decompile or reverse engineer any software contained on SAKSAAS's website.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">3. Disclaimer</h2>
            <p className="mb-6">
              The materials on SAKSAAS's website are provided on an 'as is' basis. SAKSAAS makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">4. Limitations</h2>
            <p className="mb-6">
              In no event shall SAKSAAS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SAKSAAS's website, even if SAKSAAS or a SAKSAAS authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">5. Revisions and Errata</h2>
            <p className="mb-6">
              The materials appearing on SAKSAAS's website could include technical, typographical, or photographic errors. SAKSAAS does not warrant that any of the materials on its website are accurate, complete, or current. SAKSAAS may make changes to the materials contained on its website at any time without notice.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">6. Governing Law</h2>
            <p className="mb-6">
              Any claim relating to SAKSAAS's website shall be governed by the laws of India without regard to its conflict of law provisions.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brand-deep-green mb-4">7. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about these Terms of Service, please contact us at <span className="font-bold">legal@saksaas.com</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
