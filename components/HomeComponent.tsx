"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/images/logo.png"
import { Button } from "@/components/ui/button";
import StoryWriter from "@/components/StoryWriter";
import { BookOpen, Filter, RotateCcw } from "lucide-react";
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
import { ReusableCombobox } from "./ReusableCombobox";
import { storyGenres } from "@/lib/data";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PublishedStoryComponent from "./Home/PublishedStoryComponent";
import PublishedArticleComponent from "./Home/PublishedArticleComponent";
import { ArticleInterface } from "@/interfaces/ArticleInterface";
import ReaderArticleItem from "./Article/ReaderArticleItem";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import StarRatingComponent from "./Rating/StarRatingComponent";

const HomeComponent = () => {
    const [publishedStories, setPublishedStories]   = useState<StoryInterface[]>([]);
    const [publishedArticles, setPublishedArticles] = useState<ArticleInterface[]>([]);
    const [continueStories, setContinueStories]     = useState<[]>([]);
    const [loading, setLoading]                     = useState<boolean>(true);
    const [isMounted, setIsMounted]                 = useState<boolean>(false);
    const [initialFetchDone, setInitialFetchDone]   = useState(false);
    const [genre, setGenre]                         = useState<{ value:string,label:string,description:string }|null>(null);
    const [tag, setTag]                             = useState<{ value:string,label:string,description:string }|null>(null);
    const [genreList, setGenreList]                 = useState<[]>([]);
    const [tagList, setTagList]                     = useState<[]>([]);
    const [tags, setTags]                           = useState<[]>([]);
    const [defaultTabValue, setDefaultTabValue]     = useState<string>("articles");

    const { 
        loggedIn, setLoggedIn,
        isLoggedIn, setIsLoggedIn,        
    } = useContext(AppContext);

    const { push, refresh } = useRouter();
  
    const moveToStory = () => {  
      push("/dashboard/stories")
    }

    const moveToArticle = () => {  
        push("/dashboard/articles")
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
            fetchArticles();
        }
    }, []);


    const fetchStories = async (genre = "") => {
        try {
            let url = genre === "" ? `${process.env.NEXT_PUBLIC_BASE_URL}/stories/all` : `${process.env.NEXT_PUBLIC_BASE_URL}/stories/all?genre=${genre}`;
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

            const genres = json?.genres.map(genre => {
                return {
                    id: genre.id,
                    label: genre.name,
                    value: genre.name,
                }
            })
            setGenreList(genres ?? []);

            if (isLoggedIn) {            
                await getStartedStories();
            }

        } catch (error) {
          console.error(error);      
        }finally{
          setLoading(false)
        }
    }

    const fetchArticles = async (tag = null, rating = null) => {
        try {
            // let url = `${process.env.NEXT_PUBLIC_BASE_URL}/articles`;
            // if (tag) {
            //     url += `?tag=${tag}`;
            // }
            // if (rating) {
            //     url += `?rating=${rating}`;
            // }
            const params = new URLSearchParams();
    
            if (tag) params.append('tag', tag);
            if (rating) params.append('rating', rating?.toString());
            
            // Construct URL with query parameters
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/articles${params.toString() ? `?${params.toString()}` : ''}`;
            
            setLoading(true)
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        
            const json = await res.json();
            let data = json?.articles;
            if (data) setPublishedArticles(data);  
            setTags(json?.tags);

            const listOTags = json?.tags.map((tag: { id: string, title: string }) => {
                return {
                    id: tag.id,
                    label: tag.title,
                    value: tag.title,
                }
            });
            setTagList(listOTags ?? []);          

            // if (isLoggedIn) {            
            //     const allContinueStories = await getStartedStories();
            // }

        } catch (error) {
          console.error(error);      
        }finally{
          setLoading(false)
        }
    }
    
    const reset = async () => {
        await fetchStories()
        setGenre(null);
    }

    const resetArticleFilter = async () => {
        await fetchArticles()
        setTag(null);
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
        // const url = `${process.env.NEXT_PUBLIC_URL}`;
        const url = `https://usefable.xyz/read-story/${story?.id}`;

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

    const updateGenre = async (value) => {        
        let genreResult = storyGenres.find(genre => genre.value === value);
        setGenre(genreResult);
        
        let selectedGenre = genreList.find(genre => genre.value === value)
        console.log({genreResult, value, genreList, selectedGenre});
        if (value && value !== '') {            
            await fetchStories(selectedGenre.id);
            toast.message(`${value}`, {
                description: `${genreResult?.description}`,
            });
        }
    }  
    
    const updateTag = async (value) => {    
        console.log({value, tags});
            
        let tagResult = tags.find(tag => tag.title === value);
        setTag(tagResult);
        
        let selectedTag = tagList.find(tag => tag.value === value)
        console.log({tagResult, value, tagList, selectedTag});
        if (value && value !== '') {            
            await fetchArticles(selectedTag.id);
            toast.message(`${value}`, {
                description: `${tagResult?.description}`,
            });
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
                        onClick={moveToArticle} 
                        variant="outline"
                        className=" tracking-wider text-md" size="lg">
                        Start writing article
                        </Button>
                        <Button
                        onClick={moveToStory} 
                        className="bg-custom_green text-white tracking-wider text-md" size="lg">
                        Start writing story
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
                            {
                                <div>
                                    <Tabs defaultValue={defaultTabValue} value={defaultTabValue} className="w-full" onValueChange={(e) => setDefaultTabValue(e)} >
                                        <TabsList>
                                            <TabsTrigger value="articles">Articles</TabsTrigger>
                                            <TabsTrigger value="stories">Stories</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="stories">
                                            {/* <h1 className="mb-5 mt-10 text-gray-600 xs:text-3xl sm:text-3xl text-4xl font-bold">
                                            Checkout these stories..
                                            </h1> */}

                                            {
                                                genreList.length > 0 &&
                                                <div className="mb-7 mt-10 md:w-full lg:w-1/2 flex gap-4 items-center">
                                                    <ReusableCombobox
                                                        options={genreList}
                                                        placeholder="Select genre..."
                                                        defaultValue={genre}
                                                        onSelect={(value) => updateGenre(value)}
                                                        className="my-custom-class w-full text-xs"
                                                        emptyMessage="No genre found."
                                                    />
                                                    <Button onClick={reset} size="icon" className="">
                                                        <RotateCcw className="w-5 h-5"/>     
                                                    </Button>
                                                </div>
                                            }
                                            
                                            {
                                                (publishedStories?.length < 1 || !publishedStories) &&
                                                <div className='flex flex-col items-center'>
                                                    <img src="/no-results.svg" alt="no-data-image" className="w-[200px] h-[200px]" />
                                                    <p className="font-semibold">No Stories yet</p>
                                                </div>
                                            }

                                            {
                                                publishedStories?.length > 0 &&
                                                <PublishedStoryComponent publishedStories={publishedStories} />
                                            }
                                        </TabsContent>
                                        <TabsContent value="articles">  

                                            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-5 mb-7 mt-10 ">
                                            {
                                                tagList.length > 0 &&
                                                <div className="md:w-full lg:w-full flex gap-4 items-center">
                                                    <ReusableCombobox
                                                        options={tagList}
                                                        placeholder="Select tag..."
                                                        defaultValue={tag}
                                                        onSelect={(value) => updateTag(value)}
                                                        className="my-custom-class w-full text-xs"
                                                        emptyMessage="No tag found."
                                                    />
                                                    <Button onClick={resetArticleFilter} size="icon" className="">
                                                        <RotateCcw className="w-5 h-5"/>     
                                                    </Button>
                                                </div>
                                            }

                                                <div className="flex md:justify-start lg:justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger className="bg-slate-700 text-gray-50 p-3 rounded-xl text-xs tracking-wider flex items-center">
                                                            <Filter className="w-4 h-4 mr-2" /> Filter by rating 
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuLabel>Choose a rating</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => fetchArticles(null, 1)}>
                                                                <StarRatingComponent rating={1} />                                                                
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => fetchArticles(null, 2)}>
                                                                <StarRatingComponent rating={2} />                                                                
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => fetchArticles(null, 3)}>
                                                                <StarRatingComponent rating={3} />                                                                
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => fetchArticles(null, 4)}>
                                                                <StarRatingComponent rating={4} />                                                                
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => fetchArticles(null, 5)}>
                                                                <StarRatingComponent rating={5} />                                                                
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>


                                            {
                                                (publishedArticles?.length < 1 || !publishedArticles) &&
                                                <div className='flex flex-col items-center'>
                                                    <img src="/no-results.svg" alt="no-data-image" className="w-[200px] h-[200px]" />
                                                    <p className="font-semibold">No Articles yet</p>
                                                </div>
                                            }                                          

                                            <ul className="mt-10">
                                                {publishedArticles.map(article => (
                                                    <ReaderArticleItem key={article.id} article={article} />
                                                ))}
                                            </ul>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            }
                        </div>
                    }
                
                </div>
            </div>
        }
        

      </main>
    )
}

export default HomeComponent
