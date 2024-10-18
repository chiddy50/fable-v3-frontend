"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Lottie from 'react-lottie';
import * as animationData from "@/public/animations/animation.json"
import * as legoAnimationData from "@/public/animations/lottie_lego.json"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


interface Props {
    params: {
        id: string;
    };
}

const ReadStoryLoginSuccessPage = ({params: {id}}: Props) => {
    const decodedId = decodeURIComponent(id);

    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [storyId, setStoryId] = useState<string>("");
    
    const { push } = useRouter();

    useEffect(() => {
        authenticate();
    }, []);

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };


    const authenticate = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login/${decodedId}`);
            console.log(res);        
            const token = res?.data?.token;
            const user = res?.data?.user;
            if (!token) {
                return;
            }
            setAuthenticated(true);
            sessionStorage.setItem("token", token);    
            sessionStorage.setItem("user", JSON.stringify(user));  
            const storyId = sessionStorage.getItem("storyId");

            setStoryId(storyId ?? "");
            setTimeout(() => {
                push(`/read-story/${storyId}`)
            }, 4000);
            
        } catch (error) {
            console.error(error);            
        }finally{
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className='mt-[120px]'>

                <div
                    className="w-[90%]"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "60vh",
                    }}
                >
                    <div className='flex justify-center w-[80%] md:w-[80%] lg:w-[80%] '>    
                        <i className='bx bx-loader-alt bx-spin text-custom_green text-[10rem]' ></i>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='mt-[120px] flex justify-center'>

            <div
                className="w-[90%]"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "60vh",
                }}
            >
                {
                    authenticated &&
                    <div className='w-[85%] sm:w-[60%] md:w-[40%] lg:w-[30%] border p-5 rounded-2xl shadow-xl'>                    
                        <Lottie options={defaultOptions}
                            isStopped={false}
                            isPaused={false}
                        />
                        <h1 className='mt-3 font-semibold text-lg text-center'>Successfully logged in</h1>

                        <div className="mt-5">
                            <Link href={`/read-story/${storyId}`} className='w-full'>
                                <Button size="sm" className='text-xs w-full'>Read Story</Button>
                            </Link>
                        </div>
                    </div>
                }

                {
                    !authenticated &&
                    <div className='w-[80%] md:w-[40%] lg:w-[40%] border p-5 rounded-2xl shadow-xl'>                    
                        {/* <Lottie options={notAuthenticatedOptions}
                            isStopped={false}
                            isPaused={false}
                        /> */}
                        <h1 className='mt-3 font-semibold text-lg text-center'>Unable to login</h1>

                        <div className="grid grid-cols-1  gap-3 mt-5">
                            
                            <Link href="/">
                                <Button size="sm" className='text-xs w-full' variant="outline">Return</Button>
                            </Link>
                        </div>
                    </div>
                }

                
            </div>
        </div>
    )
}

export default ReadStoryLoginSuccessPage
