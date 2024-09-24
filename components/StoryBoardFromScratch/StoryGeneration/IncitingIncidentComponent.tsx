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

interface IncitingIncidentComponentProps {
    initialStory: StoryInterface;
    refetch: () => void;
    generating: boolean;
    setGenerating: React.Dispatch<React.SetStateAction<boolean>>
    updateStoryStructure: (payload: object) => Promise<boolean>;
}

const IncitingIncidentComponent: React.FC<IncitingIncidentComponentProps> = ({
    initialStory,
    refetch,
    generating, 
    setGenerating,
    updateStoryStructure,
  }) => {

    const [incitingIncident, setIncitingIncident] = useState<string>(initialStory?.storyStructure?.incitingIncident ?? "");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const dynamicJwtToken = getAuthToken();

    useEffect(() => {
        adjustHeight();
    }, [incitingIncident]);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const writeIncitingIncident = async () => {
        let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt, 
            whatCharacterWantAndWhoHasItPrompt, protagonistsPrompt, protagonistObstaclePrompt, 
            protagonistGoalMotivationsPrompt
        } = extractTemplatePrompts(initialStory);
        try {

            // const prompt = `
            //     You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.       
            //     Based on the following context, generate a compelling *Inciting Incident* that will trigger the story's main conflict and propel the protagonist into action. 
            //     You will use the provided information to generate a cohesive story outline that follows the three-act structure.
                
            //     We have already written the introduction of the protagonist & the ordinary world which is: {introduceProtagonistAndOrdinaryWorld}

            //     **CONTEXT**:
            //     We have been able to answer the following questions:            
            //     - What does the character want & Who has what the character want? The answer is {whatCharacterWantAndWhoHasIt}
            //     - What obstacles or challenges does the character(s) face in achieving their goal? The answer is {protagonistObstacle}
            //     - What motivates or drives the protagonist(s) to pursue their goal? The answer is {protagonistGoalMotivation}

            //     **OUTPUT**
            //     Ensure the *Inciting Incident* significantly disrupts the protagonist's ordinary world, creates high stakes, and sets the protagonist on their journey to pursue their goal. The incident should be emotionally impactful, logical within the story’s genre, and directly connected to the protagonist's motivations. Keep the tone consistent with the genre: {genre}.
            //     Provide the Inciting Incident as a narrative scene with vivid descriptions and dialogue if necessary.
            //     The inciting incident is often brief but impactful, designed to quickly hook the reader and introduce the main conflict.
            //     Ensure your response is not less than 500 words ensuring that the introduction of the protagonist & the ordinary world transitions smoothly into the inciting incident.
            //     Ensure your response does not contain any title, just the story you have been instructed to write.

            //     **INPUT**
            //     the protagonists: {protagonists}
            //     introduceProtagonistAndOrdinaryWorld: {introduceProtagonistAndOrdinaryWorld}
            //     other characters: {otherCharacters}
            //     story setting: {setting}
            //     genre: {genre}
            //     thematic element & option: {thematicElement}
            //     suspense technique: {suspenseTechnique}
            //     suspense technique description: {suspenseTechniqueDescription}
            // `;

            const prompt = `
            You are a professional storyteller and narrative designer with expertise in creating compelling narratives, intricate characters, and captivating worlds. Your task is to generate a powerful *Inciting Incident* that will trigger the story's main conflict and propel the protagonist into action. Use the provided context to create a cohesive story outline that adheres to the three-act structure.

            **CONTEXT**
            We have already introduced the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}

            Answered questions:
            - What does the character want, and who has it? {whatCharacterWantAndWhoHasIt}
            - What obstacles does the character face? {protagonistObstacle}
            - What motivates the protagonist to pursue their goal? {protagonistGoalMotivation}

            **OUTPUT**
            Generate the *Inciting Incident* that significantly disrupts the protagonist's ordinary world, raises the stakes, and initiates their journey to achieve their goal. The scene should be emotionally impactful, genre-appropriate, and aligned with the protagonist’s motivations. Use vivid descriptions and dialogue when necessary. Ensure the transition from the protagonist's introduction and ordinary world to the inciting incident is smooth.

            - Length: At least 500 words.
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

                protagonistObstacle: protagonistObstaclePrompt,
                protagonistGoalMotivation: protagonistGoalMotivationsPrompt,
                whatCharacterWantAndWhoHasIt: whatCharacterWantAndWhoHasItPrompt,

                protagonists: protagonistsPrompt,
                otherCharacters: otherCharactersPrompt,
                setting: initialStory?.setting,
                genre: genrePrompt,
                suspenseTechnique: initialStory?.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStory?.suspenseTechnique?.description,
                thematicElement: thematicElementsPrompt,
            });

            if (!response) {
                return;
            }
    
            let text = ``
            for await (const chunk of response) {
                console.log(chunk);   
                text += chunk;   
                setIncitingIncident(text)          
            }
            setGenerating(false);        

        } catch (error) {
            console.error(error);   
            setGenerating(false);
        }
    }

    const saveIncitingIncident = async () => {
        try {
            await updateStoryStructure({ incitingIncident });
      
        } catch (error) {
        console.error(error);        
        }
    }

    return (
        <AccordionItem value="item-2" className="mb-3 border-none bg-gray-50 rounded-2xl">
            <AccordionTrigger className='text-sm bg-white px-4 rounded-2xl text-gray-700'>
                <p className='font-bold'>
                Inciting Incident
                </p>              
            </AccordionTrigger>   
            <AccordionContent>
                <div className='bg-gray-50 px-5 rounded-2xl mt-1'>
                <p className='text-xs'>
                A key event disrupts the protagonist's life, setting the story in motion. This incident introduces the central conflict.              
                </p>  
           
                <div className='mt-5'>
                    <Button className='' disabled={generating} onClick={writeIncitingIncident}>
                    Generate 
                    <Cog className='w-4 h-4 ml-2' />
                    </Button>
                </div>
                
                <div className='mt-5'>

                    <textarea 
                    rows={10} 
                    ref={textareaRef}
                    onFocus={(e) => {
                      setIncitingIncident(e.target.value);
                      adjustHeight(); // Adjust height on every change
                    }}
                    disabled={generating}
                    onChange={(e) => {
                      setIncitingIncident(e.target.value);
                      adjustHeight(); // Adjust height on every change
                    }}
                    value={incitingIncident} 
                    placeholder=''
                    className='py-2 px-4 mb-4 outline-none border text-xs rounded-lg w-full leading-5' 
                    />

                    <div className='mt-3'>
                        <Button 
                        disabled={!incitingIncident || generating}                    
                        className='bg-custom_green text-white hover:bg-custom_green' onClick={saveIncitingIncident}>
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

export default IncitingIncidentComponent
