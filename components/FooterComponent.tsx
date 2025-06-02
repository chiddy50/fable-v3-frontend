import React from 'react'
import Image from "next/image";
import Link from 'next/link';

const FooterComponent = () => {
	return (
		<footer className="flex flex-col justify-between relative mt-3 bg-black text-white h-90 sm:h-100 rounded-t-sm sm:rounded-[50%_50%_25%_25%_/_79%_79%_0%_0%] p-6 overflow-hidden">

			<div className="z-2">
				<div className="flex justify-center mt-7">
					<p className="text-4xl font-bold">Get Creating!</p>
				</div>
				<div className="flex flex-col mt-3 gap-1 text-xs justify-center items-center">
					{/* <p>Fable accelerates your storytelling journey with AI and blockchain.</p>s */}
					<p>Unlock creativity, trade assets, and earn seamlessly.</p>
				</div>
			</div>

			<div className="mt-10 p-5 flex flex-col gap-5 sm:gap-0 sm:flex-row justify-between items-center text-xs z-2">
				<ul className="flex items-center gap-4">
					<li>Terms</li>
					<li>Privacy Policy</li>
					<li>Contact Us</li>
				</ul>

				<div className="flex items-center gap-4">
					<Link href="https://x.com/meta_fable" target='_blank' className="bg-[#D8D1DE] p-3 rounded-xl cursor-pointer w-[39px] h-[39px] flex items-center justify-center">
						<Image src="/icon/x.svg" alt="x logo" className="" width={17} height={17} />
					</Link>
					<Link href="https://discord.gg/bBeUY5ws" target='_blank' className="bg-[#D8D1DE] p-3 rounded-xl cursor-pointer w-[39px] h-[39px] flex items-center justify-center">
						<Image src="/icon/discord.svg" alt="x logo" className="" width={15} height={15} />
					</Link>
					{/* <Link href="" target='_blank' className="bg-[#D8D1DE] p-3 rounded-xl cursor-pointer">
						<Image src="/icon/instagram.svg" alt="x logo" className="" width={15} height={15} />
					</Link> */}
				</div>

				<p>©Fable. All rights reserved.</p>
			</div>

			<img src="/img/bg_fable.svg" alt="fable background" className="absolute object-cover bottom-0 left-0 w-full z-0 opacity-[0.17]" />
			{/* <img src="/img/fable-footer-logo.svg" alt="fable logo" className="absolute bottom-0 left-0 w-[86%] z-1" />         */}
			<img
				src="/img/fable-footer-logo.svg"
				alt="fable logo"
				className="absolute bottom-0 left-1/2 w-[868%] z-1 transform -translate-x-1/2"
			/>

		</footer>
	)
}

export default FooterComponent
