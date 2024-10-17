"use client";

import React, { useEffect, useState } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from '@/components/ui/input';
import { hidePageLoader, isValidSolanaAddress, showPageLoader } from '@/lib/helper';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const UserProfilePage = () => {
    const [username, setUsername]= useState<string>('');    
    const [depositAddress, setDepositAddress]= useState<string>('');    
    const [tipLink, setTipLink]= useState<string>('');
    const [authUser, setAuthUser]= useState<{name: string, depositAddress: string, tipLink: string} | null>(null);   

    useEffect(() => {
        getUserInformation();
    }, [])
    
    const getUserInformation = async () => {
        try {
            showPageLoader()
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/auth`;

            const response = await axiosInterceptorInstance.get(url, {
                params: null,
            });
            console.log(response);
            
            const user = response?.data?.user;
            if (!user) {
                toast.error("Something went wrong");
                return;
            }

            setDepositAddress(user?.depositAddress);
            setTipLink(user?.tipLink)
            setUsername(user?.name)
            setAuthUser(user);
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }        
    }

    const updateUserInformation = async () => {
        if(!validateForm()) return;
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/users`;
            showPageLoader()
            const response = await axiosInterceptorInstance.put(url, 
                {
                    name: username,
                    depositAddress,
                    tipLink    
                }
            );

            await getUserInformation()
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const validateForm = () => {
        if (!username) {
            toast.error("Username is required")
            return false;
        }

        if (depositAddress && !isValidSolanaAddress(depositAddress)) {
            toast.error("Invalid KIN deposit address");
            return false;
        }
        return true;
    }

    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Profile</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="my-10 bg-gray-50 p-7 rounded-2xl">
                <h1 className="text-xl font-bold mb-7">User Profile</h1>

                <div className="mb-4">
                    <p className="mb-1 text-xs font-semibold">Username</p>
                    <Input 
                    defaultValue={username}
                    onKeyUp={(e) => setUsername(e.target.value)} 
                    className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                    placeholder='Display Name'
                    />
                </div>

                <div className="mb-4">
                    <p className="mb-1 text-xs font-semibold">Kin wallet address</p>
                    <div className="flex border items-center bg-white rounded-2xl p-1.5">
                        <div className='flex items-center'>
                            {
                                authUser?.depositAddress &&
                                <a href={`https://explorer.solana.com/address/${authUser?.depositAddress}`} className='cursor-pointer'>
                                    <img src="/images/codeImage.png" className='w-6 h-6' alt="code wallet icon" />
                                </a>
                            }
                            { !authUser?.depositAddress && <img src="/images/codeImage.png" className='w-6 h-6' alt="code wallet icon" /> }
                        </div>
                        <input type="text" 
                        value={depositAddress}
                        className='w-full h-full text-xs pr-4 pl-2 py-2 outline-none border-none'
                        placeholder='5wBP4XzTEVoVxkEm4e5NJ2Dgg45DHkH2kSweGEJaJ91w'
                        onChange={(e) => setDepositAddress(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="mb-5">
                    <p className="mb-1 text-xs font-semibold">Tip card link</p>

                    <div className="flex border bg-white items-center rounded-2xl p-1.5">
                        <div className='flex items-center'>
                            <img src="/images/codeImage.png" className='w-6 h-6' alt="code wallet icon" />
                        </div>
                        <input type="text" 
                        className='w-full h-full text-xs pr-4 pl-2 py-2 outline-none border-none'
                        placeholder='https://tipcard.getcode.com/X/x-handle'
                        value={tipLink}
                        onChange={(e) => setTipLink(e.target.value)} 
                        />
                    </div>
                </div>

                <Button onClick={updateUserInformation} className="w-full">Save</Button>

            </div>
        </div>
    )
}

export default UserProfilePage
