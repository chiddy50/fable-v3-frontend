"use client";

import React, { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button';

import { ArrowRight, SaveIcon, Copy, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { ChatGroq } from '@langchain/groq';
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { extractLLMPromptPayload } from '@/lib/helper';
import { CharacterInterface } from '@/interfaces/CharacterInterface';

function ChoosePlotComponent({
    plotSuggestions,
    currentFormStep,
    initialStoryData,
    saveStory
}) {
    // console.log({initialStoryData});
    
    const [storyPlot, setStoryPlot] = useState<string>(initialStoryData?.overview ?? '');
    const [storyTitle, setStoryTitle] = useState<string>(initialStoryData?.title ?? '');
    const [loadingCharacterSuggestions, setLoadingCharacterSuggestions] = useState<boolean>(false)
    const [characterSuggestions, setCharacterSuggestions] = useState<CharacterInterface[]>([]);

    const { push } = useRouter();
    const { user, setShowAuthFlow } = useDynamicContext();

    const llm = new ChatGroq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
        model: "llama3-70b-8192"           
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Successfully Copied")
    }

    const moveToPreviousForm = () => push(`/story-board-from-scratch?current-step=story-starter&story-id=${initialStoryData.id}`);

    const suggestStoryCharacters = async () => {
        console.log({initialStoryData});
        
        if (!user) {
            setShowAuthFlow(true);   
            return; 
        }   

        if (!initialStoryData) {
            return;    
        }

        const { genrePrompt, thematicElementsPrompt, suspenseTechniquePrompt, suspenseTechniqueDescriptionPrompt  } = extractLLMPromptPayload(initialStoryData);

        console.log({ currentFormStep, storyPlot, storyTitle, initialStoryData, genrePrompt, thematicElementsPrompt, suspenseTechniquePrompt, suspenseTechniqueDescriptionPrompt }); 

        setLoadingCharacterSuggestions(true);
        setCharacterSuggestions([]);

        const llm = new ChatGroq({
            apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
            model: "llama3-70b-8192",            
            // model: "llama3.1-8b-instant",            
        });

        try {
            // const startingTemplate = `
            // You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words and you are also helpful and enthusiastic.
            // Based on the story plot, story title, genre, suspense technique, thematic element and thematic option provided, generate at least 10 characters for the story.
            // Return your response in json or javascript array of objects format like: name(object with key value(string) & suggestions(array, other name suggestions)), age(string), role(object with value(string, For example like protagonist or antagonist e.t.c) & suggestions(array)), gender(string), skinTone(string), hair(string. If the character has hair describe it, if not just indicate no hair), facialFeatures(object with key value(string) & suggestions(array)), personalityTraits(object with key value(string) & suggestions(array)), motivations(object with key value(string) & suggestions(array)), backstory(object with key value(string) & suggestions(array)), angst(object with key value(string) & suggestions(array)), relationships(array), relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string), skills(object with key value(array) & suggestions(array)), weaknesses(object with key value(string) & suggestions(array)), coreValues(object with key value(string) & suggestions(array)) and speechPattern(string) as keys. Please ensure the only keys in the objects are name, age, role, gender, skinTone, hair, facialFeatures, personalityTraits, motivations, backstory, angst, relationships, relationshipsWithOtherCharacters, skills, weaknesses, coreValues and speechPattern only.
            // Do not add any text extra line or text with the json response, just a json or javascript array of objects no acknowledgement or saying anything just json. Do not go beyond this instruction.            
            // plot: {storyPlot}
            // story title: {storyTitle}
            // genre: {genre}
            // thematic element & option: {thematicElement}
            // suspense technique: {suspenseTechnique}
            // suspense technique description: {suspenseTechniqueDescription}            
            // `;
            
            const startingTemplate = `
            You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words and you are also helpful and enthusiastic.
            Based on the story plot, story title, genre, suspense technique, thematic element and thematic option provided, generate at least 10 characters for the story.
            Return your response in json or javascript array of objects format like: name(string), age(string), role(string), gender(string), skinTone(string), hair(string. If the character has hair describe it if not just indicate no hair), facialFeatures(string), personalityTraits(array), motivations(array), backstory(string), angst(string), relationships(array), relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string), skills(array), weaknesses(array), coreValues(array) and speechPattern(string) as keys. Please ensure the only keys in the objects are name, age, role, gender, skinTone, hair, facialFeatures, personalityTraits, motivations, backstory, angst, relationships, relationshipsWithOtherCharacters, skills, weaknesses, coreValues and speechPattern only.
            Do not add any text extra line or text with the json response, just a json or javascript array of objects no acknowledgement or saying anything just json. Do not go beyond this instruction.            
            plot: {storyPlot}
            story title: {storyTitle}
            genre: {genre}
            thematic element & option: {thematicElement}
            suspense technique: {suspenseTechnique}
            suspense technique description: {suspenseTechniqueDescription}            
            `;
    
            const startingPrompt = ChatPromptTemplate.fromMessages([
                ["system", "You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also an expert at answering any question directly even if its not related to storytelling. And you always follow instruction"],
                ["human", startingTemplate],
            ]);
            
            const chain = startingPrompt.pipe(llm).pipe(new StringOutputParser());
                
            const response = await chain.invoke({
                storyTitle,
                storyPlot,
                genre: genrePrompt,
                suspenseTechnique: suspenseTechniquePrompt,
                suspenseTechniqueDescription: suspenseTechniqueDescriptionPrompt,
                thematicElement: thematicElementsPrompt,
            });
            console.log(response);
        
            const suggestionsResponse = JSON.parse(response);            
            console.log(suggestionsResponse);

            setCharacterSuggestions(suggestionsResponse);

            if (!suggestionsResponse || suggestionsResponse.length < 1) {
                console.log("NO PLOTS GENERATED");                
                return; 
            }

            const plot: { title: string, plot: string, characterSuggestions: CharacterInterface } = {
                title: storyTitle,
                plot: storyPlot,        
                characterSuggestions: suggestionsResponse
            }

            console.log(plot);
            
            // const storyPlotSaved = await submitPlotToDB(plot);
            const updatedStory = await saveStory({ storyPlot: plot, currentStep: 3, currentStepUrl: 'create-characters' });        

            if (updatedStory) {                
                moveToCharacterSelection(updatedStory);
            }
            
        } catch (error) {
            console.error(error);            
        }finally{
            setLoadingCharacterSuggestions(false)
        }
    }

    const moveToCharacterSelection = (updatedStory) => push(`/story-board-from-scratch?current-step=create-characters&story-id=${updatedStory?.id}`);
    
    const explorePlot = async (plotSuggestion: {title: string, plot: string}) => {
        console.log(plotSuggestion);

        const genrePrompt = initialStoryData.genres.map(genre => genre.value).join(', ');
        const thematicElementsPrompt = initialStoryData.thematicOptions.map(
            item => `For ${item.thematicElement} as the thematic element, the thematic option is ${item.thematicOption}.`
        ).join(' ');

        const startingTemplate = `
            You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words and you are also helpful and enthusiastic.
            Based on the story plot, story title, genre, suspense technique, thematic element and thematic option provided, analyze the story plot and extract the following: 
            - Exposition: Introduce key characters, the setting, and necessary background information.
            - Startling Question: Pique the reader's curiosity and set up the central conflict.
            - Background or Flashback: Provide context about characters, world, or historical events.
            - Inciting Incident: Set the story in motion and introduce the main conflict.
            - Rising Action: Develop obstacles, subplots, and build tension leading to a turning point.
            - Mini-Climaxes: Include smaller moments of tension and resolution throughout the rising action.
            - Foreshadowing: Hint at events or plot twists to come.
            - Climax: Most intense and critical moment in the story.
            - Falling Action: Show the consequences of the climax and begin resolving conflicts.
            - Resolution (Denouement): Tie up loose ends and provide closure for the story.
            - Conclusion: Summarize the story and its themes.
            - Character Arcs: Develop and grow characters throughout the story.
            - Subplots and Threads: Weave in smaller stories or plotlines that add complexity and depth.
            - Emotional Connection: Create a sense of empathy and resonance with the characters and their struggles.

            - Who is the character?
            - What are their traits, strengths, weaknesses, motivations, and goals?
            - What drives the character?
            - What desires, fears, and motivations push them to make decisions and take actions?
            - What obstacles and challenges do they face?
            - What external and internal barriers prevent them from achieving their goals?
            - How do they overcome these challenges?
            - What strategies, tactics, and adaptations do they use to navigate obstacles?
            - How do their relationships and connections influence their journey?
            - How do their relationships with others shape their goals, conflicts, and personal growth?
            - How do they change and grow throughout the story?
            - What lessons, insights, and realizations do they gain, and how do these impact their decisions and actions?
            - What do they learn and carry with them from their journey?
            - What new strengths, weaknesses, motivations, and perspectives do they acquire, and how do these shape their future?
            
            Return your response in a json or javascript object format like: exposition(object with keys like values(array, referring to expositions ), setting(array), keyCharacters(array)), startlingQuestions(array), background(array), incitingIncidents(array), risingAction(array), miniClimaxes(array), foreshadowing(array), climax(array), fallingAction(array), resolution(array), conclusion(array), characterArcs(array), subplots(array) and emotionalConnection(string) as keys. Please ensure the only keys in the objects are exposition, startlingQuestions, background, incitingIncidents, risingAction, miniClimaxes, foreshadowing, climax, fallingAction, resolution, conclusion, characterArcs, subplots and emotionalConnection only.
            Do not add any text extra line or text with the json response, just a json or javascript array of objects no acknowledgement or saying anything just json. Do not go beyond this instruction.            
            plot: {storyPlot}
            story title: {storyTitle}
            genre: {genre}
            thematic element & option: {thematicElement}
            suspense technique: {suspenseTechnique}
            suspense technique description: {suspenseTechniqueDescription}            
            `;

            const startingPrompt = ChatPromptTemplate.fromMessages([
                ["system", "You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also an expert at answering any question directly even if its not related to storytelling. And you always follow instruction"],
                ["human", startingTemplate],
            ]);
            
            const chain = startingPrompt.pipe(llm).pipe(new StringOutputParser());
                
            const response = await chain.invoke({
                storyTitle: plotSuggestion.title,
                storyPlot: plotSuggestion.plot,
                genre: genrePrompt,
                suspenseTechnique: initialStoryData.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStoryData.suspenseTechnique?.description,
                thematicElement: thematicElementsPrompt,
            });
            console.log(response);
        
            const suggestionsResponse = JSON.parse(response);            
            console.log(suggestionsResponse);
    }

    return (
        <div>
            <div className='mb-5'>
                <p className='mb-2 text-sm text-gray-600'>Story Title</p>
                <Input 
                    defaultValue={storyTitle}
                    onKeyUp={(e) => setStoryTitle(e.target.value)} 
                    onPaste={(e) => setStoryTitle(e.target.value)} 
                    className='lg:w-full xl:w-1/2 text-xs'
                />
            </div>
            <div>
                <p className='mb-2 text-sm text-gray-600'>Kindly share your story plot</p>
                <Textarea 
                    defaultValue={storyPlot}
                    onKeyUp={(e) => setStoryPlot(e.target.value)} 
                    onPaste={(e) => setStoryPlot(e.target.value)} 
                    className='lg:w-full xl:w-1/2 text-xs p-5'
                    rows={5}
                />
            </div>

            <div className="flex items-center gap-5 my-5">
                <Button onClick={moveToPreviousForm} className=''>
                    Prev
                    <ArrowLeft className='w-4 h-4 ml-2'/>
                </Button>
                <Button onClick={suggestStoryCharacters} className=''>
                    Next
                    <ArrowRight className='w-4 h-4 ml-2'/>
                </Button>
           
            </div>
            
            {   plotSuggestions && plotSuggestions.length > 0 &&
                <div className='my-20'>
                    <h1 className='text-4xl font-bold text-gray-600'>Here are some plot suggestions:</h1>

                    <div className='px-10 mt-7'>
                        <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full "
                        >
                            <CarouselContent>
                                {plotSuggestions.map((plotSuggestion, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                                    <div className="h-full border rounded-xl p-7 flex flex-col justify-between">
                                        <div className='flex items-center mb-4 gap-3'>
                                            <h1 className='text-xl text-gray-500 font-bold uppercase'>
                                                {plotSuggestion.title}
                                            </h1>

                                            <div onClick={() => copyToClipboard(plotSuggestion.title)}>
                                                <Copy className='w-4 h-4 cursor-pointer hover:text-blue-600'/>
                                            </div>
                                        </div>

                                        <p className='text-xs mb-4'>{plotSuggestion.plot}</p>

                                        <div>
                                            <Button size="sm" 
                                            onClick={() => copyToClipboard(plotSuggestion.plot)}
                                            className='mr-5'
                                            >
                                                Copy Plot
                                                <Copy className='w-3 h-3 ml-2'/>
                                            </Button>

                                            <Button size="sm" onClick={() => explorePlot(plotSuggestion)}>
                                                Explore
                                            </Button>
                                        </div>
                                    </div>
                                </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>

                </div>
            }

        </div>
      )
}

export default ChoosePlotComponent
