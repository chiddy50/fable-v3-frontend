"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Lottie from 'react-lottie';
import * as animationData from "@/public/animations/animation.json"
import { Button } from '@/components/ui/button';
import Link from 'next/link';


interface Props {
    params: {
        id: string;
    };
}

const LoginSuccessPage = ({params: {id}}: Props) => {
    const decodedId = decodeURIComponent(id);

    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    
    
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
                {
                    authenticated &&
                    <div className='w-[80%] md:w-[40%] lg:w-[40%] border p-5 rounded-2xl shadow-xl'>                    
                        <Lottie options={defaultOptions}
                            isStopped={false}
                            isPaused={false}
                        />
                        <h1 className='mt-3 font-semibold text-lg text-center'>Successfully logged in</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                            <Link href="/dashboard/stories">
                                <Button size="sm" className='text-xs w-full'>Go dashboard</Button>
                            </Link>
                            <Link href="/">
                                <Button size="sm" className='text-xs w-full' variant="outline">Return</Button>
                            </Link>
                        </div>
                    </div>
                }

                {
                    !authenticated &&
                    <div className='w-[80%] md:w-[40%] lg:w-[40%] border p-5 rounded-2xl shadow-xl'>                    
                        {/* <Lottie options={defaultOptions}
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

export default LoginSuccessPage
