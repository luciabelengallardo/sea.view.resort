import React from 'react';
import { clsx } from 'clsx';

interface AvatarProps {
  children: React.ReactNode;
  className?: string;
}

export function Avatar({ children, className }: AvatarProps) {
  return (
    <div className={clsx('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}>
      {children}
    </div>
  );
}

interface AvatarImageProps {
  src?: string;
  alt?: string;
}

export function AvatarImage({ src, alt }: AvatarImageProps) {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt ?? ''}
      className="aspect-square h-full w-full object-cover"
    />
  );
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
}

export function AvatarFallback({ children, className }: AvatarFallbackProps) {
  return (
    <div className={clsx('flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600', className)}>
      {children}
    </div>
  );
}

