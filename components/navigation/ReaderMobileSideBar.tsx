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


export const ReaderMobileSideBar = () => {
    const { user, mobileSideNavIsOpen, setMobileSideNavIsOpen } = useContext(AppContext)
    
    return (
 
        <Sheet open={mobileSideNavIsOpen} onOpenChange={setMobileSideNavIsOpen}>

            <SheetContent side="left" className="overflow-y-scroll max-w-[17%]">

                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>

    )
}
