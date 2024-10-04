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
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
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

const DashboardStoriesPage = () => {
    const router = useRouter();
    const dynamicJwtToken = getAuthToken();

    const [openNewProjectModal, setOpenNewProjectModal] = useState<boolean>(false);
    const [projectTitle, setProjectTitle]= useState<string>('');    
    const [depositAddress, setDepositAddress]= useState<string>('');    
    const [projectDescription, setProjectDescription]= useState<string>('');   
    
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
            // toast.error("Kindly provide a deposit address");
            // return false;
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

    const displayGenre = (genres) => {
        console.log({genres});
        
        return genres?.map(genre => {
            console.log(typeof genre);
            
            return genre                
            if (genre) {
            }
        }).join(", ")
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
                        <Button className='bg-custom_green hover:bg-custom_green' onClick={() => setOpenNewProjectModal(true)}>
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
                                    <div key={story?.id} 
                                    className="p-5 w-full bg-[#F2F8F2] h-[200px] grid grid-cols-6 gap-5 rounded-lg border overflow-hidden mb-2">
                                        <div className="xs:col-span-6 sm:col-span-6 col-span-6 flex flex-col justify-between h-full overflow-hidden">
                                            <p className="text-xs font-semibold mb-1">{formatDate(story?.createdAt)}</p>
                                            <h1 className="font-bold text-xl capitalize truncate">{story?.projectTitle}</h1>
                                            <p className="font-light mt-1 text-[10px]">{displayGenre(story?.genres)}</p>
                                            <p className="mt-2 text-gray-600 text-xs line-clamp-3">{trimWords(story?.projectDescription, 10)}</p>
                                            <div className=" flex mt-3 justify-between items-center">
                                                <p className='text-sm font-bold capitalize'>{story?.status}</p>
                                                <Link href={`/dashboard/refine-story?story-id=${story.id}`}>                                            
                                                {/* <Link href={`/dashboard/story-project?story-id=${story.id}&current-step=${story.currentStepUrl}`}>                                             */}
                                                    <Button size="sm">Edit</Button>
                                                </Link>
                                            </div>
                                            {/* <div className="mt-auto flex justify-between items-center">
                                                <p className="font-bold text-xs">5 min read</p>
                                                <div className="flex gap-4 items-center">
                                                    <div className="flex gap-1 items-center">
                                                        <MessageSquare className="w-4 h-4" />
                                                        <span className="text-[10px]">30</span>
                                                    </div>
                                                    <div className="flex gap-1 items-center">
                                                        <ThumbsUp className="w-4 h-4" />
                                                        <span className="text-[10px]">3</span>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                        {/* <div className="xs:col-span-6 sm:col-span-6 col-span-2 h-full w-full bg-gray-800 rounded-2xl overflow-hidden">
                                            <Image src={story?.characters[0]?.imageUrl ?? `/no-image.png`} alt="no-image" width={300} height={300} className="object-cover w-full h-full" />
                                        </div> */}
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

                        <Input 
                        defaultValue={projectTitle}
                        onKeyUp={(e) => setProjectTitle(e.target.value)} 
                        className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                        placeholder='Project title'
                        />
                        <textarea rows={3} 
                        onChange={(e) => setProjectDescription(e.target.value) } 
                        value={projectDescription} 
                        placeholder='Kindly share your story idea or any keywords'
                        className='py-2 px-4 mb-4 outline-none border text-xs rounded-lg w-full' 
                        />

                        <div className="mb-4">
                            <Input 
                            defaultValue={depositAddress}
                            onKeyUp={(e) => setDepositAddress(e.target.value)} 
                            onPaste={(e) => setDepositAddress(e.target.value)} 
                            className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                            placeholder='Deposit Address'
                            />
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
