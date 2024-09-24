"use client";

import { StoryInterface } from '@/interfaces/StoryInterface';
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Check, MinusCircleIcon } from 'lucide-react';
import CharacterListComponent from './CharacterListComponent';

interface ViewCharactersComponentProps {
    openViewCharactersModal: boolean; 
    setOpenViewCharactersModal: React.Dispatch<React.SetStateAction<boolean>>;
    saveStory: (val: any) => null|object;
    initialStoryData: StoryInterface;
    // openEditCharacterModal: () => null;
}

const ViewCharactersComponent: React.FC<ViewCharactersComponentProps> = ({
    openViewCharactersModal,
    setOpenViewCharactersModal,
    initialStoryData,
    saveStory,
    openEditCharacterModal
}) => {
  return (
    <Sheet open={openViewCharactersModal} onOpenChange={setOpenViewCharactersModal}>
      <SheetContent side="bottom" className="overflow-y-scroll min-w-[96%] md:min-w-[96%] lg:min-w-[60%]">
        <SheetHeader className=''>
          <SheetTitle className='font-bold text-2xl'>Plot Characters</SheetTitle>
          <SheetDescription className=''>Let's modify the characters</SheetDescription>
          
          <div className='flex justify-center'>

            <Carousel className="w-full max-w-[90%]">
              <CarouselContent>
                {initialStoryData?.suggestedCharacters?.map((character, index) => (
                <CarouselItem key={index} className="md:basis-full lg:basis-1/2">
                  <div className="">
                    <Card>
                      <CardContent className="p-6">
                        <h1 className="text-lg font-bold mb-1 text-gray-600">{character?.name}</h1>
                        <div className="mt-3">
                          <p className="text-xs text-gray-400 font-bold">Role</p>
                          <p className="text-xs text-gray-900">{character?.role}</p>
                        </div>

                        <CharacterListComponent label="Backstory" list={character?.backstory}/>
                        <CharacterListComponent label="Motivations" list={character?.motivations}/>
                        <div className="grid grid-cols-2 gap-5">
                          <CharacterListComponent label="Personality Traits" list={character?.personalityTraits}/>
                          <CharacterListComponent label="Core Values" list={character?.coreValues || character?.values}/>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                          <CharacterListComponent label="Strengths" list={character?.strengths}/>
                          <CharacterListComponent label="Weaknesses" list={character?.weaknesses}/>
                        </div>
                  
                        <Button onClick={() => openEditCharacterModal(character)} size="sm" className='mt-4'>Edit</Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

          </div>

        </SheetHeader>  
      </SheetContent>
    </Sheet>   
  )
}

export default ViewCharactersComponent

