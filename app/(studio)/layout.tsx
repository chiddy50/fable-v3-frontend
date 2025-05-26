"use client";

import { ArrowLeftRightIcon, Bell, BookCopy, BookOpenTextIcon, ClipboardList, Dot, Gauge, Menu, Plus, UserCog2 } from 'lucide-react'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import SearchBoxComponent from '@/components/navigation/SearchBoxComponent';
import CollapsibleSectionComponent from '@/components/navigation/CollapsibleSectionComponent';
import { UserAvatarComponent } from '@/components/shared/UserAvatarComponent';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/context/MainContext';
import { UserInterface } from '@/interfaces/UserInterface';
import ModalBoxComponent from '@/components/shared/ModalBoxComponent';
import TopUpCreditComponent from '@/components/shared/TopUpCreditComponent';
import DashboardMobileSidebar from '@/components/dashboard/DashboardMobileSidebar';
import DashboardSidebarContent from '@/components/dashboard/DashboardSidebarContent';
import { usePrivy } from '@privy-io/react-auth';
import LoaderComponent from '@/components/shared/LoaderComponent';


export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const [openSideNav, setOpenSideNav] = useState<boolean>(false);
    // const [user, setUser] = useState<UserInterface|null>(null);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

    const currentPath = usePathname();
	const { ready, authenticated, logout } = usePrivy();

	const router = useRouter();

    const { 
        isLoggedIn, setIsLoggedIn, user, setUser, 
        showTopUpCreditModal, setShowTopUpCreditModal
    } = useContext(AppContext);

    useEffect(() => {
        let token = localStorage?.getItem("privy:token") 
        let authUser = localStorage?.getItem("user") 
        // if (ready && !authenticated) {
        let shouldLogout = window !== undefined && !authUser;
        console.log({
            shouldLogout,
            window,
            authUser
        });
        
        if(window !== undefined && !authUser){
            logoutUser()
            return;
        }
        setUserProfile()
    }, []);

    const logoutUser = async () => {
        await logout()
        router.push("/")
    }

    const setUserProfile = () => {
        try {
            const userData = localStorage.getItem('user');        
            const parsedData = userData ? JSON.parse(userData) : null;            
            setUser(parsedData);
        } catch (error) {
            console.error('Error fetching data from localStorage:', error);
        }
    }

      if (!ready) {
		return (
			<LoaderComponent />
		);
	}


    return (
        <div className="flex h-screen">
            {/* Fixed Navigation Bar - full width, fixed at top */}
            <div className="fixed top-0 left-0 right-0 h-[80px] z-10 border-b border-[#F5F5F5]">
                {/* Navigation content */}
                <div className=" mx-auto px-10 lg:px-20 h-full flex justify-between items-center">
                    <div className='flex gap-7 items-center'>
                        <Menu size={20} onClick={() => setMobileSidebarOpen(true)} className='cursor-pointer block lg:hidden' />
                        <Link href="/">
                            <Image src="/logo/fable_new_logo.svg" alt="Fable logo" className=" " width={90} height={90} />
                        </Link>

                        {/* <SearchBoxComponent /> */}
                    </div>

                     <div className="flex items-center gap-3">
                        {/* <Link href="/dashboard" className='flex cursor-pointer items-center gap-3 bg-[#f5f5f5] hover:bg-gray-200 rounded-xl p-3'>
                            <Image src="/icon/feather.svg" alt="feather icon" className=" " width={13} height={13} />
                            <p className='text-xs'>Write</p>
                        </Link>
    
                        <Image src="/avatar/default-avatar.png" alt="default avatar" className=" " width={40} height={40} /> */}

                        <div className="bg-white text-[#626262] p-2 rounded-lg transition-all hover:text-white hover:bg-[#626262]">
                            <div className='relative cursor-pointer'>
                                <Bell size={20} className=''/>
                                <div className='bg-red-500 rounded-full w-2 h-2 absolute top-0 right-0'></div>
                            </div>
                        </div>
                        <i className='bx bx-sun text-2xl cursor-pointer bg-white text-[#626262] p-2 rounded-lg transition-all hover:text-white hover:bg-[#626262]'></i>
                        {/* <i className='bx bx-moon text-3xl'></i> */}
                    </div>
                </div>
            </div>

            {/* Main Content Area - adjusted to account for navigation height */}
            <div className="flex w-full mt-[80px] bg-[#F9F9F9]">
                
                {/* Fixed Sidebar - fixed position with scrolling */}
                <div className="fixed left-0 top-[80px] bottom-0 hidden lg:block lg:w-64 overflow-y-auto mx-5">

                    <DashboardSidebarContent />
                </div>

                {/* Main Content - takes remaining space with its own scrolling */}
                <div className="lg:ml-64 flex-1 py-6 px-5 lg:px-10 overflow-hidden">{children}</div>
            </div>




            <ModalBoxComponent
                isOpen={showTopUpCreditModal}
                onClose={() => setShowTopUpCreditModal(false)}
                width="w-[95%] xs:w-[95%] sm:w-[90%] md:w-[80%] lg:w-[50%] xl:w-[30%] "
                useDefaultHeader={false}
            >
                <TopUpCreditComponent />
            </ModalBoxComponent>


            <DashboardMobileSidebar mobileSidebarOpen={mobileSidebarOpen} setMobileSidebarOpen={setMobileSidebarOpen} />
        </div>
    )
}
