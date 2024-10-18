"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/images/logo.png"
import { Button } from "@/components/ui/button";
import StoryWriter from "@/components/StoryWriter";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { StoryInterface } from "@/interfaces/StoryInterface";
import { formatDate, shareStory, trimWords } from "@/lib/helper";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from "@/context/MainContext";
import ContinueReadingComponent from "./ReadStory/ContinueReadingComponent";
import axiosInterceptorInstance from "@/axiosInterceptorInstance";
import code from '@code-wallet/elements';

const HomeComponent = () => {
    const [publishedStories, setPublishedStories] = useState<StoryInterface[]>([]);
    const [continueStories, setContinueStories] = useState<[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [initialFetchDone, setInitialFetchDone] = useState(false);

    const { 
        loggedIn, setLoggedIn,
        isLoggedIn, setIsLoggedIn,        
    } = useContext(AppContext);

    const { push, refresh } = useRouter();
  
    const moveToDashboard = () => {  
      push("/dashboard/stories")
    }

    // GET CODE LOGIN START
    const [loginAuth, setLoginAuth] = useState<{ verifier: string, domain: string }|null>(null);

    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchAuthData();        
    }, []);

    useEffect(() => {
        setIsMounted(true);
        if(loginAuth && isMounted ){
            let token = sessionStorage.getItem("token");   

            setIsLoggedIn(token ? true : false);

            if (!token) {                
                const { button } = code.elements.create('button', {
                    mode: 'login',
                    login: {
                        verifier: loginAuth?.verifier,  
                        domain: loginAuth?.domain // "usefable.xyz"
                    },
                    // appearance: window.localStorage.getItem("joy-mode") == "light" ? "dark" : "light",
                    confirmParams: {
                        success: { url: `${process.env.NEXT_PUBLIC_URL}/login-success/{{INTENT_ID}}` }, 
                        cancel: { url: `${process.env.NEXT_PUBLIC_URL}/`, },
                    },
                });
                
                if (button && !token) {      
                    button?.mount(el?.current!);
    
                    button.on('invoke', async () => {
                        // Get a payment intent clientSecret value from server.js
                        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/create-intent`);
                        console.log(res);
                        
                        const clientSecret = res?.data?.clientSecret;
                        button.update({ clientSecret });                
                    });
        
                }
            }
            
        }
    }, [loginAuth, isMounted]);
    // GET CODE LOGIN END


    useEffect(() => {
        if (publishedStories.length < 1) {            
            fetchStories();
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

            if (isLoggedIn) {            
                const allContinueStories = await getStartedStories();
            }

        } catch (error) {
          console.error(error);      
        }finally{
          setLoading(false)
        }
    }

    const getStartedStories = async () => {
        const token = sessionStorage.getItem('token'); 
        if (!token) {
           return; 
        }
        const response = await axiosInterceptorInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/story-access/continue`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(response);
        const stories = response?.data?.stories ?? [];
        
        setContinueStories(stories);
    }

    const fetchAuthData = async () => {
        let response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/get-verifier`);
        console.log(response);

        if (!response) {
            throw new Error("Network response was not ok");
        }
        const data: { verifier: string, domain: string } = response?.data;
        setLoginAuth(data);        
    }

    const moveToReadStory = async (storyId: string) => {
        // let redirectRoute = `/read-story/${storyId}`;
        // if (!loggedIn) {
        //   window.localStorage.setItem('redirectRoute', redirectRoute)
        //   return;
        // }
        push(`/read-story/${storyId}`);
        // window.location.href = `/read-story/${storyId}`
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
    
    const shareBlink = (story: StoryInterface) => {      
        const url = `${process.env.NEXT_PUBLIC_URL}`;

        const blink = `https://dial.to/?action=solana-action:${url}/api/tip-me?storyId=${story?.id}`;
        
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(`${blink}`)}`;
        window.open(twitterUrl, '_blank');
    }
    
    const handleScroll = (e) => {
        e.preventDefault();
        const element = document.getElementById('published-content');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

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

          

          <div style={{
            zIndex: "99",
          }}>
            <h1 className="text-custom_green text-center mt-20 font-bold tracking-wider xs:text-3xl sm:text-3xl md:text-6xl  xs:px-5 sm:px-5 md:px-5 lg:px-1 xl:px-1">Unleash Your Creativity With Fable</h1>   
            <p className="my-10 text-lg text-center text-gray-700 tracking-wider xs:px-5 sm:px-5 md:px-0">
            Craft, Modify and Generate Stories with the Power of AI
            </p>
            <div className="flex mt-10 justify-center">
                
                {isLoggedIn && 
                    <div className="flex flex-col gap-6">
                        <Button
                        onClick={moveToDashboard} 
                        className="bg-custom_green text-white tracking-wider text-md" size="lg">
                        Start writing for free
                        </Button>
                        <Button onClick={handleScroll} className="text-md" size="lg">
                            Explore
                            <i className='bx bx-chevrons-down bx-tada text-4xl'  ></i>
                        </Button>
                    </div>
                }
              {/* {!loggedIn && <Button
              onClick={login} 
              className="bg-custom_green text-white tracking-wider text-md" size="lg">Start writing for free</Button>} */}
                <div ref={el} />

            </div>
          </div>

        </div>

        {
            isLoggedIn &&
            <div className="mt-40 mb-10">
                <div className=" mx-auto xs:px-5 sm:px-5 md:px-10 lg:px-20">
                    
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

                    {
                        !loading && continueStories?.length > 0 && 
                        <div>
                            <h1 className="mb-5 text-gray-600 xs:text-3xl sm:text-3xl text-4xl font-bold">
                            Continue reading
                            </h1>
                            <ContinueReadingComponent continueStories={continueStories} moveToReadStory={moveToReadStory}/>
                        </div>
                    }
                    
                    {
                        !loading && 
                        <div id="published-content">
                            <h1 className="mb-5 text-gray-600 xs:text-3xl sm:text-3xl text-4xl font-bold">
                            Checkout these stories..
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                            {publishedStories?.filter(story => story.publishedAt).map((story, index) => (

                                <div key={index} className="p-5 flex flex-col justify-between w-full bg-gray-800 text-gray-50 rounded-lg border">
                                <div className="flex justify-between items-center mb-1">
                                <p className="text-xs font-semibold">{story?.publishedAt ? formatDate(story?.publishedAt) : ""}</p>
                                <p className="font-bold text-[10px]">5 min read</p>
                                </div>
                                <h1 className="font-bold text-xl capitalize mb-3">{story?.projectTitle}</h1>
                                <p className="font-light mt-2 text-xs capitalize">By {story?.user?.name}</p>

                                <div className="font-semibold mt-2 text-[10px]">
                                    {story?.genres?.join(" | ")}
                                </div>
                                
                                <div className="mt-4">
                                {
                                    !story?.introductionImage && <img src="/no-image.png" alt="walk" className="w-full h-[200px] rounded-xl object-cover" />
                                }
                                {
                                    story?.introductionImage && <img src={story?.introductionImage} alt="walk" className="w-full h-[200px] rounded-xl object-cover" />
                                }
                                </div>
                                <p className="mt-5 text-xs text-gray-50">
                                { story?.overview?.slice(0, 200)}...
                                </p>

                                <div className="mt-4 flex justify-between items-center">
                                    <Button onClick={() => moveToReadStory(story?.id)} size="sm" className="text-gray-700" variant="outline">
                                    Read
                                    <BookOpen className="w-4 h-4 ml-2"/>
                                    </Button>

                                
                                </div>
                                
                                <div className="mt-4 flex justify-between items-center">
                                    
                                    <div onClick={() => shareBlink(story)} className="flex gap-1 items-center cursor-pointer px-3 py-2 border border-gray-200 rounded-2xl">
                                    {/* <Share2 className="w-4 h-4" /> */}
                                    <span className="text-xs">Share Blink on</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="w-4 h-4"><path fill="#fff" d="M13.346 10.932 18.88 4.5h-1.311l-4.805 5.585L8.926 4.5H4.5l5.803 8.446L4.5 19.69h1.311l5.074-5.898 4.053 5.898h4.426zM11.55 13.02l-.588-.84-4.678-6.693h2.014l3.776 5.4.588.842 4.907 7.02h-2.014z"></path></svg>
                                    </div>

                                    <div onClick={() => shareStory(story)} className="flex gap-1 items-center cursor-pointer px-3 py-2 border border-gray-200 rounded-2xl">
                                        {/* <Share2 className="w-4 h-4" /> */}
                                        <span className="text-xs">Post on </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="w-4 h-4"><path fill="#fff" d="M13.346 10.932 18.88 4.5h-1.311l-4.805 5.585L8.926 4.5H4.5l5.803 8.446L4.5 19.69h1.311l5.074-5.898 4.053 5.898h4.426zM11.55 13.02l-.588-.84-4.678-6.693h2.014l3.776 5.4.588.842 4.907 7.02h-2.014z"></path></svg>

                                    </div>
                                </div>

                                </div>
                            ))}
                            </div>
                        </div>
                    }
                
                </div>
            </div>
        }
        

      </main>
    )
}

export default HomeComponent
