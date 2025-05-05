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


export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const [openSideNav, setOpenSideNav] = useState<boolean>(false);
    // const [user, setUser] = useState<UserInterface|null>(null);

    const currentPath = usePathname();

    const { 
        isLoggedIn, setIsLoggedIn, user, setUser, 
        showTopUpCreditModal, setShowTopUpCreditModal
    } = useContext(AppContext)

    useEffect(() => {
        setUserProfile()
    }, []);

    const setUserProfile = () => {
        try {
            const userData = localStorage.getItem('user');        
            const parsedData = userData ? JSON.parse(userData) : null;            
            setUser(parsedData);
        } catch (error) {
            console.error('Error fetching data from localStorage:', error);
        }
    }

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("storyId");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("storyId");
        setIsLoggedIn(false);
        window.location.href = "/"
    };

    return (
        <div className="flex h-screen">
            {/* Fixed Navigation Bar - full width, fixed at top */}
            <div className="fixed top-0 left-0 right-0 h-[80px] z-10 border-b border-[#F5F5F5]">
                {/* Navigation content */}
                <div className=" mx-auto px-20 h-full flex justify-between items-center">
                    <div className='flex gap-7 items-center'>
                        <Link href="/">
                            <Image src="/logo/fable_new_logo.svg" alt="Fable logo" className=" " width={90} height={90} />
                        </Link>

                        <SearchBoxComponent />
                    </div>

                     <div className="flex items-center gap-3">
                        {/* <Link href="/dashboard" className='flex cursor-pointer items-center gap-3 bg-[#f5f5f5] hover:bg-gray-200 rounded-xl p-3'>
                            <Image src="/icon/feather.svg" alt="feather icon" className=" " width={13} height={13} />
                            <p className='text-xs'>Write</p>
                        </Link>
    
                        <Image src="/avatar/male_avatar2.svg" alt="default avatar" className=" " width={40} height={40} /> */}

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
                <div className="fixed left-0 top-[80px] bottom-0 w-64  overflow-y-auto mx-5">

                    <div className="flex flex-col justify-between h-full pb-3">
                        <div>
                            <CollapsibleSectionComponent />

                            <div className="bg-white rounded-2xl mt-5 p-2">
                                <h1 className="text-xs px-3 pt-2 font-bold text-gray-500 mb-4">Menu</h1>

                                <div>
                                    <Link href="/dashboard" className="flex gap-3 p-3 rounded-xl cursor-pointer text-gray-600 transition-all hover:text-gray-800 hover:bg-gray-100 items-center mb-1">
                                        <Image src="/icon/dashboard.svg" alt="feather icon" className=" " width={20} height={20} />
                                        <p className="text-xs">Dashboard</p>
                                    </Link>
                                    <div className="flex gap-3 p-3 rounded-xl cursor-pointer text-gray-600 transition-all hover:text-gray-800 hover:bg-gray-100 items-center mb-1">
                                        <Image src="/icon/magic-pen-menu.svg" alt="feather icon" className=" " width={20} height={20} />
                                        <p className="text-xs">Stories</p>
                                    </div>
                                    {/* <div className="flex gap-3 p-3 rounded-xl cursor-pointer text-gray-600 transition-all hover:text-gray-800 hover:bg-gray-100 items-center mb-1">
                                        <Image src="/icon/book.svg" alt="feather icon" className=" " width={20} height={20} />
                                        <p className="text-xs">Articles</p>
                                    </div> */}
                                    <div className="flex gap-3 p-3 rounded-xl cursor-pointer text-gray-600 transition-all hover:text-gray-800 hover:bg-gray-100 items-center mb-1">
                                        <Image src="/icon/money.svg" alt="feather icon" className=" " width={20} height={20} />
                                        <p className="text-xs">Earnings</p>
                                    </div>
                                    <div className="flex gap-3 p-3 rounded-xl cursor-pointer text-gray-600 transition-all hover:text-gray-800 hover:bg-gray-100 items-center mb-1">
                                        <Image src="/icon/bookmark.svg" alt="feather icon" className=" " width={16} height={16} />
                                        <p className="text-xs">Bookmarks</p>
                                    </div>
                                    <div className="flex gap-3 p-3 rounded-xl cursor-pointer text-gray-600 transition-all hover:text-gray-800 hover:bg-gray-100 items-center ">
                                        <Image src="/icon/pin.svg" alt="feather icon" className=" " width={20} height={20} />
                                        <p className="text-xs">Support</p>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="grid grid-cols-7 gap-3">
                                <button 
                                onClick={() => setShowTopUpCreditModal(true)}
                                className="w-full col-span-3 py-2 font-bold flex items-center justify-center cursor-pointer text-white bg-black hover:bg-[#3f3f3f] rounded-xl gap-3">
                                    <span className='text-xs'>Topup</span>
                                    <i className="bx bx-plus text-2xl"></i>
                                </button>
                                
                                <div className="col-span-4 flex items-center gap-4 px-4 bg-[#D5DCE929] rounded-xl">
                                    <Image src="/icon/coins.svg" alt="coins icon" className=" " width={16} height={16} />                            
                                    <span className='font-bold'>{user?.credits ?? 0}</span>
                                </div>
                            </div>

                            <div className="mt-5">
                                <div className="flex items-center gap-3">
                                    <UserAvatarComponent
                                        width={36} 
                                        height={36} 
                                        borderRadius='rounded-xl'            
                                        imageUrl={ user?.imageUrl ?? "/avatar/male_avatar2.svg" }                                   
                                    />
                                    <div>
                                        <p className="font-bold text-xs">@{user?.name}</p>
                                        <p className="text-[10px] font-light capitalize text-gray-500">{user?.userType}</p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={logout} className="cursor-pointer transition-all text-[#33164C] hover:bg-[#33164C] py-2 px-3 rounded-xl flex items-center gap-3 hover:text-white mt-3 w-full">
                                <i className='bx bx-log-out text-2xl'></i>
                                <p className="text-xs">Logout</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content - takes remaining space with its own scrolling */}
                <div className="ml-64 flex-1 py-6 px-10 overflow-y-auto">{children}</div>
            </div>




            <ModalBoxComponent
                isOpen={showTopUpCreditModal}
                onClose={() => setShowTopUpCreditModal(false)}
                title="Example Modal"
                width="w-[30%]"
                useDefaultHeader={false}
            >
                <TopUpCreditComponent />
            </ModalBoxComponent>
        </div>
    )
}
