"use client"

import { useEffect, useState, Suspense } from 'react';
import StepperComponent from '@/components/dashboard/StepperComponent';
import GetStartedComponent from '@/components/story/original/GetStartedComponent';
import StartWritingComponent from '@/components/story/original/StartWritingComponent';
import PublishOriginalComponent from '@/components/story/original/PublishOriginalComponent';

import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { StoryInterface } from '@/interfaces/StoryInterface';

const steps = [
    {
        id: 1,
        title: "Get Started",
        description: "Setting the tone"
    },
    {
        id: 2,
        title: "Write It!",
        description: "Pour out your creativity."
    },
    {
        id: 3,
        title: "Publish It!",
        description: "Send your masterpiece live."
    }
];

// Create a client component that uses useSearchParams
function PageContent() {
    const searchParams = useSearchParams();
    const step = searchParams.get('current-step');
    const storyId = searchParams.get('story-id');
    const chapterId = searchParams.get('chapter-id');

    const [story, setStory] = useState<StoryInterface | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        let current_step = story?.currentStep ?? Number(step) ?? 1
        setCurrentStep(story?.currentStep ?? 1)
    }, [story])
    
    const { data: storyData, isFetching, isError, refetch } = useQuery({
        queryKey: ['storyFromScratchFormData', storyId],
        queryFn: async () => {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/${storyId}`;

            const response = await axiosInterceptorInstance.get(url);
            if (response?.data?.story) {
                setStory(response?.data?.story);
                setCurrentStep(response?.data?.story?.currentStep);                
            }
            return response?.data?.story;
        },
        enabled: !!storyId && !story  
    });

    // Function to handle moving to the next step
    const nextStep = async (value: number) => {
        let stepLength = 3;
        if (currentStep < stepLength) {
            setCurrentStep(value);
            await updateCurrentStep(value);
        }
    };

    // Function to handle moving to the previous step
    const prevStep = async (value: number) => {
        console.log(value);
        
        if (currentStep > 1) {
            console.log({
                nextStep: value,
                currentStep: story?.currentStep
            });
            
            setCurrentStep(value);
            await updateCurrentStep(value);
        }
    };

    const updateCurrentStep = async (nextStep: number) => {
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/${story?.id}`;
            const response = await axiosInterceptorInstance.put(url, {
                currentStep: nextStep
            });      
            refetch()
        } catch (error) {
            console.error(error);            
        }
    }

    return (
        <div className='px-5 grid grid-cols-12'>
            <div className="col-span-9">        
                { !storyId && 
                    <div>
                        { currentStep === 1 && <GetStartedComponent nextStep={nextStep} setStory={setStory} currentStep={currentStep} setCurrentStep={setCurrentStep} /> }                
                    </div>
                }

                { storyId && 
                    <div>                                  
                        { currentStep === 1 && <GetStartedComponent nextStep={nextStep} story={story} setStory={setStory} currentStep={currentStep} setCurrentStep={setCurrentStep} />  }
                        { currentStep === 2 && <StartWritingComponent nextStep={nextStep}  prevStep={prevStep} story={story} refetch={refetch} chapterId={chapterId}/>  }
                        { currentStep === 3 && <PublishOriginalComponent prevStep={prevStep} isFree={false} story={story} refetch={refetch}/> }
                    </div>
                }
            </div>
            <div className="col-span-3">
                <StepperComponent setCurrentStep={setCurrentStep} currentStep={currentStep} steps={steps} />
            </div>
        </div>
    );
}

// Main page component with Suspense boundary
const WriteOriginalStoryPage = () => {    
    return (
        <Suspense fallback={<div className="px-5 py-10">Loading story editor...</div>}>
            <PageContent />
        </Suspense>
    );
}

export default WriteOriginalStoryPage;