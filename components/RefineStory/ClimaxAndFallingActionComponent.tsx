"use client";

import { StoryInterface } from '@/interfaces/StoryInterface';
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight, Cog, Lock } from 'lucide-react';
import { extractTemplatePrompts, getFirstPlotPointSummary, getIncitingIncidentSummary, getIntroductionSummary, getPinchPointsAndSecondPlotPointSummary, getRisingActionAndMidpointSummary, makeChapterAnalysisRequest, modelInstance, queryLLM, queryStructuredLLM, streamLLMResponse } from '@/services/LlmQueryHelper';
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

import SampleSelect from '../SampleSelect';
import { settingDetails, storyTones } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ClimaxAndFallingActionChapterAnalysis } from '@/interfaces/CreateStoryInterface';

interface Props {
    initialStory: StoryInterface;
    refetch: () => void;
    moveToNext:(step: number) => void;
    projectDescription: string;
}

const inter = Inter({ subsets: ['latin'] });

const ClimaxAndFallingActionComponent: React.FC<Props> = ({
    initialStory,
    refetch,
    moveToNext,
    projectDescription
}) => {  
    const [climaxAndFallingAction, setClimaxAndFallingAction] = useState<string>(initialStory?.storyStructure?.climaxAndFallingAction ?? "");
    const [modifyModalOpen, setModifyModalOpen] = useState<boolean>(false);
    const [generating, setGenerating] = useState<boolean>(false);

    // What is the final confrontation or challenge that the protagonist must face? 
    const [finalChallenge, setFinalChallenge] = useState<string>(initialStory?.finalChallenge ?? "");    
    // How does the protagonist overcome or succumb to the challenge?
    const [challengeOutcome, setChallengeOutcome] = useState<string>(initialStory?.challengeOutcome ?? "");        
    // How do the events of the climax resolve the story's conflicts and provide closure for the characters?
    const [storyResolution, setStoryResolution] = useState<string>(initialStory?.storyResolution ?? "");    

    const [climaxAndFallingActionSummary, setClimaxAndFallingActionSummary] = useState<string>(initialStory?.storyStructure?.climaxAndFallingActionSummary ?? "");        
    const [climaxAndFallingActionCharacters, setClimaxAndFallingActionCharacters] = useState<[]>([]);    
    const [climaxAndFallingActionSetting, setClimaxAndFallingActionSetting] = useState<string[]>(initialStory?.climaxAndFallingActionSetting ?? []);
    const [climaxAndFallingActionTone, setClimaxAndFallingActionTone] = useState<string[]>(initialStory?.climaxAndFallingActionTone ?? []);
    const [climaxAndFallingActionExtraDetails, setClimaxAndFallingActionExtraDetails] = useState<string>(initialStory?.climaxAndFallingActionExtraDetails ?? "");

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        adjustHeight();
    }, [climaxAndFallingAction]);

    useEffect(() => {
        setClimaxAndFallingActionSummary(initialStory?.storyStructure?.climaxAndFallingActionSummary ?? "");
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

    const generateClimaxAndFallingAction2 = async () => {
        let { genrePrompt, protagonistSuggestionsPrompt, tonePrompt, settingPrompt } = extractTemplatePrompts(initialStory);

        try {            
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                

            **CONTEXT**
            The following sections of the story have already been generated:
            - The introduction (Chapter 1): {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident (Chapter 2): {incitingIncident}
            - First Plot Point (Chapter 3): {firstPlotPoint}
            - Rising Action & Midpoint (Chapter 4): {risingActionAndMidpoint}
            - Pinch Points & Second Plot Point (Chapter 5): {pinchPointsAndSecondPlotPoint}

            You are going to generate the Climax and Falling Action chapter of the story by continuing from where the Pinch Points & Second Plot Point.
            When crafting the Climax and Falling Action, ensure the story answers the following questions:
            - What is the final confrontation or challenge that the protagonist must face? 
            - How does the protagonist overcome or succumb to the challenge?
            - How do the events of the climax resolve the story's conflicts and provide closure for the characters?

            **OUTPUT**
            - Generate the *Climax and Falling Action*. 
            - The scene should be emotionally impactful, genre-appropriate, and aligned with the protagonist’s motivations. 
            - Use vivid descriptions and dialogue when necessary. 
            - Ensure the transition from the Pinch Points & Second Plot Point to the Climax and Falling Action is smooth.
            - Maintain the genre and tone.
            - Length: At least 500 words.
            - No titles or additional commentary, just the story.
            - Ensure the story continues to relate the story idea.
            Note: Do not include a title or subtitles while generating the story, we are only focused on the story. Do not add any title, subtitle or anything describing an act.
            Do not repeat any story incident or story line in any of the chapters written before, because we don't want the story to look generic.

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
                        firstPlotPoint: initialStory?.storyStructure?.firstPlotPoint,     
                        risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpoint,   
                        pinchPointsAndSecondPlotPoint: initialStory?.storyStructure?.pinchPointsAndSecondPlotPoint,
                    },
                }),
            });

            if (!response?.body) {
                setGenerating(false);   
                toast.error("Try again please");
                return;
            }
            
            let chapter = ``;

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;
    
            setClimaxAndFallingAction("");

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunk = decoder.decode(value);
                chapter += chunk;   
                setClimaxAndFallingAction(chapter);
            }

            scrollToBottom();

            await saveGeneration(chapter);


            // const response = await streamLLMResponse(prompt, {
            //     storyIdea: projectDescription,
            //     genre: genrePrompt,
            //     tones: tonePrompt,
            //     setting: settingPrompt,
            //     protagonists: protagonistSuggestionsPrompt,
            //     introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
            //     incitingIncident: initialStory?.storyStructure?.incitingIncident,                
            //     firstPlotPoint: initialStory?.storyStructure?.firstPlotPoint,     
            //     risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpoint,   
            //     pinchPointsAndSecondPlotPoint: initialStory?.storyStructure?.pinchPointsAndSecondPlotPoint,                     
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
            //     setClimaxAndFallingAction(chapter);         
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

    const generateClimaxAndFallingAction = async () => {
        let { genrePrompt, protagonistSuggestionsPrompt, tonePrompt, settingPrompt } = extractTemplatePrompts(initialStory);

        try {                  
            const llm = modelInstance();

            const introductionChain = await getIntroductionSummary(llm);         
            const incitingIncidentChain = await getIncitingIncidentSummary(llm);
            const firstPlotPointChain = await getFirstPlotPointSummary(llm);
            const risingActionAndMidpointChain = await getRisingActionAndMidpointSummary(llm);
            const pinchPointsAndSecondPlotPointChain = await getPinchPointsAndSecondPlotPointSummary(llm);

            const climaxAndFallingActionTemplate = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                

            **CONTEXT**
            The following sections of the story have already been generated:
            - The introduction (Chapter 1): {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident (Chapter 2): {incitingIncident}
            - First Plot Point (Chapter 3): {firstPlotPoint}
            - Rising Action & Midpoint (Chapter 4): {risingActionAndMidpoint}
            - Pinch Points & Second Plot Point (Chapter 5): {pinchPointsAndSecondPlotPoint}

            You are going to generate the Climax and Falling Action chapter of the story by continuing from where the Pinch Points & Second Plot Point.
            When crafting the Climax and Falling Action, ensure the story answers the following questions:
            - What is the final confrontation or challenge that the protagonist must face? 
            - How does the protagonist overcome or succumb to the challenge?
            - How do the events of the climax resolve the story's conflicts and provide closure for the characters?

            **OUTPUT**
            - Generate the *Climax and Falling Action*. 
            - The scene should be emotionally impactful, genre-appropriate, and aligned with the protagonist’s motivations. 
            - Use vivid descriptions and dialogue when necessary. 
            - Ensure the transition from the Pinch Points & Second Plot Point to the Climax and Falling Action is smooth.
            - Maintain the genre and tone.
            - Length: At least 500 words.
            - No titles or additional commentary, just the story.
            - Ensure the story continues to relate the story idea.
            Note: Do not include a title or subtitles while generating the story, we are only focused on the story. Do not add any title, subtitle or anything describing an act.
            Do not repeat any story incident or story line in any of the chapters written before, because we don't want the story to look generic.

            **INPUT**
            story idea {storyIdea}
            Protagonists: {protagonists}
            Tone: {tones}
            Setting: {setting}
            Genre: {genre}            
            `;
            const climaxAndFallingActionPrompt = PromptTemplate.fromTemplate(climaxAndFallingActionTemplate)            
            const climaxAndFallingActionChain = RunnableSequence.from([climaxAndFallingActionPrompt, llm, new StringOutputParser()])
            
            const chain = RunnableSequence.from([
                {
                    introductionSummary: introductionChain,
                    data: (value) => value,    
                    original_input: new RunnablePassthrough(),
                    incitingIncident: (val) => val.incitingIncident,
                    storyIdea: (val) => val.storyIdea,
                    pinchPointsAndSecondPlotPoint: (val) => val.pinchPointsAndSecondPlotPoint,
                },
                {
                    incitingIncidentSummary: incitingIncidentChain,
                    data2: (value) => value,    
                    original_input: new RunnablePassthrough(),
                    genre: ({ original_input }) => original_input.genre,
                    setting: ({ original_input }) => original_input.setting,
                    tones: ({ original_input }) => original_input.tones,
                    incitingIncident: ({ original_input }) => original_input.incitingIncident,
                    firstPlotPoint: ({ original_input }) => original_input.firstPlotPoint,
                    storyIdea: ({ original_input }) => original_input.storyIdea,
                },
                {
                    firstPlotPointSummary: firstPlotPointChain,
                    data3: (value) => value,    
                    original_input: new RunnablePassthrough(),
                    incitingIncident: (val) => val.incitingIncident,
                    firstPlotPoint: (val) => val.firstPlotPoint,
                    genre: (val) => val.genre,
                    setting: (val) => val.setting,
                    tones: (val) => val.tones,
                    risingActionAndMidpoint: ({ original_input }) => original_input.risingActionAndMidpoint,
                    pinchPointsAndSecondPlotPoint: ({ original_input }) => original_input.pinchPointsAndSecondPlotPoint,
                    storyIdea: (val) => val.storyIdea,
                },
                {
                    risingActionAndMidpointSummary: risingActionAndMidpointChain,
                    data4: (value) => value,    
                    storyIdea: (val) => val.storyIdea,
                    pinchPointsAndSecondPlotPoint: ({ original_input }) => original_input.pinchPointsAndSecondPlotPoint,
                },
                {
                    // pinchPointsAndSecondPlotPointSummary: pinchPointsAndSecondPlotPointChain,
                    pinchPointsAndSecondPlotPoint: pinchPointsAndSecondPlotPointChain,
                    storyIdea: (val) => val.storyIdea,
                    genre: (val) => val.genre,
                    setting: (val) => val.setting,
                    tones: (val) => val.tones,
                    introduceProtagonistAndOrdinaryWorld: ({ data4 }) => data4.data3.data2.introductionSummary,
                    incitingIncident: ({ data4 }) => data4.data3.incitingIncidentSummary,
                    firstPlotPoint: ({ data4 }) => data4.firstPlotPointSummary,
                    risingActionAndMidpoint: (value) => value.risingActionAndMidpointSummary,
                    protagonists: ({ data4 }) => data4.data3.data2.data.protagonists,                    
                },
                climaxAndFallingActionChain
            ]);

            setGenerating(true);

            const response = await chain.invoke({
                storyIdea: projectDescription,
                genre: genrePrompt,
                tones: initialStory?.introductionTone?.join(', '),
                setting: initialStory?.introductionSetting?.join(', '),
                protagonists: protagonistSuggestionsPrompt,
                introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
                incitingIncident: initialStory?.storyStructure?.incitingIncident,
                firstPlotPoint: initialStory?.storyStructure?.firstPlotPoint,
                risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpoint,
                pinchPointsAndSecondPlotPoint: initialStory?.storyStructure?.pinchPointsAndSecondPlotPoint,
            });

            if (!response) {
                setGenerating(false);   
                toast.error("Try again please");
                return;
            }

            scrollToBottom();   
            let chapter = ``;
            for await (const chunk of response) {
                // scrollToBottom()
                chapter += chunk;   
                setClimaxAndFallingAction(chapter);         
            }
            
            scrollToBottom();
            await saveGeneration(chapter)

        } catch (error) {
            console.error(error);            
        }finally{
            setGenerating(false);
        }
    }
    
    const regenerateClimaxAndFallingAction = async () => {
        let { genrePrompt, protagonistSuggestionsPrompt } = extractTemplatePrompts(initialStory);
        
        try {
            const prompt = `
            You are a skilled storyteller known for crafting immersive narratives, deep characters, and vivid worlds. Your writing is creative, engaging, and detail-oriented. 

            The following story sections have already been generated:
            - Introduction: {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident: {incitingIncident}
            - First Plot Point: {firstPlotPoint}
            - Rising Action & Midpoint: {risingActionAndMidpoint}
            - Pinch Points & Second Plot Point: {pinchPointsAndSecondPlotPoint}
            - Climax and Falling Action: {climaxAndFallingAction}

            Your task is to **rewrite the Climax and Falling Action**, starting from where the Pinch Points & Second Plot Point ends. Focus on the following:

            - The final challenge the protagonist faces: {finalChallenge}
            - How the protagonist overcomes or succumbs to the challenge: {challengeOutcome}
            - How the climax resolves the story’s conflicts and provides closure: {storyResolution}
            - Setting: {setting}
            - Tone: {tone}
            - Extra details: {extraDetails}

            **Key Requirements**:
            - Ensure consistency with the protagonist, setting, tone, and genre.
            - Align with the original story idea: {storyIdea}

            **Note**: Focus only on the narrative, without including titles, subtitles, or act labels.
            Do not repeat any story incident or story line in any of the chapters written before, because we don't want the story to look generic.

            **INPUT**
            - Genre: {genre}
            - Story Idea: {storyIdea}
            - Protagonist: {protagonist}
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
                        firstPlotPoint: initialStory?.storyStructure?.firstPlotPoint,
                        risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpoint,
                        pinchPointsAndSecondPlotPoint: initialStory?.storyStructure?.pinchPointsAndSecondPlotPoint,
                        climaxAndFallingAction,
                        finalChallenge,
                        challengeOutcome,
                        storyResolution,
                        setting: climaxAndFallingActionSetting.join(", "),
                        tone: climaxAndFallingActionTone.join(", "),
                        extraDetails: climaxAndFallingActionExtraDetails,
                        genre: genrePrompt, 
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
    
            setClimaxAndFallingAction('')
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunk = decoder.decode(value);
                text += chunk;   
                setClimaxAndFallingAction(text);
            }
            scrollToBottom();

            // const response = await streamLLMResponse(prompt, {
            //     storyIdea: projectDescription,
            //     introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
            //     incitingIncident: initialStory?.storyStructure?.incitingIncident,
            //     firstPlotPoint: initialStory?.storyStructure?.firstPlotPoint,
            //     risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpoint,
            //     pinchPointsAndSecondPlotPoint: initialStory?.storyStructure?.pinchPointsAndSecondPlotPoint,
            //     climaxAndFallingAction,
            //     finalChallenge,
            //     challengeOutcome,
            //     storyResolution,
            //     setting: climaxAndFallingActionSetting.join(", "),
            //     tone: climaxAndFallingActionTone.join(", "),
            //     extraDetails: climaxAndFallingActionExtraDetails,
            //     genre: genrePrompt, 
            //     protagonist: protagonistSuggestionsPrompt
            // });

            // if (!response) {
            //     setGenerating(false);
            //     toast.error("Try again please");
            //     return;
            // }
    
            // scrollToBottom();
            // let text = ``;
            // setClimaxAndFallingAction('')
            // for await (const chunk of response) {
            //     text += chunk;   
            //     setClimaxAndFallingAction(text);    
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
        const data = climaxAndFallingAction
        if (!data) {
            toast.error('Generate some content first')
            return;
        }

        try {
            // const prompt = `
            // You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                
            // We have currently generated the Climax and Falling Action section of the story. 
            // I need you analyze the generated Climax and Falling Action and give an analysis of the characters involved in the story, tone, genre, setting, and Characters involved.
            // I need you to also analyze the generated Climax and Falling Action and the answer following questions:
            // - What is the final confrontation or challenge that the protagonist must face? 
            // - How does the protagonist overcome or succumb to the challenge?
            // - How do the events of the climax resolve the story's conflicts and provide closure for the characters?
            
            // **CONTEXT**
            // Here is the Climax and Falling Action: {climaxAndFallingAction}.
            // The following sections of the story have already been generated:
            // - The introduction to the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}
            // - Inciting Incident: {incitingIncident}
            // - First Plot Point: {firstPlotPoint}
            // - Rising Action & Midpoint: {risingActionAndMidpoint}
            // - Pinch Points & Second Plot Point: {pinchPointsAndSecondPlotPoint}
            // - Climax and Falling Action: {climaxAndFallingAction}

            // Return your response in a json or javascript object format like: 
            // summary(string, this is a summary of the events in the Climax and Falling Action section of the story, ensure the summary contains all the events sequentially including the last events leading to the next chapter),
            // finalChallenge(string, this refers to the answer to the question, What is the final confrontation or challenge that the protagonist must face?),            
            // challengeOutcome(string, this refers to the answer to the question, How does the protagonist overcome or succumb to the challenge?),            
            // storyResolution(string, this refers to the answer to the question, How do the events of the climax resolve the story's conflicts and provide closure for the characters?),            
            // tone(array of strings),
            // setting(array of strings).                        
            // Please ensure the only keys in the object are summary, finalChallenge, challengeOutcome, storyResolution, tone and setting keys only.
            // Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                               

            // Ensure the summary contains all the events step by step as they occurred and the summary must also contain the characters and the impacts they have had on each other.

            // **INPUT**
            // Climax and Falling Action: {climaxAndFallingAction}
            // story idea {storyIdea}
            // `;
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                
            We have currently generated the Climax and Falling Action section of the story. 
            I need you analyze the generated Climax and Falling Action and give an analysis of the characters involved in the story, tone, genre, setting, and Characters involved.
            I need you to also analyze the generated Climax and Falling Action and the answer following questions:
            - What is the final confrontation or challenge that the protagonist must face? 
            - How does the protagonist overcome or succumb to the challenge?
            - How do the events of the climax resolve the story's conflicts and provide closure for the characters?
            
            **CONTEXT**
            Here is the Climax and Falling Action: {climaxAndFallingAction}.
            The following sections of the story have already been generated:
            - The introduction to the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}
            - Climax and Falling Action: {climaxAndFallingAction}

            Return your response in a json or javascript object format like: 
            summary(string, this is a summary of the events in the Climax and Falling Action section of the story, ensure the summary contains all the events sequentially including the last events leading to the next chapter),
            scenes(array of objects with keys like title(string), setting(string), description(string: make this very descriptive &detailed for whats happening a scene), order(number, this is the order in which the scene occurs) charactersInvolved(array of objects with keys like name(string), roleInScene(string), relationshipToProtagonist(string))),
            finalChallenge(string, this refers to the answer to the question, What is the final confrontation or challenge that the protagonist must face?),            
            challengeOutcome(string, this refers to the answer to the question, How does the protagonist overcome or succumb to the challenge?),            
            charactersInvolved(array of objects with keys name(string), backstory(string), role(string) & relationshipToProtagonist(string). These are the characters involved in the rising action & midpoint),
            storyResolution(string, this refers to the answer to the question, How do the events of the climax resolve the story's conflicts and provide closure for the characters?),            
            tone(array of strings),
            setting(array of strings).                        
            Please ensure the only keys in the object are summary, scenes, finalChallenge, challengeOutcome, storyResolution, tone and setting keys only.
            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                               

            Ensure the summary contains all the events step by step as they occurred and the summary must also contain the characters and the impacts they have had on each other.

            **INPUT**
            Climax and Falling Action: {climaxAndFallingAction}
            story idea {storyIdea}
            `;
            // charactersInvolved(array of objects with keys name(string), backstory(string), role(string) & relationshipToProtagonist(string). These are the characters involved in the inciting incident),            

            showPageLoader();

            // const parser = new JsonOutputParser<ClimaxAndFallingActionChapterAnalysis>();

            const payload = {
                climaxAndFallingAction: data,
                storyIdea: projectDescription,
                introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introductionSummary,
            }
            let res = await makeChapterAnalysisRequest(6, prompt, payload);            
            let response = res?.data;            

            // const response = await queryStructuredLLM(prompt, {
            //     introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introductionSummary,
            //     // incitingIncident: initialStory?.storyStructure?.incitingIncidentSummary,
            //     // firstPlotPoint: initialStory?.storyStructure?.firstPlotPointSummary,
            //     // risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpointSummary,
            //     // pinchPointsAndSecondPlotPoint: initialStory?.storyStructure?.pinchPointsAndSecondPlotPointSummary,
            //     climaxAndFallingAction: data,
            //     storyIdea: projectDescription,
            // }, parser);

            if (!response) {
                toast.error("Try again please");
                return;
            }        

            setFinalChallenge(response?.finalChallenge ?? "");
            setChallengeOutcome(response?.challengeOutcome ?? "");
            setStoryResolution(response?.storyResolution ?? "");
            setClimaxAndFallingActionSetting(response?.setting ?? "");
            setClimaxAndFallingActionTone(response?.tone ?? "");
            setClimaxAndFallingActionCharacters(response?.charactersInvolved ?? "");

            let saved = await saveAnalysis(response);
            
            if(showModal) setModifyModalOpen(true);

        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    // const analyzeStory2 = async (showModal = true) => {
    //     const data = climaxAndFallingAction
    //     if (!data) {
    //         toast.error('Generate some content first')
    //         return;
    //     }

    //     try {

    //         const prompt = `
    //         You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                
    //         We have currently generated the Climax and Falling Action section of the story. 
    //         I need you analyze the generated Climax and Falling Action and give an analysis of the characters involved in the story, tone, genre, setting, and Characters involved.
    //         I need you to also analyze the generated Climax and Falling Action and the answer following questions:
    //         - What is the final confrontation or challenge that the protagonist must face? 
    //         - How does the protagonist overcome or succumb to the challenge?
    //         - How do the events of the climax resolve the story's conflicts and provide closure for the characters?
            
    //         **CONTEXT**
    //         Here is the Climax and Falling Action: {climaxAndFallingAction}.
    //         The following sections of the story have already been generated:
    //         - The introduction to the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}
    //         - Inciting Incident: {incitingIncident}
    //         - First Plot Point: {firstPlotPoint}
    //         - Rising Action & Midpoint: {risingActionAndMidpoint}
    //         - Pinch Points & Second Plot Point: {pinchPointsAndSecondPlotPoint}
    //         - Climax and Falling Action: {climaxAndFallingAction}

    //         Return your response in a json or javascript object format like: 
    //         summary(string, a summary of the story soo far),
    //         finalChallenge(string, this refers to the answer to the question, What is the final confrontation or challenge that the protagonist must face?),            
    //         challengeOutcome(string, this refers to the answer to the question, How does the protagonist overcome or succumb to the challenge?),            
    //         storyResolution(string, this refers to the answer to the question, How do the events of the climax resolve the story's conflicts and provide closure for the characters?),            
    //         tone(array of strings),
    //         setting(array of strings).                        
    //         Please ensure the only keys in the object are summary, finalChallenge, challengeOutcome, storyResolution, tone and setting keys only.
    //         Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                               

    //         **INPUT**
    //         Rising Action & Midpoint {risingActionAndMidpoint}
    //         story idea {storyIdea}
    //         `;

    //         showPageLoader();

    //         const llm = modelInstance();

    //         const introductionChain = await getIntroductionSummary(llm);         
    //         const incitingIncidentChain = await getIncitingIncidentSummary(llm);
    //         const firstPlotPointChain = await getFirstPlotPointSummary(llm);
    //         const risingActionAndMidpointChain = await getRisingActionAndMidpointSummary(llm);
    //         const pinchPointsAndSecondPlotPointChain = await getPinchPointsAndSecondPlotPointAnalysis(llm);
            

    //         // if (!response) {
    //         //     toast.error("Try again please");
    //         //     return;
    //         // }        

    //         // setFinalChallenge(response?.finalChallenge ?? "");
    //         // setChallengeOutcome(response?.challengeOutcome ?? "");
    //         // setStoryResolution(response?.storyResolution ?? "");
    //         // setClimaxAndFallingActionSetting(response?.setting ?? "");
    //         // setClimaxAndFallingActionTone(response?.tone ?? "");
    //         // // setClimaxAndFallingActionCharacters(response?.charactersInvolved ?? "");

    //         // let saved = await saveAnalysis(response);
            
    //         // if(showModal) setModifyModalOpen(true);

    //     } catch (error) {
    //         console.error(error);            
    //     }finally{
    //         hidePageLoader()
    //     }
    // }

    const saveAnalysis = async (payload: {
        finalChallenge: string,
        challengeOutcome: string,
        storyResolution: string,
        setting: string[],
        charactersInvolved: any[],
        scenes: any[],
        tone: string[],
        summary: string,
    }) => {
        if (payload) {                
            // save data
            // const updated = await axiosInterceptorInstance.put(`/stories/build-from-scratch/${initialStory?.id}`, 
            const updated = await axiosInterceptorInstance.put(`/chapters/chapter-six/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    finalChallenge: payload?.finalChallenge,
                    challengeOutcome: payload?.challengeOutcome,
                    storyResolution: payload?.storyResolution,
                    climaxAndFallingActionSetting: payload?.setting,
                    climaxAndFallingActionTone: payload?.tone,
                    climaxAndFallingActionSummary: payload?.summary,
                    scenes: payload?.scenes,
                    climaxAndFallingAction,
                    climaxAndFallingActionCharacters: payload?.charactersInvolved,    
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
            const updated = await axiosInterceptorInstance.put(`/chapters/chapter-six/${initialStory?.id}`,             
                {
                    storyId: initialStory?.id,
                    finalChallenge,
                    // climaxAndFallingActionCharacters,
                    challengeOutcome,
                    storyResolution,
                    climaxAndFallingActionSetting,
                    climaxAndFallingActionTone,
                    climaxAndFallingAction,
                    climaxAndFallingActionExtraDetails,
                    climaxAndFallingActionLocked: true,   
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
            // const updated = await axiosInterceptorInstance.put(`/stories/structure/${initialStory?.id}`, 
            const updated = await axiosInterceptorInstance.put(`/chapters/chapter-six/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    climaxAndFallingAction: data,
                    climaxAndFallingActionLocked: true
                }
            );
        }
    }

    const moveToChapter7 = async () => {
        if (!climaxAndFallingActionSummary) {            
            await analyzeStory(false)
        }
        moveToNext(7)
    }

    return (
        <div className="my-10 bg-gray-50 p-5 rounded-2xl">
            <div className='mb-5'>
                <div className="flex justify-between items-center mb-5">
                    <Button size="icon" onClick={() => moveToNext(5)} disabled={generating}>
                        <ArrowLeft />
                    </Button>
                    <p className='font-bold text-center text-2xl'>
                        Chapter 6
                    </p>
                    <Button size="icon" onClick={moveToChapter7} disabled={generating || !climaxAndFallingAction}>
                        <ArrowRight />
                    </Button>
                </div>
                <p className='text-xs text-center'>
                This chapter marks the most intense and dramatic moment of the story, followed by the aftermath of that moment                
                </p> 
            </div>

            <textarea 
                disabled={generating}
                rows={5} 
                style={{ overflow: 'hidden' }}
                ref={textareaRef}
                onFocus={(e) => {
                    setClimaxAndFallingAction(e.target.value);
                    adjustHeight();
                }}
                onChange={(e) => {
                    setClimaxAndFallingAction(e.target.value);
                    adjustHeight();
                }}
                value={climaxAndFallingAction} 
                placeholder=''
                className={cn('p-5 mb-4 outline-none border text-md whitespace-pre-wrap rounded-lg w-full leading-5', inter.className)} 
            />

            <div className="flex justify-between items-center mb-3">
                <Button size="icon" onClick={() => moveToNext(5)} disabled={generating}>
                    <ArrowLeft />
                </Button>

                <Button size="icon" onClick={moveToChapter7} disabled={generating || !climaxAndFallingAction}>
                    <ArrowRight />
                </Button>
            </div>
            <div id='control-buttons' className='grid grid-cols-3 gap-4'> 
                
                {
                    <Button 
                    className='flex items-center gap-2'
                    disabled={generating}                            
                    size="sm" onClick={generateClimaxAndFallingAction2}>
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
                disabled={generating || !climaxAndFallingAction}
                onClick={() => {
                    if (climaxAndFallingActionSummary) {
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
                className='s'                
                disabled={generating || !climaxAndFallingAction}     
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
                            <p className="font-semibold mb-3 text-xs">What is the final challenge that the protagonist must face?</p> 
                            <textarea                             
                                rows={8} 
                                onFocus={(e) => setFinalChallenge(e.target.value)}
                                onChange={(e) => setFinalChallenge(e.target.value)}
                                value={finalChallenge} 
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">How does the protagonist overcome or succumb to the challenge?</p> 
                            <textarea                             
                                rows={8} 
                                onFocus={(e) => setChallengeOutcome(e.target.value)}
                                onChange={(e) => setChallengeOutcome(e.target.value)}
                                value={challengeOutcome} 
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">How do the events of the climax resolve the story's conflicts and provide closure for the characters?</p> 
                            <textarea                             
                                rows={8} 
                                onFocus={(e) => setStoryResolution(e.target.value)}
                                onChange={(e) => setStoryResolution(e.target.value)}
                                value={storyResolution} 
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Setting</p> 
                            <SampleSelect 
                                options={[...climaxAndFallingActionSetting, ...settingDetails?.location]}
                                onChange={(val) => setClimaxAndFallingActionSetting(val)}
                                value={climaxAndFallingActionSetting ?? []}
                            />
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Tone</p> 
                            <SampleSelect 
                                options={[...climaxAndFallingActionTone, ...storyTones]}
                                onChange={(val) => setClimaxAndFallingActionTone(val)}
                                value={climaxAndFallingActionTone ?? []}
                            />
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Add extra details for customization</p> 
                            <textarea                             
                                rows={5} 
                                onFocus={(e) => setClimaxAndFallingActionExtraDetails(e.target.value)}
                                onChange={(e) => setClimaxAndFallingActionExtraDetails(e.target.value)}
                                value={climaxAndFallingActionExtraDetails} 
                                placeholder=''
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className="grid grid-cols-2 gap-5 mt-5">
                            <Button disabled={generating} 
                                onClick={regenerateClimaxAndFallingAction}
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

export default ClimaxAndFallingActionComponent


