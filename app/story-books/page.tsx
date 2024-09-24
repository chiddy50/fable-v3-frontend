import StoryBooksComponent from '@/components/StoryBook/StoryBooksComponent'
import { getStoryBooks } from '@/lib/getAllStories'
import { StoryBook } from '@/types/stories'
import React from 'react'

function StoryBooksPage() {

    return (
        <div className='p-10 max-w-7xl mx-auto'>      
            <StoryBooksComponent />
        </div>
    )
}

export default StoryBooksPage
