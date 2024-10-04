"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpen, CoinsIcon, FilmIcon, LogIn, LogOut, Menu, MessageSquare, ThumbsUp } from "lucide-react";
import { getAuthToken, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StoryInterface } from "@/interfaces/StoryInterface";
import { formatDate, trimWords } from "@/lib/helper";
import { Skeleton } from "@/components/ui/skeleton";
import AuthenticationButton from "@/components/AuthenticationButton";

const HomeComponent = () => {
    const [publishedStories, setPublishedStories] = useState<StoryInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const { user, setShowAuthFlow } = useDynamicContext()
    const { push } = useRouter();
  
    const moveToDashboard = () => {
      if (!user) {
        window.localStorage.setItem('redirectRoute', "/dashboard/stories");
        setShowAuthFlow(true) 
        return
      }
  
      push("/dashboard/stories")
    }

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
          setLoading(true)
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/stories/all`);
          const json = await res.json();
          let data = json?.stories;
          if (data) {
            setPublishedStories(data);
          }
        } catch (error) {
          console.error(error);      
        } finally {
          setLoading(false)
        }
    }

    const moveToReadStory = (storyId: string) => {
        let redirectRoute = `/read-story?story-id=${storyId}`;
        if (!user) {
          window.localStorage.setItem('redirectRoute', redirectRoute);
          setShowAuthFlow(true);
          return;
        }
        push(`/read-story?story-id=${storyId}`);
    }
    
    return (
        <main className="flex-1">         
       
      <div className="flex flex-col flex-grow h-svh top-[80px] bg-[#F2F8F2] relative">
        <Image src="/write_create_hand.svg" priority={true} className="bg-img" alt='Cover Image' width={500} height={500}/>

        <div className="flex justify-between p-5 h-[80px] overflow-hidden bg-[#F2F8F2] fixed top-0 w-full z-[100]">
          <Image src="/fable_logo.svg" alt="Fable logo" width={100} height={100} />
          <AuthenticationButton />
        </div>   

        <div className="z-[99]">
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
        <div className="mx-auto xs:px-5 sm:px-5 md:px-10 lg:px-20">
          <h1 className="mb-10 text-gray-600 xs:text-3xl sm:text-3xl text-4xl font-bold">
            Checkout these stories..
          </h1>

          {loading && 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            <Skeleton className="w-full h-[190px] rounded-xl" />
            <Skeleton className="w-full h-[190px] rounded-xl" />
            <Skeleton className="w-full h-[190px] rounded-xl" />
            <Skeleton className="w-full h-[190px] rounded-xl" />
          </div>}
            
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {!loading && publishedStories?.map((story, index) => (
              <div key={index} className="p-5 w-full bg-[#F2F8F2] grid grid-cols-6 gap-5 rounded-lg border">
                <div className="col-span-6 md:col-span-6">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-semibold">{story?.publishedAt ? formatDate(story?.publishedAt) : ""}</p>
                    <p className="font-bold text-[10px]">5 min read</p>
                  </div>
                  <h1 className="font-bold text-2xl capitalize">{trimWords(story?.projectTitle, 15)}</h1>
                  <p className="font-light mt-2 text-[10px] capitalize">By {story?.user?.name}</p>
                  <p className="font-semibold mt-2 text-[10px] capitalize">{story?.genres.join(", ")}</p>
                  <div className="mt-4">
                    {!story?.introductionImage && <img src="/no-image.png" alt="walk" className="w-full h-[200px] rounded-xl object-cover" />}
                    {story?.introductionImage && <img src={story?.introductionImage} alt="walk" className="w-full h-[200px] rounded-xl object-cover" />}
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <Button onClick={() => moveToReadStory(story?.id)} size="sm" variant="outline">Read</Button>
                    <div className="flex gap-4 items-center">                  
                      <div className="flex gap-1 items-center">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-[10px]">30</span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <ThumbsUp className="w-4 h-4"/>
                        <span className="text-[10px]">3</span>
                      </div>
                    </div>
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