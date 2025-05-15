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
import { usePrivy, useLoginWithOAuth, useLogin } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation'
import axios from "axios"
import { usePathname } from 'next/navigation'

interface PrivyLoginInterface{
	id: string;
	google: {
		name: string;
		email: string;
		subject: string;
	}
}


const ReaderSideBarContent = () => {

    const { user } = useContext(AppContext)

    const [showTopUpTooltip, setShowTopUpTooltip] = useState<boolean>(false)
    const [showLogoutTooltip, setShowLogoutTooltip] = useState<boolean>(false)
    const [showLoginTooltip, setShowLoginTooltip] = useState<boolean>(false)
    const [showDashboardTooltip, setShowDashboardTooltip] = useState<boolean>(false)
    const [showHomeTooltip, setShowHomeTooltip] = useState<boolean>(false)

	const { getAccessToken, ready, authenticated, logout } = usePrivy();

    const { state, loading, initOAuth } = useLoginWithOAuth({
        onComplete: ({ user, isNewUser }) => {
			console.log('User logged in successfully', user, {isNewUser});
			
			if (isNewUser) {
				authenticateUser(user, "register", isNewUser)
                // Perform actions for new users
				console.log("A new user has to be created")
				
				// redirect to on-boarding screen
				
            }else{
				authenticateUser(user, "login", isNewUser)
				// redirect to dashboard
				return

			}
        },
        onError: (error) => {
            console.error('Login failed', error);
        },
    });

    const router = useRouter();
    const pathname = usePathname()

    console.log({pathname})
    

    const logoutUser = async () => {
        await logout();
        localStorage.removeItem("user") 
        // window.location.href = pathname;
    }

    const authenticateUser = async (user: PrivyLoginInterface, route: string, isNewUser: boolean) => {
		try{
			const authToken = await getAccessToken();

			let payload = {
				privyId: user?.id,
				name: user?.google?.name,
				email: user?.google?.email,
			}

			const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/auth/${route}`, 
				payload,
				{
					headers: {
						Authorization: `Bearer ${authToken}`
					}
				}
			);

			console.log(res)
			let userResponse = res?.data?.user;
			let userStored = localStorage.getItem("user");
			console.log("Store the user")
			localStorage.setItem("user", JSON.stringify(userResponse)); 

			const redirectUrl = isNewUser ? "/on-boarding" : "/";
			router.push(pathname);

		}catch(e){
			console.error(e)
		}
	}

    const handleLogin = async () => {
		try {
			// The user will be redirected to OAuth provider's login page
			await initOAuth({ provider: 'google' });
		} catch (err) {
			// Handle errors (network issues, validation errors, etc.)
			console.error(err);
		}
	};


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
                    !authenticated &&
                    <div
                        onMouseEnter={() => setShowLoginTooltip(true)}
                        onMouseLeave={() => setShowLoginTooltip(false)}
                        onClick={handleLogin} className='relative flex cursor-pointer items-center justify-center gap-3 text-white rounded-xl w-[40px] h-[40px] px-3 py-4 transition-all bg-[#5D4076] hover:text-white hover:bg-[#412e52]'>
                        <LogIn size={20} />
                        <TooltipComponent showTooltip={showLoginTooltip} text="Login" />
                    </div>
                }

            </div>
        </div>
    )
}

export default ReaderSideBarContent
