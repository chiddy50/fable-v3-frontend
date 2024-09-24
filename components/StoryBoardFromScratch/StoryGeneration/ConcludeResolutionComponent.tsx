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

interface ConcludeResolutionComponentProps {
  initialStory: StoryInterface;
  refetch: () => void;
  generating: boolean;
  updateStoryStructure: (payload: object) => Promise<boolean>;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConcludeResolutionComponent: React.FC<ConcludeResolutionComponentProps> = ({
  initialStory,
  refetch,
  generating, 
  setGenerating,
  updateStoryStructure
  }) => {

    const [resolution, setResolution] = useState<string>(initialStory?.storyStructure?.resolution ?? "");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        adjustHeight();
    }, [resolution]);

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    const writeResolution = async () => {
      let { 
        genrePrompt, thematicElementsPrompt, otherCharactersPrompt, 
        protagonistsPrompt, 
        howCharacterGoalChangeRelationshipPrompt, emotionTriggerEventPrompt, howProtagonistOvercomeObstaclePrompt,
        howCharactersGoalsAndPrioritiesChangedPrompt, howCharacterHasGrownPrompt
      } = extractTemplatePrompts(initialStory);
      try {

        //   const prompt = `
        //     You are a professional storyteller and narrative designer with expertise in creating compelling narratives, intricate characters, and captivating worlds. Your task is to generate a powerful *Inciting Incident* that will trigger the story's main conflict and propel the protagonist into action. Use the provided context to create a cohesive story outline that adheres to the three-act structure.

        //     **CONTEXT**
        //     We have already introduced the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}.
        //     We have already written the inciting incident: {incitingIncident}.
        //     We have already written the First Plot Point: {firstPlotPoint}.
        //     We have already written the Rising Action & Midpoint: {risingActionAndMidpoint}.
        //     We have already written the Pinch Points and Second Plot Point: {pinchPointAndSecondPlotPoint}.

        //     Generate the Climax and Falling Action of the story.            
        //     The Climax is typically the most intense and critical moment in the story, and the questions above will help you write about the character's emotional state, their problem-solving, and the consequences of their actions. is the point of greatest tension or action, and it determines the outcome of the story, the protagonist's decisions and actions here have lasting consequences. 
        //     The Falling Action is the consequence of the climax, It provides closure for the characters and the audience, offering a glimpse of the new normal for the protagonist and others.
        //     The following questions and answers will help to generate the Climax and Falling Action of the story:
        //     - What events or circumstances trigger strong emotions in the character? {emotionTriggerEvent}
        //     - How does the character overcome obstacles? {howProtagonistOvercomeObstacle}
        //     - How do the character's relationships and conflicts change as they go after their goal? {howCharacterGoalChangeRelationship}
        //     - How has the character changed or grown through their experiences? {howCharacterHasGrown}
        //     - How have the character's goals and priorities changed throughout their journey? {howCharactersGoalsAndPrioritiesChanged}

        //     **OUTPUT**
        //     Generate the Climax and Falling Action. Use vivid descriptions and dialogue when necessary. 
        //     Ensure the transition from the protagonist's introduction & ordinary world, inciting incident, First Plot Point, Rising Action & Midpoint, Pinch Point & Second Plot Point to the Climax and Falling Action is smooth.
        //     Ensure you continue from where the Pinch Points and Second Plot Point ended.

        //     - No titles or additional commentary, just the story.
        //     - Maintain the genre's tone: {genre}.

        //     **INPUT**
        //     Protagonists: {protagonists}
        //     Other characters: {otherCharacters}
        //     Setting: {setting}
        //     Genre: {genre}
        //     Thematic element & option: {thematicElement}
        //     Suspense technique: {suspenseTechnique}
        //     Suspense technique description: {suspenseTechniqueDescription}
        // `;

        const prompt = `
        You are a professional storyteller and narrative designer with expertise in crafting compelling narratives, intricate characters, and captivating worlds. Your task is to generate the *Climax* and *Falling Action* of the story based on the context provided.

        **CONTEXT**
        - Protagonist's Introduction & Ordinary World: {introduceProtagonistAndOrdinaryWorld}
        - Inciting Incident: {incitingIncident}
        - First Plot Point: {firstPlotPoint}
        - Rising Action & Midpoint: {risingActionAndMidpoint}
        - Pinch Points & Second Plot Point: {pinchPointAndSecondPlotPoint}
        - Climax & Falling Action: {climaxAndFallingAction}

        **TASK**
        Generate the Resolution & Epilogue of the story:
        The Resolution is more focused on the final outcome and conclusion of the story.
        The Epilogue is a short section that comes after the Resolution. It is often used to provide a glimpse into the future or to offer additional context, closure, or reflection on the characters' fates.
        While an Epilogue is not always necessary, an Epilogue can give the reader a sense of what happens to the characters after the main story concludes. It can also be used to tie up any remaining loose threads or set up for a sequel.

        Use the following to guide your writing:
        - How has the character changed or grown through their experiences? {howCharacterHasGrown}
        - How have the character's goals and priorities changed throughout their journey? {howCharactersGoalsAndPrioritiesChanged}
        - How does the character overcome obstacles? (problem-solving and adaptation) {howProtagonistOvercomeObstacle}
        - Are there any unresolved issues from the character's departure that impact their reentry into the story?

        **OUTPUT**
        - Continue seamlessly from where the Climax & Falling Action stopped.
        - Use vivid descriptions and dialogue to enhance the Resolution & Epilogue.
        - Maintain the tone and style of the {genre} genre throughout.

        Ensure your response does not contain any title, just the story you have been instructed to write. Do not add the word Epilogue while generating the response just the story only.
        The Resolution should range between 500 to 1,500. The Epilogue should range between 300 to 800 words

        **INPUT**
        - Protagonists: {protagonists}
        - Other characters: {otherCharacters}
        - Setting: {setting}
        - Genre: {genre}
        - Thematic element & option: {thematicElement}
        - Suspense technique: {suspenseTechnique}
        - Suspense technique description: {suspenseTechniqueDescription}
      `;


        setGenerating(true);

        const response = await streamLLMResponse(prompt, {
          introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
          incitingIncident: initialStory?.storyStructure.incitingIncident,
          firstPlotPoint: initialStory?.storyStructure.firstPlotPoint,
          risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpoint,
          pinchPointAndSecondPlotPoint: initialStory?.storyStructure?.pinchPointsAndSecondPlotPoint,
          climaxAndFallingAction: initialStory?.storyStructure?.climaxAndFallingAction,

          emotionTriggerEvent: emotionTriggerEventPrompt,
          howProtagonistOvercomeObstacle: howProtagonistOvercomeObstaclePrompt,
          howCharacterGoalChangeRelationship: howCharacterGoalChangeRelationshipPrompt,
          howCharacterHasGrown: howCharacterHasGrownPrompt,
          howCharactersGoalsAndPrioritiesChanged: howCharactersGoalsAndPrioritiesChangedPrompt,          

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
          text += chunk;   
          setResolution(text);          
        }      
        setGenerating(false);

      } catch (error) {
        // setGenerating(false);
        console.error(error);            
      }
    }

    const saveResolution = async () => {
      try {
        await updateStoryStructure({ resolution });  
      } catch (error) {
        console.error(error);        
      }
    }

    return (
        <AccordionItem value="item-2" className="mb-3 border-none bg-gray-50 rounded-2xl">
            <AccordionTrigger className='text-sm bg-gray-50 px-4 rounded-2xl text-gray-700'>
              <p className='font-bold'>Resolution</p>              
            </AccordionTrigger>   
            <AccordionContent>
              <div className='bg-gray-50 px-5 rounded-2xl mt-1'>
                <p className='text-xs'>
                The story concludes, resolving the main conflict and showing how the protagonist has changed.
                </p>  
           
                <div className='mt-5'>
                  <Button className='' disabled={generating} onClick={writeResolution}>
                  Generate 
                  <Cog className='w-4 h-4 ml-2' />
                  </Button>
                </div>
                
                <div className='mt-5'>

                  <textarea 
                  rows={10} 
                  ref={textareaRef}
                  onFocus={(e) => {
                    setResolution(e.target.value);
                    adjustHeight(); // Adjust height on every change
                  }}
                  disabled={generating}
                  onChange={(e) => {
                    setResolution(e.target.value);
                    adjustHeight(); // Adjust height on every change
                  }}
                  value={resolution} 
                  placeholder=''
                  className='py-2 px-4 mb-4 outline-none border text-xs rounded-lg w-full leading-5' 
                  />

                  <div className='mt-3'>
                    <Button 
                    disabled={!resolution || generating}                    
                    className='bg-custom_green text-white hover:bg-custom_green' onClick={saveResolution}>
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

export default ConcludeResolutionComponent
