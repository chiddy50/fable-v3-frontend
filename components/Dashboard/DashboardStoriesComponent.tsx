
"use client";

import React, { useContext, useEffect, useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ArrowLeft, MessageSquare, Plus, PowerOff, Share2Icon, ThumbsUp, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { Skeleton } from "@/components/ui/skeleton"
import { StoryInterface } from '@/interfaces/StoryInterface';
import { formatDate, hidePageLoader, shareStory, showPageLoader, trimWords } from '@/lib/helper';
import Link from 'next/link';
import { PublicKey } from '@solana/web3.js';
import { AppContext } from '@/context/MainContext';
import { getUserAuthParams } from '@/services/AuthenticationService';
import dynamic from 'next/dynamic';

const DashboardStoriesComponent = () => {
    const router = useRouter();

    const [openNewProjectModal, setOpenNewProjectModal] = useState<boolean>(false);
    const [projectTitle, setProjectTitle]= useState<string>('');    
    const [depositAddress, setDepositAddress]= useState<string>('');    
    const [tipLink, setTipLink]= useState<string>('');    
    const [creatorName, setCreatorName]= useState<string>('');    
    
    const [storyData, setStoryData]= useState([]);   
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);


    const [projectDescription, setProjectDescription]= useState<string>('');   
    const [authUser, setAuthUser]= useState(null);   
    const { web3auth, loggedIn, login } = useContext(AppContext)
    
    useEffect(() => {
        getData()
    }, []);

    const getData = async () => {
        try {
            setIsFetching(true);
            const response = await axiosInterceptorInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/stories/from-scratch`)
            setStoryData(response?.data?.stories)
        } catch (error) {
            console.error(error);            
        }finally{
            setIsFetching(false)
        }
    }

    // const { data: storyData, isFetching, isError, refetch } = useQuery({
    //     queryKey: ['storyFromScratchFormData'],
    //     queryFn: async () => {         
    //         let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/from-scratch`;
            
    //         // const response = await axiosInterceptorInstance.get(url);

    //         const response = await axiosInterceptorInstance.get(url,{
    //             params: null,
    //             // headers: {
    //             //     Authorization: `Bearer ${idToken}`,
    //             //     "Public-Address": publicAddress,
    //             //     "Public-Key": appPubKey
    //             // },
    //         })

    //         console.log(response);            
    //         return response?.data?.stories;
    //     },
    //     // enabled: !!idToken,
    // });

    const validateForm = () => {
        if (!projectTitle) {
            toast.error("Kindly provide a project title");
            return false;
        }

        if (!projectDescription) {
            toast.error("Kindly provide a project idea or description");
            return false;
        }

        if (!creatorName) {
            toast.error("Kindly provide a Username or Alias");
            return false;
        }

        // if (!isValidSolanaAddress(depositAddress)) {
        //     toast.error("Invalid KIN deposit address");
        //     return;
        // }

        return true;
    }

    const createNewProject = async (suggest: string) => {
        if (!validateForm()) return;

        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch`;
            showPageLoader();
            const response = await axiosInterceptorInstance.post(url, 
                {
                    projectTitle,
                    projectDescription,
                    creatorName
                    // depositAddress: "5wBP4XzTEVoVxkEm4e5NJ2Dgg45DHkH2kSweGEJaJ91w"     
                }
            );

            const story = response?.data?.story;
            if (!story?.id) {
                toast.error("Unable to create project");
                hidePageLoader();
                return;
            }

            if (suggest === "refine-story") {                
                router.push(`/dashboard/refine-story?story-id=${story?.id}`);
            }
            
            if (suggest === "refine-character") {                
                router.push(`/dashboard/story-project?current-step=story-starter&story-id=${story?.id}`);
            }
            
        } catch (error) {
            console.error(error);      
        }finally{
            hidePageLoader();
        }
    }

    const triggerOpenNewProjectModal = async () => {
        try {
            showPageLoader()
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/auth`;

            const response = await axiosInterceptorInstance.get(url, {
                params: null,
            });
            console.log(response);
            
            const authUser = response?.data?.user;
            if (!authUser) {
                toast.error("Something went wrong");
                return;
            }

            // setDepositAddress(authUser?.depositAddress);
            // setTipLink(authUser?.tipLink);
            setCreatorName(authUser?.name ?? "");
            setAuthUser(authUser);
            setOpenNewProjectModal(true);
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }        
    }

    const copyToClipboard = (link: string) => {
        if (link) {            
            navigator.clipboard.writeText(link);
            toast.info("Story link copied!");
        }        
    };

    const deleteStory = async (storyId: string) => {
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/delete/${storyId}`;
            showPageLoader();
            const response = await axiosInterceptorInstance.delete(url);
            getData();
        } catch (error) {
            console.error(error);            
            console.error(error?.response?.data?.message);            
            let errorMsg = error?.response?.data?.message;
            if (errorMsg) {
                toast.error(errorMsg)
            }
        }finally{
            hidePageLoader();
        }
    }

    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Stories</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {
                isFetching &&
                <div className="my-10">
                    <Skeleton className="w-full h-[190px] rounded-xl" />
                </div>
            }

            {
                !isFetching &&
                <div className="my-10">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-5">
                            <Link href="/">
                                <Button variant="outline" size="sm" onClick={triggerOpenNewProjectModal}>
                                    <ArrowLeft className='w-4 h-4 mr-2'/>Explore other stories
                                </Button>
                            </Link>
                            
                        </div>
                        <Button size="sm" className='bg-custom_green hover:bg-custom_green' onClick={triggerOpenNewProjectModal}>
                        <Plus className='w-4 h-4'/>
                        New Story
                        </Button>
                    </div>

                    {
                        storyData?.length < 1 &&
                        <div className='flex justify-center'>
                            <div className='px-10 py-7 rounded-2xl mt-20 flex flex-col items-center gap-2 justify-center text-gray-700 bg-gray-50'>
                                <PowerOff className='w-20 h-20'/>
                                <p className="text-lg font-bold">No Stories</p>
                            </div>
                        </div>
                    }

                    {
                        <div className='grid md:grid-cols-1 lg:grid-cols-2 gap-5'>
                            {
                                storyData?.map((story: StoryInterface) => (                                
                                    <div key={story?.id} className="p-5 flex flex-col justify-between w-full bg-gray-800 text-gray-50 rounded-lg border">
                                    <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-semibold">{story?.publishedAt ? formatDate(story?.publishedAt) : ""}</p>
                                    {/* <p className="font-bold text-[10px]">5 min read</p> */}
                                    </div>
                                    <h1 className="font-bold text-xl capitalize mb-3">{story?.projectTitle}</h1>
                  
                                    <div className="font-semibold mt-2 text-[10px]">
                                      {story?.genres?.map(genre => genre.value)?.join(" | ")}
                                    </div>
                         
                                    <div className="mt-4">
                                    {
                                        !story?.introductionImage && <img src="/no-image.png" alt="walk" className="w-full h-[200px] rounded-xl object-cover" />
                                    }
                                    {
                                        story?.introductionImage && <img src={story?.introductionImage} alt="walk" className="w-full h-[200px] rounded-xl object-cover" />
                                    }
                                    </div>


                                    <div className=" flex xs:flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-row xs:gap-4 mt-3 justify-between items-center">
                                        <p className='text-sm font-bold capitalize'>{story?.status}</p>

                                        <div className="flex items-center gap-5">
                                            {   story?.status === "published" &&
                                                <div className='flex items-center gap-5'>
                                                    <div onClick={() => shareStory(story)} className="flex gap-1 items-center cursor-pointer px-3 py-2 border border-gray-200 rounded-2xl">
                                                        <span className="text-xs">Post on </span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="w-4 h-4"><path fill="#fff" d="M13.346 10.932 18.88 4.5h-1.311l-4.805 5.585L8.926 4.5H4.5l5.803 8.446L4.5 19.69h1.311l5.074-5.898 4.053 5.898h4.426zM11.55 13.02l-.588-.84-4.678-6.693h2.014l3.776 5.4.588.842 4.907 7.02h-2.014z"></path></svg>
                                                    </div>
                                                    <Button onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_URL}/read-story/${story?.id}`)} size="sm" variant="outline" className='text-gray-900 text-xs'>
                                                        Copy link
                                                        <Share2Icon className="h-3 w-3 ml-2"/>
                                                    </Button>                                                    
                                                </div>

                                            }

                                            {   story?.status === "draft" &&
                                                <Button onClick={() => deleteStory(story?.id)} size="sm" variant="destructive" className=' text-xs'>
                                                    Delete
                                                    <Trash2 className="h-3 w-3 ml-2"/>
                                                </Button>    
                                            }
                                            <Link href={`/dashboard/refine-story?story-id=${story.id}`}>                                            
                                                <Button size="sm" variant="outline" className='text-gray-900'>Edit</Button>
                                            </Link>
                                        </div>
                                    </div>                           
                  
                                  </div>
                                ))
                            }
                        </div>
                    }



                </div>
            }

            <Dialog open={openNewProjectModal} onOpenChange={setOpenNewProjectModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className=''>Let's get started on your new project</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <div className="mb-3">
                            <p className="mb-1 text-xs font-semibold">Title <span className='text-red-500 text-md font-bold'>*</span></p>
                            <Input 
                            defaultValue={projectTitle}
                            onKeyUp={(e) => setProjectTitle(e.target.value)} 
                            className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                            placeholder='Project title'
                            />
                        </div>
                        <div className="mb-3">
                            <p className="mb-1 text-xs font-semibold">Story Idea <span className='text-red-500 text-md font-bold'>*</span></p>
                            <textarea rows={5} 
                            onChange={(e) => setProjectDescription(e.target.value) } 
                            value={projectDescription} 
                            placeholder='Kindly share your story idea or any keywords'
                            className='py-2 px-4 outline-none border text-xs rounded-lg w-full' 
                            />
                        </div>

                        {authUser && !authUser?.name &&                        
                            <div className="mb-4">
                                <p className="mb-1 text-xs font-semibold">Username or Alias<span className='text-red-500 text-md font-bold'>*</span></p>
                                <Input 
                                defaultValue={authUser?.name}
                                onKeyUp={(e) => setCreatorName(e.target.value)} 
                                onPaste={(e) => setCreatorName(e.target.value)} 
                                className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                                placeholder='Username or Alias'
                                />
                            </div>
                        }

                        {/* <div className="mb-4">
                            <p className="mb-1 text-xs font-semibold">Tip card link</p>
                            <Input 
                            defaultValue={tipLink}
                            onKeyUp={(e) => setTipLink(e.target.value)} 
                            onPaste={(e) => setTipLink(e.target.value)} 
                            className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                            placeholder='https://tipcard.getcode.com/X/x-handle'
                            />
                        </div>

                        <div className="mb-3">
                            <p className="mb-1 text-xs font-semibold">Kin Wallet Address <span className='text-red-500 text-md font-bold'>*</span></p>
                            <Input 
                            defaultValue={depositAddress}
                            onKeyUp={(e) => setDepositAddress(e.target.value)} 
                            onPaste={(e) => setDepositAddress(e.target.value)} 
                            className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                            placeholder='Kin Wallet Address'
                            />
                        </div> */}

                        {/* <div className="mb-3 bg-red-100 border border-red-300 p-3 rounded-2xl">
                            <p className='text-[10px] text-red-500'>
                            Caution: Please ensure you provide a valid KIN deposit address. Not all Solana addresses are compatible with KIN transactions. If the address is incorrect, you may not receive tips or payments for your content. Double-check your KIN wallet address to avoid missing out on rewards.
                            </p>
                        </div> */}
                        <Button onClick={() => createNewProject("refine-story")} className='text-gray-50 mr-5 w-full bg-[#46aa41]'>Proceed</Button>
                        {/* <Button onClick={() => createNewProject("refine-story")} variant="outline" className=''>Refine & Publish</Button> */}

                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default DashboardStoriesComponent

