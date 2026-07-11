import React, { ReactNode } from 'react';
import { SUBJECT_BADGE } from '../../constants/subjects';

export interface ResourceAction {
  icon: React.ElementType;
  label?: string;
  onClick: (e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon-only';
}

interface ResourceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  chapter: string;
  subject: string;
  badges?: ReactNode[];
  metadata: ReactNode[];
  actions: ResourceAction[];
  image?: string; // For videos
}

export function SubjectBadge({ subject }: { subject: string }) {
  const s = SUBJECT_BADGE[subject as keyof typeof SUBJECT_BADGE];
  if (!s) return <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A7E6F] dark:text-[#A89F91]">{subject}</span>;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.emoji} {s.label}
    </span>
  );
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  icon: Icon,
  title,
  description,
  chapter,
  subject,
  badges = [],
  metadata = [],
  actions = [],
  image
}) => {
  return (
    <div className="flex flex-col p-5 group transition-all duration-[220ms] hover:-translate-y-1 hover:shadow-[0_12px_24px_-12px_rgba(34,32,31,0.15)] rounded-[28px] border border-[#22201F]/15 dark:border-[#F6F2EA]/10 bg-white dark:bg-[#22201F] shadow-[0_1px_2px_rgba(34,32,31,0.04),0_18px_36px_-26px_rgba(34,32,31,0.35)]">
      {image && (
        <div className="relative aspect-video w-full overflow-hidden bg-[#EFE7D8] rounded-2xl mb-4">
          <img
            src={image}
            alt={title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex items-start gap-3">
        {!image && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4E7E5] dark:bg-[#38151A] text-[#4A0E1B] transition-colors group-hover:bg-[#4A0E1B] group-hover:text-white">
            <Icon size={18} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-block rounded-full border border-[#EFE7D8] dark:border-[#F6F2EA]/10 bg-[#FBF7F0] dark:bg-[#2A2726] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#8A7E6F] dark:text-[#A89F91]">
              {chapter}
            </span>
            <SubjectBadge subject={subject} />
            {badges.map((badge, idx) => (
              <React.Fragment key={idx}>{badge}</React.Fragment>
            ))}
          </div>
          <h4 className="text-sm font-bold text-[#22201F] dark:text-[#F6F2EA] line-clamp-2 group-hover:text-[#4A0E1B] transition-colors">
            {title}
          </h4>
        </div>
      </div>
      
      <p className="mt-3 text-xs leading-relaxed text-[#8A7E6F] dark:text-[#A89F91] line-clamp-2 min-h-[2.5rem]">
        {description}
      </p>
      
      <div className="mt-4 flex items-center justify-between border-t border-[#F2ECDF] dark:border-[#383330] pt-4">
        <div className="flex flex-col gap-0.5">
          {metadata.map((meta, idx) => (
            <span key={idx} className="dash-mono text-[10px] text-[#A79A88]">
              {meta}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {actions.map((action, idx) => {
            const ActionIcon = action.icon;
            
            if (action.variant === 'primary' || (!action.variant && action.label)) {
              return (
                <button 
                  key={idx} 
                  onClick={action.onClick}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4A0E1B] px-3 py-1.5 text-[11px] font-bold tracking-wide text-white transition-colors hover:bg-[#380A14]"
                >
                  <ActionIcon size={12} /> {action.label}
                </button>
              );
            }
            if (action.variant === 'secondary') {
              return (
                <button 
                  key={idx} 
                  onClick={action.onClick}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F4E7E5] dark:bg-[#38151A] px-3 py-1.5 text-[11px] font-bold text-[#4A0E1B] transition-colors hover:bg-[#EEDAD7]"
                >
                  <ActionIcon size={12} /> {action.label}
                </button>
              );
            }
            if (action.variant === 'ghost') {
              return (
                <button 
                  key={idx} 
                  onClick={action.onClick}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E3D8C5] bg-white dark:bg-[#22201F] px-3 py-1.5 text-[11px] font-semibold text-[#6E645A] transition-colors hover:bg-[#F6F2EA] dark:bg-[#1A1817] hover:text-[#22201F] dark:text-[#F6F2EA]"
                >
                  <ActionIcon size={12} /> {action.label}
                </button>
              );
            }
            
            // Icon only (default for single actions in notes)
            return (
              <button 
                key={idx} 
                onClick={action.onClick} 
                title={action.label}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E3D8C5] bg-white dark:bg-[#22201F] text-[#6E645A] transition-colors hover:bg-[#F6F2EA] dark:bg-[#1A1817] hover:text-[#22201F] dark:text-[#F6F2EA]"
              >
                <ActionIcon size={14} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
