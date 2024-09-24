"use client";

import { Button } from '@/components/ui/button';
import { StoryInterface, StoryStructureInterface } from '@/interfaces/StoryInterface';
import { ArrowLeft, ArrowRight, Check, Edit, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { charactersToString, extractCharacters, extractCharacterSummary, extractTemplatePrompts, queryLLM, threeActStructureDefinition } from '@/services/LlmQueryHelper';
import { hidePageLoader, showPageLoader } from '@/lib/helper';

import { CharacterInterface, SuggestedCharacterInterface } from '@/interfaces/CharacterInterface';
import ProtagonistGoalMotivationsComponent from './ProtagonistGoalMotivationsComponent';
import ProtagonistEmotionTriggerEventComponent from './ProtagonistEmotionTriggerEventComponent';
import Image from 'next/image';
import CharacterComponent from '../CharacterComponent';
import HowCharacterOvercomeObstaclesComponent from './HowCharacterOvercomeObstaclesComponent';
import HowCharacterGoalChangeRelationshipsComponent from './HowCharacterGoalChangeRelationshipsComponent';

interface ConfrontationComponentProps {
    storyStructure: StoryStructureInterface,
    initialStory: StoryInterface,
    initialConfrontationStep: number;
    saveStory: (val: any) => null|object;
    moveToNext: () => void;
    moveToPrev: () => void;
    refetch:() => void;
}

const ConfrontationComponent: React.FC<ConfrontationComponentProps> = ({
    initialStory,
    storyStructure,
    saveStory,
    initialConfrontationStep,
    moveToPrev,
    moveToNext,
    refetch,
}) => {
    console.log({initialStory});
    
    const [confrontationStep, setConfrontationStep] = useState<number>(initialConfrontationStep ? Number(initialConfrontationStep) : 1)

    const [selectedCharacter, setSelectedCharacter] = useState<CharacterInterface|null>(null);
    
    // QUESTION 1
    const [openProtagonistMotivationsModal, setOpenProtagonistMotivationsModal] = useState<boolean>(false);

    // QUESTION 2
    const [openProtagonistEmotionTriggerEventModal, setOpenProtagonistEmotionTriggerEventModal] = useState<boolean>(false);

    // QUESTION 3
    const [openHowCharacterOvercomeObstaclesModal, setOpenHowCharacterOvercomeObstaclesModal] = useState<boolean>(false);

    // QUESTION 4
    const [openHowCharacterGoalChangeRelationshipsModal, setOpenHowCharacterGoalChangeRelationshipsModal] = useState<boolean>(false);


    useEffect(() => {
        setConfrontationStep(initialConfrontationStep || 1);
    }, [initialConfrontationStep]);

    const openMotivationsModal = (protagonist: CharacterInterface) => {        
        setSelectedCharacter(protagonist);
        setOpenProtagonistMotivationsModal(true);
    }

    const openEmotionTriggerEventModal = (protagonist: CharacterInterface) => {        
        setSelectedCharacter(protagonist);
        setOpenProtagonistEmotionTriggerEventModal(true);
    }

    const triggerHowCharacterOvercomeObstaclesModal = (protagonist: CharacterInterface) => {    
        setSelectedCharacter(protagonist);
        setOpenHowCharacterOvercomeObstaclesModal(true);    
    }

    const triggerHowCharacterGoalChangeRelationshipsModal = (protagonist: CharacterInterface) => {    
        setSelectedCharacter(protagonist);
        setOpenHowCharacterGoalChangeRelationshipsModal(true);    
    }


    return (
        <div>
            <div className='bg-gray-50 rounded-2xl'>
                <div>
                    <div className='border-b p-5'>
                        <h1 className="font-bold text-2xl text-center mb-3">Act 2 - Confrontation</h1>
                        <p className="text-xs italic font-light text-gray-600 text-center">
                        "Confrontation means a series of challenges or problems that the character faces as they try to achieve their goal"                
                        </p>
                    </div>
                </div>

                <div className='p-5'>
                    <Accordion type="single" collapsible>                  
                        {
                            confrontationStep > 0 && 
                            <AccordionItem value="item-1" className="mb-3 border-none">
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>
                                    What motivates or drives the protagonist(s) to pursue their goal? (Motivation)
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid md:grid-cols-1 gap-5 lg:grid-cols-2 mt-4">
                                        {
                                            initialStory?.characters?.filter(character => character?.isProtagonist)?.map((protagonist, index) => (                                                         
                                                <CharacterComponent key={index} character={protagonist} clickEvent={openMotivationsModal}/>
                                            ))
                                        }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        }

                        {
                            confrontationStep > 1 && 
                            <AccordionItem value="item-2" className="mb-3 border-none">
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>
                                What events or circumstances trigger strong emotions in the character? (Emotional Triggers)
                                </AccordionTrigger>
                                <AccordionContent>
                                    
                                    <div className="grid md:grid-cols-1 gap-5 lg:grid-cols-2 mt-4">
                                        {
                                            initialStory?.characters?.filter(character => character?.isProtagonist)?.map((protagonist, index) => (                                        
                    
                                                <CharacterComponent key={index} character={protagonist} clickEvent={openEmotionTriggerEventModal}/>

                                            ))
                                        }
                                    </div>                                

                                </AccordionContent>
                            </AccordionItem>
                        }

                        {
                            confrontationStep > 2 && 
                            <AccordionItem value="item-3" className="mb-3 border-none">
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>
                                    How does the character overcome obstacles? (problem-solving and adaptation)
                                </AccordionTrigger>
                                <AccordionContent>
                                
                                    <div className="grid md:grid-cols-1 gap-5 lg:grid-cols-2 mt-4">
                                        {
                                            initialStory?.characters?.filter(character => character?.isProtagonist)?.map((protagonist, index) => (                                        
                    
                                                <CharacterComponent key={index} character={protagonist} clickEvent={triggerHowCharacterOvercomeObstaclesModal}/>

                                            ))
                                        }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        }

                        {
                            confrontationStep > 3 && 
                            <AccordionItem value="item-4" className="mb-3 border-none">
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>
                                How do the character's relationships and conflicts change as they go after their goal? (Relationship Escalation)                            
                                </AccordionTrigger>
                                <AccordionContent>
                                
                                    <div className="grid md:grid-cols-1 gap-5 lg:grid-cols-2 mt-4">
                                        {
                                            initialStory?.characters?.filter(character => character?.isProtagonist)?.map((protagonist, index) => (                                        
                    
                                                <CharacterComponent key={index} character={protagonist} clickEvent={triggerHowCharacterGoalChangeRelationshipsModal}/>

                                            ))
                                        }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        }                     
                    </Accordion>

                    <div className="flex items-center justify-between mt-4">
                        <Button size='sm' variant="outline" className='mr-5 text-custom_green border-custom_green' 
                        onClick={moveToPrev}
                        >
                            Prev
                            <ArrowLeft className='ml-2 w-4 h-4'/>
                        </Button>
                        <Button size='sm' variant="outline" className='mr-5 text-custom_green border-custom_green' 
                        onClick={moveToNext}
                        >
                            Next
                            <ArrowRight className='ml-2 w-4 h-4'/>
                        </Button>
                    </div>
                </div>                
            </div>


            {/* 1ST QUESTION */}
            <ProtagonistGoalMotivationsComponent
                openProtagonistMotivationsModal={openProtagonistMotivationsModal}
                setOpenProtagonistMotivationsModal={setOpenProtagonistMotivationsModal}
                selectedCharacter={selectedCharacter}
                initialStory={initialStory}
                saveStory={saveStory}
                refetch={refetch}
            />

            {/* 2ND QUESTION */}
      
            <ProtagonistEmotionTriggerEventComponent 
                setOpenProtagonistEmotionTriggerEventModal={setOpenProtagonistEmotionTriggerEventModal}
                openProtagonistEmotionTriggerEventModal={openProtagonistEmotionTriggerEventModal}
                selectedCharacter={selectedCharacter}
                initialStory={initialStory}
                saveStory={saveStory}
                refetch={refetch}
            />

            {/* 3RD QUESTION */}
            <HowCharacterOvercomeObstaclesComponent 
                openHowCharacterOvercomeObstaclesModal={openHowCharacterOvercomeObstaclesModal}
                setOpenHowCharacterOvercomeObstaclesModal={setOpenHowCharacterOvercomeObstaclesModal}
                selectedCharacter={selectedCharacter}
                initialStory={initialStory}
                saveStory={saveStory}
                refetch={refetch}
            />

            {/* 4TH QUESTION */}
            <HowCharacterGoalChangeRelationshipsComponent 
            openHowCharacterGoalChangeRelationshipsModal={openHowCharacterGoalChangeRelationshipsModal}
            setOpenHowCharacterGoalChangeRelationshipsModal={setOpenHowCharacterGoalChangeRelationshipsModal}
            selectedCharacter={selectedCharacter}
            initialStory={initialStory}
            saveStory={saveStory}
            refetch={refetch}
            />
        </div>
    );


}

export default ConfrontationComponent
