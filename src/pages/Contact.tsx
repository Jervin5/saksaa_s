import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, Send, Instagram as InstagramIcon } from 'lucide-react';

// Import our images
import contactImg1 from '../images/Kundan_Bangels/Kundan_Bangels3.png';
import contactImg2 from '../images/kundan_jhumkas/kundan_jhumkas2.png';
import contactImg3 from '../images/kundan_modern_earings/kundan_modern_earings2.png';
import contactImg4 from '../images/silk_thread_jhumkas/silk_thread_jhumkas2.png';
import contactImg5 from '../images/studs/studs2.png';
import contactImg6 from '../images/traditional_jhumkas/traditional_jhumkas2.png';

export const Contact = () => {
  return (
    <div className="bg-brand-bg-green min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Get In Touch With Us</h1>
          <p className="text-stone-500 max-w-2xl mx-auto">
            Have a question about our products, an order, or customisation? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {[
            { icon: MapPin, title: 'Our Address', content: '123 Artisan Lane, Bangalore, Karnataka 560001' },
            { icon: Phone, title: 'Phone Number', content: '+91 98765 43210' },
            { icon: Mail, title: 'Email Address', content: 'hello@saksaas.com' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm border border-stone-100 text-center space-y-4">
              <div className="w-14 h-14 bg-brand-light-green rounded-full flex items-center justify-center mx-auto text-brand-deep-green">
                <item.icon size={28} />
              </div>
              <h3 className="font-serif font-bold text-xl">{item.title}</h3>
              <p className="text-stone-500 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-stone-100">
            <h2 className="text-3xl font-serif font-bold mb-8">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-stone-700">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-stone-700">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-stone-700">Subject</label>
                <input 
                  type="text" 
                  placeholder="How can we help?"
                  className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-stone-700">Message</label>
                <textarea 
                  rows={5}
                  placeholder="Your message here..."
                  className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20 resize-none"
                />
              </div>
              <button className="w-full bg-stone-900 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-deep-green transition-all shadow-lg">
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>

          {/* Info & Map */}
          <div className="space-y-12">
            <div className="bg-brand-light-green p-10 rounded-3xl border border-brand-deep-green/10">
              <h2 className="text-3xl font-serif font-bold mb-8 text-brand-deep-green">Working Hours</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Clock size={24} className="text-brand-deep-green" />
                  <div>
                    <p className="font-bold text-stone-800">Monday - Saturday</p>
                    <p className="text-stone-500">11:00 AM to 06:00 PM</p>
                  </div>
                </div>
                <p className="text-stone-500 leading-relaxed italic">
                  * We are closed on Sundays and Public Holidays. For urgent queries, please reach out via WhatsApp.
                </p>
              </div>
            </div>

            <div className="aspect-video rounded-3xl overflow-hidden shadow-sm border border-stone-200 grayscale hover:grayscale-0 transition-all duration-500">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9217684813!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1625123456789!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Instagram Feed */}
        <section className="mt-32 border-t border-stone-200 pt-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <InstagramIcon size={20} className="text-brand-deep-green" />
              <span className="text-sm font-bold uppercase tracking-widest text-stone-500">Connect with us</span>
            </div>
            <h2 className="text-3xl font-serif font-bold">@saksaas</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              contactImg1, contactImg2, contactImg3, contactImg4, contactImg5, contactImg6
            ].map((imgSrc, i) => (
              <div key={i} className="aspect-square relative group overflow-hidden rounded-lg">
                <img 
                  src={imgSrc} 
                  alt="Our Work" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <InstagramIcon size={24} className="text-white" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
