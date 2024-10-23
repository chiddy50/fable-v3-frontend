"use client"

import { cn } from '@/lib/utils'
import React from 'react'

const StoryBannerComponent = ({
    image,
}) => {
  return (
    <div className='mb-10 mt-10'>
      { image &&                     
        <div className='flex justify-center'>
          <img src={image} alt="" className='w-[800px] object-cover h-[400px] mb-5 rounded-2xl' />          
        </div>
      }
    </div>
  )
}

export default StoryBannerComponent
