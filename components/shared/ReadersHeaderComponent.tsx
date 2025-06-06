"use client"

import React, { useContext, useEffect, useState } from 'react'
import { ArrowLeft, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AppContext } from '@/context/MainContext';
import axios from 'axios';


export const ReadersHeaderComponent = ({ returnUrl, returnTitle }: { returnUrl: string, returnTitle: string }) => {
    const { user, mobileSideNavIsOpen, setMobileSideNavIsOpen } = useContext(AppContext)
        const [storyCount, setStoryCount] = useState<number>(0);
    
    useEffect(() => {
        getStoriesCount();
    }, []);

    const getStoriesCount = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/count`)
            console.log(response);
            setStoryCount(response?.data?.storyCount)
        } catch (error) {
            console.error(error);            
        }
    }

    return (
        // <nav className="fixed bg-transparent top-0 p-4 backdrop-blur-xl" style={{ position: 'sticky'}}>        
        <nav className="absolute h-[80px] top-0 left-0 w-full bg-white/30 backdrop-blur-md z-50 px-6 py-4 border-b border-white/10" >
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-7'>
                    <div onClick={() => setMobileSideNavIsOpen(true)} className="block lg:hidden xl:hidden">
                        <div className='text-black bg-white border cursor-pointer flex items-center justify-center py-2 px-2 rounded-lg transition-all hover:bg-gray-100'>
                            <Menu size={16}/>
                        </div>
                    </div>

                    <div className='flex items-center gap-3'>
                        <Link href={returnUrl} className='text-black bg-white border cursor-pointer flex items-center justify-center py-2 px-2 rounded-lg transition-all hover:bg-gray-100'>
                            <ArrowLeft size={16} />
                        </Link>
                        <h2 className="text-white text-shadow-dark text-2xl font-bold">{returnTitle}</h2>
                    </div>
                </div>

                <div className="flex">
                    <div className="bg-white/30 cursor-pointer border flex items-center px-2 py-1 gap-2 rounded-md border-gray-200/50 hover:bg-white/50 transition-all">
                        <p className="stories-btn text-xs text-gray-600 ">
                            Stories
                        </p>
                        <p className="bg-white text-lg rounded-sm px-2 py-1 font-semibold shadow-sm">{storyCount ?? 0}</p>
                    </div>
                </div>
            </div>
        </nav>
    )
}
