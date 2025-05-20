"use client"

import { StoryInterface } from '@/interfaces/StoryInterface'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import StoryGridViewComponent from '../story/StoryGridViewComponent'

import Image from 'next/image';
import GenrePillsComponent from '../shared/GenrePillsComponent';
import BookmarkComponent from '../shared/BookmarkComponent';
import CommentBtnComponent from '../shared/CommentBtnComponent';
import ShareBtnComponent from '../shared/ShareBtnComponent';
import RatingBtnComponent from '../shared/RatingBtnComponent';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/helper';
import ReadStoryPreviewComponent from '../story/read/ReadStoryPreviewComponent'
import AuthorComponent from '../story/AuthorComponent'
import { log } from 'util'

const CreatorStoriesComponent = ({ userId, storyCount }: { userId: string, storyCount: number }) => {

    const [limit, setLimit] = useState(9)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPrevPage, setHasPrevPage] = useState(false)
    const [totalPages, setTotalPages] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [loadingStories, setLoadingStories] = useState(true);
    const [stories, setStories] = useState<StoryInterface[]>([]);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [selectedStory, setSelectedStory] = useState<StoryInterface|null>(null);

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
        } finally {
            setLoadingStories(false)
        }
    }

    const showStoryPreview = (story: StoryInterface) => {
        setSelectedStory(story)
        setShowPreview(true) 
    }

    return (
        <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-h-[1000px]'>
            {
                stories.map(story => (

                    // <StoryGridViewComponent 
                    //     key={story?.id} 
                    //     story={story} 
                    //     image={story?.coverImageUrl ?? story?.bannerImageUrl} 
                    //     storyCount={storyCount}
                    //     />
                    <div className="w-full mb-5 p-3 rounded-2xl  bg-gradient-to-b from-[#e1e1e1] to-[#fff]">

                        <div className="relative w-full h-[230px] mb-3 rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105"
                            style={{
                                backgroundImage: `url(${story?.coverImageUrl ?? story?.bannerImageUrl ?? `/logo/fable_black.png`})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                                // backgroundPosition: 'center top'
                            }}
                        >

                            <p className="absolute top-2 left-2 px-3 py-1 text-gray-50 bg-gray-800 rounded-full text-[10px]">
                                {story?.publishedAt ? formatDate(story?.publishedAt) : ""}
                            </p>
                            <div className='absolute bottom-3 right-3 left-3'>
                                <GenrePillsComponent genres={story?.genres} />
                            </div>

                        </div>

                        <h1 className='mt-3 font-bold text-lg capitalize min-h-[54px]'>
                            {story?.projectTitle}
                        </h1>

                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex gap-3">
                                <BookmarkComponent />
                                <CommentBtnComponent count={story?._count?.comments} />
                                <ShareBtnComponent />
                                {/* <RatingBtnComponent /> */}
                            </div>

                            <div>
                                <button onClick={() => showStoryPreview(story) } className='text-white cursor-pointer flex items-center justify-center py-2 px-4 rounded-lg m-2 bg-gradient-to-r hover:from-[#AA4A41] hover:to-[#33164C] to-[#AA4A41] from-[#33164C] transition-all'>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>




                        {story &&
                            <ReadStoryPreviewComponent
                                showPreview={showPreview}
                                setShowPreview={setShowPreview}
                                story={selectedStory}
                            />
                        }

                    </div>
                ))
            }
        </div>
    )
}

export default CreatorStoriesComponent
