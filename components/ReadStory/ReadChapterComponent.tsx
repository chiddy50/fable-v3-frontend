"use client";

import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { DM_Sans, Dosis } from "next/font/google";
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { formatDate, trimWords } from '@/lib/helper';
import { makeRequest } from '@/services/request';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton"
import MakePaymentComponent from './MakePaymentComponent';
import { toast } from 'sonner';
import StoryBannerComponent from './StoryBannerComponent';

const sans = Dosis({ subsets: ['latin'] });

const ReadChapterComponent = ({
    story,
    accessRecord,
    moveToNextChapter,
    refetch,
    depositAddress
}) => {

    const move = (value: string) => {
        if (value === "prev" && accessRecord?.currentChapter === "1") return;

        if (accessRecord?.hasAccess === false && value === "next" && accessRecord?.currentChapter === "2") {
            toast.error("Payment is required")
            return;    
        }

        let currentChapter = accessRecord?.currentChapter ? parseInt(accessRecord?.currentChapter) : parseInt("1");
        let nextChapter = 1;
        if (value === "prev") {            
            nextChapter = currentChapter - 1; 
        }
        if (value === "next") {            
            nextChapter = currentChapter + 1; 
        }

        if (nextChapter > 7) {
            return;
        }
        
        moveToNextChapter(nextChapter?.toString())
    }

    return (
        <div className=' min-h-svh'>
            <h3 className="text-lg tracking-widest mt-4 text-center text-gray-400 uppercase">{story?.projectTitle}</h3>

            <div className="flex items-center justify-between mt-7">
                <ArrowLeftCircle className='cursor-pointer w-8 h-8' onClick={() => move("prev")} />
                <h3 className="text-4xl  text-center tracking-widest font-bold">CHAPTER {accessRecord?.currentChapter}</h3>
                <ArrowRightCircle className='cursor-pointer w-8 h-8' onClick={() => move("next")}/>
            </div>

            <div className='mt-5 mb-10'>
                <p className="text-xs flex gap-2 mt-2 pt-2 border-t items-center justify-center">
                    <span className='text-gray-600 italic'>Published by </span><span className='font-semibold capitalize'> {story?.user?.name}</span>
                </p>
                <p className="text-xs text-center text-gray-400 pb-2 border-b flex gap-5 mt-1 items-center justify-center">
                    <span>5 min read</span>
                    <span>{story?.publishedAt ? formatDate(story?.publishedAt) : ""}</span>
                </p>
            </div>
        
            <div className='mb-10'>
                {
                    accessRecord?.currentChapter === "1" &&
                    <>

                    <StoryBannerComponent image={story?.introductionImage} />

                    <p className={cn("font-semibold text-xl first-letter:text-4xl whitespace-pre-wrap", sans.className)}>{story?.storyStructure?.introduceProtagonistAndOrdinaryWorld}</p>
                    </>
                }

                {
                    accessRecord?.currentChapter === "2" && accessRecord.hasAccess === false &&
                    <>
                        <StoryBannerComponent image={story?.incitingIncidentImage} />

                        <p className={cn(`ont-semibold text-xl first-letter:text-4xl whitespace-pre-wrap testing mb-7 
                           bg-clip-text text-transparent bg-gradient-to-b from-black to-transparent 
                            `, sans.className)}>
                            {/* {story?.storyStructure?.incitingIncident} */}
                            {story?.storyStructure?.incitingIncident ? trimWords(story?.storyStructure?.incitingIncident, 200) : ""}
                        </p>
                        {
                            accessRecord.hasAccess === false && 
                            <div>
                                <MakePaymentComponent accessRecord={accessRecord} depositAddress={depositAddress} story={story} refetch={refetch}/>
                            </div>
                        }                        
                    </>
                }

                {   
                    accessRecord?.currentChapter === "2" && accessRecord.hasAccess === true && 
                    <>
                        <StoryBannerComponent image={story?.incitingIncidentImage} />
                        <p className={cn("font-semibold text-xl first-letter:text-4xl whitespace-pre-wrap", sans.className)}>{story?.storyStructure?.incitingIncident}</p>
                    </>
                }

                {
                    accessRecord?.currentChapter === "3" && accessRecord.hasAccess === true && 
                    <>
                        <StoryBannerComponent image={story?.firstPlotPointImage} />                    
                        <p className={cn("font-semibold text-xl first-letter:text-4xl whitespace-pre-wrap", sans.className)}>{story?.storyStructure?.firstPlotPoint}</p>
                    </>
                }

                {
                    accessRecord?.currentChapter === "4" && accessRecord.hasAccess === true && 
                    <>
                        <StoryBannerComponent image={story?.risingActionAndMidpointImage} />                                        
                        <p className={cn("font-semibold text-xl first-letter:text-4xl whitespace-pre-wrap", sans.className)}>{story?.storyStructure?.risingActionAndMidpoint}</p>
                    </>
                }

                {
                    accessRecord?.currentChapter === "5" && accessRecord.hasAccess === true && 
                    <>
                        <StoryBannerComponent image={story?.pinchPointsAndSecondPlotPointImage} />                                                            
                        <p className={cn("font-semibold text-xl first-letter:text-4xl whitespace-pre-wrap", sans.className)}>{story?.storyStructure?.pinchPointsAndSecondPlotPoint}</p>
                    </>
                }

                {
                    accessRecord?.currentChapter === "6" && accessRecord.hasAccess === true && 
                    <>
                        <StoryBannerComponent image={story?.climaxAndFallingActionImage} />                                                            
                        <p className={cn("font-semibold text-xl first-letter:text-4xl whitespace-pre-wrap", sans.className)}>{story?.storyStructure?.climaxAndFallingAction}</p>
                    </>
                }

                {
                    accessRecord?.currentChapter === "7" && accessRecord.hasAccess === true && 
                    <>
                        <StoryBannerComponent image={story?.resolutionImage} />                                                                                
                        <p className={cn("font-semibold text-xl first-letter:text-4xl whitespace-pre-wrap", sans.className)}>{story?.storyStructure?.resolution}</p>
                    </>
                }
            </div>

            <div className="flex items-center justify-between pb-10">
                <ArrowLeftCircle className='cursor-pointer w-10 h-10' onClick={() => move("prev")} />
                { accessRecord?.currentChapter !== "7" && <h3 className="text-sm text-center font-semibold">NEXT - CHAPTER { 1 + parseInt(accessRecord?.currentChapter) }</h3> }
                { accessRecord?.currentChapter === "7" && <h3 className="text-sm text-center font-semibold">THE END</h3> }
                <ArrowRightCircle className='cursor-pointer w-10 h-10' onClick={() => move("next")}/>            
            </div>
        </div>
    )
}

export default ReadChapterComponent