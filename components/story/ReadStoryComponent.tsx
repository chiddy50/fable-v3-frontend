"use client"

import React, { useRef, useState } from 'react'
import PopularStoryComponent from '@/components/story/PopularStoryComponent';
import { ArrowLeft, ArrowRight, ChevronDown, Dot, Save } from 'lucide-react';
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
import { convertNumberToWords, formatDate, trimWords } from '@/lib/helper';
import { Inter } from "next/font/google";
import { cn } from '@/lib/utils';
import { usePrivy } from '@privy-io/react-auth';
import GradientButton from '../shared/GradientButton';

const inter = Inter({ subsets: ['latin'] });


interface Props {
    setChapter: React.Dispatch<React.SetStateAction<ChapterInterface | null>>;
    activeChapter: ChapterInterface | null;
    story: StoryInterface | null;
    moveToNextChapter: (chapter: ChapterInterface) => void;
    moveToPrevChapter: (chapter: ChapterInterface) => void;
    disableNextBtn: boolean;
    disablePrevBtn: boolean;
}

const ReadStoryComponent: React.FC<Props> = ({
    story,
    activeChapter,
    setChapter,
    moveToNextChapter,
    moveToPrevChapter,
    disableNextBtn,
    disablePrevBtn,
}) => {
    const [isChapterListOpen, setIsChapterListOpen] = useState<boolean>(false);
    const chapterListRef = useRef<HTMLDivElement>(null);

	const { authenticated } = usePrivy();


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
                    <div className="relative flex items-center justify-center h-96 rounded-2xl"
                        style={{
                            backgroundImage: `url('${activeChapter?.image ?? story?.bannerImageUrl ?? "/img/placeholder6.jpg"}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >


                        <div className='flex flex-col items-center gap-2 text-white'>

                            <div className="flex flex-col gap-1 items-center">
                                {/* <UserAvatarComponent
                                    width={40}
                                    height={40}
                                    borderRadius='rounded-lg'
                                    imageUrl={story?.user?.imageUrl ?? "/avatar/default-avatar.png"}
                                /> */}
                                <img
                                    src={story?.user?.imageUrl ?? "/avatar/default-avatar.png"} 
                                    alt="User avatar"                            
                                    className={`w-[50px] h-[50px] object-cover rounded-lg`}
                                />
                                <p className="text-sm text-center text-shadow-dark font-semibold">@{story?.user?.name}</p>
                            </div>
                            <p className="font-light text-shadow-dark text-xs">{formatDate(story?.publishedAt)}</p>
                            <h1 className="text-4xl font-bold text-white text-center text-shadow-dark capitalize">{story?.projectTitle}</h1>

                            <GenrePillsComponent genres={story?.genres} />

                        </div>

                    </div>

                    <div className="flex items-center mx-5 lg:mx-0 xl:mx-0 justify-between relative my-10 p-4 bg-white rounded-xl">

                        {/* CHAPTER LIST */}
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={toggleChapterList}
                        >
                            <h1 className="text-md font-bold capitalize text-gray-600">Chapter {convertNumberToWords(Number(activeChapter?.index))}</h1>
                            <ChevronDown className={`ml-2 h-5 w-5 text-gray-600 transition-transform ${isChapterListOpen ? 'transform rotate-180' : ''}`} />
                        </div>

                        {/* Chapter List Dropdown */}
                        {isChapterListOpen && (
                            <div
                                ref={chapterListRef}
                                className="absolute left-0 top-10 bg-white shadow-lg rounded-lg z-50 overflow-hidden"
                            >
                                <div className="p-2">
                                    {story?.chapters?.sort((a, b) => a.index - b.index)?.map(chapter => (
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
                                                    <span className="text-xs font-bold">{chapter?.price ?? 0}</span>
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


                    <div className="relative my-7 p-6 bg-white rounded-xl">
                        <h1 className='font-bold text-4xl sm:text-5xl capitalize'>{story?.projectTitle}</h1>
                        
                        <div className="my-7 text-sm leading-6 text-[#626262]">

                            {/* Authenticated & Free  */}
                            {
                                authenticated && activeChapter?.isFree === true &&
                                <div className="relative h-[500px] overflow-y-auto">
                                    <p className={cn(`text-lg first-letter:text-4xl whitespace-pre-wrap mb-7`, inter.className)}>{activeChapter?.content}</p>
                                </div>
                            }

                            {/* Authenticated & Not Free  */}
                            {
                                authenticated && activeChapter?.isFree === false &&
                                <div className="relative h-[500px] overflow-y-hidden rounded-lg">

                                    <div className="absolute inset-0 bg-black/10 rounded-lg backdrop-blur-xs flex z-20 items-center justify-center">
                                        <div className="flex flex-col gap-2 items-center">

                                            <span className="text-xs font-bold">Pay</span>
                                            <GradientButton handleClick={() => console.log()}>
                                                {/* <Save size={15} /> */}
                                                <Image src="/icon/coins-white.svg" alt="coins icon" className=" " width={19} height={19} />                                                                        
                                                <span className="text-xs font-bold">{activeChapter?.price ? (Number(activeChapter?.price) * 100) : 0 }</span>
                                            </GradientButton>
                                            <span className="text-xs font-bold">To unlock chapter</span>

                                        </div>
                                    </div>
                                    
                                    <p className={cn(`text-lg first-letter:text-4xl whitespace-pre-wrap 
                                        mb-7 bg-clip-text text-transparent bg-gradient-to-b from-black to-transparent
                                        `, inter.className)}>
                                        {activeChapter?.content ? trimWords(activeChapter?.content, 140) : ""}
                                    </p>
                                </div>
                            }

                            {/* Unauthenticated & Not Free  */}
                            {
                                !authenticated && activeChapter?.isFree === false && 
                                <div className="relative h-[500px] overflow-y-hidden rounded-lg">

                                    <div className="absolute inset-0 bg-black/10 rounded-lg backdrop-blur-xs flex z-20 items-center justify-center">
                                        <div className="flex flex-col gap-2 items-center">

                                            <span className="text-xs font-bold">Pay</span>
                                            <GradientButton handleClick={() => console.log()}>
                                                <Image src="/icon/coins-white.svg" alt="coins icon" className=" " width={19} height={19} />                                                                        
                                                <span className="text-xs font-bold">{activeChapter?.price ? (Number(activeChapter?.price) * 100) : 0 }</span>
                                            </GradientButton>
                                            <span className="text-xs font-bold">To unlock chapter</span>

                                        </div>
                                    </div>
                                    
                                    <p className={cn(`text-lg first-letter:text-4xl whitespace-pre-wrap 
                                        mb-7 bg-clip-text text-transparent bg-gradient-to-b from-black to-transparent
                                        `, inter.className)}>
                                        {activeChapter?.content ? trimWords(activeChapter?.content, 140) : ""}
                                    </p>
                                </div>
                            }

                            {/* Unauthenticated & Free  */}
                            {
                                !authenticated && activeChapter?.isFree === true &&
                                <div className="relative h-[500px] overflow-y-auto">
                                    <p className={cn(`text-lg first-letter:text-4xl whitespace-pre-wrap mb-7`, inter.className)}>{activeChapter?.content}</p>
                                </div>
                            }
                            

                            {/* <textarea name="" id="" value={activeChapter?.content} disabled 
                            // className='w-full resize-none outline-none text-gray-700 placeholder:italic placeholder-gray-400 min-h-[500px]' 
                            className={cn("text-xl first-letter:text-4xl resize-none outline-none text-gray-700 placeholder:italic placeholder-gray-400 min-h-[500px]", inter.className)}
                            /> */}
                        </div>


                        <div className="flex flex-col md:flex-col lg:flex-row xl:flex-row items-center justify-between gap-4 mt-7">

                            {/* <div className="flex items-center gap-2 ">
                                {
                                    story?.genres.map(genre => (
                                        <span  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-[10px]">{genre}</span>
                                    ))
                                }
                            </div> */}
                            <GenrePillsComponent genres={story?.genres} />

                            <div className="flex items-center gap-2">
                                {
                                    story?.storyAudiences?.map((item, index) => (
                                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-[10px]">{item?.targetAudience?.name}</span>
                                    ))
                                }
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
                                <button disabled={disablePrevBtn} onClick={() => moveToPrevChapter(activeChapter)} className={`w-10 h-10 flex rounded-xl bg-gray-100 cursor-pointer border border-gray-300 justify-center items-center ${disablePrevBtn ? "opacity-40" : "opacity-100"}`}>
                                    <ArrowLeft className='text-gray-400' size={15} />
                                </button>
                               
                                <button disabled={disableNextBtn} onClick={() => moveToNextChapter(activeChapter)} className={`w-10 h-10 flex rounded-xl bg-gray-100 cursor-pointer border border-gray-300 justify-center items-center ${disableNextBtn ? "opacity-40" : "opacity-100"}`}>
                                    <ArrowRight className='text-gray-400' size={15} />
                                </button>
                               
                            </div>
                        </div>

                    </div>

                </div>
            }
        </>
    )
}

export default ReadStoryComponent
