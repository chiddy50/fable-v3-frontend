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
import { Textarea } from '@/components/ui/textarea';
import { extractTemplatePrompts, queryLLM } from '@/services/LlmQueryHelper';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { CharacterInterface, SuggestedCharacterInterface } from '@/interfaces/CharacterInterface';
import CharacterSuggestionsModal from '../CharacterSuggestionsModal';
import { updateCharacter } from '@/services/request';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface WhatProtagonistWantComponentProps {
  openWhatProtagonistWantModal: boolean;
  setOpenWhatProtagonistWantModal: React.Dispatch<React.SetStateAction<boolean>>;      
  initialStory: StoryInterface;
  selectedCharacter: CharacterInterface|null;
  saveStory: (val: any) => null|object;
  refetch:() => void;
}

const WhatProtagonistWantComponent: React.FC<WhatProtagonistWantComponentProps> = ({
  openWhatProtagonistWantModal,
  setOpenWhatProtagonistWantModal,
  selectedCharacter,
  initialStory,
  saveStory,
  refetch,
}) => {
  const [whatTheyWant, setWhatTheyWant] = useState<string>(selectedCharacter?.whatTheyWant ? selectedCharacter?.whatTheyWant : "");
  const [whoHasIt, setWhoHasIt] = useState<string>(selectedCharacter?.whoHasIt ? selectedCharacter?.whoHasIt : "");
  const [additionalCharacterSuggestions, setAdditionalCharacterSuggestions] = useState<SuggestedCharacterInterface[]>([]);
  const [openCharacterSuggestionsModal, setOpenCharacterSuggestionsModal] = useState<boolean>(false);

  useEffect(() => {        
    setWhatTheyWant(selectedCharacter?.whatTheyWant ? selectedCharacter?.whatTheyWant : "");
    setWhoHasIt(selectedCharacter?.whoHasIt ? selectedCharacter?.whoHasIt : "");
  }, [selectedCharacter])

  const copySuggestion = (suggestion: { whatTheyWant: string, whoHasIt: string }) => {
    setWhatTheyWant(suggestion.whatTheyWant);
    setWhoHasIt(suggestion.whoHasIt);
  }

  const saveProtagonistGoal = async () => {
    if (!whatTheyWant) {
      toast.error("We need to know what the protagonist wants");        
      return false;
    }

    if (!whoHasIt) {
      toast.error("We need to know who has what the protagonist wants");        
      return false;
    }

    if(!selectedCharacter?.id) return;

    showPageLoader();    

    const response = await getNextQuestionSuggestions();

    if (!response) {    
      hidePageLoader();
      return;
    }

    if (response?.suggestedCharacters && response?.suggestedCharacters.length > 0) {                
      setAdditionalCharacterSuggestions(response?.suggestedCharacters);
      setOpenCharacterSuggestionsModal(true);
    }

    try {
      // const storyStarterSaved = await saveStory({ 
      //   addProtagonistGoal: {
      //     protagonistGoal: { whatTheyWant, whoHasIt },  
      //     whoDoesNotHaveProtagonistGoalSuggestions: response.suggestions           
      //   }, 
      //   introductionStep: 3,
      // });   


      let characterUpdated = await updateCharacter({
        whatTheyWant,
        whoHasIt,
        storyId: initialStory?.id,
        introductionStep: 3,      
        whoDoesNotHaveProtagonistGoalSuggestions: response.suggestions,
      }, selectedCharacter?.id);

      refetch();
      setOpenWhatProtagonistWantModal(false);
    } catch (error) {
      console.error(error);      
    }finally{
      hidePageLoader();
    }
  }

  const getNextQuestionSuggestions = async () => {
    let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt } = extractTemplatePrompts(initialStory);

    let question = `Who does not have what they want?`;

    const prompt = `
    You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
    After introducing the protagonist & seeing what the protagonists want and who has it, We are currently trying to the answer the next question in order to explore & develop our character and the question is {question}, so you would generate at least 4 suggestion answers to the question. 
    Analyze the protagonist, what they want, who has it, genre, suspense technique, thematic element & option, and also ensure you suggestions relate to these information. 
    
    When answering the question "Who does not have what they want?", consider the following:
    - What are their motivations and desires?
    - How do their goals conflict with the protagonist's?
    - What obstacles or challenges do they face in achieving their own goals?
    - How do their actions or inactions affect the protagonist and the story's progression?
    - What insights do their struggles or triumphs offer into the story's themes or characters?
    After identifying the protagonist, what they want, and who has it, the next crucial question is "Who does not have what they want?" This question helps to create tension, conflict, and complexity in your story. 
    Here are the essential elements to consider when answering this question:
    - The Antagonist: Typically, the antagonist is the one who does not have what the protagonist wants. They may be the one who possesses the thing the protagonist desires or stands in their way. The antagonist's goals and motivations are often in direct conflict with the protagonist's.
    - The Pursuer: This character may not necessarily be the antagonist but still lacks what the protagonist wants. They might be a secondary character who enters the story, bringing their own desires and needs that create tension and obstacles for the protagonist.
    - The Observer: This person may not be directly involved in the main conflict but is affected by it. They might be a character who is aware of the protagonist's desires and the obstacles they face, and their observations could provide insight into the story's themes or consequences.
    - The Unaware: This character might not even know what the protagonist wants or that they're missing something. They might be unaware of the conflict or the protagonist's motivations, but their actions or decisions can still impact the story.
    - The Casualty: This character is often an innocent bystander who gets caught up in the chaos. They might be a minor character or even a group of characters who suffer the consequences of the protagonist's quest or the antagonist's actions.
        
    The current character or protagonist being analyzed is {currentCharacter}. The protagonists is {protagonists}. After analyzing the protagonists and other characters {otherCharacters}. If there is a need to add additional characters that can fit into the protagonists journey, kindly generate them and ensure the suggestions are related to the context of the protagonists journey. Put the suggestions in the suggestedCharacters json object in the response.
    When generating the suggested characters ensure the role, name or relationship to the protagonist do not exists among the existing characters.

    Return your response in a JSON format with the following keys:
    - suggestions(array of strings, These are suggestions to the question "Who does not have what they want?") and
    - suggestedCharacters(array of objects with keys name(string), backstory(string), role(string) & relationshipToProtagonist(string)) as the keys. 
    Please ensure the only key in the object is the suggestions and suggestedCharacters keys only.
    Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
    Ensure you response is a json object string, we need to avoid the SyntaxError: Unexpected token error after parsing the response.

    current character: {currentCharacter}
    protagonists: {protagonists}
    existing characters: {otherCharacters}
    what they want: {whatTheyWant}
    who has it: {whoHasIt}
    question: {question}
    genre: {genre}
    thematic element & option: {thematicElement}
    suspense technique: {suspenseTechnique}
    suspense technique description: {suspenseTechniqueDescription}
    `;
    
    const response = await queryLLM(prompt, {
      currentCharacter: `${selectedCharacter?.name}: ${selectedCharacter?.backstory}`,
      whatTheyWant,
      whoHasIt,
      protagonists: initialStory.storyStructure.protagonists.map((item) => `${item.name}: ${item.backstory}.`).join(" "),
      otherCharacters: otherCharactersPrompt,
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
  }

  return (
    <>
      <Sheet open={openWhatProtagonistWantModal} onOpenChange={setOpenWhatProtagonistWantModal}>
        <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
          <SheetHeader className=''>
            <SheetTitle className='font-bold text-xl mb-7'>
              What does the character want & Who has what they want?

            </SheetTitle>
            <SheetDescription></SheetDescription>
            {
              // selectedCharacter?.protagonistGoalSuggestions &&
              <div className='mt-5 '>
                
                <div className='flex items-center bg-gray-900 gap-5 p-3 rounded-2xl mb-5'>
                  <div className='rounded-2xl'>
                    <Image src={selectedCharacter?.imageUrl ?? '/user-image.jpeg'} 
                      className='rounded-2xl border border-gray-900' loading="lazy" height={80} width={80} alt="Logo"/>
                  </div>
                  <p className='text-lg text-gray-50 font-semibold'>{selectedCharacter?.name}</p>
                </div>

                <p className='text-sm font-bold mb-2'>Here are some suggestions:</p>
                <div className='bg-white p-5 rounded-2xl'>

                  <div className='flex justify-center mt-2'>

                    <Carousel className="w-full max-w-[90%]">
                      <CarouselContent>
                        {selectedCharacter?.protagonistGoalSuggestions?.map((suggestion, index) => (
                        <CarouselItem key={index}>
                          <Card className='p-4 relative' key={index}>
                            <div className='flex flex-col justify-center gap-1 mb-3'>
                              <p className='text-xs font-semibold'>What they want?</p>
                              <p className='text-xs text-gray-500'>{suggestion?.whatTheyWant}</p>
                            </div>
                            <div className='flex flex-col justify-center gap-1'>
                              <p className='text-xs font-semibold'>Who has it?</p>
                              <p className='text-xs text-gray-500'>{suggestion?.whoHasIt}</p>
                            </div>

                            <div className='absolute top-1 right-1 p-1'>
                              <CopyIcon onClick={() => copySuggestion(suggestion)} className='cursor-pointer hover:text-blue-600'/>
                            </div>
                          </Card>
                        </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                </div>


                {/* <div className='grid grid-cols-2 gap-4 mt-2'>
                  {
                  !selectedCharacter?.whatTheyWant && selectedCharacter?.protagonistGoalSuggestions?.map((suggestion, index) => (
                      <Card className='p-4 relative' key={index}>
                        <div className='flex flex-col justify-center gap-1 mb-3'>
                          <p className='text-xs font-semibold'>What they want?</p>
                          <p className='text-xs text-gray-500'>{suggestion?.whatTheyWant}</p>
                        </div>
                        <div className='flex flex-col justify-center gap-1'>
                          <p className='text-xs font-semibold'>Who has it?</p>
                          <p className='text-xs text-gray-500'>{suggestion?.whoHasIt}</p>
                        </div>

                        <div className='absolute top-1 right-1 p-1'>
                          <CopyIcon onClick={() => copySuggestion(suggestion)} className='cursor-pointer hover:text-blue-600'/>
                        </div>
                      </Card>
                    ))                  
                  }
                </div> */}
                
                <div className="mt-7">
                  {/* {
                    initialStory?.storyStructure?.protagonists?.length && initialStory?.storyStructure?.protagonists?.length > 1 &&
                    <div>
                      <p className='text-xs text-gray-500 mb-1'>What common goal do these characters share or what conflicts do they have with each other? (Stakes and Goal)</p>
                      <Textarea 
                        defaultValue={whatTheyWant}
                        onKeyUp={(e) => setWhatTheyWant(e.target.value)} 
                        onPaste={(e) => setWhatTheyWant(e.target.value)} 
                        className='w-full text-xs p-5'
                        rows={5}
                      />
                    </div>
                  } */}

                  {
                    // initialStory?.storyStructure?.protagonists?.length && initialStory?.storyStructure?.protagonists?.length === 1 &&
                    <div className='mt-4'>
                      <div>
                        <p className='text-xs text-gray-800 mb-1'>What does {selectedCharacter?.name} want?</p>
                        <Textarea 
                          defaultValue={whatTheyWant}
                          onKeyUp={(e) => setWhatTheyWant(e.target.value)} 
                          onPaste={(e) => setWhatTheyWant(e.target.value)} 
                          className='w-full text-xs p-4'
                          rows={3}
                        />
                      </div>

                      <div className='mt-4'>
                        <p className='text-xs text-gray-800 mb-1'>Who has what they want?</p>
                        <Textarea 
                          defaultValue={whoHasIt}
                          onKeyUp={(e) => setWhoHasIt(e.target.value)} 
                          onPaste={(e) => setWhoHasIt(e.target.value)} 
                          className='w-full text-xs p-4'
                          rows={3}
                        />
                      </div>
                    </div>

                  }    

                  <Button onClick={saveProtagonistGoal} className='mt-5 bg-custom_green text-white'>Proceed</Button>
                  
                </div>

              </div>
            }
              
          </SheetHeader>
        </SheetContent>
      </Sheet> 

      <CharacterSuggestionsModal 
        initialStory={initialStory}
        openCharacterSuggestionsModal={openCharacterSuggestionsModal}
        setOpenCharacterSuggestionsModal={setOpenCharacterSuggestionsModal}
        setAdditionalCharacterSuggestions={setAdditionalCharacterSuggestions}
        additionalCharacterSuggestions={additionalCharacterSuggestions}
      />
    </>
  )
}

export default WhatProtagonistWantComponent
