"use client";

import React, { useEffect, useRef, useState, Suspense } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { makeRequest } from '@/services/request';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { StoryInterface } from '@/interfaces/StoryInterface';
import IntroduceProtagonistAndOrdinaryWorldComponent from '@/components/RefineStory/IntroduceProtagonistAndOrdinaryWorldComponent';
import IncitingIncidentComponent from '@/components/RefineStory/IncitingIncidentComponent';
import FirstPlotPointComponent from '@/components/RefineStory/FirstPlotPointComponent';
import RisingActionAndMidpointComponent from '@/components/RefineStory/RisingActionAndMidpointComponent';
import PinchPointsAndSecondPlotPointComponent from '@/components/RefineStory/PinchPointsAndSecondPlotPointComponent';
import ClimaxAndFallingActionComponent from '@/components/RefineStory/ClimaxAndFallingActionComponent';
import ResolutionComponent from '@/components/RefineStory/ResolutionComponent';


function MyComponent() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <RefineStoryPage />
      </Suspense>
    );
}

const RefineStoryPage = () => {
    const [story, setStory] = useState<StoryInterface|null>(null)

    const [projectTitle, setProjectTitle]= useState<string>(story?.projectTitle ?? '');    
    const [projectDescription, setProjectDescription]= useState<string>(story?.projectDescription ?? '');   
    
    const dynamicJwtToken = getAuthToken();
    const router = useRouter();

    const storyId = useSearchParams().get('story-id');

    // const idToken = localStorage?.getItem("idToken");
    // const publicAddress = localStorage?.getItem("publicAddress");
    // const appPubKey = localStorage?.getItem("appPubKey");
    const { data: storyData, isFetching, isError, refetch } = useQuery({
        queryKey: ['storyFromScratchFormData', storyId],
        queryFn: async () => {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/from-scratch/${storyId}`;

            const response = await axiosInterceptorInstance.get(url);
            if (response?.data?.story) {
                setStory(response?.data?.story);
            }
            return response?.data?.story;
        },
        enabled: !!storyId && !story 
        // && !!idToken,
    });

    useEffect(() => {
        setProjectTitle(story?.projectTitle ?? '');
        setProjectDescription(story?.projectDescription ?? '');
    }, [story]);


    const updateProject = async () => {
        if (!validateForm()) return;

        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch/${storyId}`;

            showPageLoader();
            const response = await axiosInterceptorInstance.put(url, 
                {
                    projectTitle,
                    projectDescription,
                }
            );

            const story = response?.data?.story;
            if (!story?.id) {
                toast.error("Unable to update project");
                hidePageLoader();
                return;
            }

        } catch (error) {
            console.error(error);      
        }finally{
            hidePageLoader();
        }
    }

    const validateForm = () => {
        if (!projectTitle) {
            toast.error("Kindly provide a project title");
            return false;
        }

        if (!projectDescription) {
            toast.error("Kindly provide a project idea or description");
            return false;
        }
        return true;
    }

    const moveToNext = async (step: number) => {
        if (step === 8) return;
        try {           
            showPageLoader();
            // let updated = await makeRequest({
            //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch/${storyId}`,
            //     method: "PUT", 
            //     body: {
            //         storyId: storyId,
            //         writingStep: step               
            //     }, 
            //     token: dynamicJwtToken,
            // });

            const updated = await axiosInterceptorInstance.put(`${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch/${storyId}`, 
                {
                    storyId: storyId,
                    writingStep: step    
                }
            );

            if (updated) {
                refetch()
            }
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/stories">Stories</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Refine Story</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {
                !storyData && 
                <div>

                </div>
            }

            {
                <div className="my-10">
                    <div>

                        <div className="bg-gray-50 p-5 rounded-2xl">
                            <p className="mb-2 font-semibold text-sm">Title</p>
                            <Input 
                            // disabled
                            defaultValue={projectTitle}
                            onKeyUp={(e) => setProjectTitle(e.target.value)} 
                            className='w-full text-sm p-5 outline-none  rounded-xl mb-4 resize-none'
                            placeholder='Project title'
                            />
                            <p className="mb-2 font-semibold text-sm">Description</p>
                            <textarea rows={5} 
                            onChange={(e) => setProjectDescription(e.target.value) } 
                            value={projectDescription} 
                            // disabled={storyData?.writingStep > 1}
                            placeholder='Kindly share your story idea or any keywords'
                            className='p-5 outline-none text-sm border rounded-lg w-full' 
                            />
                            <Button onClick={() => updateProject()} 
                            // disabled={storyData?.writingStep > 1}

                            className='text-gray-50 mt-3 bg-[#46aa41]'>Update</Button>
                        </div>

                    </div>
                </div>
            }

            {
                storyData &&
                <div className="my-10">
                    {
                        storyData?.writingStep === 1 &&
                        <IntroduceProtagonistAndOrdinaryWorldComponent refetch={refetch} moveToNext={moveToNext} initialStory={storyData ?? story} />
                    }

                    {
                        storyData?.writingStep === 2 &&
                        <IncitingIncidentComponent 
                        refetch={refetch} moveToNext={moveToNext} 
                        initialStory={storyData ?? story} 
                        projectDescription={projectDescription}
                        />
                    }

                    {
                        storyData?.writingStep === 3 &&
                        <FirstPlotPointComponent 
                        refetch={refetch} moveToNext={moveToNext} 
                        initialStory={storyData ?? story} 
                        projectDescription={projectDescription}
                        />
                    }

                    {
                        storyData?.writingStep === 4 &&
                        <RisingActionAndMidpointComponent 
                        refetch={refetch} moveToNext={moveToNext} 
                        initialStory={storyData ?? story} 
                        projectDescription={projectDescription}
                        />

                    }

                    {
                        storyData?.writingStep === 5 &&
                        <PinchPointsAndSecondPlotPointComponent 
                        refetch={refetch} moveToNext={moveToNext} 
                        initialStory={storyData ?? story} 
                        projectDescription={projectDescription}
                        />
                    }

                    {
                        storyData?.writingStep === 6 &&
                        <ClimaxAndFallingActionComponent 
                        refetch={refetch} moveToNext={moveToNext} 
                        initialStory={storyData ?? story} 
                        projectDescription={projectDescription}
                        />
                    }

                    {
                        storyData?.writingStep === 7 &&
                        <ResolutionComponent 
                        refetch={refetch} moveToNext={moveToNext} 
                        initialStory={storyData ?? story} 
                        projectDescription={projectDescription}
                        />
                    }
                    
                </div>
            }

            
        </div>

    )
}

export default MyComponent


// Analysis and Suggestions: A "Fine-Tune" button triggers the LLM to analyze the generated story and provide suggestions for different story directions, including:
// Alternative opening scenes
// Different tone or atmosphere
// Changes in genre or theme
// Suspense or tension techniques