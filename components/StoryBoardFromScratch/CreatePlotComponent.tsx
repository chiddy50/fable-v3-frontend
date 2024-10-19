"use client";

import React, { useEffect, useState } from 'react';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { useRouter } from 'next/navigation';
import ProtagonistIntroductionComponent from './storyStructure/setup/ProtagonistIntroductionComponent';
import ConfrontationComponent from './storyStructure/confrontation/ConfrontationComponent';
import ResolutionComponent from './storyStructure/resolution/ResolutionComponent';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CharacterSuggestionsModal from './storyStructure/CharacterSuggestionsModal';
import { SuggestedCharacterInterface } from '@/interfaces/CharacterInterface';
import AddNewCharacterComponent from './storyStructure/AddNewCharacterComponent';
import ViewAllCharactersComponent from './ViewAllCharactersComponent';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Hints } from 'intro.js-react';

interface CreatePlotComponentProps {
    initialStoryData: StoryInterface
    saveStory: (val: any) => null|object;
    currentPlotStep: number;
    refetch: () => void;
}

const hints = [
    {
      element: '.selector1',
      hint: 'You can add & view characters here',
      hintPosition: 'middle-middle',
    }
  ];

const CreatePlotComponent: React.FC<CreatePlotComponentProps> = ({
    initialStoryData,
    saveStory,
    currentPlotStep,
    refetch
}) => {
    
    const { refresh } = useRouter();
    const [hintsEnabled, setHintsEnabled] = useState<boolean>(true);

    const [additionalCharacterSuggestions, setAdditionalCharacterSuggestions] = useState<SuggestedCharacterInterface[]>([]);
    const [openAddCharacterModal, setOpenAddCharacterModal] = useState<boolean>(false);
    const [openCharacterSuggestionsModal, setOpenCharacterSuggestionsModal] = useState<boolean>(false);
    const [openViewCharactersModal, setOpenViewCharactersModal] = useState<boolean>(false);
  
    const [plotStep, setPlotStep] = useState<number>( currentPlotStep ? Number(currentPlotStep) : 1 );
    const [storySetting, setStorySetting] = useState<string>(initialStoryData?.setting ?? "");

    useEffect(() => {
        setPlotStep(currentPlotStep || 1)
    }, [currentPlotStep]);

    useEffect(() => {
        if(!initialStoryData){
            refetch();
        }
    }, [initialStoryData]);

    const moveToPrev = async () => {
        try {
            if (plotStep < 2) return;
            let step = plotStep - 1;

            showPageLoader();
            const updatedStory = await saveStory({ currentPlotStep: step });
    
            setPlotStep(step);

            refetch();

            refresh();            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }

    }

    const moveToNext = async () => {
        
        if (plotStep === 8 || plotStep > 8) return;
        let step = plotStep + 1;

        try {            
            showPageLoader();
            const updatedStory = await saveStory({ currentPlotStep: step });    
            setPlotStep(step);

            refetch();
            refresh();
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const updateStorySetting = async () => {
        try {
            showPageLoader();
            const storyStarterSaved = await saveStory({ 
                setting: storySetting
            });   
            refetch();
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const updateCharacterName = (event: string, character: SuggestedCharacterInterface) => {

    }

    const updateCharacterRole = (event: string, character: SuggestedCharacterInterface) => {
   
    }

    const updateCharacterRelationshipToProtagonist = (event: string, character: SuggestedCharacterInterface) => {
     
    }


    return (
        <>
            {
                initialStoryData && 
                <div>

                    {   initialStoryData?.title &&
                        <div className="mb-5">
                            <p className="first-letter:text-6xl font-light text-3xl tracking-widest text-gray-500 capitalize">{initialStoryData?.title}</p>
                        </div>
                    }

                    <div className="flex w-full mb-20">

                        <div className='w-full border rounded-xl'>

                            <div className="mb-4">
                                <p className="text-xs font-bold text-gray-800 mb-1">Story Setting</p>
                                <div className='flex gap-4 items-center w-3/4 mb-4'>
                                    <Input  
                                    className='text-xs'
                                    defaultValue={storySetting}
                                    onKeyUp={(e) => setStorySetting(e.target.value)} 
                                    onPaste={(e) => setStorySetting(e.target.value)} 
                                    />
                                    
                                    <Button onClick={updateStorySetting}>Save</Button>                            
                                </div>

                                { 
                                !initialStoryData?.setting && 
                                    <>
                                        <p className="text-xs font-bold mb-1 text-gray-700">Suggestions</p>
                                        <div className="flex flex-wrap gap-3">
                                            {
                                                initialStoryData?.storyStructure?.settingSuggestions?.map((setting: string, index: number) => (
                                                    <p onClick={() => setStorySetting(setting)} className='py-2 px-4 rounded-2xl cursor-pointer text-[10px] border bg-gray-50 text-400 border-gray-400' 
                                                    key={index}>
                                                        {setting}
                                                    </p>
                                                ))
                                            }
                                        </div>
                                    </>
                                }

                                <div className="flex">
                                    <div className="border-custom_green py-2 px-5 border bg-gray-50 rounded-2xl text-custom_green">
                                        <DropdownMenu>
                                        <DropdownMenuTrigger className='selector1 text-xs'>Characters</DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem
                                                onClick={() => setOpenViewCharactersModal(true)}                                            
                                            >View Characters</DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setOpenAddCharacterModal(true)}
                                            
                                            >Add Character</DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setOpenCharacterSuggestionsModal(true)}                                         
                                            >
                                                Suggested Characters
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* {  
                                    initialStoryData?.setting &&                               
                                    <div className='mt-4 flex justify-between gap-5'>
                                        <Button 
                                        onClick={() => setOpenViewCharactersModal(true)}
                                        size="sm" className='text-xs' disabled={!initialStoryData.characters ? true : false}>View Characters</Button>
                                        <Button 
                                        onClick={() => setOpenAddCharacterModal(true)}
                                        size="sm" className='text-xs' variant="outline" disabled={!initialStoryData.characters ? true : false}>Add Character</Button>
                                        <Button
                                        onClick={() => setOpenCharacterSuggestionsModal(true)} 
                                        size="sm" className='text-xs' variant="outline" disabled={!initialStoryData.characters ? true : false}>Suggested Characters</Button>
                                    </div>
                                } */}
                            </div>


                            {
                                currentPlotStep && plotStep === 1 && 
                                <ProtagonistIntroductionComponent 
                                storyStructure={initialStoryData?.storyStructure} 
                                initialStory={initialStoryData}                                
                                initialIntroductionStep={initialStoryData?.introductionStep} 
                                saveStory={saveStory}
                                moveToNext={moveToNext}
                                moveToPrev={moveToPrev}
                                refetch={refetch}
                                />                        
                            }

                            {
                                currentPlotStep && plotStep === 2 && 
                                <ConfrontationComponent 
                                storyStructure={initialStoryData?.storyStructure} 
                                initialStory={initialStoryData}
                                initialConfrontationStep={initialStoryData?.confrontationStep}
                                saveStory={saveStory}
                                moveToNext={moveToNext}
                                moveToPrev={moveToPrev}
                                refetch={refetch}
                                />
                            }

                            {
                                currentPlotStep && plotStep === 3 && 
                                <ResolutionComponent 
                                storyStructure={initialStoryData?.storyStructure} 
                                initialStory={initialStoryData}
                                initialResolutionStep={initialStoryData?.resolutionStep}
                                saveStory={saveStory}
                                moveToNext={moveToNext}
                                moveToPrev={moveToPrev}
                                refetch={refetch}
                                />
                            }

                            {/* CHARACTER SUGGESTIONS */}
                            <CharacterSuggestionsModal 
                                refetch={refetch}
                                initialStory={initialStoryData}
                                openCharacterSuggestionsModal={openCharacterSuggestionsModal}
                                setOpenCharacterSuggestionsModal={setOpenCharacterSuggestionsModal}
                                setAdditionalCharacterSuggestions={setAdditionalCharacterSuggestions}
                                additionalCharacterSuggestions={additionalCharacterSuggestions}
                            />

                            {/* ADD A CHARACTER */}
                            <AddNewCharacterComponent 
                                openAddCharacterModal={openAddCharacterModal}
                                setOpenAddCharacterModal={setOpenAddCharacterModal}
                                storyId={initialStoryData?.id}
                            />

                            {/* VIEW CHARACTERS */}
                            <ViewAllCharactersComponent 
                                openViewCharactersModal={openViewCharactersModal}
                                setOpenViewCharactersModal={setOpenViewCharactersModal}
                                initialStory={initialStoryData}
                            />


                        </div>

                    </div>
                </div>
            }

            {/* <Hints
            enabled={hintsEnabled}
            hints={hints}            
            /> */}
        </>
        
    )
}

export default CreatePlotComponent
