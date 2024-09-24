"use client";

import { CharacterInterface } from '@/interfaces/CharacterInterface';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ChatOpenAI, DallEAPIWrapper } from "@langchain/openai";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { StoryInterface } from '@/interfaces/StoryInterface';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { hidePageLoader, showPageLoader } from '@/lib/helper';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { CheckCircle2 } from 'lucide-react';
import EditProtagonistComponent from '../Character/EditProtagonistComponent';
import CharacterViewComponent from '../Character/CharacterViewComponent';
import EditSupportingCharacterComponent from '../Character/EditSupportingCharacterComponent';
import { navigateToStoryStep } from '@/services/request';
import { useRouter } from 'next/navigation';

interface CreateCharactersComponentProps {
  initialStoryData: StoryInterface;
  refetch: () => void;
}

const CreateCharactersComponent: React.FC<CreateCharactersComponentProps> = ({
  initialStoryData,
  refetch
}) => {
  console.log({initialStoryData});
  const [modalOpen, setModalOpen] = useState(false);
  const [editProtagonistModalOpen, setEditProtagonistModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterInterface>(null);

  const dynamicJwtToken = getAuthToken();

  useEffect(() => {
    if(!initialStoryData){
        refetch();
    }
  }, [initialStoryData]);

  const { push } = useRouter();

  const updateCharacterImage = async (story: StoryInterface, character: CharacterInterface) => {
    try {
      console.log({story, character});
  
      showPageLoader();
      let prompt = await mergeStorytellingFormWithIdea(character, story)
      if (!prompt) {
        hidePageLoader();
        return;
      }
  
      const tool = new DallEAPIWrapper({
        n: 1, // Default
        model: "dall-e-3", // Default
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      });
      
      const imageUrl = await tool.invoke(prompt);
      if (imageUrl) {      
        await saveImage(imageUrl, character?.id, story?.id);
        refetch()
      }
      
      console.log(imageUrl);
      
    } catch (error) {
      console.error(error); 
    }finally{
      hidePageLoader();
    }
  }

  const saveImage = async (imageUrl: string, characterId: string, storyId: string) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/edit-character`;

      const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${dynamicJwtToken}`
          },
          body: JSON.stringify({ imageUrl, characterId, storyId }) 
      });

      const json = await response.json();
      console.log(json);

      return null;
      
    } catch (error) {
      console.log(error);            
      return null;
    }
  }

  const mergeStorytellingFormWithIdea = async (character: CharacterInterface, story: StoryInterface) => {

    try {
      
      let { name, backstory, age, role, facialFeatures, gender, hair, skinTone } = character
      console.log({ name, backstory, age, role, facialFeatures, gender, hair, skinTone });
      // let promptText = `
      // Generate an image of a profile shot or character headshot of a character whose description is going to be providied.
      // * Character name: ${name}
      // * Facial features: ${facialFeatures}
      // * Age: ${age}
      // * Gender: ${gender}
      // * Skin tone: ${skinTone}
      // * hair: ${hair}
      // * Role: ${role}
      
      // The image should be:
      // * With a plain background and no writings in the background
      // * Realistic, resembling a photograph of a movie actor portraying the character (not cartoon, 2D, or animated)
      // The image should accurately represent the character's age, facial features, gender, skin tone, hair, and role. The character should be the only focal point in the image, with no background elements or distractions.
      // Ensure the image is just a single person or character no multiple characters in the image
      // Generate an image description that is allowed for OPENAI's safety system so that it can be used to generate an image.     
      // Kindly ensure to follow this instructions, the image must have a plain white background with only the character's profile shot or character headshot. 
      // Do not generate an image with two faces inside the image just one .   
      // `;
      // return promptText;
      
      const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
      const llm = new ChatOpenAI({ 
        openAIApiKey,
        model: "gpt-4o-mini", //"gpt-4-vision-preview",        
      });
  
      // * Character name: {character_name}
      // * Role: {character_role}

      // The image showcases a headshot of a 32-year-old male with a strong cinematic allure, 
      // reminiscent of a professional actor's profile picture. 
      // His chiseled facial features are accentuated by the striking contrast of his piercing blue eyes and well-defined, strong jawline. 
      // His skin bears an attractive bronze tone that exudes a natural, sun-kissed radiance. 
      // Tousled jet-black hair falls just to his shoulders in a seemingly effortless, messy style that adds to his rugged charisma. 
      // The background is a nondescript, solid color, placing the full emphasis on the man's captivating presence. 
      // There is an absence of text or any other background elements, ensuring that the focus remains solely on this character's realistic portrayal. Overall, the image carries the refined quality of a headshot designed for an actor's portfolio, with the character's age and distinct, handsome features clearly and convincingly represented.

      const startingTemplate = `
      Generate an image description for a profile shot or character headshot that meets the following criteria:

      * Facial features: {character_facial_features}
      * Age: {character_age}
      * Gender: {character_gender}
      * Skin tone: {character_skin_tone}
      * Hair: ${hair}

      The image should be:

      * Like a movie actor's passport photograph or profile shot or character headshot
      * With a plain background and no writings in the background
      * Realistic, resembling a photograph of a movie actor portraying the character (not cartoon, 2D, or animated)
      * A single person character, with no additional characters or background distractions

      The image should accurately represent the character's age, facial features, gender, skin tone, and hair. The character should be the only focal point in the image, with no background elements or distractions.
      Generate an image description that is allowed for OPENAI's safety system so that it can be used to generate an image.
      `;

      // const startingTemplate = `From the following description of a character: {prompt}. 
      // Here is the story too: {story}
      // character's name {character_name}
      // character's facial features {character_facial_features}
      // character's age {character_age}
      // character's gender {character_gender}
      // character's skin tone {character_skin_tone}
      // character's role {character_role}
      // character's hair {character_hair}
      // Generate an image description that is allowed for OPENAI's safety system so that it can be used to generate an image. 
      // Ensure the image is like a movie actor format, like a passport photograph not in a cartoon looking way and with a plain background and no writings in the background. 
      // Ensure the image relates to the story and accurately represents the character's age, facial features, gender, skin tone, hair, and role. The image should be realistic, resembling a photograph of a movie actor portraying the character, not in a cartoon, 2D, or animated style. Ensure the image features only the single character described, with no additional characters or background distractions.      
      // Ensure the image is just a single person or character no multiple characters in the image
      // `;

      
      const startingPrompt = ChatPromptTemplate.fromMessages([
          ["system", "You are a professional prompt generator and assistant"],
          ["human", startingTemplate],
      ]);
      const chain = startingPrompt.pipe(llm).pipe(new StringOutputParser());
  
      const response = await chain.invoke({
        prompt: prompt,
        story: story?.overview,
        character_name: name,
        character_age: age,
        character_facial_features: facialFeatures,
        // character_backstory: backstory,
        character_gender: gender,
        character_skin_tone: skinTone,
        character_hair: hair,
        character_role: role          
      });

      console.log(response);
      return response;

    } catch (error) {
      console.error(error);  
      return null;    
    }
  }   

  const triggerEditCharacterModal = (character: CharacterInterface) => {
    console.log(character);    

    if (character.isProtagonist) {      
      setEditProtagonistModalOpen(true);
    }else{
      setModalOpen(true)
    }
    setSelectedCharacter(character);
  }

  const navigate = async (currentStep: number, currentStepUrl: string) => {
    try {
      showPageLoader();

      let response = await navigateToStoryStep(initialStoryData?.id, {
          currentStep: currentStep,                    
          currentStepUrl: currentStepUrl ,
      });

      if (response) {
          push(`/dashboard/story-project?story-id=${initialStoryData.id}&current-step=${currentStepUrl}`)
      }
    } catch (error) {
        console.error(error);            
    }finally{
        hidePageLoader();
    }
  }

  return (
    <div>
      <div className="mb-5">
        {/* <h1 className="text-4xl font-bold capitalize">{initialStoryData?.projectTitle}</h1> */}
      </div>

      <div className='mb-7'>
        {/* <p className='text-lg font-bold text-gray-800 mb-2'>Plot</p> */}
        <p className="text-sm text-gray-600 lg:w-1/2 xl:w-1/2 ">{initialStoryData?.overview}</p>
      </div>

      <div className='my-10'>
        <div className='mb-5 flex justify-center text-center'>
          <h2 className="text-xl bg-white py-2 px-5 rounded-3xl text-gray-700 font-bold  tracking-wider">Characters</h2>
        </div>
        <div className="flex justify-center w-[80%] mx-auto mb-10">

          <Carousel
            opts={{
                align: "start",
            }}
            className="w-full"
            >
              <CarouselContent>
                {   
                  initialStoryData?.characters.filter((character: CharacterInterface) => character?.isProtagonist).map((character: CharacterInterface, index: number) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <CharacterViewComponent 
                      key={index}
                      character={character}
                      onClickEvent={triggerEditCharacterModal}
                      refetch={refetch}
                      />
                    </CarouselItem>
                  ))
                }

                {   
                  initialStoryData?.characters.filter(character => !character?.isProtagonist).map((character: CharacterInterface, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <CharacterViewComponent 
                        key={index}
                        character={character}
                        onClickEvent={triggerEditCharacterModal}
                      />
                    </CarouselItem>
                  ))
                }

              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
          </Carousel>
        </div>

        <div className="my-5 flex justify-between">
          <Button onClick={() => navigate(2, "create-plot")}>Back</Button>
          <Button onClick={() => navigate(4, "finish-story")}>Proceed</Button>
        </div>
      </div>



      <EditProtagonistComponent 
        setModalOpen={setEditProtagonistModalOpen}
        modalOpen={editProtagonistModalOpen}
        selectedCharacter={selectedCharacter}
      />

      <EditSupportingCharacterComponent 
        setModalOpen={setModalOpen}
        modalOpen={modalOpen}
        selectedCharacter={selectedCharacter}
      />

    </div>
  )
}

export default CreateCharactersComponent
