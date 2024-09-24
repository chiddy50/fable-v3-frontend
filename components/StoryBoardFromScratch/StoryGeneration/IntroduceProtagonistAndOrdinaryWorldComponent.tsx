"use client";

import { StoryInterface } from '@/interfaces/StoryInterface';
import { extractTemplatePrompts, streamLLMResponse } from '@/services/LlmQueryHelper';
import React, { useEffect, useRef, useState } from 'react'
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { Cog, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { makeRequest } from '@/services/request';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { toast } from 'sonner';


interface IntroduceProtagonistAndOrdinaryWorldProps {
  initialStory: StoryInterface;
  refetch: () => void;
  generating: boolean;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>
  updateStoryStructure: (payload: object) => Promise<boolean>;
}

const IntroduceProtagonistAndOrdinaryWorldComponent: React.FC<IntroduceProtagonistAndOrdinaryWorldProps> = ({
    initialStory,
    refetch,
    generating, 
    setGenerating,
    updateStoryStructure
  }) => {
  const [introduceProtagonistAndOrdinaryWorld, setIntroduceProtagonistAndOrdinaryWorld] = useState<string>(initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const dynamicJwtToken = getAuthToken();
    
  useEffect(() => {
    adjustHeight();
  }, [introduceProtagonistAndOrdinaryWorld]);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const generateIntroduceProtagonistAndOrdinaryWorld = async () => {
    let wordCount = 250
    let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt, whatCharacterWantAndWhoHasItPrompt, protagonistsPrompt } = extractTemplatePrompts(initialStory);

    let question = initialStory?.characters?.length > 1 ? `Who are the protagonists? The protagonists are` : `Who is the protagonist? The protagonist is`
    let question2 = initialStory?.characters?.length > 1 ? `What does the characters want & Who has what they character want` : `What does the character want & Who has what the character want`
    try {

      // Use this information to create a detailed story outline or overview. Capture the emotional journey of the protagonist, the conflicts they face, and how they evolve throughout the story.
      // Return the outline in the form of a three-act summary, ensuring each act transitions smoothly into the next. Provide a cohesive narrative that ties all the elements together.
      const prompt = `
      You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
      Capture the emotional journey of the protagonist, the conflicts they face, and how they evolve throughout the story.
      You will use the provided information to generate a cohesive story outline that follows the three-act structure.
      We have been able to answer the following questions:            
      - ${question} {protagonists}
      - ${question2} {whatCharacterWantAndWhoHasIt}

      **OUTPUT**
      Introduce the main characters, setting, and the protagonist's ordinary world before the story's main conflict begins. Ensure your response does not contain any title, just the story you have been instructed to write. 
      I need you to write the opening lines or introduction of the story using the information provided, just introduce the character and their setting.
      Also ensure that your response is not less than 250 words.

      **INPUT**
      the protagonists: {protagonists}
      What does the character want & Who has what the character want: {whatCharacterWantAndWhoHasIt}
      other characters: {otherCharacters}
      story setting: {setting}
      genre: {genre}
      thematic element & option: {thematicElement}
      suspense technique: {suspenseTechnique}
      suspense technique description: {suspenseTechniqueDescription}
      `;
      // word count: {wordCount},    
    
      setGenerating(true);
      const response = await streamLLMResponse(prompt, {
        wordCount: {wordCount},
        setting: initialStory?.setting,
        protagonists: protagonistsPrompt,
        whatCharacterWantAndWhoHasIt: whatCharacterWantAndWhoHasItPrompt,
        otherCharacters: otherCharactersPrompt,
        genre: genrePrompt,
        suspenseTechnique: initialStory?.suspenseTechnique?.value,
        suspenseTechniqueDescription: initialStory?.suspenseTechnique?.description,
        thematicElement: thematicElementsPrompt,
      });
      if (!response) {
        toast.error("Try again please");
        return;
      }

      let text = ``
      for await (const chunk of response) {
        console.log(chunk);   
        text += chunk;   
        setIntroduceProtagonistAndOrdinaryWorld(text)          
      }
      setGenerating(false);

      console.log(response);
        
    } catch (error) {
      console.error(error);   
      setGenerating(false);
    }
  }
  
  const saveIntroduceProtagonistAndOrdinaryWorld = async () => {
    try {
      await updateStoryStructure({ introduceProtagonistAndOrdinaryWorld });

    } catch (error) {
      console.error(error);        
    }
  }
    
  return (
    <AccordionItem value="item-1" className="mb-3 bg-gray-50 rounded-2xl">
        <AccordionTrigger className='text-sm bg-gray-50 px-4 rounded-2xl text-gray-700'>
            <p className='font-bold'>
            Introduction of the Protagonist & Ordinary World.
            </p>
            
        </AccordionTrigger>   
        <AccordionContent>
          <div className='bg-gray-50 px-5 rounded-2xl'>
          <p className='text-sm'>
          This is where we introduce the main characters, setting, and the protagonist's ordinary world before the story's main conflict begins.
          </p>  

          <div className="mt-5">
              <h1 className="text-xl text-gray-500">Our protagonist(s)</h1>
              {initialStory?.characters?.filter(character => character.isProtagonist).
              map(character => (
              <p key={character.id} className='text-xs '>{`${character?.name} ${character?.backstory}`}</p>
              ))}
          </div>
          <div className='mt-5'>
              <Button className='' disabled={generating} onClick={generateIntroduceProtagonistAndOrdinaryWorld}>
              Generate 
              <Cog className='w-4 h-4 ml-2' />
              </Button>
          </div>
          
          <div className='mt-5'>

              <textarea rows={5} 
              style={{ overflow: 'hidden' }}
              ref={textareaRef}
              onFocus={(e) => {
                setIntroduceProtagonistAndOrdinaryWorld(e.target.value);
                adjustHeight(); // Adjust height on every change
              }}
              disabled={generating}
              onChange={(e) => {
                setIntroduceProtagonistAndOrdinaryWorld(e.target.value);
                adjustHeight(); // Adjust height on every change
              }}
              value={introduceProtagonistAndOrdinaryWorld} 
              placeholder=''
              className='p-5 mb-4 outline-none border text-xs rounded-lg w-full leading-5' 

              />

              <div className='mt-3'>
              <Button  
              disabled={!introduceProtagonistAndOrdinaryWorld || generating}
              className='bg-custom_green text-white hover:bg-custom_green' onClick={saveIntroduceProtagonistAndOrdinaryWorld}>
                  Save 
                  <Save className='w-4 h-4 ml-2' />
              </Button>
              </div>
          </div>            
          </div> 
            
        </AccordionContent>
    </AccordionItem>   
  )
}

export default IntroduceProtagonistAndOrdinaryWorldComponent
