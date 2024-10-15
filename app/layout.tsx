import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import "./css/style.css";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import FullPageLoader from "@/components/FullPageLoader";
import CustomContext from "@/context/CustomContext";
import 'intro.js/introjs.css';
import { cn } from "@/lib/utils";
import AuthenticationButton from "@/components/AuthenticationButton";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});
export const metadata: Metadata = {
  title: "Fable",
  description: "An AI powered app that accelerates creativity for writers and brands",
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
        <link rel="icon" href="/images/fable_black.png" sizes="any" />
      </head>
      <body className={cn(
        "flex flex-col min-h-screen",
        montserrat.className
        )}>
      <CustomContext>        

        <div  style={{
          zIndex: "100",
        }} className="flex justify-between p-5 h-[80px] overflow-hidden bg-[#F2F8F2] fixed top-0 w-full ">
          <Link href="/" className="cursor-pointer"> 
          <Image src="/fable_logo.svg" alt="Fable logo" className=" " width={100} height={100} />
          </Link>
          {/* <Menu /> */}
          <AuthenticationButton />
        </div>   
        {children}

        {/* Toaster */ }
        <Toaster duration={4000} position="top-right" richColors/>


        <FullPageLoader />
      </CustomContext>        

      </body>
    </html>
  );
}
