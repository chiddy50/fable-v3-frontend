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
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { CharacterInterface, SuggestedCharacterInterface } from '@/interfaces/CharacterInterface';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';

import CharacterSuggestionsModal from '../CharacterSuggestionsModal';
import Image from 'next/image';
import { updateCharacter } from '@/services/request';

interface ProtagonistEmotionTriggerEventComponentProps {
    openProtagonistEmotionTriggerEventModal: boolean;
    setOpenProtagonistEmotionTriggerEventModal: React.Dispatch<React.SetStateAction<boolean>>;      
    selectedCharacter: CharacterInterface|null;
    initialStory: StoryInterface;
    saveStory: (val: any) => null|object;
    refetch:() => void;
}

const ProtagonistEmotionTriggerEventComponent: React.FC<ProtagonistEmotionTriggerEventComponentProps> = ({
    openProtagonistEmotionTriggerEventModal,
    setOpenProtagonistEmotionTriggerEventModal,
    selectedCharacter,
    initialStory,
    saveStory,
    refetch,
}) => {

    const [openCharacterSuggestionsModal, setOpenCharacterSuggestionsModal] = useState<boolean>(false);
    const [additionalCharacterSuggestions, setAdditionalCharacterSuggestions] = useState<SuggestedCharacterInterface[]>([]);

    const [protagonistEmotionTriggerEvent, setProtagonistEmotionTriggerEvents] = useState<Option[]>([]);
    const [defaultOptions, setDefaultOptions] = useState<Option[]>([]);

    useEffect(() => {
        setProtagonistEmotionTriggerEvents(selectedCharacter?.emotionTriggerEvent ? selectedCharacter?.emotionTriggerEvent?.map(motivation => ( { label: motivation, value: motivation } )) : []);
        setDefaultOptions(selectedCharacter?.emotionTriggerEventsSuggestions ? selectedCharacter?.emotionTriggerEventsSuggestions?.map(motivation => ( { label: motivation, value: motivation } )) : []);
    }, [selectedCharacter]);

    const getHowCharacterOvercomeObstaclesSuggestions = async (emotionTriggerEventPayload: string[]) => {
        try {
            let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt } = extractTemplatePrompts(initialStory);
            
            let question = `How does the character overcome obstacles?`;
    
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
            We are currently in the second act, and we have been able to answer questions like: 
            who is the protagonist?, 
            what does the protagonists want?, 
            who has what they want?, 
            who does not have what they want?,  
            what obstacles or challenges does the character face in achieving their goal?,  
            what are the protagonists's strengths and weaknesses? 
            what motivates or drives the character to pursue their goal? and
            What events or circumstances trigger strong emotions in the character? 
            We are currently in the second act which is The Confrontation and we are also trying to answer the next question in order to explore & develop our character and the question is {question}, so you would generate at least 7 suggestion answers to the question and ensure to use simple grammar. 
            Analyze the protagonist, what they want, genre, suspense technique, thematic element & option, and also ensure you suggestions relate to these information. 
            
            When writing a story about a character in the Confrontation Act, determining "How does the character overcome obstacles?" is crucial to creating a satisfying and engaging plot. Here are the key elements to consider:
            (1)Character's Personality and Traits:
            - What are the character's strengths and weaknesses? (e.g., determination, intelligence, courage, recklessness)
            - What are their values and motivations? (e.g., protecting loved ones, seeking justice, achieving a goal)
            - How does their personality influence their approach to problem-solving?            
            (2)Obstacles and Challenges:
            - What specific obstacles or challenges does the character face in the Confrontation Act? (e.g., physical barriers, internal conflicts, external adversaries)
            - How do these obstacles relate to the character's goals or desires?
            - Are there any unique or unexpected obstacles that the character must overcome?            
            (3)Methods for Overcoming Obstacles:
            - What are the character's primary and secondary methods for overcoming obstacles? (e.g., using brute force, relying on allies, employing clever strategies)
            - Are there any secondary or indirect approaches that the character uses to overcome obstacles? (e.g., using subterfuge, creating a diversion)
            - How do the character's skills, experience, and knowledge help them overcome obstacles?            
            (4)Consequences and Complications:
            - What are the consequences of failure for the character? (e.g., physical harm, emotional harm, loss of loved ones)
            - Are there any complications or unforeseen events that arise from the character's attempts to overcome obstacles?
            - How do the consequences and complications create tension and drive the story forward?
            (5)Emotional and Psychological Growth:
            - How does the character's approach to overcoming obstacles evolve throughout the story? (e.g., learning new skills, gaining confidence, confronting fears)
            - What emotional or psychological growth does the character experience as a result of overcoming obstacles?
            - Are there any relationships or connections that the character forms or reinforces through their experiences?

            The protagonists is {protagonists}. After analyzing the protagonists and existing characters {otherCharacters}. If there is a need to add additional characters that can fit into the protagonists journey, kindly generate them and ensure the suggestions are related to the context of the protagonists journey. Put the suggestions in the suggestedCharacters json object in the response.
            When generating the suggested characters ensure the role, name or relationship to the protagonist do not exists among the existing characters.        

            Return your response in a JSON format with the following keys:
            suggestions(array of strings, These are suggestions to the question {question}) and 
            suggestedCharacters(array of objects with keys name(string), backstory(string), role(string) & relationshipToProtagonist(string)). 
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
                protagonistStrengths: selectedCharacter?.strengths.join(", "),
                protagonistWeaknesses: selectedCharacter?.weaknesses.join(", "),
                protagonistMotivations: selectedCharacter?.motivations.join(", "),
                protagonistEmotionTriggerEvent: emotionTriggerEventPayload,
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
            if (protagonistEmotionTriggerEvent.length < 1) {
                toast.error("Kindly share an emotional trigger");
                return;
            }
            if (!selectedCharacter?.id) return; 
    
            let emotionTriggerEventPayload: string[] = protagonistEmotionTriggerEvent.map(trigger => trigger.value);
            
            showPageLoader();
            
            const response = await getHowCharacterOvercomeObstaclesSuggestions(emotionTriggerEventPayload);
            if (!response) {
                return;
            }
    
            if (response?.suggestedCharacters && response?.suggestedCharacters?.length > 0) {                
                setAdditionalCharacterSuggestions(response?.suggestedCharacters);
                setOpenCharacterSuggestionsModal(true);
            }
    
            let characterUpdated = await updateCharacter({
                emotionTriggerEvent: emotionTriggerEventPayload,
                storyId: initialStory?.id,
                confrontationStep: 3,
                howCharacterOvercomeObstacleSuggestions: response?.suggestions
            }, selectedCharacter?.id);
    
            refetch();    
            if (characterUpdated) {            
                setOpenProtagonistEmotionTriggerEventModal(false);
            }
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    return (
        <>
        <Sheet open={openProtagonistEmotionTriggerEventModal} onOpenChange={setOpenProtagonistEmotionTriggerEventModal}>
            <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll md:min-w-[96%] lg:min-w-[50%]">
                <SheetHeader className=''>
                    <SheetTitle className='font-bold text-lg'>
                    What events or circumstances trigger strong emotions in the character?
                    </SheetTitle>
                </SheetHeader>
                <SheetDescription></SheetDescription>

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
                            value={protagonistEmotionTriggerEvent}
                            onChange={setProtagonistEmotionTriggerEvents}
                            defaultOptions={defaultOptions}
                            placeholder="Choose or add trigger events"
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
                            protagonistEmotionTriggerEvent?.map((event, index) => (
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
            openCharacterSuggestionsModal={openCharacterSuggestionsModal}
            setOpenCharacterSuggestionsModal={setOpenCharacterSuggestionsModal}
            setAdditionalCharacterSuggestions={setAdditionalCharacterSuggestions}
            additionalCharacterSuggestions={additionalCharacterSuggestions}
            initialStory={initialStory}
        />
    </>
    )
}

export default ProtagonistEmotionTriggerEventComponent
