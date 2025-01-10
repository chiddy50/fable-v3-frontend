"use client";

import React, { useEffect, useRef, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Coins } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import code from '@code-wallet/elements';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import axios, { AxiosRequestConfig } from 'axios';
  
const TipComponent = ({ id, amount, destination }) => {
    const [mounted, setMounted] = useState<boolean>(false);
    const el = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setMounted(true)
        if(mounted){
            const { button } = code.elements.create('button', {
                currency: 'usd',
                destination: destination,
                amount: amount
            });
            
            if (button) {   
                
                button?.mount(el?.current!);

                button?.on('invoke', async () => {
                    // Get a payment intent from our own server
                    console.log({
                        narration: "Tip",
                        type: "tip",
                        amount: amount, 
                        destination: destination,
                    });
                    
                    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/tips/create-intent/${id}`;            
                    const response = await axios.post(url, 
                        {
                            narration: "Tip",
                            type: "tip",
                            amount: amount, 
                            destination: destination,
                        }
                    );
                        
                    const clientSecret = response?.data?.clientSecret;
                    
                    if (clientSecret) {
                        button.update({ clientSecret });                    
                    }              
                });            
        
                button?.on('success', async (event) => {
                    // Handle successful payment, the intent ID will be provided in the event object
                    console.log("==PAYMENT SUCCESSFUL EVENT===", event);
                    
                    if (event) {
                        const { amount, clientSecret, currency, destination, locale, mode } = event?.options;
                        const intent = event?.intent;
                        const response = await axiosInterceptorInstance.post(`/tips/confirm/${intent}`, 
                            {
                                userId: id,
                                amount, clientSecret, currency, destination, locale, mode
                            }
                        );

                        if (response) {
                        //     refetch();
                        //     openPublishModal();
                        }
  
                    }
                    
                    return true; // Return true to prevent the browser from navigating to the optional success URL provided in the confirmParams
                });
        
                button?.on('cancel', async (event) => {
                    // Handle cancelled payment, the intent ID will be provided in the event object
                    console.log("==PAYMENT CANCELLED EVENT===", event);
                    if (event) {
                        const { amount, clientSecret, currency, destination, locale, mode } = event?.options;
                        const intent = event?.intent;
                        
                        const config: AxiosRequestConfig = {
                            data: {
                                amount, clientSecret, currency, destination, locale, mode,           
                                userId: id,
                            }
                        };
                        const response = await axiosInterceptorInstance.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/tips/${clientSecret}`, 
                            config
                        );
            
                    }
                    return true; // Return true to prevent the browser from navigating to the optional cancel URL provided in the confirmParams
                });
            }
        }

    }, [mounted]);

    return (
        <>
            <div ref={el} />                        
        </>
    )
}

export default TipComponent
