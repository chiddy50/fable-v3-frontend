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

interface HowCharactersGoalsAndPrioritiesChangedComponentProps {
  openHowCharactersGoalsAndPrioritiesChangedModal: boolean;
  setOpenHowCharactersGoalsAndPrioritiesChangedModal: React.Dispatch<React.SetStateAction<boolean>>;      
  selectedCharacter: CharacterInterface|null;
  initialStory: StoryInterface;
  saveStory: (val: any) => null|object;
  refetch:() => void;
}

const HowCharactersGoalsAndPrioritiesChangedComponent: React.FC<HowCharactersGoalsAndPrioritiesChangedComponentProps> = ({
    openHowCharactersGoalsAndPrioritiesChangedModal,
    setOpenHowCharactersGoalsAndPrioritiesChangedModal,
    selectedCharacter,
    initialStory,
    saveStory,
    refetch,
}) => {
    //howCharactersGoalsAndPrioritiesChanged

    const [openCharacterSuggestionsModal, setOpenCharacterSuggestionsModal] = useState<boolean>(false);
    const [additionalCharacterSuggestions, setAdditionalCharacterSuggestions] = useState<SuggestedCharacterInterface[]>([]);

    const [howCharactersGoalsAndPrioritiesChanged, setHowCharactersGoalsAndPrioritiesChanged] = useState<Option[]>([]);
    const [defaultOptions, setDefaultOptions] = useState<Option[]>([]);

    useEffect(() => {
        setHowCharactersGoalsAndPrioritiesChanged(selectedCharacter?.howCharactersGoalsAndPrioritiesChanged ? selectedCharacter?.howCharactersGoalsAndPrioritiesChanged?.map(item => ( { label: item, value: item } )) : []);
        setDefaultOptions(selectedCharacter?.howCharactersGoalsAndPrioritiesChangedSuggestions ? selectedCharacter?.howCharactersGoalsAndPrioritiesChangedSuggestions?.map(suggestion => ( { label: suggestion, value: suggestion } )) : []);
    }, [selectedCharacter]);

    const getUnresolvedIssuesFromDepartureSuggestions = async (payload: string[]) => {
        try {
            let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt } = extractTemplatePrompts(initialStory);
                        
            let question = `How have the character's goals and priorities changed throughout their journey?`;
            
            let haveOtherProtagonist = initialStory.storyStructure.protagonists.length > 1 ? 
            ` The current protagonist we are focusing on is, {currentCharacter}. All the protagonists are {protagonists}. The other supporting characters are {otherCharacters}.` : 
            `The protagonist is, {currentCharacter}. The other supporting characters are {otherCharacters}.`;

            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
            ${haveOtherProtagonist}
            We are currently in the second act, and we have been able to answer questions like: 
            who is the protagonist?, 
            what does the protagonists want?, 
            who has what they want?, 
            who does not have what they want?,  
            what obstacles or challenges does the character face in achieving their goal?,  
            what are the protagonists's strengths and weaknesses? 
            what motivates or drives the character to pursue their goal? 
            What events or circumstances trigger strong emotions in the character? 
            How does the character overcome obstacles? and
            How do the character's relationships and conflicts change as they go after their goal?
            We are currently in the second act which is The Confrontation and we are also trying to answer the next question in order to explore & develop our character and the question is {question}, so you would generate at least 7 suggestion answers to the question and ensure to use simple grammar. 
            Analyze the protagonist, what they want, genre, suspense technique, thematic element & option, and also ensure you suggestions relate to these information. 

            In the resolution stage of a character's journey, answering the question "How have the character's goals and priorities changed throughout their journey?" typically involves several key elements:
            1. Initial goals vs. final goals: Compare the character's objectives at the beginning and end of the story. How have their desires, needs, or motivations evolved?
            2. Shift in Motivation: Their initial goals evolve or deepen based on their experiences, influencing their priorities.
            3. Personal Growth: The character develops new priorities, focusing more on inner growth or relationships over external achievements.
            4. Priorities shift: Identify the turning points where the character's priorities changed. What triggered these shifts? Was it a new revelation, a changed circumstance, or a personal growth moment?
            5. Lessons learned: What did the character learn about themselves and the world around them? How did these lessons influence their goals and priorities?
            6. Confronting flaws and weaknesses: Did the character confront and overcome their flaws or weaknesses? How did this impact their goals and priorities?
            7. Resolution of Conflicts: Internal and external conflicts are resolved, impacting the character's decisions and shaping their new goals.
            8. Growth and maturity: How did the character grow and mature throughout the story? Did they become more selfless, confident, or resilient?
            9. Sacrifice or Acceptance: The character may give up their original goal or accept a new reality, showing a shift in values and priorities.
            10. Impact of Relationships: Relationships play a role in shaping their new goals and priorities, often reflecting a deeper understanding of themselves and others.
            11. Alignment with Themes: Their final goals often align with the story's central themes, reflecting their personal and thematic growth.
            12. New values and perspectives: Did the character adopt new values or perspectives that aligned with or challenged their previous goals and priorities?
            13. Circumstantial changes: How did changes in the character's circumstances (e.g., environment, relationships, or external pressures) affect their goals and priorities?
            14. Self-awareness and introspection: Did the character develop a deeper understanding of themselves and their place in the world? How did this self-awareness influence their goals and priorities?
            
            After analyzing the protagonists and existing characters {otherCharacters}. If there is a need to add additional characters that can fit into the protagonists journey, kindly generate them and ensure the suggestions are related to the context of the protagonists journey. Put the suggestions in the suggestedCharacters json object in the response.
            When generating the suggested characters ensure the role, name or relationship to the protagonist do not exists among the existing characters.        
            
            Return your response in a JSON format with the following keys:
            suggestions(array of strings, These are suggestions to the question {question}) and 
            suggestedCharacters(array of objects with keys name(string), backstory(string), role(string), disabled(boolean, set this to false always) & relationshipToProtagonist(string)). 
            Please ensure that only the json or javascript object with suggestions and suggestedCharacters keys only is returned.
            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
            Ensure you response is a json object string, we need to avoid the SyntaxError: Unexpected token error after parsing the json response.
        
            who is the protagonist we are focusing on: {currentCharacter}
            All protagonists soo far are: {protagonists}
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
            how do the character's relationships and conflicts change as they go after their goal?: {howCharacterGoalChangeRelationships}
            how the character changed or grown through their experiences?: {howCharacterHasGrown}
            question: {question}
            genre: {genre}
            thematic element & option: {thematicElement}
            suspense technique: {suspenseTechnique}
            suspense technique description: {suspenseTechniqueDescription}
            `;
          
            const response = await queryLLM(prompt, {
                currentCharacter: `Name: ${selectedCharacter?.name} and Backstory: ${selectedCharacter?.backstory}`,
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
                howCharacterOvercomeObstacles: selectedCharacter?.howCharacterOvercomeObstacles?.join(", "),
                howCharacterGoalChangeRelationships: selectedCharacter?.howCharacterGoalChangeRelationship.join(", "),
                howCharacterHasGrown: payload.join(", "),
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
        // unresolvedIssuesFromDeparture                         
        try {            
            if (howCharactersGoalsAndPrioritiesChanged.length < 1) {
                toast.error("Kindly share how the character overcomes obstacles");
                return;
            }
            if (!selectedCharacter?.id) return; 
        
            let howCharactersGoalsAndPrioritiesChangedPayload: string[] = howCharactersGoalsAndPrioritiesChanged.map(trigger => trigger.value);            
        
            showPageLoader();
            
            const response = await getUnresolvedIssuesFromDepartureSuggestions(howCharactersGoalsAndPrioritiesChangedPayload);
            if (!response) {
                toast.error("Try again please");
                return;
            }
            
            if (response?.suggestedCharacters && response?.suggestedCharacters?.length > 0) {                
                setAdditionalCharacterSuggestions(response?.suggestedCharacters);
                setOpenCharacterSuggestionsModal(true);
            }
        
            let characterUpdated = await updateCharacter({
                howCharactersGoalsAndPrioritiesChanged: howCharactersGoalsAndPrioritiesChangedPayload,
                storyId: initialStory?.id,
                resolutionStep: 3,      
                unresolvedIssuesFromDepartureSuggestions: response?.suggestions,
                suggestedCharacters: response?.suggestedCharacters
            }, selectedCharacter?.id);
        
            refetch();    
            setOpenHowCharactersGoalsAndPrioritiesChangedModal(false);
            
            if (characterUpdated) {            
                setOpenHowCharactersGoalsAndPrioritiesChangedModal(false);
            }
            
        } catch (error) {
            console.error(error);            
            toast.error("Try again please");
        }finally{
            hidePageLoader();
        }
    }

    return (
        <>
            <Sheet open={openHowCharactersGoalsAndPrioritiesChangedModal} onOpenChange={setOpenHowCharactersGoalsAndPrioritiesChangedModal}>
                <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll sm:min-w-70%] md:min-w-[96%] lg:min-w-[60%] xl:min-w-[50%]">
                    <SheetHeader className=''>
                        <SheetTitle className='font-bold text-lg'>
                        How have the character's goals and priorities changed throughout their journey? 
                        </SheetTitle>
                        <SheetDescription></SheetDescription>
                    </SheetHeader>
            
                    <div className='mt-7'>
                        <div className='flex items-center bg-gray-50 gap-5 p-3 rounded-2xl mb-5'>
                            <div className='rounded-2xl'>
                                <Image src={selectedCharacter?.imageUrl ?? '/user-image.jpeg'} 
                                className='rounded-2xl border border-gray-200' loading="lazy" height={80} width={80} alt="Logo"/>
                            </div>
                            <div>
                                <p className='text-lg text-gray-800 font-semibold'>{selectedCharacter?.name}</p>
                                <p className='text-xs text-gray-800 font-light'>{selectedCharacter?.role}</p>
                            </div>
                        </div>
                        <div className='mt-10'>
                            <p className='text-sm font-bold mb-2'>Here are some suggestions:</p>
                
                            <MultipleSelector
                                creatable
                                value={howCharactersGoalsAndPrioritiesChanged}
                                onChange={setHowCharactersGoalsAndPrioritiesChanged}
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
                            howCharactersGoalsAndPrioritiesChanged?.map((item, index) => (
                            <li className='mb-2' key={`_${index}_`}> 
                                <Card className='text-xs flex items-center gap-2 mb-2 p-4'>            
                                    <div className='flex items-start'>
                                        <Check className='w-4 h-4 text-green-600 cursor-pointer'/>                            
                                    </div>
                                    <span>{item.label}</span>
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

export default HowCharactersGoalsAndPrioritiesChangedComponent
