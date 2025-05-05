"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { UserInterface } from '@/interfaces/UserInterface';

interface Props {
    setCurrentOnboardingStep: React.Dispatch<React.SetStateAction<number>>;
    user: UserInterface|null;
    getAuthor: () => void;
}

const vibeOptions = [
    { label: "Dark & Mysterious", value: "Dark & Mysterious" },
    { label: "Whimsical & Fun", value: "Whimsical & Fun" },
    { label: "Epic & Adventurous", value: "Epic & Adventurous" },
    { label: "Futuristic & Techy", value: "Futuristic & Techy" },
    { label: "Romantic & Dreamy", value: "Romantic & Dreamy" },
    { label: "Quirky & Experimental", value: "Quirky & Experimental" },
]

const VibeChoiceComponent: React.FC<Props> = ({
    setCurrentOnboardingStep,
    user,
    getAuthor
}) => {

    const [selectedVibes, setSelectedVibes] = useState<string[]>(user?.info?.favoriteVibe ?? []);

    useEffect(() => {
        setSelectedVibes(user?.info?.favoriteVibe ?? [])
    }, [])

    const handleVibeChange = (vibeValue: string) => {
        setSelectedVibes(prev => {
            if (prev.includes(vibeValue)) {
                return prev.filter(g => g !== vibeValue);
            } else {
                return [...prev, vibeValue];
            }
        });
    };

    const saveVibeChoices = async () => {
        if (selectedVibes.length < 1) {
            setCurrentOnboardingStep(4);            
            return;
        }
        
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/users`;
            showPageLoader()
            const response = await axiosInterceptorInstance.put(url, 
                {
                    favoriteVibe: selectedVibes,
                }
            );

            if (response) {
                getAuthor();
                setCurrentOnboardingStep(4);
            }

        } catch (error) {
            console.error(error);
        } finally {
            hidePageLoader();
        }
    }

    return (
        <div className="w-full max-w-6xl py-12 grid grid-cols-12 gap-16 rounded-2xl overflow-hidden ">

            {/* Left side - Form */}
            <div className="col-span-7 flex flex-col items-start ">
                <div>

                    <h1 className="font-bold text-5xl">What describes your creative vibes?</h1>

                    <p className="font-light text-md mt-10">Select all that applies.</p>

                    <div className="mt-7 flex flex-wrap gap-3 overflow-y-auto max-h-[300px] ">

                        {vibeOptions.map((vibe, index) => (
                            <div
                                key={index}
                                className={`inline-flex items-center px-4 py-2 bg-gray-100 rounded-full cursor-pointer ${selectedVibes.includes(vibe.value) ? 'border border-[#FF877B]' : ''
                                    }`}
                                onClick={() => handleVibeChange(vibe.value)}
                            >
                                <label
                                    htmlFor={`checkbox-${index}`}
                                    className="mr-2 text-gray-600 text-xs font-medium cursor-pointer"
                                >
                                    {vibe.label}
                                </label>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id={`checkbox-${index}`}
                                        checked={selectedVibes.includes(vibe.value)}
                                        onChange={() => handleVibeChange(vibe.value)}
                                        className="sr-only peer"
                                    />
                                    <div
                                        className="w-5 h-5 border border-gray-300 rounded-md bg-white peer-checked:bg-[#FF877B] peer-checked:border-[#FF877B] flex items-center justify-center cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent double triggering from parent's onClick
                                            handleVibeChange(vibe.value);
                                        }}
                                    >
                                        {selectedVibes.includes(vibe.value) && (
                                            <Check size={14} color="white" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-40 flex items-center justify-between">
                        <div className="flex items-center gap-3">

                            <button
                                onClick={() => setCurrentOnboardingStep(2)}
                                className="flex items-center gap-3 py-3 px-5 cursor-pointer transition-all bg-gray-100 hover:bg-gray-200  text-xs rounded-2xl"
                            >
                                <ArrowLeft size={16} />
                            </button>

                            <button
                                onClick={saveVibeChoices}
                                className="flex items-center gap-3 py-3 px-5 cursor-pointer transition-all bg-[#33164C] hover:bg-purple-800 text-white text-xs rounded-2xl"
                            >
                                <span>Next</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Progress indicators */}
                        <div className="flex justify-center space-x-2 pt-4">
                            <div className="w-8 h-1 bg-[#33164C] rounded"></div>
                            <div className="w-8 h-1 bg-[#33164C] rounded"></div>
                            <div className="w-8 h-1 bg-[#33164C] rounded"></div>
                            <div className="w-8 h-1 bg-gray-200 rounded"></div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Right side - Image */}
            <div className="col-span-5 flex items-center justify-center">
                <div className="rounded-3xl overflow-hidden w-full h-full relative">
                    <Image
                        src="/img/dog.png"
                        alt="Registration artwork"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-3xl w-full object-cover"
                    />
                </div>
            </div>
        </div>
    )
}

export default VibeChoiceComponent