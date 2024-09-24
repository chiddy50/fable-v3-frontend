"use client";

import { StoryInterface, SuggestionItem } from '@/interfaces/StoryInterface';
import React, { useCallback, useState } from 'react';
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
import { CharacterInterface } from '@/interfaces/CharacterInterface';
import { updateCharacter } from '@/services/request';
import Image from 'next/image';


interface ProtagonistGoalObstacleComponentProps {
    openProtagonistGoalObstacle: boolean;
    setOpenProtagonistGoalObstacle: React.Dispatch<React.SetStateAction<boolean>>;      
    initialStory: StoryInterface;
    selectedCharacter: CharacterInterface|null;
    saveStory: (val: any) => null|object;
    refetch:() => void;
}

const ProtagonistGoalObstacleComponent: React.FC<ProtagonistGoalObstacleComponentProps> = ({
    openProtagonistGoalObstacle,
    setOpenProtagonistGoalObstacle,
    selectedCharacter,
    initialStory,
    saveStory,
    refetch
}) => {
    
    const [protagonistGoalObstacle, setProtagonistGoalObstacle] = useState<string>(selectedCharacter?.protagonistGoalObstacle ?? "");

    const save = async () => {
        try {
            if (!protagonistGoalObstacle) {
                toast.error("Kindly fill the form");        
                return false;
            }

            showPageLoader();

            const suggestion = await getProtagonistWeaknessStrengthSuggestions();
            
            if (!suggestion) {    
                toast.error("Please try again, there was a network issue");        
                return;
            }

            
            const createLabelValuePairs = (arr: string[] = []) => 
                arr.map(item => ({ label: item, value: item }));
            
            const mergeSuggestions = (initial: string[] = [], suggestions: string[] = []) => 
            createLabelValuePairs([...initial, ...suggestions]);

            let characterUpdated = await updateCharacter({
                storyId: initialStory?.id,
                introductionStep: 5,      
                protagonistGoalObstacle,
                motivationsSuggestions: selectedCharacter?.motivations 
                ? mergeSuggestions(selectedCharacter?.motivations, suggestion?.motivationsSuggestions)
                : createLabelValuePairs(suggestion?.motivationsSuggestions),
                personalityTraitsSuggestions: selectedCharacter?.personalityTraits 
                ? mergeSuggestions(selectedCharacter?.personalityTraits, suggestion?.personalityTraitsSuggestions)
                : createLabelValuePairs(suggestion?.personalityTraitsSuggestions),
                skillsSuggestions: selectedCharacter?.skills 
                ? mergeSuggestions(selectedCharacter?.skills, suggestion?.skillsSuggestions)
                : createLabelValuePairs(suggestion?.skillsSuggestions),
                strengthsSuggestions: selectedCharacter?.strengths 
                ? mergeSuggestions(selectedCharacter?.strengths, suggestion?.strengthsSuggestions)
                : createLabelValuePairs(suggestion?.strengthsSuggestions),
                weaknessesSuggestions: selectedCharacter?.weaknesses 
                ? mergeSuggestions(selectedCharacter?.weaknesses, suggestion?.weaknessesSuggestions)
                : createLabelValuePairs(suggestion?.weaknessesSuggestions),                
            }, selectedCharacter?.id);

            refetch();
            setOpenProtagonistGoalObstacle(false);
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const getProtagonistWeaknessStrengthSuggestions = async () => {
        try {
            let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt } = extractTemplatePrompts(initialStory);

            let question = `What are the character's strengths and weaknesses?`;
            // What obstacles or challenges does the character face in achieving their goal?

            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
            After introducing the protagonist, seeing what the protagonists want, who has it, who does not have what they want? and obstacles or what challenges the character face in achieving their goal, We are currently trying to the answer the next question in order to explore & develop our character and the question is {question}, so you would generate at least 10 suggestion answers to the question. 
            Analyze the current character or protagonist {currentCharacter}, what they want, who has it, who does not have what they want, genre, suspense technique, thematic element & option, and also ensure you suggestions relate to these information. 
            
            To help you generate suggestions for the character's strengths and weaknesses, I'll break down the elements of this question:

            Elements:
            Character's Goals (from the previous question): What are the character's aims, desires, and motivations?
            Character's Skills and Abilities: What are their talents, expertise, and natural abilities?
            Character's Personality (traits, values, and emotions): What are their dominant characteristics, tendencies, and emotional inclinations?
            Character's Circumstances (background, situation, and relationships): What are their environmental conditions, relationships, and social context?
            Plot Requirements: What are the demands of the story, the challenges they'll face, and the obstacles they must overcome?

            The current character or protagonist being analyzed is {currentCharacter}.
            
            Return your response in a json or javascript object format like: 
            name(string, this would be the name of the protagonist)
            strengthsSuggestions(array of strings), 
            weaknessesSuggestions(array of strings), 
            skillsSuggestions(array of strings)
            personalityTraitsSuggestions(array of strings)
            motivationsSuggestions(array of strings) as keys. 
            Please ensure the only keys in the object are strengthsSuggestions, weaknessesSuggestions, skillsSuggestions, personalityTraitsSuggestions and motivationsSuggestions keys only.
            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   

            current character: {currentCharacter}
            protagonists: {protagonists}
            existing characters: {otherCharacters}
            what they want: {whatTheyWant}
            who has it: {whoHasIt}
            who does not have it: {whoDoesNotHaveProtagonistGoal}
            protagonist's goal obstacles or challenges: {protagonistGoalObstacle}
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
                whoDoesNotHaveProtagonistGoal: initialStory?.storyStructure?.whoDoesNotHaveProtagonistGoal,
                protagonistGoalObstacle,
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
        setProtagonistGoalObstacle(suggestion);
    }

    return (
        <Sheet open={openProtagonistGoalObstacle} onOpenChange={setOpenProtagonistGoalObstacle}>
            <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
                <SheetHeader className=''>
                    <SheetTitle className='font-bold text-2xl'>
                    What obstacles or challenges does the character face in achieving their goal?
                    </SheetTitle>

                    <div className='flex items-center bg-gray-900 gap-5 p-3 rounded-2xl my-7'>
                        <div className='rounded-2xl'>
                            <Image src={selectedCharacter?.imageUrl ?? '/user-image.jpeg'} 
                            className='rounded-2xl border border-gray-900' loading="lazy" height={80} width={80} alt="Logo"/>
                        </div>
                        <p className='text-lg text-gray-50 font-semibold'>{selectedCharacter?.name}</p>
                    </div>

                    <SheetDescription></SheetDescription>
                </SheetHeader>

                <div className='mt-5 '>
                    <p className='text-sm font-bold mb-2'>Here are some suggestions:</p>
                    
                    {
                        selectedCharacter?.protagonistGoalObstacleSuggestions && 
                        selectedCharacter?.protagonistGoalObstacleSuggestions.map((suggestion, index) => (
                            <div className="flex items-center gap-3 mb-2 p-3 bg-white rounded-xl" key={index}>
                                <div onClick={() => copySuggestion(suggestion)} className='px-2 py-1 cursor-pointer rounded-lg bg-gray-900 w-7 h-7 flex items-center justify-center hover:bg-gray-600'>
                                    <CopyIcon className=' text-white w-3 h-3'/>
                                </div>
                                <p className="text-xs">{suggestion}</p>
                            </div>
                        ))
                    }

                    <div className='mt-5'>
                        <SheetDescription className='mb-1'>Reply here:</SheetDescription>
                        <Textarea 
                            defaultValue={protagonistGoalObstacle}
                            onKeyUp={(e: React.KeyboardEvent<HTMLTextAreaElement>) => setProtagonistGoalObstacle(e.target.value)} 
                            onPaste={(e: React.ClipboardEvent<HTMLTextAreaElement>) => setProtagonistGoalObstacle(e.target.value)} 
                            className='w-full text-xs p-5'
                            rows={5}
                        />

                        <Button 
                        onClick={save} 
                        className='mt-5 bg-custom_green text-white'>Proceed</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default ProtagonistGoalObstacleComponent
