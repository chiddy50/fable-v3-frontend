"use client";

import { storyBuilderSteps } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import React from 'react';

const StoryStepComponent = ({
    data,
    activeFormStep
}) => {
    return (
        <div className="mb-16 mt-10 flex justify-center">
            <div className="md:w-[98%] lg:w-[80%] grid grid-cols-4 gap-5">

                {
                    storyBuilderSteps.map((step, index) => (
                        <div key={index}
                        className={cn(
                            'py-3 px-3 rounded-3xl flex items-center justify-center ',
                            activeFormStep > (index + 1) ? "bg-white opacity-70" : "",
                            activeFormStep < (index + 1) ? "bg-gray-50 opacity-70" : "",
                            activeFormStep === (index + 1) ? "bg-custom_green text-white " : "",
                        )}
                        >
                            <p className='font-bold text-[10px] uppercase'>{step.title}</p>
                        </div>                    
                    ))
                }
                
            </div>
        </div>
    )
}

export default StoryStepComponent
