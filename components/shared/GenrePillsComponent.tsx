"use client"

import React from 'react'

const GenrePillsComponent = ({ genres }: { genres: string[] }) => {
    return (
        <div className="flex items-center gap-2">
            {
                genres?.map(genre => (
                    <span key={genre} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-[10px]">{genre}</span>
                ))
            }
        </div>  
    )
}

export default GenrePillsComponent
