import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({
    open,
    onClose,
    size = 'md',
    children,
    overlayClassName = '',
    containerClassName = '',
    lockScroll = false,
    trapFocus = false,
    initialFocusRef
}) {
    const containerRef = useRef(null);
    const previouslyFocusedElementRef = useRef(null);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose?.();
            if (trapFocus && e.key === 'Tab') {
                const root = containerRef.current;
                if (!root) return;
                const focusable = root.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                const focusables = Array.from(focusable);
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                const active = document.activeElement;
                if (e.shiftKey) {
                    if (active === first || !root.contains(active)) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (active === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [open, onClose, trapFocus]);

    // Lock body scroll optionally
    useEffect(() => {
        if (!open || !lockScroll) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [open, lockScroll]);

    // Manage focus when opening/closing
    useEffect(() => {
        if (!open) return;
        previouslyFocusedElementRef.current = document.activeElement;
        // focus initial element or first focusable, else container
        const root = containerRef.current;
        if (!root) return;
        const preferred = initialFocusRef?.current;
        const focusable = root.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const first = preferred || (focusable.length ? focusable[0] : root);
        setTimeout(() => {
            if (first && typeof first.focus === 'function') first.focus();
        }, 0);

        return () => {
            const prev = previouslyFocusedElementRef.current;
            if (prev && typeof prev.focus === 'function') prev.focus();
        };
    }, [open, initialFocusRef]);

    if (!open) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-[95vw]'
    };

    const content = (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${overlayClassName}`}
            onClick={() => onClose?.()}
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={containerRef}
                className={`w-full ${sizeClasses[size] || sizeClasses.md} mx-auto max-h-[90vh] overflow-y-auto transform transition-all outline-none ${containerClassName}`}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                {children}
            </div>
        </div>
    );

    return createPortal(content, document.body);
}


