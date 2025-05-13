"use client"

import { ReaderMobileSideBar } from "@/components/navigation/ReaderMobileSideBar";
import { TooltipComponent } from "@/components/shared/TooltipComponent";
import { UserAvatarComponent } from "@/components/shared/UserAvatarComponent";
import UserAvatarWithTooltip from "@/components/shared/UserAvatarWithTooltip";
import { AppContext } from "@/context/MainContext";
import { ArrowLeft, LogIn, LogOut, Menu, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { usePrivy } from '@privy-io/react-auth';


const ReaderSideBarContent = () => {

    const { user } = useContext(AppContext)

    const [showTopUpTooltip, setShowTopUpTooltip] = useState<boolean>(false)
    const [showLogoutTooltip, setShowLogoutTooltip] = useState<boolean>(false)
    const [showLoginTooltip, setShowLoginTooltip] = useState<boolean>(false)
    const [showDashboardTooltip, setShowDashboardTooltip] = useState<boolean>(false)
    const [showHomeTooltip, setShowHomeTooltip] = useState<boolean>(false)

    const { ready, authenticated, logout } = usePrivy();

    const logoutUser = () => {
        logout();
        // router.push("/")
        window.location.href = '/';
    }
    return (
        <div className="flex flex-col justify-between bg-white w-full h-full">
            {/* Your left menu content here */}

            <div className="">
                <div
                    onMouseEnter={() => setShowHomeTooltip(true)}
                    onMouseLeave={() => setShowHomeTooltip(false)}
                    className="w-full relative flex justify-center mb-7">
                    <Link href="/" className='flex cursor-pointer items-center justify-center w-full '>
                        <Image src="/logo/fable_black.png" alt="Fable logo" className="rounded-xl w-full" width={45} height={45} />
                    </Link>
                    <TooltipComponent showTooltip={showHomeTooltip} text="Home" />
                </div>
                {authenticated &&
                    <div
                        onMouseEnter={() => setShowDashboardTooltip(true)}
                        onMouseLeave={() => setShowDashboardTooltip(false)}
                        className="w-full relative flex justify-center">
                        <Link href="/dashboard" className='flex cursor-pointer items-center justify-center gap-3 rounded-xl w-full px-3 py-4 hover:bg-gray-200'>
                            <Image src="/icon/feather.svg" alt="feather icon" className=" " width={17} height={17} />
                        </Link>
                        <TooltipComponent showTooltip={showDashboardTooltip} text="Dashboard" />
                    </div>
                }

            </div>

            <div className="flex flex-col items-center gap-5 mb-5">

                {
                    !authenticated &&
                    <UserAvatarWithTooltip
                        user={null}
                        size={40}
                        tooltipDistance={12}
                    />
                }

                {
                    authenticated &&
                    <Link href="/creator">
                        <UserAvatarWithTooltip
                            user={user}
                            size={40}
                            tooltipDistance={12}
                        />
                    </Link>
                }

                {authenticated &&

                    <>
                        <div
                            onMouseEnter={() => setShowTopUpTooltip(true)}
                            onMouseLeave={() => setShowTopUpTooltip(false)}
                            className='flex relative cursor-pointer items-center justify-center bg-black text-white gap-3 rounded-xl w-[40px] h-[40px] px-3 py-4'>
                            <Plus size={20} />
                            <TooltipComponent showTooltip={showTopUpTooltip} text="TopUp credit" />
                        </div>

                        <div
                            onMouseEnter={() => setShowLogoutTooltip(true)}
                            onMouseLeave={() => setShowLogoutTooltip(false)}
                            onClick={logoutUser} className='relative flex cursor-pointer items-center justify-center gap-3 rounded-xl w-[40px] h-[40px] px-3 py-4 transition-all hover:text-white hover:bg-[#5D4076]'>
                            <LogOut size={20} />
                            <TooltipComponent showTooltip={showLogoutTooltip} text="Logout" />
                        </div>
                    </>
                }

                {
                    <div
                        onMouseEnter={() => setShowLoginTooltip(true)}
                        onMouseLeave={() => setShowLoginTooltip(false)}
                        onClick={logoutUser} className='relative flex cursor-pointer items-center justify-center gap-3 text-white rounded-xl w-[40px] h-[40px] px-3 py-4 transition-all bg-[#5D4076] hover:text-white hover:bg-[#412e52]'>
                        <LogIn size={20} />
                        <TooltipComponent showTooltip={showLoginTooltip} text="Login" />
                    </div>
                }

            </div>
        </div>
    )
}

export default ReaderSideBarContent
