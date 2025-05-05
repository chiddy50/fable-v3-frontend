"use client";

import React, { useEffect, useRef, useState } from 'react';
import code from '@code-wallet/elements';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const BuyCreditComponent = ({ amount, getAuthor }: { amount: string|number, getAuthor: () => void }) => {
    console.log({amount1: amount});
    
    const [mounted, setMounted] = useState<boolean>(false);
    const buttonRef = useRef<any>(null); // Store button instance reference
    const currentAmountRef = useRef(amount); // Store current amount for invoke handler

    // Reference for the button element
    const el = useRef<HTMLDivElement>(null);

    // Keep currentAmountRef updated with the latest amount prop
    useEffect(() => {
        currentAmountRef.current = amount;
    }, [amount]);

    // Initialize the button once when component mounts
    useEffect(() => {
        setMounted(true);
        
        // Create the button only once when component mounts
        if (!buttonRef.current && typeof window !== 'undefined') {
            const { button } = code.elements.create('button', {
                currency: 'usd',
                destination: process.env.NEXT_PUBLIC_CODE_WALLET_DEPOSIT_ADDRESS,
                amount,
            });
            
            if (button) {   
                console.log('Button created with initial amount:', amount);
                buttonRef.current = button;
                button.mount(el.current!);

                button.on('invoke', async () => {
                    // Always use the current amount from the ref, not the closure value
                    const currentAmount = currentAmountRef.current;
                    console.log('Button invoked with current amount:', currentAmount);
                    if (parseInt(currentAmount) < 0) {
                        toast.error("Kindly provide a valid amount");
                        return;
                    }
                    
                    // Get a payment intent from our own server
                    const response = await axiosInterceptorInstance.post(`/credits`, 
                        {
                            narration: "Credit Purchase",
                            destination: process.env.NEXT_PUBLIC_CODE_WALLET_DEPOSIT_ADDRESS,
                            type: "credit-purchase",
                            amount: currentAmount, // Use current amount
                            purpose: "purchase",
                            description: `Bought ${currentAmount} Credits` 
                        }
                    );
                        
                    console.log(response);
                    const clientSecret = response?.data?.clientSecret;
                    
                    // Update the button with the new client secret so that our server
                    // can be notified once the payment is complete.
                    if (clientSecret) {
                        button.update({ 
                            clientSecret,
                            amount: currentAmount // Important: Update amount here too
                        });                    
                    } 
                });

                button?.on('success', async (event) => {
                    // Handle successful payment, the intent ID will be provided in the event object
                    console.log("==PAYMENT FOR CREDIT SUCCESSFUL EVENT===", event);
                    
                    if (event) {
                        const { amount, clientSecret, currency, destination, locale, mode } = event?.options;
                        const intent = event?.intent;
                        
                        const response = await axiosInterceptorInstance.put(`/credits/confirm/${intent}`, 
                            {
                                amount, clientSecret, currency, destination, locale, mode,
                                purpose: "purchase",
                                description: `Bought ${amount} Credits` 
                            }
                        );

                        if (response) {
                            getAuthor()
                            // refetch();
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
                            }
                        };
                        const response = await axiosInterceptorInstance.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/tips/${intent}`, 
                            config
                        );
            
                    }
                    return true; // Return true to prevent the browser from navigating to the optional cancel URL provided in the confirmParams
                });
            }
        }
    }, []);

    // Separate useEffect to update button amount when it changes
    useEffect(() => {
        if (buttonRef.current && mounted) {
            console.log('Updating button with new amount:', amount);
            buttonRef.current.update({ amount });
        }
    }, [amount, mounted]);


    return (
        <div className="w-full flex justify-center">
            <div ref={el} />
        </div>        
    );
};

export default BuyCreditComponent;