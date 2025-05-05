"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import { storyGenres } from "@/data/genres";
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { UserInterface } from '@/interfaces/UserInterface';


interface Props {
    setCurrentOnboardingStep: React.Dispatch<React.SetStateAction<number>>;   
    user: UserInterface|null;   
    getAuthor: () => void;
}

const GenreChoiceComponent: React.FC<Props> = ({
    setCurrentOnboardingStep,
    user,
    getAuthor
}) => {

    const [selectedGenres, setSelectedGenres] = useState<string[]>(user?.info?.favoriteGenre ?? []);

    useEffect(() => {
        setSelectedGenres(user?.info?.favoriteGenre ?? [])
    }, [])

    const handleGenreChange = (genreLabel: string) => {        
        setSelectedGenres((prev: any) => {
            if (prev.includes(genreLabel)) {
                return prev.filter((g: string) => g !== genreLabel);
            } else {
                return [...prev, genreLabel];
            }
        });
    };

    const saveGenreChoices = async () => {
        if (selectedGenres.length < 1) {
            setCurrentOnboardingStep(3);            
            return;
        }
        
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/users`;
            showPageLoader()
            const response = await axiosInterceptorInstance.put(url, 
                {
                    favoriteGenre: selectedGenres,
                }
            );

            if (response) {
                getAuthor();
                setCurrentOnboardingStep(3);
            }

        } catch (error) {
            console.error(error);
        } finally {
            hidePageLoader();
        }
    }
    
    return (
        <div className="w-full max-w-6xl py-12 grid grid-cols-12 gap-20 rounded-2xl overflow-hidden ">

            {/* Left side - Form */}
            <div className="col-span-8 flex flex-col items-start ">
                <div>

                    <h1 className="font-bold text-5xl">Which genre sparks your imagination?</h1>

                    <p className="font-light text-md mt-10">Select all that applies</p>

                    <div className="mt-7 flex flex-wrap gap-3 overflow-y-auto max-h-[300px] ">
                        
                    {storyGenres.map(genre => (
                    <div 
                        key={genre.label} 
                        className={`inline-flex items-center px-4 py-2 bg-gray-100 rounded-full cursor-pointer
                            ${
                                selectedGenres.includes(genre.label) ? 'border border-[#FF877B]' : ''
                            }
                            `}
                        onClick={() => handleGenreChange(genre.label)}
                    >
                        <label 
                        htmlFor={`checkbox-${genre.label}`} 
                        className="mr-2 text-gray-600 text-xs font-medium cursor-pointer"
                        >
                        {genre.label}
                        </label>
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                id={`checkbox-${genre.label}`} 
                                checked={selectedGenres.includes(genre.label)}
                                onChange={() => handleGenreChange(genre.label)}
                                className="sr-only peer" 
                            />
                            <div 
                                className="w-5 h-5 border border-gray-300 rounded-md bg-white peer-checked:bg-[#FF877B] peer-checked:border-[#FF877B] cursor-pointer flex items-center justify-center"
                                onClick={(e) => {
                                e.stopPropagation(); // Prevent double triggering from parent's onClick
                                handleGenreChange(genre.label);
                                }}
                            >
                                {selectedGenres.includes(genre.label) && (
                                    <Check size={14} color="white" />
                                )}
                            </div>
                        </div>
                    </div>
                    ))}
                    </div>

                    <div className="mt-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">

                            <button
                                onClick={() => setCurrentOnboardingStep(1)}
                                className="flex items-center gap-3 py-3 px-5 cursor-pointer transition-all bg-gray-100 hover:bg-gray-200  text-xs rounded-2xl"
                            >
                                <ArrowLeft size={16} />
                            </button>

                            <button
                                onClick={saveGenreChoices}
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
                            <div className="w-8 h-1 bg-gray-200 rounded"></div>
                            <div className="w-8 h-1 bg-gray-200 rounded"></div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Right side - Image */}
            <div className="col-span-4 flex items-center justify-center">
                <div className="rounded-3xl overflow-hidden w-full h-full relative">
                    <Image
                        src="/img/genre-selection-bg.png"
                        alt="Registration artwork"
                        layout="fill"
                        objectFit="cover"
                        // height={500}
                        // width={100}
                        className="rounded-3xl w-full object-cover"
                    />
                </div>
            </div>
        </div>
    )
}

export default GenreChoiceComponent
