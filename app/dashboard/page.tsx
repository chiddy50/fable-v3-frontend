"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const DashboardPage = () => {
  return (
    <div className='h-full min-h-screen relative w-full'>


      <h1 className="text-4xl font-bold mt-10 text-center ">
        What are you doing today?
      </h1>

      <div className="mt-10">
        <div className='grid grid-cols-2 gap-5 mx-auto w-[50%] bg-white p-7 rounded-2xl'>
          
          <Link href="/dashboard/story-books" className='border rounded-2xl hover:border-gray-700 cursor-pointer'>
            <div>
              <Image src="/book.svg" alt="image" className="w-full object-cover" width={200} height={200} />
            </div>
            <div className='p-5 bg-gray-50 flex justify-center'>
              <h1 className='font-bold text-gray-700 '>Story Book</h1>
            </div>
          </Link>

          <Link href="/dashboard/stories" className='border rounded-2xl hover:border-gray-700 cursor-pointer'>
            <div>
              <Image src="/wizard.svg" alt="image" className="w-full " width={200} height={200} />
            </div>
            <div className='p-5 bg-gray-50 flex justify-center'>
              <h1 className='font-bold text-gray-700'>Write Story</h1>
            </div>
          </Link>

        </div>
      </div>

    </div>
  )
}

export default DashboardPage
