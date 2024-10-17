"use client";

import { StoryInterface } from '@/interfaces/StoryInterface';
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { extractTemplatePrompts, streamLLMResponse } from '@/services/LlmQueryHelper';
import {
  Accordion
} from "@/components/ui/accordion"
import IntroduceProtagonistAndOrdinaryWorldComponent from './StoryGeneration/IntroduceProtagonistAndOrdinaryWorldComponent';
import IncitingIncidentComponent from './StoryGeneration/IncitingIncidentComponent';
import FirstPlotPointComponent from './StoryGeneration/FirstPlotPointComponent';
import RisingActionAndMidpointComponent from './StoryGeneration/RisingActionAndMidpointComponent';
import PinchPointsAndSecondPlotPointComponent from './StoryGeneration/PinchPointsAndSecondPlotPointComponent';
import ClimaxAndFallingActionComponent from './StoryGeneration/ClimaxAndFallingActionComponent';
import ConcludeResolutionComponent from './StoryGeneration/ConcludeResolutionComponent';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { makeRequest, navigateToStoryStep } from '@/services/request';
import code from '@code-wallet/elements';
import { Card, CardContent } from '../ui/card';
import { useRouter } from 'next/navigation';

interface GenerateStoryComponentProps {
  initialStory: StoryInterface;
  refetch: () => void;
}

const GenerateStoryComponent: React.FC<GenerateStoryComponentProps> = ({
  initialStory,
  refetch
}) => {

  const [storyIntroduction, setStoryIntroduction] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const dynamicJwtToken = getAuthToken();

  const { push } = useRouter();

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
      
      if (button && initialStory) {   
        console.log({el});
           
        button?.mount(el?.current!);

        button?.on('invoke', async () => {
          // Get a payment intent from our own server
          let url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/create-intent/${initialStory?.id}`;
  
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${dynamicJwtToken}`,
            },
            body: JSON.stringify({
              narration: "Create Story",
              type: "create-story",
              amount: 0.25 
            })
          });
            
          const json = await res.json();
          console.log(json);
          const clientSecret = json?.data?.clientSecret;
          
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
              let response = await makeRequest({
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/confirm/${intent}`,
                method: "POST", 
                body: {
                  storyId: initialStory?.id,
                  amount, clientSecret, currency, destination, locale, mode,
                  type: 'create-story'

                }, 
                token: dynamicJwtToken,
              });

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
  
          }
          return true; // Return true to prevent the browser from navigating to the optional cancel URL provided in the confirmParams
        });
      }
    }

  }, [mounted]);

  useEffect(() => {
    if(!initialStory){
        refetch();
    }
  }, [initialStory]);


  const introduceProtagonistAndOrdinaryWorld = async () => {
    let wordCount = 250
    let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt, whatCharacterWantAndWhoHasItPrompt, protagonistsPrompt } = extractTemplatePrompts(initialStory);

    // Who is the protagonist? 
    // What does the character(s) want & Who has what they want?

    let question = initialStory?.characters?.length > 1 ? `Who are the protagonists? The protagonists are` : `Who is the protagonist? The protagonist is`
    let question2 = initialStory?.characters?.length > 1 ? `What does the characters want & Who has what they character want` : `What does the character want & Who has what the character want`
    try {

      // Use this information to create a detailed story outline or overview. Capture the emotional journey of the protagonist, the conflicts they face, and how they evolve throughout the story.
      // Return the outline in the form of a three-act summary, ensuring each act transitions smoothly into the next. Provide a cohesive narrative that ties all the elements together.
      const prompt = `
      You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
      Capture the emotional journey of the protagonist, the conflicts they face, and how they evolve throughout the story.
      You will use the provided information to generate a cohesive story outline that follows the three-act structure.
      We have been able to answer the following questions:            
      - ${question} {protagonists}
      - ${question2} {whatCharacterWantAndWhoHasIt}

      **OUTPUT**
      Introduce the main characters, setting, and the protagonist's ordinary world before the story's main conflict begins. Ensure your response does not contain any title or just the story you have been instructed to write. 
      I need you to write the opening lines or introduction of the story using the information provided, just introduce the character and their setting.

      **INPUT**
      the protagonists: {protagonists}
      What does the character want & Who has what the character want: {whatCharacterWantAndWhoHasIt}
      other characters: {otherCharacters}
      story setting: {setting}
      genre: {genre}
      thematic element & option: {thematicElement}
      suspense technique: {suspenseTechnique}
      suspense technique description: {suspenseTechniqueDescription}
      `;
      // word count: {wordCount},

    
      const response = await streamLLMResponse(prompt, {
        wordCount: {wordCount},
        setting: initialStory?.setting,
        protagonists: protagonistsPrompt,
        whatCharacterWantAndWhoHasIt: whatCharacterWantAndWhoHasItPrompt,
        otherCharacters: otherCharactersPrompt,
        genre: genrePrompt,
        suspenseTechnique: initialStory?.suspenseTechnique?.value,
        suspenseTechniqueDescription: initialStory?.suspenseTechnique?.description,
        thematicElement: thematicElementsPrompt,
      });
      if (!response) {
        return;
      }

      let text = ``
      for await (const chunk of response) {
        console.log(chunk);   
        text += chunk;   
        setStoryIntroduction(text)          
      }

      console.log(response);
        
    } catch (error) {
      console.error(error);            
    }
  }

  const updateStoryStructure = async (payload: object): Promise<boolean> => {
    try {
      let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/structure/${initialStory?.id}`;
      showPageLoader();

      let response = await makeRequest({
        url,
        method: "PUT", 
        body: payload, 
        token: dynamicJwtToken,
      });
      if (response) {
        refetch();
        return true;
      }

      return false;
    } catch (error) {
        console.error(error);        
    }finally{
      hidePageLoader();
      return false;
    }
  }

  const navigate = async (currentStep: number, currentStepUrl: string) => {
    try {
      showPageLoader();

      let response = await navigateToStoryStep(initialStory?.id, {
          currentStep: currentStep,                    
          currentStepUrl: currentStepUrl ,
      });

      if (response) {
          push(`/dashboard/story-project?story-id=${initialStory.id}&current-step=${currentStepUrl}`)
      }
    } catch (error) {
        console.error(error);            
    }finally{
        hidePageLoader();
    }
  }

  return (
    <div>

      <h1 className="text-2xl text-center font-bold mb-2">Act 1: Setup (Beginning)</h1>
      <Accordion type="single" collapsible>     
        
        <IntroduceProtagonistAndOrdinaryWorldComponent 
          initialStory={initialStory}
          refetch={refetch}
          generating={generating} 
          setGenerating={setGenerating}
          updateStoryStructure={updateStoryStructure}
        />

        { initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld && 
          <IncitingIncidentComponent 
            initialStory={initialStory}
            refetch={refetch}
            generating={generating} 
            setGenerating={setGenerating}
            updateStoryStructure={updateStoryStructure}

          />
        }

        {
          initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld && 
          initialStory?.storyStructure?.incitingIncident &&
          <FirstPlotPointComponent 
          initialStory={initialStory}
          refetch={refetch}
          generating={generating} 
          setGenerating={setGenerating}
          updateStoryStructure={updateStoryStructure}
        />
        }

      </Accordion>

      {
        !initialStory?.isPaid && initialStory?.storyStructure?.firstPlotPoint &&
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
        initialStory?.isPaid &&
        initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld && 
        initialStory?.storyStructure?.incitingIncident &&        
        initialStory?.storyStructure?.firstPlotPoint &&        
        <div className='mt-10'>
          <h1 className="text-2xl text-center font-bold mb-2">Act 2: Confrontation (Middle)</h1>       

          { initialStory?.isPaid &&
            <Accordion type="single" collapsible>     
            
              <RisingActionAndMidpointComponent 
                initialStory={initialStory}
                refetch={refetch}
                generating={generating} 
                setGenerating={setGenerating}
                updateStoryStructure={updateStoryStructure}
              />

              {
                initialStory?.storyStructure?.risingActionAndMidpoint &&
                <PinchPointsAndSecondPlotPointComponent 
                  initialStory={initialStory}
                  refetch={refetch}
                  generating={generating} 
                  setGenerating={setGenerating}
                  updateStoryStructure={updateStoryStructure}
                />
              }


            </Accordion>
          }
        </div>
      }

      {
        initialStory?.isPaid &&
        initialStory?.storyStructure?.introduceProtagonistAndOrdinaryWorld && 
        initialStory?.storyStructure?.incitingIncident &&        
        initialStory?.storyStructure?.firstPlotPoint &&
        initialStory?.storyStructure?.risingActionAndMidpoint &&
        initialStory?.storyStructure?.pinchPointsAndSecondPlotPoint &&        
        <div className='mt-10'>
          <h1 className="text-2xl text-center font-bold mb-2">Act 3: Resolution (End)</h1>

          <Accordion type="single" collapsible>     
            
            <ClimaxAndFallingActionComponent 
              initialStory={initialStory}
              refetch={refetch}
              generating={generating} 
              setGenerating={setGenerating}
              updateStoryStructure={updateStoryStructure}
            />

            {               
              initialStory?.storyStructure?.climaxAndFallingAction &&        
              <ConcludeResolutionComponent 
                initialStory={initialStory}
                refetch={refetch}
                generating={generating} 
                setGenerating={setGenerating}
                updateStoryStructure={updateStoryStructure}
              />
            }
          </Accordion>
        </div>
      }

      <div className="my-7 flex justify-between items-center">
        <Button onClick={() => navigate(3, "create-characters")}>Back</Button>
        <Button>Proceed</Button>
      </div>


    </div>
  )
}

export default GenerateStoryComponent
