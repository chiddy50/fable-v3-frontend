"use client";

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
import ReaderSideBarContent from "@/components/navigation/ReaderSideBarContent";
import LoaderComponent from "@/components/shared/LoaderComponent";


export default function Layout1({
	children,
}: {
	children: React.ReactNode
}) {

	const { user } = useContext(AppContext)

	const [showTopUpTooltip, setShowTopUpTooltip] = useState<boolean>(false)
	const [showLogoutTooltip, setShowLogoutTooltip] = useState<boolean>(false)
	const [showLoginTooltip, setShowLoginTooltip] = useState<boolean>(false)
	const [showDashboardTooltip, setShowDashboardTooltip] = useState<boolean>(false)
	const [showHomeTooltip, setShowHomeTooltip] = useState<boolean>(false)

	const { ready } = usePrivy();

  if (!ready) {
		return (
			<LoaderComponent />
		);
	}

	
	return (
		<>
			<div style={{ display: 'flex', height: '100vh' }} className='min-h-screen '>
				<div className="hidden lg:block xl:block pt-10 mb-5 px-5 w-[100px]">
					<ReaderSideBarContent />
				</div>
				<div className="relative flex flex-col flex-1 bg-[#FBFBFB]">
					{children}
				</div>
			</div>

			<ReaderMobileSideBar />
		</>
	);
}