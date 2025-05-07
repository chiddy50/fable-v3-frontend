'use client'; 

import React, { useEffect, useState } from 'react'
import Image from "next/image";
import StoryCardComponent from '@/components/story/StoryCardComponent';
import TopRankingStoryComponent from '@/components/story/TopRankingStoryComponent';
import PopularStoryComponent from '@/components/story/PopularStoryComponent';
import StoryListViewComponent from '@/components/story/StoryListViewComponent';
import StoryGridViewComponent from '@/components/story/StoryGridViewComponent';
import Link from 'next/link';
import LayoutOneNavComponent from '@/components/navigation/LayoutOneNavComponent';
import { StoryInterface } from '@/interfaces/StoryInterface';
import SearchBoxComponent from '@/components/navigation/SearchBoxComponent';
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { ReadersHeaderComponent } from '@/components/shared/ReadersHeaderComponent';
import { generateRandomNumber } from '@/lib/helper';
import RandomStoryComponent from '@/components/story/read/RandomStoryComponent';

const StoriesPage = () => {
    const [showGridIcon, setShowGridIcon] = useState<boolean>(false)
    const [currentView, setCurrentView] = useState<string>("list")

    const [activeControl, setActiveControl] = useState<'list' | 'grid'>('grid');
    const [loading, setLoading] = useState<boolean>(true);
    const [publishedStories, setPublishedStories] = useState<StoryInterface[]>([]);
    const [genreList, setGenreList] = useState<[]>([]);
    const [randomStory, setRandomStory] = useState<StoryInterface|null>(null);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async (genre = "") => {
        try {
            let url = genre === "" ? `${process.env.NEXT_PUBLIC_BASE_URL}/stories/all` : `${process.env.NEXT_PUBLIC_BASE_URL}/stories/all?genre=${genre}`;
            setLoading(true)
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const json = await res.json();
            console.log(json);
            let data = json?.stories;
            if (data) {
                setPublishedStories(data);
            }

            const max = data.length - 1;
            let randomNumber = generateRandomNumber(max);
            const random_story = data[randomNumber]
            setRandomStory(random_story);
            console.log({randomNumber, random_story});

            const genres = json?.genres.map((genre: { id: number, name: string }) => {
                return {
                    id: genre.id,
                    label: genre.name,
                    value: genre.name,
                }
            })
            setGenreList(genres ?? []);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <ReadersHeaderComponent returnTitle="Home" returnUrl="/"/>
            
            <div className='overflow-y-auto'>

                { randomStory && <RandomStoryComponent loading={loading} randomStory={randomStory} />}





                <div className='mt-10 bg-[#FBFBFB]'>
                    {/* <div className="mt-[260px] px-20 grid p-5 grid-cols-6 gap-12"> */}
                    <div className=" grid p-5 grid-cols-6 gap-12">
                        <div className="left-container bg-white rounded-2xl p-5 col-span-6 mb-10">
                            <div className="flex gap-9 items-center mb-3">                
                                <div className='bg-[#F5F5F5] rounded-xl p-2 cursor-pointer'>
                                    <Image src="/icon/add-circle-half-dot.svg" alt="add-circle-half-dot icon" className=" " width={16} height={16} />
                                </div>
                                
                                <div className="flex items-center gap-4">                
                                    <div className='flex items-center gap-1 bg-[#D8D1DE3D] rounded-xl p-2 cursor-pointer'>
                                        <span className='text-[#5D4076 text-[0.7rem]'>For You</span>
                                        <i className='bx bx-check-circle text-[#5D4076]'></i>
                                    </div>
                                    <div className='flex items-center rounded-xl bg-[#F5F5F5] p-2 cursor-pointer'>
                                        <span className='text-[#5D4076 text-[0.7rem]'>Favorites</span>
                                    </div>
                                </div>
                            </div>
                                
                            <div className="flex items-center justify-between">

                                <h2 className='text-gray-500 text-2xl font-bold'>For You</h2>
                                
                                {/* <div className='flex items-center gap-2'>
                                    
                                    <div onClick={() => setActiveControl('list')} className={` rounded-2xl h-9 w-9 flex items-center justify-center cursor-pointer list-control ${activeControl === "list" ? 'bg-[#F5F5F5]' : ''}`}>
                                        <Image src="/icon/filter.svg" alt="add-circle-half-dot icon" className=" " width={16} height={16} />
                                    </div>
                                    <div onClick={() => setActiveControl('grid')} className={` rounded-2xl h-9 w-9 flex items-center justify-center cursor-pointer list-control ${activeControl === "grid" ? 'bg-[#F5F5F5]' : ''}`}>
                                        <Image src="/icon/grid.svg" alt="add-circle-half-dot icon" className=" " width={16} height={16} />
                                    </div>
                                </div> */}

                                <div>
                                    <div className="flex items-center gap-7">
                                        
                                        <SearchBoxComponent />
                                    </div>

                                    
                                </div>

                            </div>

                            <div className="mt-10 mb-10 min-h-[800px]">
                                {loading && 
                                <div className="grid grid-cols-4 gap-5">
                                    <Skeleton className="col-span-1 h-[390px] rounded-2xl" />
                                    <Skeleton className="col-span-1 h-[390px] rounded-2xl" />
                                    <Skeleton className="col-span-1 h-[390px] rounded-2xl" />
                                    <Skeleton className="col-span-1 h-[390px] rounded-2xl" />

                                </div>
                                }

                                {
                                    !loading && 
                                    <>
                                        
                                        <StoryCardComponent stories={publishedStories ?? []} activeControl={activeControl} />                        
                                    </>
                                }
                            </div>
                        </div>

                        {/* <div className="right-container p-5 col-span-2">

                            <div>
                                <div className="flex items-center justify-between">
                                    <h2 className='text-gray-900 text-2xl font-bold'>Top Ranking</h2>
                                    
                                    <div className='bg-[#F5F5F5] rounded-xl p-2 cursor-pointer'>
                                        <Image src="/icon/bell.svg" alt="add-circle-half-dot icon" className=" " width={16} height={16} />
                                    </div>

                                </div>
                                <p className="mt-3 text-xs text-gray-600 font-light">
                                Get caught up with Fable’s top most publications.
                                </p>

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
                                Get caught up with Fable’s top most publications.
                                </p>

                                <div className="mt-6 max-h-[500px] overflow-y-auto">
                                    <PopularStoryComponent image="/img/placeholder.png" />
                                    <PopularStoryComponent image="/img/placeholder2.png" />
                                    <PopularStoryComponent image="/img/placeholder3.png" />
                                </div>
                            </div>
                        </div> */}

                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default StoriesPage
