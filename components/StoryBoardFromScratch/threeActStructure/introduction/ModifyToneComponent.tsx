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

interface ModifyToneComponentProps {
  openModifyToneModal: boolean;
  setOpenModifyToneModal: React.Dispatch<React.SetStateAction<boolean>>;    
  selectedTone: string[];
  setSelectedTone: React.Dispatch<React.SetStateAction<string[]>>;
  toneSuggestions: string[];
  setToneSuggestions: React.Dispatch<React.SetStateAction<string[]>>;

  initialStoryData: StoryInterface;
  saveStory: (val: any) => null|object;
}

const ModifyToneComponent: React.FC<ModifyToneComponentProps> = ({
  openModifyToneModal,
  setOpenModifyToneModal,
  selectedTone,
  setSelectedTone,
  toneSuggestions,
  setToneSuggestions,
  initialStoryData,
  saveStory
}) => {
  const [newTone, setNewTone] = useState<string>("");
  const [error, setError] = useState<string>("");

  const applyToneChanges = async () => {
    try {            
      let { stakesPrompt, expositionPrompt, hookPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(initialStoryData);
      
      const startingTemplate = `
          You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
          Based on the three act structure, analyze the provided plot, story title, exposition, stakes, hook, genre, existing characters, suspense technique, thematic element, and thematic option provided, analyze the information then try to incorporate the additional tone into the story's introduction without changing the narrative:    
          ${threeActStructureDefinition}

          Return your response in a json or javascript object format like: 
          newPlot(string, these would be a new plot based on the tone), 
          exposition(array, these would be a new exposition based on the tone {tone}. introduce red herrings and misdirection elements to keep users guessing and engaged), 
          expositionSuggestions(array, these would be new exposition suggestions based on the tone {tone}. introduce red herrings and misdirection elements to keep users guessing and engaged), 
          expositionSummary(array, these would be a new exposition summary based on the tone {tone}), 
          hook(array, these would be a new hooks based on the tone, so introduce red herrings and misdirection elements to keep users guessing and engaged. This can include mistaken identities, hidden motives, or conflicting clues ), 
          hookSuggestions(array, these would be a new hooks based on the tone {tone}) and characters(array of objects with keys like name(string), age(string), role(string), gender(string), motivations(array), skinTone(string), hair(string. If the character has hair describe it if not just indicate no hair), facialFeatures(string), motivations(array), personalityTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string), and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)) as keys.                                  

          Please ensure the only keys in the objects are newPlot, exposition, expositionSummary, hook, suggestionsForHook and characters only.
          Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
          tone: {tone}
          exposition: {exposition}
          stakes: {stakes}
          plot: {storyPlot}
          story title: {storyTitle}
          genre: {genre}
          thematic element & option: {thematicElement}
          suspense technique: {suspenseTechnique}
          suspense technique description: {suspenseTechniqueDescription}
      `;

      showPageLoader();

      const response = await queryLLM(startingTemplate, {
        tone: selectedTone.map(hook => hook).join(' '),
        exposition: expositionPrompt,
        stakes: stakesPrompt,
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
          toneSetting: {
            tone: selectedTone,
            toneSuggestions: toneSuggestions,
            newPlot: response?.newPlot,
            exposition: response?.exposition,
            expositionSuggestions: [...response?.exposition, ...response?.expositionSuggestions],
            expositionSummary: response?.expositionSummary,
            hook: response?.hook,
            hookSuggestions: [...response?.hook, ...response?.hookSuggestions],            
          }
        });   
        setOpenModifyToneModal(false);
      }

    } catch (error) {
      console.error(error);            
    }finally{
      hidePageLoader();
    }
  }

  const createTone = async () => {
    try {
      let { expositionPrompt, tonePrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(initialStoryData);

      setError("");

      const startingTemplate = `
        You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
        A new tone which is {tone} is being added to the existing tone, analyze the story plot, story title, existing tone, genre, suspense technique, thematic element, and thematic option provided then try to incorporate the new tone {tone} into the story's introduction tone without changing the narrative:
        
        * Tone: The mood or atmosphere of the story is established here. Whether it's serious, lighthearted, mysterious, or suspenseful, the tone sets expectations for how the audience will feel as the story unfolds.

        However, if the tone which is {tone} does not make sense or the tone sets does not set expectations for how the audience will feel as the story unfolds or is not a valid tone, return a message indicating what is wrong with the tone or sentence. For example, you could say something like:
        - "I'm not sure what you mean by '{tone}'. Could you please rephrase it?".
        - " '{tone}' doesn't seem to fit with the existing tone. Could you provide more context?".
        - "I'm not familiar with the term '{tone}'. Could you define it?".
        These should be inside the reason string in the response.
        On the other hand, if the tone is valid and fits into the story's narrative, proceed to incorporate it into the story's introduction tone as usual.

        Return your response in a json or javascript object format like: valid(boolean, true if it is valid & false if it is not), newTone(string, this should contain only the newly added {tone} and if there are any grammatical errors, kindly correct it) and reason(string, this is the reason it is not a valid tone if it is not) as keys. Please ensure the only keys in the objects are valid, tone and reason only.
        Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
        existing tone: {existingTone}
        tone: {tone}
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
        tone: newTone,
        existingTone: tonePrompt,
        exposition: expositionPrompt,
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
        setToneSuggestions(item => [...item, newTone]);
      }
      
    } catch (error) {
      console.error(error);            
    }finally{
      hidePageLoader();
    }

  }

  const haveToneBeenChecked = (tone: string): boolean => {
    return selectedTone.includes(tone);
  };

  const handleToneCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, tone: string) => {      
    const updatedCheckedTone = [...selectedTone];
    
    if (e.target.checked) {
        // Add the checked item to the array
        updatedCheckedTone.push(tone);
    } else {
        // Remove the unchecked item from the array
        const index = updatedCheckedTone.indexOf(tone);
        if (index > -1) {
            updatedCheckedTone.splice(index, 1);
        }
    }                
    // Update the state with the new checked items
    setSelectedTone(updatedCheckedTone);
  };

  return (
    <Sheet open={openModifyToneModal} onOpenChange={setOpenModifyToneModal}>
      <SheetContent className="overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
        <SheetHeader className=''>
            <SheetTitle className='font-bold text-2xl'>Let's modify the tone of the story's introduction:</SheetTitle>
            <SheetDescription className=''>Add Tone Suggestions</SheetDescription>
            
            <div className=''>

                <div className='my-3'>
                    <div className='mb-7'>
                        <Textarea 
                        value={newTone}
                        onChange={e => setNewTone(e.target.value)}
                        className='flex-1 text-black mb-3'
                        placeholder='Add more expositions...'/>
                        <div>
                            <p className='text-xs text-red-600'>{error || ''}</p>
                        </div>
                        <Button className='mt-3' onClick={createTone}>Add</Button>
                    </div>

                    <p className='mb-2 text-sm font-semibold'>Tone Suggestions</p>
                    {
                        toneSuggestions.map((tone, index) => (
                            <div className="flex items-center gap-3 mb-2" key={index}>
                                <input 
                                    type='checkbox' 
                                    className='' 
                                    value={tone}
                                    checked={haveToneBeenChecked(tone)}
                                    onChange={(e) => handleToneCheckboxChange(e, tone)}
                                    id={`_${index}_`}
                                />
                                <label htmlFor={`_${index}_`} className='text-xs'>{tone}</label>
                            </div>
                        ))
                    }

                    <Button className='mt-2' onClick={applyToneChanges}>Save</Button>

                </div>    

            </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default ModifyToneComponent
