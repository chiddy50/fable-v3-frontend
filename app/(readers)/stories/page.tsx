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
import PaginationComponent from '@/components/shared/PaginationComponent';
import axios from 'axios';
import Pagination from '@/components/shared/Pagination';

const StoriesPage = () => {
    const [showGridIcon, setShowGridIcon] = useState<boolean>(false)
    const [currentView, setCurrentView] = useState<string>("list")

    const [activeControl, setActiveControl] = useState<'list' | 'grid'>('grid');
    const [loading, setLoading] = useState<boolean>(true);
    const [publishedStories, setPublishedStories] = useState<StoryInterface[]>([]);
    const [genreList, setGenreList] = useState<[]>([]);
    const [randomStory, setRandomStory] = useState<StoryInterface | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(15);
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState(0);
    const [distinctGenres, setDistinctGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState<(string | number)[]>([]);

    useEffect(() => {
        fetchStories();
        getDistinctGenres();

    }, []);

    const paginateStories = (page: number) => {
        let set_next_page = currentPage + page
        setCurrentPage(set_next_page)

        fetchStories(set_next_page, selectedGenre)
    }

    const fetchStories = async (page = 1, genreIds = []) => {
        try {
            let params = {
                page: page,
                limit: limit,
            }

            // Add genres to params if there are any selected
            if (genreIds && genreIds.length > 0) {
                params.genres = genreIds;
            }

            setLoading(true)

            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/all`

            const res = await axios.get(url, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            console.log(res);

            let data = res.data.stories
            if (data) {
                setPublishedStories(data);
            }

            setHasNextPage(res?.data?.pagination?.hasNextPage)
            setHasPrevPage(res?.data?.pagination?.hasPreviousPage)
            setTotalPages(res?.data?.pagination?.totalPages)

            const max = data.length - 1;
            let randomNumber = generateRandomNumber(max);
            const random_story = data[randomNumber]
            setRandomStory(random_story);
            console.log({ randomNumber, random_story });

            const genres = res.data?.genres.map((genre: { id: number, name: string }) => {
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

    const getDistinctGenres = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/story-genres`)
            setDistinctGenres(response?.data?.distinctGenres);
        } catch (error) {
            console.error(error);
        }
    }



    const filterByGenre = (id: string | number) => {
        // Fix the find callback function
        let genreAlreadySelected = selectedGenre.find(genreId => genreId === id);

        let updatedGenres = [];

        if (genreAlreadySelected) {
            // If genre is already selected, remove it (toggle functionality)
            updatedGenres = selectedGenre.filter(genreId => genreId !== id);
            setSelectedGenre(updatedGenres);
        } else {
            // Create a new array with the spread operator to trigger re-render properly
            updatedGenres = [...selectedGenre, id];
            setSelectedGenre(updatedGenres);
        }

        // Reset to page 1 when filtering by genre
        setCurrentPage(1);

        // Call fetchStories with the updated genres
        fetchStories(1, updatedGenres);
    }

    const alreadySelected = (id: number) => {
        return selectedGenre.find(genreId => genreId === id) !== undefined;
    }

    return (
        <>
            <ReadersHeaderComponent returnTitle="Home" returnUrl="/" />

            <div className='overflow-y-auto'>

                {randomStory && <RandomStoryComponent loading={loading} randomStory={randomStory} />}

                <div className='mt-10 bg-[#FBFBFB]'>
                    {/* <div className="mt-[260px] px-20 grid p-5 grid-cols-6 gap-12"> */}
                    <div className=" grid p-5 grid-cols-6 gap-12">
                        <div className="left-container bg-white rounded-2xl p-5 col-span-6 mb-10">
                            <div className="flex flex-wrap items-center gap-3 text-[10px] tracking-wide mb-7">
                                {
                                    distinctGenres?.map((genre: { id: number, name: string }) => (
                                        <span key={genre.id} onClick={() => filterByGenre(genre?.id)} className={`rounded-lg py-2 px-3 cursor-pointer transition-all ${alreadySelected(genre.id) ? 'bg-[#5D4076] text-white' : 'text-gray-600 bg-[#D8D1DE3D]'}`}>{genre.name}</span>
                                    ))
                                }
                            </div>

                            {/* <div className="flex gap-9 items-center mb-3">                
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
                            </div> */}

                            <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-between">

                                <h2 className='text-gray-500 text-2xl font-bold'>For You</h2>

                                {/* <div className='flex items-center gap-2'>
                                    
                                    <div onClick={() => setActiveControl('list')} className={` rounded-2xl h-9 w-9 flex items-center justify-center cursor-pointer list-control ${activeControl === "list" ? 'bg-[#F5F5F5]' : ''}`}>
                                        <Image src="/icon/filter.svg" alt="add-circle-half-dot icon" className=" " width={16} height={16} />
                                    </div>
                                    <div onClick={() => setActiveControl('grid')} className={` rounded-2xl h-9 w-9 flex items-center justify-center cursor-pointer list-control ${activeControl === "grid" ? 'bg-[#F5F5F5]' : ''}`}>
                                        <Image src="/icon/grid.svg" alt="add-circle-half-dot icon" className=" " width={16} height={16} />
                                    </div>
                                </div> */}

                                <div className="flex items-center">
                                    <SearchBoxComponent />
                                </div>

                            </div>

                            <div className="mt-10 mb-10 min-h-[800px]">
                                {loading &&
                                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                        <Skeleton className="col-span-1 h-[390px] rounded-2xl" />
                                        <Skeleton className="col-span-1 h-[390px] rounded-2xl" />
                                        <Skeleton className="col-span-1 h-[390px] rounded-2xl" />
                                        <Skeleton className="col-span-1 h-[390px] rounded-2xl" />

                                    </div>
                                }

                                {
                                    !loading &&
                                    <>

                                        {/* <StoryCardComponent stories={publishedStories ?? []} activeControl={activeControl} />                         */}
                                        {activeControl === "grid" &&
                                            <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-5'>
                                                {
                                                    publishedStories?.map(story => (

                                                        <StoryGridViewComponent key={story?.id} story={story} image={story?.coverImageUrl ?? story?.bannerImageUrl} />
                                                    ))
                                                }
                                            </div>
                                        }

                                        {
                                            publishedStories.length > 0 &&
                                            // <PaginationComponent
                                            //     hasPrevPage={hasPrevPage}
                                            //     hasNextPage={hasNextPage}
                                            //     triggerPagination={paginateStories}
                                            //     currentPage={currentPage}
                                            //     totalPages={totalPages}
                                            //     textColor="text-black"
                                            //     bgColor="bg-white"
                                            //     descColor="text-white"
                                            // />
                                            <Pagination
                                                hasPrevPage={hasPrevPage}
                                                hasNextPage={hasNextPage}
                                                triggerPagination={paginateStories}
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                textColor="text-black"
                                                bgColor="bg-white"
                                                descColor="text-white"
                                            />
                                        }

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
