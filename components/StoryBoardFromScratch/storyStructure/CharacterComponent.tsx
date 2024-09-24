"use client";

import { Button } from '@/components/ui/button';
import { CharacterInterface } from '@/interfaces/CharacterInterface';
import { Edit } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface CharacterComponentProps {
    character: CharacterInterface,
    clickEvent:() => void;
    hideBtn: boolean;
}


const CharacterComponent: React.FC<CharacterComponentProps> = ({
    character,
    clickEvent,
    hideBtn = false
}) => {
    return (
        <div className='flex items-center gap-5 rounded-xl p-3 bg-custom_light_green  transition-all'>
                <div className='rounded-2xl'>
                    { character?.imageUrl &&
                        <Image src={character?.imageUrl} 
                        className='rounded-2xl' loading="lazy" 
                        height={50} width={50}
                            alt="Logo"/>
                    }
                    { !character?.imageUrl &&
                        <Image src="/user-image.jpeg" 
                        className='rounded-2xl' height={50} width={50} alt="Logo"/>
                    }
                </div>
                <div>
                    <p className='text-sm text-gray-600 mb-2 font-semibold'>{character?.name}</p>
                    { !hideBtn && 
                        <Button onClick={() => clickEvent(character)} variant="outline" size="sm">
                            Reply
                            <Edit className='ml-2 w-4 h-4'/>                                                        
                        </Button>
                    }
                </div>
            </div>  
    ) 
}

export default CharacterComponent
