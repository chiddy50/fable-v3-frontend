"use client"

import { ChapterInterface } from '@/interfaces/ChapterInterface';
import { useState } from 'react';



interface Props {

    direction: string;
    size: string;
    opacity: string;
    disabled: boolean;
    chapter: ChapterInterface;
    handleClick: (chapter: ChapterInterface) => void;
}

const GradientButtonComponent: React.FC<Props> = ({ 
    direction = 'right', 
    size = 'md', 
    disabled = false, 
    opacity = "", 
    handleClick,
    chapter 
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Size classes mapping
    const sizeClasses = {
        sm: { button: 'w-12 h-12', icon: 'w-7 h-7' },
        md: { button: 'w-16 h-16', icon: 'w-6 h-6' },
        lg: { button: 'w-20 h-20', icon: 'w-8 h-8' }
    };

    // Arrow path data based on direction
    const arrowPath = direction === 'right'
        ? "M9 6L15 12L9 18"
        : "M15 6L9 12L15 18";

    

    return (
        <button
            onClick={() => handleClick(chapter)}
            disabled={disabled}
            className={`relative p-[2px] cursor-pointer rounded-2xl overflow-hidden ${sizeClasses[size].button} ${opacity}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gradient border background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#AA4A41] to-[#33164C] rounded-2xl" />

            {/* Inner content background */}
            <div className="absolute inset-[1.8px] bg-white rounded-xl flex items-center justify-center">
                {/* Gradient arrow icon */}
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={sizeClasses[size].icon}
                >
                    <path
                        d={arrowPath}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`${isHovered ? 'stroke-[url(#arrow-gradient-hover)]' : 'stroke-[url(#arrow-gradient)]'}`}
                    />

                    {/* Gradient definitions */}
                    <defs>
                        <linearGradient id="arrow-gradient" x1="9" y1="6" x2="15" y2="18" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#E9827D" />
                            <stop offset="1" stopColor="#D35F55" />
                        </linearGradient>
                        <linearGradient id="arrow-gradient-hover" x1="9" y1="6" x2="15" y2="18" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FF6B61" />
                            <stop offset="1" stopColor="#E04E43" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </button>
    );
};


export default GradientButtonComponent
