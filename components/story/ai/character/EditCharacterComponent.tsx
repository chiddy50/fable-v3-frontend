"use client"

import React, { useState, useEffect, useMemo } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { StoryInterface } from '@/interfaces/StoryInterface';
import Image from 'next/image';
import { ChevronDown, Save, Users } from 'lucide-react';
import { SynopsisCharacterInterface, SynopsisInterface } from '@/interfaces/SynopsisInterface';
import GradientButton from '@/components/shared/GradientButton';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import CharacterRelationshipsUI from './CharacterRelationshipsUI';
 

interface Props {
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;  
    story: StoryInterface;
    currentCharacter: any;
    setCharacters: React.Dispatch<React.SetStateAction<SynopsisCharacterInterface[]>>;
    activeSynopsis: SynopsisInterface;
    setStory: React.Dispatch<React.SetStateAction<StoryInterface>>;
}

const EditCharacterComponent: React.FC<Props> = ({
    openModal,
    setOpenModal,
    story,
    currentCharacter,
    setCharacters,
    activeSynopsis,
    setStory
}) => {

    const currentCharacterData = useMemo(() => {
        return activeSynopsis?.characters?.find?.(item => item?.name === currentCharacter?.name) 
    }, [currentCharacter]);

    const [name, setName] = useState<string>("");
    const [alias, setAlias] = useState<string>("");
    const [age, setAge] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [backstory, setBackstory] = useState<string>("");
    const [race, setRace] = useState<string>("");
    const [strengths, setStrengths] = useState<string>("");
    const [weaknesses, setWeaknesses] = useState<string>("");
    const [externalConflict, setExternalConflict] = useState<string>("");
    const [internalConflict, setInternalConflict] = useState<string>("");
    const [voice, setVoice] = useState<string>("");
    const [perspective, setPerspective] = useState<string>("");
    const [relationshipToOtherCharacters, setRelationshipToOtherCharacters] = useState<{}[]>([]);
    const [relationshipToProtagonists, setRelationshipToProtagonists] = useState<string>("");
    
    const [allAvailableCharacters, setAllAvailableCharacters] = useState<{}[]>([]);

    useEffect(() => {
        setName(currentCharacterData?.name ?? "")
        setAlias(currentCharacterData?.alias ?? "")
        setAge(currentCharacterData?.age ?? "")
        setRole(currentCharacterData?.role ?? "")
        setGender(currentCharacterData?.gender ?? "")
        setBackstory(currentCharacterData?.backstory ?? "")
        setRace(currentCharacterData?.race ?? "")
        setStrengths(currentCharacterData?.strengths ?? "")
        setWeaknesses(currentCharacterData?.weaknesses ?? "")
        setExternalConflict(currentCharacterData?.externalConflict ?? "")
        setInternalConflict(currentCharacterData?.internalConflict ?? "")
        setVoice(currentCharacterData?.voice ?? "")
        setPerspective(currentCharacterData?.perspective ?? "")
        setRelationshipToOtherCharacters(currentCharacter?.relationshipToOtherCharacters ?? [])
        setRelationshipToProtagonists(currentCharacter?.relationshipToProtagonists ?? "")

        console.log({
            rel: currentCharacter?.relationshipToOtherCharacters
        });
        

        let availableCharacters = activeSynopsis?.characters?.filter(item => item?.id !== currentCharacterData?.id) 
        setAllAvailableCharacters(availableCharacters);
    }, [currentCharacter]);

    const updateCharacter = async () => {
        if (!activeSynopsis.id) {
            return;
        }

        let payload = {
            characterId: currentCharacterData?.id,
            relationshipToOtherCharacters: currentCharacterData?.relationshipToOtherCharacters,
            relationshipToProtagonists: currentCharacterData?.relationshipToProtagonists,
            name,
            alias,
            age,
            role,
            gender,
            backstory,
            race,
            strengths,
            weaknesses,
            internalConflict,
            externalConflict,
            voice,
            perspective,
            synopsisId: activeSynopsis.id,
            storyId: story.id
        }

        try {            
            showPageLoader();
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/synopses/${currentCharacterData?.id}/update-character`;
            let res = await axiosInterceptorInstance.put(url, payload);
            console.log(res);
            
            setStory(res?.data?.story);
        } catch (error) {
            console.error(error);            
        } finally {
            hidePageLoader();
        }
        
    }    
    
    return (
        <Sheet open={openModal} onOpenChange={setOpenModal}>

            <SheetContent className="overflow-y-scroll rounded-l-3xl xs:min-w-[90%] sm:min-w-[96%] md:min-w-[65%] lg:min-w-[65%] xl:min-w-[40%]">

                <SheetHeader>
                    <SheetTitle className="font-bold text-md">
                        {/* Character */}
                    </SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>


                <div className="px-7 pb-7">
                    {/* <h1 className="font-bold text-md">Character</h1> */}
                    <div className="w-[100px] h-[100px] relative rounded-2xl overflow-hidden">
                        <Image
                            src="/img/character-placeholder.png"
                            alt="placeholder"
                            fill
                            className='object-cover w-full h-full'
                        />
                    </div>

                    <div className="mt-7">
                    
                        <Accordion type="single" defaultValue='item-1' collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-md font-extrabold cursor-pointer">
                                    Basic Info 
                                    {/* (Who they are) */}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                        <div className="space-y-2">
                                            <label className="block text-xs text-gray-600 font-bold">Name</label>
                                            <div className="flex items-center p-3 rounded-lg bg-gray-100">
                                                <Image
                                                    src="/icon/user.svg"
                                                    alt="user icon"
                                                    className="mr-2"
                                                    width={15}
                                                    height={15}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Name"
                                                    className="w-full bg-transparent text-[11px] focus:outline-none text-gray-500"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value) }
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-xs text-gray-600 font-bold">Gender</label>
                                                <div className="flex items-center p-3 rounded-lg bg-gray-100">
                                                    
                                                    <input
                                                        type="text"
                                                        placeholder="Name"
                                                        className="w-full bg-transparent text-[11px] focus:outline-none text-gray-500"
                                                        value={gender}
                                                        onChange={(e) => setGender(e.target.value) }
                                                    />

                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs text-gray-600 font-bold">Age</label>
                                                <div className="flex gap-1 items-center p-3 rounded-lg bg-gray-100">
                                                    
                                                    <input
                                                        type="text"
                                                        placeholder="Age"
                                                        className="w-full bg-transparent text-[11px] focus:outline-none text-gray-500"
                                                        value={age}
                                                        onChange={(e) => setAge(e.target.value) }
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-5">
                                        <div className="space-y-2">
                                            <label className="block text-xs text-gray-600 font-bold">Alias</label>
                                            <div className="flex gap-1 items-center p-3 rounded-lg bg-gray-100">
                                                <Image
                                                    src="/icon/user.svg"
                                                    alt="user icon"
                                                    className="mr-2"
                                                    width={15}
                                                    height={15}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Alias"
                                                    className="w-full bg-transparent text-[11px] focus:outline-none text-gray-500"
                                                    value={alias}
                                                    onChange={(e) => setAlias(e.target.value) }
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs text-gray-600 font-bold">Race</label>
                                            <div className="flex items-center p-3 rounded-lg bg-gray-100">
                                                <input
                                                    type="text"
                                                    placeholder="Alias"
                                                    className="w-full bg-transparent text-[11px] focus:outline-none text-gray-500"
                                                    value={race}
                                                    onChange={(e) => setRace(e.target.value) }
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs text-gray-600 font-bold">Role</label>
                                            <div className="flex gap-1 items-center p-3 rounded-lg bg-gray-100">
                                                
                                                <input
                                                    type="text"
                                                    placeholder="Role"
                                                    className="w-full bg-transparent text-[11px] focus:outline-none text-gray-500"
                                                    value={role}
                                                    onChange={(e) => setRole(e.target.value) }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-md font-extrabold cursor-pointer">
                                    Character Development 
                                    {/* (What drives them) */}
                                </AccordionTrigger>
                                <AccordionContent>                                
                                    <div className="space-y-2 mb-5">
                                        <label className="block text-xs text-gray-600 font-bold">Backstory</label>
                                        <div className="mt-2 p-1 bg-gray-100 rounded-lg">
                                            <textarea
                                                // ref={textareaRef}
                                                value={backstory || ''}
                                                onChange={(e) => setBackstory(e.target.value)}
                                                placeholder=""
                                                className="flex-1 outline-none resize-none text-[11px] p-3 text-gray-500 w-full placeholder:italic placeholder-gray-400 min-h-[100px]"
                                            />
                                        </div>
                                    </div>
            
                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                        <div className="space-y-2">
                                            <label className="block text-xs text-gray-600 font-bold">Strengths</label>
                                            <div className="mt-2 p-1 bg-gray-100 rounded-lg">
                                                <textarea
                                                    value={strengths || ''}
                                                    onChange={(e) => setStrengths(e.target.value)}
                                                    placeholder=""
                                                    className="flex-1 outline-none resize-none text-[11px] p-3 text-gray-500 w-full placeholder:italic placeholder-gray-400 min-h-[80px]"
                                                />
                                            </div>
                                        </div>
            
                                        <div className="space-y-2">
                                            <label className="block text-xs text-gray-600 font-bold">Weaknesses</label>
                                            <div className="mt-2 p-1 bg-gray-100 rounded-lg">
                                                <textarea
                                                    value={weaknesses || ''}
                                                    onChange={(e) => setWeaknesses(e.target.value)}
                                                    placeholder=""
                                                    className="flex-1 outline-none resize-none text-[11px] p-3 text-gray-500 w-full placeholder:italic placeholder-gray-400 min-h-[80px]"
                                                />
                                            </div>
                                        </div>
                                    </div>
            
                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                        <div className="space-y-2">
                                            <label className="block text-xs text-gray-600 font-bold">External Conflict</label>
                                            <div className="mt-2 p-1 bg-gray-100 rounded-lg">
                                                <textarea
                                                    value={externalConflict || ''}
                                                    onChange={(e) => setExternalConflict(e.target.value)}
                                                    placeholder=""
                                                    className="flex-1 outline-none resize-none text-[11px] p-3 text-gray-500 w-full placeholder:italic placeholder-gray-400 min-h-[80px]"
                                                />
                                            </div>
                                        </div>
            
                                        <div className="space-y-2">
                                            <label className="block text-xs text-gray-600 font-bold">Internal Conflicts</label>
                                            <div className="mt-2 p-1 bg-gray-100 rounded-lg">
                                                <textarea
                                                    value={internalConflict || ''}
                                                    onChange={(e) => setInternalConflict(e.target.value)}
                                                    placeholder=""
                                                    className="flex-1 outline-none resize-none text-[11px] p-3 text-gray-500 w-full placeholder:italic placeholder-gray-400 min-h-[80px]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-md font-extrabold cursor-pointer">Voice & Perspective 
                                    {/* (How they express themselves) */}
                                </AccordionTrigger>
                                <AccordionContent>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                        <div className="space-y-2">
                                            <label className="block text-xs text-gray-600 font-bold">Voice</label>
                                            <div className="mt-2 p-1 bg-gray-100 rounded-lg">
                                                <textarea
                                                    value={voice || ''}
                                                    onChange={(e) => setVoice(e.target.value)}
                                                    placeholder=""
                                                    className="flex-1 outline-none resize-none text-[11px] p-3 text-gray-500 w-full placeholder:italic placeholder-gray-400 min-h-[80px]"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs text-gray-600 font-bold">Perspective</label>
                                            <div className="mt-2 p-1 bg-gray-100 rounded-lg">
                                                <textarea
                                                    value={perspective || ''}
                                                    onChange={(e) => setPerspective(e.target.value)}
                                                    placeholder=""
                                                    className="flex-1 outline-none resize-none text-[11px] p-3 text-gray-500 w-full placeholder:italic placeholder-gray-400 min-h-[80px]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-md font-extrabold cursor-pointer">Relationships 
                                    {/* (How they connect) */}
                                </AccordionTrigger>
                                <AccordionContent>

                                    <CharacterRelationshipsUI 
                                    currentCharacter={currentCharacter}
                                    relationshipToOtherCharacters={relationshipToOtherCharacters} 
                                    setRelationshipToOtherCharacters={setRelationshipToOtherCharacters}
                                    allAvailableCharacters={allAvailableCharacters}
                                    setCharacters={setCharacters}
                                    story={story}
                                    setStory={setStory}
                                    activeSynopsis={activeSynopsis}
                                    />

                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>



                        <GradientButton
                        handleClick={() => updateCharacter()} className="flex items-center mt-7 cursor-pointer bg-[#F5F5F5] px-4 py-3 gap-2 rounded-xl hover:bg-gray-200 transition-colors">
                            <span className="text-xs">Update Character</span>
                            <Save size={16}/>
                        </GradientButton>

                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default EditCharacterComponent
