"use client";

import { StoryInterface, SuggestionItem } from '@/interfaces/StoryInterface';
import React, { useCallback, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { MinusCircleIcon } from 'lucide-react';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThematicOptionInterface } from '@/interfaces/ThematicOptionInterface';
import { queryLLM, threeActStructureDefinition } from '@/services/LlmQueryHelper';
import { hidePageLoader, showPageLoader } from '@/lib/helper';

interface ModifyExpositionComponentProps {
    openModifyExpositionModal: boolean;
    setOpenModifyExpositionModal: React.Dispatch<React.SetStateAction<boolean>>;    
    selectedExpositions: string[];
    setSelectedExpositions: React.Dispatch<React.SetStateAction<string[]>>;
    expositionSuggestions: string[];
    setExpositionSuggestions: React.Dispatch<React.SetStateAction<string[]>>;

    initialStoryData: StoryInterface;
    saveStory: (val: any) => null|object;
}

const ModifyExpositionComponent: React.FC<ModifyExpositionComponentProps> = ({
    openModifyExpositionModal,
    setOpenModifyExpositionModal,
    selectedExpositions,
    setSelectedExpositions,
    expositionSuggestions,
    setExpositionSuggestions,
    initialStoryData,
    saveStory
}) => {
    const [newExposition, setNewExposition] = useState<string>("");
    const [error, setError] = useState<string>("");

    const applyExpositionChanges = async () => {
        try {            
            let { existingExpositionPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts();
            
            const startingTemplate = `
                You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
                Based on the plot, story title, additional exposition, genre, existing characters suspense technique, thematic element, and thematic option provided, analyze the story plot & additional exposition then try to incorporate the additional exposition into the story without changing the narrative while also suggesting hooks to grab the audiences attention:    
                ${threeActStructureDefinition}

                You would create or extract at least 4 or more new characters from the additional exposition and remember to only introduce new characters when there is a need to do so. 
                The existing characters are {existingCharacters}, so ensure the newly generated characters are not redundant.
                And all the expositions are going to be summarized and finally used to generate a new plot. Generate the hook and some hook suggestions and ensure the hooks and the hook suggestions are related to the exposition.  

                Return your response in a json or javascript object format like: 
                newPlot(string, this will be a new plot), 
                exposition(array), 
                expositionSummary(string), 
                hook(array), 
                suggestionsForHook(array, these hooks should be related to the exposition) and 
                characters(array of objects with keys like name(string), age(string), role(string), gender(string), motivations(array), skinTone(string), hair(string. If the character has hair describe it if not just indicate no hair), facialFeatures(string), motivations(array), personalityTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string), and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)) as keys.                                  
                
                Please ensure the only keys in the objects are newPlot, exposition, expositionSummary, suggestionsForHook and characters only.
                Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
                exposition: {additionalExposition}
                plot: {storyPlot}
                story title: {storyTitle}
                genre: {genre}
                thematic element & option: {thematicElement}
                suspense technique: {suspenseTechnique}
                suspense technique description: {suspenseTechniqueDescription}
            `;

            showPageLoader();

            const response = await queryLLM(startingTemplate, {
                additionalExposition: selectedExpositions.map(hook => hook).join(' '),
                thematicElement: thematicElementsPrompt,
                existingCharacters: extractCharacters(),
                genre: genrePrompt,
                storyTitle: initialStoryData.title,
                storyPlot: initialStoryData.overview,
                suspenseTechnique: initialStoryData.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStoryData.suspenseTechnique?.description,
            });
            // return;

            if (response) {
                const storyStarterSaved = await saveStory({ 
                    expositionSetting: {
                        exposition: selectedExpositions,
                        expositionSuggestions: expositionSuggestions,
                        expositionSummary: response?.expositionSummary,
                        newPlot: response?.newPlot,
                        hook: response?.hook,
                        hookSuggestions: [...response?.hook, ...response?.suggestionsForHook],
                        hookSummary: response?.hookSummary,
                    },
                    suggestedCharacters: response?.characters,

                });   
                setOpenModifyExpositionModal(false);
            }

        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const createExposition = async () => {
        try {
            let { existingExpositionPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts();
    
            setError("");
    
            const startingTemplate = `
                You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
                A new exposition which is {exposition} is being added to the existing exposition, analyze the story plot, story title, existing exposition, genre, suspense technique, thematic element, and thematic option provided then try to incorporate the new exposition {exposition} into the story's exposition without changing the narrative:
                
                However, if the exposition which is {exposition} does not make sense or is not a valid exposition, return a message indicating what is wrong with the exposition or sentence. For example, you could say something like:
                - "I'm not sure what you mean by '{exposition}'. Could you please rephrase it?".
                - " '{exposition}' doesn't seem to fit with the existing exposition. Could you provide more context?".
                - "I'm not familiar with the term '{exposition}'. Could you define it?".
                These should be inside the reason string in the response.
                On the other hand, if the exposition is valid and fits into the story's narrative, proceed to incorporate it into the story's exposition as usual.
    
                Return your response in a json or javascript object format like: valid(boolean, true if it is valid & false if it is not), newExposition(string, this should contain only the newly added {exposition} and if there are any grammatical errors, kindly correct it) and reason(string, this is the reason it is not a valid exposition if it is not) as keys. Please ensure the only keys in the objects are valid, exposition and reason only.
                Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
                existing exposition: {existingExposition}
                exposition: {exposition}
                plot: {storyPlot}
                story title: {storyTitle}
                genre: {genre}
                thematic element & option: {thematicElement}
                suspense technique: {suspenseTechnique}
                suspense technique description: {suspenseTechniqueDescription}
            `;
    
            showPageLoader();

            const suggestionsResponse = await queryLLM(startingTemplate, {
                exposition: newExposition,
                existingExposition: existingExpositionPrompt,
                genre: genrePrompt,
                thematicElement: thematicElementsPrompt,
                storyTitle: initialStoryData.title,
                storyPlot: initialStoryData.overview,
                suspenseTechnique: initialStoryData.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStoryData.suspenseTechnique?.description,
            });
    
            if (!suggestionsResponse) {
                return;
            }
    
            if (!suggestionsResponse?.valid) {
                setError(suggestionsResponse?.reason);
            }else{
                setExpositionSuggestions(item => [...item, suggestionsResponse?.newExposition]);
            }
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }

    }
    
    const haveExpositionBeenChecked = (exposition: string): boolean => {
        return selectedExpositions.includes(exposition);
    };

    const handleExpositionCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, exposition: string) => {
        
        const updatedCheckedExpositions = [...selectedExpositions];
        
        if (e.target.checked) {
            // Add the checked item to the array
            updatedCheckedExpositions.push(exposition);
        } else {
            // Remove the unchecked item from the array
            const index = updatedCheckedExpositions.indexOf(exposition);
            if (index > -1) {
                updatedCheckedExpositions.splice(index, 1);
            }
        }                
        // Update the state with the new checked items
        setSelectedExpositions(updatedCheckedExpositions);
    };

    const extractTemplatePrompts = () => {
        const existingExpositionPrompt = selectedExpositions.map(exposition => exposition).join(' ');
        const genrePrompt            = initialStoryData.genres.map(genre => genre.value).join(', ');
        const thematicElementsPrompt = initialStoryData.thematicOptions.map(
            (item: ThematicOptionInterface) => `For ${item.thematicElement} as the thematic element, the thematic option is ${item.thematicOption}.`
        ).join(' ');
        return { existingExpositionPrompt, genrePrompt, thematicElementsPrompt }
    }

    const extractCharacters = () => {
        let result = "";
        initialStoryData?.suggestedCharacters?.forEach(character => {
            result += ` Name: ${character.name}, Role: ${character.role}.`;
        });
        return result;
    }

    return (
        <Sheet open={openModifyExpositionModal} onOpenChange={setOpenModifyExpositionModal}>
            <SheetContent className="overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
                <SheetHeader className=''>
                    <SheetTitle className='font-bold text-2xl'>Let's modify the exposition of the story:</SheetTitle>
                    <SheetDescription className=''>Add Exposition Suggestions</SheetDescription>
                    
                    <div className=''>

                        <div className='my-3'>
                            <div className='mb-7'>
                                <Textarea 
                                value={newExposition}
                                onChange={e => setNewExposition(e.target.value)}
                                className='flex-1 text-black mb-3'
                                placeholder='Add more expositions...'/>
                                <div>
                                    <p className='text-xs text-red-600'>{error || ''}</p>
                                </div>
                                <Button className='mt-3' onClick={createExposition}>Add</Button>
                            </div>

                            <p className='mb-2 text-sm font-semibold'>Exposition Suggestions</p>
                            {
                                expositionSuggestions.map((exposition, index) => (
                                    <div className="flex items-center gap-3 mb-2" key={index}>
                                        <input 
                                            type='checkbox' 
                                            className='' 
                                            value={exposition}
                                            checked={haveExpositionBeenChecked(exposition)}
                                            onChange={(e) => handleExpositionCheckboxChange(e, exposition)}
                                            id={`_${index}_`}
                                        />
                                        <label htmlFor={`_${index}_`} className='text-xs'>{exposition}</label>
                                    </div>
                                ))
                            }

                            <Button className='mt-2' onClick={applyExpositionChanges}>Save</Button>

                        </div>    

                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default ModifyExpositionComponent
