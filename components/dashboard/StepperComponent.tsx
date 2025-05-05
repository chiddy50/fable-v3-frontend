"use client"

import React, { useState } from 'react';



interface StepInterface {
    id: number;
    title: string;
    description: string;
}

interface Props {
    steps: StepInterface[];
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    currentStep: number;
    initialStep?: number;
}

const StepperComponent: React.FC<Props> = ({
    initialStep = 1,
    setCurrentStep,
    currentStep,
    steps
}) => {
    // const [currentStep, setCurrentStep] = useState(initialStep);

    // Function to handle moving to the next step
    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    // Function to handle moving to the previous step
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Function to determine the state of each step item
    const getStepState = (stepId: number) => {
        if (stepId < currentStep) return "completed";
        if (stepId === currentStep) return "current";
        return "upcoming";
    };

    return (
        <div className="flex flex-col items-start px-6">
            {steps.map((step, index) => (
                <div key={step.id} className="flex">
                    <div className="flex flex-col items-center">
                        {/* Circle icon for step */}
                        <div
                            className={`
                w-5 h-5 rounded-md flex items-center justify-center
                ${getStepState(step.id) === 'completed' ? 'bg-[#D45C51] text-white border-2 border-[#FF9F96]' :
                                    getStepState(step.id) === 'current' ? 'bg-[#D45C51] text-white border-2 border-[#FF9F96]' :
                                        'bg-white border-2 border-[#FF9F96] text-red-200'}
              `}
                        >
                            {getStepState(step.id) === 'completed' ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : getStepState(step.id) === 'current' ? (
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                            ) : (
                                <div className="w-2 h-[2px] bg-gray-400"></div>
                            )}
                        </div>

                        {/* Connecting line (except for the last item) */}
                        {index < steps.length - 1 && (
                            <div
                                className={`w-0.5 h-16 
                  ${step.id < currentStep ? 'bg-[#D45C51]' : 'bg-gray-200'}`}
                            />
                        )}
                    </div>

                    {/* Step content */}
                    <div className="ml-4">
                        <h3
                            className={`font-bold text-sm mb-2
                ${getStepState(step.id) === 'upcoming' ? 'text-red-200' : 'text-[#D45C51]'}`}
                        >
                            {step.title}
                        </h3>
                        <p
                            className={`text-xs 
                ${getStepState(step.id) === 'upcoming' ? 'text-gray-300' : 'text-gray-500'}`}
                        >
                            {step.description}
                        </p>
                    </div>
                </div>
            ))}

            {/* Navigation buttons for demo purposes */}
            {/* <div className="mt-8 flex space-x-4">
            <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
            Previous
            </button>
            <button 
            onClick={nextStep}
            disabled={currentStep === steps.length}
            className="px-4 py-2 bg-[#D45C51] text-white rounded disabled:opacity-50"
            >
            Next
            </button>
        </div> */}

        </div>
    );
};

export default StepperComponent;