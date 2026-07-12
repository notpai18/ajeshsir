import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted or declined cookies
    const consent = localStorage.getItem('ajeshsir_cookie_consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ajeshsir_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('ajeshsir_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 md:max-w-md animate-[fadeInUp_0.5s_ease-out_forwards]">
      <div className="relative overflow-hidden rounded-2xl border border-[#22201F]/15 dark:border-[#F6F2EA]/10 bg-white/95 dark:bg-[#1A1817]/95 p-6 shadow-[0_8px_30px_rgba(34,32,31,0.12)] backdrop-blur-md">
        
        {/* Close Button */}
        <button 
          onClick={handleDecline}
          className="absolute right-4 top-4 text-[#8A7E6F] hover:text-[#4A0E1B] dark:text-[#A89F91] dark:hover:text-[#F4E7E5] transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7F3EC] dark:bg-[#2A2726] text-[#4A0E1B] dark:text-[#E8CD82]">
            <Cookie size={20} />
          </div>
          <div>
            <h3 className="font-serif text-[17px] font-bold text-[#22201F] dark:text-[#F6F2EA] leading-tight mb-1">
              Cookie Preferences
            </h3>
            <p className="text-[13px] text-[#5A534B] dark:text-[#C7BCAD] leading-relaxed mb-4">
              We use essential cookies to maintain your session and preferences. We also use analytics cookies to understand how our library is used. 
              <Link to="/privacy" className="text-[#4A0E1B] dark:text-[#E8CD82] hover:underline ml-1 font-semibold">
                Read our Privacy Policy.
              </Link>
            </p>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleAccept}
                className="flex items-center justify-center rounded-lg bg-[#4A0E1B] hover:bg-[#7C2532] text-white px-4 py-2 text-[13px] font-bold transition-colors min-h-[36px]"
              >
                Accept All
              </button>
              <button 
                onClick={handleDecline}
                className="flex items-center justify-center rounded-lg border border-[#22201F]/20 dark:border-[#F6F2EA]/20 bg-transparent hover:bg-[#F7F3EC] dark:hover:bg-[#2A2726] text-[#22201F] dark:text-[#F6F2EA] px-4 py-2 text-[13px] font-medium transition-colors min-h-[36px]"
              >
                Essential Only
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
