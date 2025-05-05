"use client"

import React, { useRef, useState } from 'react'
import PopularStoryComponent from '@/components/story/PopularStoryComponent';
import { ArrowLeft, ArrowRight, ChevronDown, Dot } from 'lucide-react';
import { Heart, MessageCircle, Share2, BookmarkPlus } from 'lucide-react';
import Link from 'next/link';
import BookmarkComponent from '@/components/shared/BookmarkComponent';
import CommentBtnComponent from '@/components/shared/CommentBtnComponent';
import ShareBtnComponent from '@/components/shared/ShareBtnComponent';
import RatingBtnComponent from '@/components/shared/RatingBtnComponent';
import GenrePillsComponent from '@/components/shared/GenrePillsComponent';
import Image from "next/image";
import { UserAvatarComponent } from '../shared/UserAvatarComponent';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { ChapterInterface } from '@/interfaces/ChapterInterface';



interface Props {
    setChapter: React.Dispatch<React.SetStateAction<ChapterInterface | null>>;
    activeChapter: ChapterInterface | null;
    story: StoryInterface | null;
}

const ReadStoryComponent: React.FC<Props> = ({
    story,
    activeChapter,
    setChapter
}) => {
    const [isChapterListOpen, setIsChapterListOpen] = useState<boolean>(false);
    const chapterListRef = useRef<HTMLDivElement>(null);

    const toggleChapterList = () => {
        setIsChapterListOpen(!isChapterListOpen);
    };


    const selectChapter = async (chapter: ChapterInterface) => {

        // await updateCurrentChapter(id);
        // setActiveChapter(id);
        setIsChapterListOpen(false);
        setChapter(chapter)

    };

    return (
        <>
            {
                story &&   
                <div className=" mb-10">
                    <div className="relative flex items-center justify-center h-80 rounded-3xl"
                        style={{
                            backgroundImage: `url('${activeChapter?.image ?? story?.bannerImageUrl ?? "/img/placeholder5.jpg"}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >


                        <div className='flex flex-col items-center gap-2 text-white'>

                            <div className="flex flex-col gap-1 items-center">
                                <UserAvatarComponent
                                    width={40}
                                    height={40}
                                    borderRadius='rounded-lg'
                                    imageUrl={story?.user?.imageUrl ?? "/avatar/male_avatar1.svg"}
                                // border="border border-white"
                                />
                                <p className="text-sm text-center font-semibold">@{story?.user?.name}</p>
                            </div>
                            <p className="font-light text-xs">20min ago</p>
                            <h1 className="text-4xl font-bold capitalize">{story?.projectTitle}</h1>

                            <GenrePillsComponent genres={story?.genres} />

                        </div>

                    </div>

                    <div className="flex items-center justify-between relative my-10 p-4 bg-white rounded-xl">

                        {/* CHAPTER LIST */}
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={toggleChapterList}
                        >
                            <h1 className="text-md font-bold text-gray-600">Chapter {activeChapter?.index}</h1>
                            <ChevronDown className={`ml-2 h-5 w-5 text-gray-600 transition-transform ${isChapterListOpen ? 'transform rotate-180' : ''}`} />
                        </div>

                        {/* Chapter List Dropdown */}
                        {isChapterListOpen && (
                            <div
                                ref={chapterListRef}
                                className="absolute left-0 top-10 bg-white shadow-lg rounded-lg z-10 overflow-hidden"
                            >
                                <div className="p-2">
                                    {story?.chapters?.map(chapter => (
                                        <div
                                            key={chapter.id}
                                            className={`flex items-center p-3 rounded-md cursor-pointer ${chapter?.id === activeChapter?.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                            onClick={() => selectChapter(chapter)}
                                        >
                                            <div className={`w-4 h-4 rounded-full border ${chapter?.id === activeChapter?.id ? 'border-[#D45C51] bg-[#D45C51]' : 'border-gray-300'} mr-3 flex items-center justify-center`}>
                                                {chapter?.id === activeChapter?.id && (
                                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                                )}
                                            </div>
                                            <span className="text-gray-800 text-xs block mr-10">Chapter {chapter?.index}</span>

                                            {
                                                chapter?.isFree === true &&
                                                <div className='px-2 py-1 rounded-md bg-[#D7F7CC] text-[#249000] text-xs flex items-center gap-2'>
                                                    <Image src="/icon/coins-green.svg" alt="coins icon" width={13} height={13} />
                                                    <span className="text-xs font-bold">Free</span>
                                                </div>
                                            }
                                            {
                                                chapter?.isFree === false &&
                                                <div className='flex items-center cursor-pointer gap-2 py-1 px-2 text-white rounded-md bg-gradient-to-r from-[#AA4A41] to-[#33164C] hover:bg-gradient-to-l transition-all'>
                                                    <Image src="/icon/coins-white.svg" alt="coins icon" width={15} height={15} />
                                                    <span className="text-xs font-bold">{chapter?.price}</span>
                                                </div>
                                            }


                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* CHAPTER LIST END */}
                        <h1 className="text-sm font-semibold text-gray-600">{activeChapter?.index}/{story?.chapters?.length}</h1>


                    </div>


                    <div className="relative my-7 p-4 bg-white rounded-xl">
                        <h1 className='font-bold text-3xl capitalize'>{story?.projectTitle}</h1>
                        <div className="my-3 text-sm leading-6 text-[#626262]">

                            <textarea name="" id="" value={activeChapter?.content} disabled className='w-full resize-none outline-none text-gray-700 placeholder:italic placeholder-gray-400 min-h-[500px]' />
                        </div>


                        <div className="flex items-center justify-between mt-7">
                            <div className="flex items-center gap-4">

                                <div className="flex items-center gap-2 mt-4">
                                    {
                                        story?.genres.map(genre => (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-[10px]">{genre}</span>
                                        ))
                                    }
                                </div>

                                <div className="flex items-center gap-2 mt-4">
                                    {
                                        story?.storyAudiences?.map(item => (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-[10px]">{item?.targetAudience?.name}</span>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className="flex items-center flex-wrap gap-3">
                                <BookmarkComponent />
                                <CommentBtnComponent />
                                <ShareBtnComponent />
                                {/* <RatingBtnComponent /> */}
                            </div>
                        </div>





                        <div className="flex items-center justify-center mt-7">
                            

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 flex rounded-xl bg-gray-100 cursor-pointer border border-gray-300 justify-center items-center">
                                    <ArrowLeft className='text-gray-400' size={15} />
                                </div>
                                <div className="w-10 h-10 flex rounded-xl bg-gray-100 cursor-pointer border border-gray-300 justify-center items-center">
                                    <ArrowRight className='text-gray-400' size={15} />
                                </div>
                            </div>


                        </div>
                    </div>

                </div>
            }
        </>
    )
}

export default ReadStoryComponent

{/* <div className="flex items-center justify-between">
    <h2 className='text-gray-400 text-sm font-semibold italic'>Reading...</h2>

    <div className='bg-[#F5F5F5] text-xs flex items-center justify-center rounded-full h-11 w-11 p-2 cursor-pointer'>
        10%
    </div>
</div>

<div className='mt-6 flex items-center justify-between'>
    <div className="flex items-center">         
        <UserAvatarComponent
            width={36} 
            height={36} 
            borderRadius='rounded-full' 
            isDouble={false} 
            imageMargin='mr-3' 
            imageUrl="/avatar/male_avatar2.svg"
        /> 
        <div className='text-[10px]'>
            <span className="text-gray-600">By </span>
            <span className="font-semibold">Cole Palmer </span>
        </div>
    </div>
    <div className="flex items-center text-gray-500 text-[10px]">
        <span className="font-bold">5min read</span>
        <Dot />
        <span className="font-light">20m ago</span>
    </div>
</div>

<div className="relative w-full h-[400px] mt-5 rounded-2xl overflow-hidden">
    <Image
        src={`/img/placeholder.png`}
        alt="The deathly hallows of North Seria"
        fill
        className="object-cover w-full"
    />
</div>

<div className="flex items-center justify-between mt-5">
    <div className="flex items-center flex-wrap gap-3">
        <BookmarkComponent />

        <CommentBtnComponent />

        <ShareBtnComponent />

        <RatingBtnComponent />
    </div>

    <>
        <GenrePillsComponent />
    </>
</div>

<div className='mt-7'>
    <h1 className="font-bold text-3xl mb-1">Vol 1</h1>
    <h4 className='font-light text-xs text-gray-600 mb-5'>Four Chapters</h4>

    <div>
        <p className="text-gray-600 leading-7">

        </p>
    </div>

    <div className="flex items-center justify-between mt-7">
        <div className="flex items-center flex-wrap gap-3">                                                            
            <BookmarkComponent />

            <CommentBtnComponent />

            <ShareBtnComponent />

            <RatingBtnComponent />
        </div>

        <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex rounded-xl bg-gray-100 cursor-pointer border border-gray-300 justify-center items-center">
                <ArrowLeft className='text-gray-400' size={15}  />
            </div>
            <div className="w-10 h-10 flex rounded-xl bg-gray-100 cursor-pointer border border-gray-300 justify-center items-center">
                <ArrowRight className='text-gray-400' size={15}  />
            </div>
        </div>

        <GenrePillsComponent />                            

    </div> 
</div> 
*/}