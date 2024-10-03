"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, X } from 'lucide-react';

const SampleSelect = ({ options, onChange, value = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedOptions(value);
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const toggleOption = (option) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    
    setSelectedOptions(newSelection);
    onChange(newSelection);
  };

  const handleRemoveOption = (option) => {
    const newSelection = selectedOptions.filter(item => item !== option);
    setSelectedOptions(newSelection);
    onChange(newSelection);
  };

  const availableOptions = useMemo(() => {
    return options.filter(option => !selectedOptions.includes(option));
  }, [options, selectedOptions]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="flex items-center justify-between p-2 border w-full rounded-md cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        tabIndex={0}
      >
        <div className="flex flex-wrap gap-1">
          {selectedOptions.length > 0 ? (
            selectedOptions.map(option => (
              <span key={option} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {option}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveOption(option);
                  }}
                  className="ml-1 text-blue-800 hover:text-blue-900"
                >
                  <X size={14} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400">Select options...</span>
          )}
        </div>
        <ChevronDown size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {availableOptions.length > 0 ? (
            availableOptions.map(option => (
              <li
                key={option}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleOption(option)}
              >
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => {}}
                  className="mr-2"
                />
                {option}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">No more options available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SampleSelect;