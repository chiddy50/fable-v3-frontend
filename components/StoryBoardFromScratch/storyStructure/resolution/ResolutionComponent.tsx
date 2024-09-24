"use client";

import { Button } from '@/components/ui/button';
import { StoryInterface, StoryStructureInterface } from '@/interfaces/StoryInterface';
import { ArrowLeft, ArrowRight, Check, Edit } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { CharacterInterface } from '@/interfaces/CharacterInterface';
import CharacterComponent from '../CharacterComponent';
import HowCharacterHasGrownComponent from './HowCharacterHasGrownComponent';
import HowCharactersGoalsAndPrioritiesChangedComponent from './HowCharactersGoalsAndPrioritiesChangedComponent';
import UnresolvedIssuesFromDepartureComponent from './UnresolvedIssuesFromDepartureComponent';
import { useRouter } from 'next/navigation';
import { makeRequest, navigateToStoryStep } from '@/services/request';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { hidePageLoader, showPageLoader } from '@/lib/helper';


interface ResolutionComponentProps {
    storyStructure: StoryStructureInterface,
    initialStory: StoryInterface,
    initialResolutionStep: number;
    saveStory: (val: any) => null|object;
    moveToNext: () => void;
    moveToPrev: () => void;
    refetch:() => void;
}

const ResolutionComponent: React.FC<ResolutionComponentProps> = ({
    initialStory,
    saveStory,
    initialResolutionStep,
    storyStructure,
    moveToPrev,
    moveToNext,
    refetch
}) => {

    const { push } = useRouter();
    const dynamicJwtToken = getAuthToken();

    const [resolutionStep, setResolutionStep] = useState<number>(initialResolutionStep ? Number(initialResolutionStep) : 1)

    const [selectedCharacter, setSelectedCharacter] = useState<CharacterInterface|null>(null);

    // QUESTION 1 - How has the character changed or grown through their experiences?
    const [openHowCharacterHasGrownComponentModal, setOpenHowCharacterHasGrownComponentModal] = useState<boolean>(false);

    // QUESTION 2 - How have the character's goals and priorities changed throughout their journey?
    const [openHowCharactersGoalsAndPrioritiesChangedModal, setOpenHowCharactersGoalsAndPrioritiesChangedModal] = useState<boolean>(false);

    // QUESTION 3 - Are there any unresolved issues from the character's departure that impact their reentry into the story?
    const [openUnresolvedIssuesFromDepartureComponentModal, setOpenUnresolvedIssuesFromDepartureComponentModal] = useState<boolean>(false);


    useEffect(() => {
        setResolutionStep(initialResolutionStep || 1);
    }, [initialResolutionStep]);

    const openMotivationsModal = (protagonist: CharacterInterface) => {        
        setSelectedCharacter(protagonist);
        setOpenHowCharacterHasGrownComponentModal(true);
    }


    const triggerHowCharactersGoalsAndPrioritiesChangedModal = (protagonist: CharacterInterface) => {        
        setSelectedCharacter(protagonist);
        setOpenHowCharactersGoalsAndPrioritiesChangedModal(true);
    }

    const triggerUnresolvedIssuesFromDepartureModal = (protagonist: CharacterInterface) => {        
        setSelectedCharacter(protagonist);
        setOpenUnresolvedIssuesFromDepartureComponentModal(true);
    }

    const navigate = async (currentStep: number, currentStepUrl: string) => {
        try {
          showPageLoader();
    
          let response = await navigateToStoryStep(initialStory?.id, {
            currentStep: currentStep,                    
            currentStepUrl: currentStepUrl ,
          });
    
          if (response) {
              push(`/dashboard/story-project?story-id=${initialStory.id}&current-step=${currentStepUrl}`)
          }
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }    
    }

    return (
        <div>

            <div className='bg-gray-50 rounded-2xl'>
                <div>
                    <div className='border-b p-5'>
                        <h1 className="font-bold text-2xl text-center mb-3">Act 3 - Resolution</h1>
                        <p className="text-xs italic font-light text-gray-600 text-center">
                        "Resolution is where the character solves the problems and grows"                
                        </p>
                    </div>
                </div>

                <div className='p-5'>
                    <Accordion type="single" collapsible>                  

                        {
                            resolutionStep > 0 && 
                            <AccordionItem value="item-1" className="mb-3 border-none">
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>
                                    How has the character changed or grown through their experiences? 
                                    {/* (Character Growth) */}
                                    {/* <div className='flex gap-2 items-start'>
                                        <span>
                                        How has the character changed or grown through their experiences? 
                                        </span>
                                        <span className='text-xs text-gray-500'>
                                        (Character Growth)
                                        </span>
                                    </div> */}
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
                            resolutionStep > 1 && 
                            <AccordionItem value="item-2" className="mb-3 border-none">
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>
                                How have the character's goals and priorities changed throughout their journey? 
                                {/* (Character Evolution) */}
                                {/* How have the character's goals and priorities changed throughout their journey? (Character Evolution) */}
                                    {/* How has the character changed or grown through their experiences? (Personal Growth) */}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid md:grid-cols-1 gap-5 lg:grid-cols-2 mt-4">
                                        {
                                            initialStory?.characters?.filter(character => character?.isProtagonist)?.map((protagonist, index) => (                                                         
                                                <CharacterComponent key={index} character={protagonist} clickEvent={triggerHowCharactersGoalsAndPrioritiesChangedModal}/>
                                            ))
                                        }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                        }

                        {
                            resolutionStep > 2 && 
                            <AccordionItem value="item-3" className="mb-3 border-none">
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>
                                Are there any unresolved issues from the character's departure that impact their reentry into the story? 
                                {/* (Unresolved Issues) */}
                                {/* How have the character's goals and priorities changed throughout their journey? (Goal Shift) */}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid md:grid-cols-1 gap-5 lg:grid-cols-2 mt-4">
                                        {
                                            initialStory?.characters?.filter(character => character?.isProtagonist)?.map((protagonist, index) => (                                                         
                                                <CharacterComponent key={index} character={protagonist} clickEvent={triggerUnresolvedIssuesFromDepartureModal}/>
                                            ))
                                        }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                        }
                            {/* What is the character's ultimate goal or achievement?
                            What does the character learn or realize about themselves or the world?
                            How does the character's outcome impact others or the world at large? */}
                    </Accordion>

                    <div className="flex items-center justify-between mt-4">
                        <Button size='sm' variant="outline" className='mr-5 text-custom_green border-custom_green' 
                        onClick={moveToPrev}
                        >
                            Prev
                            <ArrowLeft className='ml-2 w-4 h-4'/>
                        </Button>
                        
                        <Button size='sm' className='bg-custom_green text-white' 
                        onClick={() => navigate(3, "create-characters")}
                        >
                            Done 
                            <ArrowRight className='ml-2 w-4 h-4'/>
                        </Button>
                    </div>
                </div>

            </div>




            <HowCharacterHasGrownComponent
                openHowCharacterHasGrownComponentModal={openHowCharacterHasGrownComponentModal}
                setOpenHowCharacterHasGrownComponentModal={setOpenHowCharacterHasGrownComponentModal}
                selectedCharacter={selectedCharacter}
                initialStory={initialStory}
                saveStory={saveStory}
                refetch={refetch}
            />

            <HowCharactersGoalsAndPrioritiesChangedComponent 
                openHowCharactersGoalsAndPrioritiesChangedModal={openHowCharactersGoalsAndPrioritiesChangedModal} 
                setOpenHowCharactersGoalsAndPrioritiesChangedModal={setOpenHowCharactersGoalsAndPrioritiesChangedModal}
                selectedCharacter={selectedCharacter}
                initialStory={initialStory}
                saveStory={saveStory}
                refetch={refetch}
            />

            <UnresolvedIssuesFromDepartureComponent
                openUnresolvedIssuesFromDepartureComponentModal={openUnresolvedIssuesFromDepartureComponentModal} 
                setOpenUnresolvedIssuesFromDepartureComponentModal={setOpenUnresolvedIssuesFromDepartureComponentModal}
                selectedCharacter={selectedCharacter}
                initialStory={initialStory}
                saveStory={saveStory}
                refetch={refetch}
            />

        </div>
    )
}

export default ResolutionComponent
