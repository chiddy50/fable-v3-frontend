"use client";

// CHAPTER 3
import { StoryInterface } from '@/interfaces/StoryInterface';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight, Cog, Lock } from 'lucide-react';
import { extractTemplatePrompts, getFirstPlotPointAnalysis, getFirstPlotPointSummaryChain, getIncitingIncidentSummary, getIntroductionSummary, makeChapterAnalysisRequest, modelInstance, queryLLM, queryStructuredLLM, streamLLMResponse } from '@/services/LlmQueryHelper';
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
import { cn } from '@/lib/utils';
import { Dosis, Inter } from 'next/font/google';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { FirstPlotPointChapterAnalysis, SuggestedOtherCharacterInterface } from '@/interfaces/CreateStoryInterface';
import { v4 as uuidv4 } from 'uuid';
import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"

const inter = Inter({ subsets: ['latin'] });
interface FirstPlotPointComponentProps {
    initialStory: StoryInterface;
    refetch: () => void;
    moveToNext:(step: number) => void;
    projectDescription: string;
}


const FirstPlotPointComponent: React.FC<FirstPlotPointComponentProps> = ({
    initialStory,
    refetch,
    moveToNext,
    projectDescription
}) => {  
    const [firstPlotPoint, setFirstPlotPoint] = useState<string>(initialStory?.storyStructure?.firstPlotPoint ?? "");
    const [modifyModalOpen, setModifyModalOpen] = useState<boolean>(false);
    const [generating, setGenerating] = useState<boolean>(false);

    
    // What is the protagonist's new goal or desire?
    const [protagonistGoal, setProtagonistGoal] = useState<string>(initialStory?.protagonistGoal ?? "");    
    // What triggers the protagonist to take action? 
    const [protagonistTriggerToAction, setProtagonistTriggerToAction] = useState<string>(initialStory?.protagonistTriggerToAction ?? "");    
    // What obstacles or challenges will the protagonist face?
    const [obstaclesProtagonistWillFace, setObstaclesProtagonistWillFace] = useState<string>(initialStory?.obstaclesProtagonistWillFace ?? "");    

    const [firstPlotPointSummary, setFirstPlotPointSummary] = useState<string>(initialStory?.storyStructure?.firstPlotPointSummary ?? "");        
    const [firstPlotPointCharacters, setFirstPlotPointCharacters] = useState<[]>([]);    
    const [firstPlotPointSetting, setFirstPlotPointSetting] = useState<string[]>(initialStory?.firstPlotPointSetting ?? []);
    const [firstPlotPointTone, setFirstPlotPointTone] = useState<string[]>(initialStory?.firstPlotPointTone ?? []);
    const [firstPlotPointExtraDetails, setFirstPlotPointExtraDetails] = useState<string>("");
    const [suggestedCharacters, setSuggestedCharacters] = useState<[]>([]);

    // const dynamicJwtToken = getAuthToken();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        adjustHeight();
    }, [firstPlotPoint]);

    useEffect(() => {
        setFirstPlotPointSummary(initialStory?.storyStructure?.firstPlotPointSummary ?? "");
    }, [initialStory]);

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

    const generateFirstPlotPoint = async () => {
        let { genrePrompt, protagonistSuggestionsPrompt, tonePrompt, settingPrompt } = extractTemplatePrompts(initialStory);

        try {           
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                

            The following sections of the story have already been generated:
            - The introduction to the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident: {incitingIncident}
            You are going to generate the First Plot Point section of the story by continuing from where the Inciting Incident stopped.

            The First Plot Point (FPP) is a crucial element in story structure that marks a turning point in the narrative. When crafting the First Plot Point, ask yourself:
            - What is the protagonist's new goal or desire?
            - What triggers the protagonist to take action? 
            - What obstacles or challenges will the protagonist face?
            - What event or decision will propel the protagonist into the main conflict?
            - How can I raise the stakes and create tension at this point in the story?
            - What information can I reveal to add depth and complexity to the plot?
            - How can I make the protagonist's decision or action feel meaningful and consequential?

            **CONTEXT**
            We have already introduced the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}.
            
            **OUTPUT**
            - Generate the *First Plot Point*. 
            - The scene should be emotionally impactful, genre-appropriate, and aligned with the protagonist’s motivations. 
            - Use vivid descriptions and dialogue when necessary. 
            - Ensure the transition from the inciting incident to the first plot point is smooth.
            - Maintain the genre and tone.
            - Length: At least 500 words.
            - No titles or additional commentary, just the story.
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
                        introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
                        incitingIncident: initialStory?.storyStructure?.incitingIncident, 
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
                setFirstPlotPoint(chapter);
            }
            scrollToBottom();

            await saveGeneration(chapter)
                                    
            // const response = await streamLLMResponse(prompt, {
            //     storyIdea: projectDescription,
            //     genre: genrePrompt,
            //     tones: tonePrompt,
            //     setting: settingPrompt,
            //     protagonists: protagonistSuggestionsPrompt,
            //     introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
            //     incitingIncident: initialStory?.storyStructure?.incitingIncident,                
            // });

            // if (!response) {
            //     setGenerating(false);   
            //     toast.error("Try again please");
            //     return;
            // }
            // scrollToBottom()
    
            // let chapter = ``;
            // for await (const chunk of response) {
            //     scrollToBottom()
            //     chapter += chunk;   
            //     setFirstPlotPoint(chapter);         
            // }
            
            // scrollToBottom();

            // await saveGeneration(chapter)
            // // await analyzeStory(chapter)

        } catch (error) {
            console.error(error);            
        }finally{
            setGenerating(false);
        }
    }
    
    const regenerateFirstPlotPoint = async () => {
        let { genrePrompt, protagonistSuggestionsPrompt } = extractTemplatePrompts(initialStory);
        
        try {
            const prompt = `
            You are a skilled storyteller, author, and narrative designer known for creating immersive narratives, developing deep characters, and transporting readers into vivid worlds. Your writing style is creative, engaging, and attentive to detail. 
            The following sections of the story have already been generated:
            - The introduction to the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident: {incitingIncident}
            - First Plot Point: {firstPlotPoint}
            You are going to regenerate a provided First Plot Point section of the story by continuing from where the Inciting Incident stopped.
            
            **OUTPUT**
            You will be given an existing First Plot Point chapter of a story which is a continuation of the Inciting Incident. 
            Your task is to rewrite this First Plot Point chapter, carefully incorporating the following elements or changes:
            - What is the protagonist's new goal or desire? {protagonistGoal},                    
            - What triggers the protagonist to take action? {protagonistTriggerToAction}
            - What challenges will the protagonist face? {obstaclesProtagonistWillFace}
            - the setting: {firstPlotPointSetting}
            - the tone: {firstPlotPointTone}
            - extra details that can be applied to the story: {firstPlotPointExtraDetails}
            
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
            
            const response = await fetch('/api/stream-llm-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    payload: {
                        storyIdea: projectDescription,
                        introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
                        incitingIncident: initialStory?.storyStructure?.incitingIncident,
                        protagonistGoal,
                        protagonistTriggerToAction,
                        obstaclesProtagonistWillFace,
                        firstPlotPointSetting: firstPlotPointSetting.join(", "),
                        firstPlotPointTone: firstPlotPointTone.join(", "),
                        firstPlotPointExtraDetails,
                        genre: genrePrompt, 
                        firstPlotPoint,
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
    
            setFirstPlotPoint('')
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunk = decoder.decode(value);
                text += chunk;   
                setFirstPlotPoint(text);
            }
            scrollToBottom();

            // const response = await streamLLMResponse(prompt, {
            //     storyIdea: projectDescription,
            //     introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
            //     incitingIncident: initialStory?.storyStructure?.incitingIncident,
            //     protagonistGoal,
            //     protagonistTriggerToAction,
            //     obstaclesProtagonistWillFace,
            //     firstPlotPointSetting: firstPlotPointSetting.join(", "),
            //     firstPlotPointTone: firstPlotPointTone.join(", "),
            //     firstPlotPointExtraDetails,
            //     genre: genrePrompt, 
            //     firstPlotPoint,
            //     protagonist: protagonistSuggestionsPrompt
            // });

            // if (!response) {
            //     setGenerating(false);
            //     toast.error("Try again please");
            //     return;
            // }
    
            // scrollToBottom();
            // let text = ``;
            // setFirstPlotPoint('')
            // for await (const chunk of response) {
            //     text += chunk;   
            //     setFirstPlotPoint(text);    
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
    
    const analyzeStory = async (showModal = true) => {
        const data = firstPlotPoint 
        if (!data) {
            toast.error('Generate some content first')
            return;
        }

        try {
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                
            We have currently generated the First Plot Point section of the story. 
            I need you analyze the generated First Plot Point and give an analysis of the characters involved in the story, tone, genre, setting, and Characters involved.
            I need you to also analyze the generated First Plot Point and answer questions like:
            - What is the protagonist's new goal or desire?
            - What triggers the protagonist to take action? 
            - What obstacles or challenges will the protagonist face?
            
            **CONTEXT**
            Here is the First Plot Point {firstPlotPoint}.
            The following sections of the story have already been generated:
            - The introduction to the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident: {incitingIncident}

            Return your response in a json or javascript object format like: 
            summary(string, a summary of the story soo far),       
            scenes(array of objects with keys like title(string), setting(string), description(string: make this very descriptive &detailed for whats happening a scene), order(number, this is the order in which the scene occurs) charactersInvolved(array of objects with keys like name(string), roleInScene(string), relationshipToProtagonist(string))),
            charactersInvolved(array of objects with keys like name(string), age(string), backstory(string), role(string), clothDescription(string), habits(string), innerConflict(string), antagonistForce(string), gender(string), relevanceToAudience(string), motivations(array), skinTone(string), height(string), weight(string), hairTexture(string), hairLength(string), hairQuirk(string), facialHair(string), facialFeatures(string), motivations(array), characterTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string) & relationshipToProtagonists(array of object with keys like protagonistName(string) & relationship(string)) )
            protagonistGoal(string, this refers to the answer to the question, What is the protagonist's new goal or desire?),            
            protagonistTriggerToAction(string, this refers to the answer to the question, What triggers the protagonist to take action?),            
            obstaclesProtagonistWillFace(string, this refers to the answer to the question, What obstacles or challenges will the protagonist face?),            
            tone(array of strings),
            setting(array of strings).                        
            Please ensure the only keys in the object are summary, scenes, charactersInvolved, protagonistGoal, protagonistTriggerToAction, obstaclesProtagonistWillFace, tone and setting keys only.
            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                               

            charactersInvolved refers to the characters involved in the inciting incident.

            **INPUT**
            Story Introduction {introduceProtagonistAndOrdinaryWorld}
            Inciting Incident {incitingIncident}
            First Plot Point {firstPlotPoint}
            Story Idea {storyIdea}
            `;

            showPageLoader();

            const payload = {
                introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
                incitingIncident: initialStory?.storyStructure?.incitingIncident,
                firstPlotPoint: firstPlotPoint,
                storyIdea: projectDescription,
            }
            let res = await makeChapterAnalysisRequest(3, prompt, payload);
            
            let response = res?.data;
            
            // const parser = new JsonOutputParser<FirstPlotPointChapterAnalysis>();

            // const response = await queryStructuredLLM(prompt, {
            //     introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
            //     incitingIncident: initialStory?.storyStructure?.incitingIncident,
            //     firstPlotPoint: firstPlotPoint,
            //     storyIdea: projectDescription,
            // }, parser);

            if (!response) {
                toast.error("Try again please");
                return;
            }        

            setProtagonistGoal(response?.protagonistGoal ?? "");
            setProtagonistTriggerToAction(response?.protagonistTriggerToAction ?? "");
            setObstaclesProtagonistWillFace(response?.obstaclesProtagonistWillFace ?? "");
            setFirstPlotPointCharacters(response?.charactersInvolved ?? "")
            setFirstPlotPointSetting(response?.setting ?? "");
            setFirstPlotPointTone(response?.tone ?? "");

            let saved = await saveAnalysis(response);
            
            if (showModal) setModifyModalOpen(true);

        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const analyzeStory2 = async (showModal = true) => {
        const data = firstPlotPoint 
        if (!data) {
            toast.error('Generate some content first')
            return;
        }

        try {
            const llm = modelInstance();
                      
            const introductionChain = await getIntroductionSummary(llm);         
            const incitingIncidentChain = await getIncitingIncidentSummary(llm);
            const firstPlotPointChain = await getFirstPlotPointAnalysis(llm);

            showPageLoader();

            const chain = RunnableSequence.from([
                {
                    introductionSummary: introductionChain,
                    original_input: new RunnablePassthrough(),
                    incitingIncident: (val) => val.incitingIncident,
                    storyIdea: (val) => val.storyIdea,
                },
                {
                    incitingIncidentSummary: incitingIncidentChain,
                    incitingIncident: ({ original_input }) => original_input.incitingIncident,
                    firstPlotPoint: ({ original_input }) => original_input.firstPlotPoint,
                    storyIdea: ({ original_input }) => original_input.storyIdea,
                },
                firstPlotPointChain
            ]);

            const response = await chain.invoke({
                introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
                incitingIncident: initialStory?.storyStructure?.incitingIncident,
                firstPlotPoint,
                storyIdea: projectDescription,
            });

            console.log(response);

            if (!response) {
                toast.error("Try again please");
                return;
            }        

            setProtagonistGoal(response?.protagonistGoal ?? "");
            setProtagonistTriggerToAction(response?.protagonistTriggerToAction ?? "");
            setObstaclesProtagonistWillFace(response?.obstaclesProtagonistWillFace ?? "");
            setFirstPlotPointCharacters(response?.charactersInvolved ?? "")
            setFirstPlotPointSetting(response?.setting ?? "");
            setFirstPlotPointTone(response?.tone ?? "");

            let saved = await saveAnalysis(response);
            
            if (showModal)  setModifyModalOpen(true);            

        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const saveGeneration = async (data: string) => {
        if (data) {                
            // const updated = await axiosInterceptorInstance.put(`/stories/structure/${initialStory?.id}`, 
            const updated = await axiosInterceptorInstance.put(`${process.env.NEXT_PUBLIC_BASE_URL}/chapters/chapter-three/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    firstPlotPoint: data,
                    firstPlotPointLocked: true
                }
            );
        }
    }

    const saveAnalysis = async (payload) => {
        if (payload) {  
            const suggestedCharacters = setSupportingCharacters();
            // console.log({suggestedCharacters});
            // return;

            // save data
            // const updated = await axiosInterceptorInstance.put(`/stories/build-from-scratch/${initialStory?.id}`, 
            const updated = await axiosInterceptorInstance.put(`${process.env.NEXT_PUBLIC_BASE_URL}/chapters/chapter-three/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    protagonistGoal: payload?.protagonistGoal,                    
                    protagonistTriggerToAction: payload?.protagonistTriggerToAction,                    
                    obstaclesProtagonistWillFace: payload?.obstaclesProtagonistWillFace,                    
                    firstPlotPointCharacters: payload?.charactersInvolved,                                                   
                    firstPlotPointSetting: payload?.setting,                    
                    firstPlotPointTone: payload?.tone,
                    firstPlotPointSummary: payload?.summary,
                    scenes: payload?.scenes,
                    firstPlotPoint,
                    firstPlotPointLocked: true,
                    suggestedCharacters: payload?.charactersInvolved  
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
            // const updated = await axiosInterceptorInstance.put(`/stories/build-from-scratch/${initialStory?.id}`, 
            const updated = await axiosInterceptorInstance.put(`${process.env.NEXT_PUBLIC_BASE_URL}/chapters/chapter-three/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    protagonistGoal,                    
                    protagonistTriggerToAction,                    
                    obstaclesProtagonistWillFace,                    
                    firstPlotPointCharacters,                                                   
                    firstPlotPointSetting,                    
                    firstPlotPointTone,
                    firstPlotPoint,
                    firstPlotPointLocked: true,               
                    firstPlotPointExtraDetails,
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

    const moveToChapter4 = async () => {
        if (!firstPlotPoint) {
            toast.error("Kindly complete the chapter")
            return
        }
        if (!firstPlotPointSummary) {            
            await analyzeStory(false)
        }
        moveToNext(4)
    }

    const setSupportingCharacters = useCallback(() => {        
        const existingCharacterNames = new Set(initialStory.suggestedCharacters.map(char => char.name));        
        const newCharacters = suggestedCharacters.filter(char => !existingCharacterNames.has(char.name));
        const updatedCharacters = [...initialStory.suggestedCharacters, ...newCharacters.map((character: object) => {
            return { ...character, id: uuidv4() }
        })];

        return updatedCharacters;
    }, [initialStory, suggestedCharacters]);

    return (
        <div className="my-10 bg-gray-50 p-5 rounded-2xl">
            <div className='mb-5'>
                <div className="flex justify-between items-center mb-5">
                    <Button size="icon" onClick={() => moveToNext(2)} disabled={generating}>
                        <ArrowLeft />
                    </Button>
                    <p className='font-bold text-center text-2xl'>
                        Chapter 3 
                    </p>
                    <Button size="icon" onClick={moveToChapter4} disabled={generating || !firstPlotPoint}>
                        <ArrowRight />
                    </Button>
                </div>
                <p className='text-xs text-center'>
                A turning point where the protagonist is forced to take action, moving fully into the central conflict                
                {/* This chapter is a turning point where the protagonist decides on a plan. It's a good time for users to increase the stakes and build tension. */}
                </p> 
            </div>

            <textarea 
                disabled={generating}
                rows={5} 
                style={{ overflow: 'hidden' }}
                ref={textareaRef}
                onFocus={(e) => {
                    setFirstPlotPoint(e.target.value);
                    adjustHeight();
                }}
                onChange={(e) => {
                    setFirstPlotPoint(e.target.value);
                    adjustHeight();
                }}
                value={firstPlotPoint} 
                placeholder=''
                className={cn('p-5 mb-4 outline-none border text-md whitespace-pre-wrap rounded-lg w-full leading-5', inter.className)} 
            />

            <div className="flex justify-between items-center mb-3">
                <Button size="icon" onClick={() => moveToNext(2)} disabled={generating}>
                    <ArrowLeft />
                </Button>
                
                <Button size="icon" onClick={moveToChapter4} disabled={generating || !firstPlotPoint}>
                    <ArrowRight />
                </Button>
            </div>

            <div id='control-buttons' className='grid grid-cols-3 gap-4'>
                
                {
                    <Button 
                    className='flex items-center gap-2'
                    disabled={generating}                            
                    size="sm" onClick={generateFirstPlotPoint}>
                        Generate
                        {!generating && <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" className='w-4 h-4' viewBox="0 0 96 96" preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0,96) scale(0.1,-0.1)" fill="#FFFFFF" stroke="none">
                                <path d="M693 883 c-29 -86 -40 -99 -97 -123 -75 -30 -74 -54 3 -82 50 -19 55 -24 79 -80 33 -76 56 -76 84 1 19 50 24 55 80 79 76 33 76 56 -1 84 -50 19 -55 24 -79 79 -26 61 -56 79 -69 42z m45 -108 c7 -14 23 -30 37 -37 14 -6 25 -14 25 -18 0 -4 -11 -12 -25 -18 -14 -7 -30 -23 -37 -37 -14 -31 -22 -31 -36 0 -7 14 -23 30 -37 37 -14 6 -25 14 -25 18 0 4 11 12 25 18 14 7 30 23 37 37 6 14 14 25 18 25 4 0 12 -11 18 -25z"/>
                                <path d="M243 740 c-82 -9 -126 -31 -155 -78 -46 -75 -47 -444 -2 -522 42 -70 128 -90 394 -90 267 0 352 20 394 91 23 39 43 253 32 342 -7 52 -10 58 -29 55 -21 -3 -22 -8 -27 -178 -7 -261 9 -250 -370 -250 -385 0 -370 -12 -370 290 0 154 3 199 16 225 23 49 65 65 172 65 103 0 122 5 122 30 0 31 -32 35 -177 20z"/>
                            </g>
                        </svg>}
                        {generating && <i className='bx bx-loader-alt bx-spin text-white text-lg' ></i>}

                    </Button>
                }
                
                {
                <Button size="sm"  
                className='flex items-center gap-2'
                disabled={generating || !firstPlotPoint}
                onClick={() => {
                    if (firstPlotPointSummary) {
                        setModifyModalOpen(true);
                    }else{
                        analyzeStory(true)
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
                disabled={generating || !firstPlotPoint}     
                onClick={lockChapter}       
                size="sm" variant="destructive">
                    Save
                    <Lock className='ml-2 w-3 h-3' />
                </Button>
                }
                
            </div>


            <Sheet open={modifyModalOpen} onOpenChange={setModifyModalOpen}>
                <SheetContent className="overflow-y-scroll z-[100] xs:min-w-[90%] sm:min-w-[96%] md:min-w-[65%] lg:min-w-[65%] xl:min-w-[55%]">
                    <SheetHeader className=''>
                        <SheetTitle>Edit Chapter</SheetTitle>
                        <SheetDescription> </SheetDescription>
                    </SheetHeader>

                    <div>
                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">What is the protagonist's new goal or desire?</p> 
                            <textarea                             
                                rows={3} 
                                onFocus={(e) => setProtagonistGoal(e.target.value)}
                                onChange={(e) => setProtagonistGoal(e.target.value)}
                                value={protagonistGoal} 
                                placeholder=''
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">What triggers the protagonist to take action? </p> 
                            <textarea                             
                                rows={3} 
                                onFocus={(e) => setProtagonistTriggerToAction(e.target.value)}
                                onChange={(e) => setProtagonistTriggerToAction(e.target.value)}
                                value={protagonistTriggerToAction} 
                                placeholder=''
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">What challenges will the protagonist face?</p> 
                            <textarea                             
                                rows={3} 
                                onFocus={(e) => setObstaclesProtagonistWillFace(e.target.value)}
                                onChange={(e) => setObstaclesProtagonistWillFace(e.target.value)}
                                value={obstaclesProtagonistWillFace} 
                                placeholder=''
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Setting</p> 
                            <SampleSelect 
                                options={[...firstPlotPointSetting, ...settingDetails?.location]}
                                onChange={(val) => setFirstPlotPointSetting(val)}
                                value={firstPlotPointSetting ?? []}
                            />
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Tone</p> 
                            <SampleSelect 
                                options={[...firstPlotPointTone, ...storyTones]}
                                onChange={(val) => setFirstPlotPointTone(val)}
                                value={firstPlotPointTone ?? []}
                            />
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Add extra details for customization</p> 
                            <textarea                             
                                rows={3} 
                                onFocus={(e) => setFirstPlotPointExtraDetails(e.target.value)}
                                onChange={(e) => setFirstPlotPointExtraDetails(e.target.value)}
                                value={firstPlotPointExtraDetails} 
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
                        <div className="grid grid-cols-2 gap-5 mt-5">

                            <Button disabled={generating} 
                                onClick={regenerateFirstPlotPoint}
                                size="lg" 
                                className='border w-full bg-custom_green text-white hover:bg-custom_green hover:text-white'>
                                Regenerate
                                <Cog className='ml-2'/>
                            </Button>
                            <Button disabled={generating} 
                                onClick={() => analyzeStory(false)}
                                size="lg" 
                                className='w-full '>
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
    );
}

export default FirstPlotPointComponent
