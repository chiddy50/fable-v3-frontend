"use client";

import { StoryInterface } from '@/interfaces/StoryInterface';
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight, Cog, Lock } from 'lucide-react';
import { extractTemplatePrompts, queryLLM, streamLLMResponse } from '@/services/LlmQueryHelper';
import { toast } from 'sonner';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { makeRequest } from '@/services/request';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import SampleSelect from '../SampleSelect';
import { settingDetails, storyTones } from '@/lib/data';
import { Dosis, Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';

interface RisingActionAndMidpointComponentProps {
    initialStory: StoryInterface;
    refetch: () => void;
    moveToNext:(step: number) => void;
    projectDescription: string;
}

const inter = Inter({ subsets: ['latin'] });

const RisingActionAndMidpointComponent: React.FC<RisingActionAndMidpointComponentProps> = ({
    initialStory,
    refetch,
    moveToNext,
    projectDescription
}) => {  
    const [risingActionAndMidpoint, setRisingActionAndMidpoint] = useState<string>(initialStory?.storyStructure?.risingActionAndMidpoint ?? "");
    const [modifyModalOpen, setModifyModalOpen] = useState<boolean>(false);
    const [generating, setGenerating] = useState<boolean>(false);

    // What challenges does the protagonist face on their journey?    
    const [challengesProtagonistFaces, setChallengesProtagonistFaces] = useState<string>("");    
    // How does the protagonist's perspective change through these challenges?
    const [protagonistPerspectiveChange, setProtagonistPerspectiveChange] = useState<string>("");    
    // What major event pushes the protagonist towards the climax?    
    const [majorEventPropellingClimax, setMajorEventPropellingClimax] = useState<string>("");    

    const [risingActionAndMidpointCharacters, setRisingActionAndMidpointCharacters] = useState<[]>([]);    
    const [risingActionAndMidpointSetting, setRisingActionAndMidpointSetting] = useState<string[]>(initialStory?.risingActionAndMidpointSetting ?? []);
    const [risingActionAndMidpointTone, setRisingActionAndMidpointTone] = useState<string[]>(initialStory?.risingActionAndMidpointTone ?? []);
    const [risingActionAndMidpointExtraDetails, setRisingActionAndMidpointExtraDetails] = useState<string>("");

    // const dynamicJwtToken = getAuthToken();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        adjustHeight();
    }, [risingActionAndMidpoint]);
    
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const scrollToBottom = () => {
        const element = document.getElementById("control-buttons");
        if (element) {            
            element.scrollIntoView({ behavior: "smooth" });
        }
    }

    const generateRisingActionAndMidpoint = async () => {
        let { genrePrompt, protagonistSuggestionsPrompt, tonePrompt, settingPrompt } = extractTemplatePrompts(initialStory);

        try {
           
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                

            **CONTEXT**
            The following sections of the story have already been generated:
            - The introduction to the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident: {incitingIncident}
            - First Plot Point: {firstPlotPoint}

            You are going to generate the Rising Action & Midpoint section of the story by continuing from where the First Plot Point stopped.
            When crafting the Rising Action & Midpoint, ensure the story answers the following questions:
            - What challenges does the protagonist face on their journey?
            - How does the protagonist's perspective change through these challenges?
            - What major event pushes the protagonist towards the climax?
    
            Rising Action & Midpoint: This chapter shows the protagonist facing obstacles, complications, and setbacks as they work towards their goal, culminating in a significant pivot point that marks a change in direction, tone, or the protagonist's understanding of the situation. The midpoint raises the stakes, introduces new complications, or provides a crucial revelation that affects the protagonist's goal, testing their abilities and building momentum towards the climax.
            
            **OUTPUT**
            - Generate the *Rising Action & Midpoint*. 
            - The scene should be emotionally impactful, genre-appropriate, and aligned with the protagonist’s motivations. 
            - Use vivid descriptions and dialogue when necessary. 
            - Ensure the transition from the first plot point to the Rising Action & Midpoint is smooth.
            - Maintain the genre and tone.
            - Length: At least 500 words.
            - No titles or additional commentary, just the story.
            - Ensure the story continues to relate the story idea.
            Note: Do not include a title or subtitles while generating the story, we are only focused on the story. Do not add any title, subtitle or anything describing an act.

            **INPUT**
            story idea {storyIdea}
            Protagonists: {protagonists}
            Tone: {tones}
            Setting: {setting}
            Genre: {genre}            
            `;
            
            setGenerating(true);
            const response = await streamLLMResponse(prompt, {
                storyIdea: projectDescription,
                genre: genrePrompt,
                tones: tonePrompt,
                setting: settingPrompt,
                protagonists: protagonistSuggestionsPrompt,
                introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
                incitingIncident: initialStory?.storyStructure?.incitingIncident,                
                firstPlotPoint: initialStory?.storyStructure?.firstPlotPoint,                
            });

            if (!response) {
                setGenerating(false);   
                toast.error("Try again please");
                return;
            }
            scrollToBottom()
    
            let chapter = ``;
            for await (const chunk of response) {
                scrollToBottom()
                chapter += chunk;   
                setRisingActionAndMidpoint(chapter);         
            }
            
            scrollToBottom();
            
            await saveGeneration(chapter)
            // await analyzeStory(chapter)

        } catch (error) {
            console.error(error);            
        }finally{
            setGenerating(false);
        }
    }
    
    const regenerateRisingActionAndMidpoint = async () => {
        let { genrePrompt, protagonistSuggestionsPrompt } = extractTemplatePrompts(initialStory);
        
        try {
            const prompt = `
            You are a skilled storyteller, author, and narrative designer known for creating immersive narratives, developing deep characters, and transporting readers into vivid worlds. Your writing style is creative, engaging, and attentive to detail. 
            The following sections of the story have already been generated:
            - The introduction to the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident: {incitingIncident}
            - First Plot Point: {firstPlotPoint}
            - Rising Action & Midpoint: {risingActionAndMidpoint}
            You are going to regenerate the provided Rising Action & Midpoint section of the story by continuing from where the First Plot Point stopped.
            
            **OUTPUT**
            You will be given an existing Rising Action & Midpoint chapter of a story which is a continuation of the First Plot Point. 
            Your task is to rewrite this Rising Action & Midpoint chapter, carefully incorporating the following elements or changes:
            - What challenges does the protagonist face on their journey? {challengesProtagonistFaces}
            - How does the protagonist's perspective change through these challenges? {protagonistPerspectiveChange}
            - What major event pushes the protagonist towards the climax? {majorEventPropellingClimax}
            - the setting: {firstPlotPointSetting}
            - the tone: {firstPlotPointTone}
            - extra details that can be applied to the story: {risingActionAndMidpointExtraDetails}
            
            While rewriting, ensure you consider:
            - The setting, tone, genre and any extra details provided to maintain consistency with the story's direction, ensure that all of this stays consistent with the original story idea {storyIdea}.            
            **Note:** Focus solely on the story. Do not include titles, subtitles, or act labels.

            **INPUT**
            Current Inciting Incident: {incitingIncident}
            Story Introduction: {introduceProtagonistAndOrdinaryWorld}
            genre: {genre}
            Story Idea: {storyIdea} 
            protagonist: {protagonist}
            `;
            
            setGenerating(true);
            setModifyModalOpen(false);
            const response = await streamLLMResponse(prompt, {
                storyIdea: projectDescription,
                introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
                incitingIncident: initialStory?.storyStructure?.incitingIncident,
                firstPlotPoint: initialStory?.storyStructure?.firstPlotPoint,
                risingActionAndMidpoint,
                challengesProtagonistFaces,
                protagonistPerspectiveChange,
                majorEventPropellingClimax,
                risingActionAndMidpointSetting: risingActionAndMidpointSetting.join(", "),
                risingActionAndMidpointTone: risingActionAndMidpointTone.join(", "),
                risingActionAndMidpointExtraDetails,
                genre: genrePrompt, 
                protagonist: protagonistSuggestionsPrompt
            });

            if (!response) {
                setGenerating(false);
                toast.error("Try again please");
                return;
            }
    
            scrollToBottom();
            let text = ``;
            setRisingActionAndMidpoint('')
            for await (const chunk of response) {
                text += chunk;   
                setRisingActionAndMidpoint(text);    
                scrollToBottom();
            }
            scrollToBottom();

        } catch (error) {
            console.error(error);    
            setGenerating(false);
        }finally{
            setGenerating(false);
        }
    }
    
    const analyzeStory = async (showModal = true) => {
        const data = risingActionAndMidpoint
        if (!data) {
            toast.error('Generate some content first')
            return;
        }

        try {
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                
            We have currently generated the Rising Action & Midpoint section of the story. 
            I need you analyze the generated Rising Action & Midpoint and give an analysis of the characters involved in the story, tone, genre, setting, and Characters involved.
            I need you to also analyze the generated Rising Action & Midpoint and the answer following questions:
            - What challenges does the protagonist face on their journey?
            - How does the protagonist's perspective change through these challenges?
            - What major event pushes the protagonist towards the climax?
            
            **CONTEXT**
            Here is the Rising Action & Midpoint: {risingActionAndMidpoint}.
            The following sections of the story have already been generated:
            - The introduction to the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident: {incitingIncident}
            - First Plot Point: {firstPlotPoint}

            Return your response in a json or javascript object format like: 
            summary(string, a summary of the story soo far),
            charactersInvolved(array of objects with keys name(string), backstory(string), role(string) & relationshipToProtagonist(string). These are the characters involved in the inciting incident),
            challengesProtagonistFaces(string, this refers to the answer to the question, What challenges does the protagonist face on their journey?),            
            protagonistPerspectiveChange(string, this refers to the answer to the question, How does the protagonist's perspective change through these challenges?),            
            majorEventPropellingClimax(string, this refers to the answer to the question, What major event pushes the protagonist towards the climax?),            
            tone(array of strings),
            setting(array of strings).                        
            Please ensure the only keys in the object are summary, charactersInvolved, protagonistGoal, protagonistTriggerToAction, obstaclesProtagonistWillFace, tone and setting keys only.
            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                               

            **INPUT**
            Rising Action & Midpoint {risingActionAndMidpoint}
            story idea {storyIdea}
            `;

            showPageLoader();
            const response = await queryLLM(prompt, {
                introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
                incitingIncident: initialStory?.storyStructure?.incitingIncident,
                firstPlotPoint: initialStory?.storyStructure?.firstPlotPoint,
                risingActionAndMidpoint: data,
                storyIdea: projectDescription,
            });

            if (!response) {
                toast.error("Try again please");
                return;
            }        

            setChallengesProtagonistFaces(response?.challengesProtagonistFaces ?? "");
            setProtagonistPerspectiveChange(response?.protagonistPerspectiveChange ?? "");
            setMajorEventPropellingClimax(response?.majorEventPropellingClimax ?? "");
            setRisingActionAndMidpointCharacters(response?.charactersInvolved ?? "")
            setRisingActionAndMidpointSetting(response?.setting ?? "");
            setRisingActionAndMidpointTone(response?.tone ?? "");

            let saved = await saveAnalysis(response);
            
            if(showModal) setModifyModalOpen(true);

        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const saveAnalysis = async (payload) => {
        if (payload) {                
            // save data
            const updated = await axiosInterceptorInstance.put(`/stories/build-from-scratch/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    challengesProtagonistFaces: payload?.challengesProtagonistFaces,                    
                    protagonistPerspectiveChange: payload?.protagonistPerspectiveChange,                    
                    majorEventPropellingClimax: payload?.majorEventPropellingClimax,                    
                    risingActionAndMidpointCharacters: payload?.charactersInvolved,                                                   
                    risingActionAndMidpointSetting: payload?.setting,                    
                    risingActionAndMidpointTone: payload?.tone,
                    risingActionAndMidpoint,
                }
            );
            console.log(updated);
            if (updated) {
                refetch()
            }
        }
    }

    const lockChapter = async () => {
        try {           
            showPageLoader();

            const updated = await axiosInterceptorInstance.put(`/stories/build-from-scratch/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    challengesProtagonistFaces,                    
                    protagonistPerspectiveChange,                    
                    majorEventPropellingClimax,                    
                    risingActionAndMidpointCharacters,                                                   
                    risingActionAndMidpointSetting,                    
                    risingActionAndMidpointTone,
                    risingActionAndMidpoint,
                    risingActionAndMidpointExtraDetails,
                    risingActionAndMidpointLocked: true,  
                }
            );

            if (updated) {
                refetch()
            }
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const saveGeneration = async (data: string) => {
        if (data) {                
            const updated = await axiosInterceptorInstance.put(`/stories/structure/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    risingActionAndMidpoint: data,
                    risingActionAndMidpointLocked: true
                }
            );
        }
    }

    const moveToChapter5 = async () => {
        if (!challengesProtagonistFaces) {            
            await analyzeStory(false)
        }
        moveToNext(5)
    }

    return (
        <div className="my-10 bg-gray-50 p-5 rounded-2xl">
            <div className='mb-5'>
                <div className="flex justify-between items-center mb-5">
                    <Button size="icon" onClick={() => moveToNext(3)} disabled={generating}>
                        <ArrowLeft />
                    </Button>
                    <p className='font-bold text-center text-2xl'>
                        Chapter 4 
                    </p>
                    <Button size="icon" onClick={moveToChapter5} disabled={generating || !risingActionAndMidpoint}>
                        <ArrowRight />
                    </Button>
                </div>
                <p className='text-xs text-center'>
                This chapter shows the protagonist dealing with problems and challenges while working toward their goal. The middle of the chapter is a good time for a twist or surprise.                </p> 
            </div>

            <textarea 
                disabled={generating}
                rows={5} 
                style={{ overflow: 'hidden' }}
                ref={textareaRef}
                onFocus={(e) => {
                    setRisingActionAndMidpoint(e.target.value);
                    adjustHeight();
                }}
                onChange={(e) => {
                    setRisingActionAndMidpoint(e.target.value);
                    adjustHeight();
                }}
                value={risingActionAndMidpoint} 
                placeholder=''
                className={cn('p-5 mb-4 outline-none border text-md whitespace-pre-wrap rounded-lg w-full leading-5', inter.className)} 
            />

            <div className="flex justify-between items-center mb-3">
                <Button size="icon" onClick={() => moveToNext(3)} disabled={generating}>
                    <ArrowLeft />
                </Button>
                
                <Button size="icon" onClick={moveToChapter5} disabled={generating || !risingActionAndMidpoint}>
                    <ArrowRight />
                </Button>
            </div>

            <div id='control-buttons' className='grid grid-cols-3 gap-4'> 
                
                {
                    <Button 
                    className='flex items-center gap-2'
                    disabled={generating}                            
                    size="sm" onClick={generateRisingActionAndMidpoint}>
                        Generate
                        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" className='w-4 h-4' viewBox="0 0 96 96" preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0,96) scale(0.1,-0.1)" fill="#FFFFFF" stroke="none">
                                <path d="M693 883 c-29 -86 -40 -99 -97 -123 -75 -30 -74 -54 3 -82 50 -19 55 -24 79 -80 33 -76 56 -76 84 1 19 50 24 55 80 79 76 33 76 56 -1 84 -50 19 -55 24 -79 79 -26 61 -56 79 -69 42z m45 -108 c7 -14 23 -30 37 -37 14 -6 25 -14 25 -18 0 -4 -11 -12 -25 -18 -14 -7 -30 -23 -37 -37 -14 -31 -22 -31 -36 0 -7 14 -23 30 -37 37 -14 6 -25 14 -25 18 0 4 11 12 25 18 14 7 30 23 37 37 6 14 14 25 18 25 4 0 12 -11 18 -25z"/>
                                <path d="M243 740 c-82 -9 -126 -31 -155 -78 -46 -75 -47 -444 -2 -522 42 -70 128 -90 394 -90 267 0 352 20 394 91 23 39 43 253 32 342 -7 52 -10 58 -29 55 -21 -3 -22 -8 -27 -178 -7 -261 9 -250 -370 -250 -385 0 -370 -12 -370 290 0 154 3 199 16 225 23 49 65 65 172 65 103 0 122 5 122 30 0 31 -32 35 -177 20z"/>
                            </g>
                        </svg>
                    </Button>
                }
                
                {
                <Button size="sm"  
                className=' flex items-center gap-2'
                disabled={generating || !risingActionAndMidpoint}
                onClick={() => {
                    if (challengesProtagonistFaces) {
                        setModifyModalOpen(true);
                    }else{
                        analyzeStory()
                    }
                }}
                >
                    Analysis
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" className='w-4 h-4' viewBox="0 0 96 96">
                    <g fill="#FFFFFF">
                        <path d="M9.4 12.5c-.4 1.4-.4 15.5-.2 31.3.4 24.5.7 29.3 2.3 33 2.4 5.8 5.9 8.1 14.7 9.2 8 1 55.7 1.4 58.2.4 2.1-.8 2.1-4 0-4.8-.9-.3-15.1-.6-31.5-.6H22.9l.6-2.3c.4-1.2 2.8-6.1 5.2-11 7.3-14.1 11.6-15.9 20.3-8.2 4.4 3.9 5.7 4.5 9.5 4.5 5.7 0 9-2.9 14.8-12.5 3.7-6.1 4.8-7.2 8.5-8.3 2.9-1 4.2-1.9 4.2-3.2 0-2.3-1.7-2.9-5.4-1.9-4.9 1.4-7.4 3.7-11.1 10.1-7.4 12.6-10.5 13.7-18.7 6.3-4.2-3.8-5.7-4.5-9.2-4.5-7.9 0-13.1 5.5-20.5 21.5-3.2 6.9-3.3 7-4.6 4.5-1.1-2-1.4-8.8-1.5-32.7 0-16.6-.3-30.8-.6-31.7-1-2.6-4.3-1.9-5 .9zM27.3 13.7c-2 .8-1.5 4.1.7 4.8 2.9.9 6-.3 6-2.5 0-2.5-3.4-3.7-6.7-2.3zM27.3 25.7c-1.8.7-1.6 4 .3 4.7.9.3 4.6.6 8.4.6 3.8 0 7.5-.3 8.4-.6 2.1-.8 2.1-4 0-4.8-1.9-.7-15.3-.7-17.1.1z"/>
                    </g>
                    </svg>
                </Button>
                }
                
                {
                (initialStory?.genres) && 
                <Button 
                className=''                
                disabled={generating || !risingActionAndMidpoint}     
                onClick={lockChapter}       
                size="sm" variant="destructive">
                    Save
                    <Lock className='ml-2 w-3 h-3' />
                </Button>
                }
                
            </div>


            <Sheet open={modifyModalOpen} onOpenChange={setModifyModalOpen}>
                <SheetContent className="overflow-y-scroll xs:min-w-[90%] sm:min-w-[96%] md:min-w-[65%] lg:min-w-[65%] xl:min-w-[55%]">
                    <SheetHeader className=''>
                        <SheetTitle>Edit Chapter</SheetTitle>
                        <SheetDescription> </SheetDescription>
                    </SheetHeader>

                    <div>
                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">What challenges does the protagonist face on their journey?</p> 
                            <textarea                             
                                rows={10} 
                                onFocus={(e) => setChallengesProtagonistFaces(e.target.value)}
                                onChange={(e) => setChallengesProtagonistFaces(e.target.value)}
                                value={challengesProtagonistFaces} 
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">How does the protagonist's perspective change through these challenges? </p> 
                            <textarea                             
                                rows={10} 
                                onFocus={(e) => setProtagonistPerspectiveChange(e.target.value)}
                                onChange={(e) => setProtagonistPerspectiveChange(e.target.value)}
                                value={protagonistPerspectiveChange} 
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">What major event pushes the protagonist towards the climax?</p> 
                            <textarea                             
                                rows={10} 
                                onFocus={(e) => setMajorEventPropellingClimax(e.target.value)}
                                onChange={(e) => setMajorEventPropellingClimax(e.target.value)}
                                value={majorEventPropellingClimax} 
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Setting</p> 
                            <SampleSelect 
                                options={[...risingActionAndMidpointSetting, ...settingDetails?.location]}
                                onChange={(val) => setRisingActionAndMidpointSetting(val)}
                                value={risingActionAndMidpointSetting ?? []}
                            />
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Tone</p> 
                            <SampleSelect 
                                options={[...risingActionAndMidpointTone, ...storyTones]}
                                onChange={(val) => setRisingActionAndMidpointTone(val)}
                                value={risingActionAndMidpointTone ?? []}
                            />
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Add extra details for customization</p> 
                            <textarea                             
                                rows={10} 
                                onFocus={(e) => setRisingActionAndMidpointExtraDetails(e.target.value)}
                                onChange={(e) => setRisingActionAndMidpointExtraDetails(e.target.value)}
                                value={risingActionAndMidpointExtraDetails} 
                                placeholder=''
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <Button disabled={generating} 
                            onClick={regenerateRisingActionAndMidpoint}
                            size="lg" 
                            className='mt-5 border w-full bg-custom_green text-white hover:bg-custom_green hover:text-white'>
                            Regenerate
                            <Cog className='ml-2'/>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>


        
        </div>
    );
}

export default RisingActionAndMidpointComponent
