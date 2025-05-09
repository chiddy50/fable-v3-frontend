"use client"

import { StoryInterface } from '@/interfaces/StoryInterface'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import StoryGridViewComponent from '../story/StoryGridViewComponent'

const CreatorStoriesComponent = ({ userId }: { userId: string }) => {

    const [limit, setLimit] = useState(9)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPrevPage, setHasPrevPage] = useState(false)
    const [totalPages, setTotalPages] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [loadingStories, setLoadingStories] = useState(true);
    const [stories, setStories]= useState<StoryInterface[]>([]);   

    useEffect(() => {
        getStories();
    }, []);

    const paginateChallenges = (page: number) => {
        let set_next_page = currentPage + page
        setCurrentPage(set_next_page)
                   
        getStories(set_next_page)
    }

    const getStories = async (page = 1) => {
        try {
            setLoadingStories(true);

            let params = {
                page: page,
                limit: limit,
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/stories/users/${userId}`, {
                params
            })
            setStories(response?.data?.stories);
            setHasNextPage(response?.data?.hasNextPage)
            setHasPrevPage(response?.data?.hasPrevPage)
            setTotalPages(response?.data?.totalPages)  

        } catch (error) {
            console.error(error);            
        }finally{
            setLoadingStories(false)
        }
    }

    return (
        <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-h-[1000px]'>
            { 
                stories.map(story =>  (

                    <StoryGridViewComponent key={story?.id} story={story} image={story?.coverImageUrl} />
                ))
            }
        </div> 
    )
}

export default CreatorStoriesComponent
