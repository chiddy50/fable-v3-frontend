"use client";

import React, { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
import Image from 'next/image';
import { CheckCircle2, Cog } from 'lucide-react';
import { CharacterInterface } from '@/interfaces/CharacterInterface';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { facialHairSuggestions, hairLengths, hairQuirks, hairTextures, intelligenceOptions, skinTones } from '@/lib/data';
import { Button } from '../ui/button';
import { ReusableCombobox } from '../ReusableCombobox';
import { SuspenseTechniqueInterface } from '@/interfaces/SuspenseTechniqueInterface';

interface EditProtagonistComponentProps {
    selectedCharacter: CharacterInterface;
    modalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;    
}

const EditProtagonistComponent: React.FC<EditProtagonistComponentProps> = ({
    setModalOpen,
    modalOpen,
    selectedCharacter

}) => {
    const [age, setAge] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [intelligence, setIntelligence] = useState<SuspenseTechniqueInterface>(null);
    
    return (
        <Sheet open={modalOpen} onOpenChange={setModalOpen}>
            <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll sm:min-w-70%] md:min-w-[96%] lg:min-w-[65%] xl:min-w-[55%]">
                <SheetHeader  className=''>
                    <div className='flex items-center gap-5 mb-7'>

                        <div className='with-linear-gradient rounded-full'>
                            <Image
                                src={selectedCharacter?.imageUrl ?? '/user-image.jpeg'}
                                alt={selectedCharacter?.name || 'character image'}
                                width={180}
                                height={180}
                                loading="lazy"
                                className='w-full  rounded-full xl:order-last'
                            />
                        </div>
                        <div>
                            <SheetTitle className='font-bold text-xl'>{selectedCharacter?.name}</SheetTitle>
                            <p className='text-md'>{selectedCharacter?.role}</p>
                        </div>
                    </div>
                    <SheetDescription> </SheetDescription>
                    {/* 
                    <div className='mt-3 bg-white p-5 rounded-2xl'>
                        <span className='text-gray-900 text-md font-bold'>Role</span>
                        <p className='text-xs'>{selectedCharacter?.role}</p>
                    </div> */}

                    <div className="bg-gray-50 p-5 rounded-2xl">
                        <Accordion type="single" className='' collapsible>
                            <AccordionItem value="item-1 " className='mb-3 border-none'>
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>Physical</AccordionTrigger>
                                
                                <AccordionContent>
                                    <div className="grid grid-cols-2 gap-5 mt-3">

                                        {/* AGE */}
                                        <div className='flex flex-col gap-1'>
                                            <span className='text-gray-900 text-md font-bold'>Age</span>
                                            {/* <span className='text-xs block'>{selectedCharacter?.age}</span> */}
                                            <input type="text" onChange={(e) => setAge(e.target.value)} 
                                            value={selectedCharacter?.age} className='p-3 rounded-lg text-xs border outline-none' />
                                        </div>

                                        {/* GENDER */}
                                        <div className='flex flex-col gap-1'>
                                            <span className='text-gray-900 text-md font-bold'>Gender</span>
                                            <input type="text" onChange={(e) => setGender(e.target.value)}
                                            value={selectedCharacter?.gender} className='p-3 rounded-lg text-xs border outline-none' />
                                        </div>

                                        {/* SKIN TONE */}
                                        <div className='flex flex-col gap-1'>
                                            <span className='text-gray-900 text-md font-bold'>Skin Tone</span>
                                            <Select>
                                                <SelectTrigger className="w-full outline-none text-xs">
                                                    <SelectValue placeholder="Choose skin tone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Skin Tone</SelectLabel>
                                                        {
                                                            skinTones.map((skinTone: string, index: number) => (
                                                                <SelectItem key={index} value={skinTone}>{skinTone}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* HAIR TEXTURE */}
                                        <div className='flex flex-col gap-1'>
                                            <span className='text-gray-900 text-md font-bold'>Hair Texture</span>
                                            <Select>
                                                <SelectTrigger className="w-full outline-none text-xs">
                                                    <SelectValue placeholder="Choose hair texture" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Hair Texture</SelectLabel>
                                                        {
                                                            hairTextures.map((hairTexture: string, index: number) => (
                                                                <SelectItem key={index} value={hairTexture}>{hairTexture}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {/* HAIR LENGTH */}
                                        <div className='flex flex-col gap-1'>
                                            <span className='text-gray-900 text-md font-bold'>Hair Length</span>
                                            <Select>
                                                <SelectTrigger className="w-full outline-none text-xs">
                                                    <SelectValue placeholder="Choose hair length" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Hair Length</SelectLabel>
                                                        {
                                                            hairLengths.map((hairLength: string, index: number) => (
                                                                <SelectItem key={index} value={hairLength}>{hairLength}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* HAIR QUICK */}
                                        <div className='flex flex-col gap-1'>
                                            <span className='text-gray-900 text-md font-bold'>Hair Quirk</span>
                                            <Select>
                                                <SelectTrigger className="w-full outline-none text-xs">
                                                    <SelectValue placeholder="Choose hair quirk" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Hair Quirk</SelectLabel>
                                                        {
                                                            hairQuirks.map((hairQuirk: string, index: number) => (
                                                                <SelectItem key={index} value={hairQuirk}>{hairQuirk}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* HAIR QUICK */}
                                        <div className='flex flex-col gap-1 col-span-2'>
                                            <span className='text-gray-900 text-md font-bold'>Facial Hair</span>
                                            <Select>
                                                <SelectTrigger className="w-full outline-none text-xs">
                                                    <SelectValue placeholder="Choose facial hair" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Facial Hair</SelectLabel>
                                                        {
                                                            facialHairSuggestions.map((suggestion: string, index: number) => (
                                                                <SelectItem key={index} value={suggestion}>{suggestion}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        
                                    </div>

                                    <Button className='w-full mt-4'>
                                        Generate Image
                                        <Cog className='w-4 h-4 ml-2' />
                                    </Button>

                                    <div className="mt-3 p-3 rounded-2xl bg-red-100 border-red-500 border">
                                        <span className="text-xs text-red-600">
                                            Note: One generation per character. Any further generation will occur extra charges. 
                                        </span>
                                    </div>
                                    
                                </AccordionContent>                        
                            </AccordionItem>


                            <AccordionItem value="item-2" className='mb-3 border-none'>
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>Background</AccordionTrigger>
                                
                                <AccordionContent>
                                    {/* BACKSTORY */}
                                    <div className='mt-3 bg-white p-5 border border-custom_light_green rounded-2xl'>
                                        <div className='text-gray-900 text-md mb-2 font-bold'>Backstory</div>
                                        <span className='text-xs block text-gray-500'>{selectedCharacter?.backstory}</span>
                                    </div>

                                    {/* CONFLICT & ANGST */}
                                    <div className='mt-3 bg-white p-5 border border-custom_light_green rounded-2xl'>
                                        <span className='text-gray-900 text-md font-bold'>Conflict & Angst</span>
                                        <span className='text-xs block text-gray-500 capitalize'>{selectedCharacter?.angst}</span>
                                    </div>

                                    {/* Relationships */}
                                    {/* <span className='mt-3 block'>
                                        <span className='text-gray-900 text-md font-bold'>Relationships</span>
                                        <span className='text-xs block text-gray-500 capitalize'>{selectedCharacter?.relationships?.join(', ')}</span>
                                    </span> */}
                                </AccordionContent>                        
                            </AccordionItem>

                            <AccordionItem value="item-3" className='mb-3 border-none'>
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>Personality</AccordionTrigger>
                                
                                <AccordionContent>
                                    {/* PERSONALITY TRAITS */}
                                    <div className='mt-3 bg-white p-5 border border-custom_light_green rounded-2xl'>
                                        <span className='text-gray-900 text-md font-bold'>Personality Traits</span>
                                        <ul className='mt-2'>
                                            {
                                                selectedCharacter?.personalityTraits?.map((trait: string, index: number) => (
                                                <li className='text-xs flex items-center gap-2 text-gray-500 mb-3 capitalize' key={index}> 
                                                    <div>
                                                    <CheckCircle2 className='text-custom_green'/>
                                                    </div>
                                                    <span>{trait}</span>
                                                </li>
                                                ))
                                            }
                                        </ul>
                                    </div>

                                    {/* MOTIVATIONS */}
                                    <div className='mt-3 bg-white p-5 border border-custom_light_green rounded-2xl'>
                                        <span className='text-gray-900 text-md font-bold'>Motivations</span>
                                        <ul className='mt-2'>
                                        {
                                            selectedCharacter?.motivations?.map((motivation: string, index: number) => (
                                            <li className='text-xs flex items-center gap-2 text-gray-500 mb-3 capitalize' key={index}> 
                                                <div>
                                                <CheckCircle2 className='text-custom_green'/>
                                                </div>
                                                <span>{motivation}</span>
                                            </li>
                                            ))
                                        }
                                        </ul>
                                    </div>

                                    {/* CORE VALUES */}
                                    <div className='mt-3 bg-white p-5 rounded-2xl border border-custom_light_green'>
                                        <span className='text-gray-900 text-md font-bold'>Core Values</span>
                                        <span className='text-xs block text-gray-500 capitalize'>{selectedCharacter?.coreValues?.join(', ')}</span>
                                    </div>


                                </AccordionContent>                        
                            </AccordionItem>


                            <AccordionItem value="item-4 " className='border-none'>
                                <AccordionTrigger className='text-sm bg-custom_green px-4 rounded-2xl text-gray-100'>Abilities</AccordionTrigger>
                                
                                <AccordionContent>
                                    {/* INTELLIGENCE */}
                                    <div className='mt-5 flex flex-col gap-1'>
                                        <span className='text-gray-900 text-md font-bold'>Intelligence</span>
                                        <Select>
                                            <SelectTrigger className="w-full outline-none text-xs">
                                                <SelectValue placeholder="Choose Intelligence" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Intelligence</SelectLabel>
                                                    {
                                                        intelligenceOptions?.map((option: string, index: number) => (
                                                            <SelectItem key={index} value={option}>{option}</SelectItem>
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>                                    

                                    {/* Weaknesses */}
                                    <div className='mt-3 bg-white p-5 rounded-2xl border border-custom_light_green'>
                                        <span className='text-gray-900 text-md font-bold'>Weaknesses</span>
                                        <ul className='mt-2'>
                                        {
                                            selectedCharacter?.weaknesses?.map((weakness: string, index: number) => (
                                            <li className='text-xs flex items-center gap-2 text-gray-500 mb-3 capitalize' key={index}> 
                                                <div>
                                                <CheckCircle2 className='text-custom_green'/>
                                                </div>
                                                <span>{weakness}</span>
                                            </li>
                                            ))
                                        }
                                        </ul>
                                    </div>

                                    {/* Strengths */}
                                    <div className='mt-3 bg-white p-5 rounded-2xl border border-custom_light_green'>
                                        <span className='text-gray-900 text-md font-bold'>Strengths</span>
                                        <ul className='mt-2'>
                                        {
                                            selectedCharacter?.strengths?.map((strength: string, index: number) => (
                                            <li className='text-xs flex items-center gap-2 text-gray-500 mb-3 capitalize' key={index}> 
                                                <div>
                                                <CheckCircle2 className='text-custom_green'/>
                                                </div>
                                                <span>{strength}</span>
                                            </li>
                                            ))
                                        }
                                        </ul>
                                    </div>

                                    {/* Skills */}
                                    <div className='mt-3 bg-white p-5 rounded-2xl border border-custom_light_green'>
                                        <span className='text-gray-900 text-md font-bold'>Skills</span>
                                        <ul className='mt-2'>
                                        {
                                            selectedCharacter?.skills?.map((skill: string, index: number) => (
                                            <li className='text-xs flex items-center gap-2 text-gray-500 mb-3 capitalize' key={index}> 
                                                <div>
                                                <CheckCircle2 className='text-custom_green'/>
                                                </div>
                                                <span>{skill}</span>
                                            </li>
                                            ))
                                        }
                                        </ul>
                                    </div>

                                </AccordionContent>                        
                            </AccordionItem>
                        </Accordion>
                    </div>

                </SheetHeader>
            </SheetContent>
      </Sheet>
    )
}

export default EditProtagonistComponent
