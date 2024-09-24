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

interface UnresolvedIssuesFromDepartureComponentProps {
    openUnresolvedIssuesFromDepartureComponentModal: boolean;
    setOpenUnresolvedIssuesFromDepartureComponentModal: React.Dispatch<React.SetStateAction<boolean>>;      
    selectedCharacter: CharacterInterface|null;
    initialStory: StoryInterface;
    saveStory: (val: any) => null|object;
    refetch:() => void;
}

const UnresolvedIssuesFromDepartureComponent: React.FC<UnresolvedIssuesFromDepartureComponentProps> = ({
    openUnresolvedIssuesFromDepartureComponentModal, 
    setOpenUnresolvedIssuesFromDepartureComponentModal,
    selectedCharacter,
    initialStory,
    saveStory,
    refetch,
}) => {
    const [openCharacterSuggestionsModal, setOpenCharacterSuggestionsModal] = useState<boolean>(false);
    const [additionalCharacterSuggestions, setAdditionalCharacterSuggestions] = useState<SuggestedCharacterInterface[]>([]);

    const [unresolvedIssuesFromDeparture, setUnresolvedIssuesFromDeparture] = useState<Option[]>([]);
    const [defaultOptions, setDefaultOptions] = useState<Option[]>([]);

    useEffect(() => {
        setUnresolvedIssuesFromDeparture(selectedCharacter?.unresolvedIssuesFromDeparture ? selectedCharacter?.unresolvedIssuesFromDeparture?.map(item => ( { label: item, value: item } )) : []);
        setDefaultOptions(selectedCharacter?.unresolvedIssuesFromDepartureSuggestions ? selectedCharacter?.unresolvedIssuesFromDepartureSuggestions?.map(suggestion => ( { label: suggestion, value: suggestion } )) : []);
    }, [selectedCharacter]);


    // unresolvedIssuesFromDeparture
    // UnresolvedIssuesFromDeparture
    // howCharactersGoalsAndPrioritiesChanged
    const summarize = async (payload: string[]) => {
        try {
            return true;   
        } catch (error) {
            console.error(error);     
            return false;
        }
    }

    const save = async () => {   
        try {            
            if (unresolvedIssuesFromDeparture.length < 1) {
                toast.error("Kindly share how the character overcomes obstacles");
                return;
            }
            if (!selectedCharacter?.id) return; 
        
            let unresolvedIssuesFromDeparturePayload: string[] = unresolvedIssuesFromDeparture.map(trigger => trigger.value);            
        
            showPageLoader();
        
            let characterUpdated = await updateCharacter({
                unresolvedIssuesFromDeparture: unresolvedIssuesFromDeparturePayload,
                storyId: initialStory?.id,
            }, selectedCharacter?.id);
        
            refetch();    
            setOpenUnresolvedIssuesFromDepartureComponentModal(false);
            
            if (characterUpdated) {            
                setOpenUnresolvedIssuesFromDepartureComponentModal(false);
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
            <Sheet open={openUnresolvedIssuesFromDepartureComponentModal} onOpenChange={setOpenUnresolvedIssuesFromDepartureComponentModal}>
                <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll sm:min-w-70%] md:min-w-[96%] lg:min-w-[60%] xl:min-w-[50%]">
                    <SheetHeader className=''>
                        <SheetTitle className='font-bold text-lg'>
                        Are there any unresolved issues from the character's departure that impact their reentry into the story? 
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
                                value={unresolvedIssuesFromDeparture}
                                onChange={setUnresolvedIssuesFromDeparture}
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
                            unresolvedIssuesFromDeparture?.map((item, index) => (
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

export default UnresolvedIssuesFromDepartureComponent
