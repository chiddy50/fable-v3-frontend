"use client";

import { StoryInterface } from '@/interfaces/StoryInterface';
import { extractTemplatePrompts, streamLLMResponse } from '@/services/LlmQueryHelper';
import React, { useEffect, useRef, useState } from 'react'
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { Cog, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { makeRequest } from '@/services/request';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChatGroq } from '@langchain/groq';

interface RisingActionAndMidpointComponentProps {
  initialStory: StoryInterface;
  refetch: () => void;
  generating: boolean;
  updateStoryStructure: (payload: object) => Promise<boolean>;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

const RisingActionAndMidpointComponent: React.FC<RisingActionAndMidpointComponentProps> = ({
    initialStory,
    refetch,
    generating, 
    setGenerating,
    updateStoryStructure
  }) => {
    const [openStoryModal, setOpenStoryModal] = useState<boolean>(false);
    const [storyIntroduction, setStoryIntroduction] = useState<string>("");
    const [wordCount, setWordCount] = useState<string>("");
    
    const [risingActionAndMidpoint, setRisingActionAndMidpoint] = useState<string>(initialStory?.storyStructure?.risingActionAndMidpoint ?? "");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const dynamicJwtToken = getAuthToken();

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

    const writeRisingActionAndMidpoint = async () => {
        let { 
            genrePrompt, thematicElementsPrompt, otherCharactersPrompt, 
            whatCharacterWantAndWhoHasItPrompt, protagonistsPrompt, protagonistObstaclePrompt, 
            protagonistGoalMotivationsPrompt, whatTheCharacterWantPrompt, whoDoesNotHaveCharacterGoalPrompt,
            howCharacterGoalChangeRelationshipPrompt, emotionTriggerEventPrompt, howProtagonistOvercomeObstaclePrompt
        } = extractTemplatePrompts(initialStory);
        try {

          const prompt = `
            You are a professional storyteller and narrative designer with expertise in creating compelling narratives, intricate characters, and captivating worlds. Your task is to generate a powerful *Inciting Incident* that will trigger the story's main conflict and propel the protagonist into action. Use the provided context to create a cohesive story outline that adheres to the three-act structure.

            **CONTEXT**
            We have already introduced the protagonist and their ordinary world: {introduceProtagonistAndOrdinaryWorld}.
            We have already written the inciting incident: {incitingIncident}.
            We have already written the First Plot Point: {firstPlotPoint}.

            Generate the Rising Action & Midpoint of the story. 
            The Rising Action and Midpoint sections of a story typically involve the character facing obstacles and challenges that test their abilities, leading to a turning point (the Midpoint)            
             
            To help write about the Rising Action & Midpoint part of the story, the following question and answer can be helpful:
            - What obstacles or challenges does the character(s) face in achieving their goal? {protagonistObstacle}
            - How does the character overcome obstacles? {howProtagonistOvercomeObstacle}
            - How do the character's relationships and conflicts change as they go after their goal? {howCharacterGoalChangeRelationship}
            - What motivates or drives the protagonist(s) to pursue their goal? {protagonistGoalMotivation}
            - What events or circumstances trigger strong emotions in the character? {emotionTriggerEvent}

            **OUTPUT**
            Generate the Rising Action & Midpoint of the story. Use vivid descriptions and dialogue when necessary. 
            Ensure the transition from the protagonist's introduction & ordinary world, inciting incident, First Plot Point to the Rising Action & Midpoint is smooth.

            - No titles or additional commentary, just the story.
            - Maintain the genre's tone: {genre}.

            **INPUT**
            Protagonists: {protagonists}
            Other characters: {otherCharacters}
            Setting: {setting}
            Genre: {genre}
            Thematic element & option: {thematicElement}
            Suspense technique: {suspenseTechnique}
            Suspense technique description: {suspenseTechniqueDescription}
        `;

        setGenerating(true);

        const response = await streamLLMResponse(prompt, {
          introduceProtagonistAndOrdinaryWorld: initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld,
          incitingIncident: initialStory?.storyStructure.incitingIncident,
          firstPlotPoint: initialStory?.storyStructure.firstPlotPoint,
          
          protagonistObstacle: protagonistObstaclePrompt,
          howProtagonistOvercomeObstacle: howProtagonistOvercomeObstaclePrompt,
          howCharacterGoalChangeRelationship: howCharacterGoalChangeRelationshipPrompt,
          protagonistGoalMotivation: protagonistGoalMotivationsPrompt,
          emotionTriggerEvent: emotionTriggerEventPrompt,

          protagonists: protagonistsPrompt,
          otherCharacters: otherCharactersPrompt,
          setting: initialStory?.setting,
          genre: genrePrompt,
          suspenseTechnique: initialStory?.suspenseTechnique?.value,
          suspenseTechniqueDescription: initialStory?.suspenseTechnique?.description,
          thematicElement: thematicElementsPrompt,
        });

          if (!response) {
            setGenerating(false);
            toast.error("Try again please");
            return;
          }
  
          let text = ``
          for await (const chunk of response) {
            text += chunk;   
            setRisingActionAndMidpoint(text);          
          }      
          setGenerating(false);

        } catch (error) {
          setGenerating(false);
          console.error(error);            
        }
    }

    const saveRisingActionAndMidpoint = async () => {
      try {
        await updateStoryStructure({ risingActionAndMidpoint });  
      } catch (error) {
        console.error(error);        
      }
    }


    const generateStory = async () => {
      let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt } = extractTemplatePrompts(initialStory);

      // Who is the protagonist? 
      // What does the character(s) want & Who has what they want?
      // Who does not have what they want? 
      // What obstacles or challenges does the character(s) face in achieving their goal?
      // What are the character's strengths and weaknesses?

      let question = initialStory.characters.length > 1 ? `Who are the protagonists? The protagonists are` : `Who is the protagonist? The protagonist is`
      try {


          // Use this information to create a detailed story outline or overview. Capture the emotional journey of the protagonist, the conflicts they face, and how they evolve throughout the story.
          // Return the outline in the form of a three-act summary, ensuring each act transitions smoothly into the next. Provide a cohesive narrative that ties all the elements together.
          const prompt = `
          You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
          You will use the provided information to generate a cohesive story outline that follows the three-act structure.
          We have been able to answer the following questions:            
          ${question} {protagonists}

          I need you to write the opening lines or introduction of the story using the information provided, just introduce the character and their setting.

          **OUTPUT**
          Just introduce the character and their setting and return in ${wordCount} words. Ensure your response is in ${wordCount} words

          **INPUT**
          the protagonists: {protagonists}
          other characters: {otherCharacters}
          story setting: {setting}
          word count: {wordCount},
          genre: {genre}
          thematic element & option: {thematicElement}
          suspense technique: {suspenseTechnique}
          suspense technique description: {suspenseTechniqueDescription}
          `;
  
        
          const response = await getStreamResponse(prompt, {
              wordCount: {wordCount},
              setting: initialStory.setting,
              protagonists: initialStory.characters.filter(character => character.isProtagonist ).map((item) => `${item.name}: ${item.backstory}.`).join(" "),
              otherCharacters: otherCharactersPrompt,
              genre: genrePrompt,
              suspenseTechnique: initialStory.suspenseTechnique?.value,
              suspenseTechniqueDescription: initialStory.suspenseTechnique?.description,
              thematicElement: thematicElementsPrompt,
          });

          console.log(response);
          
      } catch (error) {
          console.error(error);            
      }
    }

    const generateOutline = async () => {
      let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt } = extractTemplatePrompts(initialStory);

      // Who is the protagonist? 
      // What does the character(s) want & Who has what they want?
      // Who does not have what they want? 
      // What obstacles or challenges does the character(s) face in achieving their goal?
      // What are the character's strengths and weaknesses?

      let question = initialStory.characters.length > 1 ? `Who are the protagonists? The protagonists are` : `Who is the protagonist? The protagonist is`
      try {
          const prompt = `
          You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
          We have been able to answer the following questions:            
          ${question}

          I need you to write an overview of the story using the information provided.

          the protagonists: {protagonists}
          other characters: {otherCharacters}
          genre: {genre}
          thematic element & option: {thematicElement}
          suspense technique: {suspenseTechnique}
          suspense technique description: {suspenseTechniqueDescription}
          `;
  
          const response = await streamLLMResponse(prompt, {
              protagonists: initialStory.characters.filter(character => character.isProtagonist ).map((item) => `${item.name}: ${item.backstory}.`).join(" "),
              otherCharacters: otherCharactersPrompt,
              genre: genrePrompt,
              suspenseTechnique: initialStory.suspenseTechnique?.value,
              suspenseTechniqueDescription: initialStory.suspenseTechnique?.description,
              thematicElement: thematicElementsPrompt,
          });

          console.log(response);
          
      } catch (error) {
          console.error(error);            
      }
    }

    const getStreamResponse = async (prompt: string, payload: object) => {
      try {      
         const llm = new ChatGroq({
            apiKey: "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", //process.env.NEXT_PUBLIC_GROQ_API_KEY,
            // model: "llama3-70b-8192",
            model: "llama-3.1-70b-versatile"           
         });
     
          const startingPrompt = ChatPromptTemplate.fromMessages([
              ["system", "You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also an expert at answering any question directly even if its not related to storytelling. And you always follow instruction"],
              ["human", prompt],
          ]);
      
          const chain = startingPrompt.pipe(llm).pipe(new StringOutputParser());
      
          const response = await chain.stream(payload);
      
          setStoryIntroduction("")
          let text = ``
          for await (const chunk of response) {
              console.log(chunk);   
              text += chunk;     
              setStoryIntroduction(text)        
          }
     
         return text;
      } catch (error) {
         console.error(error);      
      }
    }

    return (
      <>
        <AccordionItem value="item-1" className="mb-3 border-none bg-gray-50 rounded-2xl">
          <AccordionTrigger className='text-sm bg-gray-50 px-4 rounded-2xl text-gray-700'>
            <p className='font-bold '>
            Rising Action & Midpoint
            </p>              
          </AccordionTrigger>   
          <AccordionContent>
            <div className='bg-gray-50 px-5 rounded-2xl mt-1'>
              <p className='text-xs'>
              The protagonist faces escalating challenges, leading to a pivotal moment that shifts the story.       
              </p>  
          
              <div className='mt-5'>
                <Button className='' disabled={generating} onClick={writeRisingActionAndMidpoint}>
                Generate 
                <Cog className='w-4 h-4 ml-2' />
                </Button>
              </div>
              
              <div className='mt-5'>

                <textarea 
                rows={10} 
                ref={textareaRef}
                onFocus={(e) => {
                  setRisingActionAndMidpoint(e.target.value);
                  adjustHeight(); // Adjust height on every change
                }}
                disabled={generating}
                onChange={(e) => {
                  setRisingActionAndMidpoint(e.target.value);
                  adjustHeight(); // Adjust height on every change
                }}
                value={risingActionAndMidpoint} 
                placeholder=''
                className='py-2 px-4 mb-4 outline-none border text-xs rounded-lg w-full leading-5' 
                />

                <div className='mt-3'>
                  <Button 
                  disabled={!risingActionAndMidpoint || generating}                    
                  className='bg-custom_green text-white hover:bg-custom_green' onClick={saveRisingActionAndMidpoint}>
                      Save 
                      <Save className='w-4 h-4 ml-2' />
                  </Button>
                </div>
              </div>            
            </div> 
              
          </AccordionContent>
        </AccordionItem>

        <Dialog open={openStoryModal} onOpenChange={setOpenStoryModal}>
          <DialogContent className='xs:min-w-[95%] sm:min-w-[80%] md:min-w-[70%] lg:min-w-[70%]'>
            <DialogHeader>
              <DialogTitle className=''>Story Introduction</DialogTitle>
              <DialogDescription></DialogDescription>
              <textarea rows={10} 
                onChange={(e) => setStoryIntroduction(e.target.value) } 
                value={storyIntroduction} 
                placeholder=''
                className='py-2 px-4 mb-4 outline-none border text-xs rounded-lg w-full' 
              />

              <div className="mb-4">
                <Select onValueChange={value => setWordCount(value)}>
                    <SelectTrigger className="w-full outline-none text-xs">
                        <SelectValue placeholder="Choose Word Count" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Word Count</SelectLabel>
                            {
                                ["100", "150", "200", "250"].map((count: string, index: number) => (
                                    <SelectItem key={index} value={count}>{count}</SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
              </div>

              <Button onClick={generateStory} className="mt-5">Generate Introduction</Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    )
}

export default RisingActionAndMidpointComponent
