"use client";

import React from 'react';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { User } from 'lucide-react';
import { SuggestedCharacterInterface } from '@/interfaces/CharacterInterface';
import { Button } from '@/components/ui/button';
import { createCharacter } from '@/services/request';
import { StoryInterface } from '@/interfaces/StoryInterface';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

interface CharacterSuggestionsModalProps {
    initialStory: StoryInterface;
    openCharacterSuggestionsModal: boolean;
    setOpenCharacterSuggestionsModal: React.Dispatch<React.SetStateAction<boolean>>;   
    setAdditionalCharacterSuggestions: React.Dispatch<React.SetStateAction<SuggestedCharacterInterface[]>>;   
    additionalCharacterSuggestions: SuggestedCharacterInterface[];   
}

const CharacterSuggestionsModal: React.FC<CharacterSuggestionsModalProps> = ({
    initialStory,
    openCharacterSuggestionsModal,
    setOpenCharacterSuggestionsModal,
    setAdditionalCharacterSuggestions,
    additionalCharacterSuggestions,}) => {


    const submitCharacterUpdate = async (character: SuggestedCharacterInterface) => {
        if (character?.disabled) return;        
        
        let characterAdded = await createCharacter(character, initialStory?.id);        
        if (characterAdded) {            
            disableCharacter(character);
        }
    }

    const disableCharacter = (character: SuggestedCharacterInterface) => {
        setAdditionalCharacterSuggestions(prevSuggestions => 
            prevSuggestions.map(item => {                
                if (item.name === character.name) return { ...item, disabled: true };
                return item;
            })
        );
    }

    const updateCharacterName = (event: string, character: SuggestedCharacterInterface) => {
        setAdditionalCharacterSuggestions(prevSuggestions => 
            prevSuggestions.map(item => {                
                if (item.name === character.name) return { ...item, name: event };
                return item;
            })
        );
    }

    const updateCharacterRole = (event: string, character: SuggestedCharacterInterface) => {
        setAdditionalCharacterSuggestions(prevSuggestions => 
            prevSuggestions.map(item => {                
                if (item.name === character.name) return { ...item, role: event };
                return item;
            })
        );      
    }

    const updateCharacterRelationshipToProtagonist = (event: string, character: SuggestedCharacterInterface) => {
        setAdditionalCharacterSuggestions(prevSuggestions => 
            prevSuggestions.map(item => {                
                if (item.name === character.name) return { ...item, relationshipToProtagonist: event };
                return item;
            })
        );       
    }


    return (
        <Sheet open={openCharacterSuggestionsModal} onOpenChange={setOpenCharacterSuggestionsModal}>
            <SheetContent className='xs:min-w-[95%] sm:min-w-[80%] md:min-w-[70%] lg:min-w-[50%]'>
                <SheetHeader>
                    <SheetTitle className=''>Character(s) Suggestions</SheetTitle>
                    <SheetDescription>
                        Would like to add any other of these characters to your protagonists journey?
                    </SheetDescription>
                </SheetHeader>

                <div className='flex justify-center'>
                    {
                        additionalCharacterSuggestions &&
                        <Carousel className="w-full max-w-sm">
                            <CarouselContent>
                                {
                                additionalCharacterSuggestions.map((character, index) => (
                                    <CarouselItem key={index}>
                                        <div className='mb-5 cursor-pointer border border-gray-800 py-4 px-4 rounded-xl transition-all text-gray-800 bg-gray-900'>
                                            <div className='mb-3'>
                                                <p className='text-xs mb-1 text-gray-50'>Name</p>
                                                <input type="text" onChange={(e) => updateCharacterName(e.target.value, character) } value={character?.name} className='py-2 px-4 outline-none border border-gray-800 text-xs rounded-lg w-full' />
                                            </div>
                                            <div className="w-full">
                                                <p className='text-xs mb-1 text-gray-50'>Role</p>
                                                <textarea rows={3} onChange={(e) => updateCharacterRole(e.target.value, character) } value={character?.role} className='py-2 px-4 mb-4 outline-none border border-gray-800 text-xs rounded-lg w-full' />
                                                {/* <input type="text" onChange={(e) => updateCharacterRole(e.target.value, character) } value={character?.role} className='py-2 px-4 mb-4 outline-none border border-gray-800 text-xs rounded-lg w-full' /> */}

                                                <p className="text-xs mb-1 text-gray-50">Relationship to Protagonist</p>
                                                <textarea rows={3} onChange={(e) => updateCharacterRelationshipToProtagonist(e.target.value, character)} value={character?.relationshipToProtagonist} className='py-2 px-4 outline-none border border-gray-800 text-xs rounded-lg w-full' />
                                            </div>

                                            <Button disabled={character?.disabled === true} onClick={() => submitCharacterUpdate(character)} className='mt-3 w-full bg-gray-50 text-gray-700' size="sm">Save</Button>

                                        </div>
                                    </CarouselItem>
                                ))
                                }
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    }
                </div>

            </SheetContent>
        </Sheet>
    )
}

export default CharacterSuggestionsModal
