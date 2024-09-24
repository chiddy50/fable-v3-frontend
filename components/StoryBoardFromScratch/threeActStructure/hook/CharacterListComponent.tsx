"use client";

import { Check } from 'lucide-react';
import React from 'react';


interface CharacterListComponentProps {
    list: string[];
    label: string;
}

const CharacterListComponent: React.FC<CharacterListComponentProps> = ({
    list,
    label
}) => {
  return (
    <div className="mt-3">
        <p className="text-xs text-gray-400 mb-1 font-bold">{label}</p>
        <ul className="text-xs">
        {
            list?.map((listItem: string, listItemIndex: number) => (
            <li className='flex items-start mb-1 gap-1' key={listItemIndex}>
                <div className='flex items-start'>
                    <Check className='w-4 h-4 text-green-600' /> 
                </div>
                <span>{listItem}</span>
            </li>
            ))
        }
        </ul>
    </div>
  )
}

export default CharacterListComponent
