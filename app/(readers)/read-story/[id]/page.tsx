'use client';

import React, { use, Suspense, useState, useEffect } from 'react'
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
import { Skeleton } from "@/components/ui/skeleton"
import { ReadersHeaderComponent } from '@/components/shared/ReadersHeaderComponent';
import { usePrivy } from '@privy-io/react-auth';


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

    const chapterIndex = useSearchParams().get('chapter') ?? 1;    

    const [story, setStory] = useState<StoryInterface|null>(null);
    const [chapter, setChapter] = useState<ChapterInterface|null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [disableNextBtn, setDisableNextBtn] = useState<boolean>(false);
    const [disablePrevBtn, setDisablePrevBtn] = useState<boolean>(false);

	const { getAccessToken, ready, authenticated, logout } = usePrivy();


    const { data: storyData, isFetching, isLoading, isError, refetch } = useQuery({
        queryKey: ['storyFromScratchFormData', storyId],
        queryFn: async () => {
            setLoading(true);
            
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/unauthenticated/${storyId}`;
        
            const response = await axios.get(url);
            if (response?.data?.story) {
                setStory(response?.data?.story);

                let chapter = response?.data?.story?.chapters.find((chapter: ChapterInterface) => chapter.index.toString() === chapterIndex) 
                
                if (chapter.readersHasAccess === true) {                    
                    setChapter(chapter)
                }
                // setAccessRecord(response?.data?.accessRecord)
                // seDepositAddress(response?.data?.depositAddress)
            }
            setLoading(false);
        
            return response?.data?.story;
        },
        enabled: !!storyId && !story,
    });

    useEffect(() => {
        if (chapter) {            
            const amountOfChapters = story?.chapters?.length ?? 0;
    
            if (chapter?.index >= amountOfChapters) {   
                setDisableNextBtn(true);
            }

            if (chapter?.index === 1) {   
                setDisablePrevBtn(true)
            }else{
                setDisablePrevBtn(false)
            }
        }
    }, [chapter])

    const moveToNextChapter = (chapter: ChapterInterface) => {
        console.log(chapter);
        let chapterIndex = chapter.index;
        let chapterId = chapter.id;

        let nextIndex = chapter.index + 1;
        const amountOfChapters = story?.chapters?.length ?? 0;

        
        if (chapterIndex >= amountOfChapters) {
            console.log(chapterIndex +" is the final chapter");    
            setDisableNextBtn(true);
            return;        
        }
        setDisableNextBtn(false);
        const nextChapter = story?.chapters?.find(parsedChapter => parsedChapter.index === nextIndex);


        if (amountOfChapters > chapterIndex) {
            console.log("Moving to chapter "+nextIndex);            
            console.log({nextChapter});  
            setChapter(nextChapter)          
        }
    }

    const moveToPrevChapter = (chapter: ChapterInterface) => {
        console.log(chapter);
        let chapterIndex = chapter.index;
        let prevIndex = chapter.index - 1;
        const amountOfChapters = story?.chapters?.length ?? 0;
        setDisableNextBtn(false);
        if (prevIndex === 1) {   
            setDisablePrevBtn(true)
        }

        const prevChapter = story?.chapters?.find(parsedChapter => parsedChapter.index === prevIndex);
        setChapter(prevChapter);    

    }

    return (
        <>
            <ReadersHeaderComponent returnTitle="Stories" returnUrl="/stories"/>
            <div className='overflow-y-auto'>
                <div className="sm:px-5 md:px-12 lg:px-20 xl:px-40">
                    { isLoading && 
                        <div>
                            <Skeleton className="w-full h-80 rounded-3xl mb-5" />

                            <Skeleton className="w-full h-15 rounded-3xl mb-5" />

                            <Skeleton className="w-full h-100 rounded-3xl mb-5" />

                        </div>
                    }
                    { !isLoading && <ReadStoryComponent 
                    setChapter={setChapter} 
                    activeChapter={chapter} 
                    story={story} 
                    moveToNextChapter={moveToNextChapter} 
                    moveToPrevChapter={moveToPrevChapter}
                    disableNextBtn={disableNextBtn}
                    disablePrevBtn={disablePrevBtn}
                    /> 
                    }
                    { !isLoading && <StoryCommentsComponent story={story}/>}
                </div>
            </div>
        </>
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