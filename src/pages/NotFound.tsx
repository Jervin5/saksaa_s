import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

// Floating bangle particle
const BangleParticle = ({ style }: { style: React.CSSProperties }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={style}
    animate={{ y: [-10, 10, -10], rotate: [0, 15, -15, 0], opacity: [0.15, 0.35, 0.15] }}
    transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
  >
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16" stroke="#B8860B" strokeWidth="3" fill="none" opacity="0.6" />
      <circle cx="20" cy="20" r="9"  stroke="#D4AF37" strokeWidth="2" fill="none" opacity="0.4" />
    </svg>
  </motion.div>
);

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  style: {
    left:  `${5 + (i * 8) % 90}%`,
    top:   `${10 + (i * 13) % 80}%`,
    transform: `scale(${0.5 + (i % 3) * 0.4})`,
  },
}));

export const NotFound = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="relative min-h-screen bg-brand-bg-green overflow-hidden flex items-center justify-center">

      {/* ── Background particles ── */}
      {particles.map(p => <BangleParticle key={p.id} style={p.style} />)}

      {/* ── Radial glow behind 404 ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">

        {/* Decorative top bangle ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex justify-center mb-8"
        >
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 rounded-full border-4 border-brand-gold opacity-30 animate-ping" style={{ animationDuration: '2.5s' }} />
            <div className="absolute inset-2 rounded-full border-4 border-brand-gold opacity-60" />
            <div className="absolute inset-6 rounded-full border-2 border-brand-gold opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-brand-gold text-2xl">✦</span>
            </div>
          </div>
        </motion.div>

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
        >
          <h1
            className="font-serif font-bold leading-none mb-2 select-none"
            style={{
              fontSize: 'clamp(7rem, 20vw, 14rem)',
              background: 'linear-gradient(135deg, #B8860B 0%, #D4AF37 40%, #F7E7CE 60%, #D4AF37 80%, #B8860B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              letterSpacing: '-0.04em',
            }}
          >
            404
          </h1>
        </motion.div>

        {/* Thin gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-32 h-px bg-brand-gold mx-auto mb-8 origin-center"
        />

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-3 mb-12"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-brand-gold font-medium">
            Page Not Found
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-800 leading-snug">
            This jewel has gone missing
          </h2>
          <p className="text-stone-500 text-base max-w-md mx-auto leading-relaxed">
            The page you're looking for may have been moved, renamed, or doesn't exist. 
            Let us guide you back to our collection.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="group relative inline-flex items-center gap-3 bg-brand-deep-green text-white px-10 py-4 rounded-full font-bold text-sm tracking-wide overflow-hidden transition-all hover:shadow-lg hover:shadow-brand-deep-green/30 hover:-translate-y-0.5"
          >
            <span className="relative z-10">Back to Home</span>
            <span className="relative z-10 text-brand-gold">✦</span>
            <div className="absolute inset-0 bg-stone-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 border-2 border-brand-gold text-brand-gold px-10 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-brand-gold hover:text-white transition-all hover:-translate-y-0.5"
          >
            Browse Collection
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-2"
        >
          {[
            { label: 'Earrings', to: '/shop?category=Earrings' },
            { label: 'Bangles',  to: '/shop?category=Bangles'  },
            { label: 'Customise', to: '/customise'             },
            { label: 'Contact',  to: '/contact'                },
          ].map(link => (
            <Link
              key={link.label}
              to={link.to}
              className="text-xs uppercase tracking-widest text-stone-400 hover:text-brand-deep-green transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>

      </div>
    </div>
  );
};