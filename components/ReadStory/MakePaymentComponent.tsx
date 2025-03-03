"use client";

import React, { useEffect, useRef, useState } from 'react'
import { Card } from '../ui/card'
import code from '@code-wallet/elements';
import { makeRequest } from '@/services/request';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { AxiosRequestConfig } from 'axios';

const MakePaymentComponent = ({
    story,
    accessRecord,
    depositAddress,
    refetch
}) => {
    const [mounted, setMounted] = useState<boolean>(false);

    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true)
        if(mounted && accessRecord?.hasAccess === false){
            const { button } = code.elements.create('button', {
                currency: 'usd',
                destination: depositAddress,
                amount: 0.05,
                // idempotencyKey: `${story?.id}`,
            });
        
            if (button 
                // && story
            ) {   
                console.log({el});
                
                button?.mount(el?.current!);

                button?.on('invoke', async () => {
                    // Get a payment intent from our own server
                    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/create-intent/${story?.id}`;
            
                    const response = await axiosInterceptorInstance.post(url, 
                        {
                            narration: "Read Story",
                            type: "read-story",
                            depositAddress             
                        }
                    );

                    // const res = await fetch(url, {
                    //     method: 'POST',
                    //     headers: {
                    //     'Content-Type': 'application/json',
                    //     'Authorization': `Bearer ${dynamicJwtToken}`,
                    //     },
                    //     body: JSON.stringify({
                    //         narration: "Read Story",
                    //         type: "read-story",
                    //         depositAddress
                    //     })
                    // });
                        
                    // const json = await res.json();
                    console.log(response);
                    const clientSecret = response?.data?.clientSecret;
                    console.log(clientSecret);
                    
                    
                    if (clientSecret) {
                        button.update({ clientSecret });                    
                    }              
                });            
        
                button?.on('success', async (event) => {

                    console.log("==PAYMENT SUCCESSFUL EVENT===", event);
                    
                    if (event) {
                        const { amount, clientSecret, currency, destination, locale, mode } = event?.options;
                        const intent = event?.intent;
                        
                        if (!story?.isPaid) {            
                            const response = await axiosInterceptorInstance.post(`${process.env.NEXT_PUBLIC_BASE_URL}/transactions/confirm/${intent}`, 
                                {
                                    storyId: story?.id,
                                    amount, clientSecret, currency, destination, locale, mode,
                                    type: 'read-story'        
                                }
                            );

                            if (response) {
                                refetch();
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

                        // let response = await makeRequest({
                        //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/${intent}`,
                        //     method: "DELETE", 
                        //     body: {
                        //         storyId: story?.id,
                        //         amount, clientSecret, currency, destination, locale, mode
                        //     }, 
                        //     token: dynamicJwtToken,
                        // });

                        const config: AxiosRequestConfig = {
                            data: {
                                amount, clientSecret, currency, destination, locale, mode,           
                                storyId: story?.id,
                            }
                          };
                        const response = await axiosInterceptorInstance.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/transactions/${intent}`, 
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
            {
                // !story?.isPaid && story?.storyStructure?.firstPlotPoint &&
                <div className="flex justify-center">
                    <Card className='my-5 p-7'>
                        <div className="flex justify-center">
                        <div ref={el} />
                        </div>
                        <p className='mt-3 text-xs text-center'>
                            Your trial session is over
                            <br/> 
                            Kindly make a payment of $0.05 to proceed
                        </p>                    
                    </Card>
                </div>     
            }
        </div>
    )
}

export default MakePaymentComponent
