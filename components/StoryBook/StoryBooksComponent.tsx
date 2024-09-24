"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { Button } from '../ui/button';
import { getStoryBooks } from '@/lib/getAllStories';
import { StoryBook } from '@/types/stories';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';

function StoryBooksComponent() {
    const [storyBooks, setStoryBooks] = useState([]);
    const dynamicJwtToken = getAuthToken();

    const fetchStoryBooks = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories`;

            const response = await axiosInterceptorInstance.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${dynamicJwtToken}`
                    }
                }
            );
            console.log(response);
            if(response?.data){
                setStoryBooks(response?.data.stories)
                return response?.data.stories
            }
            return false;
            
        } catch (error) {
            console.log(error);
            return false;            
        }
    }
 
    useEffect(() => {
        fetchStoryBooks()
    }, [])

    return (
        <>
            {/* <Button>Test</Button> */}
            {storyBooks && 
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
                {storyBooks.map((story, index) => (
                    <Link href={`/story-books/${story?.id}`} key={index}
                    className='border rounded-lg cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out'>
                        <div className='relative'>
                            <p className='absolute flex items-center top-0 right-0
                            bg-white text-blue-500 font-bold p-3 rounded-lg m-2 text-xs
                            '>
                                <BookOpen className='w-4 h-4 mr-1' />    
                                {story.pages.length === 1 
                                    ? `${story.pages.length} Page`
                                    : `${story.pages.length} Pages`
                                }
                            </p>    
                            <Image 
                            src={story?.pages[0]?.imageUrl} 
                            width={500}
                            height={500}
                            // placeholder='blur'
                            className='w-full object-contain rounded-t-lg'
                            alt={story?.title} 
                            // blurDataURL={blurredImageData}
                            />
                        </div>    
                        <h2 className='text-md p-5 first-letter:text-3xl font-light text-center'>{story?.title}</h2>
                    </Link>
                ))}
            </div>
            }
        </>
    )
}

export default StoryBooksComponent
