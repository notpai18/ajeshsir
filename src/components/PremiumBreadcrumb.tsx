import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface PremiumBreadcrumbProps {
  items: BreadcrumbItem[];
  backLabel?: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export function PremiumBreadcrumb({
  items,
  backLabel,
  onBack,
  rightContent,
  className = '',
}: PremiumBreadcrumbProps) {
  return (
    <div
      className={`relative w-full flex flex-col md:flex-row items-center justify-between mt-[-30px] mb-[20px] px-2 py-1.5 rounded-full bg-white/[0.03] backdrop-blur-md border border-[#E5E0D8]/40 shadow-sm ${className}`}
    >
      <div className="flex-1 w-full overflow-x-auto scrollbar-hide py-1">
        <div className="flex items-center gap-[10px] min-w-max px-1">
          
          {/* Premium Back Button */}
          {onBack && backLabel && (
            <>
              <button
              onClick={onBack}
              className="group flex items-center gap-2 h-[30px] px-[16px] rounded-full bg-white/80 backdrop-blur-sm border border-[#E5E0D8] shadow-sm transition-all duration-250 ease-out hover:-translate-x-[2px] hover:border-[#D4AF37] hover:shadow-md cursor-pointer mr-2"
              style={{ transform: 'translateZ(0)' }} // GPU acceleration
            >
              <ArrowLeft size={16} strokeWidth={1.75} className="text-[#333333] transition-transform group-hover:-translate-x-1" />
              <span className="text-[13px] font-medium tracking-wide text-[#555555] group-hover:text-[#333333]">
                {backLabel}
              </span>
            </button>
            
            {/* Vertical Separator */}
            {items.length > 0 && (
              <div className="h-[20px] w-[1px] bg-[#E5E0D8] dark:bg-[#4A433E] mx-2" />
            )}
          </>
          )}

          {/* Breadcrumb Items */}
          {items.length > 0 && (
            <div className="flex items-center gap-[10px]">
              {items.map((item, index) => {
                const isLast = index === items.length - 1;
                
                return (
                  <React.Fragment key={item.id}>
                    <button
                      onClick={item.onClick}
                      disabled={isLast || !item.onClick}
                      className={`group relative flex items-center gap-2 min-h-[30px] py-1 px-[14px] rounded-full text-[13px] font-medium transition-all duration-250 ease-out shadow-sm
                        ${
                          isLast
                            ? 'bg-[#701023] border border-[#701023] text-white cursor-default shadow-[0_0_10px_rgba(112,16,35,0.25)]'
                            : 'bg-white border border-[#E5E0D8] text-[#333333] hover:border-[#D4AF37] hover:text-[#701023] hover:-translate-y-[2px] hover:shadow-md cursor-pointer'
                        }`}
                      style={{
                        transform: 'translateZ(0)',
                        animation: 'fadeInUp 0.3s ease-out forwards',
                        animationDelay: `${index * 0.05}s`,
                        opacity: 0,
                      }}
                    >
                      {item.icon && (
                        <span className={`transition-transform duration-250 ${!isLast ? 'group-hover:scale-110' : ''}`}>
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </button>

                    {/* Separator */}
                    {!isLast && (
                      <span className="text-[#C1B8A8] flex items-center justify-center">
                        <ChevronRight size={14} strokeWidth={1.75} />
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Right Optional Content (Metadata) */}
      {rightContent && (
        <div className="flex-shrink-0 ml-4 px-2" style={{ animationDelay: '0.2s', opacity: 0, animation: 'fadeInUp 0.4s ease-out forwards' }}>
          {rightContent}
        </div>
      )}

      {/* Global utility for hiding scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
