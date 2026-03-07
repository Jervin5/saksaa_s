import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Fixed import name
import { Mail, Lock, ArrowRight, Chrome as Google } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (apiService.getCurrentUser()) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await apiService.login({ email, password });
        navigate('/');
      } else {
        await apiService.signup({ fullName, email, password });
        // After signup, automatically log them in
        await apiService.login({ email, password });
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f4f7f4] min-h-screen py-10 flex items-center justify-center font-sans">
      <div className="container mx-auto px-4 max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-stone-100"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-stone-500 text-sm">
              {isLogin ? 'Enter your details to access your account' : 'Join the SAKSAAS family today'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 animate-pulse">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-200 outline-none pl-12 transition-all"
                  />
                  <ArrowRight size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-200 outline-none pl-12 transition-all"
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Password</label>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-200 outline-none pl-12 transition-all"
                />
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-lg disabled:opacity-50 mt-4"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-stone-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-green-700 font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};