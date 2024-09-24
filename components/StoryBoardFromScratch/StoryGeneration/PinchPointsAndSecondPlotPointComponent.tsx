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

interface PinchPointsAndSecondPlotPointComponentProps {
  initialStory: StoryInterface;
  refetch: () => void;
  generating: boolean;
  updateStoryStructure: (payload: object) => Promise<boolean>;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

const PinchPointsAndSecondPlotPointComponent: React.FC<PinchPointsAndSecondPlotPointComponentProps> = ({
    initialStory,
    refetch,
    generating, 
    setGenerating,
    updateStoryStructure
  }) => {

    const [pinchPointsAndSecondPlotPoint, setPinchPointsAndSecondPlotPoint] = useState<string>(initialStory?.storyStructure?.pinchPointsAndSecondPlotPoint ?? "");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        adjustHeight();
    }, [pinchPointsAndSecondPlotPoint]);

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    const writePinchPointsAndSecondPlotPoint = async () => {
        let { 
            genrePrompt, thematicElementsPrompt, otherCharactersPrompt, 
            whatCharacterWantAndWhoHasItPrompt, protagonistsPrompt, protagonistObstaclePrompt, 
            protagonistGoalMotivationsPrompt, whatTheCharacterWantPrompt, whoDoesNotHaveCharacterGoalPrompt,
            howCharacterGoalChangeRelationshipPrompt, emotionTriggerEventPrompt, howProtagonistOvercomeObstaclePrompt
        } = extractTemplatePrompts(initialStory);
        try {

          const prompt = `
            You are a professional storyteller and narrative designer with expertise in creating compelling narratives, intricate characters, and captivating worlds. Your task is to generate a powerful *Inciting Incident* that will trigger the story's main conflict and propel the protagonist into action. Use the provided context to create a cohesive story outline that adheres to the three-act structure.

            **CONTEXT**
            We have already introduced the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}.
            We have already written the inciting incident: {incitingIncident}.
            We have already written the First Plot Point: {firstPlotPoint}.
            We have already written the Rising Action & Midpoint: {risingActionAndMidpoint}.

            Generate the Pinch Points and Second Plot Point part of the story. 
            The following questions and answers help to raise the stakes, create tension, and escalate the conflict, which are key elements of the Pinch Points and Second Plot Point.
            - What does the character want & Who has what the character want? {whatCharacterWantAndWhoHasIt}
            - Who does not have what they want? {whoDoesNotHaveWhatTheyWant}
            - What obstacles or challenges does the character(s) face in achieving their goal? {protagonistObstacle}
            - What motivates or drives the protagonist(s) to pursue their goal? {protagonistGoalMotivation}
            - What events or circumstances trigger strong emotions in the character? {emotionTriggerEvent}
            - How does the character overcome obstacles? {howProtagonistOvercomeObstacle}
            - How do the character's relationships and conflicts change as they go after their goal? {howCharacterGoalChangeRelationship}
            
            **OUTPUT**
            Generate the Pinch Points and Second Plot Point. Use vivid descriptions and dialogue when necessary. 
            Ensure the transition from the protagonist's introduction & ordinary world, inciting incident, First Plot Point, Rising Action & Midpoint, to the Pinch Point & Second Plot Point is smooth.

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
          firstPlotPoint: initialStory?.storyStructure.firstPlotPoint,
          risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpoint,

          whatCharacterWantAndWhoHasIt: whatCharacterWantAndWhoHasItPrompt,
          whoDoesNotHaveWhatTheyWant: whoDoesNotHaveCharacterGoalPrompt,
          protagonistObstacle: protagonistObstaclePrompt,
          howProtagonistOvercomeObstacle: howProtagonistOvercomeObstaclePrompt,
          howCharacterGoalChangeRelationship: howCharacterGoalChangeRelationshipPrompt,
          protagonistGoalMotivation: protagonistGoalMotivationsPrompt,
          emotionTriggerEvent: emotionTriggerEventPrompt,

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
            setPinchPointsAndSecondPlotPoint(text);          
          }      
          setGenerating(false);

        } catch (error) {
          setGenerating(false);
          console.error(error);            
        }
    }

    const savePinchPointsAndSecondPlotPoint = async () => {
      try {
        await updateStoryStructure({ pinchPointsAndSecondPlotPoint });  
      } catch (error) {
        console.error(error);        
      }
    }

    return (
        <AccordionItem value="item-2" className="mb-3 border-none bg-gray-50 rounded-2xl">
            <AccordionTrigger className='text-sm bg-gray-50 px-4 rounded-2xl text-gray-700'>
              <p className='font-bold'>
              Pinch Points & Second Plot Point
              </p>              
            </AccordionTrigger>   
            <AccordionContent>
              <div className='bg-gray-50 px-5 rounded-2xl mt-1'>
                <p className='text-xs'>
                  Reminder of the main conflict and antagonist, pushing the protagonist toward the climax.
                </p>  
           
                <div className='mt-5'>
                  <Button className='' disabled={generating} onClick={writePinchPointsAndSecondPlotPoint}>
                  Generate 
                  <Cog className='w-4 h-4 ml-2' />
                  </Button>
                </div>
                
                <div className='mt-5'>

                  <textarea 
                  rows={10} 
                  ref={textareaRef}
                  onFocus={(e) => {
                    setPinchPointsAndSecondPlotPoint(e.target.value);
                    adjustHeight(); // Adjust height on every change
                  }}
                  disabled={generating}
                  onChange={(e) => {
                    setPinchPointsAndSecondPlotPoint(e.target.value);
                    adjustHeight(); // Adjust height on every change
                  }}
                  value={pinchPointsAndSecondPlotPoint} 
                  placeholder=''
                  className='py-2 px-4 mb-4 outline-none border text-xs rounded-lg w-full leading-5' 
                  />

                  <div className='mt-3'>
                    <Button 
                    disabled={!pinchPointsAndSecondPlotPoint || generating}                    
                    className='bg-custom_green text-white hover:bg-custom_green' onClick={savePinchPointsAndSecondPlotPoint}>
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

export default PinchPointsAndSecondPlotPointComponent
