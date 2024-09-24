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
import { CopyIcon, User } from 'lucide-react';
import { toast } from 'sonner';
import { CharacterInterface, SuggestedCharacterInterface } from '@/interfaces/CharacterInterface';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';

import CharacterSuggestionsModal from '../CharacterSuggestionsModal';
import Image from 'next/image';
import { updateCharacter } from '@/services/request';

interface ProtagonistGoalMotivationsComponentProps {
    openProtagonistMotivationsModal: boolean;
    setOpenProtagonistMotivationsModal: React.Dispatch<React.SetStateAction<boolean>>;      
    selectedCharacter: CharacterInterface|null;
    initialStory: StoryInterface;
    saveStory: (val: any) => null|object;
    refetch:() => void;
}

const ProtagonistGoalMotivationsComponent: React.FC<ProtagonistGoalMotivationsComponentProps> = ({
    openProtagonistMotivationsModal,
    setOpenProtagonistMotivationsModal,
    selectedCharacter,
    initialStory,
    saveStory,
    refetch,
}) => {
    const [motivations, setMotivations] = useState<Option[]>([]);
    const [defaultOptions, setDefaultOptions] = useState<Option[]>([]);
    
    const [openCharacterSuggestionsModal, setOpenCharacterSuggestionsModal] = useState<boolean>(false);
    const [additionalCharacterSuggestions, setAdditionalCharacterSuggestions] = useState<SuggestedCharacterInterface[]>([]);

    useEffect(() => {
        setMotivations(selectedCharacter?.motivations ? selectedCharacter?.motivations?.map(motivation => ( { label: motivation, value: motivation } )) : []);
        setDefaultOptions(selectedCharacter?.motivationSuggestions ? selectedCharacter?.motivationSuggestions?.map(motivation => ( { label: motivation, value: motivation } )) : []);
    }, [selectedCharacter]);

    const getProtagonistEmotionTriggerEventSuggestions = async (protagonistMotivations: string[]) => {
        try {
            let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt } = extractTemplatePrompts(initialStory);
            
            let question = `What events or circumstances trigger strong emotions in the character?`;
    
            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
            We are currently in the second act, and we have been able to answer questions like: 
            who is the protagonist?, 
            what does the protagonists want?, 
            who has what they want?, 
            who does not have what they want?,  
            what obstacles or challenges does the character face in achieving their goal?,  
            what are the protagonists's strengths and weaknesses? and 
            what motivates or drives the character to pursue their goal?
            We are currently in the second act which is The Confrontation and we are also trying to answer the next question in order to explore & develop our character and the question is {question}, so you would generate at least 7 suggestion answers to the question and ensure to use simple grammar. 
            Analyze the protagonist, what they want, who has what they want, who does not have what they want, what obstacles or challenges does the character face in achieving their goal?, What are the protagonists's strengths and weaknesses?, what motivates or drives the character to pursue their goal?, genre, suspense technique, thematic element & option, and also ensure you suggestions relate to these information. 
            After analyzing the protagonists and existing characters if there is a need to add additional characters that can be added to fit into the protagonists journey, kindly generate them and ensure the suggestions are related to the context of the protagonists journey.

            To generate and determine the events or circumstances that trigger strong emotions in a character during the confrontation act, consider the following elements:
            - Character's Backstory: What traumatic experiences, past losses, or significant relationships have shaped the character's emotional responses?
            - Core Fears and Desires: What are the character's deep-seated fears and desires that drive their actions and emotions?
            - Current Stressors and Uncertainties: What are the character's current stressors and uncertainties that create emotional tension?
            - Emotional Triggers: What specific events, people, or situations trigger strong emotions in the character (e.g., fear, anger, sadness, joy)?
            - Personal Weaknesses and Flaws: What are the character's personal weaknesses and flaws that make them more susceptible to certain emotions?
            - Relationships and Dependencies: How do the character's relationships with others (e.g., family, friends, romantic partners) affect their emotional state?
            - Internal Conflict: What internal conflicts or contradictions within the character lead to emotional turmoil?
            - Power Dynamics: How do power imbalances or shifting power dynamics affect the character's emotions?
            - Loss and Sacrifice: What losses or sacrifices does the character face, and how do these impact their emotional state?
            - Character Growth and Change: How does the character's growth or lack thereof contribute to their emotional landscape?
            
            The generated answers to the question {question} should explore the following:
            - A situation that triggers intense fear or anxiety in the character.
            - An event that sparks anger or resentment in the character.
            - A circumstance that brings the character a sense of joy or elation.
            - A situation that creates a moral dilemma or internal conflict for the character.

            The protagonists is {protagonists}. After analyzing the protagonists and other characters {otherCharacters}. If there is a need to add additional characters that can fit into the protagonists journey, kindly generate them and ensure the suggestions are related to the context of the protagonists journey. Put the suggestions in the suggestedCharacters json object in the response.
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
                protagonistMotivations: protagonistMotivations.join(", "),
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
            if (motivations.length < 1) {
                toast.error("Kindly provide the protagonists motivations");
                return;
            }
            if (!selectedCharacter?.id) return; 
    
            let payload: string[] = motivations.map(motivation => motivation.value);
            console.log(payload);
            
            showPageLoader();
            
            const response = await getProtagonistEmotionTriggerEventSuggestions(payload);
            if (!response) {
                return;
            }
    
            if (response?.suggestedCharacters && response?.suggestedCharacters?.length > 0) {                
                setAdditionalCharacterSuggestions(response?.suggestedCharacters);
                setOpenCharacterSuggestionsModal(true);
            }
    
            let characterUpdated = await updateCharacter({
                motivations: payload,
                storyId: initialStory?.id,
                confrontationStep: 2,
                emotionTriggerEventsSuggestions: response?.suggestions
            }, selectedCharacter?.id);
    
            if (characterUpdated) {            
                setOpenProtagonistMotivationsModal(false);
            }
            refetch();    
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }              
    }

    return (
        <>
            <Sheet open={openProtagonistMotivationsModal} onOpenChange={setOpenProtagonistMotivationsModal}>
                <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
                    <SheetHeader className=''>
                        <SheetTitle className='font-bold text-xl'>
                        What motivates the protagonist(s) to pursue their goal?
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
                                value={motivations}
                                onChange={setMotivations}
                                defaultOptions={defaultOptions}
                                placeholder="Choose or add motivations"
                                emptyIndicator={
                                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                        no results found.
                                    </p>
                                }
                                className='outline-none bg-white'
                            />

                            <Button onClick={save} className='mt-5 bg-custom_green text-white'>Save</Button>

                        </div>
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
    );
}

export default ProtagonistGoalMotivationsComponent;
