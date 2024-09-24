"use client";

import React from 'react'
import { LogIn, LogOut, Menu } from 'lucide-react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from '../ui/button';

const DashboardHeader = () => {
    const { user, primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext()

    return (
        <nav id="nav-header" className='flex items-center justify-between p-7'>
                
            <div>
                <Menu/>
            </div>

            <div className='absolute top-5 right-5'>
                {
                !user &&
                <Button 
                onClick={() => setShowAuthFlow(true)} 
                variant="outline" 
                className='flex items-center gap-1 border-green-400 text-green-500 hover:text-green-400'>
                    <span>Login</span>
                    <LogIn className='w-4 h-4'></LogIn>
                </Button>
                }
                {
                user &&
                <Button 
                onClick={() => handleLogOut()} 
                variant="outline" 
                className='flex items-center gap-1 border-green-400 text-green-500 hover:text-green-400'>
                    <span>Logout</span>
                    <LogOut className='w-4 h-4'></LogOut>
                </Button>
                }
            </div>

            {/* <div className="flex items-center bg-white py-2 px-3  gap-2 rounded-3xl">
                <div className="border cursor-pointer flex items-center border-[#46aa41] rounded-full hover:bg-[#46aa41] hover:text-white hover:border-white pr-2">                        
                    <div className="h-6 w-6 rounded-full flex items-center justify-center ">
                        <i className='bx bx-copy text-xs'></i>
                    </div>
                    <p className="text-[9px]" id="primary-wallet-address">
                        zkdmdv...vdsmds
                    </p>
                </div>
                <div className="border cursor-pointer border-[#46aa41] h-6 w-6 rounded-full flex items-center justify-center hover:bg-[#46aa41] hover:text-white hover:border-white">
                    <i className="bx bx-user text-xs"></i>
                </div>

            </div> */}

        </nav>
    )
}

export default DashboardHeader
