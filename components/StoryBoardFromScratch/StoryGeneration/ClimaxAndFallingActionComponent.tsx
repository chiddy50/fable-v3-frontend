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

interface ClimaxAndFallingActionComponentProps {
  initialStory: StoryInterface;
  refetch: () => void;
  generating: boolean;
  updateStoryStructure: (payload: object) => Promise<boolean>;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClimaxAndFallingActionComponent: React.FC<ClimaxAndFallingActionComponentProps> = ({
  initialStory,
  refetch,
  generating, 
  setGenerating,
  updateStoryStructure
  }) => {

    const [climaxAndFallingAction, setClimaxAndFallingAction] = useState<string>(initialStory?.storyStructure?.climaxAndFallingAction ?? "");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        adjustHeight();
    }, [climaxAndFallingAction]);

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    const writeClimaxAndFallingAction = async () => {
      let { 
        genrePrompt, thematicElementsPrompt, otherCharactersPrompt, 
        whatCharacterWantAndWhoHasItPrompt, protagonistsPrompt, protagonistObstaclePrompt, 
        protagonistGoalMotivationsPrompt, whoDoesNotHaveCharacterGoalPrompt,
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

        **TASK**
        Generate the Climax and Falling Action:
        - The *Climax* is the story's most intense moment, where the protagonist faces their greatest challenge and makes crucial decisions that shape the story's outcome.
        - The *Falling Action* explores the consequences of the Climax, providing closure and a glimpse of the protagonist's new reality or resolution.

        Use the following to guide your writing:
        - What emotional triggers does the character experience? {emotionTriggerEvent}
        - How does the protagonist overcome their obstacles? {howProtagonistOvercomeObstacle}
        - How do the character's relationships and conflicts evolve? {howCharacterGoalChangeRelationship}
        - How has the protagonist grown through their journey? {howCharacterHasGrown}
        - How have the character’s goals and priorities changed? {howCharactersGoalsAndPrioritiesChanged}

        **OUTPUT**
        - Continue seamlessly from the Pinch Points and Second Plot Point.
        - Use vivid descriptions and dialogue to enhance the Climax and Falling Action.
        - Maintain the tone and style of the {genre} genre throughout.
        - Merge the Climax and Falling Action together

        Ensure your response does not contain any title, just the story you have been instructed to write.
        The Climax should range between 500 to 1,500. The Falling Action should range between 300 to 800 words

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
          setClimaxAndFallingAction(text);          
        }      
        setGenerating(false);

      } catch (error) {
        // setGenerating(false);
        console.error(error);            
      }
    }

    const saveClimaxAndFallingAction = async () => {
      try {
        await updateStoryStructure({ climaxAndFallingAction });  
      } catch (error) {
        console.error(error);        
      }
    }

    return (
        <AccordionItem value="item-1" className="mb-3 border-none bg-gray-50 rounded-2xl">
            <AccordionTrigger className='text-sm bg-gray-50 px-4 rounded-2xl text-gray-700'>
              <p className='font-bold'>
              Climax & Falling Action
              </p>              
            </AccordionTrigger>   
            <AccordionContent>
              <div className='bg-gray-50 px-5 rounded-2xl mt-1'>
                <p className='text-xs'>
                The protagonist confronts their greatest challenge, followed by the consequences of the outcome.
                </p>  
           
                <div className='mt-5'>
                  <Button className='' disabled={generating} onClick={writeClimaxAndFallingAction}>
                  Generate 
                  <Cog className='w-4 h-4 ml-2' />
                  </Button>
                </div>
                
                <div className='mt-5'>

                  <textarea 
                  rows={10} 
                  ref={textareaRef}
                  onFocus={(e) => {
                    setClimaxAndFallingAction(e.target.value);
                    adjustHeight(); // Adjust height on every change
                  }}
                  disabled={generating}
                  onChange={(e) => {
                    setClimaxAndFallingAction(e.target.value);
                    adjustHeight(); // Adjust height on every change
                  }}
                  value={climaxAndFallingAction} 
                  placeholder=''
                  className='py-2 px-4 mb-4 outline-none border text-xs rounded-lg w-full leading-5' 
                  />

                  <div className='mt-3'>
                    <Button 
                    disabled={!climaxAndFallingAction || generating}                    
                    className='bg-custom_green text-white hover:bg-custom_green' onClick={saveClimaxAndFallingAction}>
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

export default ClimaxAndFallingActionComponent
