"use client"

import { Button } from '@/components/ui/button';
import { Check, Edit } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ModifyHookComponent from './ModifyHookComponent';
import ViewCharactersComponent from './ViewCharactersComponent';
import { ThreeActStructureInterface } from '@/interfaces/PlotInterface';
import { SuspenseTechniqueInterface } from '@/interfaces/SuspenseTechniqueInterface';
import { Option } from '@/components/ui/multiple-selector';
import { StoryInterface, StoryStructureInterface, SuggestionItem } from '@/interfaces/StoryInterface';
import { Steps } from 'intro.js-react';
import ModifyCharacterComponent from './ModifyCharacterComponent';
import { CharacterInterface } from '@/interfaces/CharacterInterface';

const steps = [
    {
      element: '.selector1',
      intro: 'test 1',
      position: 'right',
      tooltipClass: 'myTooltipClass',
      highlightClass: 'myHighlightClass',
    },
    {
      element: '.selector2',
      intro: 'test 2',
      position: 'left',
      tooltipClass: 'myTooltipClass',
      highlightClass: 'myHighlightClass',
    },
    {
      element: '.selector3',
      intro: 'test 3',
      position: 'top',
      tooltipClass: 'myTooltipClass',
      highlightClass: 'myHighlightClass',
    },
];

interface HookComponentProps {
    storyStructure: StoryStructureInterface,
    initialStoryData: StoryInterface,
    saveStory: (val: any) => null|object;
}
  
const HookComponent: React.FC<HookComponentProps> = ({
    storyStructure,
    initialStoryData,
    saveStory
}) => {
    const [openModifyHookModal, setOpenModifyHookModal] = useState<boolean>(false);
    const [openModifyCharacterModal, setOpenModifyCharacterModal] = useState<boolean>(false);
    const [openViewCharactersModal, setOpenViewCharactersModal] = useState<boolean>(false);
    const [selectedHooks, setSelectedHooks] = useState<string[]>(initialStoryData?.storyStructure.hook || []);
    const [hookSuggestions, setHookSuggestions] = useState<string[]>(initialStoryData?.storyStructure.hookSuggestions || []);
    const [selectedCharacter, setSelectedCharacter] = useState<CharacterInterface|null>(null);

    useEffect(() => {
        // formatHookSuggestions();
    }, [initialStoryData]);

    const formatHookSuggestions = () => {
        if (initialStoryData?.storyStructure.hookSuggestions) {            
            // let suggestions = initialStoryData?.storyStructure.hookSuggestions.map(suggestion => ( { value: suggestion, label: suggestion } ));            
            // console.log({suggestions})            
            setHookSuggestions(initialStoryData?.storyStructure.hookSuggestions);
        }
    }

    const onExit = () => {}

    const openEditCharacterModal = (character: CharacterInterface) => {
        console.log({character});
        
        setSelectedCharacter(character);
        setOpenViewCharactersModal(false)
        setOpenModifyCharacterModal(true)
    }

    return (
        <div>
            <div className='border-b p-5'>
                <h1 className="font-bold text-2xl text-center mb-3">The Hook</h1>
                <p className="text-sm italic font-light text-gray-600 text-center">
                    "What's the most attention-grabbing event or situation that sets the story in motion?"  
                </p>
            </div>

            <div className='p-5'>
                <div className='mb-5'>
                    <p className='text-sm font-bold text-gray-500 italic'>Hook:</p>
                    {/* <p className='text-xs'>{initialStoryData?.storyStructure.hookSummary}</p> */}
                    <ul className='mb-5'>
                        {
                            storyStructure?.hook?.map((hook, index) => (
                                <li className='text-xs flex items-center gap-2 mb-1' key={`_${index}_`}> 
                                    <div className='flex items-start'>
                                        <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                                    </div>
                                    <span>{hook}</span>
                                </li>
                            ))
                        }
                    </ul>                    
                </div>
                {/* <div className='mb-5'>
                    <p className='text-sm font-bold text-gray-500 italic selector3'>Character(s):</p>
                    <ul>
                        {
                            initialStoryData?.suggestedCharacters?.map((character, index) => (
                                <li className='text-xs flex items-center gap-2 mb-1' key={`${character.name}_${index}`}> 
                                    <div className='flex items-start'>
                                        <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                                    </div>
                                    <span>{character?.name}: {character?.role}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div> */}

                <Button size='sm' className='mr-5 selector1' onClick={() => setOpenModifyHookModal(true)}>
                    Modify Hook
                    <Edit className='ml-2 w-4 h-4'/>
                </Button>
                <Button size='sm' className='selector2' onClick={() => setOpenViewCharactersModal(true)}>
                    Modify Characters
                    <Edit className='ml-2 w-4 h-4 '/>
                </Button>
            </div>

            <ModifyHookComponent 
                openModifyHookModal={openModifyHookModal}
                setOpenModifyHookModal={setOpenModifyHookModal}
                hook={initialStoryData?.storyStructure?.hook}
                selectedHooks={selectedHooks} 
                setSelectedHooks={setSelectedHooks}
                hookSuggestions={hookSuggestions}
                setHookSuggestions={setHookSuggestions}
                initialStoryData={initialStoryData}
                saveStory={saveStory}
            />

            <ViewCharactersComponent 
                openViewCharactersModal={openViewCharactersModal} 
                setOpenViewCharactersModal={setOpenViewCharactersModal}
                initialStoryData={initialStoryData}
                saveStory={saveStory}
                openEditCharacterModal={openEditCharacterModal}
            />

            <ModifyCharacterComponent
                openModifyCharacterModal={openModifyCharacterModal}
                setOpenModifyCharacterModal={setOpenModifyCharacterModal}
                initialStoryData={initialStoryData}
                saveStory={saveStory}          
                selectedCharacter={selectedCharacter}  
            />

            {/* <Steps
                enabled={true}
                steps={steps}
                initialStep={0}
                onExit={onExit}
            /> */}
            
        </div>
    )
}

export default HookComponent
