"use client";  

import React, { useContext, useEffect, useState, use } from 'react'
import Link from 'next/link';
import Image from "next/image";
import StoryCardComponent from '@/components/story/StoryCardComponent';
import RatingBtnComponent from '@/components/shared/RatingBtnComponent';
import { UserAvatarComponent } from '@/components/shared/UserAvatarComponent';
import AuthorComponent from '@/components/story/AuthorComponent';
import { AppContext } from '@/context/MainContext';
import ProfileHeaderComponent from '@/components/user/ProfileHeaderComponent';
import { UserInterface } from '@/interfaces/UserInterface';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import CreatorStoriesComponent from '@/components/user/CreatorStoriesComponent';



interface Props {
    params: Promise<{ id: string }>
}


const CreatorPage = ({ params }: Props) => {
    const { id } = use(params);
    const decodedId = decodeURIComponent(id);

    const [loading, setLoading] = useState(true);
    const [author, setAuthor] = useState<UserInterface|null>(null);
    const [socialMedia, setSocialMedia] = useState(null);
    const [tab, setTab] = useState<string>("stories");

    const [activeControl, setActiveControl] = useState<'list' | 'grid'>('list');
    const [activeTab, setActiveTab] = useState<'stories' | 'articles' | 'featured'>('stories');
    
    // const { isLoggedIn, setIsLoggedIn, user, setUser } = useContext(AppContext)
    
    useEffect(() => {
        getAuthor();
    }, []);

    const getAuthor = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${decodedId}`)
            console.log(response);
            setAuthor(response?.data?.user)
            setSocialMedia(response?.data?.user?.socialMedia)
        } catch (error) {
            console.error(error);            
        }finally{
            setLoading(false);
        }
    }

    if (loading) {
        return <LoaderComponent />
    }

    if (!loading) {
        return (
            <div className='overflow-y-auto bg-[#FBFBFB]'>
    
                <ProfileHeaderComponent user={author} />
    
                <div className=" px-7 ">
                    <div className="bg-white rounded-xl p-4 mt-10">
                        {/* TABS */}
                        <div className="bg-[#F9F9F9] rounded-lg p-2 flex items-center gap-3 text-xs tracking-wide">
                            <span onClick={() => setTab('stories')} className={`rounded-lg p-2 cursor-pointer transition-all ${tab === 'stories' ? 'bg-[#5D4076] text-white' : 'text-gray-600'}`}>Stories</span>
                            {/* <span onClick={() => setTab('articles')} className={`rounded-lg p-2 cursor-pointer transition-all ${tab === 'articles' ? 'bg-[#5D4076] text-white' : 'text-gray-600'}`}>Articles</span> */}
                            {/* <span onClick={() => setTab('featured')} className={`rounded-lg p-2 cursor-pointer transition-all ${tab === 'featured' ? 'bg-[#5D4076] text-white' : 'text-gray-600'}`}>Featured</span> */}
                        </div>

                        {/* CONTENT */}
                        <div className="mt-10">
                            <h1 className="font-bold my-4">Stories</h1>

                            

                            { tab === "stories" && <CreatorStoriesComponent userId={decodedId} /> }
                            {/* { tab === "with-ai" && <CreatorStoriesComponent title="With AI" type="ai" editUrl="/dashboard/write-ai-story" /> } */}
                            {/* { tab === "featured" && <CreatorStoriesComponent title="Drafts" type="draft" editUrl="/dashboard/write-original-story" /> } */}
                        </div>
                    </div>

                </div>

    
            </div>
        )        
    }

}

export default CreatorPage


const LoaderComponent = () => {
    return (
        <div>
            <Skeleton className="w-full h-[200px] rounded-b-3x" />


            <div className="flex flex-col items-center px-4 pb-6 -mt-16">
                {/* Avatar */}
                <div className="relative w-24 h-24 mb-2">
                    <div className="absolute inset-0 bg-white rounded-full p-1"></div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 mt-3">
                <Skeleton className="w-30 h-[20px] rounded-xl" />
                <Skeleton className="w-30 h-[20px] rounded-xl" />
                <Skeleton className="w-50 h-[20px] rounded-xl" />
            </div>

            <div className="grid px-7 mt-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <Skeleton className="col-span-1 h-[390px] rounded-2xl" />
                <Skeleton className="col-span-1 h-[390px] rounded-2xl" />
                <Skeleton className="col-span-1 h-[390px] rounded-2xl" />
                <Skeleton className="col-span-1 h-[390px] rounded-2xl" />

            </div>

        </div>
    )
}
