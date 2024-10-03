"use client"

import React from 'react'
import { Button } from './ui/button'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { LogIn, LogOut } from 'lucide-react';

const AuthenticationButton = () => {
    const { user, setShowAuthFlow, handleLogOut } = useDynamicContext()

    return (
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
    )
}

export default AuthenticationButton
