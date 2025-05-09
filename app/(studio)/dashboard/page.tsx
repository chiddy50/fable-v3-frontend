"use client"

import React, { useState } from 'react'
import Image from 'next/image';
import { ArrowDown, Eye, Plus } from 'lucide-react';
import GenrePillsComponent from '@/components/shared/GenrePillsComponent';
import Link from 'next/link';
import BookmarkComponent from '@/components/shared/BookmarkComponent';
import CommentBtnComponent from '@/components/shared/CommentBtnComponent';
import ShareBtnComponent from '@/components/shared/ShareBtnComponent';
import RatingBtnComponent from '@/components/shared/RatingBtnComponent';
import DashboardStatsComponent from '@/components/dashboard/DashboardStatsComponent';
import CreatorStoriesComponent from '@/components/story/original/CreatorStoriesComponent';

const DashboardPage = () => {

    const [tab, setTab] = useState<string>("original");

    return (
        <div className='px-5 grid grid-cols-12'>
            <div className="col-span-12">
                
                {/* STATISTICS */}
                <DashboardStatsComponent />

                {/* TABS */}
                <div className="bg-white p-3 rounded-lg mt-10">
                    <p className='mb-3 text-gray-600'>Categories</p>
                    <div className="bg-[#F9F9F9] rounded-lg p-2 flex items-center gap-3 text-xs tracking-wide">
                        <span onClick={() => setTab('original')} className={`rounded-lg p-2 cursor-pointer transition-all ${tab === 'original' ? 'bg-[#5D4076] text-white' : 'text-gray-600'}`}>Original</span>
                        <span onClick={() => setTab('with-ai')} className={`rounded-lg p-2 cursor-pointer transition-all ${tab === 'with-ai' ? 'bg-[#5D4076] text-white' : 'text-gray-600'}`}>With AI</span>
                        {/* <span onClick={() => setTab('characters')} className={`rounded-lg p-2 cursor-pointer transition-all ${tab === 'characters' ? 'bg-[#5D4076] text-white' : 'text-gray-600'}`}>Characters</span> */}
                        <span onClick={() => setTab('drafts')} className={`rounded-lg p-2 cursor-pointer transition-all ${tab === 'drafts' ? 'bg-[#5D4076] text-white' : 'text-gray-600'}`}>Drafts</span>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="mt-10">

                    { tab === "original" && <CreatorStoriesComponent title="Originals" type="original" editUrl="/dashboard/write-original-story" /> }
                    { tab === "with-ai" && <CreatorStoriesComponent title="With AI" type="ai" editUrl="/dashboard/write-ai-story" /> }
                    { tab === "drafts" && <CreatorStoriesComponent title="Drafts" type="draft" editUrl="/dashboard/write-original-story" /> }
                </div>

            </div>

            {/* <div className="col-span-2"></div> */}
        </div>
    )
}

export default DashboardPage
