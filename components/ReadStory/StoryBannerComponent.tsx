"use client"

import { cn } from '@/lib/utils'
import React from 'react'

const StoryBannerComponent = ({
    image,
}) => {
  return (
    <div>
        {image &&                     
            <div>
            <img src={image} alt="" className='w-full object-cover h-[250px] mb-5 rounded-2xl' />          
            </div>
        }
    </div>
  )
}

export default StoryBannerComponent
