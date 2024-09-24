"use client";

import { Button } from '@/components/ui/button';
import { StoryInterface, StoryStructureInterface } from '@/interfaces/StoryInterface';
import { ArrowLeft, ArrowRight, Check, Edit } from 'lucide-react';
import React, { useState } from 'react'
import { charactersToString, extractCharacterSummary, extractTemplatePrompts, queryLLM } from '@/services/LlmQueryHelper';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import ModifyProtagonistOrdinaryWorldComponent from './ModifyProtagonistOrdinaryWorldComponent';

interface ProtagonistOrdinaryWorldComponentProps {
    storyStructure: StoryStructureInterface,
    initialStory: StoryInterface,
    saveStory: (val: any) => null|object;
    moveToPrev: () => void;
    moveToNext: () => void;
}

const ProtagonistOrdinaryWorldComponent: React.FC<ProtagonistOrdinaryWorldComponentProps> = ({
    initialStory,
    storyStructure,
    saveStory,
    moveToPrev,
    moveToNext
}) => {

    const [openModifyProtagonistOrdinaryWorldModal, setOpenModifyProtagonistOrdinaryWorldModal] = useState<boolean>(false);
    const [selectedProtagonistOrdinaryWorld, setSelectedProtagonistOrdinaryWorld] = useState<string[]>(initialStory?.storyStructure?.protagonistOrdinaryWorld || []);
    const [protagonistOrdinaryWorldSuggestions, setProtagonistOrdinaryWorldSuggestions] = useState<string[]>(initialStory?.storyStructure?.protagonistOrdinaryWorldSuggestions || []);

    const moveToFirstPlotPoint = async () => {
        try {
            let { tonePrompt, stakesPrompt, expositionPrompt, hookPrompt, incitingEventPrompt, protagonistOrdinaryWorldPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(initialStory);

            const protagonists = extractCharacterSummary(storyStructure?.protagonists);
            const antagonists = extractCharacterSummary(storyStructure?.antagonists);
        
            const startingTemplate = `
                You are a professional storyteller and narrative designer, skilled in creating engaging plots, multidimensional characters, and immersive worlds. Your role is to analyze and enhance the given story's introduction, plot, characters, tone, genre, and other key elements based on the three-act structure. After analyzing the exposition, stakes, tone, hook, suspense, thematic element, and characters, generate a new plot, inciting events, and additional characters if necessary.
                Following the three act structure we currently moving to the first plot point leading to the 2nd act. These are events that occurs after the inciting event or inciting incident and marks the turning point where the story begins to escalate and intensify. 
                So you are going to generate at least five first plot point suggestions after analyzing the story's introduction, plot, genre, themes, exposition, hook, inciting events and characters.
                Analyze the characters traits provided also while generating the suggestions, using their weaknesses, strengths, values and backstory as a guide.
                Ensure the generated first plot point should be related to the inciting incident, stakes, protagonists, exposition, antagonists and tone which are part of the introduction of the story.

                Here are major questions to answer while building or generating the First Plot Points:
                What are the stakes of the inciting incident? How will it affect the protagonist and the story's world?
                How will the protagonist respond to the inciting incident? What will they do, and why will they do it?
                What new information or revelation will be introduced? How will this change the protagonist's perspective or goals?
                What obstacles or challenges will the protagonist face? How will they respond to these obstacles?
                What are the consequences of failure? What will happen if the protagonist fails to achieve their goal or overcome the challenges?
                How will the First Plot Point escalate the conflict? What new tensions or conflicts will be introduced, and how will they be resolved?
                What emotional connection will the First Plot Point create? How will it make the reader emotionally invested in the story and the protagonist?
                What themes will the First Plot Point explore? How will it relate to the story's themes and message?

                Key Considerations for a Strong First Plot Point:
                - Make it unexpected but still logical: The event should surprise the reader but still feel true to the story and characters.
                - Raise the stakes: The first plot point should increase the tension, raise the stakes, and make the protagonist's situation more urgent.
                - Introduce the central conflict or problem: The first plot point should reveal the core issue or challenge that the protagonist will face throughout the story.
                - Provide opportunities for character growth: The first plot point should create opportunities for the protagonist to learn, adapt, and change.

                Return your response in a json or javascript object format like: 
                newPlot(string), 
                firstPlotPoint(array of strings which refers to first plot point, generate at least 10 first plot points), 
                firstPlotPointSuggestions(array of strings which refers suggestions for the first plot point), 
                firstPlotPointSummary(string), 
                suggestedCharacters(array of objects with keys like name(string), age(string), role(string), gender(string), motivations(array), skinTone(string), hair(string. If the character has hair describe it if not just indicate no hair), facialFeatures(string), motivations(array), personalityTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string), and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)) as keys.                                 
                Please ensure the only keys in the objects are newPlot, firstPlotPoint, firstPlotPointSuggestions, firstPlotPointSummary and characters only.
                Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
                
                current plot: {currentPlot}
                The protagonist's ordinary world: {protagonistOrdinaryWorld}
                existing characters: {existingCharacters}
                inciting events: {incitingEvent}
                protagonists: {protagonists},
                antagonists: {antagonists},
                introduction tone: {tone}
                introduction stakes: {stakes}
                introduction exposition: {exposition}
                introduction hook: {hook}
                story title: {storyTitle}
                genre: {genre}
                thematic element & option: {thematicElement}
                suspense technique: {suspenseTechnique}
                suspense technique description: {suspenseTechniqueDescription}
            `;

            showPageLoader();
        
            const response = await queryLLM(startingTemplate, {
                currentPlot: initialStory?.overview,
                protagonistOrdinaryWorld: protagonistOrdinaryWorldPrompt,
                existingCharacters: charactersToString(initialStory),
                incitingEvent: incitingEventPrompt,
                protagonists,
                antagonists,
                stakes: stakesPrompt,
                tone: tonePrompt,
                hook: hookPrompt,
                exposition: expositionPrompt,
                genre: genrePrompt,
                thematicElement: thematicElementsPrompt,
                storyTitle: initialStory.title,
                suspenseTechnique: initialStory.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStory.suspenseTechnique?.description,
            });
    
            // return
            if (response) {
                const storyStarterSaved = await saveStory({ 
                    firstPlotPoint: {
                        firstPlotPoint: response?.firstPlotPoint,
                        firstPlotPointSuggestions: [...response?.firstPlotPoint, ...response?.firstPlotPointSuggestions],
                        firstPlotPointSummary: response?.firstPlotPointSummary,      
                        newPlot: response?.newPlot,
                    },
                    suggestedCharacters: response?.suggestedCharacters,      
                });   
                if (!storyStarterSaved) {
                   return 
                }
                await moveToNext();
            }

        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    return (
        <div>
            <div className='border-b p-5'>
                <h1 className="font-bold text-2xl text-center mb-3">The Protagonist's Ordinary World</h1>
                <p className="text-xs italic font-light text-gray-600 text-center">
                "Introduce the protagonist's everyday life, relationships, and character traits (good and bad) before the adventure starts, to make them relatable and give context for their journey ahead."
                </p>
            </div>

            <div className='p-5'>
                <ul className='mb-5'>
                    {
                        storyStructure?.protagonistOrdinaryWorld?.map((item, index) => (
                            <li className='text-xs flex items-center gap-2 mb-1' key={`_${index}_`}> 
                                <div className='flex items-start'>
                                    <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                                </div>
                                <span>{item}</span>
                            </li>
                        ))
                    }
                </ul>

                <Button size='sm' className='mr-5' 
                onClick={() => setOpenModifyProtagonistOrdinaryWorldModal(true)}
                >
                    Modify
                    <Edit className='ml-2 w-4 h-4'/>
                </Button>

                <div className="flex items-center justify-between mt-4">
                    <Button size='sm' className='mr-5' 
                    onClick={moveToPrev}
                    variant="outline"
                    >
                        Prev
                        <ArrowLeft className='ml-2 w-4 h-4'/>
                    </Button>
                    <Button size='sm' className='' 
                    onClick={moveToFirstPlotPoint}
                    variant="outline"

                    >
                        Next
                        <ArrowRight className='ml-2 w-4 h-4'/>
                    </Button>
                </div>
            </div>

            <ModifyProtagonistOrdinaryWorldComponent
                initialStory={initialStory}
                saveStory={saveStory}
                openModifyProtagonistOrdinaryWorldModal={openModifyProtagonistOrdinaryWorldModal} 
                setOpenModifyProtagonistOrdinaryWorldModal={setOpenModifyProtagonistOrdinaryWorldModal} 
                selectedProtagonistOrdinaryWorld={selectedProtagonistOrdinaryWorld}
                setSelectedProtagonistOrdinaryWorld={setSelectedProtagonistOrdinaryWorld}
                protagonistOrdinaryWorldSuggestions={protagonistOrdinaryWorldSuggestions}
                setProtagonistOrdinaryWorldSuggestions={setProtagonistOrdinaryWorldSuggestions}
            />
        </div>
    )
}

export default ProtagonistOrdinaryWorldComponent
