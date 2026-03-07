import React from 'react';
import { motion } from 'motion/react';
import { Bookmark, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';

export const Wishlist = () => {
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="bg-brand-bg-green min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-serif font-bold">My Wishlist</h1>
          <p className="text-stone-500">{wishlist.length} items saved</p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 group"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-lg hover:scale-110 transition-transform"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-serif font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-brand-deep-green font-bold mb-6">₹{product.price.toLocaleString()}</p>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-stone-900 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-deep-green transition-all"
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-brand-light-green rounded-full flex items-center justify-center mx-auto mb-8 text-brand-deep-green">
              <Bookmark size={40} />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">Your Wishlist is Empty</h2>
            <p className="text-stone-500 mb-10 max-w-md mx-auto">Save your favorite handcrafted pieces to your wishlist and they'll be waiting for you here.</p>
            <Link to="/shop" className="inline-block bg-stone-900 text-white px-10 py-4 rounded-full font-bold hover:bg-brand-deep-green transition-all">
              Explore Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
