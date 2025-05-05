"use client"

import { MessageCircle } from 'lucide-react'
import React from 'react'

const CommentBtnComponent = () => {
    return (
        <div className='flex items-center gap-1 bg-[#F5F5F5] rounded-xl p-2 cursor-pointer text-gray-600 border border-[#F5F5F5] hover:text-red-700 hover:border-red-100'>
            <MessageCircle size={14} />
            <span className="text-[10px]">0</span>
        </div>
    )
}

export default CommentBtnComponent
