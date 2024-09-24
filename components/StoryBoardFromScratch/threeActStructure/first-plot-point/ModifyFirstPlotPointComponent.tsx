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

interface ModifyFirstPlotPointComponentProps {
    openModifyFirstPlotPointModal: boolean;
    setOpenModifyFirstPlotPointModal: React.Dispatch<React.SetStateAction<boolean>>;    
    selectedFirstPlotPoint: string[];
    setSelectedFirstPlotPoint: React.Dispatch<React.SetStateAction<string[]>>;
    firstPlotPointSuggestions: string[];
    setFirstPlotPointSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
    initialStory: StoryInterface;
    saveStory: (val: any) => null|object;
}

const ModifyFirstPlotPointComponent: React.FC<ModifyFirstPlotPointComponentProps> = ({
    openModifyFirstPlotPointModal,
    setOpenModifyFirstPlotPointModal,
    selectedFirstPlotPoint,
    setSelectedFirstPlotPoint,
    firstPlotPointSuggestions,
    setFirstPlotPointSuggestions,
    initialStory,
    saveStory
}) => {
    // firstPlotPoint
    // FirstPlotPoint

    const [newFirstPlotPoint, setNewFirstPlotPoint] = useState<string>("");
    const [error, setError] = useState<string>("");

    const { refresh } = useRouter();

    const applyFirstPlotPointModification = async () => {
        try {
            showPageLoader();

            const storyStarterSaved = await saveStory({ 
                updateFirstPlotPoint: {
                    firstPlotPoint: selectedFirstPlotPoint,
                    firstPlotPointSuggestions: firstPlotPointSuggestions
                }
            });   

            setOpenModifyFirstPlotPointModal(false);
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const createFirstPlotPoint = async () => {
        try {
            let { expositionPrompt, hookPrompt, genrePrompt, tonePrompt, thematicElementsPrompt, incitingEventPrompt, protagonistOrdinaryWorldPrompt } = extractTemplatePrompts(initialStory);
    
            setError("");
    
            const startingTemplate = `
                You are a professional storyteller, author, script writer, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
                A new first plot point which is {firstPlotPoint} is being added to the existing first plot point of the story, analyze the story plot, title, exposition, hook, genre, tone, suspense technique, characters, inciting event, protagonist's ordinary world, thematic element, and thematic option provided then try to incorporate the new first plot point {firstPlotPoint} into the story without changing the narrative:
                
                Ensure the incoming first plot point {firstPlotPoint} which answers at least one of the following questions:
                - What changes everything for the protagonist?
                - What reveals the story's central conflict or problem?
                - What do they do initially? What do they think or feel?
                - How do their actions reflect their character and motivations?
                - What are the short-term effects on the protagonist and the situation?
                - What do these consequences reveal about the story's themes and stakes?
                - What's at risk for the protagonist? What's the worst that could happen?
                - How do these stakes raise the tension and create suspense?                
            
                However, if the first plot point which is {firstPlotPoint} does not make sense or is not a valid first plot point, return a message indicating what is wrong with the first plot point or sentence. For example, you could say something like:
                - "I'm not sure what you mean by '{firstPlotPoint}'. Could you please rephrase it?".
                - " '{firstPlotPoint}' doesn't seem to fit with the existing first plot point. Could you provide more context?".
                - "I'm not familiar with the term '{firstPlotPoint}'. Could you define it?".
                These should be inside the reason string in the response.
                On the other hand, if the first plot point is valid and fits into the story's narrative, proceed to incorporate it into the story's first plot point as usual.
    
                Return your response in a json or javascript object format like: 
                valid(boolean, true if it is valid & false if it is not), 
                newFirstPlotPoint(string, this should contain only the newly added {firstPlotPoint} and if there are any grammatical errors, kindly correct it) and reason(string, this is the reason it is not a valid first plot point if it is not) as keys. 
                Please ensure the only keys in the objects are valid, newFirstPlotPoint and reason only.
                Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
                new first plot point: {firstPlotPoint}
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
                firstPlotPoint: newFirstPlotPoint,
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
                setFirstPlotPointSuggestions(item => [...item, newFirstPlotPoint]);
            }
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const haveFirstPlotPointBeenChecked = (event: string): boolean => {
        return selectedFirstPlotPoint.includes(event);
    };

    const handleFirstPlotPointCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, firstPlotPoint: string) => {        
        const updatedCheckedFirstPlotPoint = [...selectedFirstPlotPoint];
        
        if (e.target.checked) {
            // Add the checked item to the array
            updatedCheckedFirstPlotPoint.push(firstPlotPoint);
        } else {
            // Remove the unchecked item from the array
            const index = updatedCheckedFirstPlotPoint.indexOf(firstPlotPoint);
            if (index > -1) {
                updatedCheckedFirstPlotPoint.splice(index, 1);
            }
        }                
        setSelectedFirstPlotPoint(updatedCheckedFirstPlotPoint);
    };

    return (
        <Sheet open={openModifyFirstPlotPointModal} onOpenChange={setOpenModifyFirstPlotPointModal}>
            <SheetContent className="overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
                <SheetHeader className=''>
                    <SheetTitle className='font-bold text-2xl'>Let's modify the first plot point of the story:</SheetTitle>
                    <SheetDescription className=''></SheetDescription>
                    
                    <div className=''>
                        <p className='text-sm font-semibold mb-2 text-gray-500 italic'>First Plot Point Suggestions:</p>
                        <div className='mb-7'>
                            <Textarea 
                            value={newFirstPlotPoint}
                            onChange={e => setNewFirstPlotPoint(e.target.value)}
                            className='flex-1 text-black mb-3'
                            placeholder='Add more first plot points...'/>
                            { error && 
                                <div className='mb-3'>
                                    <p className='text-xs text-red-400 p-3 rounded-xl bg-red-100 border border-red-200'>{error || ''}</p>
                                </div>
                            }
                            <Button className='mt-1' onClick={createFirstPlotPoint}>Add</Button>
                        </div>
                        <div className='my-3'>
       
                            {
                                firstPlotPointSuggestions.map((point, index) => (
                                    <div className="flex items-center gap-3 mb-2" key={index}>
                                        <input 
                                            type='checkbox' 
                                            className='' 
                                            value={point}
                                            checked={haveFirstPlotPointBeenChecked(point)}
                                            onChange={(e) => handleFirstPlotPointCheckboxChange(e, point)}
                                            id={`_${index}_`}
                                        />
                                        <label htmlFor={`_${index}_`} className='text-xs'>{point}</label>
                                    </div>
                                ))
                            }
                        </div>                                                    

                        <Button onClick={applyFirstPlotPointModification}>Save</Button>


                    </div>
                </SheetHeader>  
            </SheetContent>
        </Sheet>  
    );
}

export default ModifyFirstPlotPointComponent
