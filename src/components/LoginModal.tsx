import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      // Check if authorized
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email;
      const AUTHORIZED_EMAILS = [
        'vighneshskumar2006@gmail.com',
        'pranav2@gmail.com',
        'derinjosesanjith@gmail.com'
      ];
      
      if (!userEmail || !AUTHORIZED_EMAILS.includes(userEmail)) {
        await supabase.auth.signOut();
        setError('Unauthorized email address.');
        setLoading(false);
      } else {
        setLoading(false);
        onClose();
      }
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#121212]/45 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-[#1A1817] rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#22201F] dark:text-[#F6F2EA]">Admin Login</h2>
              <p className="text-sm text-[#8A7E6F] dark:text-[#A89F91] mt-2">Authorized professors only.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7E6F] dark:text-[#A89F91] mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2A2726] text-gray-900 dark:text-[#F6F2EA] focus:ring-1 focus:ring-[#4A0E1B] focus:border-[#4A0E1B] outline-none transition-all"
                    required
                  />
                  <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7E6F] dark:text-[#A89F91] mb-2">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2A2726] text-gray-900 dark:text-[#F6F2EA] focus:ring-1 focus:ring-[#4A0E1B] focus:border-[#4A0E1B] outline-none transition-all"
                    required
                  />
                  <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#4A0E1B] text-white font-bold hover:bg-[#7C2532] transition-colors disabled:opacity-50 mt-4"
              >
                {loading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
