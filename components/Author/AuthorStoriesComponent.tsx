"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import PaginationComponent from '@/components/pagination-component';
import { useEffect, useState } from "react";
import { ArticleInterface } from "@/interfaces/ArticleInterface";
import axios from "axios";
import { trimWords, formatDate } from '@/lib/helper';
import Image from "next/image";
import { Separator } from "@/components/ui/separator"
import { MessageSquare, ThumbsUp } from 'lucide-react';
import StarRatingComponent from '@/components/Rating/StarRatingComponent';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StoryInterface } from "@/interfaces/StoryInterface";

const AuthorStoriesComponent = ({ userId }: { userId: string }) => {

    const [limit, setLimit] = useState(9)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPrevPage, setHasPrevPage] = useState(false)
    const [totalPages, setTotalPages] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [loadingStories, setLoadingStories] = useState(true);
    const [stories, setStories]= useState<StoryInterface[]>([]);   

    useEffect(() => {
        getStories();
    }, []);

    const paginateChallenges = (page: number) => {
        let set_next_page = currentPage + page
        setCurrentPage(set_next_page)
                   
        getStories(set_next_page)
    }

    const getStories = async (page = 1) => {
        try {
            setLoadingStories(true);

            let params = {
                page: page,
                limit: limit,
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/stories/users/${userId}`, {
                params
            })
            setStories(response?.data?.stories);
            setHasNextPage(response?.data?.hasNextPage)
            setHasPrevPage(response?.data?.hasPrevPage)
            setTotalPages(response?.data?.totalPages)  

        } catch (error) {
            console.error(error);            
        }finally{
            setLoadingStories(false)
        }
    }

    return (
        <>
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <CarouselContent>      
                    {
                        stories.map(story => (

                            <CarouselItem key={story.id} className="md:basis-1/2 lg:basis-1/3">

                                <div className="responsive h-full " >            
                                    <div className='flex relative h-full flex-col shadow-xl overflow-y-clip rounded-xl bg-white'>
                                    <div className='relative overflow-hidden h-[300px]'>                    
                                        <Image
                                        fill={true}
                                        src={story?.coverImage ?? '/no-image.png'}
                                        alt={story?.title ?? 'character description'}                        
                                        className='w-full rounded-t-xl h-full object-cover object-center'                     
                                        loading="lazy"
                                        sizes="(max-width: 768px) 100%, (max-width: 1200px) 100%, 100%"
                                        />
                                    </div>
                                    <div className="h-1/2 p-4 flex flex-col bg-gray-900 justify-between">
                                        <div className='flex flex-col items-center'>
                                            <h2 className='font-semibold text-md tracking-wider capitalize text-gray-50 text-center mb-2'>{trimWords(story?.projectTitle, 3)}</h2>
                                            <div className='mt-7 mb-3 flex items-center justify-between text-xs text-gray-400'>
                                                <div className='flex items-center gap-4'>
                                                    {/* <Sparkle className='h-4 w-4 fill-yellow-500 text-yellow-500' /> */}
                                                    {/* <span>{formatDate(story.createdAt)}</span> */}
                                                    <span>{formatDate(story?.createdAt)}</span>
                                                    <Separator orientation='vertical' className='h-4' />
                                                    <div className='flex items-center gap-2'>
                                                    <ThumbsUp className='h-4 w-4' />
                                                    <span>{story?.likeCount ?? 0}</span>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                    <MessageSquare className='h-4 w-4' />
                                                    <span>0</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <StarRatingComponent rating={story?.averageRating} />
                                        </div>

                                        <Link href={`/read-story/${story.id}`}>                                                                        
                                            <Button variant="outline" onClick={() => {}} className='w-full mt-2'>Read for {story.isFree ? `free` : `$${story?.price}`}</Button>
                                        </Link>
                                    </div>

                                    </div>
                                </div>

                            </CarouselItem>
                        ) )
                    }          

                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

            <PaginationComponent
                hasPrevPage={hasPrevPage} 
                hasNextPage={hasNextPage} 
                triggerPagination={paginateChallenges} 
                currentPage={currentPage} 
                totalPages={totalPages}
                textColor="text-black"
                bgColor="bg-white"
                descColor="text-white"
            />
        </>
    )
}

export default AuthorStoriesComponent
