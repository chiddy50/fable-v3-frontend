"use client"

import { ThumbsDown, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { UserAvatarAndNameComponent, UserAvatarComponent } from '../shared/UserAvatarComponent'
import { StoryInterface } from '@/interfaces/StoryInterface'
import { AppContext } from '@/context/MainContext'
import { ChapterInterface } from '@/interfaces/ChapterInterface'
import axiosInterceptorInstance from '@/axiosInterceptorInstance'
import { toast } from 'sonner'
import axios from 'axios'
import { usePrivy } from '@privy-io/react-auth'
import PrivyLoginComponent from '../authentication/PrivyLoginComponent'
import { usePathname } from 'next/navigation'
import { Skeleton } from '../ui/skeleton'
import { formatDate } from '@/lib/helper'


interface Props {
    // setChapter: React.Dispatch<React.SetStateAction<ChapterInterface | null>>;
    story: StoryInterface | null;
    activeChapter: ChapterInterface | null;  
}

const StoryCommentsComponent: React.FC<Props> = ({
    story,
    activeChapter
}) => {
	const { authenticated } = usePrivy();

    const { user, setUser } = useContext(AppContext)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(3);
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<boolean>(false);
    
    const [commenting, setCommenting] = useState<boolean>(false);

    const [comment, setComment] = useState<string>("");
    const [comments, setComments] = useState([]);
    
    useEffect(() => {
        setUser(user)
    }, [user])

    useEffect(() => {
        getChapterComments()
    }, [activeChapter]);

    const paginateChapterComments = (page: number) => {
        let set_next_page = currentPage + page
        setCurrentPage(set_next_page)
                   
        getChapterComments(set_next_page)
    }
    
    const getChapterComments = async  (page = 1) => {

        let params = {
            page: page,
            limit: limit,
            chapterId: activeChapter?.id,
            storyId: story?.id
        }

        console.log(params);
        

        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/story-comments`;

        try {
            const response = await axios.get(url,{
                params: params,                
            });
            console.log(response);
            
            setComments(response.data.comments);
            
        } catch (error) {
            console.error(error);            
        }
    }

    const saveComment = async () => {
        if(!comment) {
            toast.error("Provide a comment");
            return;
        }

        setCommenting(true);

        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/story-comments`;
            const response = await axiosInterceptorInstance.post(url, {
                comment,
                chapterId: activeChapter?.id,
                storyId: story?.id
            }); 
            console.log(response);

            setComment("")
            getChapterComments()
        } catch (error) {
            console.error(error);            
        }finally {
            setCommenting(false);
        }
    }
    
    const pathname = usePathname()
    
    return (
        <div className='px-5 lg:px-5 xl:px-0'>
            <div className="flex items-center justify-between ">
                <h1 className="font-bold text-3xl">Comments</h1>
                <div className="px-3 py-1 bg-gray-100 text-indigo-900 rounded-full font-bold text-sm">{story?.comments?.length ?? 0} <span className='font-light text-xs'>comment(s)</span> </div>

            </div>

            <p className="mt-4 text-xs text-gray-600">
                More of <span className="font-bold">@{story?.user?.name}</span> publications.
            </p>


            {/* Create comment if authenticated */}            
            {   authenticated &&
            <div className="mt-10">
                <div className="flex items-center gap-2">
                    <UserAvatarComponent width={40} height={40} imageUrl={user?.imageUrl} />
                    
                    <span className="text-gray-900 font-semibold text-xs">{user?.name} </span>
                </div>

                <div className="bg-gray-100 text-gray-700 mt-3 p-3 rounded-xl">
                    <textarea 
                    value={comment}
                    placeholder='What are your thoughts?'
                    onChange={(e) => setComment(e.target.value) }
                    className="w-full outline-0 text-xs resize-none" cols={3} rows={4} ></textarea>
                    <button 
                    onClick={saveComment}
                    disabled={commenting || !comment}
                    className={`flex items-center gap-2 cursor-pointer bg-[#33164C] text-white rounded-lg p-2 text-xs ${(commenting || !comment) ? "opacity-10" : "opacity-100"}`}>
                        {!commenting && 
                        <Image 
                            src="/icon/send.svg" 
                            alt="send icon"
                            width={15}
                            height={15}
                            className=""
                        />
                        }

                        {   commenting &&
                            <i className='bx bx-loader-circle bx-spin bx-flip-horizontal text-lg'></i>
                        }
                        
                        <span className='text-xs'>{commenting ? "Commenting" : "Comment" }</span>
                    </button>
                </div>
            </div>
            }

            {
                !authenticated && 
                <div className="mt-10">
                    <PrivyLoginComponent 
                    newUserRedirectUrl={pathname}
                    existingUserRedirectUrl={pathname}
                    redirect={false}
                    >
                        <button className="flex items-center py-3 px-4 cursor-pointer gap-2 border rounded-xl bg-black text-white">
                            Sign-in/Sign-up and comment                        
                        </button>
                    </PrivyLoginComponent>
                </div>
            }

            {/* Comments */}
            {   !commenting && 
                <div className="mt-10">

                    {
                        comments?.map(item => (
                            <div key={item} className='mb-7'>
                                <div className="flex items-center justify-between">
                                    {/* <div className="flex items-center gap-2">
                                        <Image 
                                            src="/avatar/default-avatar.png" 
                                            alt="Cole Palmer"
                                            width={40}
                                            height={40}
                                            className="rounded-xl border-2 border-white"
                                        />
                                        <div className="flex flex-col">
                                            <p className="text-gray-900 font-semibold text-xs">Samantha Austin </p>
                                            <p className="text-gray-700 font-light text-[10px]">@samAustin</p>
                                        </div>
                                    </div> */}

                                    <UserAvatarAndNameComponent imageUrl={item?.user?.imageUrl ?? null} name={item?.user?.name} username={item?.user?.name} />

                                    <p className='font-semibold text-xs'>{formatDate(item?.createdAt)}</p>
                                </div>

                                <p className="my-5 leading-5 text-xs">{item?.content}</p>

                                <div className="flex items-center gap-3">
                                    <div className='flex items-center gap-1 bg-[#F5F5F5] rounded-xl p-2 cursor-pointer text-gray-600 hover:text-red-600'>
                                        <ThumbsUp size={12} className="" />
                                        <span className="text-[10px]">{item?.likeCount}</span>
                                    </div>
                                    <div className='flex items-center gap-1 bg-[#F5F5F5] rounded-xl p-2 cursor-pointer text-gray-600 hover:text-red-600'>
                                        <ThumbsDown size={12} className="" />
                                        <span className="text-[10px]">{item?.dislikeCount}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
            }

            {   commenting &&
                <div className="mt-10">
                    <div className="flex items-center gap-3 mt-7">
                        <Skeleton className="w-10 h-10 rounded-xl " />
                        <Skeleton className="w-50 h-10 rounded-lg " />
                    </div>
                    <Skeleton className="w-full h-[130px] rounded-lg mt-2" />
                </div>
            }

        </div>

    )
}

export default StoryCommentsComponent
