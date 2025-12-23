import React from 'react';

export default function Input({ label, id, error, className = "", ...props }) {
    return (
        <div className={`relative ${className}`}>
            <input
                id={id}
                className={`input peer placeholder-transparent pt-6 pb-2 ${error ? 'border-destructive' : ''}`}
                placeholder={label}
                {...props}
            />
            <label
                htmlFor={id}
                className={`absolute left-3 top-4 text-sm text-gray-500 transition-all 
        peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
        peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary pointer-events-none`}
            >
                {label}
            </label>
            {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
        </div>
    );
}
