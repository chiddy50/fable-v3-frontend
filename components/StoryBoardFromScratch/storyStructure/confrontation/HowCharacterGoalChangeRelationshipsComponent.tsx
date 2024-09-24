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

interface HowCharacterGoalChangeRelationshipsComponentProps {
    // "How do the character's relationships and conflicts change as they go after their goal? (Relationship Escalation)"                            

  openHowCharacterGoalChangeRelationshipsModal: boolean;
  setOpenHowCharacterGoalChangeRelationshipsModal: React.Dispatch<React.SetStateAction<boolean>>;      
  selectedCharacter: CharacterInterface|null;
  initialStory: StoryInterface;
  saveStory: (val: any) => null|object;
  refetch:() => void;
}

const HowCharacterGoalChangeRelationshipsComponent: React.FC<HowCharacterGoalChangeRelationshipsComponentProps> = ({
    openHowCharacterGoalChangeRelationshipsModal,
    setOpenHowCharacterGoalChangeRelationshipsModal,
    selectedCharacter,
    initialStory,
    saveStory,
    refetch,
}) => {

    const [openCharacterSuggestionsModal, setOpenCharacterSuggestionsModal] = useState<boolean>(false);
    const [additionalCharacterSuggestions, setAdditionalCharacterSuggestions] = useState<SuggestedCharacterInterface[]>([]);

    const [howCharacterGoalChangeRelationships, setHowCharacterGoalChangeRelationships] = useState<Option[]>([]);
    const [defaultOptions, setDefaultOptions] = useState<Option[]>([]);

    useEffect(() => {
        setHowCharacterGoalChangeRelationships(selectedCharacter?.howCharacterGoalChangeRelationship ? selectedCharacter?.howCharacterGoalChangeRelationship?.map(item => ( { label: item, value: item } )) : []);
        setDefaultOptions(selectedCharacter?.howCharacterGoalChangeRelationshipSuggestions ? selectedCharacter?.howCharacterGoalChangeRelationshipSuggestions?.map(suggestion => ( { label: suggestion, value: suggestion } )) : []);
    }, [selectedCharacter]);
    
    const getHowCharacterHasGrownSuggestions = async (payload: string[]) => {
        try {
            let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt } = extractTemplatePrompts(initialStory);
                        
            let question = `How has the character changed or grown through their experiences?`;
            
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
            What events or circumstances trigger strong emotions in the character? 
            How does the character overcome obstacles? and
            How do the character's relationships and conflicts change as they go after their goal?
            We are currently in the second act which is The Confrontation and we are also trying to answer the next question in order to explore & develop our character and the question is {question}, so you would generate at least 7 suggestion answers to the question and ensure to use simple grammar. 
            Analyze the protagonist, what they want, genre, suspense technique, thematic element & option, and also ensure you suggestions relate to these information. 

            During the Confrontation Act of the story, the protagonists has encountered numerous challenges and obstacles.
            When suggesting or determining how a character has changed or grown through their experiences, here are the key elements to consider:
            - New Skills or Abilities: Has the character acquired new skills or abilities that will aid them in future challenges?
            - Shift in Perspective: Have they gained a new understanding or perspective on their circumstances, other characters, or themselves?
            - Emotional Intelligence: Have they developed greater emotional intelligence, empathy, or self-awareness through their experiences?
            - Loss or Sacrifice: Have they lost something or someone significant, leading to a deeper appreciation for what they had or a newfound sense of purpose?
            - Realization or Epiphany: Has the character experienced a profound realization or epiphany that has altered their course of action or their character's trajectory?
            - Resilience and Adaptability: Have they demonstrated resilience and adaptability in the face of adversity, leading to increased confidence or determination?
            - Redefining Relationships: Have their relationships with other characters been redefined or transformed as a result of their experiences?
            - Increased Self-Awareness: Have they gained a deeper understanding of themselves, their motivations, or their strengths and weaknesses?
            - Lessons Learned: What lessons have they learned from their experiences, and how will these lessons shape their future actions?
            - Character Arc Progression: How have these changes advanced the character's overall arc, bringing them closer to their ultimate goal or transformation?

            To determine how a character has changed or grown through their experiences in the Confrontation Act, consider the impact of their experiences on their skills, perspectives, emotional intelligence, relationships, and self-awareness. Ask yourself: What lessons have they learned, and how have these lessons shaped their character arc? How have they adapted to challenges, and what new strengths or weaknesses have emerged? By exploring these elements, you can craft a compelling narrative that showcases the character's growth and transformation.

            The protagonists is {protagonists}. After analyzing the protagonists and existing characters {otherCharacters}. If there is a need to add additional characters that can fit into the protagonists journey, kindly generate them and ensure the suggestions are related to the context of the protagonists journey. Put the suggestions in the suggestedCharacters json object in the response.
            When generating the suggested characters ensure the role, name or relationship to the protagonist do not exists among the existing characters.        
        
            Return your response in a JSON format with the following keys:
            suggestions(array of strings, These are suggestions to the question {question}) and 
            suggestedCharacters(array of objects with keys name(string), backstory(string), role(string), disabled(boolean, set this to false always) & relationshipToProtagonist(string)). 
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
            how do the character's relationships and conflicts change as they go after their goal?: {howCharacterGoalChangeRelationships}
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
                howCharacterOvercomeObstacles: selectedCharacter?.howCharacterOvercomeObstacles?.join(", "),
                howCharacterGoalChangeRelationships: payload.join(", "),
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
            if (howCharacterGoalChangeRelationships.length < 1) {
                toast.error("Kindly share how the character overcomes obstacles");
                return;
            }
            if (!selectedCharacter?.id) return; 
        
            let howCharacterGoalChangeRelationshipsPayload: string[] = howCharacterGoalChangeRelationships.map(trigger => trigger.value);            
        
            showPageLoader();
            
            const response = await getHowCharacterHasGrownSuggestions(howCharacterGoalChangeRelationshipsPayload);
            if (!response) {
                return;
            }
            // return
        
            if (response?.suggestedCharacters && response?.suggestedCharacters?.length > 0) {                
                setAdditionalCharacterSuggestions(response?.suggestedCharacters);
                setOpenCharacterSuggestionsModal(true);
            }
        
            let characterUpdated = await updateCharacter({
                howCharacterGoalChangeRelationship: howCharacterGoalChangeRelationshipsPayload,
                storyId: initialStory?.id,
                resolutionStep: 1,      
                // currentPlotStep: 3,       
                howCharacterHasGrownSuggestions: response?.suggestions,
                suggestedCharacters: response?.suggestedCharacters
            }, selectedCharacter?.id);
        
            refetch();    
            if (characterUpdated) {            
                setOpenHowCharacterGoalChangeRelationshipsModal(false);
            }

            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }
    
    return (
        <>
            <Sheet open={openHowCharacterGoalChangeRelationshipsModal} onOpenChange={setOpenHowCharacterGoalChangeRelationshipsModal}>
                <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll md:min-w-[96%] lg:min-w-[50%]">
                    <SheetHeader className=''>
                        <SheetTitle className='font-bold text-lg'>
                        How do the character's relationships and conflicts change as they go after their goal?                     
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
                                value={howCharacterGoalChangeRelationships}
                                onChange={setHowCharacterGoalChangeRelationships}
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
                            howCharacterGoalChangeRelationships?.map((item, index) => (
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
    );
}

export default HowCharacterGoalChangeRelationshipsComponent
