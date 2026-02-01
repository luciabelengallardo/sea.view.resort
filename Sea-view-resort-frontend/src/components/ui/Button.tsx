import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outlineWhite' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  radius = 'lg',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-resort-olive text-white hover:bg-resort-olive/90 focus:ring-resort-olive',
    secondary: 'bg-resort-taupe text-white hover:bg-resort-taupe/90 focus:ring-resort-taupe',
    outline: 'border border-resort-olive text-resort-olive hover:bg-resort-olive hover:text-white focus:ring-resort-olive',
    outlineWhite: 'border border-white text-white hover:bg-white hover:text-resort-olive focus:ring-white',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500'
  } as const;

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg'
  };

  const radii = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  } as const;

  return (
    <button
      className={clsx(baseClasses, variants[variant], sizes[size], radii[radius], className)}
      type={props.type ?? 'button'}
      {...props}
    >
      {children}
    </button>
  );
}
