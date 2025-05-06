"use client"

import React from 'react'

const GenrePillsComponent = ({ genres }: { genres: string[] }) => {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {
                genres?.map(genre => (
                    <span key={genre} className="px-2.5 py-[1.5px] bg-gray-100 text-gray-800 rounded-sm text-[10px]">{genre}</span>
                ))
            }
        </div>  
    )
}

export default GenrePillsComponent
