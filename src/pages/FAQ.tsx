import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { faqs } from '../data';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-brand-bg-green min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-brand-light-green rounded-full flex items-center justify-center mx-auto mb-6 text-brand-deep-green">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-stone-500">Everything you need to know about our products and services.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
              >
                <span className="font-serif font-bold text-lg text-stone-800">{faq.question}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === idx ? 'bg-brand-deep-green text-white rotate-180' : 'bg-stone-100 text-stone-400'}`}>
                  {openIndex === idx ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 text-stone-600 leading-relaxed border-t border-stone-50 pt-4">
                      {faq.answer}
                      {faq.question.includes('measure bangle size') && (
                        <div className="mt-8 p-6 bg-brand-light-green rounded-xl border border-brand-deep-green/10">
                          <h4 className="font-serif font-bold text-brand-deep-green mb-4">Bangle Size Chart</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-center">
                              <thead>
                                <tr className="border-b border-brand-deep-green/20">
                                  <th className="py-2 px-4">Size</th>
                                  <th className="py-2 px-4">Inner Diameter (mm)</th>
                                  <th className="py-2 px-4">Inner Circumference (mm)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[
                                  { size: '2.2', dia: '54.0', cir: '169.6' },
                                  { size: '2.4', dia: '57.2', cir: '179.6' },
                                  { size: '2.6', dia: '60.3', cir: '189.4' },
                                  { size: '2.8', dia: '63.5', cir: '199.4' },
                                  { size: '2.10', dia: '66.7', cir: '209.4' },
                                  { size: '2.12', dia: '69.9', cir: '219.5' },
                                ].map((row, i) => (
                                  <tr key={i} className="border-b border-stone-100 last:border-0">
                                    <td className="py-2 px-4 font-bold">{row.size}</td>
                                    <td className="py-2 px-4">{row.dia}</td>
                                    <td className="py-2 px-4">{row.cir}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-stone-900 rounded-3xl text-center text-white">
          <h3 className="text-2xl font-serif font-bold mb-4">Still have questions?</h3>
          <p className="text-stone-400 mb-8">We're here to help! Reach out to our customer support team.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:hello@saksaas.com" className="bg-brand-gold text-white px-8 py-3 rounded-full font-bold hover:bg-brand-deep-green transition-all">
              Email Us
            </a>
            <a href="https://wa.me/919876543210" className="bg-white text-stone-900 px-8 py-3 rounded-full font-bold hover:bg-stone-100 transition-all">
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
