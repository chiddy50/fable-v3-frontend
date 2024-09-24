"use client";

import React, { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatGroq } from '@langchain/groq';
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { useRouter } from 'next/navigation';
import { extractTemplatePrompts, queryLLM, threeActStructureDefinition } from '@/services/LlmQueryHelper';
import { StoryInterface } from '@/interfaces/StoryInterface';


interface ProtagonistSuggestionsComponentProps {
    protagonistSuggestionsModalOpen: boolean;
    setProtagonistSuggestionsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;  
    protagonistSuggestions: any;
    storyData: StoryInterface,
    saveStory: (val: any) => null|object;
}

const ProtagonistSuggestionsComponent: React.FC<ProtagonistSuggestionsComponentProps> = ({ 
    protagonistSuggestionsModalOpen, 
    setProtagonistSuggestionsModalOpen, 
    protagonistSuggestions,
    storyData,
    saveStory
}) => {
    const { push } = useRouter();

    const exploreCharacter = async (suggestion: {title: string, plot: string}) => {
        try {
            showPageLoader();
            
            let { tonePrompt, stakesPrompt, expositionPrompt, hookPrompt, incitingEventPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(storyData);
     
            // return

            const startingTemplate = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
            Using the three act structure and based on the story plot, story title, genre, suspense technique, thematic element, and thematic option provided, analyze the story plot and extract or generate introduction expositions, tone, stakes, protagonists, antagonistic force or threat and hooks. Generate at least five unique characters that fits the narrative :

            ${threeActStructureDefinition}
            Return your response in a json or javascript object format like: 
            exposition(array), 
            expositionSummary(string, a summary of the exposition), suggestionsForExposition(array), 
            introductionTone(array), 
            introductionToneSuggestions(array), 
            introductionStakes(array), 
            introductionStakesSuggestions(array), 
            protagonists(array of objects with keys like name(string), age(string), role(string), habits(string), innerConflict(string), gender(string), relevanceToAudience(string), motivations(array), skinTone(string), hair(string. If the character has hair describe it if not just indicate no hair), facialFeatures(string), motivations(array), personalityTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string), and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)),                                  
            protagonistSuggestions(array of objects with keys like name(string), age(string), role(string), habits(string), innerConflict(string), gender(string), relevanceToAudience(string), motivations(array), skinTone(string), hair(string. If the character has hair describe it if not just indicate no hair), facialFeatures(string), motivations(array), personalityTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string), and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)),                                  
            antagonists(array of objects with keys like name(string), age(string), role(string), habits(string), innerConflict(string), gender(string), relevanceToAudience(string), motivations(array), skinTone(string), hair(string. If the character has hair describe it if not just indicate no hair), facialFeatures(string), motivations(array), personalityTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string), and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)),                                  
            antagonistSuggestions(array of objects with keys like name(string), age(string), role(string), habits(string), innerConflict(string), gender(string), relevanceToAudience(string), motivations(array), skinTone(string), hair(string. If the character has hair describe it if not just indicate no hair), facialFeatures(string), motivations(array), personalityTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string), and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)),                                  
            antagonisticForce(array, The antagonistic force, on the other hand, is the opposing force that hinders the protagonist's progress, challenges their goals, and creates obstacles)
            hook(array), 
            suggestionsForHook(array), 
            characters(array of objects with keys like name(string), age(string), role(string), gender(string), motivations(array), skinTone(string), hair(string. If the character has hair describe it if not just indicate no hair), facialFeatures(string), motivations(array), personalityTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string), and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)) as keys.                                  
            and setting(string) as keys. 
            Please ensure the only keys in the objects are exposition, expositionSummary, suggestionsForExposition, introductionTone, introductionStakes, introductionStakesSuggestions, introductionToneSuggestions, antagonists, antagonistSuggestions, antagonisticForce, protagonists, protagonistSuggestions(Ensure the protagonist suggestions are different and unique characters), hook, suggestionsForHook, setting and characters only.

            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
            plot: {storyPlot}
            story title: {storyTitle}
            genre: {genre}
            thematic element & option: {thematicElement}
            suspense technique: {suspenseTechnique}
            suspense technique description: {suspenseTechniqueDescription}
            `;

            // const startingTemplate = `
            //     You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words and you are also helpful and enthusiastic.
            //     Based on the story plot, story title, genre, suspense technique, thematic element and thematic option provided, analyze the story plot and extract the following: 
            //     - Exposition: Introduce key characters, the setting, and necessary background information.
            //     - Startling Question: Pique the reader's curiosity and set up the central conflict.
            //     - Background or Flashback: Provide context about characters, world, or historical events.
            //     - Inciting Incident: Set the story in motion and introduce the main conflict.
            //     - Rising Action: Develop obstacles, subplots, and build tension leading to a turning point.
            //     - Mini-Climaxes: Include smaller moments of tension and resolution throughout the rising action.
            //     - Foreshadowing: Hint at events or plot twists to come.
            //     - Climax: Most intense and critical moment in the story.
            //     - Falling Action: Show the consequences of the climax and begin resolving conflicts.
            //     - Resolution (Denouement): Tie up loose ends and provide closure for the story.
            //     - Conclusion: Summarize the story and its themes.
            //     - Character Arcs: Develop and grow characters throughout the story.
            //     - Subplots and Threads: Weave in smaller stories or plotlines that add complexity and depth.
            //     - Emotional Connection: Create a sense of empathy and resonance with the characters and their struggles.
    
            //     - Who is the character?
            //     - What are their traits, strengths, weaknesses, motivations, and goals?
            //     - What drives the character?
            //     - What desires, fears, and motivations push them to make decisions and take actions?
            //     - What obstacles and challenges do they face?
            //     - What external and internal barriers prevent them from achieving their goals?
            //     - How do they overcome these challenges?
            //     - What strategies, tactics, and adaptations do they use to navigate obstacles?
            //     - How do their relationships and connections influence their journey?
            //     - How do their relationships with others shape their goals, conflicts, and personal growth?
            //     - How do they change and grow throughout the story?
            //     - What lessons, insights, and realizations do they gain, and how do these impact their decisions and actions?
            //     - What do they learn and carry with them from their journey?
            //     - What new strengths, weaknesses, motivations, and perspectives do they acquire, and how do these shape their future?
                
            //     Return your response in a json or javascript object format like: setting(string), exposition(array of objects with keys background(string), character(string), motivations(string), conflicts(string), traits(string). The exposition should contain multiple characters), startlingQuestions(array of strings), background(array of strings), incitingIncidents(array of strings), risingAction(array of strings), miniClimaxes(array of strings), foreshadowing(array of strings), climax(array of strings), fallingAction(array of strings), resolution(array of strings), conclusion(array of strings), characterArcs(array of objects with character key and traits key), subplots(array of strings) and emotionalConnection(array of strings) as keys. Please ensure the only keys in the objects are setting, exposition, startlingQuestions, background, incitingIncidents, risingAction, miniClimaxes, foreshadowing, climax, fallingAction, resolution, conclusion, characterArcs, subplots and emotionalConnection only.
            //     Do not add any text extra line or text with the json response, just a json or javascript array of objects no acknowledgement or saying anything just json. Do not go beyond this instruction.            
            //     plot: {storyPlot}
            //     story title: {storyTitle}
            //     genre: {genre}
            //     thematic element & option: {thematicElement}
            //     suspense technique: {suspenseTechnique}
            //     suspense technique description: {suspenseTechniqueDescription}            
            //     `;

            const response = await queryLLM(startingTemplate, {
                storyTitle: suggestion.title,
                storyPlot: suggestion.plot,
                genre: genrePrompt,
                suspenseTechnique: storyData.suspenseTechnique?.value,
                suspenseTechniqueDescription: storyData.suspenseTechnique?.description,
                thematicElement: thematicElementsPrompt,
            });            

            // return;

            if (response) {
                console.log({response_protagonists: response?.protagonists});
                
                const storyStarterSaved = await saveStory({ 
                    introductionSuggestions: {
                        introductionSetting: response?.setting,
                        introductionTone: response?.introductionTone,
                        introductionToneSuggestions: [...response?.introductionTone, ...response?.introductionToneSuggestions],
                        introductionStakes: response?.introductionStakes,
                        introductionStakesSuggestions: [...response?.introductionStakes, ...response?.introductionStakesSuggestions],
                        protagonists: response?.protagonists,
                        protagonistSuggestions: response?.protagonistSuggestions,
                        antagonists: response?.antagonists,
                        antagonistSuggestions: response?.antagonistSuggestions,
                        antagonisticForce: response?.antagonisticForce,
                        expositionSummary: response?.expositionSummary,
                        exposition: response?.exposition,
                        expositionSuggestions: [...response?.exposition, ...response?.suggestionsForExposition], 
                        hook: response?.hook,
                        hookSuggestions: [...response?.hook, ...response?.suggestionsForHook], 
                        setting: response?.setting,
                        title: suggestion.title,
                        plot: suggestion.plot,
                    }, 
                    suggestedCharacters: response?.characters, 
                    currentStep: 2,
                    currentStepUrl: 'story-plot',
                });   
                setProtagonistSuggestionsModalOpen(false);

                push(`/story-board-from-scratch?current-step=story-plot&story-id=${storyData?.id}`);
            }
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    return (

        <Sheet open={protagonistSuggestionsModalOpen} onOpenChange={setProtagonistSuggestionsModalOpen}>
            <SheetContent className="overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
                <SheetHeader className=''>
                    <SheetTitle className='font-bold text-2xl'>Protagonist Suggestions</SheetTitle>
                    <SheetDescription className=''></SheetDescription>
                    
                    <div className='flex justify-center'>

                        <Carousel className="w-full max-w-[90%]">
                            <CarouselContent>
                                {protagonistSuggestions?.map((suggestion, index) => (
                                <CarouselItem key={index}>
                                    <div className="">
                                        <Card>
                                            <CardContent className="p-6">
                                                <h1 className="text-lg font-bold mb-1 text-gray-600">{suggestion?.name}</h1>
                                                <p className="text-xs text-gray-600">{suggestion?.backstory}</p>
                                                <Button size="sm" className='mt-4' onClick={() => exploreCharacter(suggestion) }>Explore</Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                </SheetHeader>  
            </SheetContent>
        </Sheet>
    )
}

export default ProtagonistSuggestionsComponent
