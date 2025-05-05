'use client';

import React, { use, Suspense, useState } from 'react'
import Image from "next/image";
import TopRankingStoryComponent from '@/components/story/TopRankingStoryComponent';
import PopularStoryComponent from '@/components/story/PopularStoryComponent';
import { ArrowLeft, ArrowRight, Dot } from 'lucide-react';
import { Heart, MessageCircle, Share2, BookmarkPlus } from 'lucide-react';
import Link from 'next/link';
import ReadStoryComponent from '@/components/story/ReadStoryComponent';
import StoryCommentsComponent from '@/components/story/StoryCommentsComponent';
import LayoutOneNavComponent from '@/components/navigation/LayoutOneNavComponent';
import { StoryInterface } from '@/interfaces/StoryInterface';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ChapterInterface } from '@/interfaces/ChapterInterface';
import { useSearchParams } from 'next/navigation';


interface ReadStoryProps {
    params: Promise<{ id: string }>
}

function ReadStory({params}: ReadStoryProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReadStoryPage params={params}/>
        </Suspense>
    );
}

const ReadStoryPage = ({ params }: ReadStoryProps) => {
    const { id } = use(params);
    const decodedId = decodeURIComponent(id);
    const storyId = decodedId;

    const chapterIndex = useSearchParams().get('chapter');
    

    const [story, setStory] = useState<StoryInterface|null>(null);
    const [chapter, setChapter] = useState<ChapterInterface|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { data: storyData, isFetching, isLoading, isError, refetch } = useQuery({
        queryKey: ['storyFromScratchFormData', storyId],
        queryFn: async () => {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/unauthenticated/${storyId}`;
        
            const response = await axios.get(url);
            if (response?.data?.story) {
                setStory(response?.data?.story);

                let chapter = response?.data?.story?.chapters.find((chapter: ChapterInterface) => chapter.index.toString() === chapterIndex) 
                
                setChapter(chapter)
                // setAccessRecord(response?.data?.accessRecord)
                // seDepositAddress(response?.data?.depositAddress)
            }
            setLoading(false);
        
            return response?.data?.story;
        },
        enabled: !!storyId && !story,
    });


    return (
        <div style={{ display: 'flex', height: '100vh' }} className='bg-[#FBFBFB]'>
            <div className="left-menu w-[120px] p-5 bg-white">
                {/* Your left menu content here */}

                <div className="w-full flex justify-center mb-10">
                    <Link href="/" className=''>
                        <Image src="/logo/fable_black.png" alt="Fable logo" className="rounded-xl" width={60} height={60} />
                    </Link>
                </div>

                <div className="w-full flex justify-center">
                    <Link href="/dashboard" className='flex cursor-pointer items-center gap-3 bg-[#f6f6f6] rounded-xl p-5 hover:bg-gray-200'>
                        <Image src="/icon/feather.svg" alt="feather icon" className=" " width={20} height={20} />
                    </Link>
                </div>
            </div>
            <div className="main-content flex flex-col flex-1 " >

                <nav className="fixed bg-transparent top-0 p-4 backdrop-blur-xl" style={{ position: 'sticky'}}>
                    <div className="flex items-center justify-between">
                        <div className='flex items-center gap-3'>
                            <Link href="/stories" className='text-black bg-white border cursor-pointer flex items-center justify-center py-2 px-2 rounded-lg transition-all'>
                                <ArrowLeft size={16} />
                            </Link>
                            <h2 className="text-gray-500 text-2xl font-bold">Stories</h2>
                        </div>

                        <div className="flex ">
                            <div className="bg-[#D8D1DE3D] cursor-pointer border  flex items-center px-2 py-1 gap-2 rounded-md border-gray-50 hover:bg-gray-200">
                                <div className="stories-btn text-xs text-gray-500">
                                    Total publications
                                </div>
                                <div className=" bg-white text-lg rounded-sm px-2 py-1 font-semibold">200</div>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className='px-20 overflow-y-auto'>

                    <ReadStoryComponent setChapter={setChapter} activeChapter={chapter} story={story}/>
                    <StoryCommentsComponent story={story}/>
                </div>
            </div>
        </div>
    );
};

export default ReadStory;





{/* <div className="right-container p-5 col-span-2">
    <div>
        <div className="flex items-center justify-between">
            <h2 className='text-gray-900 text-2xl font-bold'>Top Ranking</h2>
            
            <div className='bg-[#F5F5F5] rounded-xl p-2 cursor-pointer'>
                <Image src="/icon/bell.svg" alt="add-circle-half-dot icon" className=" " width={16} height={16} />
            </div>
        </div>
        <p className="mt-3 text-xs text-gray-600 font-light">Get caught up with Fable's top most publications.</p>

        <div className="mt-6 max-h-[500px] overflow-y-auto">
            <TopRankingStoryComponent image="/img/placeholder.png" />
            <TopRankingStoryComponent image="/img/placeholder2.png" />
            <TopRankingStoryComponent image="/img/placeholder3.png" />
        </div>
    </div>

    <div className='mt-16'>
        <div className="flex items-center justify-between">
            <h2 className='text-gray-900 text-2xl font-bold'>Popular</h2>
            
            <div className='bg-[#F5F5F5] rounded-xl p-2 cursor-pointer'>
                <Image src="/icon/bell.svg" alt="add-circle-half-dot icon" className=" " width={16} height={16} />
            </div>
        </div>
        <p className="mt-3 text-xs text-gray-600 font-light">
        Get caught up with Fable's top most publications.
        </p>

        <div className="mt-6 max-h-[500px] overflow-y-auto">
            <PopularStoryComponent image="/img/placeholder.png" />
            <PopularStoryComponent image="/img/placeholder2.png" />
            <PopularStoryComponent image="/img/placeholder3.png" />
        </div>
    </div>
</div> */}