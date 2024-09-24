"use client";

import { StoryInterface, SuggestionItem } from '@/interfaces/StoryInterface';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { extractTemplatePrompts, mergeStorytellingFormWithIdea, queryLLM } from '@/services/LlmQueryHelper';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { Card } from "@/components/ui/card";
import { Check, CopyIcon, User } from 'lucide-react';
import { toast } from 'sonner';
import { CharacterInterface, SuggestedCharacterInterface } from '@/interfaces/CharacterInterface';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';

import CharacterSuggestionsModal from '../CharacterSuggestionsModal';
import Image from 'next/image';
import { updateCharacter } from '@/services/request';

interface HowCharacterOvercomeObstaclesComponentProps {
  openHowCharacterOvercomeObstaclesModal: boolean;
  setOpenHowCharacterOvercomeObstaclesModal: React.Dispatch<React.SetStateAction<boolean>>;      
  selectedCharacter: CharacterInterface|null;
  initialStory: StoryInterface;
  saveStory: (val: any) => null|object;
  refetch:() => void;
}

const HowCharacterOvercomeObstaclesComponent: React.FC<HowCharacterOvercomeObstaclesComponentProps> = ({
    openHowCharacterOvercomeObstaclesModal,
    setOpenHowCharacterOvercomeObstaclesModal,
    selectedCharacter,
    initialStory,
    saveStory,
    refetch,
}) => {

  const [openCharacterSuggestionsModal, setOpenCharacterSuggestionsModal] = useState<boolean>(false);
  const [additionalCharacterSuggestions, setAdditionalCharacterSuggestions] = useState<SuggestedCharacterInterface[]>([]);

  const [howCharacterOvercomeObstacles, setHowCharacterOvercomeObstacles] = useState<Option[]>([]);
  const [defaultOptions, setDefaultOptions] = useState<Option[]>([]);

  useEffect(() => {
    setHowCharacterOvercomeObstacles(selectedCharacter?.howCharacterOvercomeObstacles ? selectedCharacter?.howCharacterOvercomeObstacles?.map(item => ( { label: item, value: item } )) : []);
    setDefaultOptions(selectedCharacter?.howCharacterOvercomeObstacleSuggestions ? selectedCharacter?.howCharacterOvercomeObstacleSuggestions?.map(suggestion => ( { label: suggestion, value: suggestion } )) : []);
  }, [selectedCharacter]);

  const getHowCharacterOvercomeObstaclesSuggestions = async (payload: string[]) => {
    try {
      let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt } = extractTemplatePrompts(initialStory);
      
      let question = `How do the character's relationships and conflicts change as they go after their goal?`;

      const prompt = `
      You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
      We are currently in the second act, and we have been able to answer questions like: 
      who is the protagonist?, 
      what does the protagonists want?, 
      who has what they want?, 
      who does not have what they want?,  
      what obstacles or challenges does the character face in achieving their goal?,  
      what are the protagonists's strengths and weaknesses? 
      what motivates or drives the character to pursue their goal? 
      What events or circumstances trigger strong emotions in the character? and
      How does the character overcome obstacles?
      We are currently in the second act which is The Confrontation and we are also trying to answer the next question in order to explore & develop our character and the question is {question}, so you would generate at least 7 suggestion answers to the question and ensure to use simple grammar. 
      Analyze the protagonist, what they want, genre, suspense technique, thematic element & option, and also ensure you suggestions relate to these information. 
      
      Here are the essential elements to consider while generating the suggestions answers to the question {question}:
      - Character's goal: Clearly state what the character's objective is in the current scene or act. This will help the LLM understand the character's motivations and priorities.
      - Character's relationships: Describe the character's relationships with other characters in the story, including:
      - Who are their allies, friends, or loved ones? Who are their enemies, rivals, or fools?
      - What are the dynamics of these relationships (e.g., tense, strained, loving, trusting)?
      - Conflicts and obstacles: Identify the conflicts and obstacles the character faces in achieving their goal, including:
      - Internal conflicts (e.g., fear, self-doubt, conflicting desires)
      - External conflicts (e.g., adversaries, challenges, environmental hurdles)
      - Interpersonal conflicts (e.g., disagreements, power struggles, emotional confrontations)
      - Consequences of pursuing the goal: Hint at the potential consequences of the character's actions, such as:
      - How might their relationships change or be affected?
      - What are the stakes if they fail or succeed?
      - Are there any moral or personal costs to pursuing their goal?
      - Context of the confrontation act: Provide context about the story's current act or scene, including:
      - Where are the characters in the story's narrative arc (e.g., rising action, climax, falling action)?
      - What are the character's circumstances, environment, or setting?
      - Tone and themes: Suggest the tone and themes you want to convey in the story, such as:
      - Is the story dark and gritty or light-hearted and humorous?
      - Are there any themes or messages you want to convey through the character's relationships and conflicts?

      The protagonists is {protagonists}. After analyzing the protagonists and existing characters {otherCharacters}. If there is a need to add additional characters that can fit into the protagonists journey, kindly generate them and ensure the suggestions are related to the context of the protagonists journey. Put the suggestions in the suggestedCharacters json object in the response.
      When generating the suggested characters ensure the role, name or relationship to the protagonist do not exists among the existing characters.        

      Return your response in a JSON format with the following keys:
      suggestions(array of strings, These are suggestions to the question {question}) and 
      suggestedCharacters(array of objects with keys name(string), backstory(string), role(string), relationshipToProtagonist(string) and disabled(boolean, set this to false always)). 
      Please ensure that only the json or javascript object with suggestions and suggestedCharacters keys only is returned.
      Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
      Ensure you response is a json object string, we need to avoid the SyntaxError: Unexpected token error after parsing the json response.

      who is the protagonist: {protagonists}
      existing characters: {otherCharacters}
      what does the protagonists want: {whatTheyWant}
      who has what they want: {whoHasIt}
      who does not have what they want: {whoDoesNotHaveProtagonistGoal}
      protagonist's goal obstacles or challenges: {protagonistGoalObstacle}
      protagonist's strengths: {protagonistStrengths}
      protagonist's weaknesses: {protagonistWeaknesses}
      protagonist's motivations: {protagonistMotivations}
      protagonist's events that trigger emotions: {protagonistEmotionTriggerEvent}
      how the character overcome obstacles: {howCharacterOvercomeObstacles} 
      question: {question}
      genre: {genre}
      thematic element & option: {thematicElement}
      suspense technique: {suspenseTechnique}
      suspense technique description: {suspenseTechniqueDescription}
      `;
      
      const response = await queryLLM(prompt, {
          protagonists: initialStory.storyStructure.protagonists.map((item) => `${item.name}: ${item.backstory}.`).join(" "),
          otherCharacters: otherCharactersPrompt,
          whatTheyWant: initialStory?.storyStructure?.protagonistGoal?.whatTheyWant,
          whoHasIt: initialStory?.storyStructure?.protagonistGoal?.whoHasIt,
          whoDoesNotHaveProtagonistGoal: initialStory?.storyStructure?.whoDoesNotHaveProtagonistGoal,
          protagonistGoalObstacle: initialStory?.storyStructure?.protagonistGoalObstacle,
          protagonistStrengths: selectedCharacter?.strengths?.join(", "),
          protagonistWeaknesses: selectedCharacter?.weaknesses?.join(", "),
          protagonistMotivations: selectedCharacter?.motivations?.join(", "),
          protagonistEmotionTriggerEvent: selectedCharacter?.emotionTriggerEvent?.join(", "),
          howCharacterOvercomeObstacles: payload.join(", "),
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
      return false;
    }
  }

  const save = async () => {            
    try {            
      if (howCharacterOvercomeObstacles.length < 1) {
        toast.error("Kindly share how the character overcomes obstacles");
        return;
      }
      if (!selectedCharacter?.id) return; 

      let howCharacterOvercomeObstaclesPayload: string[] = howCharacterOvercomeObstacles.map(trigger => trigger.value);            

      showPageLoader();
      
      const response = await getHowCharacterOvercomeObstaclesSuggestions(howCharacterOvercomeObstaclesPayload);
      if (!response) {
        return;
      }

      if (response?.suggestedCharacters && response?.suggestedCharacters?.length > 0) {                
        setAdditionalCharacterSuggestions(response?.suggestedCharacters);
        setOpenCharacterSuggestionsModal(true);
      }

      let characterUpdated = await updateCharacter({
        howCharacterOvercomeObstacles: howCharacterOvercomeObstaclesPayload,
        storyId: initialStory?.id,
        confrontationStep: 4,              
        howCharacterGoalChangeRelationshipSuggestions: response?.suggestions,
        suggestedCharacters: response?.suggestedCharacters
      }, selectedCharacter?.id);

      refetch();    
      if (characterUpdated) {            
        setOpenHowCharacterOvercomeObstaclesModal(false);
      }
    } catch (error) {
      console.error(error);            
    }finally{
      hidePageLoader();
    }
  }

  return (
    <>
      <Sheet open={openHowCharacterOvercomeObstaclesModal} onOpenChange={setOpenHowCharacterOvercomeObstaclesModal}>
        <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll md:min-w-[96%] lg:min-w-[50%]">
          <SheetHeader className=''>
            <SheetTitle className='font-bold text-lg'>
            How does the character overcome obstacles?
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <div className='mt-7'>
            
            <div className='flex items-center bg-gray-900 gap-5 p-3 rounded-2xl mb-5'>
              <div className='rounded-2xl'>
                <Image src={selectedCharacter?.imageUrl ?? '/user-image.jpeg'} 
                className='rounded-2xl border border-gray-900' loading="lazy" height={80} width={80} alt="Logo"/>
              </div>
              <p className='text-lg text-gray-50 font-semibold'>{selectedCharacter?.name}</p>
            </div>

            <div className='mt-10'>
              <p className='text-sm font-bold mb-2'>Here are some suggestions:</p>

              <MultipleSelector
                creatable
                value={howCharacterOvercomeObstacles}
                onChange={setHowCharacterOvercomeObstacles}
                defaultOptions={defaultOptions}
                placeholder="Choose or add options"
                emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      no results found.
                    </p>
                }
                className='outline-none bg-white'
              />

              <Button onClick={save} className='mt-5 bg-custom_green text-white'>Save</Button>

            </div>

            <ul className='mt-5'>
              {
                howCharacterOvercomeObstacles?.map((event, index) => (
                  <li className='mb-2' key={`_${index}_`}> 
                    <Card className='text-xs flex items-center gap-2 mb-2 p-4'>            
                      <div className='flex items-start'>
                          <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                      </div>
                      <span>{event.label}</span>
                    </Card>  
                  </li>
                ))
              }
            </ul>

          </div>
        </SheetContent>
      </Sheet>

      <CharacterSuggestionsModal
        refetch={refetch}
        openCharacterSuggestionsModal={openCharacterSuggestionsModal}
        setOpenCharacterSuggestionsModal={setOpenCharacterSuggestionsModal}
        setAdditionalCharacterSuggestions={setAdditionalCharacterSuggestions}
        additionalCharacterSuggestions={additionalCharacterSuggestions}
        initialStory={initialStory}
      />
    </>
  )
}

export default HowCharacterOvercomeObstaclesComponent
