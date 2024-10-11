"use client";

import React, { useState } from 'react'
import { ArrowLeftRightIcon, BookCopy, BookOpenTextIcon, Gauge, LogIn, LogOut, Menu } from 'lucide-react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from '../ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import AuthenticationButton from '../AuthenticationButton';

const DashboardHeader = () => {
    // const { user, primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext()

    const [openSideNav, setOpenSideNav] = useState<boolean>(false);
    const router = useRouter()
    const currentPath = usePathname();
    return (
        <nav id="nav-header" className='flex items-center justify-between p-7'>
                
            <div className='mobile-menu-control'>
                <Menu onClick={() => setOpenSideNav(true)} className='cursor-pointer'/>
            </div>

            {/* <div className='absolute top-5 right-5'>
                {
                // !user &&
                <Button 
                // onClick={() => setShowAuthFlow(true)} 
                variant="outline" 
                className='flex items-center gap-1 border-green-400 text-green-500 hover:text-green-400'>
                    <span>Login</span>
                    <LogIn className='w-4 h-4'></LogIn>
                </Button>
                }
                {
                // user &&
                <Button 
                // onClick={() => handleLogOut()} 
                variant="outline" 
                className='flex items-center gap-1 border-green-400 text-green-500 hover:text-green-400'>
                    <span>Logout</span>
                    <LogOut className='w-4 h-4'></LogOut>
                </Button>
                }
            </div> */}
            <AuthenticationButton />


            {/* <div className="flex items-center bg-white py-2 px-3  gap-2 rounded-3xl">
                <div className="border cursor-pointer flex items-center border-[#46aa41] rounded-full hover:bg-[#46aa41] hover:text-white hover:border-white pr-2">                        
                    <div className="h-6 w-6 rounded-full flex items-center justify-center ">
                        <i className='bx bx-copy text-xs'></i>
                    </div>
                    <p className="text-[9px]" id="primary-wallet-address">
                        zkdmdv...vdsmds
                    </p>
                </div>
                <div className="border cursor-pointer border-[#46aa41] h-6 w-6 rounded-full flex items-center justify-center hover:bg-[#46aa41] hover:text-white hover:border-white">
                    <i className="bx bx-user text-xs"></i>
                </div>

            </div> */}

            <Sheet open={openSideNav} onOpenChange={setOpenSideNav}>

                <SheetContent side="left" className="overflow-y-scroll xs:min-w-[30%] sm:min-w-[30%] md:min-w-[20%] lg:min-w-[15%] xl:min-w-[15%]">

                    <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription>
     
                    </SheetDescription>
                    </SheetHeader>

                    <div>

                        <Link href="/">            
                            <div className="flex justify-center mt-7 mb-10">
                                <Image src="/fable_logo.svg" alt="Fable logo" width={100} height={100} />
                            </div>
                        </Link>

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
                </SheetContent>
            </Sheet>
        </nav>
    )
}

export default DashboardHeader
