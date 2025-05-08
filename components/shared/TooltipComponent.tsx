"use client"

import React from 'react'


interface Props {
    showTooltip: boolean;
    text: string;
    size?: number;
    tooltipDistance?: number;
}


export const TooltipComponent: React.FC<Props> = ({
    showTooltip,
    text,
    size = 40,
    tooltipDistance = 12
}) => {
    return (
        <div
            className={`absolute bg-white rounded-xl px-3 py-2 shadow-lg border border-gray-100 text-xs z-70 transition-all duration-300 ${showTooltip ? 'opacity-100 text-black translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
                }`}
            style={{
                left: `calc(${size}px + ${tooltipDistance}px)`,
                top: '50%',
                transform: 'translateY(-50%)',
                width: "max-content"
            }}
        >
            {text}
            {/* Left-pointing triangle */}
            <div
                className="absolute w-2 h-2 bg-white transform rotate-45 border-l border-b border-gray-100"
                style={{
                    left: '-5px',
                    top: '50%',
                    marginTop: '-4px'
                }}
            ></div>
        </div>
    )
}
