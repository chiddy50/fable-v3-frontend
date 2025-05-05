"use client";  

import React, { useContext, useState } from 'react'
import Link from 'next/link';
import Image from "next/image";
import StoryCardComponent from '@/components/story/StoryCardComponent';
import RatingBtnComponent from '@/components/shared/RatingBtnComponent';
import { UserAvatarComponent } from '@/components/shared/UserAvatarComponent';
import AuthorComponent from '@/components/story/AuthorComponent';
import { AppContext } from '@/context/MainContext';

const CreatorPage = () => {
    const [activeControl, setActiveControl] = useState<'list' | 'grid'>('list');
    const [activeTab, setActiveTab] = useState<'stories' | 'articles' | 'featured'>('stories');
    
        const { isLoggedIn, setIsLoggedIn, user, setUser } = useContext(AppContext)
    
    return (
        <div className='min-h-screen bg-[#FBFBFB]'>
            <nav className='fixed top-0 h-[180px] left-0 w-full z-20 px-7 pt-7 backdrop-blur-sm'>
                <div className='flex justify-center w-full z-10'>
                    <div className='flex relative items-center justify-between z-30 gap-20 bg-white p-4 rounded-3xl'>
                        <div className="flex items-center gap-7">
                            <Link href="/">
                                <Image src="/logo/fable_new_logo.svg" alt="Fable logo" className=" " width={90} height={90} />
                            </Link>
                            <div className='bg-[#f9f9f9] py-1 px-3 gap-1 rounded-xl flex items-center'>
                                <i className='bx bx-search text-xl'></i>
                                <input type="text" placeholder='Search stories, creators, e.t.c' className='text-xs pr-4 py-2 outline-0' />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/dashboard" className='flex cursor-pointer items-center gap-3 bg-[#f9f9f9] rounded-xl p-3 hover:bg-gray-200'>
                                <Image src="/icon/feather.svg" alt="feather icon" className=" " width={13} height={13} />
                                <p className='text-xs'>Write</p>

                            </Link>

                            {/* <Image src={ user?.imageUrl ?? "/avatar/default-avatar.svg" } alt="default avatar" className=" " width={40} height={40} /> */}
                            <UserAvatarComponent
                                width={40} 
                                height={40} 
                                borderRadius='rounded-xl' 
                                isDouble={false}             
                                imageUrl={ user?.imageUrl ?? "/avatar/male_avatar2.svg" }
                            /> 
                        </div>
                    </div>
                </div>
                <img src="/img/nav-background.png" alt="navigation background" className="w-full absolute top-0 left-0 z-2 h-[180px] right-0 object-cover" />
                

            </nav>

            <div className="mt-[210px] px-20">

                <div className="grid grid-cols-6 gap-12">
                    <div className='col-span-4'>                       
                        <UserAvatarComponent
                            width={100} 
                            height={100} 
                            borderRadius='rounded-xl'            
                            imageUrl="/avatar/male_avatar1.svg"
                        />

                        <h1 className="font-bold mt-5 text-2xl">Cole Palmer</h1>

                        <div className="flex items-center justify-between mt-3">
                            <p className='text-sm font-light text-gray-600'>
                                <span>@Colepalmer - </span><span className='font-bold text-black'>25 </span><span>Publications</span>
                            </p>
                            <i className='bx bx-dots-horizontal-rounded text-2xl cursor-pointer'></i>
                        </div>

                        <div className='mt-3 grid grid-cols-2 items-center '>
                            <p className='text-xs text-gray-600 leading-5'>
                            Aspiring writer and storyteller, leveraging AI to bring my creative visions to life. Passionate about crafting...
                            </p>
                            <div className='ml-auto'>
                                <div className='relative flex items-center justify-between border-gray-100'>
                                    <div className="flex items-center gap-3">
                                        <Image 
                                            src="/icon/x-solid.svg" 
                                            alt="X solid icon"
                                            width={20}
                                            height={20}
                                            className="rounded-xl cursor-pointer"
                                        />
                                        <Image 
                                            src="/icon/instagram-solid.svg" 
                                            alt="Instagram solid icon"
                                            width={20}
                                            height={20}
                                            className="rounded-xl cursor-pointer"
                                        />
                                        <Image 
                                            src="/icon/facebook-solid.svg" 
                                            alt="Facebook solid icon"
                                            width={20}
                                            height={20}
                                            className="rounded-xl cursor-pointer"
                                        />
                                        {/* <div className='flex items-center gap-2 bg-[#F5F5F5] rounded-xl p-2 cursor-pointer transition-all border border-[#F5F5F5] hover:border-amber-400'>
                                            <i className='bx bxs-star text-amber-400 text-md'></i>
                                            <span className="text-gray-600 text-[10px]">4/5</span>
                                        </div> */}

                                        <RatingBtnComponent />

                                    </div>
                    
                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>

                <div className="grid grid-cols-6 gap-12 mt-7">
                    <div className='col-span-4 bg-white rounded-2xl p-5 '>
                        <div className="flex items-center justify-between">
                            <h2 className='text-gray-500 text-2xl font-bold'></h2>
                            
                            <div className='flex items-center gap-2 ml-auto'>
                                
                                <div onClick={() => setActiveControl('list')} className={` rounded-2xl h-9 w-9 flex items-center justify-center cursor-pointer list-control ${activeControl === "list" ? 'bg-[#F5F5F5]' : ''}`}>
                                    <Image src="/icon/filter.svg" alt="add-circle-half-dot icon" className=" " width={16} height={16} />
                                </div>
                                <div onClick={() => setActiveControl('grid')} className={` rounded-2xl h-9 w-9 flex items-center justify-center cursor-pointer list-control ${activeControl === "grid" ? 'bg-[#F5F5F5]' : ''}`}>
                                    <Image src="/icon/grid.svg" alt="add-circle-half-dot icon" className=" " width={16} height={16} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 text-gray-500">
                            <p onClick={() => setActiveTab('stories')} 
                            className={`creator-tab flex items-center gap-1 border-b py-1 cursor-pointer transition-all hover:border-gray-700 ${activeTab === 'stories' ? 'border-gray-700': 'border-white'}`}>
                                <span className='text-xs'>Stories</span>
                                {activeTab === 'stories' && 
                                <i className={`bx bx-check-circle text-xl ${activeTab === 'stories' ? 'show-icon': 'hide-icon'}`} ></i>
                                }
                            </p>
                            <p onClick={() => setActiveTab('articles')} 
                            className={`creator-tab flex items-center gap-1 border-b py-1 cursor-pointer transition-all hover:border-gray-700 ${activeTab === 'articles' ? 'border-gray-700': 'border-white'}`}>
                                <span className='text-xs'>Articles</span>
                                {activeTab === 'articles' && <i className={`bx bx-check-circle text-xl ${activeTab === 'articles' ? 'show-icon': 'hide-icon'}`} ></i>
                                }
                            </p>
                            <p onClick={() => setActiveTab('featured')} 
                            className={`creator-tab flex items-center gap-1 border-b py-1 cursor-pointer transition-all hover:border-gray-700 ${activeTab === 'featured' ? 'border-gray-700': 'border-white'}`}>
                                <span className='text-xs'>Featured</span>
                                {activeTab === 'featured' && <i className={`bx bx-check-circle text-xl ${activeTab === 'featured' ? 'show-icon': 'hide-icon'}`} ></i>}
                            </p>
                        </div>

                        <div className="mt-5">
                            <StoryCardComponent stories={[]} activeControl={activeControl} />                                                
                        </div>
                    </div>

                    <div className='col-span-2 bg-white rounded-2xl p-5 '>

                        { [1,2,3,4,5,6].map((item) => (
                            <div key={item} className="max-w-4xl mx-auto my-8 font-sans">
                                <div className="mb-4">
                                    <AuthorComponent count={1} />
                                </div>

                                <h1 className="text-lg font-bold text-gray-800 my-3">The deathly hallows of North Seria</h1>

                                <p className="mt-3 mb-4 text-xs text-gray-500">
                                No one expected the ground to open that day. It started as a low, distant rumble...
                                </p>
                    
                                <div className="flex item-center justify-between">
                                    <button className="px-5 py-2 transition-all bg-[#D8D1DE3D] hover:bg-[#D8D1DE80] text-gray-800 cursor-pointer rounded-full text-[10px]">Read</button>

                                    <RatingBtnComponent />
                                </div>
                            </div>
                            ))
                        }

                        <button className='px-5 py-3 w-full rounded-xl bg-gray-100 cursor-pointer text-xs mt-5'>See more recommendations</button>

                            
                    </div>

                </div>

            </div>

        </div>
    )
}

export default CreatorPage
