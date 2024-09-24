import React from 'react'
import StoryScenes from "@/components/StoryScene/StoryScenes"
import { getStoriesData } from '@/lib/getStoryScenes';

function StoryScenesPage() {
    // const stories = getStoriesData()
    // console.log(stories);

    return (
        <div>
           { <StoryScenes />}
        </div>
    );
}

export default StoryScenesPage
