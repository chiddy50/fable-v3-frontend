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
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface CharacterSuggestionsModalProps {
    initialStory: StoryInterface;
    openCharacterSuggestionsModal: boolean;
    setOpenCharacterSuggestionsModal: React.Dispatch<React.SetStateAction<boolean>>;   
    setAdditionalCharacterSuggestions: React.Dispatch<React.SetStateAction<SuggestedCharacterInterface[]>>;   
    additionalCharacterSuggestions: SuggestedCharacterInterface[];   
    refetch:() => void;
}

const CharacterSuggestionsModal: React.FC<CharacterSuggestionsModalProps> = ({
    initialStory,
    openCharacterSuggestionsModal,
    setOpenCharacterSuggestionsModal,
    setAdditionalCharacterSuggestions,
    additionalCharacterSuggestions,
    refetch,
}) => {

    const submitCharacterUpdate = async (character: SuggestedCharacterInterface) => {
        if (character?.disabled) return;    
        
        const existsAlready = initialStory.characters.find(existingCharacter => existingCharacter.name === character.name)
        if (existsAlready) {
            toast.error(`${character.name} has already been added as character`)
            return;
        }

        let characterAdded = await createCharacter(character, initialStory?.id);        
        if (characterAdded) {  
            refetch();          
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

    const updateCharacterBackstory = (event: string, character: SuggestedCharacterInterface) => {
        setAdditionalCharacterSuggestions(prevSuggestions => 
            prevSuggestions.map(item => {                
                if (item.name === character.name) return { ...item, backstory: event };
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
            <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
                <SheetHeader>
                    <SheetTitle className=''>Character(s) Suggestions</SheetTitle>
                    <SheetDescription>
                        Would like to add any other of these characters to your protagonists journey?
                    </SheetDescription>
                </SheetHeader>

                {
                    <div className="mt-7">

                    {
                        initialStory?.suggestedCharacters?.map((character, index) => (
                            <div key={index} className='mb-4 bg-gray-50 p-5 rounded-2xl'>
                                <div className='flex items-center gap-5 '>
                                    <div className='with-linear-gradient rounded-full'>
                                        <Image
                                            src={'/user-image.jpeg'}
                                            alt={`${character?.name}`}
                                            width={100}
                                            height={100}
                                            loading="lazy"
                                            className='w-[70px] h-[70px] rounded-full xl:order-last'
                                        />
                                    </div>
                                    <div className='flex-[80%]'>

                                        <h2 className="text-xs mb-1 font-semibold">Name</h2>
                                        <input type="text" 
                                        className='py-3 mb-3 rounded-xl w-full outline-none text-xs border px-4' 
                                        value={character?.name} 
                                        onChange={(e) => updateCharacterName(e.target.value, character)} />

                                        <h2 className="text-xs mb-1 font-semibold">Role</h2>
                                        <input type="text" 
                                        className='py-3 rounded-xl w-full outline-none text-xs border px-4' 
                                        value={character?.role} 
                                        onChange={() => console.log()} />
                                    </div>
                                </div>

                                <div className='mt-5'>
                                    <div className='mb-4'>
                                        <h2 className="text-xs mb-1 font-semibold">Backstory</h2>
                                        <textarea rows={3} onChange={(e) => updateCharacterBackstory(e.target.value, character) } value={character?.backstory} className='py-2 px-4 outline-none border text-xs font-light rounded-lg w-full' />
                                    </div>
                                    <div>
                                        <h2 className="text-xs mb-1 font-semibold">Relationship to protagonist</h2>
                                        <textarea rows={3} onChange={(e) => updateCharacterRelationshipToProtagonist(e.target.value, character)} value={character?.relationshipToProtagonist} className='py-2 px-4 outline-none border text-xs font-light rounded-lg w-full' />
                                    </div>
                                </div>

                                <Button disabled={character?.disabled ? true: false} onClick={() => submitCharacterUpdate(character)} className='mt-4'>Save</Button>
                            </div>
                        ))
                    }
                    </div>
                }           

            </SheetContent>
        </Sheet>
    )
}

export default CharacterSuggestionsModal
