"use client";

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ChevronDown, X, Eye, ChevronDownCircle, Check, Search } from 'lucide-react';
import { StoryInterface, TargetAudienceInterface } from '@/interfaces/StoryInterface';
import { GenreInterface } from '@/interfaces/GenreInterface';
import { contentTypeList } from '@/data/contentType';
import { tones } from '@/data/storyTones';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { updateStory } from '@/lib/requests';

// Types
interface DropdownOption {
    value: string;
    label: string;
}

interface StoryDetailsProps {
    title?: string;
    prompt?: string;
    onPreview?: () => void;
    targetAudiences: TargetAudienceInterface[] | [];
    genres: GenreInterface[] | [];
    story: StoryInterface;
    refetch: () => void;
    setStory: React.Dispatch<React.SetStateAction<StoryInterface>>;
}

const StoryDetailsComponent: React.FC<StoryDetailsProps> = ({
    title,
    prompt,
    onPreview,
    targetAudiences,
    genres,
    setStory,
    story,
    refetch
}) => {
    
    // State for dropdown visibility
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
    const [selectedTargetAudience, setSelectedTargetAudience] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedTones, setSelectedTones] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredGenres = genres?.filter(option =>
        option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    const filteredTones = tones?.filter(option =>
        option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    useEffect(() => {
        setSelectedContentType(story?.contentType);

        const audiences = story.storyAudiences?.map((item: any) => item?.targetAudience?.id) ?? [];
        const storyGenres = story.storyGenres?.map((item: any) => item?.storyGenre?.id) ?? [];

        setSelectedTargetAudience(audiences);
        setSelectedGenres(storyGenres);
        setSelectedTones(story.tone ?? [])
    }, [story]);

    // Handlers
    const handleContentTypeChange = useCallback(async (value: string) => {
        console.log({value});
        
        setSelectedContentType(value);
        // setOpenDropdown(null); // Close dropdown after selection
        
        const response = await updateStory({ contentType: value }, story?.id);
        setStory(response?.data?.story ?? story)

        refetch()
    }, []);

    const handleAudienceChange = useCallback(async(audienceValue: string) => {
        const newAudiences = selectedTargetAudience.includes(audienceValue)
            ? selectedTargetAudience.filter(audience => audience !== audienceValue)
            : [...selectedTargetAudience, audienceValue];
        
        // Update state
        setSelectedTargetAudience(newAudiences);
        
        // Call endpoint with the new value immediately
        const response = await updateStory({ selectedTargetAudience: newAudiences }, story?.id);
        setStory(response?.data?.story ?? story)

        refetch()
    }, [selectedTargetAudience]);



    const handleGenreChange = useCallback(async (genreValue: string) => {
        // Calculate the new genres array first
        const isCurrentlySelected = selectedGenres.includes(genreValue);
        
        let newGenres;
        if (isCurrentlySelected) {
            // Remove the genre
            newGenres = selectedGenres.filter(g => g !== genreValue);
        } else {
            // Add the genre (but don't exceed max selection limit of 4)
            if (selectedGenres.length >= 4) {
                newGenres = selectedGenres; // No change, limit reached
            } else {
                newGenres = [...selectedGenres, genreValue];
            }
        }
        
        // Update state
        setSelectedGenres(newGenres);
        
        // Call endpoint with the new value immediately
        let response = await updateStory({ selectedGenres: newGenres }, story?.id);
        setStory(response?.data?.story ?? story)
        
        // Don't close dropdown for multi-select
    }, [selectedGenres]);

    const handleToneChange = useCallback(async (toneValue: string) => {
        const isSelected = selectedTones.includes(toneValue);
        
        const newTones = isSelected
            ? selectedTones.filter(tone => tone !== toneValue)
            : [...selectedTones, toneValue];
        
        // Update state
        setSelectedTones(newTones);
        
        const response = await updateStory({ selectedTones: newTones }, story?.id);
        setStory(response?.data?.story ?? story)

        refetch()
    }, [selectedTones]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        setSearchTerm(e.target.value);
    }, []);

    const clearSearch = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setSearchTerm('');
    }, []);

    // Toggle dropdown
    const toggleDropdown = useCallback((dropdownName: string) => {
        setOpenDropdown(prev => prev === dropdownName ? null : dropdownName);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        if (openDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [openDropdown]);

    const getGenreLabel = (genreValue: string) => {
        return genres?.find((item) => item?.value === genreValue)?.label || genreValue;
    };

    // Dropdown Button Component
    const DropdownButton: React.FC<{
        label: string | React.ReactNode;
        isOpen: boolean;
        onClick: () => void;
        children: React.ReactNode;
        className?: string;
        dropdownName: string;
    }> = ({ label, isOpen, onClick, children, className = "", dropdownName }) => (
        <div className="relative">
            <button
                type="button"
                onClick={onClick}
                className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer bg-[#f4f4f4] transition-colors text-[11px] text-gray-700 ${className}`}
            >
                {label}
                <ChevronDownCircle
                    size={16}
                    className={`transform transition-transform text-gray-700 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div ref={containerRef} className="max-w-4xl mx-auto bg-white rounded-2xl p-4 mb-14">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{title}</h1>
                <div className="flex items-start gap-2 text-gray-600">
                    <span className="text-sm font-bold text-black">Prompt/</span>
                    <span className="text-xs">{prompt}</span>
                </div>
            </div>

            {/* Tags/Dropdowns Row */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Content Type Dropdown */}
                <DropdownButton
                    label={selectedContentType || "Select Content Type"}
                    isOpen={openDropdown === 'contentType'}
                    onClick={() => toggleDropdown('contentType')}
                    dropdownName="contentType"
                >
                    <div className="py-2">
                        <h1 className="px-4 mb-2 text-md font-extrabold text-gray-800 tracking-wide">
                            Content Type
                        </h1>
                        <div className="text-[10px] text-gray-600 px-4 pb-2">
                            Select a type
                        </div>
                        <div className='px-3 flex flex-col gap-2 text-[#3A3A3A]'>
                            {contentTypeList?.map((option) => (
                                <div
                                    key={option?.id}
                                    className={`inline-flex px-2 py-2 bg-[#F5F5F5] rounded-lg cursor-pointer transition-colors items-center justify-between                                        
                                        ${selectedContentType === option?.value ? 'border border-[#FF877B]' : 'border border-transparent hover:border-gray-300'}
                                        `}
                                    onClick={() => handleContentTypeChange(option?.value)}
                                >
                                    <label className="mr-2 text-gray-600 text-[11px] font-medium cursor-pointer">
                                        {option?.label}
                                    </label>
                                    <div className="relative">
                                        <div className={`w-5 h-5 border rounded-md flex items-center justify-center cursor-pointer transition-colors 
                                            ${selectedContentType === option?.value ? 'bg-[#FF877B] border-[#FF877B]' : 'bg-white border-gray-300'}`}
                                        >
                                            {selectedContentType === option?.value && (
                                                <Check size={14} color="white" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </DropdownButton>

                {/* Target Audience Dropdown */}
                <DropdownButton
                    label={
                        <div className='flex items-center gap-2'>
                            <span>Target Audience</span>
                            {selectedTargetAudience.length > 0 && (
                                <span className="bg-[#FF877B] text-white rounded-full px-2 py-0.5 text-[9px]">
                                    {selectedTargetAudience.length}
                                </span>
                            )}
                        </div>
                    }
                    isOpen={openDropdown === 'targetAudience'}
                    onClick={() => toggleDropdown('targetAudience')}
                    dropdownName="targetAudience"
                >
                    <div className="py-2">
                        <h1 className="px-4 mb-2 text-md font-extrabold text-gray-800 tracking-wide">
                            Target Audience
                        </h1>
                        <div className="text-[10px] text-gray-600 px-4 pb-2">
                            Select audience(s)
                        </div>
                        <div className='px-3 flex flex-col gap-2 text-[#3A3A3A]'>
                            {targetAudiences?.map((option) => (
                                <div
                                    key={option?.id}
                                    className={`inline-flex px-2 py-2 bg-[#F5F5F5] rounded-lg cursor-pointer transition-colors items-center justify-between hover:bg-gray-200                                       
                                        ${selectedTargetAudience.includes(option?.value) ? 'border border-[#FF877B]' : 'border border-transparent hover:border-gray-300'}
                                        `}
                                    onClick={() => handleAudienceChange(option?.value)}
                                >
                                    <label className="mr-2 text-gray-600 text-[11px] font-medium cursor-pointer">
                                        {option?.label}
                                    </label>
                                    <div className="relative">
                                        <div className={`w-5 h-5 border rounded-md flex items-center justify-center cursor-pointer transition-colors 
                                            ${selectedTargetAudience.includes(option?.value) ? 'bg-[#FF877B] border-[#FF877B]' : 'bg-white border-gray-300'}`}
                                        >
                                            {selectedTargetAudience.includes(option?.value) && (
                                                <Check size={14} color="white" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </DropdownButton>

                {/* Genre Dropdown */}
                <DropdownButton
                    label={
                        <div className='flex items-center gap-2'>
                            <span>Genre</span>
                            {selectedGenres.length > 0 && (
                                <div className='flex items-center gap-1'>
                                    <span className="bg-[#FF877B] text-white rounded-full px-2 py-0.5 text-[9px]">
                                        {selectedGenres.length}
                                    </span>
                                    <div className='flex items-center gap-1 max-w-20 overflow-hidden'>
                                        {selectedGenres.slice(0, 2).map(item => (
                                            <span key={item} className="text-[9px] text-gray-600 truncate">
                                                {getGenreLabel(item)}
                                            </span>
                                        ))}
                                        {selectedGenres.length > 2 && (
                                            <span className="text-[9px] text-gray-600">...</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                    isOpen={openDropdown === 'genre'}
                    onClick={() => toggleDropdown('genre')}
                    dropdownName="genre"
                >
                    <div className="w-64">
                        <div className="p-3 border-b">
                            <h1 className="mb-2 text-md font-extrabold text-gray-800 tracking-wide">
                                Genre Selection
                            </h1>
                            <div className="text-[10px] text-gray-600 mb-2">
                                Select up to 4 genres
                            </div>
                            
                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search genres..."
                                    className="w-full p-2 pl-8 bg-gray-100 text-xs rounded-md outline-none"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 hover:text-gray-700"
                                        onClick={clearSearch}
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Genre List */}
                        <div className="max-h-64 overflow-y-auto">
                            <div className="p-2 space-y-1">
                                {(searchTerm ? filteredGenres : genres)?.map((genre) => (
                                    <div 
                                        key={genre.id || genre.value} 
                                        onClick={() => handleGenreChange(genre.value)}
                                        className={`flex items-center justify-between px-3 py-2 cursor-pointer rounded-md text-[11px] transition-all hover:bg-gray-100
                                            ${selectedGenres.includes(genre.value) ? "bg-[#FF877B]/10 border border-[#FF877B]" : "border border-transparent hover:border-gray-300"}
                                            ${selectedGenres.length >= 4 && !selectedGenres.includes(genre.value) ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <span className="text-gray-700">{genre.label}</span>
                                        <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors 
                                            ${selectedGenres.includes(genre.value) ? 'bg-[#FF877B] border-[#FF877B]' : 'bg-white border-gray-300'}`}
                                        >
                                            {selectedGenres.includes(genre.value) && (
                                                <Check size={10} color="white" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                                
                                {searchTerm && filteredGenres?.length === 0 && (
                                    <div className="px-3 py-4 text-center text-gray-500 text-xs">
                                        No genres found matching "{searchTerm}"
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Selected Count Footer */}
                        {selectedGenres.length > 0 && (
                            <div className="p-2 border-t bg-gray-50">
                                <div className="text-[10px] text-gray-600">
                                    Selected: {selectedGenres.length}/4
                                </div>
                            </div>
                        )}
                    </div>
                </DropdownButton>

                {/* Tone Dropdown */}
                <DropdownButton
                    label={
                        <div className='flex items-center gap-2'>
                            <span>Tone</span>
                            {selectedTones.length > 0 && (
                                <div className='flex items-center gap-1'>
                                    <span className="bg-[#FF877B] text-white rounded-full px-2 py-0.5 text-[9px]">
                                        {selectedTones.length}
                                    </span>
                                    <div className='flex items-center gap-1 max-w-20 overflow-hidden'>
                                        {selectedTones.slice(0, 2).map(item => (
                                            <span key={item} className="text-[9px] text-gray-600 truncate">
                                                {item}
                                            </span>
                                        ))}
                                        {selectedTones.length > 2 && (
                                            <span className="text-[9px] text-gray-600">...</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                    isOpen={openDropdown === 'tone'}
                    onClick={() => toggleDropdown('tone')}
                    dropdownName="tone"
                >
                    <div className="w-64">
                        <div className="p-3 border-b">
                            <h1 className="mb-2 text-md font-extrabold text-gray-800 tracking-wide">
                                Tone Selection
                            </h1>
                            <div className="text-[10px] text-gray-600 mb-2">
                                Select up to 4 tones
                            </div>
                            
                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search tones..."
                                    className="w-full p-2 pl-8 bg-gray-100 text-xs rounded-md outline-none"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 hover:text-gray-700"
                                        onClick={clearSearch}
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tone List */}
                        <div className="max-h-64 overflow-y-auto">
                            <div className="p-2 space-y-1">
                                {(searchTerm ? filteredTones : tones)?.map((tone) => (
                                    <div 
                                        key={tone?.value} 
                                        onClick={() => handleToneChange(tone.value)}
                                        className={`flex items-center justify-between px-3 py-2 cursor-pointer rounded-md text-[11px] transition-all hover:bg-gray-100
                                            ${selectedTones.includes(tone?.value) ? "bg-[#FF877B]/10 border border-[#FF877B]" : "border border-transparent hover:border-gray-300"}
                                            `}
                                            // ${selectedTones.length >= 4 && !selectedTones.includes(tone?.value) ? 'opacity-50 cursor-not-allowed' : ''}
                                    >
                                        <span className="text-gray-700">{tone?.label}</span>
                                        <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors 
                                            ${selectedTones.includes(tone?.value) ? 'bg-[#FF877B] border-[#FF877B]' : 'bg-white border-gray-300'}`}
                                        >
                                            {selectedTones.includes(tone?.value) && (
                                                <Check size={10} color="white" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                                
                                {searchTerm && filteredTones?.length === 0 && (
                                    <div className="px-3 py-4 text-center text-gray-500 text-xs">
                                        No tones found matching "{searchTerm}"
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Selected Count Footer */}
                        {selectedTones.length > 0 && (
                            <div className="p-2 border-t bg-gray-50">
                                <div className="text-[10px] text-gray-600">
                                    Selected: {selectedTones.length}/4
                                </div>
                            </div>
                        )}
                    </div>
                </DropdownButton>                   
                                      
            </div>
        </div>
    );
};

export default StoryDetailsComponent;