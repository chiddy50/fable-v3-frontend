"use client"

import { StoryInterface } from '@/interfaces/StoryInterface';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight, Cog, Lock } from 'lucide-react';
import { extractTemplatePrompts, makeChapterAnalysisRequest, queryLLM, queryStructuredLLM, streamLLMResponse } from '@/services/LlmQueryHelper';
import { toast } from 'sonner';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Option } from '../ui/multiple-selector';
import { makeRequest } from '@/services/request';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import SampleSelect from '../SampleSelect';
import { settingDetails, storyTones } from '@/lib/data';
import { Card } from '../ui/card';
import code from '@code-wallet/elements';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { AxiosRequestConfig } from 'axios';
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { v4 as uuidv4 } from 'uuid';
import { SuggestedOtherCharacterInterface } from '@/interfaces/CreateStoryInterface';

interface IncitingIncidentComponentProps {
    initialStory: StoryInterface;
    refetch: () => void;
    moveToNext:(step: number) => void;
    projectDescription: string;
}
// Define your desired data structure. Only used for typing the parser output.

interface ChapterAnalysis {
    summary: string;
    charactersInvolved: SuggestedOtherCharacterInterface[];
    tone: string[];
    typeOfEvent: string;
    causeOfTheEvent: string;
    stakesAndConsequences: string;
    mysteryOrSurprise: string;
    introductionSummary: string;
    thematicElement: string[];
    suspenseTechnique: string[];
    moodAndAtmosphere: string[];
    setting: string[];
}
  
const inter = Inter({ subsets: ['latin'] });

const IncitingIncidentComponent: React.FC<IncitingIncidentComponentProps> = ({
    initialStory,
    refetch,
    moveToNext,
    projectDescription
}) => {
    const [incitingIncident, setIncitingIncident] = useState<string>(initialStory?.storyStructure?.incitingIncident ?? "");
    const [modifyModalOpen, setModifyModalOpen] = useState<boolean>(false);
    const [generating, setGenerating] = useState<boolean>(false);

    const [incitingIncidentSummary, setIncitingIncidentSummary] = useState<string>(initialStory?.storyStructure?.incitingIncidentSummary ?? "");        
    const [typeOfEvent, setTypeOfEvent] = useState<string>(initialStory?.typeOfEvent ?? "");
    const [causeOfTheEvent, setCauseOfEvent] = useState<string>(initialStory?.causeOfTheEvent ?? "");
    const [stakesAndConsequences, setStakesAndConsequences] = useState<string>(initialStory?.stakesAndConsequences ?? "");
    const [incitingIncidentCharacters, setIncitingIncidentCharacters] = useState<[]>([]);    
    const [incitingIncidentSetting, setIncitingIncidentSetting] = useState<string[]>(initialStory?.incitingIncidentSetting ?? "");
    const [incitingIncidentTone, setIncitingIncidentTone] = useState<string[]>(initialStory?.incitingIncidentTone ?? "");
    const [incitingIncidentExtraDetails, setIncitingIncidentExtraDetails] = useState<string>("");
    const [suggestedCharacters, setSuggestedCharacters] = useState<[]>([]);
    const [mounted, setMounted] = useState<boolean>(false);

    // const dynamicJwtToken = getAuthToken();

    // CODE STORY PAYMENT
    const el = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setMounted(true)
        if(mounted && !initialStory?.isPaid && initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld){
            const { button } = code.elements.create('button', {
                currency: 'usd',
                destination: process.env.NEXT_PUBLIC_CODE_WALLET_DEPOSIT_ADDRESS,
                amount: 0.25,
                // idempotencyKey: `${initialStory?.id}`,
            });
            
            if (button && initialStory?.isPaid === false) {   
                initialStory?.isPaid === false && initialStory?.storyStructure?.firstPlotPoint &&
                console.log({el});
                
                button?.mount(el?.current!);

                button?.on('invoke', async () => {
                    // Get a payment intent from our own server
                    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/create-intent/${initialStory?.id}`;            
                    const response = await axiosInterceptorInstance.post(url, 
                        {
                            narration: "Create Story",
                            type: "create-story",
                            amount: 0.25 
                        }
                    );
                        
                    console.log(response);
                    const clientSecret = response?.data?.clientSecret;
                    
                    // Update the button with the new client secret so that our server
                    // can be notified once the payment is complete.
                    if (clientSecret) {
                        button.update({ clientSecret });                    
                    }              
                });            
        
                button?.on('success', async (event) => {
                    // Handle successful payment, the intent ID will be provided in the event object
                    console.log("==PAYMENT SUCCESSFUL EVENT===", event);
                    
                    if (event) {
                        const { amount, clientSecret, currency, destination, locale, mode } = event?.options;
                        const intent = event?.intent;
                        
                        if (!initialStory?.isPaid) {            

                            const response = await axiosInterceptorInstance.post(`/transactions/confirm/${intent}`, 
                                {
                                    storyId: initialStory?.id,
                                    amount, clientSecret, currency, destination, locale, mode
                                }
                            );

                            if (response) {
                                refetch();
                            }
                        }
                    }
                    
                    return true; // Return true to prevent the browser from navigating to the optional success URL provided in the confirmParams
                });
        
                button?.on('cancel', async (event) => {
                    // Handle cancelled payment, the intent ID will be provided in the event object
                    console.log("==PAYMENT CANCELLED EVENT===", event);
                    if (event) {
                        const { amount, clientSecret, currency, destination, locale, mode } = event?.options;
                        const intent = event?.intent;
                        
                        const config: AxiosRequestConfig = {
                            data: {
                                amount, clientSecret, currency, destination, locale, mode,           
                                storyId: initialStory?.id,
                            }
                        };
                        const response = await axiosInterceptorInstance.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/transactions/${intent}`, 
                            config
                        );
            
                    }
                    return true; // Return true to prevent the browser from navigating to the optional cancel URL provided in the confirmParams
                });
            }
        }

    }, [mounted]);


    useEffect(() => {
        setIncitingIncidentSummary(initialStory?.storyStructure?.incitingIncidentSummary ?? "");
        setTypeOfEvent(initialStory?.typeOfEvent ?? "");
        setCauseOfEvent(initialStory?.causeOfTheEvent ?? "");
        setStakesAndConsequences(initialStory?.stakesAndConsequences ?? "");
        setIncitingIncidentSetting(initialStory?.incitingIncidentSetting ?? "");
        setIncitingIncidentTone(initialStory?.incitingIncidentTone ?? "");
    }, [initialStory]);

    useEffect(() => {
        adjustHeight();
    }, [incitingIncident]);
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        const element = document.getElementById("control-buttons");
        if (element) {            
            element.scrollIntoView({ behavior: "smooth" });
        }
    }


    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;    
        }
    };

    
    const generateIncitingIncident = async () => {
        let { genrePrompt, protagonistSuggestionsPrompt, tonePrompt, settingPrompt } = extractTemplatePrompts(initialStory);

        try {
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                

            We are writing with the 3 act structure.
            You are going to generate the Inciting Incident section of the story by continuing from where the introduction to the protagonist and their ordinary world stopped.
            
            **CONTEXT**
            We have already introduced the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}.
            
            **OUTPUT**
            - Generate the *Inciting Incident* that significantly disrupts the protagonist's ordinary world, raises the stakes, and initiates their journey to achieve their goal. 
            - The scene should be emotionally impactful, genre-appropriate, and aligned with the protagonist’s motivations. 
            - Use vivid descriptions and dialogue when necessary. 
            - Ensure the transition from the protagonist's introduction and ordinary world to the inciting incident is smooth.
            - Maintain the genre and tone.
            - Length: At least 500 words.
            - No titles or additional commentary, just the story.
            - Use simple grammar.
            Note: Do not include a title or subtitles while generating the story, we are only focused on the story. Do not add any title, subtitle or anything describing an act.

            **INPUT**
            story idea {storyIdea}
            Protagonists: {protagonists}
            Tone: {tones}
            Setting: {setting}
            Genre: {genre}            
            `;
            
            setGenerating(true);

            const response = await fetch('/api/stream-llm-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    payload: {
                        storyIdea: projectDescription,
                        genre: genrePrompt,
                        tones: tonePrompt,
                        setting: settingPrompt,
                        protagonists: protagonistSuggestionsPrompt,
                        introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introductionSummary
                    },
                }),
            });

            if (!response?.body) {
                setGenerating(false);   
                console.error("No stream found");
                toast.error("Try again please");
                return;
            }
            
            let chapter = ``;

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;
    
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunk = decoder.decode(value);
                chapter += chunk;   
                setIncitingIncident(chapter);
            }
            scrollToBottom();

            await saveGeneration(chapter)
                        
                  
            // const response = await streamLLMResponse(prompt, {
            //     storyIdea: projectDescription,
            //     genre: genrePrompt,
            //     tones: tonePrompt,
            //     setting: settingPrompt,
            //     protagonists: protagonistSuggestionsPrompt,
            //     introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introductionSummary
            // });

            // if (!response) {
            //     setGenerating(false);   
            //     toast.error("Try again please");
            //     return;
            // }
            // scrollToBottom()
    
            // let chapter = ``;
            // for await (const chunk of response) {
            //     // scrollToBottom()
            //     chapter += chunk;   
            //     setIncitingIncident(chapter);         
            // }
            
            // scrollToBottom();

            // await saveGeneration(chapter)
            // // await analyzeChapter(chapter)

        } catch (error) {
            console.error(error);            
        }finally{
            setGenerating(false);
        }
    }

    const regenerateIncitingIncident = async () => {
        let { genrePrompt, protagonistSuggestionsPrompt, tonePrompt, settingPrompt } = extractTemplatePrompts(initialStory);
        
        try {
            const prompt = `
            You are a skilled storyteller, author, and narrative designer known for creating immersive narratives, developing deep characters, and transporting readers into vivid worlds. Your writing style is creative, engaging, and attentive to detail. 
            We have already introduced the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}.
            
            **OUTPUT**
            You will be given an existing Inciting Incident chapter of a story which is a continuation of the introduction. 
            Your task is to rewrite this Inciting Incident chapter, carefully incorporating the following elements or changes and continuing from where the introduction of the protagonist stopped.
            - type of event or incident: {typeOfEvent}
            - the cause of the event: {causeOfTheEvent}
            - stakes and consequences: {stakesAndConsequences}
            - the new setting: {incitingIncidentSetting}
            - the new tone: {incitingIncidentTone}
            - extra changes that can be applied to the story: {incitingIncidentExtraDetails}
            
            While rewriting, ensure you consider:
            - The inciting event (or inciting incident) is a critical moment in storytelling that triggers the main conflict and sets the protagonist on their journey. It typically occurs early in the story and marks the point where the normal life of the protagonist is disrupted.
            - The type of event, cause of the event, stakes and consequences, setting, tone, genre and any extra details provided to maintain consistency with the story's direction, ensure that all of this stays consistent with the original story idea {storyIdea}.
            Rewrite the Inciting Incident chapter only according to the new changes for the type of event, the cause of the event, the new setting, the new tone or extra changes.

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

            const response = await fetch('/api/stream-llm-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    payload: {
                        storyIdea: projectDescription,
                        introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
                        typeOfEvent,
                        causeOfTheEvent,
                        stakesAndConsequences,
                        incitingIncidentSetting: incitingIncidentSetting.join(", "),
                        incitingIncidentTone: incitingIncidentTone.join(", "),
                        incitingIncidentExtraDetails,
                        genre: genrePrompt, 
                        incitingIncident,
                        protagonist: protagonistSuggestionsPrompt
                    },
                }),
            });

            if (!response?.body) {
                setGenerating(false);   
                toast.error("Try again please");
                return;
            }
    
            let text = ``;

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;
    
            setIncitingIncident('')
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunk = decoder.decode(value);
                text += chunk;   
                setIncitingIncident(text);
            }
            scrollToBottom();

            // const response = await streamLLMResponse(prompt, {
            //     storyIdea: projectDescription,
            //     introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
            //     typeOfEvent,
            //     causeOfTheEvent,
            //     stakesAndConsequences,
            //     incitingIncidentSetting: incitingIncidentSetting.join(", "),
            //     incitingIncidentTone: incitingIncidentTone.join(", "),
            //     incitingIncidentExtraDetails,
            //     genre: genrePrompt, 
            //     incitingIncident,
            //     protagonist: protagonistSuggestionsPrompt
            // });

            // if (!response) {
            //     setGenerating(false);
            //     toast.error("Try again please");
            //     return;
            // }
    
            // scrollToBottom();
            // let text = ``;
            // setIncitingIncident('')
            // for await (const chunk of response) {
            //     text += chunk;   
            //     setIncitingIncident(text);    
            //     scrollToBottom();
            // }
            // scrollToBottom();

        } catch (error) {
            console.error(error);    
            setGenerating(false);
        }finally{
            setGenerating(false);
        }
    }
    
    const analyzeChapter = async (showModal = true) => {
        try {
            const data = incitingIncident
            if (!data) {
                toast.error('Generate some content first');
                return;
            }

            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                
            We have currently generated the Inciting Incident section of the story. 
            I need you analyze the generated Inciting Incident and give an analysis of the characters involved in the story, tone, genre, thematic element, suspense technique, setting, Type of event, Cause of the event, Character's reaction, Stakes and consequences, Mystery or surprise and Characters involved.
            
            **CONTEXT**
            Here is the Story Introduction {introduceProtagonistAndOrdinaryWorld}. Here is the Inciting Incident {incitingIncident}.

            Return your response in a json or javascript object format like: 
            summary(string, this is a summary of the events in the inciting incident section of the story, ensure the summary contains all the events sequentially including the last events leading to the next chapter),
            charactersInvolved(array of objects with keys like name(string), age(string), backstory(string), role(string), clothDescription(string), habits(string), innerConflict(string), antagonistForce(string), gender(string), relevanceToAudience(string), motivations(array), skinTone(string), height(string), weight(string), hairTexture(string), hairLength(string), hairQuirk(string), facialHair(string), facialFeatures(string), motivations(array), characterTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string) & relationshipToProtagonists(array of object with keys like protagonistName(string) & relationship(string)) )
            tone(array of strings),
            typeOfEvent(string, this refers to the type of event that triggers the Inciting Incident, be very detailed in explaining what happened),
            causeOfTheEvent(string, this refers to the Cause of the Inciting Incident, be very detailed in explaining what happened),
            stakesAndConsequences(string, this refers to the Stakes and consequences of the Inciting Incident),
            mysteryOrSurprise(string, this refers to the Mystery or surprise of the Inciting Incident section),            
            summary(string, this is a summary of the events in the inciting incident section of the story, ensure the summary contains all the events sequentially including the last events leading to the next chapter),
            thematicElement(array of string),
            suspenseTechnique(array of string),
            moodAndAtmosphere(array of string),
            setting(array of strings).                        
            Please ensure the only keys in the object are summary, charactersInvolved, tone, genre, typeOfEvent, causeOfTheEvent, stakesAndConsequences, suspenseTechnique, mysteryOrSurprise, thematicElement, moodAndAtmosphere, plotTwist and setting keys only.
            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                               

            charactersInvolved are the characters involved in this chapter except the protagonist.
            Ensure the summary contains all the events step by step as they occurred and the summary must also contain the characters and the impacts they have had on each other.

            **INPUT**
            Story Introduction {introduceProtagonistAndOrdinaryWorld}
            Inciting Incident {incitingIncident}
            story idea {storyIdea}
            `;

            showPageLoader();

            const payload = {
                introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
                incitingIncident: incitingIncident,
                storyIdea: projectDescription,
            }
            let res = await makeChapterAnalysisRequest(2, prompt, payload);
            
            let response = res?.data;

            // const parser = new JsonOutputParser<ChapterAnalysis>();

            // const response = await queryStructuredLLM(prompt, {
            //     introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
            //     incitingIncident: incitingIncident,
            //     storyIdea: projectDescription,
            // }, parser);

            if (!response) {
                toast.error("Try again please");
                return;
            }        

            setTypeOfEvent(response?.typeOfEvent ?? "");
            setCauseOfEvent(response?.causeOfTheEvent ?? "");
            setStakesAndConsequences(response?.stakesAndConsequences ?? "");
            setIncitingIncidentSetting(response?.setting ?? "");
            setIncitingIncidentTone(response?.tone ?? "");
            setSuggestedCharacters(response?.charactersInvolved);

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
            const suggestedCharacters = setSupportingCharacters();
            console.log({suggestedCharacters, payload});
            // return;

            // save data
            // const updated = await axiosInterceptorInstance.put(`/stories/build-from-scratch/${initialStory?.id}`, 
            const updated = await axiosInterceptorInstance.put(`${process.env.NEXT_PUBLIC_BASE_URL}/chapters/chapter-two/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    typeOfEvent: payload?.typeOfEvent,                    
                    causeOfTheEvent: payload?.causeOfTheEvent,                    
                    stakesAndConsequences: payload?.stakesAndConsequences,                    
                    incitingIncidentSetting: payload?.setting,                    
                    incitingIncidentTone: payload?.tone,
                    incitingIncidentSummary: payload?.summary,
                    incitingIncident,
                    suggestedCharacters: payload?.charactersInvolved  
                }
            );

            console.log(updated);
            if (updated) {
                refetch()
            }
        }
    }

    const saveGeneration = async (data: string) => {
        if (data) {                
            // const updated = await axiosInterceptorInstance.put(`/stories/structure/${initialStory?.id}`, 
            const updated = await axiosInterceptorInstance.put(`${process.env.NEXT_PUBLIC_BASE_URL}/chapters/chapter-two/${initialStory?.id}`, 
                {
                    chapter: 2,
                    storyId: initialStory?.id,
                    incitingIncident: data,
                    incitingIncidentLocked: true  
                }
            );
        }
    }

    const lockChapter = async () => {
        try {           
            showPageLoader();

            // const updated = await axiosInterceptorInstance.put(`/stories/build-from-scratch/${initialStory?.id}`, 
            const updated = await axiosInterceptorInstance.put(`${process.env.NEXT_PUBLIC_BASE_URL}/chapters/chapter-two/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    typeOfEvent,
                    stakesAndConsequences,
                    incitingIncidentSetting,
                    incitingIncidentTone,
                    incitingIncidentExtraDetails,
                    causeOfTheEvent,
                    incitingIncident,
                    incitingIncidentLocked: true   
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

    const moveToChapter3 = async () => {
        if(!initialStory?.isPaid && incitingIncident) {
            return;
        }
        if (!typeOfEvent) {
            await analyzeChapter(false)
        }
        moveToNext(3);
    }

    const setSupportingCharacters = useCallback(() => {        
        const existingCharacterNames = new Set(initialStory.suggestedCharacters.map(char => char.name));
        
        const newCharacters = suggestedCharacters.filter(char => !existingCharacterNames.has(char.name));
        console.log({newCharacters});
        
        // const updatedCharacters = [
        //     ...initialStory.suggestedCharacters,
        //     // ...newCharacters,
        //     ...newCharacters.map((character: object) => ( { ...character, id: uuidv4() } ))
        // ];
        const updatedCharacters = [...initialStory.suggestedCharacters, ...newCharacters.map((character: object) => {
            return { ...character, id: uuidv4() }
        })];
        
        console.log({
            existing: initialStory.suggestedCharacters, 
            new: newCharacters.map((character: object) => ( { ...character, id: uuidv4() } )),
            updatedCharacters
        });
        return updatedCharacters;
    }, [initialStory, suggestedCharacters]);
    
    

    return (
        <div className="my-10 bg-gray-50 p-5 rounded-2xl">
            <div className='mb-5'>
                <div className="flex justify-between items-center mb-3">
                    <Button size="icon" onClick={() => moveToNext(1)} disabled={generating}>
                        <ArrowLeft />
                    </Button>
                    <p className='font-bold text-center text-2xl'>Chapter 2</p>
                    
                    <Button 
                        size="icon" 
                        onClick={moveToChapter3} 
                        disabled={generating || !initialStory?.isPaid}
                    >
                        <ArrowRight />
                    </Button>
                </div>
                <p className='text-xs mt-3 text-center'>
                This chapter introduces the event that sets the story in motion. It's a crucial moment that sets the protagonist on their journey.                
                </p> 
            </div>

            {
                initialStory?.isPaid === true && 
                <div id="text-container">
                    <textarea 
                        
                        disabled={generating}
                        rows={5} 
                        style={{ overflow: 'hidden' }}
                        ref={textareaRef}
                        onFocus={(e) => {
                            setIncitingIncident(e.target.value);
                            adjustHeight(); // Adjust height on every change
                        }}
                        onChange={(e) => {
                            setIncitingIncident(e.target.value);
                            adjustHeight(); // Adjust height on every change
                        }}
                        value={incitingIncident} 
                        placeholder=''
                        className={cn('p-5 mb-4 outline-none border text-md whitespace-pre-wrap rounded-lg w-full leading-5', inter.className)} 
                        />
                </div>
            }

            {
                initialStory?.isPaid === false &&
                <div className="flex justify-center">
                    <Card className='my-5 p-7'>
                        <div className="flex justify-center">
                            <div ref={el} />
                        </div>
                        <p className='mt-3 text-xs text-center'>
                            Your trial session is over
                            <br/> 
                            Kindly make a payment of $0.25 to proceed
                        </p>
                    </Card>
                </div>     
            }

            {
                initialStory?.isPaid === true && 
                <>
                    <div className="flex justify-between items-center mb-3">
                        <Button size="icon" onClick={() => moveToNext(1)} disabled={generating}>
                            <ArrowLeft />
                        </Button>

                        {/* <Button onClick={setSupportingCharacters} className='bg-custom_green'>Characters</Button> */}
                        
                        <Button 
                            size="icon" 
                            onClick={moveToChapter3} 
                            disabled={generating || !initialStory?.isPaid}
                        >
                            <ArrowRight />
                        </Button>
                    </div>
                    <div id='control-buttons' className='grid grid-cols-3 gap-4'>
                    
                        {
                            <Button 
                            className='flex items-center gap-2'
                            disabled={generating}                            
                            size="sm" onClick={generateIncitingIncident}>
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
                        disabled={generating || !incitingIncident}
                        onClick={() => {
                            if (incitingIncidentSummary) {
                                setModifyModalOpen(true);
                            }else{
                                analyzeChapter()
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
                        disabled={generating || !incitingIncident}     
                        onClick={lockChapter}       
                        size="sm" variant="destructive">
                            Save
                            <Lock className='ml-2 w-3 h-3' />
                        </Button>}
                        
                    </div>
                </>
            }



            <Sheet open={modifyModalOpen} onOpenChange={setModifyModalOpen}>
                <SheetContent className="overflow-y-scroll z-[100] xs:min-w-[90%] sm:min-w-[96%] md:min-w-[65%] lg:min-w-[65%] xl:min-w-[55%]">
                    <SheetHeader className=''>
                        <SheetTitle>Edit Chapter</SheetTitle>
                        <SheetDescription> </SheetDescription>
                    </SheetHeader>

                    <div>
                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Type of Event</p> 
                            <textarea                             
                                rows={3} 
                                onFocus={(e) => setTypeOfEvent(e.target.value)}
                                onChange={(e) => setTypeOfEvent(e.target.value)}
                                value={typeOfEvent} 
                                placeholder=''
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Cause of Event</p> 
                            <textarea                             
                                rows={3} 
                                onFocus={(e) => setCauseOfEvent(e.target.value)}
                                onChange={(e) => setCauseOfEvent(e.target.value)}
                                value={causeOfTheEvent} 
                                placeholder=''
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Stakes & Consequences</p> 
                            <textarea                             
                                rows={3} 
                                onFocus={(e) => setStakesAndConsequences(e.target.value)}
                                onChange={(e) => setStakesAndConsequences(e.target.value)}
                                value={stakesAndConsequences} 
                                placeholder=''
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Setting</p> 
                            <SampleSelect 
                                options={[...incitingIncidentSetting, ...settingDetails?.location]}
                                onChange={(val) => setIncitingIncidentSetting(val)}
                                value={incitingIncidentSetting ?? []}
                            />
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Tone</p> 
                            <SampleSelect 
                                options={[...incitingIncidentTone, ...storyTones]}
                                onChange={(val) => setIncitingIncidentTone(val)}
                                value={incitingIncidentTone ?? []}
                            />
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Add extra details for customization</p> 
                            <textarea                             
                                rows={3} 
                                onFocus={(e) => setIncitingIncidentExtraDetails(e.target.value)}
                                onChange={(e) => setIncitingIncidentExtraDetails(e.target.value)}
                                value={incitingIncidentExtraDetails} 
                                placeholder=''
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>
                        {/* 
                        Introduce Protagonist & Ordinary World
                        Inciting Incident
                        First Plot Point
                        Rising Action and Midpoint
                        Pinch Point and Second Plot Point
                        Climax and Falling Action
                        Resolution
                        */}
                        <div className="grid grid-cols-2 gap-5 mt-5 ">
                            <Button disabled={generating} 
                                onClick={regenerateIncitingIncident}
                                size="lg" 
                                className='border w-full bg-custom_green text-white hover:bg-custom_green hover:text-white'>
                                Regenerate
                                <Cog className='ml-2'/>
                            </Button>
                            <Button disabled={generating} 
                            onClick={() => analyzeChapter(false)}
                            size="lg" className='border w-full '>
                                Reanalyze
                                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" className='w-4 h-4 ml-2' viewBox="0 0 96 96">
                                <g fill="#FFFFFF">
                                    <path d="M9.4 12.5c-.4 1.4-.4 15.5-.2 31.3.4 24.5.7 29.3 2.3 33 2.4 5.8 5.9 8.1 14.7 9.2 8 1 55.7 1.4 58.2.4 2.1-.8 2.1-4 0-4.8-.9-.3-15.1-.6-31.5-.6H22.9l.6-2.3c.4-1.2 2.8-6.1 5.2-11 7.3-14.1 11.6-15.9 20.3-8.2 4.4 3.9 5.7 4.5 9.5 4.5 5.7 0 9-2.9 14.8-12.5 3.7-6.1 4.8-7.2 8.5-8.3 2.9-1 4.2-1.9 4.2-3.2 0-2.3-1.7-2.9-5.4-1.9-4.9 1.4-7.4 3.7-11.1 10.1-7.4 12.6-10.5 13.7-18.7 6.3-4.2-3.8-5.7-4.5-9.2-4.5-7.9 0-13.1 5.5-20.5 21.5-3.2 6.9-3.3 7-4.6 4.5-1.1-2-1.4-8.8-1.5-32.7 0-16.6-.3-30.8-.6-31.7-1-2.6-4.3-1.9-5 .9zM27.3 13.7c-2 .8-1.5 4.1.7 4.8 2.9.9 6-.3 6-2.5 0-2.5-3.4-3.7-6.7-2.3zM27.3 25.7c-1.8.7-1.6 4 .3 4.7.9.3 4.6.6 8.4.6 3.8 0 7.5-.3 8.4-.6 2.1-.8 2.1-4 0-4.8-1.9-.7-15.3-.7-17.1.1z"/>
                                </g>
                                </svg>
                            </Button>

                        </div>
                    </div>
                </SheetContent>
            </Sheet>

        </div>
    )
}

export default IncitingIncidentComponent
