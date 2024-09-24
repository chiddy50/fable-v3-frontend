"use client";

import { Button } from '@/components/ui/button';
import { StoryInterface, StoryStructureInterface, SuggestionItem } from '@/interfaces/StoryInterface';
import { Edit, MinusCircleIcon, Check } from 'lucide-react';
import React, { useState } from 'react';
import ModifyExpositionComponent from './ModifyExpositionComponent';

interface ExpositionComponentProps {
    storyStructure: StoryStructureInterface,
    initialStoryData: StoryInterface,
    saveStory: (val: any) => null|object;
}

const ExpositionComponent: React.FC<ExpositionComponentProps> = ({
    initialStoryData,
    saveStory,
    storyStructure
}) => {
    const [openModifyExpositionModal, setOpenModifyExpositionModal] = useState<boolean>(false);
    const [selectedExpositions, setSelectedExpositions] = useState<string[]>(initialStoryData?.storyStructure.exposition || []);
    const [expositionSuggestions, setExpositionSuggestions] = useState<string[]>(initialStoryData?.storyStructure.expositionSuggestions || []);

    return (
        <div>
            <div className='border-b p-5'>
                <h1 className="font-bold text-2xl text-center mb-3">The Exposition</h1>
                <p className="text-sm italic font-light text-gray-600 text-center">
                "The exposition provides the important background details and context for the story. It introduces the main characters, the setting, and the basic situation, like where and when the story takes place."                
                </p>
            </div>

            <div className='p-5'>
                <ul className='mb-5'>
                    {
                        storyStructure?.exposition?.map((exposition, index) => (
                            <li className='text-xs flex items-center gap-2 mb-1' key={`_${index}_`}> 
                                <div className='flex items-start'>
                                    <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                                </div>
                                <span>{exposition}</span>
                            </li>
                        ))
                    }
                </ul>

                <Button size='sm' className='mr-5' 
                onClick={() => setOpenModifyExpositionModal(true)}
                >
                    Modify Exposition
                    <Edit className='ml-2 w-4 h-4'/>
                </Button>
            </div>

            <ModifyExpositionComponent 
                openModifyExpositionModal={openModifyExpositionModal}
                setOpenModifyExpositionModal={setOpenModifyExpositionModal}
                selectedExpositions={selectedExpositions} 
                setSelectedExpositions={setSelectedExpositions}
                expositionSuggestions={expositionSuggestions}
                setExpositionSuggestions={setExpositionSuggestions}
                initialStoryData={initialStoryData}
                saveStory={saveStory}
            />
        </div>
    )
}

export default ExpositionComponent
