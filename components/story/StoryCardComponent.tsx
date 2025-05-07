


"use client"

import React from 'react'
import StoryGridViewComponent from './StoryGridViewComponent';
// import StoryListViewComponent from './StoryListViewComponent';
import { StoryInterface } from '@/interfaces/StoryInterface';

const StoryCardComponent = ({ activeControl, stories }: { activeControl: string, stories: StoryInterface[] }) => {
    return (
        <>
            {/* { activeControl === "list" && 
                <div className='max-h-[800px] overflow-y-auto'>
                    { 
                        stories.map(story =>  (

                            <StoryListViewComponent key={story?.id} image={story?.coverImageUrl} story={story} authorCount={1} />
                        ))
                    }                    
                    
                </div> 
            } */}

            { activeControl === "grid" && 
                <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-h-[1000px]'>
                    { 
                        stories.map(story =>  (

                            <StoryGridViewComponent key={story?.id} story={story} image={story?.coverImageUrl} />
                        ))
                    }
                </div> 
            }
        </>
    )
}

export default StoryCardComponent
