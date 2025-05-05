"use client"

import React, { useState } from 'react'
import { BookmarkPlus } from 'lucide-react';

const BookmarkComponent = () => {
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [bookmarked, setBookmarked] = useState<boolean>(false);

    const handleOnClick = () => {
        let bookMarkValue = bookmarked ? false : true;

        setShowNotification(true)
        setBookmarked(bookMarkValue)

        setTimeout(() => {
            setShowNotification(false)
        }, 1000);
    }

    return (
        <div 
        onClick={handleOnClick}
        className={`bg-[#F5F5F5] relative rounded-2xl p-2 cursor-pointer border border-[#F5F5F5] text-gray-500 hover:text-red-700 hover:border-red-100 
        ${bookmarked ? 'text-red-700 border-red-100' : ''}
        `}>
            <BookmarkPlus size={14} />

            {showNotification && <div className="bg-gray-600 absolute -top-7 -right-5 text-[10px] text-white rounded-2xl py-1 px-3">        
                Saved!
            </div>}
        </div>
    )
}

export default BookmarkComponent
