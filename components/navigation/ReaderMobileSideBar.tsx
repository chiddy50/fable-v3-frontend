"use client"

import React, { useContext } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { AppContext } from '@/context/MainContext'
import ReaderSideBarContent from './ReaderSideBarContent'


export const ReaderMobileSideBar = () => {
    const { mobileSideNavIsOpen, setMobileSideNavIsOpen } = useContext(AppContext)

    return (

        <Sheet open={mobileSideNavIsOpen} onOpenChange={setMobileSideNavIsOpen}>

            <SheetContent side="left" className="max-w-[90px] w-[90px]">

                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>


                <div className="flex flex-col justify-between gap-20 px-3 py-2 h-full ">
					<ReaderSideBarContent />
                </div>
            </SheetContent>
        </Sheet>

    )
}
