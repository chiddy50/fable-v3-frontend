"use client";

import { Button } from '@/components/ui/button';
import { StoryInterface, StoryStructureInterface } from '@/interfaces/StoryInterface';
import { ArrowLeft, ArrowRight, Check, Edit } from 'lucide-react';
import React, { useState } from 'react';
import ModifyToneComponent from './ModifyToneComponent';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import ModifyExpositionComponent from '../exposition/ModifyExpositionComponent';
import ModifyStakeComponent from './ModifyStakeComponent';
import { charactersToString, extractCharacters, extractCharacterSummary, extractTemplatePrompts, queryLLM, threeActStructureDefinition } from '@/services/LlmQueryHelper';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface IntroductionComponentProps {
    storyStructure: StoryStructureInterface,
    initialStoryData: StoryInterface,
    saveStory: (val: any) => null|object;
    moveToNext: () => void;
    moveToPrev: () => void;
}

const IntroductionComponent: React.FC<IntroductionComponentProps> = ({
    initialStoryData,
    saveStory,
    storyStructure,
    moveToNext
}) => {

    // TONE
    const [openModifyToneModal, setOpenModifyToneModal] = useState<boolean>(false);
    const [selectedTone, setSelectedTone] = useState<string[]>(initialStoryData?.storyStructure.introductionTone || []);
    const [toneSuggestions, setToneSuggestions] = useState<string[]>(initialStoryData?.storyStructure.introductionToneSuggestions || []);

    // EXPOSITION
    const [openModifyExpositionModal, setOpenModifyExpositionModal] = useState<boolean>(false);
    const [selectedExpositions, setSelectedExpositions] = useState<string[]>(initialStoryData?.storyStructure.exposition || []);
    const [expositionSuggestions, setExpositionSuggestions] = useState<string[]>(initialStoryData?.storyStructure.expositionSuggestions || []);

    // STAKE
    const [openModifyStakeModal, setOpenModifyStakeModal] = useState<boolean>(false);
    const [selectedStake, setSelectedStake] = useState<string[]>(initialStoryData?.storyStructure.introductionStakes || []);
    const [stakeSuggestions, setStakeSuggestions] = useState<string[]>(initialStoryData?.storyStructure.introductionStakesSuggestions || []);

    // PROTAGONIST
    const [openModifyProtagonistModal, setOpenModifyProtagonistModal] = useState<boolean>(false);

    const moveToIncitingEvents = async () => {
        try {
            let { tonePrompt, stakesPrompt, expositionPrompt, hookPrompt, incitingEventPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(initialStoryData);
            
            const protagonists = extractCharacterSummary(storyStructure?.protagonists);
            const antagonists = extractCharacterSummary(storyStructure?.antagonists);
            
            const characterPrompt = charactersToString(initialStoryData);
            console.log(characterPrompt);
            // name(string),
            // age(string),
            // role(string),
            // gender(string),
            // motivations(array),
            // skinTone(string),
            // hair(string. If the character has hair describe it if not just indicate no hair),
            // facialFeatures(string),
            // motivations(array),
            // personalityTraits(array),
            // angst(string),
            // backstory(string),
            // weaknesses(array), 
            // strengths(array), 
            // coreValues(array), 
            // skills(array), 
            // speechPattern(string),
            // relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string))

            const startingTemplate = `
                You are a professional storyteller and narrative designer, skilled in creating engaging plots, multidimensional characters, and immersive worlds. Your role is to analyze and enhance the given story's introduction, plot, characters, tone, genre, and other key elements based on the three-act structure. After analyzing the exposition, stakes, tone, hook, suspense, thematic element, and characters, generate a new plot, inciting events, and additional characters if necessary.
                Following the three act structure we currently moving to the inciting event, so you are going to generate at least 10 inciting events or incidents after analyzing the story's introduction, plot, genre, hook, exposition, themes, suspense techniques, characters, antagonists & protagonists.
                Analyze the characters traits provided also while generating the inciting events or incidents, using their motivations, weaknesses, strengths, values, backstory, angst, skills and personalityTraits as a guide.
                The generated Inciting Incident should be related to the stakes, exposition and tone which are part of the introduction of the story.

                Here are the questions we are going to answer:
                How does the Inciting Incident disrupt the protagonist’s ordinary world and challenge their initial goal?
                What problem or conflict is introduced, and who or what is the source of it?
                How does the protagonist react emotionally to the event, and do they immediately recognize its importance?
                How does this event complicate or raise the stakes established in the introduction?
                Does the Inciting Incident introduce the antagonist or opposing force?
                What new goal, mission, or obstacle is created for the protagonist as a result?
                What irreversible decision or action does the protagonist take in response to it?
                How does the Inciting Incident reinforce the tone and genre of the story?
                How does it connect to or hint at the story’s theme and protagonist’s internal struggle?
                What immediate consequences follow, and how does it propel the plot forward or raise the stakes?
                
                Return your response in a json or javascript object format like: 
                newPlot(string), 
                incitingEvent(array of strings which describes the event and consequences), 
                incitingEventSuggestions(array of strings which describes the event and consequences), 
                incitingEventSummary(string), 
                suggestedCharacters(array of objects with keys like name(string), age(string), role(string), gender(string), motivations(array), skinTone(string), hair(string, If the character has hair describe it if not just indicate no hair), facialFeatures(string), motivations(array), personalityTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string), and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)) as keys.                                  

                Please ensure the only keys in the objects are newPlot, incitingEvent, incitingEventSuggestions, incitingEventSummary and characters only.
                Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
                
                current plot: {currentPlot}
                existing characters: {existingCharacters}
                protagonists: {protagonists}
                antagonists: {antagonists}
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
            // const startingTemplate = `
            //     You are a professional storyteller and narrative designer, skilled in creating engaging plots, multidimensional characters, and immersive worlds. Your role is to analyze and enhance the given story's introduction, plot, characters, tone, genre, and other key elements based on the three-act structure. After analyzing the exposition, stakes, tone, hook, suspense, thematic element, and characters, generate a new plot, inciting events, and additional characters if necessary.
            //     Three-Act Structure Overview:
            //     Act 1: Setup - Introduce the protagonist, world, stakes, and genre. Set the tone and present the inciting incident that drives the main conflict.                
            //     Act 2: Confrontation - Build tension with rising obstacles and plot complications. Intensify conflict, leading to a major midpoint shift and increasing stakes.                
            //     Act 3: Resolution - Conclude with the climax, where the protagonist faces their ultimate challenge. Wrap up with the story’s resolution and thematic closure.
                                    
            //     Return your response in a json or javascript object format like: 
            //     newPlot(string, these would be a new plot based on the tone), 
            //     incitingEvent(array), 
            //     incitingEventSuggestions(array), 
            //     incitingEventSummary(string), 
            //     suggestedCharacters(array of objects with keys like name(string), role(string), motivations(array), personalityTraits(array), backstory(string), weaknesses(array), strengths(array), coreValues(array) and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)) as keys. 
            //     Please ensure the only keys in the objects are newPlot, incitingEvent, incitingEventSuggestions, incitingEventSummary and characters only.
            //     Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
                
            //     current plot: {currentPlot}
            //     existing characters: {existingCharacters}
            //     introduction tone: {tone}
            //     introduction stakes: {stakes}
            //     introduction exposition: {exposition}
            //     introduction hook: {hook}
            //     plot: {storyPlot}
            //     story title: {storyTitle}
            //     genre: {genre}
            //     thematic element & option: {thematicElement}
            //     suspense technique: {suspenseTechnique}
            //     suspense technique description: {suspenseTechniqueDescription}
            // `;
            
            showPageLoader();
        
            const response = await queryLLM(startingTemplate, {
                currentPlot: initialStoryData?.overview,
                existingCharacters: characterPrompt, // extractCharacters(initialStoryData),
                protagonists: protagonists, 
                antagonists: antagonists,
                stakes: stakesPrompt,
                tone: tonePrompt,
                hook: hookPrompt,
                exposition: expositionPrompt,
                genre: genrePrompt,
                thematicElement: thematicElementsPrompt,
                storyTitle: initialStoryData.title,
                suspenseTechnique: initialStoryData.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStoryData.suspenseTechnique?.description,
            });
    
            if (response) {
                const storyStarterSaved = await saveStory({ 
                    incitingEventSetting: {
                        newPlot: response?.newPlot,
                        incitingEvent: response?.incitingEvent,
                        incitingEventSuggestions: [...response?.incitingEvent, ...response?.incitingEventSuggestions],
                        incitingEventSummary: response?.incitingEventSummary,      
                        suggestedCharacters: response?.suggestedCharacters,      
                    }
                });   
                await moveToNext();
                setOpenModifyStakeModal(false);
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
                <h1 className="font-bold text-2xl text-center mb-3">Introduction</h1>
                <p className="text-sm italic font-light text-gray-600 text-center">
                "The introduction establishes the protagonist, exposition, setting, story’s tone, and stakes immediately."                
                </p>
            </div>

            <div className='p-5'>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Tone</AccordionTrigger>
                        <AccordionContent>
                            <ul className='mb-3'>
                                {
                                    storyStructure?.introductionTone?.map((tone, index) => (
                                        <li className='text-xs flex items-center gap-2 mb-1' key={`_${index}_`}> 
                                            <div className='flex items-start'>
                                                <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                                            </div>
                                            <span>{tone}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                            <Button size='sm' className='mr-5' 
                            onClick={() => setOpenModifyToneModal(true)}
                            >
                                Modify Tone
                                <Edit className='ml-2 w-4 h-4'/>
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>Protagonists</AccordionTrigger>
                        <AccordionContent>
                            <ul className='mb-3'>
                                {
                                    storyStructure?.protagonists?.map((protagonist, index) => (
                                        <li className='text-xs flex items-center gap-2 mb-1' key={`_${index}_`}> 
                                            <div className='flex items-start'>
                                                <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                                            </div>
                                            <span>{protagonist.name}: {protagonist.role}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                            <Button size='sm' className='mr-5' 
                            onClick={() => setOpenModifyProtagonistModal(true)}
                            >
                                Modify Protagonists
                                <Edit className='ml-2 w-4 h-4'/>
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>Exposition</AccordionTrigger>
                        <AccordionContent>
                            <ul className='mb-3'>
                                {
                                    storyStructure?.exposition?.map((exposition, index) => (
                                        <li className='text-xs flex items-center gap-2 mb-1' key={`_${index}_`}> 
                                            <div className='flex items-start'>
                                                <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                                            </div>
                                            <span>{exposition}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                            <Button size='sm' className='mr-5' 
                            onClick={() => setOpenModifyExpositionModal(true)}
                            >
                                Modify Expositions
                                <Edit className='ml-2 w-4 h-4'/>
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>Stakes</AccordionTrigger>
                        <AccordionContent>
                            <ul className='mb-3'>
                                {
                                    storyStructure?.introductionStakes?.map((stake, index) => (
                                        <li className='text-xs flex items-center gap-2 mb-1' key={`_${index}_`}> 
                                            <div className='flex items-start'>
                                                <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                                            </div>
                                            <span>{stake}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                            <Button size='sm' className='mr-5' 
                            onClick={() => setOpenModifyStakeModal(true)}
                            >
                                Modify Stakes
                                <Edit className='ml-2 w-4 h-4'/>
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
                
                <div className="flex items-center justify-between mt-4">
                    <Button size='sm' className='mr-5' 
                    disabled={true}
                    >
                        Prev
                        <ArrowLeft className='ml-2 w-4 h-4'/>
                    </Button>
                    <Button size='sm' className='' 
                    onClick={moveToIncitingEvents}
                    >
                        Next
                        <ArrowRight className='ml-2 w-4 h-4'/>
                    </Button>
                </div>
            </div>

            <ModifyToneComponent 
                openModifyToneModal={openModifyToneModal}
                setOpenModifyToneModal={setOpenModifyToneModal}
                selectedTone={selectedTone} 
                setSelectedTone={setSelectedTone}
                toneSuggestions={toneSuggestions}
                setToneSuggestions={setToneSuggestions}
                initialStoryData={initialStoryData}
                saveStory={saveStory}
            />

            <ModifyExpositionComponent 
                openModifyExpositionModal={openModifyExpositionModal}
                setOpenModifyExpositionModal={setOpenModifyExpositionModal}
                selectedExpositions={selectedExpositions} 
                setSelectedExpositions={setSelectedExpositions}
                expositionSuggestions={expositionSuggestions}
                setExpositionSuggestions={setExpositionSuggestions}
                initialStoryData={initialStoryData}
                saveStory={saveStory}
            />

            <ModifyStakeComponent 
                openModifyStakeModal={openModifyStakeModal}
                setOpenModifyStakeModal={setOpenModifyStakeModal}
                selectedStake={selectedStake}
                setSelectedStake={setSelectedStake}
                stakeSuggestions={stakeSuggestions}
                setStakeSuggestions={setStakeSuggestions}
                initialStoryData={initialStoryData}
                saveStory={saveStory}
            />

            <Dialog open={openModifyProtagonistModal} onOpenChange={setOpenModifyProtagonistModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className=''>Kindly share your story idea</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <div className='mb-4'>
                            <h1 className="font-semibold mb-1 text-gray-500">Protagonist(s)</h1>
                            {
                                storyStructure?.protagonists?.map((protagonist, index) => (
                                    <li className='text-xs flex items-center gap-2 mb-1' key={`_${index}_`}> 
                                        <div className='flex items-start'>
                                            <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                                        </div>
                                        <span>{protagonist.name}: {protagonist.role}</span>
                                    </li>
                                ))
                            }
                        </div>
                        <div>
                            <h1 className="font-semibold mb-1 text-gray-500">Suggestion(s)</h1>
                            {
                                storyStructure?.protagonistSuggestions?.map((protagonist, index) => (
                                    <li className='text-xs flex items-center gap-2 mb-1' key={`_${index}_`}> 
                                        <div className='flex items-start'>
                                            <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                                        </div>
                                        <span>{protagonist.name}: {protagonist.role}</span>
                                    </li>
                                ))
                            }
                        </div>
                        <div className="flex items-center gap-5 mt-4">
                            {/* <Button onClick={() => generatePlotSuggestions(false)}>Proceed</Button>
                            <Button onClick={() => generatePlotSuggestions(true)} variant="outline">Give me suggestions</Button> */}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default IntroductionComponent
