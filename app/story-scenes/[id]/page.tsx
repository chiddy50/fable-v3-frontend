import Story from '@/components/Story';
import StorySceneComponent from '@/components/StoryScene/StorySceneComponent';
import { getAllStories, getStory } from '@/lib/getAllStories';
import { getStoryData } from '@/lib/getStoryScenes';
import { notFound } from 'next/navigation';
import React from 'react'

interface StoryPageProps {
    params: {
      id: string;
    };
}
function StorySettingsPage({params: {id}}: StoryPageProps) {
  // Explanation: The id is URL encoded, so we need to decode it before using it to get the story.
  // This fixes the issue where the story is not found when the id contains special characters such as %20 for spaces

  // const decodedId = decodeURIComponent(id);

  // const story = getStoryData(decodedId);

  // if (!story) {
  //   return notFound();    
  // }

  return <StorySceneComponent />
}

export default StorySettingsPage
