"use client"

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Lightbulb, Users, Map } from 'lucide-react';
import Image from 'next/image';
import { StoryInterface } from '@/interfaces/StoryInterface';

const NarrativeConceptGuide = ({ story }: { story: StoryInterface }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedConcept, setSelectedConcept] = useState('');

    const steps = [
        {
            title: "What is a Narrative Concept?",
            icon: <BookOpen className="w-6 h-6 text-[#D45C51]" />,
            content: (
                <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                        Think of a <strong>narrative concept</strong> as the <span className="bg-yellow-100 px-2 py-1 rounded">blueprint for your story</span>!
                    </p>
                    <div className="bg-[#fdf4f3] p-4 rounded-lg border-l-4 border-[#D45C51]">
                        <p className="text-gray-700 text-xs">
                            Just like how a house needs a blueprint before you build it, your story needs a plan before you write it.
                            That plan is called a "narrative concept"!
                        </p>
                    </div>
                    <p className="text-gray-600 italic">
                        It's like asking: "What kind of story do I want to tell, and how should I tell it?"
                    </p>
                </div>
            )
        },
        {
            title: "Think of Your Favorite Movie",
            icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
            content: (
                <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                        Let's use movies you know to understand this better:
                    </p>
                    <div className="grid gap-4">
                        <div className="bg-green-50 p-4 rounded-lg flex items-start gap-4">
                            <div className="flex-shrink-0 md:w-[80px] w-[40px] md:h-[80px] h-[40px]">
                                <Image
                                src="/img/lion-king.jpeg"
                                alt="The Lion King artwork"
                                width={80}
                                height={80}
                                className="rounded-lg w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Text content - properly aligned */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                                <span>🦁</span>
                                <span>The Lion King</span>
                                </h4>
                                <p className="text-gray-700 text-xs mb-2">
                                <strong>Narrative Concept:</strong> "A young prince must grow up, face his past, and reclaim his kingdom"
                                </p>
                                <p className="text-xs text-gray-600">
                                This follows the "Hero's Journey" - someone ordinary becomes a hero!
                                </p>
                            </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg flex items-start gap-4">
                            <div className="flex-shrink-0 md:w-[80px] w-[40px] md:h-[80px] h-[40px]">
                                <Image
                                src="/img/spiderman.jpeg"
                                alt="The Lion King artwork"
                                width={80}
                                height={80}
                                className="rounded-lg w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Text content - properly aligned */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                                    <span>🕷️</span>
                                    <span>Spider-Man</span>
                                </h4>
                                <p className="text-gray-700 text-xs mb-2">
                                    <strong>Narrative Concept:</strong> "An ordinary teenager gets superpowers and learns that with great power comes great responsibility"
                                </p>
                                <p className="text-xs text-gray-600">
                                This is an "Origin Story" - showing how someone became who they are!                                
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            )
        },
        {
            title: "It's About the Journey",
            icon: <Map className="w-6 h-6 text-green-500" />,
            content: (
                <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                        A narrative concept tells us <strong>what journey</strong> your main character will go on:
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-2xl">🌱</span>
                            <div>
                                <h4 className="font-semibold">Growing Up Story</h4>
                                <p className="text-xs text-gray-600">A young person learns important life lessons (like Harry Potter)</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-2xl">🔍</span>
                            <div>
                                <h4 className="font-semibold">Mystery/Quest</h4>
                                <p className="text-xs text-gray-600">Someone searches for something important (like finding treasure)</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-2xl">💕</span>
                            <div>
                                <h4 className="font-semibold">Love Story</h4>
                                <p className="text-xs text-gray-600">Two people meet, face challenges, and find love</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-2xl">⚔️</span>
                            <div>
                                <h4 className="font-semibold">Good vs. Evil</h4>
                                <p className="text-xs text-gray-600">Heroes fight against villains to save the day</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Why Does This Matter?",
            icon: <Users className="w-6 h-6 text-red-500" />,
            content: (
                <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                        Choosing the right narrative concept helps you:
                    </p>
                    <div className="grid gap-3">
                        <div className="flex items-center space-x-3 px-3 py-2.5 bg-[#fdf4f3] rounded-lg">
                            <span className="text-xl">📝</span>
                            <span className="font-medium text-xs">Know what to write about</span>
                        </div>
                        <div className="flex items-center space-x-3 px-3 py-2.5 bg-green-50 rounded-lg">
                            <span className="text-xl">🎯</span>
                            <span className="font-medium text-xs">Keep your story focused</span>
                        </div>
                        <div className="flex items-center space-x-3 px-3 py-2.5 bg-yellow-50 rounded-lg">
                            <span className="text-xl">👥</span>
                            <span className="font-medium text-xs">Connect with your readers</span>
                        </div>
                        <div className="flex items-center space-x-3 px-3 py-2.5 bg-purple-50 rounded-lg">
                            <span className="text-xl">🏗️</span>
                            <span className="font-medium text-xs">Build your story step by step</span>
                        </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-xs border-l-4 border-orange-400 mt-4">
                        <p className="text-gray-700">
                            <strong>Remember:</strong> Every great story started with someone asking
                            "What if...?" Your narrative concept is your answer to that question!
                        </p>
                    </div>
                </div>
            )
        },
        {
            title: "Ready to Choose?",
            icon: <ChevronRight className="w-6 h-6 text-indigo-500" />,
            content: (
                <div className="space-y-4">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                            You're Ready to Pick Your Story's Blueprint!
                        </h3>
                    </div>

                    <div className="bg-gradient-to-r to-[#fdf4f3] from-[#fdf4f3] p-6 rounded-lg mt-6">
                        <h4 className="font-semibold text-gray-800 mb-3">Quick Recap:</h4>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start space-x-2">
                                <span className="text-green-500">✓</span>
                                <span className='text-xs'>A narrative concept is your story's blueprint</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-green-500">✓</span>
                                <span className='text-xs'>It describes the journey your character will take</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-green-500">✓</span>
                                <span className='text-xs'>It helps you write a focused, engaging story</span>
                            </li>
                        </ul>
                        <div className="mt-4 p-3 bg-white rounded border border-[#FF9F96]">
                            <p className="text-xs text-gray-600">
                                <strong>Pro Tip:</strong> Don't worry about picking the "perfect" one.
                                You can always adjust your story as you write. The important thing is to start!
                            </p>
                        </div>
                    </div>
                    
                    
                </div>
            )
        }
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (step) => {
        setCurrentStep(step);
    };

    return (
        <div className="w-full max-w-2xl max-h-[90vh] rounded-xl p-5 bg-white flex flex-col overflow-hidden">
            {/* Scrollable content container */}
            <div className="overflow-y-auto flex-1">
                {/* Header */}
                <div className="text-center mb-8 mt-3">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Understanding Narrative Concepts
                    </h1>
                    <p className="text-gray-600 text-xs">A simple guide for new storytellers</p>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-between items-center mb-8 w-full md:w-[80%] mx-auto overflow-x-auto pb-2">
                    <div className="flex mx-auto">
                        {steps.map((_, index) => (
                            <div key={index} className="flex items-center">
                                <button
                                    onClick={() => goToStep(index)}
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${index <= currentStep
                                            ? 'bg-[#FF9F96] text-white'
                                            : 'bg-[#f4f4f4] text-gray-500'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                                {index < steps.length - 1 && (
                                    <div className={`w-4 md:w-8 h-1 mx-1 md:mx-2 ${index < currentStep ? 'bg-[#FF9F96]' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="min-h-[40vh]">
                    <div className="flex items-center space-x-3 mb-6">
                        {steps[currentStep].icon}
                        <h2 className="text-lg font-semibold text-gray-800">
                            {steps[currentStep].title}
                        </h2>
                    </div>

                    <div className="mb-8 text-sm">
                        {steps[currentStep].content}
                    </div>
                </div>
            </div>

            {/* Navigation - fixed at the bottom */}
            <div className="flex justify-between items-center pt-6 border-t">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center space-x-2 px-4 py-2 text-xs rounded-lg transition-colors ${currentStep === 0
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-[#D45C51] hover:bg-[#fdf4f3] cursor-pointer'
                        }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                </button>

                <span className="text-xs text-gray-500">
                    {currentStep + 1} of {steps.length}
                </span>

                <button
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                    className={`flex items-center space-x-2 px-4 py-2 text-xs rounded-lg transition-colors ${currentStep === steps.length - 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-[#D45C51] hover:bg-[#fdf4f3] cursor-pointer'
                        }`}
                >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>

    );
};

export default NarrativeConceptGuide;