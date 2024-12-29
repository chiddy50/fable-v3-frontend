"use client";

import React, { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import code from '@code-wallet/elements';
import { makeRequest } from '@/services/request';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { AxiosRequestConfig } from 'axios';

const GetCodeBlock = ({ 
    amount, 
    depositAddress, 
    accessRecord, 
    article, 
    getArticle 
}) => {
    const [mounted, setMounted] = useState<boolean>(false);

    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true)
        // if(mounted && accessRecord?.hasAccess === false){
        if(mounted){
            console.log({
                message: "Mounting...",
                depositAddress,
                amount: parseFloat(amount),
            });
            
            const { button } = code.elements.create('button', {
                currency: 'usd',
                destination: depositAddress,
                amount: parseFloat(amount),
                // idempotencyKey: `${story?.id}`,
            });
        
            if (button 
                // && story
            ) {   
                console.log({el});
                
                button?.mount(el?.current!);

                button?.on('invoke', async () => {
                    // Get a payment intent from our own server
                    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/article/transactions/create-intent/${article?.id}`;            
            
                    const response = await axiosInterceptorInstance.post(url, 
                        {
                            narration: "Read Article",
                            type: "read-article",
                            depositAddress,
                            customPrice: article?.price          
                        }
                    );
                    console.log(response);
                    const clientSecret = response?.data?.clientSecret;                    
                    
                    if (clientSecret) {
                        button.update({ clientSecret });                    
                    }              
                });            
        
                button?.on('success', async (event) => {

                    console.log("==PAYMENT SUCCESSFUL EVENT===", event);
                    
                    if (event) {
                        const { amount, clientSecret, currency, destination, locale, mode } = event?.options;
                        const intent = event?.intent;
                        
                        // if (!article?.isPaid) {   
                            const response = await axiosInterceptorInstance.post(`/article/transactions/confirm/${intent}`, 
                                {
                                    articleId: article?.id,
                                    amount, clientSecret, currency, destination, locale, mode,
                                    type: 'read-article'        
                                }
                            );

                            if (response) {
                                getArticle();
                            }
                        // }
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
                                storyId: article?.id,
                            }
                        };

                        const response = await axiosInterceptorInstance.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/article/transactions/${intent}`, 
                            config
                        );            
                    }
                    return true; // Return true to prevent the browser from navigating to the optional cancel URL provided in the confirmParams
                });
            }
        }

    }, [mounted]);
    return <div ref={el}></div>;
};

export default GetCodeBlock;
