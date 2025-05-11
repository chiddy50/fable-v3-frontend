"use client"

import React from 'react'

interface Props {  
    children: React.ReactNode;
    handleClick: () => void;
}

const GradientButton: React.FC<Props>  = ({
    handleClick,
    children
}) => {
    return (
        <button
            onClick={handleClick}
            className="flex items-center cursor-pointer gap-2 py-3 px-3 text-white rounded-xl bg-gradient-to-r from-[#33164C] to-[#AA4A41] hover:bg-gradient-to-l transition-all"
        >
            {children}       
        </button>
    )
}

export default GradientButton
