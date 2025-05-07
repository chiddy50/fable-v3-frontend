"use client";

import { ReaderMobileSideBar } from "@/components/navigation/ReaderMobileSideBar";
import { AppContext } from "@/context/MainContext";
import { ArrowLeft, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";


export default function Layout1({
	children,
}: {
	children: React.ReactNode
}) {

	const { user, mobileSideNavIsOpen, setMobileSideNavIsOpen } = useContext(AppContext)

	return (
		<>
			<div style={{ display: 'flex', height: '100vh' }} className='min-h-screen '>
				<div className="left-menu py-10 px-4 bg-white w-[120px] hidden lg:block xl:block">
					{/* Your left menu content here */}


					<div className="w-full flex justify-center mb-10">
						<Link href="/" className=''>
							<Image src="/logo/fable_black.png" alt="Fable logo" className="rounded-xl" width={60} height={60} />
						</Link>
					</div>

					<div className="w-full flex justify-center">
						<Link href="/dashboard" className='flex cursor-pointer items-center gap-3 bg-[#f6f6f6] rounded-xl p-5 hover:bg-gray-200'>
							<Image src="/icon/feather.svg" alt="feather icon" className=" " width={20} height={20} />
						</Link>
					</div>
				</div>
				<div className="main-content relative flex flex-col flex-1 bg-[#FBFBFB]" >

					{children}
				</div>
			</div>

			<ReaderMobileSideBar />
		</>
	);
}