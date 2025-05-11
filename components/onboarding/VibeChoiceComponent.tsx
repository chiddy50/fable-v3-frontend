"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { UserInterface } from '@/interfaces/UserInterface';

interface Props {
    setCurrentOnboardingStep: React.Dispatch<React.SetStateAction<number>>;
    user: UserInterface | null;
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
        <div className="w-full max-w-6xl py-12 px-10 sm:px-7 grid grid-cols-12 gap-6 lg:gap-16 rounded-2xl overflow-hidden">

            {/* Left side - Form */}
            <div className="col-span-full lg:col-span-7 flex flex-col items-start">
                <div className="w-full">

                    <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl">What describes your creative vibes?</h1>

                    <p className="font-light text-md mt-6 sm:mt-10">Select all that applies.</p>

                    <div className="mt-5 sm:mt-7 flex flex-wrap gap-2 sm:gap-3 overflow-y-auto max-h-[300px]">

                        {vibeOptions.map((vibe, index) => (
                            <div
                                key={index}
                                className={`inline-flex items-center px-3 sm:px-4 py-2 bg-gray-100 rounded-full cursor-pointer ${selectedVibes.includes(vibe.value) ? 'border border-[#FF877B]' : ''
                                    }`}
                                onClick={() => handleVibeChange(vibe.value)}
                            >
                                <label
                                    htmlFor={`checkbox-${index}`}
                                    className="mr-2 text-gray-600 text-xs font-medium cursor-pointer whitespace-nowrap"
                                >
                                    {vibe.label}
                                </label>
                                <div className="relative flex-shrink-0">
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

                    <div className="mt-20 sm:mt-40 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">

                            <button
                                onClick={() => setCurrentOnboardingStep(2)}
                                className="flex items-center gap-3 py-3 px-5 cursor-pointer transition-all bg-gray-100 hover:bg-gray-200 text-xs rounded-2xl"
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
                        <div className="flex justify-center space-x-2 pt-2 sm:pt-4 w-full sm:w-auto">
                            <div className="w-6 sm:w-8 h-1 bg-[#33164C] rounded"></div>
                            <div className="w-6 sm:w-8 h-1 bg-[#33164C] rounded"></div>
                            <div className="w-6 sm:w-8 h-1 bg-[#33164C] rounded"></div>
                            <div className="w-6 sm:w-8 h-1 bg-gray-200 rounded"></div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:block lg:col-span-5">
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