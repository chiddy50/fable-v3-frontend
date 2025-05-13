import type { Metadata } from "next";
import { Nunito_Sans, Sora } from "next/font/google";
import "./globals.css";
import { WalletComponent } from '@/components/wallet/WalletComponent';
import CustomContext from "@/context/CustomContext";
import "./css/style.css";
import "./css/loader.css";
import NextTopLoader from "nextjs-toploader";
import FullPageLoader from "@/components/shared/FullPageLoader";
import { Toaster } from "@/components/ui/sonner"
import Providers from "@/context/PrivyContext";

const nunitoSans = Nunito_Sans({
	variable: "--font-nunito-sans",
	subsets: ["latin"],
});


export const metadata: Metadata = {
	title: "Fable",
	description: "Creating better stories faster",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
				<link rel="icon" href="/logo/fable_black.png" sizes="any" />
			</head>
			<body
				className={`${nunitoSans.variable} antialiased bg-[#FBFBFB]`}
			>
				<CustomContext>
					<NextTopLoader
						color="#33164C"
						initialPosition={0.08}
						crawlSpeed={200}
						height={3}
						crawl={true}
						showSpinner={true}
						easing="ease"
						speed={200}
						shadow="0 0 10px #2299DD,0 0 5px #2299DD"
						template='<div class="bar" role="bar"><div class="peg"></div></div> 
            			<div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
						zIndex={1600}
						showAtBottom={false}
					/>
					<Providers>
					<WalletComponent>
						{children}
					</WalletComponent>
					</Providers>

					<FullPageLoader />
					<Toaster />
				</CustomContext>

			</body>
		</html>
	);
}
