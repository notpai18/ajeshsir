import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface BreadcrumbBarProps {
  items: BreadcrumbItem[];
  backLabel?: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export function BreadcrumbBar({ items, backLabel, onBack, rightContent, className = 'mb-8' }: BreadcrumbBarProps) {
  return (
    <div className={`flex flex-col md:flex-row items-center justify-between w-full min-h-[56px] animate-[fadeInUp_0.4s_ease-out_forwards] ${className}`}>
      {/* Scrollable Container for Mobile/Tablet */}
      <div className="flex-1 w-full overflow-x-auto scrollbar-hide py-1">
        <div className="flex items-center gap-3 min-w-max">
          
          {/* Premium Standalone Back Button */}
          {onBack && backLabel && (
            <button
              onClick={onBack}
              className="group flex items-center gap-2 bg-white rounded-[16px] border border-[#D9C2A2] px-[14px] py-[7px] shadow-sm transition-all duration-250 ease-out hover:-translate-y-[2px] hover:border-[#C9A13B] hover:shadow-md cursor-pointer mr-2"
            >
              <ArrowLeft size={16} className="text-[#4A0E1B] transition-transform group-hover:-translate-x-1" />
              <span className="text-[12px] font-semibold tracking-wide text-[#8A7E6F] group-hover:text-[#4A0E1B]">{backLabel}</span>
            </button>
          )}

          {/* Breadcrumb Items */}
          {items.length > 0 && (
            <div className="flex items-center gap-3">
              {items.map((item, index) => {
                const isLast = index === items.length - 1;
                
                return (
                  <React.Fragment key={item.id}>
                    {/* Breadcrumb Chip */}
                    <button
                      onClick={item.onClick}
                      disabled={isLast || !item.onClick}
                      className={`group relative flex items-center gap-1.5 rounded-[14px] border px-[14px] py-[7px] text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-250 ease-out shadow-sm
                        ${isLast 
                          ? 'bg-[#4A0E1B] border-[#4A0E1B] text-white shadow-md' 
                          : 'bg-white border-[#D9C2A2] text-[#4A0E1B] hover:border-[#C9A13B] hover:scale-[1.03] hover:-translate-y-[2px] hover:shadow-md cursor-pointer'
                        }`}
                      style={{ 
                        animation: 'fadeInUp 0.3s ease-out forwards',
                        animationDelay: `${index * 0.05}s`,
                        opacity: 0 
                      }}
                    >
                      {index === 0 && item.icon && (
                        <span className={`transition-transform duration-250 ${!isLast ? 'group-hover:scale-110' : ''}`}>
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </button>

                    {/* Separator */}
                    {!isLast && (
                      <span className="text-[#D9C2A2] opacity-70">
                        <ChevronRight size={14} strokeWidth={2.5} />
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
        <div className="flex-shrink-0 ml-4 animate-[fadeInUp_0.4s_ease-out_forwards]" style={{ animationDelay: '0.2s', opacity: 0 }}>
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
      `}</style>
    </div>
  );
}
