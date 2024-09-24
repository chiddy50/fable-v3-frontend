"use client";

import { StoryInterface } from '@/interfaces/StoryInterface';
import React, { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { charactersToString, extractTemplatePrompts, queryLLM, threeActStructureDefinition } from '@/services/LlmQueryHelper';


interface ModifyProtagonistOrdinaryWorldComponentProps {
    openModifyProtagonistOrdinaryWorldModal: boolean;
    setOpenModifyProtagonistOrdinaryWorldModal: React.Dispatch<React.SetStateAction<boolean>>;    
    selectedProtagonistOrdinaryWorld: string[];
    setSelectedProtagonistOrdinaryWorld: React.Dispatch<React.SetStateAction<string[]>>;
    protagonistOrdinaryWorldSuggestions: string[];
    setProtagonistOrdinaryWorldSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
    initialStory: StoryInterface;
    saveStory: (val: any) => null|object;
}

const ModifyProtagonistOrdinaryWorldComponent: React.FC<ModifyProtagonistOrdinaryWorldComponentProps> = ({
    openModifyProtagonistOrdinaryWorldModal,
    setOpenModifyProtagonistOrdinaryWorldModal,
    selectedProtagonistOrdinaryWorld,
    setSelectedProtagonistOrdinaryWorld,
    protagonistOrdinaryWorldSuggestions,
    setProtagonistOrdinaryWorldSuggestions,
    initialStory,
    saveStory
}) => {
    // protagonistOrdinaryWorld
    // ProtagonistOrdinaryWorld
    const [newProtagonistOrdinaryWorld, setNewProtagonistOrdinaryWorld] = useState<string>("");
    const [error, setError] = useState<string>("");

    const { refresh } = useRouter();

    const applyProtagonistOrdinaryWorldModification = async () => {
        try {
            showPageLoader();

            const storyStarterSaved = await saveStory({ 
                updateProtagonistOrdinaryWorld: {
                    protagonistOrdinaryWorld: selectedProtagonistOrdinaryWorld,
                    protagonistOrdinaryWorldSuggestions: protagonistOrdinaryWorldSuggestions
                }
            });   

            setOpenModifyProtagonistOrdinaryWorldModal(false);
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const createProtagonistOrdinaryWorld = async () => {
        try {
            let { expositionPrompt, hookPrompt, genrePrompt, tonePrompt, thematicElementsPrompt, incitingEventPrompt } = extractTemplatePrompts(initialStory);
            
            setError("");
    
            const startingTemplate = `
                You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
                A new option that can be added to the protagonist's world for establishing the ordinary world of the protagonists which is {protagonistOrdinaryWorld} is being added to the existing story plot, analyze the story plot, inciting events, exposition, hook, genre, suspense technique, thematic element, and thematic option provided then try to incorporate the new option for the ordinary world of the protagonists which is {protagonistOrdinaryWorld} into the story without changing the narrative:

                However, if the option which is {protagonistOrdinaryWorld} does not make sense or is not a valid option that can be added to the protagonist's world, return a message indicating what is wrong with the option that can be added to the protagonist's world or sentence. For example, you could say something like:
                - "I'm not sure what you mean by '{protagonistOrdinaryWorld}'. Could you please rephrase it?".
                - " '{protagonistOrdinaryWorld}' doesn't seem to fit with the narrative. Could you provide more context?".
                - "I'm not familiar with the term '{protagonistOrdinaryWorld}'. Could you define it?".
                These should be inside the reason string in the response.
                On the other hand, if the option that can be added to the protagonist's world is valid and fits into the story's narrative, proceed to incorporate it into the story's as usual.
    
                Return your response in a json or javascript object format like: 
                valid(boolean, true if it is valid & false if it is not), 
                newProtagonistOrdinaryWorld(string, this should contain only the newly added {protagonistOrdinaryWorld} and if there are any grammatical errors, kindly correct it) and reason(string, this is the reason it is not valid if it is not) as keys. 
                Please ensure the only keys in the objects are valid, newProtagonistOrdinaryWorld and reason only.
                Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
                new option for the protagonist's ordinary world: {protagonistOrdinaryWorld}
                
                ### Inputs:
                - New option for protagonist’s ordinary world: {protagonistOrdinaryWorld}
                - Plot: {storyPlot}
                - Inciting event: {incitingEvent}
                - Exposition: {exposition}
                - Tone: {tone}
                - Characters: {characters}
                - Story title: {storyTitle}
                - Genre: {genre}
                - Thematic element: {thematicElement}
                - Suspense technique: {suspenseTechnique}
                - Suspense technique description: {suspenseTechniqueDescription}
            `;
    
            showPageLoader();

            const response = await queryLLM(startingTemplate, {
                protagonistOrdinaryWorld: newProtagonistOrdinaryWorld,
                incitingEvent: incitingEventPrompt,
                genre: genrePrompt,
                exposition: expositionPrompt,
                tone: tonePrompt,
                hook: hookPrompt,
                characters: charactersToString(initialStory),
                thematicElement: thematicElementsPrompt,
                storyTitle: initialStory.title,
                storyPlot: initialStory.overview,
                suspenseTechnique: initialStory.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStory.suspenseTechnique?.description,
            });
    
            if (!response) {
                return;
            }
    
            if (!response?.valid) {
                setError(response?.reason);
            }else{
                setProtagonistOrdinaryWorldSuggestions(item => [...item, newProtagonistOrdinaryWorld]);
            }
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const haveOptionBeenChecked = (event: string): boolean => {
        return selectedProtagonistOrdinaryWorld.includes(event);
    };

    const handleOptionCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, option: string) => {
        
        const updatedCheckedOptions = [...selectedProtagonistOrdinaryWorld];
        
        if (e.target.checked) {
            // Add the checked item to the array
            updatedCheckedOptions.push(option);
        } else {
            // Remove the unchecked item from the array
            const index = updatedCheckedOptions.indexOf(option);
            if (index > -1) {
                updatedCheckedOptions.splice(index, 1);
            }
        }                
        // Update the state with the new checked items
        setSelectedProtagonistOrdinaryWorld(updatedCheckedOptions);
    };

    return (
        <div>
            <Sheet open={openModifyProtagonistOrdinaryWorldModal} onOpenChange={setOpenModifyProtagonistOrdinaryWorldModal}>
            <SheetContent className="overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
                <SheetHeader className=''>
                    <SheetTitle className='font-bold text-2xl'>Let's modify the Protagonist's Ordinary World:</SheetTitle>
                    <SheetDescription className=''></SheetDescription>
                    
                    <div className=''>
                        <div className='mb-7'>
                            <Textarea 
                            value={newProtagonistOrdinaryWorld}
                            onChange={e => setNewProtagonistOrdinaryWorld(e.target.value)}
                            className='flex-1 text-black mb-3'
                            placeholder="Add more suggestions..."/>
                            <div>
                                <p className='text-xs text-red-600'>{error || ''}</p>
                            </div>
                            <Button className='mt-1' onClick={createProtagonistOrdinaryWorld}>Add</Button>
                        </div>
                        <div className='my-3'>
                            <p className='text-sm font-bold mb-2 text-gray-500 italic'>Protagonist's Ordinary World Suggestions:</p>

                            {
                                protagonistOrdinaryWorldSuggestions.map((item, index) => (
                                    <div className="flex items-center gap-3 mb-2" key={index}>
                                        <input 
                                            type='checkbox' 
                                            className='' 
                                            value={item}
                                            checked={haveOptionBeenChecked(item)}
                                            onChange={(e) => handleOptionCheckboxChange(e, item)}
                                            id={`_${index}_`}
                                        />
                                        <label htmlFor={`_${index}_`} className='text-xs'>{item}</label>
                                    </div>
                                ))
                            }
                        </div>                                                    

                        <Button onClick={applyProtagonistOrdinaryWorldModification}>Save</Button>


                    </div>
                </SheetHeader>  
            </SheetContent>
        </Sheet> 
        </div>
    );
}

export default ModifyProtagonistOrdinaryWorldComponent
