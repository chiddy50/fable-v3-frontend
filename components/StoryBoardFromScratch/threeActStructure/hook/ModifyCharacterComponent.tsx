"use client";

import { StoryInterface } from '@/interfaces/StoryInterface';
import React, { useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Check, MinusCircleIcon } from 'lucide-react';
import CharacterListComponent from './CharacterListComponent';
import { CharacterInterface } from '@/interfaces/CharacterInterface';
import { Input } from '@/components/ui/input';

interface ModifyCharacterComponentProps {
  openModifyCharacterModal: boolean; 
  setOpenModifyCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  saveStory: (val: any) => null|object;
  initialStoryData: StoryInterface;
  selectedCharacter: CharacterInterface|null;
}

const ModifyCharacterComponent: React.FC<ModifyCharacterComponentProps> = ({
    openModifyCharacterModal,
    setOpenModifyCharacterModal,
    initialStoryData,
    saveStory,
    selectedCharacter
}) => {

  useEffect(() => {
    getCharacterSuggestions();
  }, []);

  const getCharacterSuggestions = () => {
    console.log({selectedCharacter});
  }

  return (
    <Sheet open={openModifyCharacterModal} onOpenChange={setOpenModifyCharacterModal}>
      <SheetContent side="bottom" className="overflow-y-scroll min-w-[96%] md:min-w-[96%] lg:min-w-[60%]">
        <SheetHeader className=''>
          <SheetTitle className='font-bold text-2xl mb-5'>Edit Character</SheetTitle>
          <SheetDescription className=''></SheetDescription>
          
          <div className='mb-4'>
            <p className='text-xs text-gray-600 mb-1'>Character Name</p>
            <Input value={selectedCharacter?.name} className='text-xs'/>
          </div>

          <div className='mb-4'>
            <p className='text-xs text-gray-600 mb-1'>Role</p>
            <Input value={selectedCharacter?.role} className='text-xs'/>
          </div>
          
          {/* <div className='flex justify-center'>
            <Card>
              <CardContent className="p-6">

              </CardContent>
            </Card>
          </div> */}

        </SheetHeader>  
      </SheetContent>
    </Sheet>   
  )
}

export default ModifyCharacterComponent
