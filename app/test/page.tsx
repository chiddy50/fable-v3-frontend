"use client";

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import code from '@code-wallet/elements';
import { Button } from '@/components/ui/button';
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

const TestPage = () => {

    const [login, setLogin] = useState<{ verifier: string, domain: string }|null>(null);
    // GET CODE LOGIN START
    const [mounted, setMounted] = useState<boolean>(false);
    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchData();        
    }, []);

    useEffect(() => {
        if(login){
            console.log(login);
            const { button } = code.elements.create('button', {
                mode: 'login',
                login: {
                    verifier: login?.verifier, 
                    // domain: "usefable.xyz"
                    domain: login?.domain
                },
                // appearance: window.localStorage.getItem("joy-mode") == "light" ? "dark" : "light",
                confirmParams: {
                    success: { url: `${process.env.NEXT_PUBLIC_URL}/login-success/{{INTENT_ID}}` }, 
                    cancel: { url: `${process.env.NEXT_PUBLIC_URL}/`, },
                },
            });
    
            if (button) {      
                button?.mount(el?.current!);
                // Wait for the button to be clicked
                button.on('invoke', async () => {
    
                    // Get a payment intent clientSecret value from server.js
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/create-intent`);
                    console.log(res);
                    
                    const clientSecret = res?.data?.clientSecret;
            
                    // Update the button with the new client secret so that our server
                    // can be notified once the payment is complete.
                    button.update({ clientSecret });                
                });
    
            }
        }
    }, [login]);

    const fetchData = async () => {
        let response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/get-verifier`);
        console.log(response);
        const loginDomain = process.env.TEST_MODE ? "example-getcode.com" : "perk.exchange";

        if (!response) {
            throw new Error("Network response was not ok");
        }
        const data: { verifier: string, domain: string } = response?.data;
        setLogin(data);        
    }

    const query = async () => {

        let res = await axios.get("/api/test");
        
        console.log(res);
    }


  return (
    <div>
        <div className='mt-[120px]'>

            <Button onClick={query}>Test Login</Button>
            
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "60vh",
                }}
            >
                <div className="flex flex-col items-center gap-5">

                    <h1>Connect your account to Code Wallet</h1>
                    {login && <div ref={el} />}
                </div>
            </div>
        </div>
    </div>
  )
}

export default TestPage
