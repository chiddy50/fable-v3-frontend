"use client"

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, HelpCircle, User, Sparkles, Edit3 } from 'lucide-react';
import GradientButton from '@/components/shared/GradientButton';
import Image from 'next/image';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { SynopsisInterface } from '@/interfaces/SynopsisInterface';
import generateCharacterPrompt from '@/data/prompts/generateCharacterPrompt';
import { GenerateCharacterInterface } from '@/interfaces/prompts/GenerateCharacterInterface';
import axios from 'axios';
import { toast } from 'sonner';

interface CharacterRoleSelectorProps {
    value: string;
    onChange: (role: string) => void;
    placeholder?: string;
    disabled?: boolean;
    story: StoryInterface;
    characterRole: string;
    setShowChooseCharacterRoleModal: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenCharacterSuggestionsModal: React.Dispatch<React.SetStateAction<boolean>>;
    setSuggestedCharacters: React.Dispatch<React.SetStateAction<[]>>;
}

const CHARACTER_ROLES = [
    // Primary Roles
    { category: "Primary Roles", roles: ["Protagonist", "Antagonist", "Hero", "Anti-Hero"] },

    // Supporting Roles
    { category: "Supporting Roles", roles: ["Mentor", "Sidekick", "Ally", "Confidant", "Guide"] },

    // Opposing Forces
    { category: "Opposing Forces", roles: ["Villain", "Rival", "Enemy", "Nemesis", "Competitor", "Obstacle"] },

    // Relationship Roles
    { category: "Relationship Roles", roles: ["Love Interest", "Best Friend", "Family Member", "Spouse", "Parent", "Child", "Sibling"] },

    // Functional Roles
    { category: "Functional Roles", roles: ["Narrator", "Comic Relief", "Voice of Reason", "Catalyst", "Messenger", "Guardian"] },

    // Authority Figures
    { category: "Authority Figures", roles: ["Leader", "Boss", "Teacher", "Judge", "Elder", "Commander", "Captain"] },

    // Mysterious/Special
    { category: "Mysterious & Special", roles: ["Mystery Person", "Stranger", "Oracle", "Prophet", "Wise One", "Shapeshifter"] },

    // Story Function
    { category: "Story Function", roles: ["Red Herring", "Foil", "Threshold Guardian", "Herald", "Trickster", "Scapegoat"] }
];

const CharacterRoleSelector: React.FC<CharacterRoleSelectorProps> = ({
    value,
    onChange,
    placeholder = "Select or type a character role...",
    disabled = false,
    story,
    characterRole,
    setShowChooseCharacterRoleModal,
    setOpenCharacterSuggestionsModal,
    setSuggestedCharacters
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [loadingCharacters, setLoadingCharacters] = useState<boolean>(false);

    const [activeSynopsis, setActiveSynopsis] = useState<SynopsisInterface|null>(null);

    useEffect(() => {
        let synopsis = story.synopsisList?.find(synopsis => synopsis?.active === true);
        setActiveSynopsis(synopsis ?? null)
        
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Check if current value is a predefined role
    const allRoles = CHARACTER_ROLES.flatMap(category => category.roles);
    const isPredefinedRole = allRoles.includes(value);

    // Filter roles based on search term
    const filteredCategories = CHARACTER_ROLES.map(category => ({
        ...category,
        roles: category.roles.filter(role =>
            role.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.roles.length > 0);

    const handleRoleSelect = (role: string) => {
        onChange(role);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleCustomInput = (customRole: string) => {
        onChange(customRole);
        setSearchTerm(customRole);
    };

    const toggleCustomMode = () => {
        setIsCustomMode(!isCustomMode);
        setIsOpen(false);
        if (!isCustomMode) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const generateCharacterSuggestions = async () => {
        let payload: GenerateCharacterInterface = { ...activeSynopsis, characterRole, storyStructure: story?.structure }

        const prompt = generateCharacterPrompt(payload);
        console.log(prompt);

        console.log({
            activeSynopsis, 
            story, 
            characterRole
        });

        try {
            setLoadingCharacters(true)
            let res = await axios.post(`/api/json-llm-response`, { prompt, type: "generate-character" } );
            console.log(res);
            setSuggestedCharacters(res?.data?.characters)
            setShowChooseCharacterRoleModal(false)
            setOpenCharacterSuggestionsModal(true)
        } catch (error) {
            console.error(error);            
            toast.error("Please try again!")
        }finally{
            setLoadingCharacters(false)
        }
    }

    return (
        <div className="w-full space-y-2">
            {/* Label with Tooltip */}
            <div className="flex items-center gap-2">
                <label className="text-md font-bold text-gray-900">
                    What role will this character play?
                </label>
                <button
                    type="button"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-gray-400 relative cursor-pointer hover:text-gray-600 transition-colors"
                >
                    <HelpCircle className="w-4 h-4" />
                    {showTooltip && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-100">
                            The role helps define how the character serves your story
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                    )}
                </button>
            </div>

            {/* Main Input Area */}
            <div className="relative" ref={dropdownRef}>
                {isCustomMode ? (
                    /* Custom Input Mode */
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={value}
                            onChange={(e) => handleCustomInput(e.target.value)}
                            placeholder="Type your custom character role..."
                            disabled={disabled}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#AA4A41] focus:ring-1 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                        <button
                            type="button"
                            onClick={toggleCustomMode}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <ChevronDown className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    /* Dropdown Mode */
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            disabled={disabled}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-left text-sm focus:outline-none focus:ring-1  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 bg-white hover:border-gray-400 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                {value ? (
                                    <>
                                        <User className="w-4 h-4 text-[#AA4A41] flex-shrink-0" />
                                        <span className="text-gray-900 text-xs">{value}</span>
                                        {!isPredefinedRole && (
                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Custom</span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-gray-500 text-xs">{placeholder}</span>
                                )}
                            </div>
                        </button>

                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCustomMode();
                                }}
                                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                                title="Switch to custom input"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                )}

                {/* Dropdown Menu */}
                {isOpen && !isCustomMode && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-hidden">
                        {/* Search Input */}
                        <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search roles..."
                                    className="w-full px-3 py-2 pl-9 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1  focus:border-transparent"
                                />
                                <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Role Categories */}
                        <div className="max-h-64 overflow-y-auto">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <div key={category.category} className="p-2">
                                        <div className="px-3 py-2 text-xs font-extrabold text-gray-500 uppercase tracking-wide">
                                            {category.category}
                                        </div>
                                        <div className="space-y-1">
                                            {category.roles.map((role) => (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => handleRoleSelect(role)}
                                                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                                                >
                                                    {role}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No roles found</p>
                                    <button
                                        type="button"
                                        onClick={toggleCustomMode}
                                        className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                                    >
                                        Create custom role instead
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Custom Role Option */}
                        <div className="border-t border-gray-100 p-3">
                            <button
                                type="button"
                                onClick={toggleCustomMode}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <Edit3 className="w-4 h-4" />
                                Create custom role
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Help Text */}
            <p className="text-xs text-gray-500 mb-4">
                Choose from common character roles or create your own custom role to guide AI character generation.
            </p>

            <GradientButton
            handleClick={generateCharacterSuggestions} 
            disabled={value ? false : true}
            className={`${value ? "" : "opacity-20"} w-full flex justify-center`}
            >
                {
                    loadingCharacters === false && <>
                        <Image
                            src="/icon/generate2.svg"
                            alt="arrow-guide icon"
                            width={15}
                            height={15}
                        />
                        <span className="text-xs">Generate</span>
                    </>
                }

                { loadingCharacters === true && 
                    <> 
                        <i className='bx bx-loader-circle text-white bx-spin bx-flip-horizontal text-lg'></i>
                        <span className="text-xs">Generating...</span>
                    </> 
                }
            </GradientButton>
        </div>
    );
};

export default CharacterRoleSelector;