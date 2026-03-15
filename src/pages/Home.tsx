import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Heart, 
  Instagram as InstagramIcon 
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { shopProducts } from '../shopProducts';
import { products as dataProducts } from '../data';

// --- LOCAL IMAGE IMPORTS ---
import heroImg1 from '../images/Kundan_Bangels/Kundan_Bangels4.png';
import heroImg2 from '../images/Kundan_Bangels/Kundan_Bangels2.png';
import heroImg3 from '../images/Kundan_Bangels/Kundan_Bangels8.png';
import heroImg4 from '../images/Kundan_Bangels/Kundan_Bangels15.png';
import heroImg5 from '../images/kundan_jhumkas/kundan_jhumkas1.png';
import heroImg6 from '../images/traditional_jhumkas/traditional_jhumkas1.png';

import catBanglesImg  from '../images/Kundan_Bangels/Kundan_Bangels3.png';
import catEarringsImg from '../images/traditional_jhumkas/traditional_jhumkas1.png';

import prodImg1 from '../images/kundan_modern_earings/kundan_modern_earings1.png';
import prodImg2 from '../images/silk_thread_jhumkas/silk_thread_jhumkas1.png';
import prodImg3 from '../images/Kundan_Bangels/Kundan_Bangels10.png';
import prodImg4 from '../images/kundan_jhumkas/kundan_jhumkas2.png';
import prodImg5 from '../images/Kundan_Bangels/Kundan_Bangels20.png';
import prodImg6 from '../images/silk_thread_jhumkas/silk_thread_jhumkas5.jpeg';

import galleryImg1 from '../images/Kundan_Bangels/Kundan_Bangels5.png';
import galleryImg2 from '../images/kundan_modern_earings/kundan_modern_earings2.png';
import galleryImg3 from '../images/Kundan_Bangels/Kundan_Bangels12.jpg';
import galleryImg4 from '../images/silk_thread_jhumkas/silk_thread_jhumkas3.jpeg';
import galleryImg5 from '../images/traditional_jhumkas/traditional_jhumkas3.png';
import galleryImg6 from '../images/kundan_jhumkas/kundan_jhumkas6.jpg';

import budgetBannerImg from '../images/Kundan_Bangels/Kundan_Bangels6.png';
import storyBannerImg  from '../images/traditional_jhumkas/traditional_jhumkas6.png';

// ── All local products — same source as Shop.tsx ─────────────────────────────
const ALL_PRODUCTS: Product[] = [...shopProducts, ...dataProducts];

const heroSlides = [
  { id: 1, image: heroImg1, title: 'Artisan Heritage',     subtitle: 'Handcrafted with Love',              link: '/shop' },
  { id: 2, image: heroImg2, title: 'Royal Bangles',        subtitle: 'Elegance in Every Detail',           link: '/shop' },
  { id: 3, image: heroImg5, title: 'Modern Earrings',      subtitle: 'Timeless Beauty',                    link: '/shop' },
  { id: 4, image: heroImg3, title: 'Bridal Bangles',       subtitle: 'Your Special Day, Our Special Touch',link: '/shop' },
  { id: 5, image: heroImg6, title: 'Traditional Jhumkas',  subtitle: 'Celebrate with SAKSAAS',             link: '/shop' },
  { id: 6, image: heroImg4, title: 'Premium Collections',  subtitle: 'Designed by You, Crafted by Us',     link: '/customise' },
];

const categories = [
  { name: 'Bangles',  image: catBanglesImg,  link: '/shop?category=Bangles'  },
  { name: 'Earrings', image: catEarringsImg, link: '/shop?category=Earrings' },
];

const galleryImages = [
  { img: galleryImg1, alt: 'Kundan Bangles'       },
  { img: galleryImg2, alt: 'Modern Earrings'      },
  { img: galleryImg3, alt: 'Kundan Bangles'       },
  { img: galleryImg4, alt: 'Silk Thread Jhumkas'  },
  { img: galleryImg5, alt: 'Traditional Jhumkas'  },
  { img: galleryImg6, alt: 'Kundan Jhumkas'       },
];

export const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load products instantly from local data — no API call, no loading spinner
  const trendingProducts  = ALL_PRODUCTS.filter(p => p.trending).slice(0, 6);
  const topSellingProducts = ALL_PRODUCTS.filter(p => p.topSelling).slice(0, 6);
  const newArrivalProducts = ALL_PRODUCTS.filter(p => p.newArrival).slice(0, 6);
  const under500Products   = ALL_PRODUCTS.filter(p => p.under500).slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="space-y-20 pb-20">

      {/* ── Hero Slider ──────────────────────────────────────────────────── */}
      <section className="relative h-[80vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center">
              <div className="container mx-auto px-4">
                <motion.p
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                  className="text-white uppercase tracking-[0.3em] text-sm mb-4 font-medium"
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                  className="text-white text-5xl md:text-7xl font-serif font-bold mb-8"
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                  <Link
                    to={heroSlides[currentSlide].link}
                    className="inline-block bg-white text-stone-900 px-8 py-3 rounded-full font-medium hover:bg-brand-deep-green hover:text-white transition-all duration-300"
                  >
                    Explore Collection
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-stone-900 transition-all">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-stone-900 transition-all">
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'}`} />
          ))}
        </div>
      </section>

      {/* ── Shop by Category ─────────────────────────────────────────────── */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Shop by Category</h2>
          <div className="w-20 h-1 bg-brand-gold mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(cat => (
            <Link key={cat.name} to={cat.link}
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-md">
              <img src={cat.image} alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center p-6">
                <h3 className="text-white font-serif text-xl font-bold">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Collections Grid ─────────────────────────────────────── */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Featured Collections</h2>
            <p className="text-stone-500 text-sm">Hand-picked designs for you</p>
          </div>
          <Link to="/shop" className="text-brand-deep-green font-medium hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { img: prodImg1, alt: 'Modern Earrings',      link: '/shop?category=Earrings' },
            { img: prodImg2, alt: 'Silk Thread Jhumkas',  link: '/shop?category=Earrings' },
            { img: prodImg3, alt: 'Kundan Bangles',       link: '/shop?category=Bangles'  },
            { img: prodImg4, alt: 'Kundan Jhumkas',       link: '/shop?category=Earrings' },
            { img: prodImg5, alt: 'Premium Bangles',      link: '/shop?category=Bangles'  },
            { img: prodImg6, alt: 'Silk Thread Jhumkas',  link: '/shop?category=Earrings' },
          ].map((item, i) => (
            <Link key={i} to={item.link}
              className="aspect-square relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img src={item.img} alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Heart size={24} className="text-brand-gold" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trending ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Trending Bangles & Earrings</h2>
            <p className="text-stone-500 text-sm">Most loved pieces this week</p>
          </div>
          <Link to="/shop?filter=trending" className="text-brand-deep-green font-medium hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── Top Selling ──────────────────────────────────────────────────── */}
      <section className="bg-brand-light-green py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-2">Top Selling Bangles & Earrings</h2>
              <p className="text-stone-500 text-sm">Our all-time favorites</p>
            </div>
            <Link to="/shop?filter=topSelling" className="text-brand-deep-green font-medium hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {topSellingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ─────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">New Bangles & Earrings</h2>
            <p className="text-stone-500 text-sm">Freshly handcrafted for you</p>
          </div>
          <Link to="/shop?filter=new" className="text-brand-deep-green font-medium hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {newArrivalProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── Under ₹500 ───────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-1 relative rounded-2xl overflow-hidden min-h-[400px]">
            <img src={budgetBannerImg} alt="Budget Friendly"
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-deep-green/40 flex flex-col justify-center p-10 text-white">
              <h2 className="text-4xl font-serif font-bold mb-4">Budget Friendly</h2>
              <p className="text-xl mb-8">Exquisite designs under ₹500</p>
              <Link to="/shop?filter=under500"
                className="inline-block bg-white text-brand-deep-green px-8 py-3 rounded-full font-bold w-fit hover:bg-stone-900 hover:text-white transition-all">
                Shop Now
              </Link>
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-6">
            {under500Products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ────────────────────────────────────────────────────── */}
      <section className="bg-stone-900 text-white py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <img src={storyBannerImg} alt="Story"
            className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-2 border-brand-gold" />
          <h2 className="text-4xl font-serif font-bold mb-6">Our Story</h2>
          <p className="text-stone-400 leading-relaxed mb-10 text-lg">
            SAKSAAS was born out of a passion for preserving the rich heritage of Indian craftsmanship.
            Every piece we create is a labor of love, handcrafted by skilled artisans using traditional techniques passed down through generations.
          </p>
          <Link to="/about"
            className="inline-block border-2 border-brand-gold text-brand-gold px-10 py-3 rounded-full font-bold hover:bg-brand-gold hover:text-white transition-all">
            Read Our Story
          </Link>
        </div>
      </section>

      {/* ── Why Buy From Us ──────────────────────────────────────────────── */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Heart,      title: 'Handcrafted',    desc: 'Made with love & care'         },
            { icon: RotateCcw,  title: 'Easy Returns',   desc: '7-day hassle-free returns'      },
            { icon: ShieldCheck,title: 'Secure Checkout',desc: '100% safe payments'             },
            { icon: Truck,      title: 'Happy Customers',desc: 'Over 10k+ satisfied buyers'     },
          ].map((item, idx) => (
            <div key={idx} className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-light-green rounded-full flex items-center justify-center mx-auto text-brand-deep-green">
                <item.icon size={32} />
              </div>
              <h4 className="font-serif font-bold text-xl">{item.title}</h4>
              <p className="text-stone-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Collections Gallery ──────────────────────────────────────── */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <InstagramIcon size={20} className="text-brand-deep-green" />
            <span className="text-sm font-bold uppercase tracking-widest text-stone-500">Our Collections</span>
          </div>
          <h2 className="text-3xl font-serif font-bold">Our Beautiful Designs</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleryImages.map((item, i) => (
            <div key={i} className="aspect-square relative group overflow-hidden rounded-lg">
              <img src={item.img} alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Heart size={24} className="text-brand-gold" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};