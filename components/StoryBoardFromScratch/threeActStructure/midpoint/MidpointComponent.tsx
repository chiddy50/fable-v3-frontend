"use client";

import { StoryInterface, StoryStructureInterface } from '@/interfaces/StoryInterface';
import React from 'react';

interface MidpointComponentProps {
  storyStructure: StoryStructureInterface,
  initialStoryData: StoryInterface,
  saveStory: (val: any) => null|object;
}

const MidpointComponent: React.FC<MidpointComponentProps> = ({
  storyStructure,
  initialStoryData,
  saveStory,
}) => {
  
  return (
    <div>
      <div className='border-b p-5'>
        <h1 className="font-bold text-2xl text-center mb-3">The Midpoint</h1>
        <p className="text-sm italic font-light text-gray-600 text-center">
            "What revelation or epiphany changes the protagonist's perspective, and how do they adapt to the new information? (e.g., discovering a secret, forming a new alliance, etc.)"  
        </p>
      </div>
    </div>
  )
}

export default MidpointComponent
