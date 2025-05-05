"use client";

// components/MultiSelectDropdown.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { GenreInterface } from '@/interfaces/GenreInterface';

export interface OptionItem {
    value: string | number;
    label: string;

    id?: number| string;
    name?: string;
    description?: string;
}

interface MultiSelectDropdownProps {
    options: GenreInterface[]; // OptionItem[];
    selectedValues: (string | number)[];
    onChange: (values: (string | number)[]) => void;
    placeholder?: string;
    maxSelections?: number;
    title?: string;
    className?: string;
}

const MultiSelectDropdownComponent: React.FC<MultiSelectDropdownProps> = ({
    options,
    selectedValues,
    onChange,
    placeholder = 'Select',
    maxSelections,
    title,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter options based on search term
    const filteredOptions = options?.filter(option =>
        option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleOption = (value: string | number) => {
        const isSelected = selectedValues?.includes(value);

        if (isSelected) {
            // Remove the value
            onChange(selectedValues?.filter(v => v !== value));
        } else {
            // Check if adding would exceed max selections
            if (maxSelections !== undefined && selectedValues?.length >= maxSelections) {
                return; // Don't add if max selections reached
            }
            // Add the value
            onChange([...selectedValues, value]);
        }
    };

    const clearSelections = () => {
        onChange([]);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {title && (
                <div className="flex items-center mb-2 capitalize">
                    <span className="text-md font-bold">{title}</span>
                    {maxSelections !== undefined && (
                        <span className="ml-2 text-gray-500 text-xs">({maxSelections} Maximum)</span>
                    )}
                </div>
            )}

            <div
                className="flex items-center justify-between bg-[#F5F5F5] rounded-lg px-3 py-2 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex-1 overflow-hidden">
                    {selectedValues?.length === 0 ? (
                        <span className="text-gray-500 text-xs">{placeholder}</span>
                    ) : (
                        <div className="flex flex-wrap gap-1">
                            {selectedValues?.map((value) => {
                                const option = options?.find(opt => opt?.value === value);
                                return option ? (
                                    <div
                                        key={value}
                                        className="bg-gray-200 rounded-full px-3 py-1 flex items-center text-xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleOption(value);
                                        }}
                                    >
                                        {option.label}
                                        <X className="ml-1 h-4 w-4" />
                                    </div>
                                ) : null;
                            })}
                        </div>
                    )}
                </div>
                <div className="flex items-center">
                    {selectedValues?.length > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearSelections();
                            }}
                            className="mr-2"
                        >
                            <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </button>
                    )}
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2 border-b">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full p-2 pl-8 bg-gray-100 text-sm rounded-md"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            {searchTerm && (
                                <X
                                    className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSearchTerm('');
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions?.length === 0 ? (
                            <div className="p-3 text-center text-gray-500">No results found</div>
                        ) : (
                            filteredOptions?.map((option) => {
                                const isSelected = selectedValues?.includes(option?.value);
                                return (
                                    <div
                                        key={option?.value}
                                        className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-gray-50' : ''
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleOption(option?.value);
                                        }}
                                    >
                                        <div className={`w-5 h-5 border rounded flex items-center justify-center mr-2 ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                            }`}>
                                            {isSelected && <Check className="h-4 w-4 text-white" />}
                                        </div>
                                        <span className='text-xs'>{option?.label}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdownComponent;