import React from 'react';

interface PremiumCardProps {
  children?: React.ReactNode;
  selected?: boolean;
  accentLine?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large' | 'none-on-mobile';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  id?: string;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
  key?: any;
}

export function PremiumCard({
  children,
  onClick,
  onKeyDown,
  selected = false,
  accentLine = false,
  interactive = false,
  padding = 'large',
  className = '',
  id,
  role,
  tabIndex,
  'aria-label': ariaLabel,
}: PremiumCardProps) {
  const isClickable = !!onClick || interactive;

  // Padding mapping
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-5 sm:p-6',
    large: 'p-5 sm:p-6 md:p-8',
    'none-on-mobile': 'p-0 sm:p-6 md:p-8',
  }[padding];

  // Base card styles
  const baseClasses = 'relative rounded-[22px] border bg-white dark:bg-[#22201F] transition-all duration-250 ease-out group overflow-hidden';
  
  // Dynamic styles based on states
  const borderClasses = selected
    ? 'border-[#22201F] dark:border-[#F6F2EA]/20'
    : isClickable
    ? 'border-[#22201F]/15 dark:border-[#F6F2EA]/10 hover:border-[#22201F] dark:hover:border-[#F6F2EA]/30'
    : 'border-[#22201F]/15 dark:border-[#F6F2EA]/10';

  const bgClasses = selected
    ? 'bg-[#FBF7F0] dark:bg-[#1A1817]'
    : 'bg-white dark:bg-[#22201F]';

  const shadowClasses = selected
    ? 'shadow-[0_12px_32px_rgba(34,32,31,0.08)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)]'
    : isClickable
    ? 'shadow-[0_8px_30px_rgba(34,32,31,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_18px_40px_rgba(34,32,31,0.08)] dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.5)]'
    : 'shadow-[0_8px_30px_rgba(34,32,31,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]';

  const transformClasses = isClickable
    ? 'hover:-translate-y-1 hover:transform-gpu cursor-pointer'
    : '';

  const focusClasses = isClickable
    ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A13B] focus-visible:ring-offset-2'
    : '';

  // Header gold accent line (extremely subtle luxury detail)
  const accentLineElement = accentLine && (
    <span 
      className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#C9A13B]/55 to-transparent pointer-events-none"
      aria-hidden="true"
    />
  );

  // Focus and keydown handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    } else if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e as any);
    }
  };

  return (
    <div
      id={id}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={role || (isClickable ? 'button' : undefined)}
      tabIndex={tabIndex !== undefined ? tabIndex : (isClickable ? 0 : undefined)}
      aria-label={ariaLabel}
      className={`${baseClasses} ${borderClasses} ${bgClasses} ${shadowClasses} ${transformClasses} ${focusClasses} ${paddingClasses} ${className}`}
    >
      {accentLineElement}
      {children}
    </div>
  );
}

// Subcomponents

// Icon wrapper
interface CardIconProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
PremiumCard.Icon = function CardIcon({ children, className = '', style }: CardIconProps) {
  return (
    <div 
      style={style}
      className={`w-12 h-12 flex items-center justify-center rounded-[14px] bg-[#F7F3EC] dark:bg-[#1A1817] border border-[#22201F]/15 dark:border-[#F6F2EA]/10 text-[#22201F] dark:text-[#F6F2EA] shrink-0 transition-all duration-250 group-hover:shadow-[0_0_12px_rgba(34,32,31,0.08)] dark:group-hover:shadow-[0_0_12px_rgba(0,0,0,0.4)] group-hover:border-[#22201F] dark:group-hover:border-[#F6F2EA]/30 group-hover:text-[#4A0E1B] ${className}`}
    >
      {children}
    </div>
  );
};

// Category label
interface CardCategoryProps {
  children: React.ReactNode;
  className?: string;
}
PremiumCard.Category = function CardCategory({ children, className = '' }: CardCategoryProps) {
  return (
    <span className={`block text-xs font-bold uppercase tracking-[0.12em] text-[#C9A13B] ${className}`}>
      {children}
    </span>
  );
};

// Title
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}
PremiumCard.Title = function CardTitle({ children, className = '', as = 'h3' }: CardTitleProps) {
  const Component = as;
  return (
    <Component className={`block text-lg md:text-xl font-[650] text-[#22201F] dark:text-[#F6F2EA] tracking-tight leading-snug ${className}`}>
      {children}
    </Component>
  );
};

// Description
interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}
PremiumCard.Description = function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`text-[15px] font-normal text-[#22201F] dark:text-[#F6F2EA]/70 leading-relaxed ${className}`}>
      {children}
    </p>
  );
};

// Metadata
interface CardMetadataProps {
  children: React.ReactNode;
  className?: string;
}
PremiumCard.Metadata = function CardMetadata({ children, className = '' }: CardMetadataProps) {
  return (
    <span className={`text-[13px] text-[#22201F] dark:text-[#F6F2EA]/60 ${className}`}>
      {children}
    </span>
  );
};

// Footer wrapper
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  noDivider?: boolean;
}
PremiumCard.Footer = function CardFooter({ children, className = '', noDivider = false }: CardFooterProps) {
  const dividerClass = noDivider ? '' : 'border-t border-[#22201F]/20 mt-5 pt-4';
  return (
    <div className={`${dividerClass} flex items-center justify-between gap-4 flex-wrap ${className}`}>
      {children}
    </div>
  );
};
