"use client";

import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import React, { useState, Suspense } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useQuery } from '@tanstack/react-query';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const inter = Inter({ subsets: ['latin'] });

const ProjectSummaryContent = () => {
    const [story, setStory] = useState<StoryInterface|null>(null)
    const [modifyModalOpen, setModifyModalOpen] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const storyId = searchParams.get('story-id');
    const dynamicJwtToken = getAuthToken();

    const { data: storyData, isFetching, isError, refetch } = useQuery({
        queryKey: ['storyFromScratchFormData', storyId],
        queryFn: async () => {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/from-scratch/${storyId}`;
    
            const response = await axiosInterceptorInstance.get(url,
              {
                headers: {
                  Authorization: `Bearer ${dynamicJwtToken}`
                }
              }
            );
            if (response?.data?.story) {
                setStory(response?.data?.story);
            }
            return response?.data?.story;
        },
        enabled: !!storyId && !story
    });

    if (isFetching) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading story data</div>;
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
                        <BreadcrumbPage>Story Summary</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex justify-between mt-7">
                <Link href={`/dashboard/refine-story?story-id=${storyId}`}>
                    <Button size='sm' variant="outline">Return</Button>
                </Link>
                <Button size='sm'>View Chapters</Button>
            </div>

            <div className='my-10 p-7 bg-gray-50 rounded-2xl'>
                <div className='mb-4'>
                    <Button className='w-full'>Chapter One</Button>
                </div>
                <div className='mb-4'>
                    <Button className='w-full'>Chapter Two</Button>
                </div>
                <div className='mb-4'>
                    <Button className='w-full'>Chapter Three</Button>
                </div>
            </div>

            <Sheet open={modifyModalOpen} onOpenChange={setModifyModalOpen}>
                <SheetContent className="overflow-y-scroll xs:min-w-[90%] sm:min-w-[96%] md:min-w-[65%] lg:min-w-[65%] xl:min-w-[55%]">
                    <SheetHeader className=''>
                        <SheetTitle>Edit Chapter</SheetTitle>
                        <SheetDescription> </SheetDescription>
                    </SheetHeader>

                    <div className='my-10 p-7 bg-gray-50 rounded-2xl'>
                        <p className={cn("font-semibold text-xl first-letter:text-4xl whitespace-pre-wrap", inter.className)}>{story?.storyStructure?.introduceProtagonistAndOrdinaryWorld}</p>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

const ProjectSummaryPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProjectSummaryContent />
        </Suspense>
    );
}

export default ProjectSummaryPage