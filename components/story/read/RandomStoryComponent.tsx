"use client"

import GenrePillsComponent from '@/components/shared/GenrePillsComponent'
import ShareBtnComponent from '@/components/shared/ShareBtnComponent'
import { UserAvatarComponent } from '@/components/shared/UserAvatarComponent'
import { StoryInterface } from '@/interfaces/StoryInterface'
import { formatDate } from '@/lib/helper'
import React, { useEffect, useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import CommentBtnComponent from '@/components/shared/CommentBtnComponent'
import BookmarkComponent from '@/components/shared/BookmarkComponent'

const RandomStoryComponent = ({ randomStory, loading }: { randomStory: StoryInterface, loading: boolean }) => {
    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {
        setLoaded(true);
        
        // Prevent body scrolling when modal is open
        if (randomStory) {
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            // Re-enable body scrolling when component unmounts
            document.body.style.overflow = 'auto';
        };
    }, [randomStory]);
    
    if (loading) {
        return (
            <div className="mb-7 px-10">
                <Skeleton className="w-full h-80 rounded-2xl " />

                <div className="mt-7 flex gap-3 items-center">
                    <Skeleton className="w-12 h-12  rounded-full" />
                    <Skeleton className="w-[40%] h-12  rounded-xl" />
                </div>

                <Skeleton className="w-full h-30 rounded-2xl mt-10" />

            </div>
        )   
    }

    if(!loading){
        return (
            <div className='mb-7'>
                <div className="relative h-80">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url('${randomStory?.bannerImageUrl ?? randomStory?.coverImageUrl ?? "/img/placeholder6.jpg"}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {/* cover-image */}
                        <div className="mr-4 flex-shrink-0 absolute -bottom-7 z-10 left-5">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-md">
                                <img
                                    src={`${randomStory?.coverImageUrl ?? randomStory?.bannerImageUrl ?? "/img/placeholder5.jpg"}`}
                                    alt="Story cover image"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h1 className=" font-bold capitalize text-gray-800 mt-3 text-4xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-5xl">{randomStory?.projectTitle}</h1>
    
                        </div>
                    </div>
    
                    {/* White Fade Overlay - Bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-white to-transparent" />
    
                    {/* White Fade Overlay - Left & Right */}
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent opacity-40" />
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent opacity-40" />
                </div>
    
    
                <div className="px-5">
                    {/* Author Info */}
                    <div className="flex items-center justify-between mt-16 ">
                        <div className="flex items-center">
                            <div className="overflow-hidden mr-2">             
                                {/* <UserAvatarComponent
                                    width={40}
                                    height={40}
                                    borderRadius='rounded-lg'
                                    imageUrl={randomStory?.user?.imageUrl ?? "/avatar/default-avatar.png"}
                                    border="border border-white"
                                /> */}
                                <img
                                    src={`${randomStory?.user?.imageUrl ?? "/avatar/default-avatar.png"}`}
                                    alt="Story cover image"
                                    className="w-[40px] h-[40px] rounded-lg border border-white object-cover"
                                />
                            </div>
                            <span className="text-gray-600 text-sm font-medium mr-5">@{randomStory?.user?.name ?? "Anonymous"}</span>
                            {randomStory?.publishedAt && 
                            <div className="flex items-center text-gray-400">
                                <span className="mx-2 text-xs">{randomStory?.publishedAt ? formatDate(randomStory?.publishedAt) : ""}</span>
                            </div>
                            }
                        </div>
        
                        {!randomStory?.publishedAt && 
                        <span className="inline-block bg-[#3A3A3A] capitalize text-gray-50 font-medium text-xs px-4 py-2 rounded-lg">
                            {randomStory?.status}
                        </span>}
                    </div>
        
                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between mt-3">                    
                        <GenrePillsComponent genres={randomStory.genres} />                        
                    </div>
        
        
                    {randomStory?.projectDescription && 
                        <div className="mt-6 opacity-0 animate-fadeIn" style={{
                                animation: loaded ? 'fadeIn 0.5s ease-in-out forwards 0.3s' : 'none'
                            }}>
                                {/* Overview */}
                                <div className="text-sm text-gray-600">
                                    <h2 className="text-lg font-bold">Overview</h2>
                                    <p className="py-2 text-xs font-light xs:w-full sm:w-full md:w-full lg:w-4/5 xl:w-3/5 capitalize">{randomStory?.projectDescription}</p>
                                </div>
                        </div>
                    }

                    <div className="flex items-center gap-3 mt-3">
                        <ShareBtnComponent />
                        <BookmarkComponent />
                        <CommentBtnComponent />
                    </div>
        
                </div>
            </div>
        )
    }
}

export default RandomStoryComponent
