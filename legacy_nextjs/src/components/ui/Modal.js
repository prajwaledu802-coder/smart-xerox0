"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, title, children }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    // Handle click outside
    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    // Use a state to track mounting for portal safety
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="w-full max-w-lg bg-card text-card-foreground rounded-lg shadow-xl border border-border m-4 animate-scale-up max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-secondary rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
