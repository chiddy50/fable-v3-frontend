"use client";

import { Button } from '@/components/ui/button';
import { StoryInterface, StoryStructureInterface } from '@/interfaces/StoryInterface';
import { ArrowLeft, ArrowRight, Check, Edit } from 'lucide-react';
import React, { useState } from 'react'
import ModifyIncitingEventComponent from './ModifyIncitingEventComponent';
import { charactersToString, extractCharacterSummary, extractTemplatePrompts, queryLLM } from '@/services/LlmQueryHelper';
import { hidePageLoader, showPageLoader } from '@/lib/helper';

interface IncitingEventComponentProps {
    storyStructure: StoryStructureInterface,
    initialStoryData: StoryInterface,
    saveStory: (val: any) => null|object;
    moveToPrev: () => void;
    moveToNext: () => void;
}

const IncitingEventComponent: React.FC<IncitingEventComponentProps> = ({
    initialStoryData,
    storyStructure,
    saveStory,
    moveToPrev,
    moveToNext
}) => {
    const [openModifyIncitingEventModal, setOpenModifyIncitingEventModal] = useState<boolean>(false);
    const [selectedIncitingEvent, setSelectedIncitingEvent] = useState<string[]>(initialStoryData?.storyStructure?.incitingEvent || []);
    const [incitingEventSuggestions, setIncitingEventSuggestions] = useState<string[]>(initialStoryData?.storyStructure?.incitingEventSuggestions || []);

    const moveToProtagonistOrdinaryWorld = async () => {
        try {
            let { tonePrompt, stakesPrompt, expositionPrompt, hookPrompt, incitingEventPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(initialStoryData);
            
            console.log({
                protagonists: storyStructure?.protagonists,
                antagonists: storyStructure?.antagonists
            });
            
            const protagonists = extractCharacterSummary(storyStructure?.protagonists);
            const antagonists = extractCharacterSummary(storyStructure?.antagonists);
            
            const characterPrompt = charactersToString(initialStoryData);

            const startingTemplate = `
                You are a professional storyteller and narrative designer, skilled in creating engaging plots, multidimensional characters, and immersive worlds. Your role is to analyze and enhance the given story's introduction, plot, characters, tone, genre, and other key elements based on the three-act structure. After analyzing the exposition, stakes, tone, hook, suspense, thematic element, and characters, generate a new plot, inciting events, and additional characters if necessary.
                Following the three act structure we currently moving to establishing the ordinary world of the protagonists and we show the protagonist's normal life before the journey begins, introduce supporting characters and relationships and Establish the protagonist's flaws, strengths, and motivations. So you are going to generate at least 5 suggestions after analyzing the story's introduction, plot, genre, themes, exposition, hook, inciting events, antagonists, protagonists and characters.
                Analyze the characters traits provided also while generating the suggestions, using their weaknesses, strengths, values and backstory as a guide.
                The generated information should be related to the inciting incident, stakes, exposition and tone which are part of the introduction of the story.

                Here are the questions we are going to answer:
                Who is the protagonist?
                What is their backstory, including their family, relationships, and significant events in their past?
                What are their personality traits, strengths, weaknesses, and motivations?
                What are their goals, desires, and aspirations?
                Are they introverted or extroverted, and how do they interact with others?
                Where does the protagonist live (geographical location, community, or social circle)?
                What is the protagonist's social status, occupation, or role within their community?
                What are the norms, customs, and expectations of their world?
                Is there a specific cultural, ethnic, or socioeconomic context that shapes the protagonist's life?
                Are there any unique or challenging aspects of their environment (e.g., a rural setting, a crowded city, or a small town with gossip-spreading residents)?
                What is the protagonist's daily routine, including their work, leisure activities, and relationships?
                Are there any recurring patterns or rituals that define their life (e.g., a weekly workout, a favorite hobby, or a specific way of interacting with friends)?
                Are there any areas of their life where they feel stuck, unsatisfied, or longing for change?
                How do they handle stress, conflict, or adversity in their life?
                Are there any secrets, fears, or guilt that the protagonist harbors?
                What are the protagonist's emotional needs, desires, and fears?
                Are they generally optimistic, pessimistic, anxious, or confident?
                How do they respond to setbacks, failures, or disappointments?
                Are there any unresolved emotional issues from their past that continue to affect them?
                How do they demonstrate their emotions (e.g., through humor, anger, or withdrawal)?
                                
                Return your response in a json or javascript object format like: 
                newPlot(string), 
                protagonistOrdinaryWorld(array of strings which refers to establishing the Ordinary World of the protagonist), 
                protagonistOrdinaryWorldSuggestions(array of strings which refers suggestions for establishing the Ordinary World of the protagonist), 
                protagonistOrdinaryWorldSummary(string), 
                suggestedCharacters(array of objects with keys like name(string), age(string), role(string), gender(string), motivations(array), skinTone(string), hair(string. If the character has hair describe it if not just indicate no hair), facialFeatures(string), motivations(array), personalityTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string), and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)) as keys.                                  
                Please ensure the only keys in the objects are newPlot, protagonistOrdinaryWorld, protagonistOrdinaryWorldSuggestions, protagonistOrdinaryWorldSummary and characters only.
                Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
                
                current plot: {currentPlot}
                existing characters: {existingCharacters}
                protagonists: {protagonists}
                antagonists: {antagonists}
                inciting events: {incitingEvent}
                introduction tone: {tone}
                introduction stakes: {stakes}
                introduction exposition: {exposition}
                introduction hook: {hook}
                plot: {storyPlot}
                story title: {storyTitle}
                genre: {genre}
                thematic element & option: {thematicElement}
                suspense technique: {suspenseTechnique}
                suspense technique description: {suspenseTechniqueDescription}
            `;
            
            showPageLoader();
            
            const response = await queryLLM(startingTemplate, {
                currentPlot: initialStoryData?.overview,
                existingCharacters: characterPrompt, // extractCharacters(initialStoryData),
                incitingEvent: incitingEventPrompt,
                protagonists: protagonists, 
                antagonists: antagonists,
                stakes: stakesPrompt,
                tone: tonePrompt,
                hook: hookPrompt,
                exposition: expositionPrompt,
                genre: genrePrompt,
                thematicElement: thematicElementsPrompt,
                storyTitle: initialStoryData.title,
                storyPlot: initialStoryData.overview,
                suspenseTechnique: initialStoryData.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStoryData.suspenseTechnique?.description,
            });
    
            if (response) {
                const storyStarterSaved = await saveStory({ 
                    protagonistOrdinaryWorld: {
                        protagonistOrdinaryWorld: response?.protagonistOrdinaryWorld,
                        protagonistOrdinaryWorldSuggestions: [...response?.protagonistOrdinaryWorld, ...response?.protagonistOrdinaryWorldSuggestions],
                        protagonistOrdinaryWorldSummary: response?.protagonistOrdinaryWorldSummary,      
                        newPlot: response?.newPlot,
                    },
                    suggestedCharacters: response?.suggestedCharacters,      
                });   
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
                <h1 className="font-bold text-2xl text-center mb-3">The Inciting Event</h1>
                <p className="text-sm italic font-light text-gray-600 text-center">
                    "What choice does the protagonist make that sets the conflict in motion?"  
                </p>
            </div>

            <div className='p-5'>
                <ul className='mb-5'>
                    {
                        storyStructure?.incitingEvent?.map((event, index) => (
                            <li className='text-xs flex items-center gap-2 mb-1' key={`_${index}_`}> 
                                <div className='flex items-start'>
                                    <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                                </div>
                                <span>{event}</span>
                            </li>
                        ))
                    }
                </ul>

                <Button size='sm' className='mr-5' 
                onClick={() => setOpenModifyIncitingEventModal(true)}
                >
                    Modify Inciting Event
                    <Edit className='ml-2 w-4 h-4'/>
                </Button>

                <div className="flex items-center justify-between mt-4">
                    <Button size='sm' className='mr-5' 
                    onClick={moveToPrev}
                    >
                        Prev
                        <ArrowLeft className='ml-2 w-4 h-4'/>
                    </Button>
                    <Button size='sm' className='' 
                    onClick={moveToProtagonistOrdinaryWorld}
                    >
                        Next
                        <ArrowRight className='ml-2 w-4 h-4'/>
                    </Button>
                </div>
            </div>

            <ModifyIncitingEventComponent 
                initialStoryData={initialStoryData}
                saveStory={saveStory}
                openModifyIncitingEventModal={openModifyIncitingEventModal}
                setOpenModifyIncitingEventModal={setOpenModifyIncitingEventModal}
                selectedIncitingEvent={selectedIncitingEvent}
                setSelectedIncitingEvent={setSelectedIncitingEvent}
                incitingEventSuggestions={incitingEventSuggestions}
                setIncitingEventSuggestions={setIncitingEventSuggestions}
            />

        </div>
    );
}

export default IncitingEventComponent
