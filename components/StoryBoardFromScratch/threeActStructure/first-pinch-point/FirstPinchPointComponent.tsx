"use client";

import { StoryInterface, StoryStructureInterface } from '@/interfaces/StoryInterface';
import React from 'react';

interface FirstPinchPointProps {
  storyStructure: StoryStructureInterface,
  initialStoryData: StoryInterface,
  saveStory: (val: any) => null|object;
}

const FirstPinchPoint: React.FC<FirstPinchPointProps> = ({
  storyStructure,
  initialStoryData,
  saveStory,
}) => {
  
  return (
    <div>
      <div className='border-b p-5'>
        <h1 className="font-bold text-2xl text-center mb-3">First Pinch Point</h1>
        <p className="text-sm italic font-light text-gray-600 text-center">
          "What obstacle or challenge does the protagonist face that sets them back? What do they learn or discover about the antagonistic force?"
        </p>
      </div>
    </div>
  )
}

export default FirstPinchPoint
