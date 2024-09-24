"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/images/logo.png"
import { Button } from "@/components/ui/button";
import StoryWriter from "@/components/StoryWriter";
import { BookOpen, CoinsIcon, FilmIcon, Menu, MessageSquare, ThumbsUp } from "lucide-react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext()

  const { push } = useRouter();

  const moveToDashboard = () => {
    if (!user) {
      setShowAuthFlow(true) 
      return
    }

    push("/dashboard")

  }

  return (
    <main className="flex-1 " >         
       
      <div
        className="flex flex-col flex-grow h-svh top-[80px] bg-[#F2F8F2]"
        style={{
          position: "relative",
        }}
      >
        {/* <Image src="/write_create_hand.svg" className="absolute top-0 left-0 w-full " alt='Cover Image' width={500} height={500}/> */}
        <Image src="/write_create_hand.svg" priority={true} className="bg-img " alt='Cover Image' width={500} height={500}/>

        <div  style={{
          zIndex: "100",
        }} className="flex justify-between p-5 h-[80px] overflow-hidden bg-[#F2F8F2] fixed top-0 w-full ">
          <Image src="/fable_logo.svg" alt="Fable logo" className=" " width={100} height={100} />
          <Menu />
        </div>   

        <div style={{
          zIndex: "99",
        }}>
          <h1 className="text-custom_green text-6xl text-center mt-20 font-bold tracking-wider">Unleash Your Creativity With Fable</h1>   
          <p className="my-10 text-lg text-center font-light text-gray-500 tracking-wider">
          Craft, Modify and Generate Stories with the Power of AI
          </p>
          <div className="flex mt-10 justify-center">
            <Button
            onClick={moveToDashboard} 
            className="bg-custom_green text-white tracking-wider" size="lg">Start writing for free</Button>
          </div>
        </div>

      </div>

      <div className="mt-40 mb-10">
        <div className="px-20 mx-auto">

          <div className="mb-7 border-b border-gray-200 gap-5 flex items-end">
            <p className="border-b-4 cursor-pointer border-gray-600">Books</p>
            <p className="border-b-4 cursor-pointer border-white">Stories</p>
          </div>

          <div className="p-5 w-full bg-[#F2F8F2] grid grid-cols-6 gap-5 rounded-lg border">

            <div className=" col-span-4">
              <p className="text-sm font-semibold mb-1">SEP, 17 2024</p>
              <h1 className="font-bold text-3xl">Exclusive SolMap Airdrop for Subscribers</h1>
              <p className="font-light mt-2 text-xs">By Nova Ben</p>
              <p className="mt-5 text-gray-600">
              Celebrate OpenSolMapScan's launch with our giveaway! Access Protocol subscribers can win SolMaps by participating before February 10!
              Celebrate OpenSolMapScan's launch with our giveaway! 
              </p>

              <div className="mt-2 flex justify-between items-center">
                <p className="font-bold text-sm">5 min read</p>

                <div className="flex gap-4 items-center">                  

                  <div className="flex gap-1 items-center">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs">30</span>
                  </div>

                  <div className="flex gap-1 items-center">
                    <ThumbsUp className="w-4 h-4"/>
                    <span className="text-xs">3</span>
                  </div>
                </div>
              </div>
            </div>

            <div className=" col-span-2 h-full w-full bg-gray-800 rounded-2xl">
              {/* <Image src="/no-image.png" alt="no-image" width={300} height={300} className=" object-cover w-full h-full" /> */}
            </div>
          </div>
        
        </div>
      </div>
      

    </main>
  );
}
