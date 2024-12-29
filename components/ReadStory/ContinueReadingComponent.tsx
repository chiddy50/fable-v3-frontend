"use client";

import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image';
import { Button } from '../ui/button';
import ChapterProgressBarComponent from './ChapterProgressBarComponent';

const ContinueReadingComponent = ({
    continueStories,
    moveToReadStory
}) => {
    return (
        <div className='mb-36 px-7'>
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <CarouselContent>      
                    {
                        continueStories.map(item => (

                            <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">

                                <div className="responsive h-full " >            
                                    <div className='flex relative h-full flex-col shadow-xl overflow-y-clip rounded-xl bg-white'>
                                    <div className='relative overflow-hidden h-[300px]'>                    
                                        <Image
                                        fill={true}
                                        src={item?.story?.introductionImage ?? '/no-image.png'}
                                        alt={item?.projectTitle ?? 'character description'}                        
                                        className='w-full rounded-t-xl h-full object-cover object-center'                     
                                        loading="lazy"
                                        sizes="(max-width: 768px) 100%, (max-width: 1200px) 100%, 100%"
                                        />
                                    </div>
                                    <div className="h-1/2 p-4 flex flex-col  bg-gray-900 justify-between">
                                        <h2 className='font-semibold text-lg tracking-wider text-gray-50 text-center mb-2'>{item?.story?.projectTitle}</h2>
                                        
                                        <ChapterProgressBarComponent chapter={Number(item?.currentChapter)}/>
                                                                           
                                        <Button variant="outline" onClick={() => moveToReadStory(item?.story?.id)} className='w-full mt-2'>Continue Reading</Button>
                                
                                    </div>

                                    </div>
                                </div>

                            </CarouselItem>
                        ) )
                    }          

                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default ContinueReadingComponent
