"use client";

import React, { useEffect, useRef, useState } from 'react'
import code from '@code-wallet/elements';
import { makeRequest } from '@/services/request';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { AxiosRequestConfig } from 'axios';
import { Card } from '@/components/ui/card';
import { ArticleInterface } from '@/interfaces/ArticleInterface';


interface Props {
    article: ArticleInterface;
    refetch: () => void;
    openPublishModal: () => void;
}

const CreateArticlePaymentComponent: React.FC<Props>  = ({
    article,
    refetch,
    openPublishModal
}) => {
    const [mounted, setMounted] = useState<boolean>(false);

    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true)
        if(mounted && !article?.isPaid){
            const { button } = code.elements.create('button', {
                currency: 'usd',
                destination: process.env.NEXT_PUBLIC_CODE_WALLET_DEPOSIT_ADDRESS,
                amount: 0.5
            });
            
            if (button && article?.isPaid === false) {   
                
                button?.mount(el?.current!);

                button?.on('invoke', async () => {
                    // Get a payment intent from our own server
                    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/article/transactions/create-intent/${article?.id}`;            
                    const response = await axiosInterceptorInstance.post(url, 
                        {
                            narration: "Create Article",
                            type: "create-article",
                            amount: 0.5 
                        }
                    );
                        
                    console.log(response);
                    const clientSecret = response?.data?.clientSecret;
                    
                    // Update the button with the new client secret so that our server
                    // can be notified once the payment is complete.
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
                        
                        if (!article?.isPaid) {            

                            const response = await axiosInterceptorInstance.post(`/article/transactions/confirm/${intent}`, 
                                {
                                    articleId: article?.id,
                                    amount, clientSecret, currency, destination, locale, mode
                                }
                            );

                            if (response) {
                                refetch();
                                openPublishModal();
                            }
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

    return (
        <div>
            <div ref={el} />            
        </div>
    )
}

export default CreateArticlePaymentComponent
