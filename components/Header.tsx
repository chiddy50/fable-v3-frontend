"use client";

import Link from 'next/link'
import React from 'react'
import { BookOpen, FilePen, LogIn, LogOut } from 'lucide-react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from './ui/button';

function Header() {
  const { user, primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext()

  return (
    <header className='relative p-16 text-center'>
      <Link href="/">
          <h1 className='text-7xl font-black'>Fable AI</h1>
          <div className="flex justify-center whitespace-nowrap space-x-5 tracking-widest text-3xl lg:text-3xl">
              <h2>Where every user is an</h2>
              {/* <h2>Write Better Stories</h2> */}
              <div className="relative">
                  <div className="
                  absolute bg-yellow-400 border border-gray-800 -left-2 -top-1 
                  -bottom-1 -right-2 md:-left-3 md:-top-0 
                  md:-bottom-0 md:-right-3 -rotate-1" />

                  <p className="relative text-gray-800">Author!</p>
                  {/* <p className="relative text-white">Faster!</p> */}
              </div>
          </div>
      </Link>

      <div className='absolute top-5 right-5'>
        {
          !user &&
          <Button 
          onClick={() => setShowAuthFlow(true)} 
          variant="outline" 
          className='flex items-center gap-1 border-blue-400 text-blue-500 hover:text-blue-400'>
            <span>Login</span>
            <LogIn className='w-4 h-4'></LogIn>
          </Button>
        }
        {
          user &&
          <Button 
          onClick={() => handleLogOut()} 
          variant="outline" 
          className='flex items-center gap-1 border-blue-400 text-blue-500 hover:text-blue-400'>
            <span>Logout</span>
            <LogOut className='w-4 h-4'></LogOut>
          </Button>
        }
      </div>

      {/* NAV ICONS */}
      <div className='absolute -top-5 left-5 flex space-x-2'>
        
        <Link href='/'>
          <FilePen
          className='w-8 h-8 lg:w-10 lg:h-10 mx-auto text-blue-500 mt-10 border border-blue-500 p-2 rounded-md hover:opacity-50 cursor-pointer'
          ></FilePen>
        </Link>

        <Link href='/stories'>
          <BookOpen
          className='w-8 h-8 lg:w-10 lg:h-10 mx-auto text-blue-500 mt-10 border border-blue-500 p-2 rounded-md hover:opacity-50 cursor-pointer'
          ></BookOpen>
        </Link>
      </div>

      

    </header>
  )
}  

export default Header
