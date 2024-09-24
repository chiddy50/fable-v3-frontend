"use client";

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import StoryStarterComponent from './StoryStarterComponent';
import ChoosePlotComponent from './ChoosePlotComponent';
import { storyBuilderSteps } from '@/lib/constants';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import CreateCharactersComponent from './CreateCharactersComponent';
import GenerateStoryComponent from './GenerateStoryComponent';
import { useQuery } from '@tanstack/react-query';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import CreatePlotComponent from './CreatePlotComponent';
import { Input } from '../ui/input';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

function StoryBoardFromScratchComponent() {
    const [currentTab, setCurrentTab]= useState<string>('story-starter');
    const [projectTitle, setProjectTitle]= useState<string>('');    
    const [projectDescription, setProjectDescription]= useState<string>('');    
    
    const [currentFormStep, setCurrentFormStep]= useState<number>(1);
    const [plotSuggestions, setPlotSuggestions] = useState<[]>([])
    const [story, setStory] = useState(null)

    const currentStepUrl = useSearchParams().get('current-step');
    const storyId = useSearchParams().get('story-id');
    // console.log({storyId});
    
    const { push } = useRouter();
    const dynamicJwtToken = getAuthToken();
    const { user, setShowAuthFlow } = useDynamicContext();

    const { data: storyData, isFetching, isError, refetch } = useQuery({
        queryKey: ['storyFromScratchFormData', currentStepUrl],
        queryFn: async () => {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/from-scratch/${storyId}`;

            const response = await axiosInterceptorInstance.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${dynamicJwtToken}`
                    }
                }
            );
            // console.log(response);
            if (response?.data?.story) {
                setStory(response?.data?.story);
            }
            return response.data.story;
        },
        enabled: !!user && !story,
        // enabled: !!storyId,
    });
    
    // const {
    //     id,
    //     storyStarter,
    //     plot,
    // } = storyData;
    // console.log({storyData});
    
    const saveStory = async (payload: { 
        currentStep?: number, 
        currentStepUrl?: string 
        storyId?: string | null
    }) => {
        
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch/${storyId}`;

            let body = payload;                        

            if (storyData?.id) {                
                body.storyId = storyData?.id;
            }

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${dynamicJwtToken}`
                },
                body: JSON.stringify(body)
            });

            const json = await response.json();
            console.log(json);
            if (json?.data?.story) {
                setStory(json?.data?.story);
                refetch();                    
                return json?.data?.story;             
            }

            return null;
            
        } catch (error) {
            console.log(error);            
            return null;
        }
    }

    const getCurrentForm = () => {
        switch (currentStepUrl) {
            case storyBuilderSteps[0].link:
            return {
                step: 1,
                form: (
                    <StoryStarterComponent 
                        moveToPlotSelection={moveToPlotSelection}     
                        currentFormStep={currentFormStep + 1}    
                        data={storyData} 
                        saveStory={saveStory}          
                    />
                ),
            };

            case storyBuilderSteps[1].link:
            return {
                step: 2,
                form: (
                    <CreatePlotComponent 
                    initialStoryData={storyData}
                    saveStory={saveStory}   
                    currentPlotStep={storyData?.currentPlotStep}
                    refetch={refetch}
                    />
                ),
            };

            case storyBuilderSteps[2].link:
            return {
                step: 3,
                form: (
                    <CreateCharactersComponent 
                        initialStoryData={storyData}
                        saveStory={saveStory}
                        refetch={refetch}
                    />
                ),
            };

            case storyBuilderSteps[3].link:
            return {
                step: 4,
                form: (
                    <GenerateStoryComponent 
                    initialStory={storyData} 
                    refetch={refetch}
                    />
                ),
            };
        
            default:
                return {
                    step: 1,
                    form: (
                        <StoryStarterComponent 
                            moveToPlotSelection={moveToPlotSelection}
                            currentFormStep={currentFormStep + 1}  
                            data={storyData}   
                            saveStory={saveStory}          
                        />
                        
                    ),
                };
        }
    }

    const moveToPlotSelection = (storyId: string) => {
        push(
            `/story-board-from-scratch?current-step=${storyBuilderSteps[getCurrentForm().step].link}&story-id=${storyId}`
        );
        // setPlotSuggestions(plots);
    }

    const totalSteps = storyBuilderSteps.length;
    const activeFormStep = getCurrentForm().step;

    const createProject = async () => {
        if (!projectTitle) {
            toast.error("Kindly provide a project title");
            return;
        }
        showPageLoader();

        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${dynamicJwtToken}`
                },
                body: JSON.stringify({
                    projectTitle,
                    projectDescription
                })
            });

            const json = await response.json();
            console.log(json);
            if (json?.data?.story) {
                let story = json?.data?.story;
                setStory(story);
                push(
                    `/story-board-from-scratch?current-step=story-starter&story-id=${story?.id}`
                );
            }
        } catch (error) {
            console.log(error);                        
        }finally{
            hidePageLoader();
        }

        
    }

    const generateSettingSuggestions = () => {

    }

    useEffect(() => {
        setCurrentFormStep(getCurrentForm().step)
        // console.log({currentFormStep});
    }, [])
    
    return (
        <div className='mx-auto w-[90%] px-10'>
            {
                !storyId && 
                <div>
                    <div className='mb-5'>
                        <h1 className="font-semibold">Let's get started on your new project</h1>
                    </div>
                    <Input 
                        defaultValue={projectTitle}
                        onKeyUp={(e) => setProjectTitle(e.target.value)} 
                        className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                        placeholder='Project title'
                    />
                    <textarea rows={3} 
                    onChange={(e) => setProjectDescription(e.target.value) } 
                    value={projectDescription} 
                    placeholder='Kindly share your story idea or any keywords'
                    className='py-2 px-4 mb-4 outline-none border text-xs rounded-lg w-full' 
                    />

                    <div className="flex items-center gap-5 mt-4">
                        <Button onClick={createProject} className='text-gray-800 bg-yellow-300 border border-gray-800 hover:bg-yellow-300'>Proceed</Button>
                        <Button onClick={() => push('/')}>Go Back</Button>
                    </div>
                </div>
            }
            {
                storyId &&
                <div>                
                    <div className="flex mb-7 gap-4 ">
                        {
                            storyBuilderSteps.map((step, index) => (
                                <Button key={index} onClick={() => setCurrentTab(step.step)} 
                                className={cn(
                                    'uppercase text-xs ',
                                    activeFormStep > (index + 1) ? " bg-yellow-500 text-gray-900 hover:bg-yellow-500" : "",
                                    activeFormStep < (index + 1) ? " bg-yellow-100 border-gray-600 text-gray-600 border hover:bg-transparent" : "",
                                    activeFormStep === (index + 1) ? "border border-gray-900 bg-yellow-400 text-gray-900 hover:bg-yellow-300" : "",
                                )}>
                                    {step.title}
                                </Button>                        
                            ))
                        }
                    </div>

                    <div className='grid grid-cols-6 gap-5 min-h-full'>
                        
                        <div className=" col-span-6">
                            {storyId && getCurrentForm().form}
                            {/* { !storyData && getCurrentForm2().form } */}

                            {/* {!data && <StoryStarterComponent 
                                moveToPlotSelection={moveToPlotSelection}     
                                currentFormStep={currentFormStep + 1}    
                            />} */}

                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default StoryBoardFromScratchComponent
