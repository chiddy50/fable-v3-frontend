"use client";

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import code from '@code-wallet/elements';
import { Button } from '@/components/ui/button';
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

const TestPage = () => {
    // GET CODE LOGIN START
    const [mounted, setMounted] = useState<boolean>(false);
    const el = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setMounted(true);
        if(mounted){
            setLogin();        
        }
    }, [mounted]);

    const setLogin = async () => {
        let response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/get-verifier`);
        console.log(response);
        
        const { verifier, domain } = response?.data;
        console.log(process.env.NEXT_PUBLIC_BASE_URL, verifier, domain);
        
        const { button } = code.elements.create('button', {
            mode: 'login',
            login: {
                verifier: verifier, 
                domain: "usefable.xyz"
            },
            confirmParams: {
                success: { url: `${process.env.NEXT_PUBLIC_URL}/success/{{INTENT_ID}}` }, 
                cancel: { url: `${process.env.NEXT_PUBLIC_URL}/`, },
            },
        });

        if (button) {      
            button?.mount(el?.current!);
            // Wait for the button to be clicked
            button.on('invoke', async () => {

                // Get a payment intent clientSecret value from server.js
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/create-intent`);
                const clientSecret = response?.data?.clientSecret;
        
                // Update the button with the new client secret so that our server
                // can be notified once the payment is complete.
                button.update({ clientSecret });
            
            });

        }
    }
    // GET CODE LOGIN END

    const query = async () => {

        let res = await axios.get("/api/test");
        
        console.log(res);
    }


  return (
    <div>
        <div className='mt-[120px]'>
            <div ref={el} />
            <Button onClick={query}>Test Login</Button>
        </div>
    </div>
  )
}

export default TestPage
