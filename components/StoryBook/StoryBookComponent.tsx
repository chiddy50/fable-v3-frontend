"use client";

import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import React, { useEffect, useState } from 'react';
import { Story as StoryType } from "@/types/stories"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
  } from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { DM_Sans, Dosis } from "next/font/google";
import { cn } from '@/lib/utils'


const sans = Dosis({ subsets: ['latin'] });

function StoryBookComponent({ id }: {id: string|number}) {
    const [storyBook, setStoryBook] = useState(null);
    const dynamicJwtToken = getAuthToken();
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    const fetchStoryBook = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/${id}`;

            const response = await axiosInterceptorInstance.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${dynamicJwtToken}`
                    }
                }
            );

            console.log(response);
            if(response?.data){
                setStoryBook(response?.data.story)
                // return response?.data.stories
            }
            return false;
            
        } catch (error) {
            console.log(error);
            return false;            
        }
    }
 
    useEffect(() => {
        fetchStoryBook()
    }, [])

    useEffect(() => {
        if(!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api])

    return (
        <div>
            {storyBook &&
                <div className='px-20'>
                    <Carousel setApi={setApi} className='w-full lg:w-4/5 h-56 mx-auto'>
                        <CarouselContent className='px-5'>
                            {storyBook?.pages.map((page, i) => (
                                <CarouselItem key={i}>
                                    <Card className='p-5 md:p-10 border'>
                                        <h2 className='text-center text-gray-400'>{storyBook?.title}</h2>
                                        
                                        <CardContent className='p-5 xl:flex'>
                                            <Image 
                                                src={page?.imageUrl}
                                                alt={`Page ${i + 1} image`}
                                                width={500}
                                                height={500}
                                                className='w-80 h-8 xl:w-[500px] xl:h-[500px] rounded-3xl mx-auto float-right p-5 xl:order-last'
                                            />

                                            <p className={cn(
                                                "font-semibold text-xl first-letter:text-4xl whitespace-pre-wrap", 
                                                sans.className
                                            )}>{page?.content}</p>
                                        </CardContent>

                                        <p  className='text-center text-gray-400'>
                                            Page {current} of {count}
                                        </p>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <CarouselPrevious/>
                        <CarouselNext/>
                    </Carousel>
                </div>
            }
        </div>
    )
}

export default StoryBookComponent
