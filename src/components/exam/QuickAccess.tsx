import React from 'react';
import { BookOpen, Video, FileSpreadsheet, FileText, HelpCircle, FolderOpen, ArrowRight, Atom } from 'lucide-react';

interface QuickAccessCardProps {
  title: string;
  count?: number;
  unit?: string;
  icon: React.ReactNode;
  onClick: () => void;
  delay?: number;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ title, count, unit, icon, onClick, delay = 0 }) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col justify-between h-[150px] min-w-[200px] w-full flex-1 rounded-[30px] bg-white/70 backdrop-blur-xl border border-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(74,14,27,0.12)] overflow-hidden text-left"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-[#4A0E1B]/20 to-[#C9A13B]/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" style={{ padding: '2px' }}>
        <div className="absolute inset-0 rounded-[28px] bg-white/90 backdrop-blur-md m-[2px]" />
      </div>

      <div className="relative z-10 flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#F7F3EC] text-[#4A0E1B] transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#4A0E1B] group-hover:text-white shadow-sm">
          {icon}
        </span>
        
        {count !== undefined && (
          <span className="dash-mono rounded-full border border-[#EAE1D2] bg-[#FBF7F0] px-3 py-1.5 text-[11px] font-semibold text-[#8A7E6F] transition-colors group-hover:border-[#C9A13B]/30 group-hover:text-[#C9A13B]">
            {count} {unit}
          </span>
        )}
      </div>

      <div className="relative z-10 flex items-end justify-between w-full mt-4">
        <div>
          <h3 className="dash-serif text-[18px] font-bold text-[#22201F] transition-colors group-hover:text-[#4A0E1B]">{title}</h3>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F7F3EC] text-[#4A0E1B] transform translate-x-4 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
          <ArrowRight size={14} />
        </div>
      </div>
      
      {/* Tiny molecule decorative element */}
      <div className="absolute -bottom-6 -right-6 opacity-0 transition-all duration-700 transform rotate-45 scale-50 group-hover:opacity-10 group-hover:rotate-0 group-hover:scale-100 pointer-events-none">
        <Atom size={100} className="text-[#4A0E1B]" />
      </div>
    </button>
  );
}

interface QuickAccessGridProps {
  categories: {
    id: string;
    title: string;
    icon: React.ReactNode;
    count?: number;
    unit?: string;
  }[];
  onSelectCategory: (id: string) => void;
}

export function QuickAccessGrid({ categories, onSelectCategory }: QuickAccessGridProps) {
  return (
    <div className="mt-12 mb-16 animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A7E6F] mb-6 px-2">Quick Access</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, index) => (
          <QuickAccessCard
            key={cat.id}
            title={cat.title}
            count={cat.count}
            unit={cat.unit}
            icon={cat.icon}
            onClick={() => onSelectCategory(cat.id)}
            delay={0.3 + index * 0.1}
          />
        ))}
      </div>
    </div>
  );
}
