import React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef<HTMLDivElement, { children: React.ReactNode, className?: string, key?: React.Key, id?: string }>(
  ({ children, className, id }, ref) => (
    <div ref={ref} id={id} className={cn("ghost-card p-6", className)}>
      {children}
    </div>
  )
);
Card.displayName = "Card";

export const Badge = ({ children, variant = 'default', className, onClick }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'info' | 'outline', className?: string, onClick?: () => void }) => {
  const variants = {
    default: 'bg-white/10 text-slate-400',
    success: 'bg-ghost-accent/20 text-ghost-accent border border-ghost-accent/30',
    warning: 'bg-amber-500/20 text-amber-500 border border-amber-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    outline: 'bg-transparent border border-white/10 text-slate-400',
  };
  return (
    <span 
      onClick={onClick}
      className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest", variants[variant], onClick ? "cursor-pointer hover:bg-white/20 transition-colors" : "", className)}
    >
      {children}
    </span>
  );
};

export const Button = ({ children, onClick, className, disabled, variant = 'default' }: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  className?: string,
  disabled?: boolean,
  variant?: 'default' | 'ghost' | 'danger'
}) => {
  const variants = {
    default: 'bg-white text-black hover:bg-white/90',
    ghost: 'bg-transparent border border-white/10 text-white hover:bg-white/5',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
  };
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn("px-4 py-2 rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 disabled:opacity-50", variants[variant], className)}
    >
      {children}
    </button>
  );
};
