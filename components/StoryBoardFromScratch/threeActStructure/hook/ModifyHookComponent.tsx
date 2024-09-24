"use client";

import React, { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, MinusCircleIcon } from 'lucide-react';
import { ThreeActStructureInterface } from '@/interfaces/PlotInterface';
import { ChatGroq } from '@langchain/groq';
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { StoryInterface, SuggestionItem } from '@/interfaces/StoryInterface';
import { ThematicOptionInterface } from '@/interfaces/ThematicOptionInterface';
import { useRouter } from 'next/navigation';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { queryLLM } from '@/services/LlmQueryHelper';
import { Textarea } from '@/components/ui/textarea';

interface ModifyHookComponentComponentProps {
    hook: string[];
    openModifyHookModal: boolean;
    setOpenModifyHookModal: React.Dispatch<React.SetStateAction<boolean>>;    
    selectedHooks: string[];
    setSelectedHooks: React.Dispatch<React.SetStateAction<string[]>>;
    hookSuggestions: string[];
    setHookSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
    initialStoryData: StoryInterface;
    saveStory: (val: any) => null|object;
}

const ModifyHookComponent: React.FC<ModifyHookComponentComponentProps> = ({
    openModifyHookModal,
    setOpenModifyHookModal,
    hook, // Existing hook
    selectedHooks, // Selected hooks
    setSelectedHooks,
    hookSuggestions,
    setHookSuggestions,
    initialStoryData,
    saveStory
}) => {
    const [newHook, setNewHook] = useState<string>("");
    const [error, setError] = useState<string>("");

    const { push, refresh } = useRouter();

    function filterSuggestedHooks(suggestedHooks: Option[], selectedHooks: Option[]) {
        // Create a Set of selected hook values for efficient lookup
        const selectedValues = new Set(selectedHooks.map(hook => hook.value));
      
        // Filter suggestedHooks, keeping only those not in selectedValues
        return suggestedHooks.filter(hook => !selectedValues.has(hook.value))
        // .map(hook => hook.value);
    }

    const applyHookChanges = async () => {
        try {
            
            const additionalHooksPrompt  = selectedHooks.map(hook => hook).join(' ');
            const existingHooksPrompt    = hook.map(hook => hook).join(' ');
            const genrePrompt            = initialStoryData.genres.map(genre => genre.value).join(', ');
            const thematicElementsPrompt = initialStoryData.thematicOptions.map(
                (item: ThematicOptionInterface) => `For ${item.thematicElement} as the thematic element, the thematic option is ${item.thematicOption}.`
            ).join(' ');
    
            // const unselectedSuggestedHooks: Option[] = filterSuggestedHooks(hookSuggestions, selectedHooks);
    
            console.log({ 
                initialStoryData, 
                selectedHooks, 
                additionalHooksPrompt, 
                existingHooksPrompt, 
                genrePrompt, 
                thematicElementsPrompt,
                hookSuggestions,
                hook: [...hook, ...selectedHooks.map(hook => hook)],
                // unselectedSuggestedHooks,
                // test: unselectedSuggestedHooks
            });
            
            // return;

            // const startingTemplate = `
            //     You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
            //     Based on the plot, story title, exposition, hooks, genre, suspense technique, thematic element, and thematic option provided, analyze the story plot exposition & hooks then try to incorporate the hooks into the story without changing the narrative:
    
            //     - **The Hook**: Identify the most intriguing aspect of the story that will grab the audience's attention immediately, lets give the audience a reason to keep watching. What's the main conflict or problem your character faces? What's the central question or intrigue that keeps the audience engaged?
            //     - **The Inciting Event**: the inciting event is the catalyst that sets the story in motion, triggering a chain of events that drives the plot forward and propels the main characters towards the climax.
            //     The inciting event is typically the first dramatic turning point in the story, and it raises the stakes for the characters, setting the tone for the rest of the narrative. It's often a key event that challenges the status quo, disrupts the characters' normal way of life, or sets them on a collision course with their goals.
                                
            //     You would create or extract at least 4 new characters from the additional hooks, and all the hooks are going to be summarized and finally used to generate inciting events and a new plot.  
            //     Return your response in a json or javascript object format like: newPlot(string, this will be a new plot), hookSummary(string), incitingEvents(array), incitingEventSuggestions(array, this refers to suggestions for the inciting events), incitingEventSummary(string) and characters(array of objects with keys like name(string), role(string), motivations(array), personalityTraits(array), backstory(string), weaknesses(array), strengths(array), coreValues(array) and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)) as keys. Please ensure the only keys in the objects are newPlot, hookSummary, incitingEvents, incitingEventSuggestions, incitingEventSummary and characters only.
            //     Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
            //     exposition: {additionalHooks}
            //     hooks: {additionalHooks}
            //     plot: {storyPlot}
            //     story title: {storyTitle}
            //     genre: {genre}
            //     thematic element & option: {thematicElement}
            //     suspense technique: {suspenseTechnique}
            //     suspense technique description: {suspenseTechniqueDescription}
            // `;

            const startingTemplate = `
            You are a professional storyteller, author, and narrative designer skilled in creating compelling stories using the three-act structure. Your task is to incorporate key narrative elements from the provided plot, story title, exposition, hooks, genre, suspense techniques, and thematic elements.

            - **The Hook**: Identify the most engaging aspect of the story that will capture immediate attention. Focus on the main conflict or central intrigue that drives the audience's curiosity and keeps them engaged.
            
            - **The Inciting Event**: Develop the event that triggers the core plot, introducing a dramatic turning point that shakes up the characters' normal lives. This is the moment that sets the protagonists on their journey, raising the stakes and establishing the story's tone.

            **Task**: Analyze the provided plot, hooks, and exposition. Then create or extract four new characters based on these hooks. Summarize the hooks, craft inciting events, and offer suggestions for enhancing these events, leading to a new plot direction.

            You would create or extract at least 4 new characters from the additional hooks, and all the hooks are going to be summarized and finally used to generate inciting events and a new plot.  
            Return your response in a json or javascript object format like: newPlot(string, this will be a new plot), hookSummary(string), incitingEvents(array), incitingEventSuggestions(array, this refers to suggestions for the inciting events), incitingEventSummary(string) and characters(array of objects with keys like name(string), role(string), motivations(array), personalityTraits(array), backstory(string), weaknesses(array), strengths(array), coreValues(array) and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)) as keys. Please ensure the only keys in the objects are newPlot, hookSummary, incitingEvents, incitingEventSuggestions, incitingEventSummary and characters only.
            Incorporate all necessary information without changing the core narrative. Avoid extra text beyond the requested output.
            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
            exposition: {exposition}
            hooks: {additionalHooks}
            plot: {storyPlot}
            story title: {storyTitle}
            genre: {genre}
            thematic element & option: {thematicElement}
            suspense technique: {suspenseTechnique}
            suspense technique description: {suspenseTechniqueDescription}
        `;

    
            showPageLoader();

            const response = await queryLLM(startingTemplate, {
                // existingHooks: existingHooksPrompt,
                additionalHooks: additionalHooksPrompt,
                exposition: initialStoryData.storyStructure.hook.map(hook => hook).join(" "),
                storyTitle: initialStoryData.title,
                storyPlot: initialStoryData.overview,
                genre: genrePrompt,
                suspenseTechnique: initialStoryData.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStoryData.suspenseTechnique?.description,
                thematicElement: thematicElementsPrompt,
            });    

            // return;

            if (response) {
                const storyStarterSaved = await saveStory({ 
                    hookSetting: {
                        hookSummary: response?.hookSummary,
                        hook: selectedHooks,
                        hookSuggestions: hookSuggestions, //unselectedSuggestedHooks
                        incitingEvents: response?.incitingEvents,
                        incitingEventSuggestions: [...response?.incitingEvents, ...response?.incitingEventSuggestions],
                        incitingEventSummary: response?.incitingEventSummary,
                        newPlot: response?.newPlot,
                    }, 
                    suggestedCharacters: response?.characters,
                    // currentStep: 2,
                    // currentStepUrl: 'story-plot',
                });   
                setOpenModifyHookModal(false);
            }
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const haveExpositionBeenChecked = (exposition: string): boolean => {
        return selectedHooks.includes(exposition);
    };

    const handleExpositionCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, exposition: string) => {
        
        const updatedCheckedHooks = [...selectedHooks];
        
        if (e.target.checked) {
            // Add the checked item to the array
            updatedCheckedHooks.push(exposition);
        } else {
            // Remove the unchecked item from the array
            const index = updatedCheckedHooks.indexOf(exposition);
            if (index > -1) {
                updatedCheckedHooks.splice(index, 1);
            }
        }                
        // Update the state with the new checked items
        setSelectedHooks(updatedCheckedHooks);
    };

    const extractTemplatePrompts = () => {
        const existingHookPrompt = selectedHooks.map(hook => hook).join(' ');
        const genrePrompt            = initialStoryData.genres.map(genre => genre.value).join(', ');
        const thematicElementsPrompt = initialStoryData.thematicOptions.map(
            (item: ThematicOptionInterface) => `For ${item.thematicElement} as the thematic element, the thematic option is ${item.thematicOption}.`
        ).join(' ');
        return { existingHookPrompt, genrePrompt, thematicElementsPrompt }
    }

    const createHook = async () => {
        try {
            let { existingHookPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts();
    
            setError("");
    
            const startingTemplate = `
                You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
                A new hook which is {hook} is being added to the existing hook, analyze the story plot, story title, exposition, existing hook, genre, suspense technique, thematic element, and thematic option provided then try to incorporate the new hook {hook} into the story's hook without changing the narrative:
                
                However, if the hook which is {hook} does not make sense or is not a valid hook, return a message indicating what is wrong with the hook or sentence. For example, you could say something like:
                - "I'm not sure what you mean by '{hook}'. Could you please rephrase it?".
                - " '{hook}' doesn't seem to fit with the existing hook. Could you provide more context?".
                - "I'm not familiar with the term '{hook}'. Could you define it?".
                These should be inside the reason string in the response.
                On the other hand, if the hook is valid and fits into the story's narrative, proceed to incorporate it into the story's hook as usual.
    
                Return your response in a json or javascript object format like: valid(boolean, true if it is valid & false if it is not), newHook(string, this should contain only the newly added {hook} and if there are any grammatical errors, kindly correct it) and reason(string, this is the reason it is not a valid hook if it is not) as keys. Please ensure the only keys in the objects are valid, hook and reason only.
                Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
                existing hook: {existingHooks}
                hook: {hook}
                plot: {storyPlot}
                story title: {storyTitle}
                genre: {genre}
                thematic element & option: {thematicElement}
                suspense technique: {suspenseTechnique}
                suspense technique description: {suspenseTechniqueDescription}
            `;
    
            showPageLoader();

            const response = await queryLLM(startingTemplate, {
                hook: newHook,
                existingHooks: existingHookPrompt,
                genre: genrePrompt,
                thematicElement: thematicElementsPrompt,
                storyTitle: initialStoryData.title,
                storyPlot: initialStoryData.overview,
                suspenseTechnique: initialStoryData.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStoryData.suspenseTechnique?.description,
            });
    
            if (!response) {
                return;
            }
    
            if (!response?.valid) {
                setError(response?.reason);
            }else{
                setHookSuggestions(item => [...item, response?.newHook]);
            }
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    return (
        <Sheet open={openModifyHookModal} onOpenChange={setOpenModifyHookModal}>
            <SheetContent className="overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
                <SheetHeader className=''>
                    <SheetTitle className='font-bold text-2xl'>Let's modify the hook of the story:</SheetTitle>
                    <SheetDescription className=''></SheetDescription>
                    
                    <div className=''>
                        <p className='text-sm font-bold mb-2 text-gray-500 italic'>Hook Suggestions:</p>
                        <div className='mb-7'>
                            <Textarea 
                            value={newHook}
                            onChange={e => setNewHook(e.target.value)}
                            className='flex-1 text-black mb-3'
                            placeholder='Add more hook...'/>
                            <div>
                                <p className='text-xs text-red-600'>{error || ''}</p>
                            </div>
                            <Button className='mt-3' onClick={createHook}>Add</Button>
                        </div>
                        <div className='my-3'>
       
                            {
                                hookSuggestions.map((hook, index) => (
                                    <div className="flex items-center gap-3 mb-2" key={index}>
                                        <input 
                                            type='checkbox' 
                                            className='' 
                                            value={hook}
                                            checked={haveExpositionBeenChecked(hook)}
                                            onChange={(e) => handleExpositionCheckboxChange(e, hook)}
                                            id={`_${index}_`}
                                        />
                                        <label htmlFor={`_${index}_`} className='text-xs'>{hook}</label>
                                    </div>
                                ))
                            }
                        </div>                                                    

                        <Button onClick={applyHookChanges}>Save</Button>


                    </div>
                </SheetHeader>  
            </SheetContent>
        </Sheet>       
    )
}

export default ModifyHookComponent
