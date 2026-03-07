import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Corrected import
import { User, Mail, MapPin, Phone, Shield, Bell, LogOut, ChevronRight, Save, Upload, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { User as UserType } from '../types';

// Important: Change this to your local PHP server path
const BASE_URL = "http://localhost/saksaas/";

export const AccountDetails = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [uploading, setUploading] = useState(false);
  
  // Password/Auth States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const profile = await apiService.getProfile();
      setUser(profile);
    } catch (err) {
      console.error(err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // Call with two arguments as defined in your service
      const imageUrl = await apiService.uploadProfileImage(user.email, file);
      
      // Update local UI state
      setUser({ ...user, profileImage: imageUrl });
      alert('Profile picture updated!');
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await apiService.updateProfile(user);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await apiService.changePassword(user.email, currentPassword, newPassword);
      alert('Password updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      alert(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Sign out of SAKSAAS?')) {
      apiService.logout();
      navigate('/login');
    }
  };

  if (loading) return <div className="py-20 text-center font-serif">Loading Account...</div>;
  if (!user) return null;

  const tabs = [
    { id: 'personal', icon: User, label: 'Personal Info' },
    { id: 'address', icon: MapPin, label: 'Addresses' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
  ];

  return (
    <div className="bg-brand-bg-green min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold mb-12">Account Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {user.profileImage ? (
                  <img 
                    src={`${BASE_URL}${user.profileImage}`} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover border-2 border-brand-light-green" 
                  />
                ) : (
                  <div className="w-full h-full bg-brand-light-green rounded-full flex items-center justify-center text-brand-deep-green text-3xl font-serif font-bold">
                    {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                )}
                <label className={`absolute bottom-0 right-0 bg-brand-deep-green text-white p-2 rounded-full cursor-pointer hover:bg-opacity-90 transition-all ${uploading ? 'animate-pulse' : ''}`}>
                  <Upload size={16} />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              <h3 className="font-serif font-bold text-xl">{user.fullName}</h3>
              <p className="text-stone-500 text-sm">{user.email}</p>
            </div>

            <nav className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
              {tabs.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full px-6 py-4 flex items-center justify-between text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-brand-light-green text-brand-deep-green' : 'hover:bg-stone-50 text-stone-600'}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${activeTab === item.id ? 'rotate-90' : ''}`} />
                </button>
              ))}
              <button onClick={handleLogout} className="w-full px-6 py-4 flex items-center gap-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border-t border-stone-50">
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {activeTab === 'personal' && (
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
                  <h2 className="text-2xl font-serif font-bold mb-8">Personal Information</h2>
                  <form className="space-y-6" onSubmit={handleUpdate}>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Full Name</label>
                      <input 
                        type="text" 
                        value={user.fullName} 
                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                        className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Email</label>
                      <input type="email" value={user.email} disabled className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl text-stone-400 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Phone</label>
                      <input 
                        type="tel" 
                        value={user.phone || ''} 
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-deep-green/20" 
                      />
                    </div>
                    <button type="submit" disabled={saving} className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold hover:bg-brand-deep-green transition-all shadow-lg flex items-center gap-2">
                      <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'address' && (
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
                  <h2 className="text-2xl font-serif font-bold mb-8">Shipping Address</h2>
                  <form className="space-y-6" onSubmit={handleUpdate}>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Address Line 1</label>
                      <input 
                        type="text" 
                        value={user.addressLine1 || ''} 
                        onChange={(e) => setUser({ ...user, addressLine1: e.target.value })}
                        className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-700">City</label>
                        <input 
                          type="text" 
                          value={user.city || ''} 
                          onChange={(e) => setUser({ ...user, city: e.target.value })}
                          className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Pincode</label>
                        <input 
                          type="text" 
                          value={user.pincode || ''} 
                          onChange={(e) => setUser({ ...user, pincode: e.target.value })}
                          className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl" 
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={saving} className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold shadow-lg flex items-center gap-2">
                      <Save size={18} /> Save Address
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
                  <h2 className="text-2xl font-serif font-bold mb-8">Change Password</h2>
                  <form className="space-y-6" onSubmit={handlePasswordChange}>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl pr-12"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-700">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Confirm Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-4 bg-brand-bg-green border border-stone-200 rounded-xl"
                      />
                    </div>
                    <button type="submit" className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold shadow-lg">
                      Update Password
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
                  <h2 className="text-2xl font-serif font-bold mb-8">Notifications</h2>
                  <div className="space-y-4">
                    {['orderUpdates', 'promotions', 'newsletter'].map((key) => (
                      <div key={key} className="flex items-center justify-between py-4 border-b border-stone-50">
                        <p className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <div 
                          onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))}
                          className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifications[key as keyof typeof notifications] ? 'bg-brand-deep-green' : 'bg-stone-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[key as keyof typeof notifications] ? 'right-1' : 'left-1'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};