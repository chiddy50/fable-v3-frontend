"use client"

import { ThumbsDown, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import React, { useContext } from 'react'
import { UserAvatarAndNameComponent, UserAvatarComponent } from '../shared/UserAvatarComponent'
import { StoryInterface } from '@/interfaces/StoryInterface'
import { AppContext } from '@/context/MainContext'


interface Props {
    // setChapter: React.Dispatch<React.SetStateAction<ChapterInterface | null>>;
    // activeChapter: ChapterInterface | null;
    story: StoryInterface | null;
}

const StoryCommentsComponent: React.FC<Props> = ({
    story
}) => {
    const { user } = useContext(AppContext)
    
    return (
        <div>
            <div className="flex items-center justify-between ">
                <h1 className="font-bold text-3xl">Comments</h1>
                <div className="px-3 py-1 bg-gray-100 text-indigo-900 rounded-full font-bold text-sm">{story?.comments?.length ?? 0} <span className='font-light text-xs'>comment(s)</span> </div>

            </div>

            <p className="mt-4 text-xs text-gray-600">
                More of <span className="font-bold">@{story?.user?.name}</span> publications.
            </p>


            {/* Create comment */}
            <div className="mt-10">
                <div className="flex items-center gap-2">
                    <UserAvatarComponent width={40} height={40} imageUrl={user?.imageUrl} />
                    
                    <span className="text-gray-900 font-semibold text-xs">{user?.name} </span>
                </div>

                <div className="bg-gray-100 text-gray-700 mt-3 p-3 rounded-xl">
                    {/* <input 
                    type="text"
                    placeholder='What are your thoughts?'
                    className='p-3 outline-0 text-gray-700 rounded-xl text-xs border-none w-full mt-3 bg-gray-100' 
                    />                 */}
                    <textarea className="w-full outline-0 text-xs resize-none" cols={3} rows={4} id=""></textarea>
                    <button className='flex items-center gap-2 cursor-pointer bg-[#33164C] text-white rounded-xl p-2 text-xs'>
                        <Image 
                            src="/icon/send.svg" 
                            alt="send icon"
                            width={15}
                            height={15}
                            className=""
                        />
                        
                        <span className='text-xs'>Send</span>
                    </button>
                </div>
            </div>

            {/* Comments */}
            <div className="mt-10">

                {
                    [1].map(item => (
                        <div key={item} className='mb-7'>
                            <div className="flex items-center justify-between">
                                {/* <div className="flex items-center gap-2">
                                    <Image 
                                        src="/avatar/male_avatar1.svg" 
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

                                <UserAvatarAndNameComponent name="Samantha Austin" username="samAustin" />

                                <p className='font-semibold text-xs'>2min ago</p>
                            </div>

                            <p className="my-5 leading-5 text-xs">
                                I hope your essay encourages more Americans to try to learn a foreign language. My husband speaks pretty good German thanks to a summer internship there. We recently went to Mallorca (east side of the island) There are many German tourists there. The Germans sitting next
                            </p>

                            <div className="flex items-center gap-3">
                                <div className='flex items-center gap-1 bg-[#F5F5F5] rounded-xl p-2 cursor-pointer text-gray-600 hover:text-red-600'>
                                    <ThumbsUp size={12} className="" />
                                    <span className="text-[10px]">50k</span>
                                </div>
                                <div className='flex items-center gap-1 bg-[#F5F5F5] rounded-xl p-2 cursor-pointer text-gray-600 hover:text-red-600'>
                                    <ThumbsDown size={12} className="" />
                                    <span className="text-[10px]">10k</span>
                                </div>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>

    )
}

export default StoryCommentsComponent
