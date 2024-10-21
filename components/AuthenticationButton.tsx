"use client"

import React, { useContext, useEffect, useState } from 'react'
import { Button } from './ui/button';
import { LogIn, LogOut } from 'lucide-react';

import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Adapters
import { AppContext } from '@/context/MainContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AuthenticationButton = () => {
    // const { user, setShowAuthFlow, handleLogOut } = useDynamicContext()
    const [isMounted, setIsMounted] = useState(false);
    
    
    const { 
        isLoggedIn, setIsLoggedIn,

        web3auth, setWeb3auth,
        provider, setProvider,
        loggedIn, setLoggedIn,
        address, setAddress,
    } = useContext(AppContext)
    const [openLogoutModal, setOpenLogoutModal] = useState<boolean>(false);

    const { push, refresh } = useRouter()

    useEffect(() => {
        setIsMounted(true)
        const token = sessionStorage.getItem("token");
        setIsLoggedIn(token ? true : false);
        // if (isMounted === true) {            
        // }

    }, [isMounted, setIsLoggedIn]);


    const logout = async () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("storyId");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("storyId");
        setIsLoggedIn(false);
        window.location.href = "/"
    };

    const confirmLogout = async () => {

        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
        window.location.href = "/"
    }

    const truncateString = (inputString: string) => {
        if (inputString.length <= 8) {
            return inputString; // If the string is already 8 characters or less, return it unchanged
        } else {
            const truncatedString = inputString.slice(0, 4) + '...' + inputString.slice(-4);
            return truncatedString;
        }
    }

    const copyToClipboard = () => {
        if (address) {            
            navigator.clipboard.writeText(address);
            toast.success("Wallet address copied!");
        }        
    };


    const loggedInView = (
        <div className='flex items-center gap-4'>
            {/* <div className="flex items-center bg-white py-2 px-3 border gap-2 rounded-3xl">
                <div 
                onClick={copyToClipboard}
                className="border cursor-pointer flex items-center rounded-full hover:bg-gray-700 hover:text-white hover:border-white pr-2">                        
                    <div className="h-6 w-6 rounded-full flex items-center justify-center ">
                        <i className='bx bx-copy text-xs'></i>
                    </div>
                    <p className="text-[9px]" id="primary-wallet-address">
                        {truncateString(address)}
                    </p>
                </div>
                <div className="border cursor-pointer h-6 w-6 rounded-full flex items-center justify-center hover:bg-gray-700 hover:text-white hover:border-white">
                    <i className="bx bx-user text-xs"></i>
                </div>
            </div> */}
            <Button
            onClick={logout} 
            variant="outline" 
            className='flex items-center gap-1 border-green-400 text-green-500 hover:text-green-400'>
                <span>Logout</span>
                <LogIn className='w-4 h-4'></LogIn>
            </Button>
        </div>
    )

    const unloggedInView = (
        <>
        {/* <Button
        // onClick={login} 
        variant="outline" 
        className='flex items-center gap-1 border-green-400 text-green-500 hover:text-green-400'>
            <span>Login</span>
            <LogIn className='w-4 h-4'></LogIn>
        </Button> */}
        
        </>
        
    )

    return (
        <div className=''>
            {/* <div className='absolute top-5 right-5'> */}
            <div className="">{isLoggedIn ? loggedInView : unloggedInView}</div>

            <AlertDialog open={openLogoutModal} onOpenChange={setOpenLogoutModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={confirmLogout}>Logout</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default AuthenticationButton
