"use client";

import { Button } from '@/components/ui/button';
import { StoryInterface, StoryStructureInterface } from '@/interfaces/StoryInterface';
import { ArrowLeft, ArrowRight, Check, Edit, Save, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { charactersToString, extractCharacters, extractCharacterSummary, extractTemplatePrompts, mergeStorytellingFormWithIdea, queryLLM, threeActStructureDefinition } from '@/services/LlmQueryHelper';
import { hidePageLoader, showPageLoader } from '@/lib/helper';

import AddProtagonistComponent from './AddProtagonistComponent';
import { newProtagonistNoOverviewPrompt, newProtagonistPrompt } from '@/services/ProtagonistIntroductionHelper';
import { CharacterInterface, SuggestedCharacterInterface } from '@/interfaces/CharacterInterface';
import { ProtagonistCharacteristicsInterface, ProtagonistInterface } from '@/interfaces/ProtagonistInterface';
import WhatProtagonistWantComponent from './WhatProtagonistWantComponent';
import { v4 as uuidv4 } from 'uuid';
import WhoDoesNotHaveProtagonistGoalComponent from './WhoDoesNotHaveProtagonistGoalComponent';
import ProtagonistGoalObstacleComponent from './ProtagonistGoalObstacleComponent';

import code from '@code-wallet/elements';
import ProtagonistWeaknessStrength from './ProtagonistWeaknessStrength';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { toast } from 'sonner';
import { DallEAPIWrapper } from '@langchain/openai';
import CharacterComponent from '../CharacterComponent';
import { updateCharacter } from '@/services/request';


interface ProtagonistIntroductionComponentProps {
    storyStructure: StoryStructureInterface,
    initialStory: StoryInterface,
    initialIntroductionStep: number;
    saveStory: (val: any) => null|object;
    moveToNext: () => void;
    moveToPrev: () => void;
    refetch:() => void;
}

const ProtagonistIntroductionComponent: React.FC<ProtagonistIntroductionComponentProps> = ({
    initialStory,
    saveStory,
    initialIntroductionStep,
    storyStructure,
    moveToNext,
    refetch,
}) => {

    const [introductionStep, setIntroductionStep] = useState<number>(initialIntroductionStep ? Number(initialIntroductionStep) : 1)
    const [confrontationStep, setConfrontationStep] = useState<number>(initialStory?.confrontationStep ? Number(initialStory?.confrontationStep) : 1)
    
    const [selectedCharacter, setSelectedCharacter] = useState<CharacterInterface|null>(null);
    
    const [storySetting, setStorySetting] = useState<string>(initialStory?.setting ?? "");

    // 1ST QUESTION
    const [openAddProtagonistModal, setOpenAddProtagonistModal] = useState<boolean>(false);
    const [protagonistSuggestions, setProtagonistSuggestions] = useState<CharacterInterface[]>([]);
    const [protagonist, setProtagonist] = useState();
    const [selectedProtagonist, setSelectedProtagonist] = useState<[]>([]);
    const [newProtagonist, setNewProtagonist] = useState<ProtagonistInterface[]>([]);

    // 2ND QUESTION
    const [openWhatProtagonistWantModal, setOpenWhatProtagonistWantModal] = useState<boolean>(false);
    const [selectedProtagonistWants, setSelectedProtagonistWants] = useState<[]>([]);
    const [newProtagonistWant, setNewProtagonistWant] = useState<[]>([]);

    // 3RD QUESTION
    const [openWhoDoesNotHaveProtagonistGoal, setOpenWhoDoesNotHaveProtagonistGoal] = useState<boolean>(false);

    // 4TH QUESTION
    const [openProtagonistGoalObstacle, setOpenProtagonistGoalObstacle] = useState<boolean>(false);

    // 5TH QUESTION
    const [selectedCharacterSuggestion, setSelectedCharacterSuggestion] = useState<ProtagonistCharacteristicsInterface|null>(null);
    const [openProtagonistWeaknessStrength, setOpenProtagonistWeaknessStrength] = useState<boolean>(false);

    const dynamicJwtToken = getAuthToken();

    useEffect(() => {
        setProtagonistSuggestions(storyStructure?.protagonistSuggestions ?? []);
        setNewProtagonist(storyStructure?.protagonists ?? []);
        setConfrontationStep(initialStory?.confrontationStep || 0)
    }, [initialStory]);

    useEffect(() => {
        setIntroductionStep(initialIntroductionStep || 1)
    }, [initialIntroductionStep]);

    const getProtagonistSuggestions = async () => {        

        try {            
            let { tonePrompt, stakesPrompt, expositionPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(initialStory);
            let prompt = initialStory.overview ? newProtagonistPrompt : newProtagonistNoOverviewPrompt

            let payload = {
                genre: genrePrompt,
                suspenseTechnique: initialStory.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStory.suspenseTechnique?.description,
                thematicElement: thematicElementsPrompt,
            }

            if (initialStory.overview) {
                payload.storyTitle = initialStory.title;
                payload.overview = initialStory.overview;
            }

            showPageLoader();

            const response = await queryLLM(prompt, payload);     

            if (!response) {
                return
            }

            let body = response?.protagonistSuggestions.map(suggestion => {
                return {
                    ...suggestion,
                    id: uuidv4()
                }
            })
            setProtagonistSuggestions(body)
            setOpenAddProtagonistModal(true);


        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const triggerWhatProtagonistWantModal = async (character: CharacterInterface) => {
        
        try {            
            if (!character?.protagonistGoalSuggestions) {  
                showPageLoader();          
                const response = await getWhatProtagonistWantSuggestions(character);
                if (!response?.protagonistGoalSuggestions) {
                    toast.error("Kindly try again please, network error");
                    return;
                }
                
                let characterUpdated = await updateCharacter({
                    protagonistGoalSuggestions: response?.protagonistGoalSuggestions,
                    confrontationStep: 1,
                    storyId: initialStory.id
                }, character?.id);
                refetch();

                if (characterUpdated) {
                    setOpenWhatProtagonistWantModal(true);
                    refetch();
                }
            }
            setSelectedCharacter(character);
            setOpenWhatProtagonistWantModal(true);
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const triggerWhoDoesNotHaveProtagonistGoalModal = (character: CharacterInterface) => {
        setSelectedCharacter(character);
        setOpenWhoDoesNotHaveProtagonistGoal(true);
    }

    const triggerProtagonistGoalObstacleModal = (character: CharacterInterface) => {
        setSelectedCharacter(character);
        setOpenProtagonistGoalObstacle(true)
    }

    const getWhatProtagonistWantSuggestions = async (character: CharacterInterface) => {
              
        try {
            let { genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(initialStory);
    
            let question = `What does the character want? and Who has it`;
            let protagonistCount = storyStructure?.protagonists.length;
    
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
            After introducing the protagonist, We currently trying to the next question in order to explore our character and the question is {question}, so you would generate at least 7 suggestions answers to the question. 
            Analyze the current character, protagonists, genre, suspense technique, thematic element & option, and also ensure you suggestions relate to these information. 
            The suggestions should show the protagonist's motivations, desires, and relationships.
            We have {protagonistCount} and the current protagonist or character we discussing is {character}.
    
            Return your response in a JSON format with the following keys:
            - protagonistGoalSuggestions: an array of objects, each containing:
              - "whatTheyWant" (what the protagonist desires)
              - "whoHasIt" (who or what holds what they want)
    
            Please ensure the only key in the object is the protagonistGoalSuggestions key only.
            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
            Ensure you response is a json object string, we need to avoid the SyntaxError: Unexpected token error after parsing the response.
    
            current character: {character}
            all protagonists: {protagonists}
            question: {question}
            number of protagonist: {protagonistCount}
            genre: {genre}
            thematic element & option: {thematicElement}
            suspense technique: {suspenseTechnique}
            suspense technique description: {suspenseTechniqueDescription}
            `;            

            const response = await queryLLM(prompt, {
                protagonistCount, 
                character: `${character?.name}: ${character?.backstory}.`,
                protagonists: storyStructure?.protagonists?.map((protagonist) => `${protagonist?.name}: ${protagonist?.backstory}.`)?.join(" "),
                question,
                genre: genrePrompt,
                suspenseTechnique: initialStory.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStory.suspenseTechnique?.description,
                thematicElement: thematicElementsPrompt,
            });  
            
            if (!response) {
                toast.error("Try again there was an issue");        
                return false;
            }
    
            return response;            
        } catch (error) {
            console.error(error);            
        }
    }

    const openStrengthAndWeaknessModal = async (character: CharacterInterface) => {
        // let payload = character;
        // let imageUrl;
        // if (!character?.imageUrl) {
        //     imageUrl = await updateCharacterImage(character);  
        //     if (imageUrl) {                
        //         await saveCharacterImage(imageUrl, character?.id);   
        //         refetch();   
        //     }   
        // }

        // let suggestions = storyStructure.protagonistWeaknessStrengthSuggestions.find(protagonist => protagonist.name === character?.name);
        // setSelectedCharacterSuggestion(suggestions);

        // if (imageUrl) {            
        //     payload = {...payload, imageUrl}
        // }
        setSelectedCharacter(character);
        setOpenProtagonistWeaknessStrength(true);
    }

    const updateCharacterImage = async (character: CharacterInterface) => {
        try {
          console.log({initialStory, character});
      
          showPageLoader();
          let prompt = await mergeStorytellingFormWithIdea(character, initialStory)
          if (!prompt) {
            return;
          }
      
          const tool = new DallEAPIWrapper({
            n: 1,
            model: "dall-e-3",
            // apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY 
            apiKey: process.env.NEXT_PUBLIC_OPENAI_GPT_API_KEY 
          });
          
          const imageUrl = await tool.invoke(prompt);
          console.log(imageUrl);
          return imageUrl ?? null
          
        } catch (error) {
          console.error(error); 
          return null;
        }finally{
          hidePageLoader();
        }
    }

    const saveCharacterImage = async (imageUrl: string, characterId: string) => {
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/characters/${characterId}`;

            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${dynamicJwtToken}`
                },
                body: JSON.stringify({
                    imageUrl: imageUrl,
                    storyId: initialStory.id
                })
            });

            const json = await res.json();
            if (json) {                
                refetch();                    
            }

        } catch (error) {
            console.log(error);            
        }
    }    

    const test = async () => {

        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/verify/7E7w2f6qJuh7yUoA4VsEUydSJqb1kSX3FeycSLtJSUKS`;

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${dynamicJwtToken}`
            },
            body: JSON.stringify({
                storyId: initialStory.id
            })
        });

        // const res = await fetch(`/transactions/create-intent/${initialStory?.id}`, { method: 'POST' });
        const json = await res.json();
        console.log(json);
    }

    const updateStorySetting = async () => {
        try {
            showPageLoader();
            const storyStarterSaved = await saveStory({ 
                setting: storySetting
            });   
            refetch();
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const validateStep = () => {
        if (!initialStory?.setting) {
            toast.error("Kindly provide the story setting");
            return;
        }
        moveToNext();
    }
    
    return (
        <div>
            <div className='bg-gray-50 rounded-2xl'>
                <div>
                    <div className='border-b p-5'>
                        <h1 className="font-bold text-2xl text-center mb-3">Act 1 - Meet the Protagonist</h1>
                        <p className="text-xs italic font-light text-gray-600 text-center">
                        "The introduction to protagonist's inner conflict."                
                        </p>
                    </div>
                </div>

                
                <div className='p-5 '>
                    {/* <div className="mb-4">
                        <p className="text-xs font-bold text-gray-800 mb-1">Story Setting</p>
                        <div className='flex gap-4 items-center w-3/4 mb-4'>
                            <Input  
                            className='text-xs'
                            defaultValue={storySetting}
                            onKeyUp={(e) => setStorySetting(e.target.value)} 
                            onPaste={(e) => setStorySetting(e.target.value)} 
                             />
                            
                            <Button onClick={updateStorySetting}>Save</Button>                            
                        </div>

                       { !initialStory?.setting && 
                        <>
                            <p className="text-xs font-bold mb-1 text-gray-500">Suggestions</p>
                            <div className="flex flex-wrap gap-3">
                                {
                                    initialStory?.storyStructure?.settingSuggestions.map((setting: string, index: number) => (
                                        <p onClick={() => setStorySetting(setting)} className='py-2 px-4 rounded-2xl cursor-pointer text-[10px] bg-custom_light_green' key={index}>{setting}</p>
                                    ))
                                }
                            </div>
                        </>
                        }

                    
                    </div> */}

                    {initialStory?.setting && 
                    <Accordion type="single" collapsible>

                        {introductionStep > 0 && 
                            <AccordionItem value="item-1" className="mb-3 border-none">
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>
                                    Who is the protagonist? 
                                    {/* (Character Introduction) */}
                                </AccordionTrigger>
                                
                                <AccordionContent>
                                    
                                    {/* {
                                        storyStructure?.protagonists?.length &&
                                        <div className='mb-3 text-gray-500'>
                                            {
                                                storyStructure?.protagonists.length === 1 &&
                                                <p className="mb-2 text-xs">
                                                    {storyStructure?.protagonists?.map(protagonist => `${protagonist.name}: ${protagonist.backstory} `).join(" ")}
                                                </p>
                                            }
                                            {
                                                storyStructure?.protagonists.length > 1 &&                                        
                                                <ul className="mb-2 text-xs">
                                                    {storyStructure?.protagonists?.map((protagonist, index) => (
                                                        <li className='text-xs flex items-center gap-2 mb-1' key={`_${index}_`}> 
                                                            <div className='flex items-start'>
                                                                <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                                                            </div>
                                                            <span>{`${protagonist.name}: ${protagonist.backstory}`}</span>
                                                        </li>                                                
                                                    ))}
                                                </ul>
                                            }
                                        </div>
                                    }

                                    {
                                        storyStructure?.protagonistSuggestions && 
                                        <Button size='sm' className='mr-5 bg-yellow-300 border text-gray-800 border-gray-800' 
                                        onClick={() => getProtagonistSuggestions()}
                                        >
                                            Reset 
                                            <Edit className='ml-2 w-4 h-4 '/>
                                        </Button>
                                    } */}

                                    {
                                        storyStructure?.protagonistSuggestions && 
                                        introductionStep < 2 &&
                                        <Button size='sm' variant="outline" className='mr-5 mt-5 text-custom_green border-custom_green' 
                                        onClick={() => setOpenAddProtagonistModal(true)}
                                        >
                                            Modify 
                                            <Edit className='ml-2 w-4 h-4 '/>
                                        </Button>
                                    }

                                    <div className="grid md:grid-cols-1 gap-5 lg:grid-cols-2 mt-4">
                                        {
                                            initialStory?.characters?.filter(character => character?.isProtagonist)?.map((protagonist, index) => (                                                                           
                                                <CharacterComponent key={index} hideBtn={true} character={protagonist} clickEvent={triggerWhatProtagonistWantModal}/>
                                            ))
                                        }                                        
                                    </div>


                                </AccordionContent>                        
                            </AccordionItem>
                        }

                        {introductionStep > 1 && 
                        // storyStructure?.protagonistGoalSuggestions &&
                            <AccordionItem value="item-2" className="mb-3 border-none">
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>
                                    What does the character(s) want & Who has what they want? 
                                    
                                    {/* {
                                    storyStructure?.protagonists?.length && storyStructure?.protagonists?.length > 1 &&
                                        <p className='text-md'>
                                            What common goal do these characters share or what conflicts do they have with each other? 
                                        </p>
                                    }
                                    {
                                    storyStructure?.protagonists?.length && storyStructure?.protagonists?.length === 1 &&
                                        <p>
                                            What does {storyStructure?.protagonists.map(item => item.name)} want & Who has what {storyStructure?.protagonists.map(item => item.name)} want? 
                                        </p>
                                    } */}
                                </AccordionTrigger>
                                
                                <AccordionContent>
                                    <div className="grid md:grid-cols-1 gap-5 lg:grid-cols-2 mt-4">
                                        {
                                            initialStory?.characters?.filter(character => character?.isProtagonist)?.map((protagonist, index) => (                                                                           
                                                <CharacterComponent key={index} character={protagonist} clickEvent={triggerWhatProtagonistWantModal}/>
                                            ))
                                        }                                        
                                    </div>                                                    
                                </AccordionContent>                        
                                
                            </AccordionItem>
                        }

                        {
                            introductionStep > 2 &&
                            <AccordionItem value="item-3" className="mb-3 border-none">
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>
                                    Who does not have what they want? 
                                    {/* (Conflict and Stakes) */}
                                </AccordionTrigger>
                                <AccordionContent>              

                                    <div className="grid md:grid-cols-1 gap-5 lg:grid-cols-2 mt-4">
                                        {
                                            initialStory?.characters?.filter(character => character?.isProtagonist)?.map((protagonist, index) => (                                                                           
                                                <CharacterComponent key={index} character={protagonist} clickEvent={triggerWhoDoesNotHaveProtagonistGoalModal}/>
                                            ))
                                        }                                        
                                    </div>

                                </AccordionContent>
                            </AccordionItem>
                        }

                        {
                            introductionStep > 3 && 
                            // storyStructure?.protagonistGoalObstacleSuggestions &&
                            <AccordionItem value="item-4" className="mb-3 border-none">
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>
                                    What obstacles or challenges does the character(s) face in achieving their goal?
                                </AccordionTrigger>
                                <AccordionContent>
                                    {/* {
                                        storyStructure?.protagonistGoalObstacle &&
                                        <p className="text-xs mb-3">
                                            { storyStructure?.protagonistGoalObstacle }
                                        </p>
                                    }
                                    <Button size='sm' className='mr-5 bg-yellow-300 text-gray-800 border border-gray-800' 
                                        onClick={() => setOpenProtagonistGoalObstacle(true)}
                                        >
                                        Reply 
                                        <Edit className='ml-2 w-4 h-4'/>
                                    </Button> */}

                                    <div className="grid md:grid-cols-1 gap-5 lg:grid-cols-2 mt-4">
                                        {
                                            initialStory?.characters?.filter(character => character?.isProtagonist)?.map((protagonist, index) => (                                                                           
                                                <CharacterComponent key={index} character={protagonist} clickEvent={triggerProtagonistGoalObstacleModal}/>
                                            ))
                                        }                                        
                                    </div>

                                </AccordionContent>
                            </AccordionItem>
                        }

                        {
                            introductionStep > 4 && 
                            // storyStructure?.protagonistWeaknessStrengthSuggestions &&
                            <AccordionItem value="item-5" className="mb-3 border-none">
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>
                                    What are the character's strengths and weaknesses? 
                                    {/* (Character Traits) */}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid md:grid-cols-1 gap-5 lg:grid-cols-2 mt-4">
                                        {
                                            initialStory?.characters?.filter(character => character?.isProtagonist)?.map((protagonist, index) => (                                                                           
                                                <CharacterComponent key={index} character={protagonist} clickEvent={openStrengthAndWeaknessModal}/>
                                            ))
                                        }                                        
                                    </div>

                                </AccordionContent>
                            </AccordionItem>
                        }

                    </Accordion>}

                    <div className="flex items-center justify-between mt-4">
                        <Button size='sm' variant="outline" className='mr-5 text-custom_green border-custom_green' 
                        disabled={true}
                        >
                            Prev
                            <ArrowLeft className='ml-2 w-4 h-4'/>
                        </Button>

                        {/* <div ref={el} />
                        <Button onClick={test}>Verify</Button> */}

                        <Button size='sm' variant="outline" className='mr-5 text-custom_green border-custom_green' 
                        disabled={introductionStep < 5 ? true : false || confrontationStep < 1}
                        onClick={validateStep}
                        >
                            Next
                            <ArrowRight className='ml-2 w-4 h-4 '/>
                        </Button>
                    </div>
                </div>
            </div>
            

            {/* 1ST QUESTION */}

            { 
                // protagonistSuggestions && protagonistSuggestions.length > 0 &&
                <AddProtagonistComponent 
                    newProtagonist={newProtagonist} 
                    setNewProtagonist={setNewProtagonist}
                    protagonistSuggestions={protagonistSuggestions}
                    openAddProtagonistModal={openAddProtagonistModal}
                    setOpenAddProtagonistModal={setOpenAddProtagonistModal}
                    initialStory={initialStory}
                    saveStory={saveStory}
                    selectedProtagonist={selectedProtagonist}
                    setSelectedProtagonist={setSelectedProtagonist}
                    refetch={refetch}
                />
            }       


            {/* 2ND QUESTION */}
            <WhatProtagonistWantComponent 
                openWhatProtagonistWantModal={openWhatProtagonistWantModal}
                setOpenWhatProtagonistWantModal={setOpenWhatProtagonistWantModal}                
                initialStory={initialStory}
                selectedCharacter={selectedCharacter}
                saveStory={saveStory}
                refetch={refetch}
            />

            {/* 3RD QUESTION */}
            <WhoDoesNotHaveProtagonistGoalComponent 
                openWhoDoesNotHaveProtagonistGoal={openWhoDoesNotHaveProtagonistGoal}
                setOpenWhoDoesNotHaveProtagonistGoal={setOpenWhoDoesNotHaveProtagonistGoal}                
                initialStory={initialStory}
                selectedCharacter={selectedCharacter}
                saveStory={saveStory}
                refetch={refetch}   
            />

            {/* 4TH QUESTION */}
            <ProtagonistGoalObstacleComponent 
                openProtagonistGoalObstacle={openProtagonistGoalObstacle}
                setOpenProtagonistGoalObstacle={setOpenProtagonistGoalObstacle}                
                initialStory={initialStory}
                selectedCharacter={selectedCharacter}
                saveStory={saveStory}
                refetch={refetch}
            />

            {/* 5TH QUESTION */}
            <ProtagonistWeaknessStrength
                openProtagonistWeaknessStrength={openProtagonistWeaknessStrength}
                setOpenProtagonistWeaknessStrength={setOpenProtagonistWeaknessStrength}
                initialStory={initialStory}
                selectedCharacter={selectedCharacter}
                selectedCharacterSuggestion={selectedCharacterSuggestion}
                saveStory={saveStory}
                refetch={refetch}
            />

            

        </div>
    )
}

export default ProtagonistIntroductionComponent
