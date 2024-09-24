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


interface ModifyProgressiveComplicationsProps {
    openModifyProgressiveComplicationModal: boolean;
    setOpenModifyProgressiveComplicationModal: React.Dispatch<React.SetStateAction<boolean>>;    
    selectedProgressiveComplication: string[];
    setSelectedProgressiveComplication: React.Dispatch<React.SetStateAction<string[]>>;
    progressiveComplicationSuggestions: string[];
    setProgressiveComplicationSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
    initialStory: StoryInterface;
    saveStory: (val: any) => null|object;
}

const ModifyProgressiveComplicationsComponent: React.FC<ModifyProgressiveComplicationsProps> = ({
    openModifyProgressiveComplicationModal,
    setOpenModifyProgressiveComplicationModal,
    selectedProgressiveComplication,
    setSelectedProgressiveComplication,
    progressiveComplicationSuggestions,
    setProgressiveComplicationSuggestions,
    initialStory,
    saveStory
}) => {
    const [newProgressiveComplication, setNewProgressiveComplication] = useState<string>("");
    const [error, setError] = useState<string>("");

    const { refresh } = useRouter();
    
    const applyProgressiveComplicationModification = async () => {
        try {
            showPageLoader();

            const storyStarterSaved = await saveStory({ 
                updateProgressiveComplication: {
                    progressiveComplication: selectedProgressiveComplication,
                    progressiveComplicationSuggestions: progressiveComplicationSuggestions
                }
            });   

            setOpenModifyProgressiveComplicationModal(false);
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const createProgressiveComplication = async () => {
        try {
            let { expositionPrompt, hookPrompt, genrePrompt, tonePrompt, thematicElementsPrompt, firstPlotPointPrompt, incitingEventPrompt, protagonistOrdinaryWorldPrompt } = extractTemplatePrompts(initialStory);
    
            setError("");
    
            const startingTemplate = `
                You are a professional storyteller, author, script writer, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
                A new progressive complication point which is {progressiveComplication} is being added to the existing progressive complication point of the story, analyze the story plot, title, exposition, hook, genre, tone, suspense technique, characters, inciting event, protagonist's ordinary world, thematic element, and thematic option provided then try to incorporate the new progressive complication point {progressiveComplication} into the story without changing the narrative:
                
                Ensure the incoming progressive complication point which fits or is related too the following definition:
                **The Progressive Complication**: The progressive complication involves a series of events that escalate the conflict and tension, the protagonist faces obstacles, setbacks, and challenges. Their flaws and weaknesses are exposed, making it harder to achieve their goal.          
            
                However, if the progressive complication which is {progressiveComplication} does not make sense or is not a valid progressive complication, return a message indicating what is wrong with the progressive complication or sentence. For example, you could say something like:
                - "I'm not sure what you mean by '{progressiveComplication}'. Could you please rephrase it?".
                - " '{progressiveComplication}' doesn't seem to fit with the existing progressive complication. Could you provide more context?".
                - "I'm not familiar with the term '{progressiveComplication}'. Could you define it?".
                These should be inside the reason string in the response.
                On the other hand, if the progressive complication is valid and fits into the story's narrative, proceed to incorporate it into the story's progressive complication as usual.
    
                Return your response in a json or javascript object format like: 
                valid(boolean, true if it is valid & false if it is not), 
                newFirstPlotPoint(string, this should contain only the newly added {progressiveComplication} and if there are any grammatical errors, kindly correct it) and reason(string, this is the reason it is not a valid progressive complication if it is not) as keys. 
                Please ensure the only keys in the objects are valid, newFirstPlotPoint and reason only.
                Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
                new progressive complication: {progressiveComplication}
                plot: {storyPlot}
                exposition: {exposition}
                characters: {characters}
                hook: {hook} 
                tone: {tone}
                protagonist's ordinary world: {protagonistOrdinaryWorld} 
                inciting event: {incitingEvent}
                story title: {storyTitle}
                genre: {genre}
                thematic element & option: {thematicElement}
                suspense technique: {suspenseTechnique}
                suspense technique description: {suspenseTechniqueDescription}
            `;
    
            showPageLoader();

            const response = await queryLLM(startingTemplate, {
                progressiveComplication: newProgressiveComplication,
                firstPlotPoint: firstPlotPointPrompt,
                protagonistOrdinaryWorld: protagonistOrdinaryWorldPrompt,
                genre: genrePrompt,
                exposition: expositionPrompt,
                tone: tonePrompt,
                hook: hookPrompt,
                incitingEvent: incitingEventPrompt,
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
                setTimeout(() => {
                    setError("");                    
                }, 5000);
            }else{
                setProgressiveComplicationSuggestions(suggestions => [...suggestions, newProgressiveComplication]);
            }
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const haveProgressiveComplicationBeenChecked = (option: string): boolean => {
        return selectedProgressiveComplication.includes(option);
    }

    const handleProgressiveComplicationCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, progressiveComplication: string) => {        
        const updatedCheckedProgressiveComplication = [...selectedProgressiveComplication];
        
        if (e.target.checked) {
            // Add the checked item to the array
            updatedCheckedProgressiveComplication.push(progressiveComplication);
        } else {
            // Remove the unchecked item from the array
            const index = updatedCheckedProgressiveComplication.indexOf(progressiveComplication);
            if (index > -1) {
                updatedCheckedProgressiveComplication.splice(index, 1);
            }
        }                
        setSelectedProgressiveComplication(updatedCheckedProgressiveComplication);
    };
    
    return (
        <Sheet open={openModifyProgressiveComplicationModal} onOpenChange={setOpenModifyProgressiveComplicationModal}>
            <SheetContent className="overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
                <SheetHeader className=''>
                    <SheetTitle className='font-bold text-2xl'>Let's modify the progressive complications of the story:</SheetTitle>
                    <SheetDescription className=''></SheetDescription>
                    
                    <div className=''>
                        <div className='mb-7'>
                            <Textarea 
                            value={newProgressiveComplication}
                            onChange={e => setNewProgressiveComplication(e.target.value)}
                            className='flex-1 text-black mb-3'
                            placeholder='Add more suggestions...'/>
                            { error && 
                                <div className='mb-3'>
                                    <p className='text-xs text-red-400 p-3 rounded-xl bg-red-100 border border-red-200'>{error || ''}</p>
                                </div>
                            }
                            <Button className='mt-1' onClick={createProgressiveComplication}>Add</Button>
                        </div>
                        <div className='my-3'>
                        <p className='text-sm font-semibold mb-2 text-gray-500 italic'>Progressive Complications Suggestions:</p>

                            {
                                progressiveComplicationSuggestions.map((option, index) => (
                                    <div className="flex items-center gap-3 mb-2" key={index}>
                                        <input 
                                            type='checkbox' 
                                            className='' 
                                            value={option}
                                            checked={haveProgressiveComplicationBeenChecked(option)}
                                            onChange={(e) => handleProgressiveComplicationCheckboxChange(e, option)}
                                            id={`_${index}_`}
                                        />
                                        <label htmlFor={`_${index}_`} className='text-xs'>{option}</label>
                                    </div>
                                ))
                            }
                        </div>                                                    

                        <Button onClick={applyProgressiveComplicationModification}>Save</Button>


                    </div>
                </SheetHeader>  
            </SheetContent>
        </Sheet>     
    )
}

export default ModifyProgressiveComplicationsComponent
