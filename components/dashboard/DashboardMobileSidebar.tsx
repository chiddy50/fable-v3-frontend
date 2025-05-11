"use client"

import React, { useContext, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import CollapsibleSectionComponent from '../navigation/CollapsibleSectionComponent';
import Link from 'next/link';
import Image from 'next/image';
import { AppContext } from '@/context/MainContext';
import { UserAvatarComponent } from '../shared/UserAvatarComponent';
import DashboardSidebarContent from './DashboardSidebarContent';

const DashboardMobileSidebar = ({
    mobileSidebarOpen, setMobileSidebarOpen
}) => {

    const {
        isLoggedIn, setIsLoggedIn, user, setUser,
        showTopUpCreditModal, setShowTopUpCreditModal, logout
    } = useContext(AppContext)

    return (
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>

            <SheetContent side="left" className="max-w-72 w-72 ">

                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>

                <div className='overflow-y-auto px-4 pb-4 h-full'>
                    <DashboardSidebarContent />
                </div>

            </SheetContent>
        </Sheet>
    )
}

export default DashboardMobileSidebar
