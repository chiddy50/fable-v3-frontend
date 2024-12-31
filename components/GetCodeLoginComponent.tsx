"use client";

import React, { useContext, useEffect, useRef, useState } from 'react'
import code from '@code-wallet/elements';
import { AppContext } from '@/context/MainContext';
import axios from 'axios';


interface Props {
    redirectUrl?: string;
    storyId?: string;
    cancelUrl?: string;
    storageKey: string;
}

const GetCodeLoginComponent: React.FC<Props> = ({ 
    redirectUrl,
    storyId,
    cancelUrl,
    storageKey
}) => {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    // GET CODE LOGIN START
    const [loginAuth, setLoginAuth] = useState<{ verifier: string, domain: string }|null>(null);
    const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchAuthData();        
    }, []);

    useEffect(() => {
        setIsMounted(true);
        if(loginAuth && isMounted ){
            let sessionStorageToken = sessionStorage.getItem("token");   
            let localStorageTokenToken = localStorage.getItem("token");   
            let token = sessionStorageToken ?? localStorageTokenToken;
            setIsLoggedIn(token ? true : false);

            if (!token) {                
                const { button } = code.elements.create('button', {
                    mode: 'login',
                    login: {
                        verifier: loginAuth?.verifier,  
                        domain: loginAuth?.domain // "usefable.xyz"
                    },
                    confirmParams: {
                        success: { url: `${process.env.NEXT_PUBLIC_URL}/${redirectUrl}/{{INTENT_ID}}` }, 
                        cancel: { url: `${process.env.NEXT_PUBLIC_URL}/${cancelUrl}/${storyId}`, },
                    },
                });
                
                if (button && !token) {      
                    button?.mount(el?.current!);
    
                    button.on('invoke', async () => {
                        // Get a payment intent clientSecret value from server.js
                        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/create-intent`);
                        console.log(res);
                        sessionStorage.setItem(`${storageKey}`, storyId);
                        localStorage.setItem(`${storageKey}`, storyId);                        
                        
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

export default GetCodeLoginComponent
