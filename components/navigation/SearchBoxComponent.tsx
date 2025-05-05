"use client"

import React from 'react'

const SearchBoxComponent = () => {
    return (
        <div className='bg-[#F5F5F5] py-1 pl-3 pr-10 gap-1 rounded-xl flex items-center'>
            <i className='bx bx-search text-xl text-gray-600'></i>
            <input type="text" placeholder='Search stories, creators, e.t.c' className='text-xs pr-4 py-2 outline-0 w-full' />
        </div>
    )
}

export default SearchBoxComponent
