"use client";

import { ArrowLeftRightIcon, BookCopy, BookOpenTextIcon, ClipboardList, Gauge, Menu, UserCog2 } from 'lucide-react'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
// import './prosemirror.css'

export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const [openSideNav, setOpenSideNav] = useState<boolean>(false);

    const currentPath = usePathname();

    return (
      <div className='mt-[80px]'>
        <div className='mobile-menu-control bg-[#cfead1] px-5 pt-2'>
            <Menu onClick={() => setOpenSideNav(true)} className='cursor-pointer'/>
        </div>
        <div className="sidebar">

            <div className='flex flex-col gap-6 px-6 pt-10'>

                <Link href="/dashboard" className={cn(
                    currentPath === "/dashboard" ? "bg-custom_green text-white " : "hover:bg-gray-200",
                    'flex items-center gap-4 p-2 rounded-3xl'
                )}>
                    <span className={cn(
                        currentPath === "/dashboard" ? "bg-custom_green" : "bg-gray-100",
                        "flex items-center w-8 h-8 rounded-full justify-center"
                    )}>
                        <Gauge className={cn(currentPath === "/dashboard" ? "text-white" : "text-custom_green", 'w-4 h-4 bg-transparent')} />
                    </span>
                    <span className='text-xs font-semibold'>Dashboard</span>
                </Link>

                <Link href="/dashboard/stories" className={cn(
                    currentPath === "/dashboard/stories" ? "bg-custom_green text-white" : "hover:bg-gray-200",
                    'flex items-center gap-4 p-2 rounded-3xl'
                )}>
                    <span className={cn(
                        currentPath === "/dashboard/stories" ? "bg-custom_green" : "bg-gray-100",
                        "flex items-center w-8 h-8 rounded-full justify-center"
                    )}>
                        <BookOpenTextIcon className={cn(currentPath === "/dashboard/stories" ? "text-white" : "text-custom_green", 'w-4 h-4 bg-transparent')} />
                    </span>
                    <span className='text-xs font-semibold'>Stories</span>
                </Link>

                {/* <div className={cn('flex items-center gap-4 p-2 rounded-3xl opacity-50  relative')}>
                    <span className={cn(
                        // currentPath === "/dashboard/stories" ? "bg-custom_green" : "bg-gray-100",
                        "flex items-center w-8 h-8 rounded-full justify-center bg-gray-100"
                    )}>
                        <ClipboardList className={cn(
                            // currentPath === "/dashboard/stories" ? "text-white" : "text-custom_green", 
                            'w-4 h-4 bg-transparent text-custom_green')} />
                    </span>
                    <p className='text-xs font-semibold '>Articles <span className='text-[7px] border py-0.5 px-2 rounded-2xl absolute top-0 right-4'>Coming soon</span></p>
                </div> */}

                <Link href="/dashboard/articles" className={cn(
                    currentPath === "/dashboard/articles" ? "bg-custom_green text-white" : "hover:bg-gray-200",
                    'flex items-center gap-4 p-2 rounded-3xl'
                )}>
                    <span className={cn(
                        currentPath === "/dashboard/articles" ? "bg-custom_green" : "bg-gray-100",
                        "flex items-center w-8 h-8 rounded-full justify-center"
                    )}>
                        <ClipboardList className={cn(currentPath === "/dashboard/articles" ? "text-white" : "text-custom_green", 'w-4 h-4 bg-transparent')} />
                    </span>
                    <span className='text-xs font-semibold'>Articles</span>
                </Link>

                <Link href="/dashboard/profile" className={cn(
                    currentPath === "/dashboard/profile" ? "bg-custom_green text-white" : "hover:bg-gray-200",
                    'flex items-center gap-4 p-2 rounded-3xl'
                )}>
                    <span className={cn(
                        currentPath === "/dashboard/profile" ? "bg-custom_green" : "bg-gray-100",
                        "flex items-center w-8 h-8 rounded-full justify-center"
                    )}>
                        <UserCog2 className={cn(currentPath === "/dashboard/profile" ? "text-white" : "text-custom_green", 'w-4 h-4 bg-transparent')} />
                    </span>
                    <span className='text-xs font-semibold'>Profile</span>
                </Link>
            </div>
        </div>

        <div className="content">            
            <div className='mt-7 px-5 md:px-10'>
                {children}  
            </div>
        </div>


        <Sheet open={openSideNav} onOpenChange={setOpenSideNav}>

            <SheetContent side="left" className="overflow-y-scroll z-[100] xs:max-w-[95%] sm:max-w-[50%] md:max-w-[40%] lg:max-w-[15%] xl:max-w-[15%]">

                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>

                <div className='pt-10'>

                    <div className='flex flex-col gap-6 px-6'>


                        <Link href="/dashboard" className={cn(
                            currentPath === "/dashboard" ? "bg-custom_green text-white " : "hover:bg-gray-200",
                            'flex items-center gap-4 p-2 rounded-3xl'
                        )}>
                            <span className={cn(
                                currentPath === "/dashboard" ? "bg-custom_green" : "bg-gray-100",
                                "flex items-center w-8 h-8 rounded-full justify-center"
                            )}>
                                <Gauge className={cn(currentPath === "/dashboard" ? "text-white" : "text-custom_green", 'w-4 h-4 bg-transparent')} />
                            </span>
                            <span className='text-xs font-semibold'>Dashboard</span>
                        </Link>


                        {/* <Link href="/dashboard/story-books" className={cn(
                            currentPath === "/dashboard/story-books" ? "bg-custom_green text-white" : "hover:bg-gray-200",
                            'flex items-center gap-4 p-2 rounded-3xl'
                        )}>
                            <span className={cn(
                                currentPath === "/dashboard/story-books" ? "bg-custom_green" : "bg-gray-100",
                                "flex items-center w-8 h-8 rounded-full justify-center"
                            )}>
                                <BookCopy className={cn(currentPath === "/dashboard/story-books" ? "text-white" : "text-custom_green", 'w-4 h-4 bg-transparent')} />
                            </span>
                            <span className='text-xs font-semibold'>Story Book</span>
                        </Link> */}

                        <Link href="/dashboard/stories" className={cn(
                            currentPath === "/dashboard/stories" ? "bg-custom_green text-white" : "hover:bg-gray-200",
                            'flex items-center gap-4 p-2 rounded-3xl'
                        )}>
                            <span className={cn(
                                currentPath === "/dashboard/stories" ? "bg-custom_green" : "bg-gray-100",
                                "flex items-center w-8 h-8 rounded-full justify-center"
                            )}>
                                <BookOpenTextIcon className={cn(currentPath === "/dashboard/stories" ? "text-white" : "text-custom_green", 'w-4 h-4 bg-transparent')} />
                            </span>
                            <span className='text-xs font-semibold'>Stories</span>
                        </Link>

                        <div className={cn('flex items-center gap-4 p-2 rounded-3xl opacity-50  relative')}>
                            <span className={cn(
                                // currentPath === "/dashboard/stories" ? "bg-custom_green" : "bg-gray-100",
                                "flex items-center w-8 h-8 rounded-full justify-center bg-gray-100"
                            )}>
                                <ClipboardList className={cn(
                                    // currentPath === "/dashboard/stories" ? "text-white" : "text-custom_green", 
                                    'w-4 h-4 bg-transparent text-custom_green')} />
                            </span>
                            <p className='text-xs font-semibold '>Articles <span className='text-[7px] border py-0.5 px-2 rounded-2xl absolute top-0 right-4'>Coming soon</span></p>
                        </div>

                        <Link href="/dashboard/profile" className={cn(
                            currentPath === "/dashboard/profile" ? "bg-custom_green text-white" : "hover:bg-gray-200",
                            'flex items-center gap-4 p-2 rounded-3xl'
                        )}>
                            <span className={cn(
                                currentPath === "/dashboard/profile" ? "bg-custom_green" : "bg-gray-100",
                                "flex items-center w-8 h-8 rounded-full justify-center"
                            )}>
                                <UserCog2 className={cn(currentPath === "/dashboard/profile" ? "text-white" : "text-custom_green", 'w-4 h-4 bg-transparent')} />
                            </span>
                            <span className='text-xs font-semibold'>Profile</span>
                        </Link>


                    </div>


                </div>
            </SheetContent>
        </Sheet>
   
      </div>
    )
}
