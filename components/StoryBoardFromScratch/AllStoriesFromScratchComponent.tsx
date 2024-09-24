"use client";

import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { FilmIcon, Edit, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function AllStoriesFromScratchComponent() {
    const [stories, setStories] = useState([]);

    const dynamicJwtToken = getAuthToken();
    const { push } = useRouter();

    const fetchStories = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/from-scratch?type=from-scratch`;

            const response = await axiosInterceptorInstance.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${dynamicJwtToken}`
                    }
                }
            );
            console.log(response);
            if(response?.data){
                setStories(response?.data.stories)
                return response?.data.stories
            }
            return false;
            
        } catch (error) {
            console.log(error);
            return false;            
        }
    }
 
    useEffect(() => {
        fetchStories()
    }, [])

    return (
        <div className='w-[90%] mx-auto'>
            <h1 className="mb-7 text-4xl font-bold">Here are your stories:</h1>
            <div className='grid grid-cols-3 gap-5'>
                {
                    stories.map((story) => (
                        <div 
                        key={story.id} 
                        className="flex items-center gap-5 border p-4 rounded-xl cursor-pointer ">
                            <div className="p-3 rounded-full bg-black">
                                <FilmIcon className="text-blue-600 h-8 w-8"/>
                            </div>
                            <div className='w-full'>
                                <div className='flex flex-wrap gap-2 mb-5'>
                                    {
                                        story.genres.map(genre => (
                                            <div key={genre.value} className='px-4 py-1 rounded-lg border text-xs'>{genre.label}</div>
                                        ))
                                    }
                                </div>
                                <div className="flex items-center gap-3">
                                    <div onClick={() => push(`/story-board-from-scratch?story-id=${story.id}&current-step=${story.currentStepUrl}`)} className='px-4 py-1 rounded-xl text-xs bg-red-600 text-white hover:border-red-800'>
                                        View
                                    </div>
                                    <div onClick={() => push(`/story-board-from-scratch?story-id=${story.id}&current-step=${story.currentStepUrl}`)} className='px-4 py-1 rounded-xl text-xs bg-blue-600 text-white hover:border-blue-800'>
                                        Edit
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
                
            </div>
        </div>
    )
}

export default AllStoriesFromScratchComponent
