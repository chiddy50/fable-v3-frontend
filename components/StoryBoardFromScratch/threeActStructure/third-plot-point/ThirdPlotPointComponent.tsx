"use client";

import React from 'react';
import { StoryInterface, StoryStructureInterface } from '@/interfaces/StoryInterface';

interface ThirdPlotPointComponentProps {
  storyStructure: StoryStructureInterface,
  initialStoryData: StoryInterface,
  saveStory: (val: any) => null|object;
}

const ThirdPlotPointComponent: React.FC<ThirdPlotPointComponentProps> = ({
  storyStructure,
  initialStoryData,
  saveStory,
}) => {
  
  return (
    <div>
      <div className='border-b p-5'>
        <h1 className="font-bold text-2xl text-center mb-3">Third Plot Point</h1>
        <p className="text-sm italic font-light text-gray-600 text-center">
          "What false victory or moment of triumph does the protagonist experience before the low moment? (e.g., defeating a minor villain, discovering a plot twist, etc.)"
        </p>
      </div>
    </div>
  )
}

export default ThirdPlotPointComponent
