"use client";

import { StoryInterface } from '@/interfaces/StoryInterface';
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight, Cog, Lock, NotebookText } from 'lucide-react';
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
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Dosis, Inter } from 'next/font/google';

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

    const [resolutionCharacters, setResolutionCharacters] = useState<[]>([]);    
    const [resolutionSetting, setResolutionSetting] = useState<string[]>(initialStory?.resolutionSetting ?? []);
    const [resolutionTone, setResolutionTone] = useState<string[]>(initialStory?.resolutionTone ?? []);
    const [resolutionExtraDetails, setResolutionExtraDetails] = useState<string>(initialStory?.resolutionExtraDetails ?? "");

    const dynamicJwtToken = getAuthToken();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
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
              pinchPointsAndSecondPlotPoint: initialStory?.storyStructure?.pinchPointsAndSecondPlotPoint,          
              climaxAndFallingAction: initialStory?.storyStructure?.climaxAndFallingAction,                                     
          });

          if (!response) {
              setGenerating(false);   
              toast.error("Try again please");
              return;
          }
          scrollToBottom()
  
          let text = ``;
          for await (const chunk of response) {
              scrollToBottom()
              text += chunk;   
              setResolution(text);         
          }
          
          scrollToBottom()
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

            The following story sections have already been generated:
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

            **INPUT**
            - Genre: {genre}
            - Story Idea: {storyIdea}
            - Protagonist: {protagonist}
            `;
            
            setGenerating(true);
            setModifyModalOpen(false);
            const response = await streamLLMResponse(prompt, {
              storyIdea: projectDescription,
              introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
              incitingIncident: initialStory?.storyStructure?.incitingIncident,
              firstPlotPoint: initialStory?.storyStructure?.firstPlotPoint,
              risingActionAndMidpoint: initialStory?.storyStructure?.risingActionAndMidpoint,
              pinchPointsAndSecondPlotPoint: initialStory?.storyStructure?.pinchPointsAndSecondPlotPoint,
              climaxAndFallingAction: initialStory?.storyStructure?.climaxAndFallingAction,
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
    
    const analyzeStory = async () => {
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
          summary(string, a summary of the story soo far),
          climaxConsequences(string, this refers to the answer to the question, What are the consequences of the climax?),            
          howCharactersEvolve(string, this refers to the answer to the question, How do the characters evolve or change?),            
          resolutionOfConflict(string, this refers to the answer to the question, What is the new status quo or resolution of the conflict?),            
          tone(array of strings),
          setting(array of strings).                        
          Please ensure the only keys in the object are summary, climaxConsequences, howCharactersEvolve, resolutionOfConflict, tone and setting keys only.
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
            pinchPointsAndSecondPlotPoint: initialStory?.storyStructure?.pinchPointsAndSecondPlotPoint,
            climaxAndFallingAction: initialStory?.storyStructure?.climaxAndFallingAction,
            resolution,
            storyIdea: projectDescription,
          });

          if (!response) {
              toast.error("Try again please");
              return;
          }        

          setClimaxConsequences(response?.newObstacles ?? "");
          setHowCharactersEvolve(response?.discoveryChanges ?? "");
          setResolutionOfConflict(response?.howStakesEscalate ?? "");
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
        let updated = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch/${initialStory?.id}`,
          method: "PUT", 
          body: {
            storyId: initialStory?.id,
            climaxConsequences: payload?.climaxConsequences,
            howCharactersEvolve: payload?.howCharactersEvolve,
            resolutionOfConflict: payload?.resolutionOfConflict,
            resolutionSetting: payload?.setting,
            resolutionTone: payload?.tone,
            resolution,
            // resolutionCharacters: payload?.charactersInvolved,
          }, 
          token: dynamicJwtToken,
        });
        console.log(updated);
        if (updated) {
          refetch()
        }
      }
    }

    const lockChapter = async () => {
        try {           
            showPageLoader();
            let updated = await makeRequest({
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch/${initialStory?.id}`,
                method: "PUT", 
                body: {
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
                }, 
                token: dynamicJwtToken,
            });

            if (updated) {
              refetch()
            }
        } catch (error) {
          console.error(error);            
        }finally{
          hidePageLoader();
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

                {/* <div id='control-buttons' className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5'>                    
                    {
                        <Button
                        disabled={generating}                            
                        size="sm" onClick={generateResolution}>Generate</Button>
                    }
                    
                    {
                    (!initialStory?.firstPlotPointLocked || initialStory?.storyStructure?.firstPlotPoint)  &&
                    <Button size="sm"  
                    disabled={!resolution || generating}
                    onClick={() => analyzeStory()}>Analyze</Button>
                    }

                    {
                    initialStory?.genres && 
                    <Button size="sm" onClick={() => setModifyModalOpen(true)}>View Analysis</Button>}
                    
                    {(initialStory?.storyStructure?.pinchPointsAndSecondPlotPoint) && <Button 
                    disabled={generating || initialStory?.firstPlotPointLocked}     
                    onClick={lockChapter}       
                    size="sm" className='bg-red-600'>
                        {initialStory?.resolutionLocked === true ? "Locked" : "Lock"}
                        <Lock className='ml-2 w-3 h-3' />
                    </Button>}                
                    {
                        initialStory?.resolutionLocked === true && 
                        <Link href={`/dashboard/project-summary?story-id=${initialStory?.id}`}>
                            <Button size="sm" className='bg-custom_green w-full' >Publish</Button>
                        </Link>
                    }
                </div> */}

            <div id='control-buttons' className='grid text-xs xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4'>
                
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
                disabled={generating}
                onClick={() => {
                    if (climaxConsequences) {
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
                disabled={generating}     
                onClick={lockChapter}       
                size="sm" variant="destructive">
                    Save
                    <Lock className='ml-2 w-3 h-3' />
                </Button>
                }

                <Link href={`/dashboard/project-summary?story-id=${initialStory?.id}`}>
                    <Button size="sm" className='bg-custom_green w-full flex items-center gap-2' >
                        Summary
                        <NotebookText className='w-3 h-3'/>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" className='w-4 h-4' viewBox="0 0 96 96" preserveAspectRatio="xMidYMid meet">
                        <g transform="translate(0,96) scale(0.1,-0.1)" fill="#FFFFFF" stroke="none">
                            <path d="M431 859 c-81 -16 -170 -97 -186 -169 -5 -22 -15 -32 -42 -41 -46 -15 -99 -63 -125 -112 -27 -54 -27 -140 1 -194 40 -78 157 -151 181 -112 12 18 4 27 -38 45 -76 31 -112 85 -112 167 0 62 25 108 79 144 44 29 132 32 176 5 35 -22 55 -18 55 9 0 22 -66 59 -105 59 -23 0 -25 3 -20 23 11 35 57 88 95 108 46 25 134 25 180 0 19 -10 48 -35 64 -55 41 -50 49 -145 17 -206 -24 -46 -26 -66 -9 -76 14 -9 54 39 69 84 10 30 14 33 38 27 14 -3 41 -21 60 -40 27 -27 35 -43 39 -84 2 -27 2 -61 -2 -75 -9 -36 -62 -84 -107 -96 -28 -8 -39 -16 -39 -30 0 -30 56 -26 106 6 112 73 131 213 42 310 -23 25 -57 49 -81 57 -38 12 -42 17 -49 57 -22 127 -155 215 -287 189z"/>
                            <path d="M464 460 c-29 -11 -104 -99 -104 -121 0 -30 32 -23 62 13 l27 33 1 -127 c0 -139 4 -158 30 -158 26 0 30 19 30 158 l1 127 27 -33 c29 -35 62 -43 62 -14 0 19 -72 107 -98 121 -10 5 -26 5 -38 1z"/>
                        </g>
                        </svg>     */}
                    </Button>
                    
                </Link>
                
            </div>
                



            <Sheet open={modifyModalOpen} onOpenChange={setModifyModalOpen}>
                <SheetContent className="overflow-y-scroll xs:min-w-[90%] sm:min-w-[96%] md:min-w-[65%] lg:min-w-[65%] xl:min-w-[55%]">
                    <SheetHeader className=''>
                        <SheetTitle>Edit Chapter</SheetTitle>
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

                        <Button disabled={generating} 
                            onClick={regenerateResolution}
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

export default ResolutionComponent