"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { StoryInterface } from '@/interfaces/StoryInterface';
import { extractTemplatePrompts, queryLLM, queryStructuredLLM, streamLLMResponse } from '@/services/LlmQueryHelper';
import { toast } from 'sonner';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { ArrowLeft, ArrowRight, Cog, Lock, User2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Input } from '../ui/input';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import MultipleSelector, { Option } from '../ui/multiple-selector';
import { characterTraits, storyGenres, storyTones } from '@/lib/data';
import { makeRequest } from '@/services/request';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { v4 as uuidv4 } from 'uuid';
import SampleSelect from '../SampleSelect';
import { cn } from '@/lib/utils';
import { Dosis, Inter } from 'next/font/google';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { SuggestedOtherCharacterInterface, SuggestedProtagonistInterface } from '@/interfaces/CreateStoryInterface';
import axios from 'axios';
  

interface IntroduceProtagonistAndOrdinaryWorldComponentProps {
    initialStory: StoryInterface;
    refetch:() => void;
    moveToNext:(step: number) => void;
}

interface StoryAnalysisPayload {
    protagonists: [];
    otherCharacters: [];
    tone: [];
    genre: [];
    setting: [];
    summary?: string|null;
}

interface ProtagonistPayload {
    id: string;
    name: string;
    backstory: string;
    role: string;
    relationshipToOtherProtagonist: string;
    motivations: string;
    characterTraits: string[];
}

  
interface ChapterAnalysis {
    protagonists: SuggestedProtagonistInterface[];
    otherCharacters: SuggestedOtherCharacterInterface[];
    tone: string[];
    genre: string[];
    summary: string;
    moodAndAtmosphere: string[];
    hooks: string[];
    setting: string[];
    thematicElement: string[];
}

const inter = Inter({ subsets: ['latin'] });

const IntroduceProtagonistAndOrdinaryWorldComponent: React.FC<IntroduceProtagonistAndOrdinaryWorldComponentProps> = ({
    initialStory,
    refetch,
    moveToNext
}) => {
    const [introduceProtagonistAndOrdinaryWorld, setIntroduceProtagonistAndOrdinaryWorld] = useState<string>(initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld ?? "");
    const [modifyModalOpen, setModifyModalOpen] = useState<boolean>(false);
    const [generating, setGenerating] = useState<boolean>(false);
    const [projectDescription, setProjectDescription]= useState<string>(initialStory?.projectDescription ?? '');   

    const [introductionSummary, setIntroductionSummary] = useState<string>(initialStory?.storyStructure?.introductionSummary ?? "");    
    const [storyAnalysis, setStoryAnalysis] = useState(null);
    const [genres, setGenres] = useState<Option[]>(initialStory?.genres ?? []);
    const [genreList, setGenreList] = useState<[]>([]);
    const [tones, setTones] = useState<Option[]>(initialStory?.introductionTone ?? []);
    const [introductionSetting, setIntroductionSetting] = useState<Option[]>(initialStory?.introductionSetting ?? []);
    const [introductionSettingSuggestions, setIntroductionSettingSuggestions] = useState<Option[]>([]);
    const [protagonists, setProtagonists] = useState<ProtagonistPayload[]>([]);
    const [introductionExtraDetails, setIntroductionExtraDetails] = useState<string>("");

    useEffect(() => {
        fetchGenres();
    }, []);

    useEffect(() => {
        setIntroductionSummary(initialStory?.storyStructure?.introductionSummary ?? "");
        setIntroduceProtagonistAndOrdinaryWorld(initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld ?? "")
        setGenres(initialStory?.genres ? initialStory?.genres : []);
        setTones(initialStory?.introductionTone ? initialStory?.introductionTone?.map(item => ( { label: item, value: item } )) : []);
        setIntroductionSetting(initialStory?.introductionSetting ? initialStory?.introductionSetting?.map(item => ( { label: item, value: item } )) : []);
        setIntroductionSettingSuggestions(initialStory?.introductionSetting ? initialStory?.introductionSetting?.map(item => ( { label: item, value: item } )) : []);
        setProtagonists(initialStory?.protagonistSuggestions ? initialStory?.protagonistSuggestions : [] )
        
    }, [initialStory]);

    useEffect(() => {
        adjustHeight();
    }, [introduceProtagonistAndOrdinaryWorld]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const fetchGenres = async () => {
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/genres`); 
            console.log(response);
            if (response?.data?.genres) {
                const genres = response?.data?.genres.map(genre => {
                    return {
                        id: genre.id,
                        label: genre.name,
                        value: genre.name,
                    }
                })
                setGenreList(genres);
            }
        }catch(err){
            console.error(err);            
        }
    }

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

    // const dynamicJwtToken = getAuthToken();

    const generateIntroduceProtagonistAndOrdinaryWorld = async () => {
        try {
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                
            **OUTPUT**
            You will use the provided story idea to generate a cohesive story introduction that introduces the characters and also their ordinary world. And also follow the three-act structure.
            Capture the emotional journey of the protagonist by introducing the protagonist(s).
            Do not write about the end of the story just focus on the introduction and description of the character.
             
            Note: Do not include a title or subtitles while generating the story, we are only focused on the story. Do not add any title, subtitle or anything describing an act.
            **INPUT**
            story idea {storyIdea}
            `;
            
            setGenerating(true);
            const response = await streamLLMResponse(prompt, {
                storyIdea: projectDescription,
            });

            if (!response) {
                setGenerating(false);   
                toast.error("Try again please");
                return;
            }
    
            scrollToBottom();
            let text = ``;
            for await (const chunk of response) {
                scrollToBottom();
                text += chunk;   
                setIntroduceProtagonistAndOrdinaryWorld(text);         
            }
            scrollToBottom();

            await saveGeneration(text)
            // await analyzeStory(text)
            console.log({text, introduceProtagonistAndOrdinaryWorld});
            
        } catch (error) {
            console.error(error);            
        }finally{
            setGenerating(false);
        }
    }

    const regenerateIntroduceProtagonistAndOrdinaryWorld = async () => {
        let { genrePrompt, protagonistSuggestionsPrompt, tonePrompt, settingPrompt } = extractTemplatePrompts(initialStory);

        try {
            const prompt = `
                You are a skilled storyteller, author, and narrative designer renowned for creating immersive narratives, deep characters, and vivid worlds. Your writing is creative, engaging, and detail-oriented.

                **OUTPUT**
                You will be provided with an existing story introduction that presents the protagonist and their ordinary world. Your task is to rewrite this introduction with the following updates:

                - Story Introduction: {introduceProtagonistAndOrdinaryWorld}
                - Genre: {genres}
                - Tone: {tones}
                - Setting: {setting}
                - Protagonist Details: {protagonists}

                **Instructions:**
                1. **Compare & Update**: If any aspect of the protagonist (name, motivations, role, backstory, character traits) has changed, ensure consistency by incorporating those updates in the rewrite. This includes changes for a single protagonist or multiple protagonists.
                2. **Maintain Consistency**: Align the genre, tone, and setting with the story’s intended direction, ensuring a cohesive narrative.
                3. **Incorporate Additional Details**: If any extra modifications or details are provided ({introductionExtraDetails}), smoothly integrate them into the new introduction.
                4. **Focus on the Protagonist**: Capture the emotional journey and description of the protagonist(s) without revealing or hinting at the story's ending. Rewrite to remove any ending spoilers if they exist.

                **Note**: Recheck protagonist details, genre, tone, and setting for consistency. Completely regenerate the introduction as needed.
                **Note**: Focus solely on the story. Do not include titles, subtitles, or act labels.

                Just write the story do not add any thing like saying you have added any changes, just focus on writing the story. 

                **INPUT**
                Story Idea: {storyIdea}
                Additional Details: {introductionExtraDetails}
            `;

            setGenerating(true);
            setModifyModalOpen(false);
            const response = await streamLLMResponse(prompt, {
                storyIdea: projectDescription,
                genres: genrePrompt,
                tones: tonePrompt,
                setting: settingPrompt,
                protagonists: protagonistSuggestionsPrompt,
                introductionExtraDetails,
                introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld
            });

            if (!response) {
                setGenerating(false);
                toast.error("Try again please");
                return;
            }
    
            scrollToBottom();
            let text = ``;
            for await (const chunk of response) {
                text += chunk;   
                setIntroduceProtagonistAndOrdinaryWorld(text);    
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
        const data = introduceProtagonistAndOrdinaryWorld;
        
        if (!data) {
            toast.error('Generate some content first')
            return;
        }
        
        try {
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.                                
            We have currently generated the Introduction of the Protagonist & Ordinary World section of the story. 
            I need you analyze the generated content and give an analysis of the characters involved in the story, tone, genre, thematic element, suspense technique, plot twist, setting.
         
            Return your response in a json or javascript object format like: 
            protagonists(array of objects with keys like name(string), age(string), role(string), habits(string), innerConflict(string), antagonistForce(string), gender(string), relevanceToAudience(string), motivations(array), skinTone(string), height(string), weight(string), clothDescription(string), hairTexture(string), hairLength(string), hairQuirk(string), facialHair(string), facialFeatures(string), motivations(array), characterTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string) & relationshipToOtherProtagonist(string, this should only be provided if there is more than one protagonist))
            otherCharacters(array of objects with keys like name(string), age(string), backstory(string), role(string), habits(string), innerConflict(string), antagonistForce(string), gender(string), relevanceToAudience(string), motivations(array), skinTone(string), height(string), clothDescription(string), weight(string), hairTexture(string), hairLength(string), hairQuirk(string), facialHair(string), facialFeatures(string), motivations(array), characterTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string) & relationshipToProtagonists(array of object with keys like protagonistName(string) & relationship(string)) )
            tone(array of string),
            genre(array of string),
            summary(string, this is a summary of the events in the Introduction of the Protagonist & Ordinary World section of the story, ensure the summary contains all the events sequentially including the last events leading to the next chapter),
            moodAndAtmosphere(array of string)
            hooks(array of string, the hook raises questions or sparks curiosity, making the reader want to continue reading). 
            setting(array of string, generate at least 3 setting suggestions).                        
            thematicElement(array of string),
            Please ensure the only keys in the object are protagonists, otherCharacters, tone, genre, thematicElement, suspenseTechnique, plotTwist and setting keys only.
            Do not add any text extra line or text with the json response, just a json object, no acknowledgement or do not return any title, just return json response. Do not go beyond this instruction.                               

            When suggesting the genre ensure your choice comes from the predefined list of genres here: {genreList}.
            For protagonists and otherCharacters ensure to provide suggestions for very facial feature and every option because they are all required do not leave any one empty.
            Ensure the summary contains all the events step by step as they occurred and the summary must also contain the characters and the impacts they have had on each other.

            **INPUT**
            Story Introduction {introduceProtagonistAndOrdinaryWorld}
            Predefined List of genres: {genreList}
            `;

            showPageLoader();

            const parser = new JsonOutputParser<ChapterAnalysis>();

            const response = await queryStructuredLLM(prompt, {
                introduceProtagonistAndOrdinaryWorld: data,
                genreList: storyGenres.map(genre => genre.value).join(", ")
            }, parser);

            if (!response?.genre) {
                toast.error("Try again please");
                return;
            }         

            setGenres(response?.genre ? response?.genre?.map(genre => ( { label: genre, value: genre } )) : []);
            setTones(response?.tone ? response?.tone?.map(tone => ( { label: tone, value: tone } )) : []);
            setIntroductionSetting(response?.setting ? response?.setting?.map(setting => ( { label: setting, value: setting } )) : []);
            setIntroductionSettingSuggestions(response?.setting ? response?.setting?.map(setting => ( { label: setting, value: setting } )) : []);
            setProtagonists(response?.protagonists ?? []);

            setStoryAnalysis(response);  
            let saved = await saveAnalysis(response);
            
            if (showModal) setModifyModalOpen(true);
            
        } catch (error) {
            console.error(error);               
        }finally{
            hidePageLoader()
        }
    }

    const saveAnalysis = async (payload: StoryAnalysisPayload) => {
        if (payload) {                
            // save data

            let updatedProtagonists = payload?.protagonists.map((protagonist: ProtagonistPayload) => {
                return { ...protagonist, id: uuidv4() }
            });

            let updatedOtherCharacters = payload?.otherCharacters.map((character: object) => {
                return { ...character, id: uuidv4() }
            });

            const chosenGenres = () => {
                return genreList.filter(genre => payload?.genre.includes(genre.value));
            };

            console.log({ genreList, chosenGenres: chosenGenres() });
            
            const updated = await axiosInterceptorInstance.put(`${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    genres: chosenGenres(),                    
                    introductionSetting: payload?.setting,                    
                    introductionTone: payload?.tone,                    
                    introductionSummary: payload?.summary,                    
                    protagonistSuggestions: updatedProtagonists,     
                    suggestedCharacters: updatedOtherCharacters,
                    introduceProtagonistAndOrdinaryWorld,
                    introductionLocked: true        
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
            // save data
            const updated = await axiosInterceptorInstance.put(`${process.env.NEXT_PUBLIC_BASE_URL}/stories/structure/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    introduceProtagonistAndOrdinaryWorld: data,
                    introductionLocked: true     
                }
            );
        }
    }

    const updateCharacterRole = (role: string, id: string) => {        
        setProtagonists(prevProtagonists => 
            prevProtagonists.map(item => {
                if (item?.id === id) {
                    return {
                        ...item,
                        role: role
                    };
                }
                return item;
            })
        );
    }

    const updateCharacterMotivations = (motivations: string, id: string) => {        
        setProtagonists(prevProtagonists => 
            prevProtagonists.map(item => {
                if (item?.id === id) {
                    return {
                        ...item,
                        motivations
                    };
                }
                return item;
            })
        );
    }

    const updateCharacterBackstory = (backstory: string, id: string) => {        
        setProtagonists(prevProtagonists => 
            prevProtagonists.map(item => {
                if (item?.id === id) {
                    return {
                        ...item,
                        backstory
                    };
                }
                return item;
            })
        );
    }

    const updateCharacterName = (name: string, id: string) => {        
        setProtagonists(prevProtagonists => 
            prevProtagonists.map(item => {
                if (item?.id === id) {
                    return {
                        ...item,
                        name: name
                    };
                }
                return item;
            })
        );
    }

    const updateCharacterTrait = (characterTraits: string[], protagonist: ProtagonistPayload) =>  {       
        setProtagonists(prevProtagonists => 
            prevProtagonists.map(item => {
                if (item.name === protagonist?.name) {
                    return {
                        ...item,
                        characterTraits: characterTraits
                    };
                }
                return item;
            })
        );
    }

    const lockChapter = async () => {
        try {           
            showPageLoader();
            const updated = await axiosInterceptorInstance.put(`${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch/${initialStory?.id}`, 
                {
                    storyId: initialStory?.id,
                    genres: genres.map(genre => genre.value),                    
                    introductionSetting: introductionSetting.map(setting => setting.value),                    
                    introductionTone: tones.map(tone => tone.value),                    
                    protagonistSuggestions: protagonists,     
                    introduceProtagonistAndOrdinaryWorld,
                    introductionLocked: true      
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

    const moveToChapter2 = async () => {
        if (!introductionSummary) {
            let analysis = await analyzeStory(false)
        }
        moveToNext(2);
    }

    return (
        <div className="my-10 bg-gray-50 p-5 rounded-2xl">
            <div className='mb-5'>
                <div className="flex justify-between items-center mb-3">
                    <Button size="icon" onClick={() => moveToNext(1)} disabled={true}>
                        <ArrowLeft />
                    </Button>
                    <p className='font-bold text-center text-2xl'>
                        Chapter 1
                    </p>
                    <Button size="icon" disabled={!introduceProtagonistAndOrdinaryWorld || generating} onClick={moveToChapter2}>
                        <ArrowRight />
                    </Button>
                </div>
                <p className='text-xs text-center'>
                This is where we introduce the main characters, setting, and the protagonist's ordinary world before the story's main conflict begins.
                </p> 
            </div>

            <textarea 
                disabled={generating}
                rows={5} 
                style={{ overflow: 'hidden' }}
                ref={textareaRef}
                onFocus={(e) => {
                    setIntroduceProtagonistAndOrdinaryWorld(e.target.value);
                    adjustHeight(); // Adjust height on every change
                }}
                onChange={(e) => {
                    setIntroduceProtagonistAndOrdinaryWorld(e.target.value);
                    adjustHeight(); // Adjust height on every change
                }}
                value={introduceProtagonistAndOrdinaryWorld} 
                placeholder=''
                className={cn('p-5 mb-4 outline-none border text-md whitespace-pre-wrap rounded-lg w-full leading-5', inter.className)} 
            />

     
            <div className="flex justify-between items-center mb-3">
                <Button size="icon" onClick={() => moveToNext(1)} disabled={true}>
                    <ArrowLeft />
                </Button>

                {/* {genres?.length > 0 && <Button className='bg-custom_green'>Characters</Button>} */}
           
                <Button size="icon" disabled={!introduceProtagonistAndOrdinaryWorld || generating} onClick={moveToChapter2}>
                    <ArrowRight />
                </Button>
            </div>
            <div id='control-buttons' className='grid grid-cols-3 gap-4'>
                
                {
                    <Button 
                    className='flex items-center gap-2'
                    disabled={generating}                            
                    size="sm" onClick={generateIntroduceProtagonistAndOrdinaryWorld}>
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
                disabled={generating || !introduceProtagonistAndOrdinaryWorld}
                onClick={() => {
                    console.log({genres: genres?.length > 0});
                    
                    if (introductionSummary) {
                        setModifyModalOpen(true);
                    }else{
                        analyzeStory()
                    }
                }}
                >
                    {genres.length > 0 ? "Analysis" : "Analyze"}
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" className='w-4 h-4' viewBox="0 0 96 96">
                    <g fill="#FFFFFF">
                        <path d="M9.4 12.5c-.4 1.4-.4 15.5-.2 31.3.4 24.5.7 29.3 2.3 33 2.4 5.8 5.9 8.1 14.7 9.2 8 1 55.7 1.4 58.2.4 2.1-.8 2.1-4 0-4.8-.9-.3-15.1-.6-31.5-.6H22.9l.6-2.3c.4-1.2 2.8-6.1 5.2-11 7.3-14.1 11.6-15.9 20.3-8.2 4.4 3.9 5.7 4.5 9.5 4.5 5.7 0 9-2.9 14.8-12.5 3.7-6.1 4.8-7.2 8.5-8.3 2.9-1 4.2-1.9 4.2-3.2 0-2.3-1.7-2.9-5.4-1.9-4.9 1.4-7.4 3.7-11.1 10.1-7.4 12.6-10.5 13.7-18.7 6.3-4.2-3.8-5.7-4.5-9.2-4.5-7.9 0-13.1 5.5-20.5 21.5-3.2 6.9-3.3 7-4.6 4.5-1.1-2-1.4-8.8-1.5-32.7 0-16.6-.3-30.8-.6-31.7-1-2.6-4.3-1.9-5 .9zM27.3 13.7c-2 .8-1.5 4.1.7 4.8 2.9.9 6-.3 6-2.5 0-2.5-3.4-3.7-6.7-2.3zM27.3 25.7c-1.8.7-1.6 4 .3 4.7.9.3 4.6.6 8.4.6 3.8 0 7.5-.3 8.4-.6 2.1-.8 2.1-4 0-4.8-1.9-.7-15.3-.7-17.1.1z"/>
                    </g>
                    </svg>
                </Button>
                }
                
                {
                // (initialStory?.genres) && 
                <Button 
                className=''                
                disabled={generating || !introduceProtagonistAndOrdinaryWorld}     
                onClick={lockChapter}       
                size="sm" variant="destructive">
                    Save
                    <Lock className='ml-2 w-3 h-3' />
                </Button>}
                
            </div>

            



            <Sheet open={modifyModalOpen} onOpenChange={setModifyModalOpen}>
                <SheetContent 
                    // side="bottom" 
                    className="overflow-y-scroll z-[100] xs:min-w-[90%] sm:min-w-[96%] md:min-w-[65%] lg:min-w-[65%] xl:min-w-[55%]">
                    <SheetHeader className=''>
                        <SheetTitle>Modify Introduction</SheetTitle>
                        <SheetDescription> </SheetDescription>
                    </SheetHeader>

                    <div className='mt-5'>
                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-2 text-sm">Genre</p>       
                            <MultipleSelector
                                creatable
                                maxSelected={4}
                                // disabled={initialStory?.introductionLocked}
                                value={genres}
                                onChange={setGenres}
                                defaultOptions={genreList}
                                placeholder="Choose genres"
                                emptyIndicator={
                                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                        no results found.
                                    </p>
                                }
                                className='outline-none bg-white'
                            />  
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'>    
                            <p className="font-semibold mb-2 text-sm">Tone</p>       
                            <MultipleSelector
                                creatable
                                // disabled={initialStory?.introductionLocked}
                                value={tones}
                                onChange={setTones}
                                defaultOptions={storyTones.map(tone => ({ label: tone, value: tone}))}
                                placeholder="Choose tones"
                                emptyIndicator={
                                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                        no results found.
                                    </p>
                                }
                                className='outline-none bg-white'
                            />   
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'>                                        
                            <p className="font-semibold mb-2 text-sm">Setting</p>
                            
                            <MultipleSelector
                                creatable
                                maxSelected={4}
                                // disabled={initialStory?.introductionLocked}
                                value={introductionSetting}
                                onChange={setIntroductionSetting}
                                defaultOptions={introductionSettingSuggestions}
                                placeholder="Choose setting"
                                emptyIndicator={
                                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                        no results found.
                                    </p>
                                }
                                className='outline-none bg-white'
                            />

                        </div>
                        
                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                            <p className="font-semibold mb-2 text-sm">Add extra details for customization</p> 
                            <textarea                             
                                rows={3} 
                                onFocus={(e) => setIntroductionExtraDetails(e.target.value)}
                                onChange={(e) => setIntroductionExtraDetails(e.target.value)}
                                value={introductionExtraDetails} 
                                placeholder=''
                                className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                            /> 
                        </div>

                        <div className='p-5 mb-4 border rounded-2xl bg-gray-50'>                                        
                            <h1 className="font-semibold mb-2 text-sm">Protagonist(s)</h1>
                            <Accordion type="single" className='' collapsible>
                                {
                                    protagonists?.map((protagonist, index: number) => (                                                
                                        <AccordionItem key={index} value={`item-${index+1}`} className='mb-3 border-none'>
                                            <AccordionTrigger className='text-sm bg-gray-800 px-4 rounded-2xl text-gray-100'>{protagonist?.name}</AccordionTrigger>                                
                                            <AccordionContent>
                                                <div key={index} className='mt-1 bg-white p-4 rounded-2xl border w-full'>
                                                    <div className="mb-3">
                                                        <p className="mb-1 text-xs font-semibold">Character Traits</p>
                                                        <SampleSelect 
                                                        options={[...protagonist?.characterTraits, ...characterTraits] ?? []}
                                                        onChange={(val) => updateCharacterTrait(val, protagonist)}
                                                        value={protagonist?.characterTraits ?? []}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <p className="mb-1 text-xs font-semibold">Name</p>
                                                        <Input 
                                                        // disabled={initialStory?.introductionLocked}
                                                        defaultValue={protagonist.name}
                                                        onKeyUp={(e) => updateCharacterName(e.target.value, protagonist?.id)} 
                                                        className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                                                        placeholder='Project title'
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <p className="mb-1 text-xs font-semibold">Role</p>
                                                        <Input 
                                                        // disabled={initialStory?.introductionLocked}
                                                        defaultValue={protagonist.role}
                                                        onKeyUp={(e) => updateCharacterRole(e.target.value, protagonist?.id)} 
                                                        className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                                                        placeholder='Project title'
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <p className="mb-1 text-xs font-semibold">Backstory</p>
                                                        <textarea 
                                                            rows={5} 
                                                            // disabled={initialStory?.introductionLocked}
                                                            onFocus={(e) => updateCharacterBackstory(e.target.value, protagonist?.id)}
                                                            onChange={(e) => updateCharacterBackstory(e.target.value, protagonist?.id)}
                                                            value={protagonist.backstory} 
                                                            placeholder=''
                                                            className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <p className="mb-1 text-xs font-semibold">Motivations</p>
                                                        <textarea 
                                                            // disabled={initialStory?.introductionLocked}
                                                            rows={5} 
                                                            onFocus={(e) => updateCharacterMotivations(e.target.value, protagonist?.id)}
                                                            onChange={(e) => updateCharacterMotivations(e.target.value, protagonist?.id)}
                                                            value={protagonist.motivations} 
                                                            placeholder=''
                                                            className='p-3 outline-none border text-xs rounded-lg w-full leading-5' 
                                                        />
                                                    </div>

                                                    
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>                                
                                    ))
                                }
                            </Accordion>    
                        </div>
                        

                        <Accordion type="single" className='' collapsible>
                            {/* <AccordionItem value="item-1 " className='mb-3 border-none'>
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>Summary</AccordionTrigger>
                                
                                <AccordionContent>
                                    <div className='p-5 border mt-3 rounded-2xl bg-gray-50'>                                        
                                        <p className='text-xs'>{storyAnalysis?.summary}</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem> */}

                            {/* <AccordionItem value="item-2" className='mb-3 border-none'>
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>Genre</AccordionTrigger>                                
                                <AccordionContent>
                                    <div className='p-5 mt-2 border rounded-2xl bg-gray-50'>        
                                        <MultipleSelector
                                            maxSelected={4}
                                            value={genres}
                                            onChange={setGenres}
                                            defaultOptions={storyGenres}
                                            placeholder="Choose genres"
                                            emptyIndicator={
                                                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                                    no results found.
                                                </p>
                                            }
                                            className='outline-none bg-white mb-5'
                                        />                                
                                        <h1 className="font-bold mb-3 font-sm">Current Genres</h1>
                                        
                                        <div className="flex gap-2 flex-wrap mb-3">
                                            {
                                                storyAnalysis?.genre?.map((genre: string, index: number) => (
                                                    <p key={index} className='text-xs px-4 py-1 cursor-pointer rounded-2xl border bg-white transition-all hover:bg-gray-800 hover:text-gray-50'>{genre}</p> 
                                                ))
                                            }
                                        </div>
                                        <Button size="sm">Apply Change</Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem> */}

                            {/* <AccordionItem value="item-3" className='mb-3 border-none'>
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>Tone</AccordionTrigger>                                
                                <AccordionContent>
                                    <div className='p-5 mt-2 border rounded-2xl bg-gray-50'>    
                                        <MultipleSelector
                                            maxSelected={4}
                                            value={tones}
                                            onChange={setTones}
                                            defaultOptions={storyTones.map(tone => ({ label: tone, value: tone}))}
                                            placeholder="Choose tones"
                                            emptyIndicator={
                                                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                                    no results found.
                                                </p>
                                            }
                                            className='outline-none bg-white mb-5'
                                        />                                         
                                        <h1 className="font-bold mb-3 font-sm">Suggested Tones</h1>
                                        
                                        <div className="flex gap-2 flex-wrap mb-3">
                                            {
                                                storyAnalysis?.tone?.map((tone: string, index: number) => (
                                                    <p key={index} className='text-xs px-4 py-1 cursor-pointer rounded-2xl border bg-white transition-all hover:bg-gray-800 hover:text-gray-50'>{tone}</p> 
                                                ))
                                            }
                                        </div>
                                        <Button size="sm">Apply Change</Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem> */}

                            {/* <AccordionItem value="item-4" className='mb-3 border-none'>
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>Setting</AccordionTrigger>                                
                                <AccordionContent>
                                    <div className='p-5 mt-2 border rounded-2xl bg-gray-50'>                                        
                                        <h1 className="font-bold mb-3 font-sm">Suggested Settings</h1>
                                        introductionSetting
                                        <div className="flex gap-2 flex-wrap mb-3">
                                            {
                                                storyAnalysis?.setting?.map((setting: string, index: number) => (
                                                    <p key={index} className='text-xs px-4 py-1 cursor-pointer rounded-2xl border bg-white transition-all hover:bg-gray-800 hover:text-gray-50'>{setting}</p> 
                                                ))
                                            }
                                        </div>

                                        <div className="mb-3">
                                            <Input className='w-full'/>
                                        </div>
                                        <Button size="sm">Apply Change</Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem> */}

                            {/* <AccordionItem value="item-5" className='mb-3 border-none'>
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>Protagonist(s)</AccordionTrigger>                                
                                <AccordionContent>
                                    <div className='p-5 mt-2 border rounded-2xl bg-gray-50'>                                        
                                        <h1 className="font-bold mb-3 font-sm">Suggested Protagonist</h1>
                                        
                                        <div className="flex gap-2 flex-wrap mb-3">
                                            {
                                                storyAnalysis?.protagonists?.map((protagonist: string, index: number) => (                                                
                                                    <div key={index} className='flex items-center gap-5 mb-3 bg-white p-4 rounded-2xl border w-full'>

                                                        <div className='with-linear-gradient rounded-full'>
                                                            <Image
                                                                src={"/user-image.jpeg"}
                                                                alt={protagonist?.name || 'character image'}
                                                                width={40}
                                                                height={40}
                                                                loading="lazy"
                                                                className='w-full rounded-full xl:order-last'
                                                            />
                                                        </div>
                                                        <div>
                                                            <SheetTitle className='font-bold text-lg'>{protagonist?.name}</SheetTitle>
                                                            <p className='text-xs'>{protagonist?.role}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        
                                        <Button size="sm">Apply Change</Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem> */}

                            
                            {/* <AccordionItem value="item-6" className='mb-3 border-none'>
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>Other Characters</AccordionTrigger>                                
                                <AccordionContent>
                                    <div className='p-5 mt-2 border rounded-2xl bg-gray-50'>                                        
                                        <h1 className="font-bold mb-3 font-sm">Suggested Characters</h1>
                                        
                                        <div className="flex gap-2 flex-wrap mb-3">
                                            {
                                                storyAnalysis?.otherCharacters?.map((character: string, index: number) => (                                                
                                                    <div key={index} className='mb-2 bg-white p-4 w-full rounded-2xl border'>
                                                        <SheetTitle className='font-bold text-md'>{character?.name}</SheetTitle>
                                                        <p className='text-xs mb-2'>{character?.role}</p>

                                                        <button className='bg-red-700 text-white px-3 rounded-2xl py-1 text-[10px]'>Remove</button>
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        
                                        <Button size="sm">Apply Change</Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem> */}
                            

                            {/* <AccordionItem value="item-1 " className='mb-3 border-none'>
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>Suggested Genres</AccordionTrigger>                                
                                <AccordionContent></AccordionContent>
                            </AccordionItem> */}
                        </Accordion>

                        {
                        // !initialStory?.introductionLocked &&
                        <div className='grid grid-cols-2 mt-5 gap-5'>
                            <Button disabled={generating} 
                                onClick={regenerateIntroduceProtagonistAndOrdinaryWorld}
                                size="sm" 
                                className='border w-full bg-custom_green text-white hover:bg-custom_green hover:text-white'>
                                Regenerate
                                <Cog className='ml-2 w-4 h-4'/>
                            </Button>
                            <Button size="sm"  
                            className='flex items-center gap-2 w-full'
                            onClick={() => analyzeStory(false)}
                            >
                                Reanalyze
                                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" className='w-4 h-4 ml-2' viewBox="0 0 96 96">
                                <g fill="#FFFFFF">
                                    <path d="M9.4 12.5c-.4 1.4-.4 15.5-.2 31.3.4 24.5.7 29.3 2.3 33 2.4 5.8 5.9 8.1 14.7 9.2 8 1 55.7 1.4 58.2.4 2.1-.8 2.1-4 0-4.8-.9-.3-15.1-.6-31.5-.6H22.9l.6-2.3c.4-1.2 2.8-6.1 5.2-11 7.3-14.1 11.6-15.9 20.3-8.2 4.4 3.9 5.7 4.5 9.5 4.5 5.7 0 9-2.9 14.8-12.5 3.7-6.1 4.8-7.2 8.5-8.3 2.9-1 4.2-1.9 4.2-3.2 0-2.3-1.7-2.9-5.4-1.9-4.9 1.4-7.4 3.7-11.1 10.1-7.4 12.6-10.5 13.7-18.7 6.3-4.2-3.8-5.7-4.5-9.2-4.5-7.9 0-13.1 5.5-20.5 21.5-3.2 6.9-3.3 7-4.6 4.5-1.1-2-1.4-8.8-1.5-32.7 0-16.6-.3-30.8-.6-31.7-1-2.6-4.3-1.9-5 .9zM27.3 13.7c-2 .8-1.5 4.1.7 4.8 2.9.9 6-.3 6-2.5 0-2.5-3.4-3.7-6.7-2.3zM27.3 25.7c-1.8.7-1.6 4 .3 4.7.9.3 4.6.6 8.4.6 3.8 0 7.5-.3 8.4-.6 2.1-.8 2.1-4 0-4.8-1.9-.7-15.3-.7-17.1.1z"/>
                                </g>
                                </svg>
                            </Button>
                        </div>
                            
                        }
                        
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default IntroduceProtagonistAndOrdinaryWorldComponent
