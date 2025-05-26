"use client"

import { StoryInterface, TargetAudienceInterface } from '@/interfaces/StoryInterface';
import { ArrowDownCircle, CheckCircle, ChevronDownCircle, Save } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import StoryDetailsComponent from './StoryDetailsComponent';
import { GenreInterface } from '@/interfaces/GenreInterface';
import GradientButton from '@/components/shared/GradientButton';
import { updateStory } from '@/lib/requests';
import { Button } from '@/components/ui/button';
import EditCharacterComponent from './character/EditCharacterComponent';
import { SynopsisCharacterInterface, SynopsisInterface } from '@/interfaces/SynopsisInterface';


interface Props {
    autoDetectStructure: boolean;
    selectedStoryStructure: string;
    selectedStoryType: string;
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
    autoDetectStructure,
    selectedStoryStructure,
    selectedStoryType,
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

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const handleContentChange = (content: string) => {
        console.log(content);
        
        setContent(content);
    };

    useEffect(() => {
        const synopsis: SynopsisInterface|null = story?.synopsisList?.find(item => item?.active === true);
        setActiveSynopsis(synopsis ? synopsis : null)
    }, [])

    const returnToSynopsis = async () => {
        const response = await updateStory({ currentStepUrl: "synopsis", currentStep: 1 }, story.id);
        setStory(response?.data?.story ?? story);
        setCurrentStepUrl("synopsis");
        setCurrentStep(1);
    }
       
    const openEditCurrentCharacterModal = (character: SynopsisCharacterInterface) => {        
        setCurrentCharacter(character)
        setOpenEditModal(true)
    }

    return (
        <>
            <StoryDetailsComponent 
                title={story?.projectTitle} 
                prompt={story?.projectDescription} 
                story={story} 
                setStory={setStory}
                targetAudiences={targetAudiences} 
                refetch={refetch} 
                genres={genres} 
            />

            <div className="mb-7 flex items-center justify-between bg-white p-3 rounded-xl">
                <h1 className='capitalize text-xl font-bold'>Idea</h1>
                {/* <ChevronDownCircle className='text-gray-600' size={16} /> */}
                <CheckCircle size={20} className='text-green-600' />
            </div>

            <div className='bg-white p-5 rounded-xl'>
                <h1 className='capitalize text-xl font-bold mb-1'>Characters</h1>
                <p className='text-xs'>Click to edit any character to your taste. Or “add character” from your collection.</p>

                <Button 
                
                className='bg-[#5D4076] text-white mt-10 cursor-pointer'>
                    <Image
                        src="/icon/generate2.svg"
                        alt="placeholder"
                        width={20}
                        height={20}
                    />
                    <span>Generate Character</span>
                </Button>
                <p className="text-xs mt-2 mb-10">
                    Regenerate characters for 25 coins
                </p>

                <div className="mt-5 grid grid-cols-3 gap-5">
                    {
                        story?.synopsisList?.find(item => item.active === true)?.characters?.map((item, index) => (
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
                                </div>
                                <div className='px-3 py-4 bg-[#F9F9F9] rounded-b-2xl text-center'>
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
                        </GradientButton>

                    </div>

                    <button className="flex items-center cursor-pointer bg-[#F5F5F5]  px-4 py-3 gap-2 rounded-xl ">
                        <p className='text-xs'>Discard</p>
                        <Image src="/icon/waste.svg" alt="feather icon" className=" " width={13} height={13} />
                    </button>
                </div>
            </div>



            <EditCharacterComponent 
                story={story}
                openModal={openEditModal}
                setOpenModal={setOpenEditModal}
                currentCharacter={currentCharacter}
                activeSynopsis={activeSynopsis}
                setStory={setStory}
            />
        </>
    )
}

export default CharactersComponent
