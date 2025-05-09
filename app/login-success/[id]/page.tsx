"use client";
import axios from 'axios';
import React, { useContext, useEffect, useState, use } from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { AppContext } from '@/context/MainContext';


interface Props {
    params: Promise<{ id: string }>
}
const LoginSuccessPage = ({ params }: Props) => {
    const { id } = use(params);
    const decodedId = decodeURIComponent(id);

    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [userType, setUserType] = useState<string>("");
    
        const { 
            firstTimeLogin, setFirstTimeLogin,
            setUser      
        } = useContext(AppContext);
        
    useEffect(() => {
        authenticate();
    }, []);

    // const defaultOptions = {
    //     loop: true,
    //     autoplay: true, 
    //     animationData: animationData,
    //     rendererSettings: {
    //         preserveAspectRatio: 'xMidYMid slice'
    //     }
    // };


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
            localStorage.setItem("token", token);    
            localStorage.setItem("user", JSON.stringify(user));  
            
            const firstTimeLoginForUser = user?.firstTimeLogin
            setFirstTimeLogin(firstTimeLoginForUser)
            setUser(user)
            setUserType(user?.userType);

        } catch (error) {
            console.error(error);            
        }finally{
            setLoading(false);
        }
    }

    const start = () => {
        if (firstTimeLogin) {            
            window.location.href = '/on-boarding';
        }
        if (!firstTimeLogin) {              
            // window.location.href = userType === "reader" ? "/stories" : "/dashboard";
            window.location.href = '/';
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
                    <div className='w-[85%] sm:w-[50%] md:w-[30%] lg:w-[30%] border border-gray-200 p-7 rounded-2xl shadow-xl'>                    
                        <div className="flex items-center justify-center">
                            <Image src="/icon/check.svg" alt="check icon" className=" " width={90} height={90} />
                        </div>
                       
                        <h1 className='mt-3 font-semibold text-lg text-center'>Successfully logged in</h1>
                        <p className="py-5 text-xs font-light text-center">Start using Fable</p>
                        <div className="grid grid-cols-1 gap-3 ">    
                            {/* <Link href="/on-boarding"> */}
                                <Button onClick={start} size="lg" className='text-sm w-full bg-[#33164C] cursor-pointer text-gray-50 py-3'>Start</Button>
                            {/* </Link>   */}
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
                                <Button size="lg" className='text-sm w-full bg-[#33164C] cursor-pointer text-gray-50 py-3'>Return</Button>
                            </Link> 
                        </div>
                    </div>
                }

                
            </div>
        </div>
    )
}

export default LoginSuccessPage
