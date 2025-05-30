"use client"

import { StoryInterface, TargetAudienceInterface } from '@/interfaces/StoryInterface';
import { ArrowDownCircle, CheckCircle, ChevronDownCircle, RefreshCcw, Save } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import StoryDetailsComponent from './StoryDetailsComponent';
import { GenreInterface } from '@/interfaces/GenreInterface';
import GradientButton from '@/components/shared/GradientButton';
import { updateStory } from '@/lib/requests';
import { Button } from '@/components/ui/button';
import EditCharacterComponent from './character/EditCharacterComponent';
import { SynopsisCharacterInterface, SynopsisInterface } from '@/interfaces/SynopsisInterface';
import CharacterRoleSelector from './character/CharacterRoleSelector';
import ModalBoxComponent from '@/components/shared/ModalBoxComponent';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import GeneratedCharacterList from './character/GeneratedCharacterList';
import EditableCharacterManager from './character/EditableCharacterManager';
import { generateCharacterIntegrationPrompt } from '@/data/prompts/generateCharacterIntegrationPrompt';
import axios from 'axios';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { hidePageLoader, showPageLoader } from '@/lib/helper';

interface Props {
    story: StoryInterface;
    setStory: React.Dispatch<React.SetStateAction<StoryInterface>>;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;  
    currentStep: number;
    targetAudiences: TargetAudienceInterface[]|[];
    genres: GenreInterface[]|[];
    setCurrentStepUrl: React.Dispatch<React.SetStateAction<string>>;
    refetch: () => void;
}

const CharactersComponent: React.FC<Props> = ({
    setCurrentStep,
    currentStep,
    story,
    setStory,
    targetAudiences,
    genres,
    setCurrentStepUrl,
    refetch
}) => {

    const [content, setContent] = useState<string>('');
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [currentCharacter, setCurrentCharacter] = useState<SynopsisCharacterInterface|null>(null);
    const [activeSynopsis, setActiveSynopsis] = useState<SynopsisInterface|null>(null);
    
    const [characterRole, setCharacterRole] = useState("");
    const [showChooseCharacterRoleModal, setShowChooseCharacterRoleModal] = useState<boolean>(false);
    
    const [openCharacterSuggestionsModal, setOpenCharacterSuggestionsModal] = useState<boolean>(false);
    const [suggestedCharacters, setSuggestedCharacters] = useState<[]>([]);

    const [characters, setCharacters] = useState<SynopsisCharacterInterface[]|[]>([]);

    const [shouldRegenerateSynopsis, setShouldRegenerateSynopsis] = useState<boolean>(false);
    const [reasonToRegenerateSynopsis, setReasonToRegenerateSynopsis] = useState<[]>([]);
    

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const refineSynopsis = async () => {
        let existingCharacters = characters?.filter?.(item => !item?.metaData?.added).map?.(character => extractCharacters(character) );
        let incomingCharacters = characters?.filter?.(item => item?.metaData?.added).map?.(character => extractCharacters(character) );
        
        const payload = {
            genres: activeSynopsis?.genres?.map(item => item?.storyGenre?.name),
            audiences: activeSynopsis?.storyAudiences?.map(item => item?.targetAudience?.name),
            contentType: activeSynopsis?.contentType,
            synopsis: activeSynopsis?.content,
            narrativeConcept: activeSynopsis?.narrativeConcept,
            projectDescription: activeSynopsis?.projectDescription,
            projectTitle: story?.projectTitle,
            tone: activeSynopsis?.tone,
            existingCharacters,
            incomingCharacters
        }

        
        console.log({
            // story,reasonToRegenerateSynopsis,characters, existingCharacters, activeSynopsis, 
            payload
        });
        let prompt = generateCharacterIntegrationPrompt(payload);
        console.log(prompt);
        
        try {
            // showPageLoader();
            let res = await axios.post(`/api/json-llm-response`, { prompt, type: "regenerate-synopsis" } );
            console.log(res);

            if(!res) return;
            
            await saveNewSynopsis({
                synopsis: res?.data?.synopsis,
                reasonSynopsisChanged: res?.data?.reasonSynopsisChanged,
                synopsisChanged: res?.data?.synopsisChanged,
                storyId: story.id,
                synopsisId: activeSynopsis?.id,
                incomingCharacters
            });
        } catch (error) {
            console.error(error);                
        }

    };

    const saveNewSynopsis = async (payload: any) => {
        try {
            showPageLoader();

            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/synopses/${story?.id}/create-synopsis`;
            let res = await axiosInterceptorInstance.put(url, payload);
            console.log(res);
            setStory(res?.data?.story);
            
        } catch (error) {
            console.error('Error saving ideation:', error);
            // toast.error('Failed to save ideation');
        } finally {
            hidePageLoader();
        }
    }

    const extractCharacters = (character: SynopsisCharacterInterface) => {
        return {
            id: character?.id,
            age: character?.age,
            alias: character?.alias,
            backstory: character?.backstory,
            externalConflict: character?.externalConflict,
            internalConflict: character?.internalConflict,
            name: character?.name,
            relationshipToProtagonists: character?.relationshipToProtagonists,
            relationshipToOtherCharacters: character?.relationshipToOtherCharacters,
            role: character?.role,
            strengths: character?.strengths,
            weaknesses: character?.weaknesses,
            voice: character?.voice,
            perspective: character?.perspective,
        }    
    }

    useEffect(() => {
        const synopsis: SynopsisInterface|null = story?.synopses?.find(item => item?.active === true);
        setActiveSynopsis(synopsis ? synopsis : null);

        setCharacters(synopsis?.characters ?? []);

        if (synopsis?.characters && synopsis?.characters?.length > 0) {            
            
            let reasons = [];
            synopsis?.characters?.forEach(character => {    
                if (character?.metaData?.added && character?.metaData?.added === true) {
                    reasons.push(character?.name)
                    setShouldRegenerateSynopsis(true);
                }
            });

            setReasonToRegenerateSynopsis(reasons)
        }
    }, [story])

    const returnToSynopsis = async () => {
        const response = await updateStory({ currentStepUrl: "synopsis", currentStep: 1 }, story.id);
        setStory(response?.data?.story ?? story);
        setCurrentStepUrl("synopsis");
        setCurrentStep(1);
    }
       
    const openEditCurrentCharacterModal = (character: SynopsisCharacterInterface) => {     
        console.log(character);
           
        setCurrentCharacter(character)
        setOpenEditModal(true)
    }

    return (
        <>
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-4 mb-14">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{story?.projectTitle}</h1>
                    <div className="flex items-start gap-2 text-gray-600">
                        {/* <span className="text-sm font-bold text-black">Synopsis/</span> */}
                        <span className="text-xs leading-5">{story?.synopses?.find?.(item => item?.active)?.synopsis ?? story.synopsis}</span>
                    </div>
                </div>
            </div>

            <div className="mb-7 flex items-center justify-between bg-white p-3 rounded-xl">
                <h1 className='capitalize text-xl font-bold'>Idea</h1>
                {/* <ChevronDownCircle className='text-gray-600' size={16} /> */}
                <CheckCircle size={20} className='text-green-600' />
            </div>

            <div className='bg-white p-5 rounded-xl'>
                <h1 className='capitalize text-xl font-bold mb-1'>Characters</h1>
                <p className='text-xs'>Click to edit any character to your taste. Or “add character” from your collection.</p>

                <div className="flex items-center justify-between mt-10 ">

                    <Button 
                    onClick={() => setShowChooseCharacterRoleModal(true)}
                    className='bg-[#5D4076] text-white cursor-pointer'>
                        <Image
                            src="/icon/generate2.svg"
                            alt="placeholder"
                            width={20}
                            height={20}
                        />
                        <span>Generate Character</span>
                    </Button>
                   {activeSynopsis?.synopsisCharacters?.length > 0 && 
                   <Button 
                    onClick={() => setOpenCharacterSuggestionsModal(true)}
                    >
                        View Suggestions
                    </Button>}
                </div>

                <p className="text-xs mt-2 mb-10">
                    Regenerate characters for 25 coins
                </p>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {
                        characters?.map((item, index) => (
                            <div  
                            onClick={() => openEditCurrentCharacterModal(item) }
                            key={index} 
                            className="flex flex-col overflow-hidden rounded-2xl w-full cursor-pointer transition-all hover:shadow-lg bg-[#F9F9F9] border border-gray-50 hover:border-gray-100">
                                <div className="aspect-square w-full relative rounded-2xl">
                                    <Image
                                        src="/img/character-placeholder.png"
                                        alt="placeholder"
                                        fill
                                        className='object-cover rounded-2xl'
                                    />

                                    {item?.metaData?.added && 
                                        <div className="flex items-center absolute top-2 left-2 justify-center cursor-pointer hover:shadow-lg transition-all bg-white w-[32px] h-[32px] rounded-lg">
                                            <i className='bx bxs-bell-ring bx-flashing text-xl ' ></i>

                                            {/* {
                                            // showTooltip && 
                                            (
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-100">
                                                    The role helps define how the character serves your story
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                                </div>
                                            )} */}
                                        </div>
                                    }
                                </div>
                                <div className='px-3 py-4 bg-[#F9F9F9] rounded-b-2xl text-center flex flex-col justify-between'>
                                    <h2 className="font-extrabold min-h-[30px] text-sm">{item?.name}</h2>
                                    <p className="capitalize text-[11px]">{item?.role}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>


            <div className="bg-white p-4 rounded-xl mt-7">
                {/* <h1 className='capitalize text-md mb-1 font-bold'>Save</h1>
                <p className='mb-4 text-xs'>Click "start writing" to save parameters</p> */}
                <div className="flex items-center justify-between gap-5">
                     <div className="flex items-center gap-5">
                        <button
                            onClick={returnToSynopsis}
                            className="flex items-center cursor-pointer bg-[#F5F5F5] px-4 py-3 gap-2 rounded-xl hover:bg-gray-200 transition-colors">
                            <span className="text-xs">Synopsis</span>
                            <Image
                                src="/icon/redo.svg"
                                alt="redo icon"
                                width={20}
                                height={20}
                            />

                        </button>
                        

                        {
                            shouldRegenerateSynopsis &&
                            <GradientButton 
                            handleClick={refineSynopsis} 
                            // disabled={story?.synopsisList?.length > 0 ? false : true}
                            // className={`${story?.synopsisList?.length > 0 ? "opacity-100" : "opacity-20"}`}
                            >
                                <RefreshCcw size={16} />
                                <span className="text-xs">Refine story with new characters</span>
                            </GradientButton>
                        }

                        {!shouldRegenerateSynopsis &&
                        <GradientButton 
                        handleClick={() => console.log()} 
                        // disabled={story?.synopsisList?.length > 0 ? false : true}
                        // className={`${story?.synopsisList?.length > 0 ? "opacity-100" : "opacity-20"}`}
                        >
                            <Image
                                src="/icon/arrow-guide.svg"
                                alt="arrow-guide icon"
                                width={15}
                                height={15}
                            />
                            <span className="text-xs">World-Building</span>
                        </GradientButton>}

                    </div>

                    <button className="flex items-center cursor-pointer bg-[#F5F5F5]  px-4 py-3 gap-2 rounded-xl ">
                        <p className='text-xs'>Discard</p>
                        <Image src="/icon/waste.svg" alt="feather icon" className=" " width={13} height={13} />
                    </button>
                </div>
            </div>

            <ModalBoxComponent
                isOpen={showChooseCharacterRoleModal}
                onClose={() => setShowChooseCharacterRoleModal(false)}
                width="w-[95%] xs:w-[95%] sm:w-[90%] md:w-[80%] lg:w-[50%] xl:w-[30%] "
                useDefaultHeader={false}
            >
                <div className='bg-white p-5 rounded-xl'>                    
                    <CharacterRoleSelector
                        value={characterRole}
                        onChange={setCharacterRole}
                        placeholder="What role will this character play?"
                        story={story}
                        characterRole={characterRole}
                        setShowChooseCharacterRoleModal={setShowChooseCharacterRoleModal}
                        setOpenCharacterSuggestionsModal={setOpenCharacterSuggestionsModal}
                        setSuggestedCharacters={setSuggestedCharacters}
                        setStory={setStory}
                    />
                </div>
            </ModalBoxComponent>


            {currentCharacter && <EditCharacterComponent 
                story={story}
                openModal={openEditModal}
                setOpenModal={setOpenEditModal}
                currentCharacter={currentCharacter}
                setCharacters={setCharacters}
                activeSynopsis={activeSynopsis}
                setStory={setStory}
            />}
            

            {/* <GeneratedCharacterList characters={suggestedCharacters}/> */}
            <EditableCharacterManager 
            characters={activeSynopsis?.synopsisCharacters ?? []} 
            onCharactersUpdate={(val) => console.log(val)}
            story={story}
            setOpenCharacterSuggestionsModal={setOpenCharacterSuggestionsModal}
            openCharacterSuggestionsModal={openCharacterSuggestionsModal}
            setStory={setStory}
            />


        </>
    )
}

export default CharactersComponent
