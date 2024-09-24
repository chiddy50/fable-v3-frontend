"use client";

import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import Image from 'next/image';
import { StoryInterface } from '@/interfaces/StoryInterface';

interface ViewAllCharactersComponentProps {
    openViewCharactersModal: boolean;
    setOpenViewCharactersModal: React.Dispatch<React.SetStateAction<boolean>>;   
    initialStory: StoryInterface;
}

const ViewAllCharactersComponent: React.FC<ViewAllCharactersComponentProps> = ({
    openViewCharactersModal,
    setOpenViewCharactersModal,
    initialStory
}) => {

    return (
        <Sheet open={openViewCharactersModal} onOpenChange={setOpenViewCharactersModal}>
            <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
                <SheetHeader className=''>
                    <SheetTitle className='font-bold text-2xl mb-4'>Characters</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>

                <div className="mt-2">

                    {
                        initialStory?.characters?.map(character => (
                            <div key={character?.id} className='mb-4 bg-gray-50 p-5 rounded-2xl'>
                                <div key={character?.id} className='flex items-center gap-5'>
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
                                    <div>
                                        <p className='font-bold text-md'>{character?.name}</p>
                                        <p className='text-xs'>{ character?.isProtagonist ? "Protagonist" : character?.role }</p>
                                    </div>
                                </div>
                                <div className='mt-5'>
                                    <div className='mb-4'>
                                        <h2 className="text-xs mb-1 font-semibold">Backstory</h2>
                                        <p className="text-xs font-light">{character?.backstory}</p>
                                    </div>
                                    <div>
                                        <h2 className="text-xs mb-1 font-semibold">Relationship to protagonist</h2>
                                        <p className="text-xs font-light">{character?.relationshipToProtagonist}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }


                </div>
            </SheetContent>
        </Sheet>
    )
}

export default ViewAllCharactersComponent
