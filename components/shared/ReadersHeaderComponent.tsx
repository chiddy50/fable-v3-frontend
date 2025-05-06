"use client"

import React from 'react'
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export const ReadersHeaderComponent = ({ returnUrl, returnTitle }: { returnUrl: string, returnTitle: string }) => {
    return (
        // <nav className="fixed bg-transparent top-0 p-4 backdrop-blur-xl" style={{ position: 'sticky'}}>        
        <nav className="bg-transparent p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-3'>
                    <Link href={returnUrl} className='text-black bg-white border cursor-pointer flex items-center justify-center py-2 px-2 rounded-lg transition-all'>
                        <ArrowLeft size={16} />
                    </Link>
                    <h2 className="text-gray-500 text-2xl font-bold">{returnTitle}</h2>
                </div>

                <div className="flex ">
                    <div className="bg-[#D8D1DE3D] cursor-pointer border  flex items-center px-2 py-1 gap-2 rounded-md border-gray-50 hover:bg-gray-200">
                        <p className="stories-btn text-xs text-gray-500">
                            Total publications
                        </p>
                        <p className=" bg-white text-lg rounded-sm px-2 py-1 font-semibold">200</p>
                    </div>
                </div>
            </div>
        </nav>
    )
}
