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
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { makeRequest } from '@/services/request';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { toast } from 'sonner';

interface FirstPlotPointComponentProps {
  initialStory: StoryInterface;
  refetch: () => void;
  generating: boolean;
  updateStoryStructure: (payload: object) => Promise<boolean>;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

const FirstPlotPointComponent: React.FC<FirstPlotPointComponentProps> = ({
    initialStory,
    refetch,
    generating, 
    setGenerating,
    updateStoryStructure
  }) => {

    const [firstPlotPoint, setFirstPlotPoint] = useState<string>(initialStory?.storyStructure?.firstPlotPoint ?? "");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const dynamicJwtToken = getAuthToken();

    useEffect(() => {
        adjustHeight();
    }, [firstPlotPoint]);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const writeFirstPlotPoint = async () => {
      let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt, 
          whatCharacterWantAndWhoHasItPrompt, protagonistsPrompt, protagonistObstaclePrompt, 
          protagonistGoalMotivationsPrompt, whatTheCharacterWantPrompt, whoDoesNotHaveCharacterGoalPrompt
      } = extractTemplatePrompts(initialStory);
      try {

      const prompt = `
        You are a professional storyteller and narrative designer with expertise in creating compelling narratives, intricate characters, and captivating worlds. Your task is to generate a powerful *Inciting Incident* that will trigger the story's main conflict and propel the protagonist into action. Use the provided context to create a cohesive story outline that adheres to the three-act structure.

        **CONTEXT**
        We have already introduced the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}.
        We have already written the inciting incident: {incitingIncident}.

        Generate the First Plot Point of the story. 
        The First Plot Point needs to effectively introduce a key turning point that propels the protagonists into the main action of the story, so it typically involves a clear, detailed setup.
        The First Plot Point is typically the moment when the protagonist's ordinary world is disrupted, and they are set on a path towards the main conflict. 
        To help write about this part of the story, the following question can be helpful:
        - Who does not have what they want? This question can help you think about what is lacking in the protagonist's life, what they desire, and what they need to achieve their goals. It can also help you create tension and conflict by establishing what is at stake for the protagonist.             
        - What obstacles does the character face? 
        - Who has what the character want?

        Answered questions:
        - Who does not have what they want? {whoDoesNotHaveWhatTheyWant}
        - What obstacles does the character face? {protagonistObstacle}
        - Who has what the character want? {whatTheCharacterWant}

        **OUTPUT**
        Generate the First Plot Point of the story. Use vivid descriptions and dialogue when necessary. 
        Ensure the transition from the protagonist's introduction and ordinary world and inciting incident to the First Plot Point is smooth.

        - No titles or additional commentary, just the story.
        - Maintain the genre's tone: {genre}.

        **INPUT**
        Protagonists: {protagonists}
        Other characters: {otherCharacters}
        Setting: {setting}
        Genre: {genre}
        Thematic element & option: {thematicElement}
        Suspense technique: {suspenseTechnique}
        Suspense technique description: {suspenseTechniqueDescription}
      `;

      setGenerating(true);
      const response = await streamLLMResponse(prompt, {
          introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
          incitingIncident: initialStory?.storyStructure.incitingIncident,
          protagonistObstacle: protagonistObstaclePrompt,
          protagonistGoalMotivation: protagonistGoalMotivationsPrompt,
          whatCharacterWantAndWhoHasIt: whatCharacterWantAndWhoHasItPrompt,
          whoDoesNotHaveWhatTheyWant: whoDoesNotHaveCharacterGoalPrompt,
          whatTheCharacterWant: whatTheCharacterWantPrompt,

          protagonists: protagonistsPrompt,
          otherCharacters: otherCharactersPrompt,
          setting: initialStory?.setting,
          genre: genrePrompt,
          suspenseTechnique: initialStory?.suspenseTechnique?.value,
          suspenseTechniqueDescription: initialStory?.suspenseTechnique?.description,
          thematicElement: thematicElementsPrompt,
        });

        if (!response) {
          setGenerating(false);
          toast.error("Try again please");
          return;
        }

        let text = ``
        for await (const chunk of response) {
          console.log(chunk);   
          text += chunk;   
          setFirstPlotPoint(text)          
        }      
        setGenerating(false);

      } catch (error) {
        console.error(error);     
        setGenerating(false);
      }
    }

    const saveFirstPlotPoint = async () => {
      try {
        await updateStoryStructure({ firstPlotPoint });  
      } catch (error) {
        console.error(error);        
      }
    }

    return (
        <AccordionItem value="item-3" className="mb-3 border-none bg-gray-50 rounded-2xl">
            <AccordionTrigger className='text-sm bg-gray-50 px-4 rounded-2xl text-gray-700'>
              <p className='font-bold'>
              First Plot Point                
              </p>              
            </AccordionTrigger>   
            <AccordionContent>
              <div className='bg-gray-50 px-5 rounded-2xl mt-1'>
                <p className='text-xs'>
                A turning point where the protagonist is forced into the story's main action or conflict, marking the transition into Act 2.
                </p>  
           
                <div className='mt-5'>
                  <Button className='' disabled={generating} onClick={writeFirstPlotPoint}>
                  Generate 
                  <Cog className='w-4 h-4 ml-2' />
                  </Button>
                </div>
                
                <div className='mt-5'>

                  <textarea 
                  rows={10} 
                  ref={textareaRef}
                  onFocus={(e) => {
                    setFirstPlotPoint(e.target.value);
                    adjustHeight(); // Adjust height on every change
                  }}
                  disabled={generating}
                  onChange={(e) => {
                    setFirstPlotPoint(e.target.value);
                    adjustHeight(); // Adjust height on every change
                  }}
                  value={firstPlotPoint} 
                  placeholder=''
                  className='py-2 px-4 mb-4 outline-none border text-xs rounded-lg w-full leading-5' 
                  />

                  <div className='mt-3'>
                    <Button 
                    disabled={!firstPlotPoint || generating}                    
                    className='bg-custom_green text-white hover:bg-custom_green' onClick={saveFirstPlotPoint}>
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

export default FirstPlotPointComponent



