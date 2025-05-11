"use client"

import { Check } from 'lucide-react'
import React from 'react'

interface Props {
    option: string;
    selectedOption: string;
    handleTypeSelect: (option: string) => void;
}

const CustomRadioSelector: React.FC<Props> = ({
    option,
    selectedOption,
    handleTypeSelect
}) => {
    return (
        <button
            className={`flex items-center justify-between gap-2 py-2 px-4 border rounded-lg cursor-pointer bg-[#F5F5F5] ${selectedOption === option
                    ? 'border-[#FF877B]'
                    : 'border-[#F5F5F5]'
                }`}
            onClick={() => handleTypeSelect(option)}
        >
            <span className="text-gray-700 text-xs font-light capitalize">{option}</span>
            {selectedOption === option && (
                <div className="flex items-center justify-center w-5 h-5 border border-[#FF877B] bg-[#FF877B] rounded-md">
                    <Check size={16} color="white" />
                </div>
            )}
            {selectedOption !== option && (
                <div className="flex items-center justify-center w-5 h-5 border border-[#CFD3D4] rounded-md"></div>
            )}
        </button>
    )
}

export default CustomRadioSelector
