"use client";

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, Suspense } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useQuery } from '@tanstack/react-query';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ImageIcon } from 'lucide-react';
import axios from 'axios';
import { queryLLM } from '@/services/LlmQueryHelper';
import { ChatGroq } from '@langchain/groq';
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { toast } from 'sonner';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { makeRequest } from '@/services/request';

const inter = Inter({ subsets: ['latin'] });


const CHAPTER_IMAGE_MAP = {
    introduction: 'introductionImage',
    incitingIncident: 'incitingIncidentImage',
    firstPlotPoint: 'firstPlotPointImage',
    risingActionAndMidpoint: 'risingActionAndMidpointImage',
    pinchPointsAndSecondPlotPoint: 'pinchPointsAndSecondPlotPointImage',
    climaxAndFallingAction: 'climaxAndFallingActionImage',
    resolution: 'resolutionImage'
} as const;
  
type ChapterKey = keyof typeof CHAPTER_IMAGE_MAP;

function MyComponent() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectSummaryPage />
      </Suspense>
    );
}
const ProjectSummaryPage = () => {
    const [story, setStory] = useState<StoryInterface|null>(null)
    const [modifyModalOpen, setModifyModalOpen] = useState<boolean>(false);

    const storyId = useSearchParams().get('story-id');
    const dynamicJwtToken = getAuthToken();

    const { push } = useRouter()
 
    const { data: storyData, isFetching, isError, refetch } = useQuery({
        queryKey: ['storyFromScratchFormData', storyId],
        queryFn: async () => {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/from-scratch/${storyId}`;
    
            const response = await axiosInterceptorInstance.get(url,
              {
                headers: {
                  Authorization: `Bearer ${dynamicJwtToken}`
                }
              }
            );
            if (response?.data?.story) {
                setStory(response?.data?.story);
            }
            return response?.data?.story;
        },
        enabled: !!storyId && !story
    });

    const generateBanner = async (chapterDescription: string, chapter: string) => {
        if (!chapterDescription) {
            toast.error("No content generated yet");
            return;
        }

        try {
            showPageLoader();
            // let prompt = await getGenerationPrompt(chapterDescription)
            // console.log(prompt);
        
            // if (!prompt) {
            //     return;
            // }
            
            showPageLoader();
            let res = await axios.post(
                `https://modelslab.com/api/v6/images/text2img`, 
                {
                    "key": process.env.NEXT_PUBLIC_STABLE_FUSION_API_KEY,
                    "model_id": process.env.NEXT_PUBLIC_IMAGE_MODEL ?? "flux",
                    "prompt": `ultra realistic photograph ${chapterDescription}`,
                    "negative_prompt": "painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime",
                    "width": "1288",
                    "height": "768",
                    "samples": "1",
                    "num_inference_steps": "30",
                    "seed": null,
                    "guidance_scale": 7.5,
                    "scheduler": "UniPCMultistepScheduler",
                    "webhook": null,
                    "track_id": null
                }, 
                {                    
                    headers: {
                        'Content-Type': 'application/json'
                    },                
                }
            );
            console.log(res);
            console.log(res?.data?.output?.[0]);

            let imgUrl = res?.data?.output?.[0] ?? res?.data?.proxy_links?.[0];
            if (!imgUrl) {
                toast.error("Unable to generate image banner");
                return;
            }


            await saveChapterBanner(chapter, imgUrl);
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const getGenerationPrompt = async (chapter) => {
        try {
            showPageLoader();
            
            const prompt = `
            Analyze the following chapter of a story and story idea and generate a prompt that can be used to create an image banner that visually represents the story. Ensure the image captures a sense of motion and involves actions from the characters. 
            Return a simple description that includes dynamic elements and character activity, avoiding titles, subtitles, or any unwanted symbols—just a detailed image description.
            **INPUT**
            story idea: {storyIdea}
            Chapter: {chapter}`
            ;
    
            const llm = new ChatGroq({
                apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
                model: "llama-3.1-70b-versatile"           
            });
            
            const startingPrompt = ChatPromptTemplate.fromMessages([
                ["system", "You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also an expert at answering any question directly even if its not related to storytelling. And you always follow instruction"],
                ["human", prompt],
            ]);
            
            const chain = startingPrompt.pipe(llm).pipe(new StringOutputParser());
            
            const response = await chain.invoke({
                chapter: chapter,
                storyIdea: story?.projectDescription                 
            });
            return response;
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const publishStory = async () => {
        try {
            showPageLoader()
            let updated = await makeRequest({
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch/${storyId}`,
                method: "PUT", 
                body: {
                    status: "published",
                    publishedAt: new Date
                }, 
                token: dynamicJwtToken,
            });

            if (updated) {
                // refetch();
                push("/dashboard/stories")
            }
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const saveChapterBanner = async (chapter: ChapterKey, imgUrl: string) => {
        const payload = { [CHAPTER_IMAGE_MAP[chapter]]: imgUrl };
      
        try {
          const updated = await makeRequest({
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch/${storyId}`,
            method: "PUT",
            body: payload,
            token: dynamicJwtToken,
          });
      
          if (updated) {
            refetch();
          }
        } catch (error) {
          console.error('Error saving chapter banner:', error);
        }
    };

    return (
        <div>
            
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Story Summary</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-between mt-7">
                <Link href={`/dashboard/refine-story?story-id=${storyId}`}>
                    <Button size='sm' variant="outline">Return</Button>
                </Link>
                <Button size='sm'>View Chapters</Button>
                
            </div>

            <div className='my-10 p-7 bg-gray-50 rounded-2xl'>
                <h1 className="font-bold text-2xl mb-4">Story banner*</h1>
                <Accordion type="single" className='' collapsible>
                    <AccordionItem value="item-1 " className='mb-3 border-none'>
                        <AccordionTrigger className='text-xs bg-custom_green px-4 rounded-2xl text-gray-100 mb-3'>Chapter 1</AccordionTrigger>
                        
                        <AccordionContent>
                            {
                                !story?.introductionImage &&
                                <div className='p-5 border flex items-center justify-center h-40 rounded-2xl mb-3 bg-gray-100'>
                                    <ImageIcon />
                                </div>            
                            }
                            {
                                story?.introductionImage &&
                                <img src={story?.introductionImage} alt="" className='w-full object-cover h-[250px] mb-3 rounded-2xl' />          
                            }

<div className="mt-3 p-3 rounded-2xl bg-red-100 border-red-500 border mb-3">
                                <span className="text-xs text-red-600">
                                    Note: One generation per chapter. Any further generation will occur an extra of $0.05. 
                                </span>
                            </div>
                            {
                                !story?.introductionImage &&
                                <Button onClick={() => generateBanner(story?.storyStructure.introduceProtagonistAndOrdinaryWorld, "introduction")} size="sm">Generate Banner</Button>
                            }
                            {
                                story?.introductionImage &&
                                <Button size="sm">Pay with code</Button>
                            }
                            
                        </AccordionContent>                        
                    </AccordionItem>

                    <AccordionItem value="item-2" className='mb-3 border-none'>
                        <AccordionTrigger className='text-xs bg-custom_green px-4 rounded-2xl text-gray-100 mb-3'>Chapter 2</AccordionTrigger>
                        
                        <AccordionContent>
                            {
                                !story?.incitingIncidentImage &&
                                <div className='p-5 border flex items-center justify-center h-40 rounded-2xl mb-3 bg-gray-100'>
                                    <ImageIcon />
                                </div>            
                            }
                            {
                                story?.incitingIncidentImage &&
                                <img src={story?.incitingIncidentImage} alt="" className='w-full object-cover h-[250px] mb-3 rounded-2xl' />          
                            }   

<div className="mt-3 p-3 rounded-2xl bg-red-100 border-red-500 border mb-3">
                                <span className="text-xs text-red-600">
                                    Note: One generation per chapter. Any further generation will occur an extra of $0.05. 
                                </span>
                            </div>
                            {
                                !story?.incitingIncidentImage &&
                                <Button onClick={() => generateBanner(story?.storyStructure?.incitingIncident, "incitingIncident")} size="sm">Generate Banner</Button>
                            }
                            {
                                story?.incitingIncidentImage &&
                                <Button size="sm">Pay with code</Button>
                            }
                        </AccordionContent>                        
                    </AccordionItem>

                    <AccordionItem value="item-3" className='mb-3 border-none'>
                        <AccordionTrigger className='text-xs bg-custom_green px-4 rounded-2xl text-gray-100 mb-3'>Chapter 3</AccordionTrigger>
                        
                        <AccordionContent>
                            {
                                !story?.firstPlotPointImage &&
                                <div className='p-5 border flex items-center justify-center h-40 rounded-2xl mb-3 bg-gray-100'>
                                    <ImageIcon />
                                </div>            
                            }
                            {
                                story?.firstPlotPointImage &&
                                <img src={story?.firstPlotPointImage} alt="" className='w-full object-cover h-[250px] mb-3 rounded-2xl' />          
                            }   

<div className="mt-3 p-3 rounded-2xl bg-red-100 border-red-500 border mb-3">
                                <span className="text-xs text-red-600">
                                    Note: One generation per chapter. Any further generation will occur an extra of $0.05. 
                                </span>
                            </div>

                            {
                                !story?.firstPlotPointImage &&
                                <Button onClick={() => generateBanner(story?.storyStructure?.firstPlotPoint, "firstPlotPoint")} size="sm">Generate Banner</Button>
                            }
                            {
                                story?.firstPlotPointImage &&
                                <Button size="sm">Pay with code</Button>
                            }
                        </AccordionContent>                        
                    </AccordionItem>

                    <AccordionItem value="item-4" className='mb-3 border-none'>
                        <AccordionTrigger className='text-xs bg-custom_green px-4 rounded-2xl text-gray-100 mb-3'>Chapter 4</AccordionTrigger>
                        
                        <AccordionContent>
                            {
                                !story?.risingActionAndMidpointImage &&
                                <div className='p-5 border flex items-center justify-center h-40 rounded-2xl mb-3 bg-gray-100'>
                                    <ImageIcon />
                                </div>            
                            }
                            {
                                story?.risingActionAndMidpointImage &&
                                <img src={story?.risingActionAndMidpointImage} alt="" className='w-full object-cover h-[250px] mb-3 rounded-2xl' />          
                            }   

<div className="mt-3 p-3 rounded-2xl bg-red-100 border-red-500 border mb-3">
                                <span className="text-xs text-red-600">
                                    Note: One generation per chapter. Any further generation will occur an extra of $0.05. 
                                </span>
                            </div> 

                            {
                                !story?.risingActionAndMidpointImage &&
                                <Button onClick={() => generateBanner(story?.storyStructure?.risingActionAndMidpoint, "risingActionAndMidpoint")} size="sm">Generate Banner</Button>
                            }
                            {
                                story?.risingActionAndMidpointImage &&
                                <Button size="sm">Pay with code</Button>
                            }
                            
                        </AccordionContent>                        
                    </AccordionItem>


                    <AccordionItem value="item-5" className='mb-3 border-none'>
                        <AccordionTrigger className='text-xs bg-custom_green px-4 rounded-2xl text-gray-100 mb-3'>Chapter 5</AccordionTrigger>
                        
                        <AccordionContent>
                            {
                                !story?.pinchPointsAndSecondPlotPointImage &&
                                <div className='p-5 border flex items-center justify-center h-40 rounded-2xl mb-3 bg-gray-100'>
                                    <ImageIcon />
                                </div>            
                            }
                            {
                                story?.pinchPointsAndSecondPlotPointImage &&
                                <img src={story?.pinchPointsAndSecondPlotPointImage} alt="" className='w-full object-cover h-[250px] mb-3 rounded-2xl' />          
                            }   

<div className="mt-3 p-3 rounded-2xl bg-red-100 border-red-500 border mb-3">
                                <span className="text-xs text-red-600">
                                    Note: One generation per chapter. Any further generation will occur an extra of $0.05. 
                                </span>
                            </div>
                            {
                                !story?.pinchPointsAndSecondPlotPointImage &&
                                <Button onClick={() => generateBanner(story?.storyStructure?.pinchPointsAndSecondPlotPoint, "pinchPointsAndSecondPlotPoint")} size="sm">Generate Banner</Button>
                            }
                            {
                                story?.pinchPointsAndSecondPlotPointImage &&
                                <Button size="sm">Pay with code</Button>
                            }
                        </AccordionContent>                        
                    </AccordionItem>

                    <AccordionItem value="item-6" className='mb-3 border-none'>
                        <AccordionTrigger className='text-xs bg-custom_green px-4 rounded-2xl text-gray-100 mb-3'>Chapter 6</AccordionTrigger>
                        
                        <AccordionContent>
                            {
                                !story?.climaxAndFallingActionImage &&
                                <div className='p-5 border flex items-center justify-center h-40 rounded-2xl mb-3 bg-gray-100'>
                                    <ImageIcon />
                                </div>            
                            }
                            {
                                story?.climaxAndFallingActionImage &&
                                <img src={story?.climaxAndFallingActionImage} alt="" className='w-full object-cover h-[250px] mb-3 rounded-2xl' />          
                            }   

<div className="mt-3 p-3 rounded-2xl bg-red-100 border-red-500 border mb-3">
                                <span className="text-xs text-red-600">
                                    Note: One generation per chapter. Any further generation will occur an extra of $0.05. 
                                </span>
                            </div>
                            {
                                !story?.climaxAndFallingActionImage &&
                                <Button onClick={() => generateBanner(story?.storyStructure?.climaxAndFallingAction, "climaxAndFallingAction")} size="sm">Generate Banner</Button>
                            }
                            {
                                story?.climaxAndFallingActionImage &&
                                <Button size="sm">Pay with code</Button>
                            }
                        </AccordionContent>                        
                    </AccordionItem>

                    <AccordionItem value="item-7" className='mb-3 border-none'>
                        <AccordionTrigger className='text-xs bg-custom_green px-4 rounded-2xl text-gray-100 mb-3'>Chapter 7</AccordionTrigger>
                        
                        <AccordionContent>
                            {
                                !story?.resolutionImage &&
                                <div className='p-5 border flex items-center justify-center h-40 rounded-2xl mb-3 bg-gray-100'>
                                    <ImageIcon />
                                </div>            
                            }
                            {
                                story?.resolutionImage &&
                                <img src={story?.resolutionImage} alt="" className='w-full object-cover h-[250px] mb-3 rounded-2xl' />          
                            }   

                            <div className="mt-3 p-3 rounded-2xl bg-red-100 border-red-500 border mb-3">
                                <span className="text-xs text-red-600">
                                    Note: One generation per chapter. Any further generation will occur an extra of $0.05. 
                                </span>
                            </div>
                            {
                                !story?.resolutionImage &&
                                <Button onClick={() => generateBanner(story?.storyStructure?.resolution, "resolution")} size="sm">Generate Banner</Button>
                            }
                            {
                                story?.resolutionImage &&
                                <Button size="sm">Pay with code</Button>
                            }
                        </AccordionContent>                        
                    </AccordionItem>
                </Accordion>
                 <Button onClick={publishStory} className='w-full mt-5 flex items-center gap-2'>
                    Publish
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" className='w-4 h-4' viewBox="0 0 96 96" preserveAspectRatio="xMidYMid meet">
                        <g transform="translate(0,96) scale(0.1,-0.1)" fill="#FFFFFF" stroke="none">
                            <path d="M431 859 c-81 -16 -170 -97 -186 -169 -5 -22 -15 -32 -42 -41 -46 -15 -99 -63 -125 -112 -27 -54 -27 -140 1 -194 40 -78 157 -151 181 -112 12 18 4 27 -38 45 -76 31 -112 85 -112 167 0 62 25 108 79 144 44 29 132 32 176 5 35 -22 55 -18 55 9 0 22 -66 59 -105 59 -23 0 -25 3 -20 23 11 35 57 88 95 108 46 25 134 25 180 0 19 -10 48 -35 64 -55 41 -50 49 -145 17 -206 -24 -46 -26 -66 -9 -76 14 -9 54 39 69 84 10 30 14 33 38 27 14 -3 41 -21 60 -40 27 -27 35 -43 39 -84 2 -27 2 -61 -2 -75 -9 -36 -62 -84 -107 -96 -28 -8 -39 -16 -39 -30 0 -30 56 -26 106 6 112 73 131 213 42 310 -23 25 -57 49 -81 57 -38 12 -42 17 -49 57 -22 127 -155 215 -287 189z"/>
                            <path d="M464 460 c-29 -11 -104 -99 -104 -121 0 -30 32 -23 62 13 l27 33 1 -127 c0 -139 4 -158 30 -158 26 0 30 19 30 158 l1 127 27 -33 c29 -35 62 -43 62 -14 0 19 -72 107 -98 121 -10 5 -26 5 -38 1z"/>
                        </g>
                    </svg>    
                </Button>
            </div>






            <Sheet open={modifyModalOpen} onOpenChange={setModifyModalOpen}>
                <SheetContent className="overflow-y-scroll xs:min-w-[90%] sm:min-w-[96%] md:min-w-[65%] lg:min-w-[65%] xl:min-w-[55%]">
                    <SheetHeader className=''>
                        <SheetTitle>Edit Chapter</SheetTitle>
                        <SheetDescription> </SheetDescription>
                    </SheetHeader>

                    <div className='my-10 p-7 bg-gray-50 rounded-2xl'>
                        <p className={cn("font-semibold text-xl first-letter:text-4xl whitespace-pre-wrap", inter.className)}>{story?.storyStructure?.introduceProtagonistAndOrdinaryWorld}</p>
                    </div>
                </SheetContent>
            </Sheet>
            
        </div>
    );
}

export default MyComponent