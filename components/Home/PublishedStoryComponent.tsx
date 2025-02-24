"use client";

import React from 'react'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { formatDate, shareStory } from '@/lib/helper';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { combineName } from '@/lib/utils';
import AuthorAvatarComponent from '../Author/AuthorAvatarComponent';
import StarRatingComponent from '../Rating/StarRatingComponent';

const PublishedStoryComponent = ({
    publishedStories,
}) => {
    const { push } = useRouter();

    const moveToReadStory = async (storyId: string) => {
        push(`/read-story/${storyId}`);
    }

    const shareBlink = (story: StoryInterface) => {      
        // const url = `${process.env.NEXT_PUBLIC_URL}`;
        const url = `https://usefable.xyz/read-story/${story?.id}`;

        const blink = `https://dial.to/?action=solana-action:${url}/api/tip-me?storyId=${story?.id}`;
        
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(`${blink}`)}`;
        window.open(twitterUrl, '_blank');
    }


    return (
        <div>

            {
                publishedStories?.length > 0 &&
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                    {publishedStories?.filter(story => story?.publishedAt).map((story, index) => (

                        <div key={index} className="p-5 flex flex-col justify-between w-full bg-gray-800 text-gray-50 rounded-lg border">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-xs font-semibold">{story?.publishedAt ? formatDate(story?.publishedAt) : ""}</p>
                                <p className="font-bold text-[10px]">5 min read</p>
                            </div>
                            <h1 className="font-bold text-xl capitalize mb-3">{story?.projectTitle}</h1>
                            {/* <p className="font-light mt-2 text-xs capitalize">By {story?.user?.name}</p> */}

                            <AuthorAvatarComponent user={story?.user} />

                            <div className="font-semibold mt-2 mb-2 text-[10px]">
                                {story?.genres.length > 0 ? story?.genres?.map(genre => genre?.value ?? genre)?.join(" | ") : ""}
                            </div>

                            <StarRatingComponent rating={story?.averageRating} />
                            
                            <div className="mt-4">
                            {
                                !story?.introductionImage && <img src="/no-image.png" alt="walk" className="w-full h-[200px] rounded-xl object-cover" />
                            }
                            {
                                story?.introductionImage && <img src={story?.introductionImage} alt="walk" className="w-full h-[200px] rounded-xl object-cover" />
                            }
                            </div>
                            <p className="mt-5 text-xs text-gray-50">
                            { story?.overview?.slice(0, 200)}...
                            </p>

                            <div className="mt-4 flex justify-between items-center">
                                <Button onClick={() => moveToReadStory(story?.id)} size="sm" className="text-gray-700" variant="outline">
                                    Read for { story.isFree ? 'Free' : `$${story?.price}` }
                                    <BookOpen className="w-4 h-4 ml-2"/>
                                </Button>                            
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                                
                                {/* <Share2 className="w-4 h-4" /> */}
                                <div onClick={() => shareBlink(story)} className="flex gap-1 items-center cursor-pointer px-3 py-2 border border-gray-200 rounded-2xl">
                                    <span className="text-xs">Share Blink on</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="w-4 h-4"><path fill="#fff" d="M13.346 10.932 18.88 4.5h-1.311l-4.805 5.585L8.926 4.5H4.5l5.803 8.446L4.5 19.69h1.311l5.074-5.898 4.053 5.898h4.426zM11.55 13.02l-.588-.84-4.678-6.693h2.014l3.776 5.4.588.842 4.907 7.02h-2.014z"></path></svg>
                                </div>

                                <div onClick={() => shareStory(story)} className="flex gap-1 items-center cursor-pointer px-3 py-2 border border-gray-200 rounded-2xl">
                                    {/* <Share2 className="w-4 h-4" /> */}
                                    <span className="text-xs">Post on </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="w-4 h-4"><path fill="#fff" d="M13.346 10.932 18.88 4.5h-1.311l-4.805 5.585L8.926 4.5H4.5l5.803 8.446L4.5 19.69h1.311l5.074-5.898 4.053 5.898h4.426zM11.55 13.02l-.588-.84-4.678-6.693h2.014l3.776 5.4.588.842 4.907 7.02h-2.014z"></path></svg>

                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default PublishedStoryComponent
