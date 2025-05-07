"use client"

import React, { useState } from 'react'
import Image from 'next/image';
import AuthorComponent from './AuthorComponent';
import GenrePillsComponent from '../shared/GenrePillsComponent';
import BookmarkComponent from '../shared/BookmarkComponent';
import CommentBtnComponent from '../shared/CommentBtnComponent';
import ShareBtnComponent from '../shared/ShareBtnComponent';
import RatingBtnComponent from '../shared/RatingBtnComponent';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/helper';
import ReadStoryPreviewComponent from './read/ReadStoryPreviewComponent';

const StoryGridViewComponent = ({ image, story }: { image: string, story: any }) => {

    const [showPreview, setShowPreview] = useState<boolean>(false);
    return (
        <div className="w-full mb-5 p-3 rounded-2xl  bg-gradient-to-b from-[#e1e1e1] to-[#fff]">

            <div className="relative w-full h-[230px] mb-3 rounded-2xl overflow-hidden"
                style={{
                    backgroundImage: `url(${image ?? `/logo/fable_black.png`})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                    // backgroundPosition: 'center top'
                }}
            >        
                {/* <Image 
                src={image ?? `/img/placeholder2.png`} 
                alt="The deathly hallows of North Seria"
                fill
                className="object-cover w-full"
                /> */}
                {/* <img
                    src={image ?? `/img/placeholder2.png`} 
                    alt="story cover image"
                    className="object-cover rounded-xl w-full"
                /> */}

                <p className="absolute top-2 left-2 px-3 py-1 text-gray-50 bg-gray-800 rounded-full text-[10px]">
                     {story?.publishedAt ? formatDate(story?.publishedAt) : ""}
                </p>
                <div className='absolute bottom-3 right-3 left-3'>
                    <GenrePillsComponent genres={story?.genres}/>
                </div>

            </div>

            <AuthorComponent 
                count={1} 
                name={story?.user?.name} 
                user={story?.user} 
                borderRadius="rounded-xl" 
            />

            <h1 className='mt-3 font-bold text-lg capitalize'>
                {story?.projectTitle}            
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-3">                    
                    <BookmarkComponent />
                    {/* <CommentBtnComponent /> */}
                    <ShareBtnComponent />
                    {/* <RatingBtnComponent /> */}
                </div>

                <div>
                    <button onClick={() => setShowPreview(true)} className='text-white cursor-pointer flex items-center justify-center py-2 px-4 rounded-lg m-2 bg-gradient-to-r hover:from-[#AA4A41] hover:to-[#33164C] to-[#AA4A41] from-[#33164C] transition-all'>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>




            <ReadStoryPreviewComponent 
                showPreview={showPreview} 
                setShowPreview={setShowPreview} 
                story={story} 
            />

        </div>
    )
}

export default StoryGridViewComponent
