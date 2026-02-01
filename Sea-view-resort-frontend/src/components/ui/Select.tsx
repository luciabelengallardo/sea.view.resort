import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  value?: string; // Agrego esta prop para modo controlado
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

const SelectContext = React.createContext<{
  isOpen: boolean;
  selectedValue: string;
  onSelect: (value: string) => void;
  onToggle: () => void;
}>({
  isOpen: false,
  selectedValue: '',
  onSelect: () => { },
  onToggle: () => { }
});

export function Select({ children, onValueChange, defaultValue = '', value }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value !== undefined ? value : internalValue; // Usa value si proporcionado, sino internal
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    if (value !== undefined) {
      setInternalValue(value);
    }
    setIsOpen(false);
    onValueChange?.(value);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SelectContext.Provider value={{ isOpen, selectedValue, onSelect: handleSelect, onToggle: handleToggle }}>
      <div className="relative" ref={selectRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  const { isOpen, onToggle } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      className={clsx(
        'flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-resort-olive focus:border-resort-olive disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={onToggle}
    >
      {children}
      <ChevronDown className={clsx('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
    </button>
  );
}

export function SelectContent({ children }: SelectContentProps) {
  const { isOpen } = React.useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
      {children}
    </div>
  );
}

export function SelectItem({ value, children }: SelectItemProps) {
  const { onSelect, selectedValue } = React.useContext(SelectContext);

  return (
    <div
      className={clsx(
        'px-3 py-2 text-sm cursor-pointer hover:bg-resort-cream',
        selectedValue === value && 'bg-resort-cream'
      )}
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { selectedValue } = React.useContext(SelectContext);

  const formatLabel = (text: string) => {
    return text.replace(/(^|[\s-_])([a-z])/g, (match, prefix: string, char: string) => `${prefix}${char.toUpperCase()}`);
  };

  return (
    <span className={clsx('flex-1 min-w-0 truncate', !selectedValue && 'text-gray-500')}>
      {selectedValue ? formatLabel(selectedValue) : placeholder}
    </span>
  );
}
