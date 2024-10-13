"use client";

import { ArrowLeftRightIcon, BookCopy, BookOpenTextIcon, ClipboardList, Gauge, Menu } from 'lucide-react'
import Link from 'next/link';
// import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import Image from 'next/image';

export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {

    const currentPath = usePathname();

    return (
      <div className='mt-[80px]'>
        <div className="sidebar">
{/*             
            <Link href="/">            
                <div className="flex justify-center mt-7 mb-10">
                    <Image src="/fable_logo.svg" alt="Fable logo" width={100} height={100} />
                </div>
            </Link> */}

            {/* <h1 className="font-bold text-4xl mb-10 p-5 text-center tracking-widest">FABLE</h1> */}
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

                {/* <Link href="/dashboard/transactions" className={cn(
                    currentPath === "/dashboard/transactions" ? "bg-custom_green text-white" : "hover:bg-gray-200",
                    'flex items-center gap-4 p-2 rounded-3xl'
                )}>
                    <span className={cn(
                        currentPath === "/dashboard/transactions" ? "bg-custom_green" : "bg-gray-100",
                        "flex items-center w-8 h-8 rounded-full justify-center"
                    )}>
                        <ArrowLeftRightIcon className={cn(currentPath === "/dashboard/transactions" ? "text-white" : "text-custom_green", 'w-4 h-4 bg-transparent')} />
                    </span>
                    <span className='text-xs font-semibold'>Transactions</span>
                </Link> */}


            </div>
        </div>

        <div className="content">
            {/* <DashboardHeader /> */}
            
            <div className='mt-7 px-5 md:px-10'>
                {children}  
            </div>
        </div>
   
      </div>
    )
}
