"use client";

import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
// import { getAuthToken, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { Button } from '../ui/button';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

function StoryScenes() {
    const [stories, setStories] = useState([]);

    // const dynamicJwtToken = getAuthToken();
    // const { user } = useDynamicContext()

    const createStories = async () => {

        try {            
            const response = await fetch("/api/test", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify({ stories, dynamicJwtToken })
            })            
            
            if (response.ok && response.body) {
                const data = await response.json()
                console.log(data);
                console.log('SUCCESS');            
                
            }else{
                console.error('Failed');            
            }
        } catch (error) {
            console.error(error);            
        }
    }

    const fetchStoryScenes = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories?type=story-board`;

            const response = await axiosInterceptorInstance.get(url);
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
        fetchStoryScenes()
    }, [])

    // const { data, isFetching, isPending, isError, error } = useQuery({
    //     queryKey: ['getStoryScenesData'],
    //     queryFn: async () => {
    //       const data = await fetchStoryScenes();
    //       return data;
    //     },
    // });

    // if(!user) return "Kindly Login";

    // if (isPending) return 'Loading...'

    // if (isError) return 'An error has occurred: ' + error.message
  
    return (
        <div className='p-10 max-w-7xl mx-auto'>      
            <Button onClick={createStories}>Test</Button>
            {stories?.length === 0 && <p>No stories found.</p>}      
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
                {stories.map((story, index) => (
                    <Link href={`/story-scenes/${story?.id}`} key={index}
                    className='border rounded-lg cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out'>
                        <div className='relative'>
                            <p className='absolute flex items-center top-0 right-0
                            bg-white text-blue-500 font-bold p-3 rounded-lg m-2 text-xs
                            '>
                                <BookOpen className='w-4 h-4 mr-1' />    
                                {story.scenes?.length === 1 
                                    ? `${story?.scenes?.length} Scene`
                                    : `${story?.scenes?.length} Scenes`
                                }
                            </p>   

    
                            <Image 
                            src={story?.imageUrl ?? '/no-image.png'} 
                            width={500}
                            height={500}
                            className='w-full object-contain rounded-t-lg'
                            alt={story?.title} 
                            />
                        </div>    
                        <h2 className='text-md p-5 first-letter:text-3xl font-light text-center capitalize'>{story?.title}</h2>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default StoryScenes
