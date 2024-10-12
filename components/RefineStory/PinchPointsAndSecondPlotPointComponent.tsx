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
import { cn } from '@/lib/utils';
import { Dosis,Inter } from 'next/font/google';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';

interface PinchPointsAndSecondPlotPointComponentProps {
    initialStory: StoryInterface;
    refetch: () => void;
    moveToNext:(step: number) => void;
    projectDescription: string;
}

const inter = Inter({ subsets: ['latin'] });


const PinchPointsAndSecondPlotPointComponent: React.FC<PinchPointsAndSecondPlotPointComponentProps> = ({
    initialStory,
    refetch,
    moveToNext,
    projectDescription
}) => {  
    const [pinchPointsAndSecondPlotPoint, setPinchPointsAndSecondPlotPoint] = useState<string>(initialStory?.storyStructure?.pinchPointsAndSecondPlotPoint ?? "");
    const [modifyModalOpen, setModifyModalOpen] = useState<boolean>(false);
    const [generating, setGenerating] = useState<boolean>(false);

    // What new obstacles challenge the protagonist?   
    const [newObstacles, setNewObstacles] = useState<string>("");    
    // What discovery changes what the protagonist does next?
    const [discoveryChanges, setDiscoveryChanges] = useState<string>("");        
    // How does the protagonist's world, stakes, or understanding of the conflict escalate or change?
    const [howStakesEscalate, setHowStakesEscalate] = useState<string>("");    

    const [pinchPointsAndSecondPlotPointCharacters, setPinchPointsAndSecondPlotPointCharacters] = useState<[]>([]);    
    const [pinchPointsAndSecondPlotPointSetting, setPinchPointsAndSecondPlotPointSetting] = useState<string[]>(initialStory?.pinchPointsAndSecondPlotPointSetting ?? []);
    const [pinchPointsAndSecondPlotPointTone, setPinchPointsAndSecondPlotPointTone] = useState<string[]>(initialStory?.pinchPointsAndSecondPlotPointTone ?? []);
    const [pinchPointsAndSecondPlotPointExtraDetails, setPinchPointsAndSecondPlotPointExtraDetails] = useState<string>("");

    // const dynamicJwtToken = getAuthToken();
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

    const scrollToBottom = () => {
        const element = document.getElementById("control-buttons");
        if (element) {            
            element.scrollIntoView({ behavior: "smooth" });
        }
    }

    const generatePinchPointsAndSecondPlotPoint = async () => {
        let { genrePrompt, protagonistSuggestionsPrompt, tonePrompt, settingPrompt } = extractTemplatePrompts(initialStory);

        try {
           
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                

            **CONTEXT**
            The following sections of the story have already been generated:
            - The introduction to the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident: {incitingIncident}
            - First Plot Point: {firstPlotPoint}
            - Rising Action & Midpoint: {risingActionAndMidpoint}

            You are going to generate the Pinch Points & Second Plot Point section of the story by continuing from where the Rising Action & Midpoint stopped.
            When crafting the Rising Action & Midpoint, ensure the story answers the following questions:
            - What new obstacles challenge the protagonist?   
            - What discovery changes what the protagonist does next?
            - How does the protagonist's world, stakes, or understanding of the conflict escalate or change?

            The Pinch Points & Second Plot Point are crucial elements in the story structure, serving to create tension, raise the stakes, and propel the plot forward.

            **OUTPUT**
            - Generate the *Pinch Points & Second Plot Point*. 
            - The scene should be emotionally impactful, genre-appropriate, and aligned with the protagonist’s motivations. 
            - Use vivid descriptions and dialogue when necessary. 
            - Ensure the transition from the Rising Action & Midpoint to the Pinch Points & Second Plot Point is smooth.
            - Maintain the genre and tone.
            - Length: At least 500 words.
            - No titles or additional commentary, just the story.
            - Ensure the story continues to relate the story idea.
            Note: Do not include an title or subtitles while generating the story, we are only focused on the story. Do not add any title, subtitle or anything describing an act.

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
                risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpoint,     
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
                setPinchPointsAndSecondPlotPoint(chapter);         
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
    
    const regeneratePinchPointsAndSecondPlotPoint = async () => {
        let { genrePrompt, protagonistSuggestionsPrompt } = extractTemplatePrompts(initialStory);
        
        try {
            const prompt = `
            You are a skilled storyteller, author, and narrative designer known for creating immersive narratives, developing deep characters, and transporting readers into vivid worlds. Your writing style is creative, engaging, and attentive to detail. 
            The following sections of the story have already been generated:
            - The introduction to the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident: {incitingIncident}
            - First Plot Point: {firstPlotPoint}
            - Rising Action & Midpoint: {risingActionAndMidpoint}
            - Pinch Points & Second Plot Point {pinchPointsAndSecondPlotPoint}
            You are going to regenerate the provided Pinch Points & Second Plot Point section of the story by continuing from where the Pinch Points & Second Plot Point stopped.
            
            **OUTPUT**
            You will be given an existing Pinch Points & Second Plot Point chapter of a story which is a continuation of the Rising Action & Midpoint. 
            Your task is to rewrite this Pinch Points & Second Plot Point chapter, carefully incorporating the following elements or changes:            
            - What new obstacles challenge the protagonist? {newObstacles}
            - What discovery changes what the protagonist does next? {discoveryChanges}
            - How does the protagonist's world, stakes, or understanding of the conflict escalate or change? {howStakesEscalate}
            - the setting: {setting}
            - the tone: {tone}
            - extra details that can be applied to the story: {extraDetails}
            
            While rewriting, ensure you consider:
            - The protagonist, setting, tone, genre and any extra details provided to maintain consistency with the story's direction, ensure that all of this stays consistent with the original story idea {storyIdea}.            
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
                risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpoint,
                pinchPointsAndSecondPlotPoint,
                newObstacles,
                discoveryChanges,
                howStakesEscalate,
                setting: pinchPointsAndSecondPlotPointSetting.join(", "),
                tone: pinchPointsAndSecondPlotPointTone.join(", "),
                extraDetails: pinchPointsAndSecondPlotPointExtraDetails,
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
            setPinchPointsAndSecondPlotPoint('')
            for await (const chunk of response) {
                text += chunk;   
                setPinchPointsAndSecondPlotPoint(text);    
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
    
    const saveGeneration = async (data: string) => {
        if (data) {                
            const updated = await axiosInterceptorInstance.put(`/stories/structure/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    pinchPointsAndSecondPlotPoint: data,
                    pinchPointsAndSecondPlotPointLocked: true
                }
            );
        }
    }

    const analyzeStory = async (showModal = true) => {
        const data = pinchPointsAndSecondPlotPoint
        if (!data) {
            toast.error('Generate some content first')
            return;
        }

        try {
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                
            We have currently generated the Pinch Points & Second Plot Point section of the story. 
            I need you analyze the generated Pinch Points & Second Plot Point and give an analysis of the characters involved in the story, tone, genre, setting, and Characters involved.
            I need you to also analyze the generated Pinch Points & Second Plot Point and the answer following questions:
            - What new obstacles challenge the protagonist?
            - What discovery changes what the protagonist does next? 
            - How does the protagonist's world, stakes, or understanding of the conflict escalate or change?
            
            **CONTEXT**
            Here is the Pinch Points & Second Plot Point: {pinchPointsAndSecondPlotPoint}.
            The following sections of the story have already been generated:
            - The introduction to the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident: {incitingIncident}
            - First Plot Point: {firstPlotPoint}
            - Rising Action & Midpoint: {risingActionAndMidpoint}
            - Pinch Points & Second Plot Point {pinchPointsAndSecondPlotPoint}

            Return your response in a json or javascript object format like: 
            summary(string, a summary of the story soo far),
            newObstacles(string, this refers to the answer to the question, What new obstacles challenge the protagonist?),            
            discoveryChanges(string, this refers to the answer to the question, What discovery changes what the protagonist does next?),            
            howStakesEscalate(string, this refers to the answer to the question, How does the protagonist's world, stakes, or understanding of the conflict escalate or change?),            
            tone(array of strings),
            setting(array of strings).                        
            Please ensure the only keys in the object are summary, newObstacles, discoveryChanges, howStakesEscalate, tone and setting keys only.
            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                               

            **INPUT**
            Rising Action & Midpoint {risingActionAndMidpoint}
            story idea {storyIdea}
            `;
            // charactersInvolved(array of objects with keys name(string), backstory(string), role(string) & relationshipToProtagonist(string). These are the characters involved in the inciting incident),            

            showPageLoader();
            const response = await queryLLM(prompt, {
                introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
                incitingIncident: initialStory?.storyStructure?.incitingIncident,
                firstPlotPoint: initialStory?.storyStructure?.firstPlotPoint,
                risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpoint,
                pinchPointsAndSecondPlotPoint: data,
                storyIdea: projectDescription,
            });

            if (!response) {
                toast.error("Try again please");
                return;
            }        

            setNewObstacles(response?.newObstacles ?? "");
            setDiscoveryChanges(response?.discoveryChanges ?? "");
            setHowStakesEscalate(response?.howStakesEscalate ?? "");
            setPinchPointsAndSecondPlotPointSetting(response?.setting ?? "");
            setPinchPointsAndSecondPlotPointTone(response?.tone ?? "");
            // setPinchPointsAndSecondPlotPointCharacters(response?.charactersInvolved ?? "");

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
                    newObstacles: payload?.newObstacles,
                    discoveryChanges: payload?.discoveryChanges,
                    howStakesEscalate: payload?.howStakesEscalate,
                    pinchPointsAndSecondPlotPointSetting: payload?.setting,
                    pinchPointsAndSecondPlotPointTone: payload?.tone,
                    pinchPointsAndSecondPlotPoint,
                    // pinchPointsAndSecondPlotPointCharacters: payload?.charactersInvolved,
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
                    newObstacles,
                    discoveryChanges,
                    howStakesEscalate,
                    // pinchPointsAndSecondPlotPointCharacters,
                    pinchPointsAndSecondPlotPointSetting,
                    pinchPointsAndSecondPlotPointTone,
                    pinchPointsAndSecondPlotPoint,
                    pinchPointsAndSecondPlotPointExtraDetails,
                    pinchPointsAndSecondPlotPointLocked: true,     
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

    const moveToChapter6 = async () => {
        
        if (!newObstacles) {            
            await analyzeStory(false)
        }
        moveToNext(6)
    }

    return (
        <div className="my-10 bg-gray-50 p-5 rounded-2xl">
            <div className='mb-5'>
                <div className="flex justify-between items-center mb-5">
                    <Button size="icon" onClick={() => moveToNext(4)} disabled={generating}>
                        <ArrowLeft />
                    </Button>
                    <p className='font-bold text-center text-2xl'>
                        Chapter 5
                    </p>
                    <Button size="icon" onClick={moveToChapter6} disabled={generating || !pinchPointsAndSecondPlotPoint}>
                        <ArrowRight />
                    </Button>
                </div>
                <p className='text-xs text-center'>
                This chapter brings in problems and challenges that test the protagonist's determination, raising the stakes                
                </p> 
            </div>

            <textarea 
                disabled={generating}
                rows={5} 
                style={{ overflow: 'hidden' }}
                ref={textareaRef}
                onFocus={(e) => {
                    setPinchPointsAndSecondPlotPoint(e.target.value);
                    adjustHeight();
                }}
                onChange={(e) => {
                    setPinchPointsAndSecondPlotPoint(e.target.value);
                    adjustHeight();
                }}
                value={pinchPointsAndSecondPlotPoint} 
                placeholder=''
                className={cn('p-5 mb-4 outline-none border text-md whitespace-pre-wrap rounded-lg w-full leading-5', inter.className)} 
            />

            <div className="flex justify-between items-center mb-3">
                <Button size="icon" onClick={() => moveToNext(4)} disabled={generating}>
                    <ArrowLeft />
                </Button>

                <Button size="icon" onClick={moveToChapter6} disabled={generating || !initialStory?.pinchPointsAndSecondPlotPointLocked}>
                    <ArrowRight />
                </Button>
            </div>
            <div id='control-buttons' className='grid grid-cols-3 gap-4'> 
                
                {
                    <Button 
                    className='flex items-center gap-2'
                    disabled={generating}                            
                    size="sm" onClick={generatePinchPointsAndSecondPlotPoint}>
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
                className='flex items-center gap-2'
                disabled={generating || !pinchPointsAndSecondPlotPoint}
                onClick={() => {
                    if (newObstacles) {
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
                disabled={generating || !pinchPointsAndSecondPlotPoint}     
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
                            <p className="font-semibold mb-3 text-xs">What new obstacles challenge the protagonist?</p> 
                            <textarea                             
                                rows={10} 
                                onFocus={(e) => setNewObstacles(e.target.value)}
                                onChange={(e) => setNewObstacles(e.target.value)}
                                value={newObstacles} 
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">What discovery changes what the protagonist does next?</p> 
                            <textarea                             
                                rows={10} 
                                onFocus={(e) => setDiscoveryChanges(e.target.value)}
                                onChange={(e) => setDiscoveryChanges(e.target.value)}
                                value={discoveryChanges} 
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">How does the protagonist's world, stakes, or understanding of the conflict escalate or change?</p> 
                            <textarea                             
                                rows={10} 
                                onFocus={(e) => setHowStakesEscalate(e.target.value)}
                                onChange={(e) => setHowStakesEscalate(e.target.value)}
                                value={howStakesEscalate} 
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Setting</p> 
                            <SampleSelect 
                                options={[...pinchPointsAndSecondPlotPointSetting, ...settingDetails?.location]}
                                onChange={(val) => setPinchPointsAndSecondPlotPointSetting(val)}
                                value={pinchPointsAndSecondPlotPointSetting ?? []}
                            />
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Tone</p> 
                            <SampleSelect 
                                options={[...pinchPointsAndSecondPlotPointTone, ...storyTones]}
                                onChange={(val) => setPinchPointsAndSecondPlotPointTone(val)}
                                value={pinchPointsAndSecondPlotPointTone ?? []}
                            />
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Add extra details for customization</p> 
                            <textarea                             
                                rows={5} 
                                onFocus={(e) => setPinchPointsAndSecondPlotPointExtraDetails(e.target.value)}
                                onChange={(e) => setPinchPointsAndSecondPlotPointExtraDetails(e.target.value)}
                                value={pinchPointsAndSecondPlotPointExtraDetails} 
                                placeholder=''
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <Button disabled={generating} 
                            onClick={regeneratePinchPointsAndSecondPlotPoint}
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

export default PinchPointsAndSecondPlotPointComponent


