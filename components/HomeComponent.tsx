"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/images/logo.png"
import { Button } from "@/components/ui/button";
import StoryWriter from "@/components/StoryWriter";
import { BookOpen, CoinsIcon, FilmIcon, LogIn, LogOut, Menu, MessageSquare, Share2, ThumbsUp } from "lucide-react";
import { getAuthToken, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StoryInterface } from "@/interfaces/StoryInterface";
import { formatDate, trimWords } from "@/lib/helper";
import { Skeleton } from "@/components/ui/skeleton";
import AuthenticationButton from "@/components/AuthenticationButton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const HomeComponent = () => {
    const [publishedStories, setPublishedStories] = useState<StoryInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [initialFetchDone, setInitialFetchDone] = useState(false);

    const { user, primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext()
    const { push } = useRouter();
    const dynamicJwtToken = getAuthToken();
  
    const moveToDashboard = () => {
      if (!user) {
        window.localStorage.setItem('redirectRoute', "/dashboard/stories");
        setShowAuthFlow(true) 
        return
      }
  
      push("/dashboard/stories")
    }


    useEffect(() => {
        if (publishedStories.length < 1) {
            
            fetchStories();
        }
        if (user) {
            // fetch continue to read books
        }

    }, []);

    const fetchStories = async () => {
        try {
          let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/all`;
          setLoading(true)
          const res = await fetch(url, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              }
          });
    
          const json = await res.json();
          console.log(json);
          let data = json?.stories;
          if (data) {
            setPublishedStories(data);
          }
        } catch (error) {
          console.error(error);      
        }finally{
          setLoading(false)
        }
    }

    const moveToReadStory = (storyId: string) => {
        let redirectRoute = `/read-story/${storyId}`;
        if (!user) {
          window.localStorage.setItem('redirectRoute', redirectRoute);
          setShowAuthFlow(true);
          return;
        }
        push(`/read-story/${storyId}`);
    }

    const generateShareLink = (hashtags, via, solanaBlink, solanaAction) => {
      const encodedTitle = encodeURIComponent(title);
      const encodedUrl = encodeURIComponent(url);
      const encodedHashtags = hashtags.join(',');
      
      let shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
      
      if (hashtags.length > 0) {
        shareUrl += `&hashtags=${encodedHashtags}`;
      }
      
      if (via) {
        shareUrl += `&via=${via}`;
      }
      
      // Add Solana blink and action as URL parameters
      if (solanaBlink) {
        shareUrl += `&solana_blink=${encodeURIComponent(solanaBlink)}`;
      }
      
      if (solanaAction) {
        shareUrl += `&solana_action=${encodeURIComponent(solanaAction)}`;
      }
      
      return shareUrl;
    };
  
    // const solanaBlinkLink = `${process.env.NEXT_PUBLIC_URL}/read-story/${story.id}?action=buyNFT`;
    const shareStory = async (story: StoryInterface) => {
      console.log(story);
      
      const url = `https://fable-v3-frontend.vercel.app/`;
      try {
        const blink = `https://dial.to/?action=solana-action:${url}/api/tip-me?storyId=${story?.id}`;
        console.log(blink);

        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(`${blink}`)}`;
        window.open(twitterUrl, '_blank');

      } catch (error) {
        console.error(error);        
      }
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
          {/* <Menu /> */}
          <AuthenticationButton />
        </div>   

        <div style={{
          zIndex: "99",
        }}>
          <h1 className="text-custom_green text-center mt-20 font-bold tracking-wider xs:text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-6xl xs:px-5 sm:px-5 md:px-5 lg:px-1 xl:px-1">Unleash Your Creativity With Fable</h1>   
          <p className="my-10 text-lg text-center font-light text-gray-500 tracking-wider xs:px-5 sm:px-5 md:px-0">
          Craft, Modify and Generate Stories with the Power of AI
          </p>
          <div className="flex mt-10 justify-center">
            <Button
            onClick={moveToDashboard} 
            className="bg-custom_green text-white tracking-wider text-md" size="lg">Start writing for free</Button>
          </div>
        </div>

      </div>

      <div className="mt-40 mb-10">

        <div className=" mx-auto xs:px-5 sm:px-5 md:px-10 lg:px-20">
          <h1 className="mb-10 text-gray-600 xs:text-3xl sm:text-3xl text-4xl font-bold">
            Checkout these stories..
          </h1>
          {/* <div className="mb-10 border-b border-gray-200 text-sm gap-5 flex items-end">
            <p className="border-b-4 cursor-pointer border-gray-600">Books</p>
            <p className="border-b-4 cursor-pointer border-white">Stories</p>
          </div> */}

          {loading && 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            <Skeleton className="w-full h-[190px] rounded-xl" />
            <Skeleton className="w-full h-[190px] rounded-xl" />
            <Skeleton className="w-full h-[190px] rounded-xl" />
            <Skeleton className="w-full h-[190px] rounded-xl" />
          </div>}
            
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {!loading && publishedStories?.filter(story => story.publishedAt).map((story, index) => (

              <div key={index} className="p-5 flex flex-col justify-between w-full bg-[#F2F8F2] rounded-lg border">
                <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-semibold">{story?.publishedAt ? formatDate(story?.publishedAt) : ""}</p>
                <p className="font-bold text-[10px]">5 min read</p>
                </div>
                <h1 className="font-bold text-xl capitalize mb-3">{story?.projectTitle.slice(0, 14)}...</h1>
                <p className="font-light mt-2 text-[10px] capitalize">By {story?.user?.name}</p>
                {/* <div className="font-semibold mt-2 text-[10px] capitalize flex flex-wrap gap-2">
                {
                    story?.genres?.map((genre, index) => (
                        <p key={index} className="px-4 py-1 border rounded-2xl bg-gray-50">{genre}</p>
                    ))
                }
                </div> */}

                <div className="font-semibold mt-2 text-[10px]">
                  {story?.genres?.join(" | ")}
                </div>
                {/* <p className="mt-5 text-xs text-gray-600">
                { trimWords(story?.projectDescription, 15)}
                </p> */}
                <div className="mt-4">
                {
                    !story?.introductionImage && <img src="/no-image.png" alt="walk" className="w-full h-[200px] rounded-xl object-cover" />
                }
                {
                    story?.introductionImage && <img src={story?.introductionImage} alt="walk" className="w-full h-[200px] rounded-xl object-cover" />
                }
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <Button onClick={() => moveToReadStory(story?.id)} size="sm" variant="outline">
                    Read
                    <BookOpen className="w-4 h-4 ml-2"/>
                  </Button>

                  <div className="flex gap-4 items-center"> 
                    {/* <a 
                    // href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_URL}/read-story/${story.id}&solanaAction=solanaActionId`)}`}
                    href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20story%20with%20Solana%20Blinks!%20${encodeURIComponent(`${process.env.NEXT_PUBLIC_URL}/read-story/${story.id}?action=buyNFT`)}`} 

                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    </a>                  */}
                      <div onClick={() => shareStory(story)} className="flex gap-1 items-center cursor-pointer">
                        <Share2 className="w-4 h-4" />
                        <span className="text-xs">Share on <span className="text-md font-semibold">X</span></span>
                      </div>
                      {/* <div className="flex gap-1 items-center">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-[10px]">30</span>
                      </div>

                      <div className="flex gap-1 items-center">
                      <ThumbsUp className="w-4 h-4"/>
                      <span className="text-[10px]">3</span>
                      </div> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        
        </div>
      </div>
      

    </main>
    )
}

export default HomeComponent
