"use client";

import React, { useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { MessageSquare, Plus, PowerOff, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { makeRequest } from '@/services/request';
import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core';
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
import { formatDate, hidePageLoader, showPageLoader, trimWords } from '@/lib/helper';
import Link from 'next/link';
import { PublicKey } from '@solana/web3.js';

const DashboardStoriesPage = () => {
    const router = useRouter();
    const dynamicJwtToken = getAuthToken();

    const [openNewProjectModal, setOpenNewProjectModal] = useState<boolean>(false);
    const [projectTitle, setProjectTitle]= useState<string>('');    
    const [depositAddress, setDepositAddress]= useState<string>('');    
    const [tipLink, setTipLink]= useState<string>('');    
    
    const [projectDescription, setProjectDescription]= useState<string>('');   
    const [authUser, setAuthUser]= useState(null);   
    
    const { user, setShowAuthFlow, handleLogOut } = useDynamicContext()
    
    const { data: storyData, isFetching, isError, refetch } = useQuery({
        queryKey: ['storyFromScratchFormData'],
        queryFn: async () => {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/from-scratch`;

            const response = await axiosInterceptorInstance.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${dynamicJwtToken}`
                    }
                }
            );
            console.log(response);            

            return response?.data?.stories;
        },
        // enabled: true,
    });

    const validateForm = () => {
        if (!projectTitle) {
            toast.error("Kindly provide a project title");
            return false;
        }

        if (!projectDescription) {
            toast.error("Kindly provide a project idea or description");
            return false;
        }

        if (!depositAddress) {
            toast.error("Kindly provide a Kin Deposit Address");
            return false;
        }

        if (!isValidSolanaAddress(depositAddress)) {
            toast.error("Invalid KIN deposit address");
            return;
        }

        return true;
    }

    const createNewProject = async (suggest: string) => {
        if (!validateForm()) return;

        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch`;

            showPageLoader();
            let response = await makeRequest({
                url,
                method: "POST", 
                body: {
                    projectTitle,
                    projectDescription,
                    depositAddress: "5wBP4XzTEVoVxkEm4e5NJ2Dgg45DHkH2kSweGEJaJ91w"
                }, 
                token: dynamicJwtToken,
            });

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


    /**
     * Validates if a given string is a valid Solana public address.
     * @param address - The Solana public address to validate.
     * @returns boolean - True if the address is valid, otherwise false.
     */
    const isValidSolanaAddress = (address: string): boolean => {
        try {
            new PublicKey(address);
            return true;  // If no error is thrown, the address is valid
        } catch (error) {
            return false;
        }
    };

    const triggerOpenNewProjectModal = async () => {
        try {
            if (!user) {
                setShowAuthFlow(true);
                return;
            }

            showPageLoader()
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/auth`;

            let response = await makeRequest({
                url,
                method: "GET", 
                body: null,
                token: dynamicJwtToken,
            });
            console.log(response);
            
            const authUser = response?.user;
            if (!authUser) {
                toast.error("Something went wrong");
                return;
            }

            setDepositAddress(authUser?.depositAddress);
            setTipLink(authUser?.tipLink)
            setAuthUser(authUser);
            setOpenNewProjectModal(true);
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }        
    }

    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
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
                    <div className="flex items-center mb-5">
                        <Button className='bg-custom_green hover:bg-custom_green' onClick={triggerOpenNewProjectModal}>
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
                                    {/* <p className="font-light mt-2 text-xs capitalize">By {story?.user?.name}</p> */}
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

                                    <div className=" flex mt-3 justify-between items-center">
                                        <p className='text-sm font-bold capitalize'>{story?.status}</p>
                                        <Link href={`/dashboard/refine-story?story-id=${story.id}`}>                                            
                                            <Button size="sm" variant="outline" className='text-gray-900'>Edit</Button>
                                        </Link>
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
                            <textarea rows={3} 
                            onChange={(e) => setProjectDescription(e.target.value) } 
                            value={projectDescription} 
                            placeholder='Kindly share your story idea or any keywords'
                            className='py-2 px-4 outline-none border text-xs rounded-lg w-full' 
                            />
                        </div>

                        <div className="mb-4">
                            <p className="mb-1 text-xs font-semibold">Tip card link</p>
                            <Input 
                            defaultValue={tipLink}
                            onKeyUp={(e) => setTipLink(e.target.value)} 
                            onPaste={(e) => setTipLink(e.target.value)} 
                            className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                            placeholder='Tip Card Link'
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
                        </div>

                        <div className="mb-3 bg-red-100 border border-red-300 p-3 rounded-2xl">
                            <p className='text-[10px] text-red-500'>
                            Caution: Please ensure you provide a valid KIN deposit address. Not all Solana addresses are compatible with KIN transactions. If the address is incorrect, you may not receive tips or payments for your content. Double-check your KIN wallet address to avoid missing out on rewards.
                            </p>
                        </div>
                        <Button onClick={() => createNewProject("refine-story")} className='text-gray-50 mr-5 bg-[#46aa41]'>Proceed</Button>
                        {/* <Button onClick={() => createNewProject("refine-story")} variant="outline" className=''>Refine & Publish</Button> */}

                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default DashboardStoriesPage
