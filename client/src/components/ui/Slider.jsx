import React from 'react';

const Slider = ({ label, min = 1, max = 100, value, onChange, className = '' }) => {
    // Calculate percentage for background gradient effect
    const percentage = ((value - min) * 100) / (max - min);

    return (
        <div className={`w-full space-y-3 ${className}`}>
            <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
                <span className="font-bold text-blue-600 dark:text-blue-400">{value}</span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${percentage}%` }}
                ></div>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-md pointer-events-none transition-all"
                    style={{ left: `calc(${percentage}% - 8px)` }}
                ></div>
            </div>
        </div>
    );
};

export default Slider;
