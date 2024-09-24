import StoryBookComponent from '@/components/StoryBook/StoryBookComponent'
import React from 'react'

interface StoryBookPageProps {
    params: {
        id: string;
    };
}

function StoryBookPage({params: {id}}: StoryBookPageProps) {
    return (
        <div>
            <StoryBookComponent id={id}/>
        </div>
    )
}

export default StoryBookPage
