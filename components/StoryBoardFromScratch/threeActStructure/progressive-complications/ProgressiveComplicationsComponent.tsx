"use client";

import { Button } from '@/components/ui/button';
import { StoryInterface, StoryStructureInterface } from '@/interfaces/StoryInterface';
import { ArrowLeft, ArrowRight, Check, Edit } from 'lucide-react';
import React, { useState } from 'react'
import { charactersToString, extractCharacterSummary, extractTemplatePrompts, queryLLM } from '@/services/LlmQueryHelper';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import ModifyProgressiveComplicationsComponent from './ModifyProgressiveComplicationsComponent';

interface ProgressiveComplicationsComponentProps {
  storyStructure: StoryStructureInterface,
  initialStory: StoryInterface,
  saveStory: (val: any) => null|object;
  moveToPrev: () => void;
  moveToNext: () => void;
}

const ProgressiveComplicationsComponent: React.FC<ProgressiveComplicationsComponentProps> = ({
    initialStory,
    storyStructure,
    saveStory,
    moveToPrev,
    moveToNext
}) => {
    const [openModifyProgressiveComplicationModal, setOpenModifyProgressiveComplicationModal] = useState<boolean>(false);
    const [selectedProgressiveComplication, setSelectedProgressiveComplication] = useState<string[]>(initialStory?.storyStructure?.progressiveComplication || []);
    const [progressiveComplicationSuggestions, setProgressiveComplicationSuggestions] = useState<string[]>(initialStory?.storyStructure?.progressiveComplicationSuggestions || []);

    const protagonists = extractCharacterSummary(storyStructure?.protagonists);
    const antagonists = extractCharacterSummary(storyStructure?.antagonists);
    const antagonisticForce = storyStructure.antagonisticForce.join(", ");

    const moveToFirstPinchPoint = async () => {
        let { tonePrompt, stakesPrompt, expositionPrompt, antagonisticForce, hookPrompt, incitingEventPrompt, firstPlotPointPrompt, progressiveComplicationPrompt, protagonistOrdinaryWorldPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(initialStory);
  
        const protagonists = extractCharacterSummary(storyStructure?.protagonists);
        const antagonists = extractCharacterSummary(storyStructure?.antagonists);
        
        
        try {
            
            const startingTemplate = `
            You are a professional storyteller and narrative designer. Your task is to analyze the story's Progressive Complication and determine the best way to introduce the First Pinch Point, ensuring it adds pressure to the protagonist and heightens the central conflict.
            
            The First Pinch Point comes within the Progressive Complication phase and serves to "pinch" the protagonist, reminding them (and the audience) of the story's central conflict or antagonistic force.
            First Pinch Point is a specific moment within the Progressive Complication, where the conflict intensifies and reminds the protagonist of the stakes or threat they are up against.
            Its purpose is to increase pressure on the protagonist and highlight the threat or challenge they are facing, reinforcing the conflict and tension.
    
            1. **Analyze the Progressive Complication**:
            - Review the series of escalating challenges, obstacles, or setbacks the protagonist has faced so far.
            - Consider how these complications have affected the protagonist's motivations, strengths, weaknesses, and relationships.
            - Evaluate whether the protagonist has grown, changed, or struggled with their goals due to these complications.
    
            2. **Introduce the First Pinch Point**:
            - The First Pinch Point should be a key moment within the Progressive Complication that reminds the protagonist (and the audience) of the core conflict or antagonistic force.
            - This moment should intensify the stakes and increase the tension, forcing the protagonist to confront an immediate threat, challenge, or dilemma.
            - The antagonist or opposing force should be clearly felt, either directly or indirectly.
    
            3. **Output**: Generate the following in a JSON format:
            - progressiveComplicationAnalysis(string): A summary of the key events and challenges in the Progressive Complication phase.
            - firstPinchPointSuggestion(array): List of suggested First Pinch Point moments that intensifies the conflict and pressures the protagonist.
            - firstPinchPointImpact(array): How these First Pinch Points affects the protagonist and the story, increasing tension and reminding them of the stakes.
            Please ensure the only keys in the objects are progressiveComplicationAnalysis, firstPinchPointSuggestion and firstPinchPointImpact only.
            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction. 

            ### Inputs:
            - Current plot: {currentPlot}
            - First plot point: {firstPlotPoint}
            - Current Progressive Complication: {progressiveComplication}
            - protagonists: {protagonists}
            - antagonists: {antagonists}
            - Antagonistic force or threat: {antagonisticForce}
            - Story genre: {genre}
            - Protagonist’s ordinary world: {protagonistOrdinaryWorld}
            - Existing characters: {existingCharacters}
            - Inciting events: {incitingEvent}
            - Tone: {tone}
            - Stakes: {stakes}
            - Exposition: {exposition}
            - Hook: {hook}
            `;
    
            showPageLoader();
      
            const response = await queryLLM(startingTemplate, {
                currentPlot: initialStory?.overview,
                firstPlotPoint: firstPlotPointPrompt,
                protagonists: protagonists,
                antagonisticForce: antagonisticForce,
                antagonists: antagonists,
                protagonistOrdinaryWorld: protagonistOrdinaryWorldPrompt,
                existingCharacters: charactersToString(initialStory),
                incitingEvent: incitingEventPrompt,
                progressiveComplication: progressiveComplicationPrompt,
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
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
      
    }

    return (
        <div>
            <div className='border-b p-5'>
                <h1 className="font-bold text-2xl text-center mb-3">Progressive Complications</h1>
                <p className="text-xs italic font-light text-gray-600 text-center">
                `Protagonist's actions or decisions cause problems. These problems test their strengths, weaknesses, and values, making it harder to succeed and making the story more exciting.`
                </p>
            </div>

            <div className='p-5'>
                <ul className='mb-5'>
                    {
                        storyStructure?.progressiveComplication?.map((item, index) => (
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
                onClick={() => setOpenModifyProgressiveComplicationModal(true)}
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
                    onClick={moveToFirstPinchPoint}
                    variant="outline"

                    >
                        Next
                        <ArrowRight className='ml-2 w-4 h-4'/>
                    </Button>
                </div>
            </div>

            <ModifyProgressiveComplicationsComponent 
                openModifyProgressiveComplicationModal={openModifyProgressiveComplicationModal}
                setOpenModifyProgressiveComplicationModal={setOpenModifyProgressiveComplicationModal}
                selectedProgressiveComplication={selectedProgressiveComplication}
                setSelectedProgressiveComplication={setSelectedProgressiveComplication}
                progressiveComplicationSuggestions={progressiveComplicationSuggestions}
                setProgressiveComplicationSuggestions={setProgressiveComplicationSuggestions}
                initialStory={initialStory}
                saveStory={saveStory}
            />
        </div>
    )
}

export default ProgressiveComplicationsComponent
