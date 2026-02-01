import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={clsx(
          'flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm appearance-none placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-resort-olive focus:border-resort-olive disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
