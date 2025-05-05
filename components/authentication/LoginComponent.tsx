"use client"

import React, { useContext } from 'react'
import { useRef, useEffect, useState } from "react"
import code from '@code-wallet/elements';
import axios from "axios";
import { AppContext } from '@/context/MainContext';


const LoginComponent = () => {
    const [loginAuth, setLoginAuth] = useState<{ verifier: string, domain: string }|null>(null);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    
    const { 
        loggedIn, setLoggedIn,
        isLoggedIn, setIsLoggedIn,        
    } = useContext(AppContext);
        
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

    const fetchAuthData = async () => {
        let response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/get-verifier`);
        console.log(response);

        if (!response) {
            throw new Error("Network response was not ok");
        }
        const data: { verifier: string, domain: string } = response?.data;
        setLoginAuth(data);        
    }
    
    return (
        <>
            <div ref={el} />
        </>
    )
}

export default LoginComponent
