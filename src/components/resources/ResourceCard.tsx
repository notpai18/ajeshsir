import React, { ReactNode } from 'react';

export interface ResourceAction {
  icon: React.ElementType;
  label?: string;
  onClick: (e: React.MouseEvent) => void;
}

interface ResourceCardProps {
  title: string;
  description: string;
  chapter: string;
  subject: string;
  actions: ResourceAction[];
  image?: string; // For videos
  onClick?: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  description,
  chapter,
  subject,
  actions = [],
  image,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col group transition-all duration-[250ms] hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] rounded-[18px] border border-[#F2EEE8] dark:border-[#383330] hover:border-[#EAE4DB] dark:hover:border-[#4A4541] bg-white dark:bg-[#22201F] shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden h-full ${onClick ? 'cursor-pointer' : ''}`}
    >
      {image && (
        <div className="relative aspect-video w-full overflow-hidden bg-[#F9F7F5] dark:bg-[#1A1817]">
          <img
            src={image}
            alt={title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="mb-[8px] flex flex-col gap-[2px]">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#C9A13B]">
            {subject}
          </span>
          {chapter && (
            <span className="text-[12px] font-medium text-[#A89F91]">
              {chapter}
            </span>
          )}
        </div>
        
        <h4 className="text-[20px] font-bold text-[#22201F] dark:text-[#F6F2EA] leading-tight line-clamp-2 mb-[8px]">
          {title}
        </h4>
        
        <p className="text-[15px] leading-relaxed text-[#8A7E6F] dark:text-[#A89F91] line-clamp-2 mb-6">
          {description}
        </p>
        
        <div className="mt-auto flex items-center justify-end gap-[8px]">
          {actions.map((action, idx) => {
            const ActionIcon = action.icon;
            return (
              <button 
                key={idx} 
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(e);
                }}
                className="inline-flex items-center justify-center gap-[6px] rounded-[8px] border border-[#E3D8C5] dark:border-[#4A4541] bg-transparent px-[14px] h-[34px] text-[14px] font-medium text-[#6B5D54] dark:text-[#A89F91] transition-all hover:bg-[#F9F7F5] dark:hover:bg-[#2A2726] hover:text-[#22201F] dark:hover:text-[#F6F2EA] hover:scale-[1.03]"
              >
                <ActionIcon size={14} /> {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
