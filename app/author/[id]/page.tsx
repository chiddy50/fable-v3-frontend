"use client";

import StarRatingComponent from '@/components/Rating/StarRatingComponent';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import { Separator } from "@/components/ui/separator"
import Link from 'next/link';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { Skeleton } from "@/components/ui/skeleton"
import { UserInterface } from '@/interfaces/UserInterface';

interface Props {
    params: {
        id: string;
    };
}

const AuthorPage = ({ params: { id } }: Props) => {

    const decodedId = decodeURIComponent(id);

    const [author, setAuthor] = useState<UserInterface|null>(null);
    const [socialMedia, setSocialMedia] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAuthor();
    }, []);

    const getAuthor = async () => {
        try {
            setLoading(true);
            const response = await axiosInterceptorInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${decodedId}`)
            console.log(response);
            setAuthor(response?.data?.user)
            setSocialMedia(response?.data?.user?.socialMedia)
        } catch (error) {
            console.error(error);            
        }finally{
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <main className="flex-1 flex flex-col flex-grow h-svh top-[80px] relative mx-auto w-[80%]" >         
                <Skeleton className="w-[100px] h-[50px] rounded-2xl mt-10" />
                <div className="grid grid-cols-5 gap-7 mt-7">
                    <Skeleton className="col-span-1 h-[200px] rounded-2xl " />
                    <div className='col-span-3 grid grid-cols-1 gap-5'>
                        <Skeleton className=" h-[50px] rounded-2xl " />
                        <Skeleton className=" h-[50px] rounded-2xl " />
                        <Skeleton className=" h-[50px] rounded-2xl " />
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-7">
                    <Skeleton className="col-span-1 h-[100px] rounded-2xl " />
                    <Skeleton className="col-span-1 h-[100px] rounded-2xl " />
                    <Skeleton className="col-span-1 h-[100px] rounded-2xl " />
                    <Skeleton className="col-span-1 h-[100px] rounded-2xl " />

                </div>

            </main>
        )
    }

    return (
        <main className="flex-1 flex flex-col flex-grow h-svh top-[80px] relative mx-auto w-[80%]" >         
       
            <div className="flex justify-between items-center mt-10">
                <h1 className="text-md font-semibold text-gray-600">PROFILE</h1>
            </div>
            

            <div className='mt-7 mb-10'>

                <div className="grid md:grid-cols-1 lg:grid-cols-5 gap-7">
                    <img src="/male_avatar.png" alt="user-profile-image" className=" col-span-1 rounded-xl object-cover border-gray-100 md:w-[200px] lg:w-full" />
                    <div className='md:col-span-1 lg:col-span-2'>
                        <h1 className="text-2xl font-semibold mb-2">{author?.name}</h1>

                        <StarRatingComponent rating={author?.averageRating ?? 0} />

                        <p className="text-xs mt-2">{author?.bio ?? "None"}</p>

                        <div className="mt-5 grid grid-cols-2 gap-5">
                            <div className='p-1 rounded-3xl border flex items-center gap-3'>
                                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-pink-600 text-white">
                                    <i className="bx bxs-star" />
                                </div>
                                <p className='text-xs'>
                                    {author?._count?.articles <= 1 ? `${author?._count?.stories} Story` : `${author?._count?.stories} Stories`} 
                                </p>
                            </div>
                            <div className='p-1 rounded-3xl border flex items-center gap-3'>
                                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-600 text-white">
                                    <i className="bx bxs-star" />
                                </div>
                                <p className='text-xs'>
                                    {author?._count?.articles <= 1 ? `${author?._count?.articles} Article` : `${author?._count?.articles} Articles`}                                     
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Separator />

            <div className="mt-10 mb-10">
                <h1 className="text-md font-semibold text-gray-600">INFORMATION</h1>
                
                <div className="mt-7 grid grid-cols-2 gap-5">
                    <div className='text-xs'>
                        <p className=" mb-2">{author?.email ?? "None"}</p>
                        <p className='text-gray-500 tracking-wider'>EMAIL ADDRESS</p>
                    </div>

                    <div className='text-xs'>
                    {author?.tipLink && <Link href="https://tipcard.getcode.com/X/ii_am_chidi" target='_blank' className="mb-2 block text-blue-600">{}</Link> }
                    {!author?.tipLink && <p className="mb-2 block">None</p> }
                        <p className='text-gray-500 tracking-wider'>TIP CARD</p>
                    </div>

                    <div className='text-xs'>
                        {
                            socialMedia?.id &&
                            <div className="flex items-center gap-2 mb-2">
                                {
                                    socialMedia.discord &&
                                    <Link href={`/`} target='_blank' className='flex items-center justify-center cursor-pointer w-5 h-5 rounded-full bg-gray-600 text-gray-50'>
                                        <i className='bx bxl-discord-alt'></i>
                                    </Link>
                                }
                                {
                                    socialMedia.facebook &&
                                    <Link href={`/`} target='_blank' className='flex items-center justify-center cursor-pointer w-5 h-5 rounded-full bg-gray-600 text-gray-50'>
                                        <i className='bx bxl-facebook'></i>
                                    </Link>
                                }
                                {
                                    socialMedia.tiktok &&
                                    <Link href={`/`} target='_blank' className='flex items-center justify-center cursor-pointer w-5 h-5 rounded-full bg-gray-600 text-gray-50'>
                                        <i className='bx bxl-tiktok'></i>
                                    </Link>
                                }   

                                {
                                    socialMedia.instagram &&
                                    <Link href={`/`} target='_blank' className='flex items-center justify-center cursor-pointer w-5 h-5 rounded-full bg-gray-600 text-gray-50'>
                                        <i className='bx bxl-instagram'></i>
                                    </Link>
                                }                                

                                {
                                    !socialMedia?.instagram && !socialMedia?.tiktok && !socialMedia?.facebook && !socialMedia?.discord && "None"
                                }
                            </div>
                        }
                        {
                            !socialMedia && !socialMedia?.instagram && !socialMedia?.tiktok && !socialMedia?.facebook && !socialMedia?.discord && <div className='mb-2'>None</div>
                        }
                        <p className='text-gray-500 tracking-wider'>SOCIAL LINKS</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AuthorPage
