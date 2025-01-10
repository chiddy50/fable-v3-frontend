"use client";

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';
import code from '@code-wallet/elements';
import axios from 'axios';

const TipComponent2 = ({ amount, destination, id }) => {
    const [mounted, setMounted] = useState<boolean>(false);

    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (mounted) {            
            const { button } = code.elements.create('button', {
                currency: 'usd',
                destination: process.env.NEXT_PUBLIC_CODE_WALLET_DEPOSIT_ADDRESS,
                amount: 0.5
            });

            // button?.mount(el?.current!);

        }
    }, [mounted]);


    const onClick = async () => {
        if (!el.current) {
            return;
        }
    
        const { clientSecret } = await getTipIntentId();
        const { page } = code.elements.create('page', {
            clientSecret,
            destination: destination,
            currency: 'usd',
            amount: parseFloat(amount),
        });
        console.log({page});

        page.on('cancel', async () => {
            page.unmount();
        });
        page.on('error', async (event: any) => {
            page.unmount();
            console.log(event);
            
        });
        page.on('success', async (event: any) => {
            page.unmount();
            console.log(event);

        });

        const div = document.createElement('div');
        el.current.appendChild(div);
        console.log({div, el: el.current});
        
        window.history.pushState(null, '', window.location.href);

        window.addEventListener('popstate', () => {
            page.unmount();
            div.remove();
        });

        page.mount(div);

        // const div = document.createElement('div');
        // el.current.appendChild(div);
        // const handlePopState = () => {
        //     page.unmount();
        //     div.remove();
        // };
    
        // window.history.pushState(null, '', window.location.href);
        // window.addEventListener('popstate', handlePopState);
    
        // page.mount(div);
    
        // // Cleanup event listener on component unmount
        // return () => {
        //     window.removeEventListener('popstate', handlePopState);
        // };
    }

    const getTipIntentId = async () => {
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/create-tip-intent/${id}`;            
        const response = await axios.post(url, 
            {
                narration: "Tip",
                type: "tip",
                amount: 0.5,
                depositAddress: "DEVeLKdf2SNpY5xVPyv8odUb6XdVzPGw6B7v8YL9uasC" 
            }
        );
            
        console.log(response);
        const clientSecret = response?.data?.clientSecret;
        return { clientSecret }
    }
    

    return (
        <>
            <Button size="sm" onClick={onClick}>
                Tip me <Coins /> 
            </Button>

            <div ref={el} />

        </>
    )
}

export default TipComponent2
