"use client";

import { Button } from '@/components/ui/button';
import { StoryInterface, StoryStructureInterface } from '@/interfaces/StoryInterface';
import { ArrowLeft, ArrowRight, Check, Edit } from 'lucide-react';
import React, { useState } from 'react'
import { charactersToString, extractCharacterSummary, extractTemplatePrompts, queryLLM } from '@/services/LlmQueryHelper';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import ModifyFirstPlotPointComponent from './ModifyFirstPlotPointComponent';

interface FirstPlotPointComponentProps {
  storyStructure: StoryStructureInterface,
  initialStory: StoryInterface,
  saveStory: (val: any) => null|object;
  moveToPrev: () => void;
  moveToNext: () => void;
}

const FirstPlotPointComponent: React.FC<FirstPlotPointComponentProps> = ({
  initialStory,
  storyStructure,
  saveStory,
  moveToPrev,
  moveToNext
}) => {
  const [openModifyFirstPlotPointModal, setOpenModifyFirstPlotPointModal] = useState<boolean>(false);
  const [selectedFirstPlotPoint, setSelectedFirstPlotPoint] = useState<string[]>(initialStory?.storyStructure?.firstPlotPoint || []);
  const [firstPlotPointSuggestions, setFirstPlotPointSuggestions] = useState<string[]>(initialStory?.storyStructure?.firstPlotPointSuggestions || []);

  const moveToProgressiveComplications = async () => {
    try {
      let { tonePrompt, stakesPrompt, expositionPrompt, hookPrompt, incitingEventPrompt, firstPlotPointPrompt, protagonistOrdinaryWorldPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(initialStory);
  
      const protagonists = extractCharacterSummary(storyStructure?.protagonists);
      const antagonists = extractCharacterSummary(storyStructure?.antagonists);
  
      // , the protagonist's ordinary world, inciting event, stakes, exposition and tone which are part of the introduction of the story.
      // Here are major questions to answer while building or generating the progressive complications:
      // ${progressiveComplicationQuestions}
      
      const startingTemplate = `
        You are a professional storyteller and narrative designer. Your task is to analyze the provided story’s introduction, plot, characters, tone, genre, and key elements based on the three-act structure. Focus on generating progressive complications that escalate the conflict, intensify tension, and challenge the protagonist's resolve after the first plot point {firstPlotPoint}.

        Progressive complications arise from the protagonist's actions or decisions, testing their strengths, weaknesses, and values. These events create obstacles that force growth, deepen the narrative, and raise the stakes. You must generate at least 10 unique complications and ensure no repetition in the output.

        ### Task:
        - Analyze the characters', protagonists' and antagonists' traits (strengths, weaknesses, values, backstory) and ensure the complications relate to their development.
        - Ensure the progressive complications flow from the protagonist's decisions following the first plot point {firstPlotPoint}.

        ### Expected Output (JSON format):
        - newPlot(string): Updated plot summary.
        - progressiveComplication(array of strings): At least 10 unique progressive complications.
        - progressiveComplicationSuggestions(array of strings): Additional unique suggestions for future use.
        - progressiveComplicationSummary(string): A brief summary of the complications.
        - suggestedCharacters(array of objects): Additional characters if needed, with:
          - name, role, motivations, personalityTraits, backstory, weaknesses, strengths, coreValues, relationshipsWithOtherCharacters.

        ### Inputs:
        - Current plot: {currentPlot}
        - First plot point: {firstPlotPoint}
        - protagonists: {protagonists}
        - antagonists: {antagonists}
        - Protagonist’s ordinary world: {protagonistOrdinaryWorld}
        - Existing characters: {existingCharacters}
        - Inciting events: {incitingEvent}
        - Tone: {tone}
        - Stakes: {stakes}
        - Exposition: {exposition}
        - Hook: {hook}
        - Story title: {storyTitle}
        - Genre: {genre}
        - Thematic element: {thematicElement}
        - Suspense technique: {suspenseTechnique}
        - Suspense description: {suspenseTechniqueDescription}

        Ensure that each option in the progressiveComplication & progressiveComplicationSuggestions arrays are unique and no data is repeated. 
        Please ensure the only keys in the objects are newPlot, progressiveComplication, progressiveComplicationSuggestions, progressiveComplicationSummary and characters only.
        Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
        Ensure the contents of the progressiveComplication array and progressiveComplicationSuggestions array not not the same, the content must be different.
      `;

      // const startingTemplate = `
      //     You are a professional storyteller and narrative designer, skilled in creating engaging plots, multidimensional characters, and immersive worlds. Your role is to analyze and enhance the given story's introduction, plot, characters, tone, genre, and other key elements based on the three-act structure. After analyzing the exposition, stakes, tone, hook, suspense, thematic element, and characters, generate a new plot, inciting events, and additional characters if necessary.
      //     Following the three act structure we currently moving to the progressive complications. Progressive complications are series of events that escalate the conflict, raise the stakes, and intensify the tension. These complications often arise from the protagonist's actions or the decisions they make in response to the first plot point. Progressive complications test the protagonist, challenge their resolve, and create opportunities for growth and learning. Think of it as the "piling on" of obstacles, setbacks, and challenges that further the plot and deepen the story
      //     So you are going to generate at least five progressive complications suggestions after analyzing the story's introduction, plot, genre, themes, exposition, hook, inciting events, first plot points, the protagonist's ordinary world and characters.

      //     Progressive complications test the protagonist, challenge their resolve, and create opportunities for growth and learning. Think of it as the "piling on" of obstacles, setbacks, and challenges that further the plot and deepen the story.

      //     Analyze the characters traits provided also while generating the suggestions, using their weaknesses, strengths, values and backstory as a guide.
      //     Ensure the generated progressive complications should show what arises from the protagonist's actions or the decisions they make in response to the first plot point {firstPlotPoint}.

      //     Return your response in a json or javascript object format like: 
      //     newPlot(string), 
      //     progressiveComplication(array of strings which refers to progressive complications, generate at least 10 progressive complications), 
      //     progressiveComplicationSuggestions(array of strings which refers to suggestions that can be selected later to be added for the progressive complications of the story), 
      //     progressiveComplicationSummary(string), 
      //     suggestedCharacters(array of objects with keys like name(string), role(string), motivations(array), personalityTraits(array), backstory(string), weaknesses(array), strengths(array), coreValues(array) and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)) as keys. 
      //     Ensure that each option in the progressiveComplication & progressiveComplicationSuggestions arrays are unique and no data is repeated. 
      //     Please ensure the only keys in the objects are newPlot, progressiveComplication, progressiveComplicationSuggestions, progressiveComplicationSummary and characters only.
      //     Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
          
      //     current plot: {currentPlot}
      //     first plot point: {firstPlotPoint}
      //     The protagonist's ordinary world: {protagonistOrdinaryWorld}
      //     existing characters: {existingCharacters}
      //     inciting events: {incitingEvent}
      //     introduction tone: {tone}
      //     introduction stakes: {stakes}
      //     introduction exposition: {exposition}
      //     introduction hook: {hook}
      //     story title: {storyTitle}
      //     genre: {genre}
      //     thematic element & option: {thematicElement}
      //     suspense technique: {suspenseTechnique}
      //     suspense technique description: {suspenseTechniqueDescription}
      // `;

      showPageLoader();
  
      const response = await queryLLM(startingTemplate, {
        currentPlot: initialStory?.overview,
        firstPlotPoint: firstPlotPointPrompt,
        protagonists: protagonists,
        antagonists: antagonists,
        protagonistOrdinaryWorld: protagonistOrdinaryWorldPrompt,
        existingCharacters: charactersToString(initialStory),
        incitingEvent: incitingEventPrompt,
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
      
      if (response) {
        const storyStarterSaved = await saveStory({ 
          progressiveComplication: {
            progressiveComplication: response?.progressiveComplication,
            progressiveComplicationSuggestions: [...response?.progressiveComplication, ...response?.progressiveComplicationSuggestions],
            progressiveComplicationSummary: response?.progressiveComplicationSummary,      
            newPlot: response?.newPlot,
          },
          suggestedCharacters: response?.suggestedCharacters,      
        });   
        
        if (!storyStarterSaved) {
          return; 
        }
        await moveToNext();
      }

    } catch (error) {
        console.error(error);            
    }finally{
        hidePageLoader();
    }
  }

  const progressiveComplicationQuestions = `
  Plot-driven questions:
  What new information or revelations can I introduce to raise the stakes?
  How can my protagonist's actions or decisions create more problems or obstacles?
  What new characters or conflicts can I introduce to challenge the protagonist?
  How can the environment, setting, or situation become more hostile or precarious?
  What new skills or knowledge do my characters need to acquire to overcome the challenges?
  How can the tension and stakes escalate through the story?
  What is the consequence of failure, and how can it raise the stakes?
  Can I introduce a twist or unexpected turn to further complicate the situation?
  
  Character-driven questions:
  What is my protagonist's motivation for continuing to pursue their goal, despite the setbacks?
  How do their flaws, fears, or weaknesses hinder their progress or increase the danger?
  What are their internal conflicts, and how do they struggle to overcome them?
  How do their relationships with other characters affect their situation?
  What personal growth or discoveries can they make as they navigate the complications?
  
  Thematic questions:
  How do the complications relate to the story's themes or messages?
  Can I use the complications to explore the characters' values, morals, or principles?
  How do the challenges reveal character traits, flaws, or strengths?
  Can I use the complications to create opportunities for character development or growth?

  Story-level questions:
  How can I maintain tension and suspense throughout the complications?
  What is the pace of the complications, and how can I control the flow of information?
  How do the complications lead to new conflicts or challenges?
  Can I create a sense of urgency or countdown to the climax?
  How can I use the complications to test the characters' abilities, resolve, or resourcefulness?


  Here's a summarized guide to building progressive complications:
  Introduce new information or revelations: Raise the stakes by introducing new aspects to the story.
  Escalate tension and stakes: Create more problems, obstacles, or challenges for the protagonist.
  Introduce new characters or conflicts: Add new elements to the story, deepening the plot.
  Complicate the situation: Use the environment, setting, or situation to create more challenges.
  Explore character growth and development: Use the complications to reveal character traits, flaws, or strengths.
  Maintain tension and suspense: Control the flow of information to create a sense of urgency or countdown.
  Test characters' abilities and resolve: Use the complications to test the characters' mettle and willingness to adapt.
  `;

  return (
    <div>
      <div className='border-b p-5'>
        <h1 className="font-bold text-2xl text-center mb-3">First Plot Point</h1>
        <p className="text-sm italic font-light text-gray-600 text-center">
            "What obstacle do the characters face that increases tension and raises the stakes? (e.g., a setback, a misunderstanding, etc.)"  
        </p>
      </div>

      <div className='p-5'>
        <ul className='mb-5'>
          {
            storyStructure?.firstPlotPoint?.map((item, index) => (
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
        onClick={() => setOpenModifyFirstPlotPointModal(true)}
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
          <Button size='sm' 
            onClick={moveToProgressiveComplications}
            variant="outline"
          >
            Next
            <ArrowRight className='ml-2 w-4 h-4'/>
          </Button>
        </div>
      </div>

      <ModifyFirstPlotPointComponent
        openModifyFirstPlotPointModal={openModifyFirstPlotPointModal}
        setOpenModifyFirstPlotPointModal={setOpenModifyFirstPlotPointModal}
        selectedFirstPlotPoint={selectedFirstPlotPoint}
        setSelectedFirstPlotPoint={setSelectedFirstPlotPoint}
        firstPlotPointSuggestions={firstPlotPointSuggestions}
        setFirstPlotPointSuggestions={setFirstPlotPointSuggestions}
        initialStory={initialStory}
        saveStory={saveStory}
      />
    </div>
  )
}

export default FirstPlotPointComponent
