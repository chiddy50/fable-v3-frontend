
"use client";

import { ArrowLeft, ArrowLeftCircle, ArrowLeftToLine, ArrowRight, ArrowRightCircle, ArrowRightToLine, Menu, Share2 } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DM_Sans, Dosis } from "next/font/google";
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
// import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { formatDate, hidePageLoader, showPageLoader } from '@/lib/helper';
import { makeRequest } from '@/services/request';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton"
import ReadChapterComponent from '@/components/ReadStory/ReadChapterComponent';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Suspense } from 'react';
import { getUserAuthParams } from '@/services/AuthenticationService';
import { AppContext } from '@/context/MainContext';

// const BlurredContent = ({ content, blurAfter, onPayment }) => {
//   const [isPaid, setIsPaid] = useState(false);

//   const handlePayment = () => {
//     // Implement your payment logic here
//     onPayment();
//     setIsPaid(true);
//   };

//   const visibleContent = content.slice(0, blurAfter);
//   const blurredContent = content.slice(blurAfter);

//   return (
//     <div className="relative">
//       <div>{visibleContent}</div>
//       {!isPaid && blurredContent && (
//         <div className="relative">
//           <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-filter backdrop-blur-md z-10"></div>
//           <div className="blur-sm">{blurredContent}</div>
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
//             <button
//               onClick={handlePayment}
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//             >
//               Pay to Continue Reading
//             </button>
//           </div>
//         </div>
//       )}
//       {isPaid && <div>{blurredContent}</div>}
//     </div>
//   );
// };

const sans = Dosis({ subsets: ['latin'] });

interface ReadStoryProps {
  params: {
    id: string;
  };
}

function MyComponent({params: {id}}: ReadStoryProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReadStoryPage id={id}/>
    </Suspense>
  );
}

const ReadStoryPage = ({id}: {id:string}) => {
  const [isPaid, setIsPaid] = useState(false);
  const [story, setStory] = useState<StoryInterface|null>(null)
  const [accessRecord, setAccessRecord] = useState(null);
  const [depositAddress, seDepositAddress] = useState(null);
  const [mounted, setMounted] = useState<boolean>(false);

  const { 
    web3auth, 
    
} = useContext(AppContext);

  // const storyId = useSearchParams().get('story-id');
  const storyId = id
  // const dynamicJwtToken = getAuthToken();
  // const { user, setShowAuthFlow } = useDynamicContext();
  const { push } = useRouter();

  const { data: storyData, isFetching, isError, refetch } = useQuery({
    queryKey: ['storyFromScratchFormData', storyId],
    queryFn: async () => {
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/story-access/read/${storyId}`;

        // const payload = await getUserAuthParams(web3auth);
        // console.log(payload);
        
        const response = await axiosInterceptorInstance.get(url);
        if (response?.data?.story) {
          setStory(response?.data?.story);
          setAccessRecord(response?.data?.accessRecord)
          seDepositAddress(response?.data?.depositAddress)
        }
        return response?.data?.story;
    },
    enabled: !!storyId && !story,
  });

  const moveToNextChapter = async (currentChapter: string) => {
    try {           
      showPageLoader();
      const updated = await axiosInterceptorInstance.put(`${process.env.NEXT_PUBLIC_BASE_URL}/story-access/move-story/${storyId}`, 
        {
          currentChapter              
        }
      )

      if (updated) {
        refetch()
      }
    } catch (error) {
        console.error(error);            
    }finally{
        hidePageLoader();
    }
  };
  
  const shareStory = async (story: StoryInterface) => {
    const url = `http://localhost:3000/read-story/${story?.id}` ?? `https://fable-v3-frontend.vercel.app/read-story/${story?.id}`;
    
    const message = `Read my latest story on Fable! `;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${message} ${encodeURIComponent(` \n\n ${url} #fable @meta_fable @getcode`)}`;
    window.open(twitterUrl, '_blank');
  }
  
  const shareBlink = (story: StoryInterface) => {      
    const url = `http://localhost:3000` ?? `https://fable-v3-frontend.vercel.app`;
    const blink = `https://dial.to/?action=solana-action:${url}/api/tip-me?storyId=${story?.id}`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(`${blink}`)}`;
    window.open(twitterUrl, '_blank');
  }
  
  return (
    <div className='pb-10'>
      {/* <div  style={{
        zIndex: "100",
      }} className="flex justify-between items-center p-5 h-[80px] bg-white overflow-hidden fixed top-0 w-full ">
        <Image src="/fable_logo.svg" alt="Fable logo" onClick={() => push("/")} className="cursor-pointer" width={100} height={100} />

        <div className="flex items-center gap-7">
          <div className="flex items-center bg-white py-2 px-3 border gap-2 rounded-3xl">
            <div className="border cursor-pointer flex items-center rounded-full hover:bg-gray-700 hover:text-white hover:border-white pr-2">                        
                <div className="h-6 w-6 rounded-full flex items-center justify-center ">
                    <i className='bx bx-copy text-xs'></i>
                </div>
                <p className="text-[9px]" id="primary-wallet-address">
                    zkdmdv...vdsmds
                </p>
            </div>
            <div className="border cursor-pointer h-6 w-6 rounded-full flex items-center justify-center hover:bg-gray-700 hover:text-white hover:border-white">
                <i className="bx bx-user text-xs"></i>
            </div>
          </div>
          <Menu />
        </div>
      </div>   */}

      {
        isFetching && !story &&
        <div className="top-[80px] relative xs:mx-7 sm:mx-7 md:mx-20 lg:mx-40 mb-20 flex justify-center">
          <Skeleton className="w-full h-[200px] rounded-xl mb-3" />
          <Skeleton className="w-full h-[200px] rounded-xl mb-3" />
          <Skeleton className="w-full h-[200px] rounded-xl " />
        </div>
      }

      {/* {
        !user && !isFetching &&
        <div className="top-[80px] relative xs:mx-7 sm:mx-7 md:mx-20 lg:mx-40 mb-20 flex justify-center">
          <Button size="lg" >Login/Register</Button>
        </div>
      } */}

      {
        !story && !isFetching &&
        <div className="top-[80px] relative xs:mx-7 sm:mx-7 md:mx-20 lg:mx-40 flex justify-center">
          <Button size="lg" onClick={() => refetch()}>Reload</Button>
        </div>
      }

      {
        story &&
        <div className="top-[80px] relative xs:mx-7 sm:mx-7 md:mx-20 lg:mx-40">

          <Breadcrumb className='mt-5 mb-5 bg-gray-100 rounded-2xl p-5'>
            <BreadcrumbList>
              <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                  <BreadcrumbPage>Story</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <ReadChapterComponent 
          moveToNextChapter={moveToNextChapter} 
          story={story} 
          accessRecord={accessRecord} 
          refetch={refetch}
          depositAddress={depositAddress}
          />   

          <div className="py-10 gap-5 flex items-center">
                    
            <div onClick={() => shareBlink(story)} className="flex gap-1 items-center cursor-pointer px-3 py-2 border border-gray-200 rounded-2xl">
              <Share2 className="w-4 h-4" />
              <span className="text-xs">Share Blink on <span className="text-md font-semibold">X</span></span>
            </div>

            <div onClick={() => shareStory(story)} className="flex gap-1 items-center cursor-pointer px-3 py-2 border border-gray-200 rounded-2xl">
              <Share2 className="w-4 h-4" />
              <span className="text-xs">Post on <span className="text-md font-semibold">X</span></span>
            </div>
          </div>       

        </div>
      }

    </div>
  );
};

export default MyComponent;