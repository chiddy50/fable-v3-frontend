"use client";

import { StoryInterface, StoryStructureInterface } from '@/interfaces/StoryInterface';
import React from 'react';

interface MidpointComponentProps {
  storyStructure: StoryStructureInterface,
  initialStoryData: StoryInterface,
  saveStory: (val: any) => null|object;
}

const SecondPinchPointComponent: React.FC<MidpointComponentProps> = ({
  storyStructure,
  initialStoryData,
  saveStory,
}) => {

  return (
    <div>
      <div className='border-b p-5'>
        <h1 className="font-bold text-2xl text-center mb-3">Second Pinch Point</h1>
        <p className="text-sm italic font-light text-gray-600 text-center">
          "What happens that raises the stakes further and sets up the climax? (e.g., a character's betrayal, a new threat arises, etc.)"  
        </p>
      </div>
    </div>
  )
}

export default SecondPinchPointComponent
