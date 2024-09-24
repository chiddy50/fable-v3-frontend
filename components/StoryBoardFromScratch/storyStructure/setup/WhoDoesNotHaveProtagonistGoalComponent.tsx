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
import { Card } from "@/components/ui/card";
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import CharacterSuggestionsModal from '../CharacterSuggestionsModal';
import { CharacterInterface, SuggestedCharacterInterface } from '@/interfaces/CharacterInterface';
import { updateCharacter } from '@/services/request';
import Image from 'next/image';


interface WhoDoesNotHaveProtagonistGoalComponentProps {
  openWhoDoesNotHaveProtagonistGoal: boolean;
  setOpenWhoDoesNotHaveProtagonistGoal: React.Dispatch<React.SetStateAction<boolean>>;      
  initialStory: StoryInterface;
  selectedCharacter: CharacterInterface|null;
  saveStory: (val: any) => null|object;
  refetch:() => void;
}

const WhoDoesNotHaveProtagonistGoalComponent: React.FC<WhoDoesNotHaveProtagonistGoalComponentProps> = ({
    openWhoDoesNotHaveProtagonistGoal,
    setOpenWhoDoesNotHaveProtagonistGoal,
    initialStory,
    selectedCharacter,
    saveStory,
    refetch,
}) => {
    const [whoDoesNotHaveProtagonistGoal, setWhoDoesNotHaveProtagonistGoal] = useState<string>(selectedCharacter?.whoDoesNotHaveProtagonistGoal ? selectedCharacter?.whoDoesNotHaveProtagonistGoal : "");
    const [additionalCharacterSuggestions, setAdditionalCharacterSuggestions] = useState<SuggestedCharacterInterface[]>([]);
    const [openCharacterSuggestionsModal, setOpenCharacterSuggestionsModal] = useState<boolean>(false);
  
    useEffect(() => {
        setWhoDoesNotHaveProtagonistGoal(selectedCharacter?.whoDoesNotHaveProtagonistGoal ? selectedCharacter?.whoDoesNotHaveProtagonistGoal : "");
        // setDefaultOptions(selectedCharacter?.unresolvedIssuesFromDepartureSuggestions ? selectedCharacter?.unresolvedIssuesFromDepartureSuggestions?.map(suggestion => ( { label: suggestion, value: suggestion } )) : []);
    }, [selectedCharacter]);

    const save = async () => {

        try {
            if (!whoDoesNotHaveProtagonistGoal) {
                toast.error("Kindly fill the form");        
                return false;
            }

            showPageLoader();

            const response = await getProtagonistGoalObstacleSuggestions();

            if (!response) {    
                toast.error("Please try again, there was a network issue");        
                return;
            }

            if (response?.suggestedCharacters && response?.suggestedCharacters?.length > 0) {                
                setAdditionalCharacterSuggestions(response?.suggestedCharacters);
                setOpenCharacterSuggestionsModal(true);
            }

            // const storyStarterSaved = await saveStory({
            //     addWhoDoesNotHaveProtagonistGoal: {
            //         whoDoesNotHaveProtagonistGoal,
            //         protagonistGoalObstacleSuggestions: response?.suggestions,
            //     },
            //     introductionStep: 4,
            // }); 

            let characterUpdated = await updateCharacter({
                whoDoesNotHaveProtagonistGoal,
                storyId: initialStory?.id,
                introductionStep: 4,      
                protagonistGoalObstacleSuggestions: response?.suggestions,
            }, selectedCharacter?.id);

            refetch();
            setOpenWhoDoesNotHaveProtagonistGoal(false);
            setOpenCharacterSuggestionsModal(true);
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const validate = () => {
        let otherProtagonists = initialStory?.characters?.filter(character => character.isProtagonist && character.id !== selectedCharacter?.id);                                                                           
    }

    const getProtagonistGoalObstacleSuggestions = async () => {
        try {
            let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt } = extractTemplatePrompts(initialStory);

            let question = `What obstacles or challenges does the character face in achieving their goal?`;

            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
            After introducing the protagonist, seeing what the protagonists want and who has it and who does not have what they want?, We are currently trying to the answer the next question in order to explore & develop our character and the question is {question}, so you would generate at least 4 suggestion answers to the question. 
            Analyze the protagonist, what they want, who has it, who does not have what they want, genre, suspense technique, thematic element & option, and also ensure you suggestions relate to these information. 
            
            When answering the question {question}, consider the following elements:
            Internal struggles: What are the character's fears, doubts, and weaknesses that could hinder their progress?
            External obstacles: What external factors, such as physical barriers, time constraints, or external opposition, stand in the way of the character's goal?
            Interpersonal conflicts: Are there characters who may not support or even actively work against the protagonist's goal?
            Moral dilemmas: Are there tough choices the character may have to make, which could impact their own values or relationships with others?
            Personal growth: What personal growth or skill development does the character need to overcome in order to achieve their goal?
            In summary, {question} is asking:
            - What internal and external factors could potentially stop the character from reaching their goal?
            - What are the character's personal struggles or weaknesses that could hold them back?
            - How do these obstacles relate to the character's growth, relationships, and the story's themes?

            The current character or protagonist being analyzed is {currentCharacter}.
            When generating the suggested characters ensure the role, name or relationship to the protagonist do not exists among the existing characters.

            Return your response in a JSON format with the following keys:
            - suggestions(array of strings, These are suggestions to the question {question}) and
            - suggestedCharacters(array of objects with keys name(string), backstory(string), role(string) & relationshipToProtagonist(string)) as the keys. 
            Please ensure the only key in the object is the suggestions and suggestedCharacters keys only.
            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
            Ensure you response is a json object string, we need to avoid the SyntaxError: Unexpected token error after parsing the response.

            current character: {currentCharacter}
            all protagonists: {protagonists}
            existing characters: {otherCharacters}
            what they want: {whatTheyWant}
            who has it: {whoHasIt}
            who does not have it: {whoDoesNotHaveIt}
            question: {question}
            genre: {genre}
            thematic element & option: {thematicElement}
            suspense technique: {suspenseTechnique}
            suspense technique description: {suspenseTechniqueDescription}
            `;
            
            const response = await queryLLM(prompt, {
                currentCharacter: `${selectedCharacter?.name}: ${selectedCharacter?.backstory}`,
                protagonists: initialStory.storyStructure.protagonists.map((item) => `${item.name}: ${item.backstory}.`).join(" "),
                otherCharacters: otherCharactersPrompt,
                whatTheyWant: initialStory?.storyStructure?.protagonistGoal?.whatTheyWant,
                whoHasIt: initialStory?.storyStructure?.protagonistGoal?.whoHasIt,
                whoDoesNotHaveIt: whoDoesNotHaveProtagonistGoal,
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

    const copySuggestion = (suggestion: string) => {
        setWhoDoesNotHaveProtagonistGoal(suggestion);
    }
    

    return (
        <>
            <Sheet open={openWhoDoesNotHaveProtagonistGoal} onOpenChange={setOpenWhoDoesNotHaveProtagonistGoal}>
                <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
                    <SheetHeader className=''>
                        <SheetTitle className='font-bold text-2xl'>
                        Who does not have what they want?
                        </SheetTitle>
                        <SheetDescription></SheetDescription>

                        <div className='flex items-center bg-gray-900 gap-5 p-3 rounded-2xl my-7'>
                            <div className='rounded-2xl'>
                                <Image src={selectedCharacter?.imageUrl ?? '/user-image.jpeg'} 
                                className='rounded-2xl border border-gray-900' loading="lazy" height={80} width={80} alt="Logo"/>
                            </div>
                            <p className='text-lg text-gray-50 font-semibold'>{selectedCharacter?.name}</p>
                        </div>

                        <p className='text-sm font-bold mb-2'>Here are some suggestions:</p>
                        
                        <div className='mt-10'>
                            {
                                selectedCharacter?.whoDoesNotHaveProtagonistGoalSuggestions && 
                                selectedCharacter?.whoDoesNotHaveProtagonistGoalSuggestions.map((suggestion, index) => (
                                    <div className="flex items-center gap-3 mb-2 p-3 bg-white rounded-xl" key={index}>
                                        <div onClick={() => copySuggestion(suggestion)} className='px-2 py-1 cursor-pointer rounded-lg bg-gray-900 w-7 h-7 flex items-center justify-center hover:bg-gray-600'>
                                            <CopyIcon className=' text-white w-3 h-3'/>
                                        </div>
                                        <p className="text-xs">{suggestion}</p>
                                    </div>
                                ))
                            }

                            <div className='mt-10'>
                                <SheetDescription className='mb-2 text-gray-900 text-xs'>Who does not have what they want?</SheetDescription>
                                <Textarea 
                                    defaultValue={whoDoesNotHaveProtagonistGoal}
                                    onKeyUp={(e: React.KeyboardEvent<HTMLTextAreaElement>) => setWhoDoesNotHaveProtagonistGoal(e.target.value)} 
                                    onPaste={(e: React.ClipboardEvent<HTMLTextAreaElement>) => setWhoDoesNotHaveProtagonistGoal(e.target.value)} 
                                    className='w-full text-xs p-5'
                                    rows={5}
                                />

                                <Button 
                                onClick={save} 
                                className='mt-5 bg-custom_green text-white'>Proceed</Button>
                            </div>
                        </div>
                        
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

export default WhoDoesNotHaveProtagonistGoalComponent
