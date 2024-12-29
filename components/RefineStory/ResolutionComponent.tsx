"use client";

import { StoryInterface } from '@/interfaces/StoryInterface';
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight, Cog, Lock, NotebookText } from 'lucide-react';
import { extractTemplatePrompts, queryLLM, queryStructuredLLM, streamLLMResponse } from '@/services/LlmQueryHelper';
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
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Dosis, Inter } from 'next/font/google';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ResolutionChapterAnalysis } from '@/interfaces/CreateStoryInterface';

interface ResolutionComponentProps {
    initialStory: StoryInterface;
    refetch: () => void;
    moveToNext:(step: number) => void;
    projectDescription: string;
}

const inter = Inter({ subsets: ['latin'] });

const ResolutionComponent: React.FC<ResolutionComponentProps> = ({
    initialStory,
    refetch,
    moveToNext,
    projectDescription
}) => {  
    const [resolution, setResolution] = useState<string>(initialStory?.storyStructure?.resolution ?? "");
    const [modifyModalOpen, setModifyModalOpen] = useState<boolean>(false);
    const [generating, setGenerating] = useState<boolean>(false);
    
    // What are the consequences of the climax?
    const [climaxConsequences, setClimaxConsequences] = useState<string>(initialStory?.climaxConsequences ?? "");    
    // How do the characters evolve or change?
    const [howCharactersEvolve, setHowCharactersEvolve] = useState<string>(initialStory?.howCharactersEvolve ?? "");        
    // What is the new status quo or resolution of the conflict?
    const [resolutionOfConflict, setResolutionOfConflict] = useState<string>(initialStory?.resolutionOfConflict ?? "");
            
    const [resolutionSummary, setResolutionSummary] = useState<string>(initialStory?.storyStructure?.resolutionSummary ?? "");    
    const [resolutionCharacters, setResolutionCharacters] = useState<[]>([]);    
    const [resolutionSetting, setResolutionSetting] = useState<string[]>(initialStory?.resolutionSetting ?? []);
    const [resolutionTone, setResolutionTone] = useState<string[]>(initialStory?.resolutionTone ?? []);
    const [resolutionExtraDetails, setResolutionExtraDetails] = useState<string>(initialStory?.resolutionExtraDetails ?? "");

    // const dynamicJwtToken = getAuthToken();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      setResolutionSummary(initialStory?.storyStructure?.resolutionSummary ?? "")
      setClimaxConsequences(initialStory?.climaxConsequences ?? "")
      setHowCharactersEvolve(initialStory?.howCharactersEvolve ?? "")
      setResolutionOfConflict(initialStory?.resolutionOfConflict ?? "")
      setResolutionSetting(initialStory?.resolutionSetting ?? [])
      setResolutionTone(initialStory?.resolutionTone ?? [])
      setResolutionExtraDetails(initialStory?.resolutionExtraDetails ?? "")
    }, [initialStory]);

    useEffect(() => {
        adjustHeight();
    }, [resolution]);
    
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

    const generateResolution = async () => {
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
          - Climax and Falling Action (Chapter 6): {climaxAndFallingAction}

          You are going to generate the Resolution & Epilogue chapter of the story by continuing from where the Climax and Falling Action.
          When crafting the Resolution & Epilogue, ensure the story answers the following questions:
          - What are the consequences of the climax?
          - How do the characters evolve or change?
          - What is the new status quo or resolution of the conflict?
          - Are there any unresolved issues from the character's departure that impact their reentry into the story?
          The Resolution is more focused on the final outcome and conclusion of the story.
          The Epilogue is a short section that comes after the Resolution. It is often used to provide a glimpse into the future or to offer additional context, closure, or reflection on the characters' fates.
          While an Epilogue is not always necessary, an Epilogue can give the reader a sense of what happens to the characters after the main story concludes. It can also be used to tie up any remaining loose threads or set up for a sequel.


          **OUTPUT**
          - Generate the *Resolution & Epilogue*. 
          - The scene should be emotionally impactful, genre-appropriate, and aligned with the protagonist’s motivations. 
          - Use vivid descriptions and dialogue when necessary. 
          - Ensure the transition from the Climax and Falling Action to the Resolution & Epilogue is smooth.
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
          const response = await streamLLMResponse(prompt, {
            storyIdea: projectDescription,
            genre: genrePrompt,
            tones: tonePrompt,
            setting: settingPrompt,
            protagonists: protagonistSuggestionsPrompt,
            introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introductionSummary,
            incitingIncident: initialStory?.storyStructure?.incitingIncidentSummary,                
            firstPlotPoint: initialStory?.storyStructure?.firstPlotPointSummary,     
            risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpointSummary,   
            pinchPointsAndSecondPlotPoint: initialStory?.storyStructure?.pinchPointsAndSecondPlotPointSummary,          
            climaxAndFallingAction: initialStory?.storyStructure?.climaxAndFallingActionSummary,                                     
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
              setResolution(chapter);         
          }
          
          scrollToBottom()
          await saveGeneration(chapter)
          await analyzeStory(chapter)

      } catch (error) {
          console.error(error);            
      }finally{
          setGenerating(false);
      }
    }
    
    const regenerateResolution = async () => {
        let { genrePrompt, protagonistSuggestionsPrompt } = extractTemplatePrompts(initialStory);
        
        try {
            const prompt = `
            You are a skilled storyteller known for crafting immersive narratives, deep characters, and vivid worlds. Your writing is creative, engaging, and detail-oriented. 

            The following story sections have already been generated and here is there summary:
            - Introduction: {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident: {incitingIncident}
            - First Plot Point: {firstPlotPoint}
            - Rising Action & Midpoint: {risingActionAndMidpoint}
            - Pinch Points & Second Plot Point: {pinchPointsAndSecondPlotPoint}
            - Climax and Falling Action: {climaxAndFallingAction}
            - Resolution & Epilogue: {resolution}

            Your task is to **rewrite the **Resolution & Epilogue**, starting from where the Climax and Falling Action ends. Focus on the following:

            - What are the consequences of the climax? {climaxConsequences}
            - How do the characters evolve or change? {howCharactersEvolve}
            - What is the new status quo or resolution of the conflict? {resolutionOfConflict}
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
            const response = await streamLLMResponse(prompt, {
              storyIdea: projectDescription,
              introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introductionSummary,
              incitingIncident: initialStory?.storyStructure?.incitingIncidentSummary,
              firstPlotPoint: initialStory?.storyStructure?.firstPlotPointSummary,
              risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpointSummary,
              pinchPointsAndSecondPlotPoint: initialStory?.storyStructure?.pinchPointsAndSecondPlotPointSummary,
              climaxAndFallingAction: initialStory?.storyStructure?.climaxAndFallingActionSummary,
              resolution,
              climaxConsequences,
              howCharactersEvolve,
              resolutionOfConflict,
              setting: resolutionSetting.join(", "),
              tone: resolutionTone.join(", "),
              extraDetails: resolutionExtraDetails,
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
            setResolution('')
            for await (const chunk of response) {
              text += chunk;   
              setResolution(text);    
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
    
    const analyzeStory = async (chapter = "") => {
      if (!chapter && !resolution) {
        toast.error('Generate some content first')
        return;
      }
      try {


        const prompt = `
        You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                
        We have currently generated the Resolution & Epilogue section of the story. 
        I need you analyze the generated Resolution & Epilogue and give an analysis of the characters involved in the story, tone, genre, setting, and Characters involved.
        I need you to also analyze the generated Resolution & Epilogue and the answer following questions:
        - What are the consequences of the climax?
        - How do the characters evolve or change?
        - What is the new status quo or resolution of the conflict?

        **CONTEXT**
        Here is the Resolution & Epilogue: {resolution}.

        The following sections of the story have already been generated:
        - The introduction to the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}
        - Inciting Incident: {incitingIncident}
        - First Plot Point: {firstPlotPoint}
        - Rising Action & Midpoint: {risingActionAndMidpoint}
        - Pinch Points & Second Plot Point: {pinchPointsAndSecondPlotPoint}
        - Climax and Falling Action: {climaxAndFallingAction}
        - Resolution & Epilogue: {resolution}

        Return your response in a json or javascript object format like: 
        summary(string, this is a summary of the events in the Resolution & Epilogue section of the story, ensure the summary contains all the events sequentially including the last events leading to the next chapter),
        climaxConsequences(string, this refers to the answer to the question, What are the consequences of the climax?),            
        howCharactersEvolve(string, this refers to the answer to the question, How do the characters evolve or change?),            
        resolutionOfConflict(string, this refers to the answer to the question, What is the new status quo or resolution of the conflict?),            
        tone(array of strings),
        setting(array of strings).                        
        Please ensure the only keys in the object are summary, climaxConsequences, howCharactersEvolve, resolutionOfConflict, tone and setting keys only.
        Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                               

        Ensure the summary contains all the events step by step as they occurred and the summary must also contain the characters and the impacts they have had on each other.

        **INPUT**
        Resolution & Epilogue: {resolution}.
        story idea {storyIdea}
        `;
        // charactersInvolved(array of objects with keys name(string), backstory(string), role(string) & relationshipToProtagonist(string). These are the characters involved in the inciting incident),            

        showPageLoader();

        const parser = new JsonOutputParser<ResolutionChapterAnalysis>();

        const response = await queryStructuredLLM(prompt, {
          introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introductionSummary,
          incitingIncident: initialStory?.storyStructure?.incitingIncidentSummary,
          firstPlotPoint: initialStory?.storyStructure?.firstPlotPointSummary,
          risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpointSummary,
          pinchPointsAndSecondPlotPoint: initialStory?.storyStructure?.pinchPointsAndSecondPlotPointSummary,
          climaxAndFallingAction: initialStory?.storyStructure?.climaxAndFallingActionSummary,
          resolution: chapter ?? resolution,
          storyIdea: projectDescription,
        }, parser);

        if (!response) {
            toast.error("Try again please");
            return;
        }        

        setClimaxConsequences(response?.climaxConsequences ?? "");
        setHowCharactersEvolve(response?.howCharactersEvolve ?? "");
        setResolutionOfConflict(response?.resolutionOfConflict ?? "");
        setResolutionSetting(response?.setting ?? "");
        setResolutionTone(response?.tone ?? "");
        // setResolutionCharacters(response?.charactersInvolved ?? "");

        let saved = await saveAnalysis(response);
        
        setModifyModalOpen(true);

      } catch (error) {
          console.error(error);            
      }finally{
          hidePageLoader()
      }
    }

    const saveAnalysis = async (payload) => {
      if (payload) {                
          // save data

        const updated = await axiosInterceptorInstance.put(`/stories/structure/${initialStory?.id}`, 
          {
            storyId: initialStory?.id,
            climaxConsequences: payload?.climaxConsequences,
            howCharactersEvolve: payload?.howCharactersEvolve,
            resolutionOfConflict: payload?.resolutionOfConflict,
            resolutionSetting: payload?.setting,
            resolutionTone: payload?.tone,
            resolutionSummary: payload?.summary,
            resolution,
            // resolutionCharacters: payload?.charactersInvolved,
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
                climaxConsequences,
                howCharactersEvolve,
                resolutionOfConflict,
                // resolutionCharacters,
                resolutionSetting,
                resolutionTone,
                resolution,
                resolutionExtraDetails,
                resolutionLocked: true, 
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
              resolution: data,
              resolutionLocked: true
            }
          );
      }
  }

    return (
        <div className="my-10 bg-gray-50 p-5 rounded-2xl">
          <div className='mb-5'>
            <div className="flex justify-between items-center mb-5">
              <Button size="icon" onClick={() => moveToNext(6)} disabled={generating}>
                <ArrowLeft />
              </Button>
              <p className='font-bold text-center text-2xl'>
                Chapter 7
              </p>
              <Button size="icon" disabled={true}>
                <ArrowRight />
              </Button>
            </div>
            <p className='text-xs text-center'>
            This chapter ties up the story's loose ends and provides closure for the protagonist                
            </p> 
          </div>

            <textarea 
              disabled={generating}
              rows={5} 
              style={{ overflow: 'hidden' }}
              ref={textareaRef}
              onFocus={(e) => {
                setResolution(e.target.value);
                adjustHeight();
              }}
              onChange={(e) => {
                setResolution(e.target.value);
                adjustHeight();
              }}
              value={resolution} 
              placeholder=''
              className={cn('p-5 mb-4 outline-none border text-md whitespace-pre-wrap rounded-lg w-full leading-5', inter.className)} 
              />

          <div className="flex justify-between items-center mb-3">
                <Button size="icon" onClick={() => moveToNext(6)} disabled={generating}>
                    <ArrowLeft />
                </Button>
                
              {resolution && 
                <Link href={`/dashboard/project-summary?story-id=${initialStory?.id}`}>
                    <Button disabled={generating} size="sm" className='bg-custom_green w-full flex items-center gap-2' >
                        Summary
                        <ArrowRight className='w-3 h-3'/>
                    </Button>
                    
                </Link>
              }
                
            </div>

            <div id='control-buttons' className='grid text-xs xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4'>
                
                {
                    <Button 
                    className=' flex items-center gap-2'
                    disabled={generating}                            
                    size="sm" onClick={generateResolution}>
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
                disabled={generating || !resolution}
                onClick={() => {
                    if (resolutionSummary) {
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
                disabled={generating || !resolution}     
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
                        <SheetTitle className='font-semibold'>Edit Chapter</SheetTitle>
                        <SheetDescription> </SheetDescription>
                    </SheetHeader>

                    <div>
                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">What are the consequences of the climax?</p> 
                            <textarea                             
                                rows={10} 
                                onFocus={(e) => setClimaxConsequences(e.target.value)}
                                onChange={(e) => setClimaxConsequences(e.target.value)}
                                value={climaxConsequences} 
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">How do the characters evolve or change?</p> 
                            <textarea                             
                                rows={10} 
                                onFocus={(e) => setHowCharactersEvolve(e.target.value)}
                                onChange={(e) => setHowCharactersEvolve(e.target.value)}
                                value={howCharactersEvolve} 
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">What is the new status quo or resolution of the conflict?</p> 
                            <textarea                             
                                rows={10} 
                                onFocus={(e) => setResolutionOfConflict(e.target.value)}
                                onChange={(e) => setResolutionOfConflict(e.target.value)}
                                value={resolutionOfConflict} 
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Setting</p> 
                            <SampleSelect 
                              options={[...resolutionSetting, ...settingDetails?.location]}
                              onChange={(val) => setResolutionSetting(val)}
                              value={resolutionSetting ?? []}
                            />
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Tone</p> 
                            <SampleSelect 
                              options={[...resolutionTone, ...storyTones]}
                              onChange={(val) => setResolutionTone(val)}
                              value={resolutionTone ?? []}
                            />
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-3 text-xs">Add extra details for customization</p> 
                            <textarea                             
                                rows={5} 
                                onFocus={(e) => setResolutionExtraDetails(e.target.value)}
                                onChange={(e) => setResolutionExtraDetails(e.target.value)}
                                value={resolutionExtraDetails} 
                                placeholder=''
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className="grid grid-cols-2 gap-5 mt-5">
                          <Button disabled={generating} 
                              onClick={regenerateResolution}
                              size="lg" 
                              className='border w-full bg-custom_green text-white hover:bg-custom_green hover:text-white'>
                              Regenerate
                              <Cog className='ml-2'/>
                          </Button>
                          <Button disabled={generating} 
                            onClick={() => analyzeStory()}
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

export default ResolutionComponent
