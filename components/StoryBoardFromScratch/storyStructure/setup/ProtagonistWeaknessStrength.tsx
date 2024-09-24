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
import { extractTemplatePrompts, mergeStorytellingFormWithIdea, queryLLM } from '@/services/LlmQueryHelper';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { Card } from "@/components/ui/card";
import { CopyIcon, User } from 'lucide-react';
import { toast } from 'sonner';
import { ProtagonistCharacteristicsInterface } from '@/interfaces/ProtagonistInterface';
import { CharacterInterface, SuggestedCharacterInterface } from '@/interfaces/CharacterInterface';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { DallEAPIWrapper } from '@langchain/openai';
import CharacterSuggestionsModal from '../CharacterSuggestionsModal';
import Image from 'next/image';
import { updateCharacter } from '@/services/request';


interface ProtagonistWeaknessStrengthProps {
    openProtagonistWeaknessStrength: boolean;
    selectedCharacter: CharacterInterface|null;
    selectedCharacterSuggestion: ProtagonistCharacteristicsInterface|null;
    setOpenProtagonistWeaknessStrength: React.Dispatch<React.SetStateAction<boolean>>;      
    initialStory: StoryInterface;
    saveStory: (val: any) => null|object;
    refetch:() => void;
}

const ProtagonistWeaknessStrength: React.FC<ProtagonistWeaknessStrengthProps> = ({
    openProtagonistWeaknessStrength,
    setOpenProtagonistWeaknessStrength,
    selectedCharacter,
    selectedCharacterSuggestion,
    initialStory,
    saveStory,
    refetch,
}) => {

    const [strengths, setStrengths] = useState<Option[]>([]);
    const [weaknesses, setWeaknesses] = useState<Option[]>([]);
    const [skills, setSkills] = useState<Option[]>([]);
    const [personalityTraits, setPersonalityTraits] = useState<Option[]>([]);

    const [additionalCharacterSuggestions, setAdditionalCharacterSuggestions] = useState<SuggestedCharacterInterface[]>([]);
    const [openCharacterSuggestionsModal, setOpenCharacterSuggestionsModal] = useState<boolean>(false);
  
    const dynamicJwtToken = getAuthToken();

    useEffect(() => {
        setWeaknesses(selectedCharacter?.weaknesses ? selectedCharacter?.weaknesses?.map(weakness => ( { label: weakness, value: weakness } )) : []);
        setStrengths(selectedCharacter?.strengths ? selectedCharacter?.strengths?.map(strength => ( { label: strength, value: strength } )) : []);
        setSkills(selectedCharacter?.skills ? selectedCharacter?.skills?.map(skill => ( { label: skill, value: skill } )) : []);
        setPersonalityTraits(selectedCharacter?.personalityTraits ? selectedCharacter?.personalityTraits?.map(trait => ( { label: trait, value: trait } )) : []);
    }, [selectedCharacter]);
    
    function formatCharacteristics(data) {
        const characteristics: string[] = [];
        const characteristicTypes = Object.keys(data);
      
        characteristicTypes.forEach((type) => {
          const characteristicList = data[type];
          const formattedString = characteristicList.map((char, index) => {
            if (index < characteristicList.length - 1) {
              return `${char}, `;
            }
            return char;
          }).join('');
          characteristics.push(`${type}: ${formattedString}`);
        });
      
        return characteristics.join('. ');
    }

    const save = async () => {            
        try {
            let valid = validateSubmission();    
            if (!valid) return;
            if (!selectedCharacter?.id) return; 
    
            let payload = {
                strengths: strengths.map(strength => strength.value),
                weaknesses: weaknesses.map(weakness => weakness.value),
                skills: skills.map(skill => skill.value),
                personalityTraits: personalityTraits.map(motivation => motivation.value),
            }
            
            showPageLoader();

            const response = await getProtagonistGoalMotivationSuggestions(payload);
            if (!response) {
                return;
            }
    
            if (response?.suggestedCharacters && response?.suggestedCharacters.length > 0) {                
                setAdditionalCharacterSuggestions(response?.suggestedCharacters);
                setOpenCharacterSuggestionsModal(true);
            }
            
            let characterUpdated = await updateCharacter({
                ...payload,
                protagonistGoalMotivationSuggestions: response?.suggestions,
                confrontationStep: 1,
                storyId: initialStory.id,
                suggestedCharacters: response?.suggestedCharacters
            }, selectedCharacter?.id);
    
            if (characterUpdated) {            
                refetch();    
                setOpenProtagonistWeaknessStrength(false);
            }                           
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    } 

    const getProtagonistGoalMotivationSuggestions = async (payload) => {
        try {
            let { genrePrompt, thematicElementsPrompt, otherCharactersPrompt } = extractTemplatePrompts(initialStory);
            
            let question = `What motivates or drives the character to pursue their goal?`;

            const prompt = `
            You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
            We just concluded the act one, and we have been able to answer questions like: 
            who is the protagonist?, 
            what does the protagonists want?, 
            who has what they want?, 
            who does not have what they want?,  
            what obstacles or challenges does the character face in achieving their goal? and 
            What are the protagonists's strengths and weaknesses?
            We are currently trying move to Act 2 which is The Confrontation and to also answer the next question in order to explore & develop our character and the question is {question}, so you would generate at least 7 suggestion answers to the question and ensure to use simple grammar. 
            Analyze the protagonist, what they want, who has what they want, who does not have what they want, what obstacles or challenges does the character face in achieving their goal?, What are the protagonists's strengths and weaknesses?, genre, suspense technique, thematic element & option, and also ensure you suggestions relate to these information. 
            
            To determine what motivates or drives the character to pursue their goal, consider the following elements:
            Character's Inner Demons: What are the character's deep-seated fears, insecurities, or emotional wounds that force them to pursue their goal? Are they trying to prove something to themselves or others?
            Personal Goals: What personal goals or aspirations does the character have that drive their pursuit? Is it a sense of accomplishment, recognition, or a desire to leave a lasting legacy?
            External Pressures: Are there external pressures or forces that push the character to pursue their goal? Does someone else's expectations, societal norms, or the consequences of failure drive them?
            Idealistic Motivations: Is the character motivated by a desire to make a positive impact, help others, or create something meaningful? Do they believe their goal will bring about a better future for themselves or others?
            Ego or Pride: Are the character's motivations driven by a desire to prove themselves, boost their ego, or assert their dominance? Do they want to outdo others or defend their reputation?
            Fear of Loss: Is the character motivated by the fear of losing something they already have? Are they trying to preserve status quo or avoid a perceived loss?
            Sense of Responsibility: Does the character feel a sense of responsibility to complete their goal due to a perceived obligation, duty, or sense of obligation to others?
            Internal Conflict: Is the character driven by internal conflict or turmoil? Are they trying to reconcile opposing desires, values, or beliefs?
            Unconscious Desires: Are the character's motivations driven by unconscious desires or desires that they're not fully aware of? Are these desires coming from their subconscious or something they've been suppressing?
            Environmental Factors: Are there environmental factors that influence the character's motivations? For example, do they grow up in an environment that encourages a particular pursuit or discourages something else?

            The protagonists is {protagonists}. After analyzing the protagonists and other characters {otherCharacters}. If there is a need to add additional characters that can fit into the protagonists journey, kindly generate them and ensure the suggestions are related to the context of the protagonists journey. Put the suggestions in the suggestedCharacters json object in the response.
            When generating the suggested characters ensure the role, name or relationship to the protagonist do not exists among the existing characters.        

            Return your response in a JSON format with the following keys:
            - suggestions(array of strings, These are suggestions to the question {question}) and
            - suggestedCharacters(array of objects with keys name(string), backstory(string), role(string), disabled(boolean, set this to false always) & relationshipToProtagonist(string)) as the keys. 
            Please ensure the only key in the object is the suggestions and suggestedCharacters keys only.
            Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
            Ensure you response is a json object string, we need to avoid the SyntaxError: Unexpected token error after parsing the response.        

            who is the protagonist: {protagonists}
            existing characters: {otherCharacters}
            what does the protagonists want: {whatTheyWant}
            who has what they want: {whoHasIt}
            who does not have what they want: {whoDoesNotHaveProtagonistGoal}
            protagonist's goal obstacles or challenges: {protagonistGoalObstacle}
            protagonist's strengths and weaknesses: {protagonistStrengthWeakness}
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
                protagonistStrengthWeakness: formatCharacteristics({strengths: payload.strengths, weaknesses: payload.weaknesses}),
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

    const validateSubmission = () => {
        if (strengths.length < 1) {
            toast.error("Kindly provide the protagonists strengths");
            return false;
        }
        if (weaknesses.length < 1) {
            toast.error("Kindly provide the protagonists weaknesses");
            return false;
        }
        return true;
    }


    return (
        <>
            <Sheet open={openProtagonistWeaknessStrength} onOpenChange={setOpenProtagonistWeaknessStrength}>
                <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll md:min-w-[96%] lg:min-w-[50%]">
                    <SheetHeader className=''>
                        <SheetTitle className='font-bold text-2xl'>
                        What are the character's strengths and weaknesses?
                        </SheetTitle>
                        <SheetDescription className=''></SheetDescription>
                    </SheetHeader>

                    {
                        selectedCharacter &&
                        <div className='mt-7'>
                            {/* <div className='flex items-center gap-3 p-3 w-3/4 rounded-xl border border-gray-800 bg-yellow-400'>
                                <div className="w-10 h-10 border border-gray-800 bg-white  rounded-full flex items-center justify-center">
                                    <User className='text-gray-800'/>
                                </div>
                                <p>{selectedCharacter?.name}</p>
                            </div> */}

                            <div className='flex items-center bg-gray-900 gap-5 p-3 rounded-2xl my-7'>
                                <div className='rounded-2xl'>
                                    <Image src={selectedCharacter?.imageUrl ?? '/user-image.jpeg'} 
                                    className='rounded-2xl border border-gray-900' loading="lazy" height={80} width={80} alt="Logo"/>
                                </div>
                                <p className='text-lg text-gray-50 font-semibold'>{selectedCharacter?.name}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-10 mt-7">

                                <Tabs defaultValue="strengths" className="w-full">
                                    <TabsList className='w-full border bg-gray-100'>
                                        <TabsTrigger className='w-full text-xs' value="strengths">Strengths</TabsTrigger>
                                        <TabsTrigger className='w-full text-xs' value="weaknesses">Weaknesses</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="strengths">                                                                    

                                        <MultipleSelector
                                            creatable
                                            value={strengths}
                                            onChange={setStrengths}
                                            defaultOptions={selectedCharacter?.strengthsSuggestions}
                                            placeholder="Choose strengths"
                                            emptyIndicator={
                                                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                                    no results found.
                                                </p>
                                            }
                                            className='outline-none bg-white'
                                        />
                                    </TabsContent>

                                    <TabsContent value="weaknesses">
                                        <MultipleSelector
                                            creatable
                                            value={weaknesses}
                                            onChange={setWeaknesses}
                                            defaultOptions={selectedCharacter?.weaknessesSuggestions}
                                            placeholder="Choose weaknesses"
                                            emptyIndicator={
                                                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                                    no results found.
                                                </p>
                                            }
                                            className='outline-none bg-white'
                                        />
                                    </TabsContent>
                                </Tabs>

                                <Tabs defaultValue="skills" className="w-full">
                                    <TabsList className='w-full border'>
                                        <TabsTrigger className='w-full text-xs' value="skills">Skills</TabsTrigger>
                                        <TabsTrigger className='w-full text-xs' value="personalityTraits">Personality Traits</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="skills">
                                        <MultipleSelector
                                            creatable
                                            value={skills}
                                            onChange={setSkills}
                                            defaultOptions={selectedCharacter?.skillsSuggestions}
                                            placeholder="Choose skills"
                                            emptyIndicator={
                                                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                                    no results found.
                                                </p>
                                            }
                                            className='outline-none bg-white'
                                        />
                                    </TabsContent>

                                    <TabsContent value="personalityTraits">
                                        <MultipleSelector
                                            creatable
                                            value={personalityTraits}
                                            onChange={setPersonalityTraits}
                                            defaultOptions={selectedCharacter?.personalityTraitsSuggestions}
                                            placeholder="Choose Personality Traits"
                                            emptyIndicator={
                                                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                                    no results found.
                                                </p>
                                            }
                                            className='outline-none bg-white'
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <Button onClick={save} className='mt-5 bg-custom_green text-white'>Save</Button>

                        </div>
                    }
                </SheetContent>
            </Sheet>
                    
            <CharacterSuggestionsModal
            refetch={refetch}
                initialStory={initialStory}
                openCharacterSuggestionsModal={openCharacterSuggestionsModal}
                setOpenCharacterSuggestionsModal={setOpenCharacterSuggestionsModal}
                setAdditionalCharacterSuggestions={setAdditionalCharacterSuggestions}
                additionalCharacterSuggestions={additionalCharacterSuggestions}
            />
        </>
    );
}

export default ProtagonistWeaknessStrength
