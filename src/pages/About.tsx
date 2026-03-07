import React from 'react';
import { motion } from 'motion/react';
import { Instagram as InstagramIcon, Heart, Users, Globe, Award, Sparkles } from 'lucide-react';

// Import our images
import artisanImg from '../images/Kundan_Bangels/Kundan_Bangels1.png';
import teamImg1 from '../images/kundan_jhumkas/kundan_jhumkas1.png';
import teamImg2 from '../images/kundan_modern_earings/kundan_modern_earings1.png';
import teamImg3 from '../images/silk_thread_jhumkas/silk_thread_jhumkas1.png';
import teamImg4 from '../images/studs/studs1.png';
import teamImg5 from '../images/traditional_jhumkas/traditional_jhumkas1.png';
import teamImg6 from '../images/Kundan_Bangels/Kundan_Bangels2.png';

export const About = () => {
  return (
    <div className="bg-brand-bg-green min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="grid grid-cols-3 grid-rows-2 h-full">
          <img src={teamImg1} alt="Our Team" className="w-full h-full object-cover" />
          <img src={teamImg2} alt="Artisans at work" className="w-full h-full object-cover" />
          <img src={teamImg3} alt="Craftsmanship" className="w-full h-full object-cover" />
          <img src={teamImg4} alt="Traditional jewelry" className="w-full h-full object-cover" />
          <img src={teamImg5} alt="Modern designs" className="w-full h-full object-cover" />
          <img src={teamImg6} alt="Our workshop" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center">
          <div className="container mx-auto px-4">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-white text-5xl md:text-7xl font-serif font-bold mb-4"
            >
              Our Story
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 uppercase tracking-[0.3em] text-sm font-medium"
            >
              Handcrafting Heritage Since 2015
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 container mx-auto px-4 max-w-4xl">
        <div className="space-y-16 text-center md:text-left">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-bold text-stone-900">Welcome to SAKSAAS</h2>
            <p className="text-stone-600 leading-relaxed text-lg">
              SAKSAAS was born out of a deep-rooted passion for preserving the rich heritage of Indian craftsmanship. 
              Our journey began in a small workshop in Bangalore, where we set out to bridge the gap between traditional artisanry and modern aesthetics. 
              Today, we are proud to be a platform that celebrates the incredible talent of local artisans while bringing you jewellery that tells a story.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <img 
              src={artisanImg} 
              alt="Artisan at work" 
              className="rounded-2xl shadow-xl"
            />
            <div className="space-y-6">
              <h3 className="text-3xl font-serif font-bold text-stone-900">Our Vision</h3>
              <p className="text-stone-600 leading-relaxed">
                We envision a world where every piece of jewellery is more than just an accessory—it's a piece of art that empowers the hands that made it. 
                Our goal is to sustain traditional crafts by providing artisans with fair wages, safe working environments, and a global platform to showcase their skills.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Users, title: 'Empowering Communities', desc: 'We work directly with over 50 artisan families across Karnataka.' },
                { icon: Award, title: 'Promoting Heritage', desc: 'Preserving age-old techniques like Meenakari, Kundan, and Temple work.' },
                { icon: Globe, title: 'Join Our Journey', desc: 'Be a part of a movement that values craftsmanship over mass production.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center space-y-4">
                  <div className="w-12 h-12 bg-brand-light-green rounded-full flex items-center justify-center mx-auto text-brand-deep-green">
                    <item.icon size={24} />
                  </div>
                  <h4 className="font-serif font-bold text-xl">{item.title}</h4>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl font-serif font-bold text-stone-900">Overcoming Challenges</h3>
            <p className="text-stone-600 leading-relaxed">
              The path of an artisan is not without its hurdles. In an era of fast fashion and machine-made replicas, 
              preserving the authenticity of handmade jewellery is a constant challenge. However, with your support, 
              we have been able to provide consistent work to our artisans, ensuring that these beautiful traditions continue to thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="container mx-auto px-4 py-20 border-t border-stone-200">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <InstagramIcon size={20} className="text-brand-deep-green" />
            <span className="text-sm font-bold uppercase tracking-widest text-stone-500">Follow our journey</span>
          </div>
          <h2 className="text-3xl font-serif font-bold">@saksaas</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            teamImg1, teamImg2, teamImg3, teamImg4, teamImg5, teamImg6
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
  );
};
