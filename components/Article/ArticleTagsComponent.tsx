"use client";

import React from 'react'
import { Badge } from "@/components/ui/badge"

const ArticleTagsComponent = ({ data }) => {
    return (
        <div className='flex flex-wrap gap-2 mt-2'>
        {
            data.map(tag => (
                <div key={tag.id}>
                    <Badge className='text-[0.6rem]'>{tag?.articleTag?.title}</Badge>
                </div>
            ))
        }
        </div>
    )
}

export default ArticleTagsComponent
