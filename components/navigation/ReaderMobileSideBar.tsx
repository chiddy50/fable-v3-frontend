"use client"

import React, { useContext } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { AppContext } from '@/context/MainContext'
import Link from 'next/link'
import Image from 'next/image'
import { LogOut, Plus } from 'lucide-react'


export const ReaderMobileSideBar = () => {
    const { user, mobileSideNavIsOpen, setMobileSideNavIsOpen, logout } = useContext(AppContext)

    return (

        <Sheet open={mobileSideNavIsOpen} onOpenChange={setMobileSideNavIsOpen}>

            <SheetContent side="left" className="max-w-[90px] w-[90px]">

                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>


                <div className="flex flex-col gap-20 px-3 py-2 h-full justify-between">
                    <div className="flex flex-col items-center gap-5">
                        <div className="w-[55px] h-[55px] flex justify-center">
                            <Link href="/" className='flex cursor-pointer items-center justify-center w-full '>
                                <Image src="/logo/fable_black.png" alt="Fable logo" className="rounded-xl w-full" width={45} height={45} />
                            </Link>
                        </div>

                        <div className="w-full flex justify-center">
                            <Link href="/dashboard" className='flex cursor-pointer items-center justify-center gap-3 rounded-xl w-[40px] h-[40px] px-3 py-4 hover:bg-gray-200'>
                                <Image src="/icon/feather.svg" alt="feather icon" className=" " width={17} height={17} />
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-5 mb-5">
                        <div className='flex items-center w-[40px] h-[40px] justify-center cursor-pointer '>
                            <img
                                src={user?.imageUrl ?? `/avatar/default-avatar.png`}
                                alt="User avatar"
                                className='rounded-lg w-full'
                            />
                        </div>

                        <div className='flex cursor-pointer items-center justify-center bg-black text-white gap-3 rounded-xl w-[40px] h-[40px] px-3 py-4'>
                            <Plus size={20} />
                        </div>

                        <div onClick={logout} className='flex cursor-pointer items-center justify-center gap-3 rounded-xl w-[40px] h-[40px] px-3 py-4 hover:bg-gray-200'>
                            <LogOut size={20} />
                        </div>

                    </div>
                </div>
            </SheetContent>
        </Sheet>

    )
}
