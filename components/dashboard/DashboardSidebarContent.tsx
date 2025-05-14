"use client"


import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import CollapsibleSectionComponent from '@/components/navigation/CollapsibleSectionComponent';
import { UserAvatarComponent } from '@/components/shared/UserAvatarComponent';
import { AppContext } from '@/context/MainContext';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';


const DashboardSidebarContent = () => {

    const { user, setUser, setShowTopUpCreditModal } = useContext(AppContext)
	const { ready, authenticated, logout } = usePrivy();
    const router = useRouter();

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

    const logoutUser = async () => {
        await logout();
        localStorage.removeItem("user") 
        // router.push("/")
        window.location.href = '/';
    }

    return (
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
                    <Link href="/dashboard/user" className="flex items-center cursor-pointer gap-3">
                        <UserAvatarComponent
                            width={36}
                            height={36}
                            borderRadius='rounded-xl'
                            imageUrl={user?.imageUrl ?? "/avatar/default-avatar.png"}
                        />
                        <div>
                            <p className="font-bold text-xs">@{user?.name}</p>
                            <p className="text-[10px] font-light capitalize text-gray-500">{user?.userType === "both" ?  "Reader & Creator" : user?.userType}</p>
                        </div>
                    </Link>
                </div>

                <button onClick={logoutUser} className="cursor-pointer transition-all text-[#33164C] hover:bg-[#33164C] py-2 px-3 rounded-xl flex items-center gap-3 hover:text-white mt-3 w-full">
                    <i className='bx bx-log-out text-2xl'></i>
                    <p className="text-xs">Logout</p>
                </button>
            </div>
        </div>
    )
}

export default DashboardSidebarContent
