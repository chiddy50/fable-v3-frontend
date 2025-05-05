"use client"

import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { ArrowDown, Eye, Plus } from 'lucide-react';
import GenrePillsComponent from '@/components/shared/GenrePillsComponent';
import Link from 'next/link';
import BookmarkComponent from '@/components/shared/BookmarkComponent';
import CommentBtnComponent from '@/components/shared/CommentBtnComponent';
import ShareBtnComponent from '@/components/shared/ShareBtnComponent';
import RatingBtnComponent from '@/components/shared/RatingBtnComponent';
import { StoryInterface } from '@/interfaces/StoryInterface';

const CreatorStoriesComponent = ({ title, editUrl, type }: { title: string, editUrl: string, type: string }) => {
    const [storyData, setStoryData] = useState<StoryInterface[]|[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        getData()
    }, []);

    const getData = async () => {
        try {
            setIsFetching(true);
            const response = await axiosInterceptorInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories?status=${type}`);
            setStoryData(response?.data?.stories)
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false)
        }
    }

    return (
        <>

            <h1 className="text-gray-600 mb-5 text-2xl font-semibold">{title}</h1>

            {storyData?.length > 0 && 
                <div className='grid grid-cols-3 gap-5 overflow-y-auto'>
                    {
                        storyData.map(item => (
                            <div key={item?.id} className="w-full mb-5">
                                <div className="relative w-full h-[230px] rounded-2xl border overflow-hidden">
                                    <img
                                        src={item.coverImageUrl ?? `/img/draft.png`}
                                        alt="story cover image"
                                        className="object-cover rounded-xl w-full"
                                    />

                                    {/* <p className="absolute bottom-2 left-2 px-3 py-1 text-gray-50 bg-gray-800 rounded-full text-[10px]">5min ago</p> */}
                                    <div className='absolute bottom-3 right-3'>
                                        <GenrePillsComponent genres={item?.genres}/>
                                    </div>

                                    <span className="px-3 py-1 absolute top-3 left-3 bg-gray-100 text-gray-800 rounded-lg text-[10px]">
                                        {item.status === 'draft' ? 'Draft' : 'Published' }    
                                    </span>


                                </div>

                                <Link href={`${editUrl}?story-id=${item.id}&current-step=${item?.currentStep ?? 1}`}>
                                    <h1 className='my-4 font-bold text-xl hover:underline'>{item?.projectTitle}</h1>
                                </Link>

                                <div className="flex items-center flex-wrap gap-3">
                                    <CommentBtnComponent />
                                    <ShareBtnComponent />
                                    <RatingBtnComponent />
                                </div>
                            </div>
                        ))
                    }
                </div>
            }

            {storyData?.length < 1 && 
                <div className="h-80 bg-white rounded-xl flex gap-2 flex-col items-center justify-center">
                    <Image src="/icon/feather.svg" alt="feather icon" className=" " width={35} height={35} />
                    <p className="text-xs">No story added yet</p>
                </div>
            }
        </>
    )
}

export default CreatorStoriesComponent
