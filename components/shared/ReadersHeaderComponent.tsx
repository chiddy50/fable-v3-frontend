"use client"

import React from 'react'
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export const ReadersHeaderComponent = ({ returnUrl, returnTitle }: { returnUrl: string, returnTitle: string }) => {
    return (
        // <nav className="fixed bg-transparent top-0 p-4 backdrop-blur-xl" style={{ position: 'sticky'}}>        
        <nav className="bg-none p-4 backdrop-blur-md backdrop-filter sticky top-0 z-10 border-b border-gray-100/30">
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-3'>
                    <Link href={returnUrl} className='text-black bg-white border cursor-pointer flex items-center justify-center py-2 px-2 rounded-lg transition-all hover:bg-gray-100'>
                        <ArrowLeft size={16} />
                    </Link>
                    <h2 className="text-gray-700 text-2xl font-bold">{returnTitle}</h2>
                </div>

                <div className="flex">
                    <div className="bg-white/30 cursor-pointer border flex items-center px-2 py-1 gap-2 rounded-md border-gray-200/50 hover:bg-white/50 transition-all">
                        <p className="stories-btn text-xs text-gray-600">
                            Total publications
                        </p>
                        <p className="bg-white text-lg rounded-sm px-2 py-1 font-semibold shadow-sm">200</p>
                    </div>
                </div>
            </div>
        </nav>
    )
}
