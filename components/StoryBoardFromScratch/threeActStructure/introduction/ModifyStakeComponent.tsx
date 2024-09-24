"use client";

import { StoryInterface, SuggestionItem } from '@/interfaces/StoryInterface';
import React, { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThematicOptionInterface } from '@/interfaces/ThematicOptionInterface';
import { extractTemplatePrompts, queryLLM, threeActStructureDefinition } from '@/services/LlmQueryHelper';
import { hidePageLoader, showPageLoader } from '@/lib/helper';

interface ModifyStakeComponentProps {
  openModifyStakeModal: boolean;
  setOpenModifyStakeModal: React.Dispatch<React.SetStateAction<boolean>>;    
  selectedStake: string[];
  setSelectedStake: React.Dispatch<React.SetStateAction<string[]>>;
  stakeSuggestions: string[];
  setStakeSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  initialStoryData: StoryInterface;
  saveStory: (val: any) => null|object;
}

const ModifyStakeComponent: React.FC<ModifyStakeComponentProps> = ({
    openModifyStakeModal,
    setOpenModifyStakeModal,
    selectedStake,
    setSelectedStake,
    stakeSuggestions,
    setStakeSuggestions,
    initialStoryData,
    saveStory
}) => {
    const [newStake, setNewStake] = useState<string>("");
    const [error, setError] = useState<string>("");

    const applyStakeChanges = async () => {
        try {            
            let { tonePrompt, expositionPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(initialStoryData);
            
            const startingTemplate = `
                You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
                Based on the three act structure, analyze the provided plot, story title, introduction exposition, introduction tone, hook, genre, existing characters, suspense technique, thematic element, and thematic option provided, analyze the information then try to incorporate the additional stakes into the story's introduction without changing the narrative:    
                ${threeActStructureDefinition}
        
                Return your response in a json or javascript object format like: 
                newPlot(string, these would be a new plot based on the tone), 
                exposition(array, these would be a new exposition based on the tone {tone}), 
                expositionSuggestions(array, these would be new exposition suggestions based on the tone {tone}), 
                expositionSummary(array, these would be a new exposition suggestions based on the tone {tone}), 
                hook(array, these would be a new hooks based on the tone {tone}), 
                hookSuggestions(array, these would be a new hooks based on the tone {tone}) and characters(array of objects with keys like name(string), age(string), role(string), gender(string), motivations(array), skinTone(string), hair(string. If the character has hair describe it if not just indicate no hair), facialFeatures(string), motivations(array), personalityTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string), and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)) as keys.                                  

                Please ensure the only keys in the objects are newPlot, exposition, expositionSummary, hook, suggestionsForHook and characters only.
                Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
                introduction stakes: {stakes}
                introduction tone: {tone}
                introduction exposition: {exposition}
                plot: {storyPlot}
                story title: {storyTitle}
                genre: {genre}
                thematic element & option: {thematicElement}
                suspense technique: {suspenseTechnique}
                suspense technique description: {suspenseTechniqueDescription}
            `;
    
            showPageLoader();
        
            const response = await queryLLM(startingTemplate, {
                stakes: selectedStake.map(hook => hook).join(' '),
                tone: tonePrompt,
                exposition: expositionPrompt,
                genre: genrePrompt,
                thematicElement: thematicElementsPrompt,
                storyTitle: initialStoryData.title,
                storyPlot: initialStoryData.overview,
                suspenseTechnique: initialStoryData.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStoryData.suspenseTechnique?.description,
            });
            // return;
    
            if (response) {
                const storyStarterSaved = await saveStory({ 
                    stakeSetting: {
                        stakes: selectedStake,
                        stakeSuggestions: stakeSuggestions,
                        newPlot: response?.newPlot,
                        exposition: response?.exposition,
                        expositionSuggestions: [...response?.exposition, ...response?.expositionSuggestions],
                        expositionSummary: response?.expositionSummary,
                        hook: response?.hook,
                        hookSuggestions: [...response?.hook, ...response?.hookSuggestions],            
                    }
                });   
                setOpenModifyStakeModal(false);
            }
    
        } catch (error) {
          console.error(error);            
        }finally{
          hidePageLoader();
        }
    }

    const createStake = async () => {
        try {
          let { expositionPrompt, tonePrompt, stakesPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(initialStoryData);
    
          setError("");
    
          const startingTemplate = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
            A new stake which is {stake} is being added to the existing stake, analyze the story plot, story title, existing tone, genre, suspense technique, thematic element, and thematic option provided then try to incorporate the new stake {stake} into the story's introduction stake without changing the narrative:
            
            * Tone: The mood or atmosphere of the story is established here. Whether it's serious, lighthearted, mysterious, or suspenseful, the tone sets expectations for how the audience will feel as the story unfolds.
    
            However, if the stake which is {stake} does not make sense or the stake sets does not set expectations for how the audience will feel as the story unfolds or is not a valid stake, return a message indicating what is wrong with the stake or sentence. For example, you could say something like:
            - "I'm not sure what you mean by '{stake}'. Could you please rephrase it?".
            - " '{stake}' doesn't seem to fit with the existing stake. Could you provide more context?".
            - "I'm not familiar with the term '{stake}'. Could you define it?".
            These should be inside the reason string in the response.
            On the other hand, if the stake is valid and fits into the story's narrative, proceed to incorporate it into the story's introduction stake as usual.
    
            Return your response in a json or javascript object format like: valid(boolean, true if it is valid & false if it is not), newStake(string, this should contain only the newly added {stake} and if there are any grammatical errors, kindly correct it) and reason(string, this is the reason it is not a valid stake if it is not) as keys. Please ensure the only keys in the objects are valid, stake and reason only.
            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
            existing stake: {existingStake}
            stake: {stake}
            exposition: {exposition}
            plot: {storyPlot}
            story title: {storyTitle}
            genre: {genre}
            thematic element & option: {thematicElement}
            suspense technique: {suspenseTechnique}
            suspense technique description: {suspenseTechniqueDescription}
          `;
    
          showPageLoader();
    
          const response = await queryLLM(startingTemplate, {
            stake: newStake,
            existingStake: stakesPrompt,
            exposition: expositionPrompt,
            tone: tonePrompt,
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
            setStakeSuggestions(item => [...item, newStake]);
          }
          
        } catch (error) {
          console.error(error);            
        }finally{
          hidePageLoader();
        }
    
      }
    
      const haveStakeBeenChecked = (tone: string): boolean => {
        return selectedStake.includes(tone);
      };
    
      const handleStakeCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, stake: string) => {      
        const updatedCheckedStake = [...selectedStake];
        
        if (e.target.checked) {
            // Add the checked item to the array
            updatedCheckedStake.push(stake);
        } else {
            // Remove the unchecked item from the array
            const index = updatedCheckedStake.indexOf(stake);
            if (index > -1) {
                updatedCheckedStake.splice(index, 1);
            }
        }                
        // Update the state with the new checked items
        setSelectedStake(updatedCheckedStake);
      };
    
      return (
        <Sheet open={openModifyStakeModal} onOpenChange={setOpenModifyStakeModal}>
          <SheetContent className="overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
            <SheetHeader className=''>
                <SheetTitle className='font-bold text-2xl'>Let's modify the stake of the story's introduction:</SheetTitle>
                <SheetDescription className=''>Add Stake Suggestions</SheetDescription>
                
                <div className=''>
    
                    <div className='my-3'>
                        <div className='mb-7'>
                            <Textarea 
                            value={newStake}
                            onChange={e => setNewStake(e.target.value)}
                            className='flex-1 text-black mb-3'
                            placeholder='Add more stakes...'/>
                            <div>
                                <p className='text-xs text-red-600'>{error || ''}</p>
                            </div>
                            <Button className='mt-1' onClick={createStake}>Add</Button>
                        </div>
    
                        <p className='mb-2 text-sm font-semibold'>Tone Suggestions</p>
                        {
                            stakeSuggestions.map((stake, index) => (
                                <div className="flex items-center gap-3 mb-2" key={index}>
                                    <input 
                                        type='checkbox' 
                                        className='' 
                                        value={stake}
                                        checked={haveStakeBeenChecked(stake)}
                                        onChange={(e) => handleStakeCheckboxChange(e, stake)}
                                        id={`_${index}_`}
                                    />
                                    <label htmlFor={`_${index}_`} className='text-xs'>{stake}</label>
                                </div>
                            ))
                        }
    
                        <Button className='mt-2' onClick={applyStakeChanges}>Save</Button>
    
                    </div>    
    
                </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )
}

export default ModifyStakeComponent
