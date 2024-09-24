"use client";

import React from 'react';
import { StoryInterface, StoryStructureInterface } from '@/interfaces/StoryInterface';

interface ClimaxComponentProps {
  storyStructure: StoryStructureInterface,
  initialStoryData: StoryInterface,
  saveStory: (val: any) => null|object;
}

const ClimaxComponent: React.FC<ClimaxComponentProps> = ({
  storyStructure,
  initialStoryData,
  saveStory,
}) => {
  
  return (
    <div>
      <div className='border-b p-5'>
        <h1 className="font-bold text-2xl text-center mb-3">The Climax</h1>
        <p className="text-sm italic font-light text-gray-600 text-center">
          "What event or choice determines the outcome of the story? (e.g., a final confrontation, a sacrifice, etc.)"
        </p>
      </div>
    </div>
  )
}

export default ClimaxComponent
