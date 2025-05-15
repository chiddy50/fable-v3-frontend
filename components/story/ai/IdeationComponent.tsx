"use client"

import { Check, ChevronUp, Mic, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { tones } from "@/data/storyTones";
import Image from 'next/image';
import StepperComponent from '@/components/dashboard/StepperComponent';
import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from "sonner"
import axios from 'axios';
import { GenreInterface } from '@/interfaces/GenreInterface';
import MultiSelectDropdownComponent from '@/components/shared/MultiSelectDropdownComponent';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { StoryGenreInterface, StoryInterface, TargetAudienceInterface } from '@/interfaces/StoryInterface';
import { contentTypeList } from '@/data/contentType';
import { ReusableCombobox } from '@/components/shared/ReusableCombobox';
import ContentTypeModal from '@/components/story/ContentTypeModal';
import ModalBoxComponent from '@/components/shared/ModalBoxComponent';



interface Props {
    autoDetectStructure: boolean;
    selectedStoryStructure: string;
    selectedStoryType: string;
    story: StoryInterface | null;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;  
    currentStep: number;
}
const IdeationComponent: React.FC<Props> = ({
    autoDetectStructure,
    selectedStoryStructure,
    selectedStoryType,
    setCurrentStep,
    currentStep,
    story
}) => {
    const [selectedTargetAudience, setSelectedTargetAudience] = useState<string[]>([]);
    const [genres, setGenres] = useState<GenreInterface[]>([]);
    const [targetAudiences, setTargetAudiences] = useState<{ id: string, name: string, value?: string, label?: string }[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<any>([]);
    const [selectedTones, setSelectedTones] = useState<any>([]);
    const [description, setDescription] = useState<string>("");
    const [title, setTitle] = useState<string>(story?.projectTitle ?? "");
    const [contentType, setContentType] = useState<{ value: string, label: string, id: string, description?: string } | null>(null); 
    const [showSuggestionsModal, setShowSuggestionsModal] = useState<boolean>(false);    
    
    const router = useRouter();

    useEffect(() => {
        
        let selectedContentType = contentTypeList.find(type => type.value === story?.contentType);
        setContentType(selectedContentType ?? null)

        setTitle(story?.projectTitle ?? "");

        fetchStoryGenres();
        fetchTargetAudiences();


        let audiences = story?.storyAudiences?.map((item: TargetAudienceInterface) => (item?.targetAudienceId)) ?? [];
        setSelectedTargetAudience(audiences);            

        let storyGenres = story?.storyGenres?.map((item: StoryGenreInterface) => (item?.storyGenreId)) ?? [];
        setSelectedGenres(storyGenres);   
        
        let storyTones = story?.tone ?? [];
        setSelectedTones(storyTones);   

        setTitle(story?.projectTitle ?? "");
        setDescription(story?.projectDescription ?? "");

    }, [
        // story
    ]);

    const fetchStoryGenres = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/genres`;
            const response = await axios.get(url);
            if (response?.data?.genres) {
                let formattedGenres = response?.data?.genres.map((genre: { id: number, name: string }) => {
                    return { value: genre.id, label: genre.name }
                })
                setGenres(formattedGenres)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchTargetAudiences = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/target-audiences`;
            const response = await axios.get(url);
            if (response?.data?.targetAudiences) {
                let formattedTargetAudiences = response?.data?.targetAudiences.map((item: { id: string, name: string }) => {
                    return { value: item.id, label: item.name }
                })
                setTargetAudiences(formattedTargetAudiences)
            }
        } catch (error) {
            console.error(error);
        }
    }


    const handleAudienceChange = (audienceValue: string) => {
        setSelectedTargetAudience(prev => {
            if (prev.includes(audienceValue)) {
                return prev.filter(g => g !== audienceValue);
            } else {
                return [...prev, audienceValue];
            }
        });
    };

    const validate = () => {

        if (!title) {
            toast("Username is required");
            return false;
        }

        if (!description) {
            toast("Description is required");
            return false;
        }

        if (!contentType) {
            toast("Content Type is required");
            return false;
        }        

        if (selectedTargetAudience.length < 1) {
            toast("Kindly provided at least one target audience");
            return false;
        }
        if (selectedGenres.length < 1) {
            toast("Kindly provided at least one genre");
            return false;
        }
        if (selectedTones.length < 1) {
            toast("Kindly provided at least one tone");
            return false;
        }
        return true;
    }

    const saveIdeation = async () => {
        if(!validate()) return;

        try {
            let payload = buildPayload();
            showPageLoader()

            await update(payload); 
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const update = async (payload: any) => {
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/getting-started/${story?.id}`;
        const response = await axiosInterceptorInstance.put(url, payload);               
        // let redirectUrl = `/dashboard/write-ai-story?story-id=${story?.id}&current-step=${currentStep + 1}`;
        // setCurrentStep(currentStep + 1)
        // router.push(redirectUrl);
        
        return response;
    }

    const buildPayload = ()  => {
        const genresWithLabel = selectedGenres.map((genreId: number) => {
            const genre = genres.find(item => item.value === genreId);
            return genre ? genre.label : null;
        }).filter(Boolean);

        let payload = {
            projectTitle: title,
            projectDescription: description,
            selectedTargetAudience,
            selectedGenres,
            genres: genresWithLabel,
            selectedTones,
            contentType: contentType?.value,
            type: 'ai',
            // currentStep: 2
        }

        return payload;
    }

    const updateContentType = async (value: string) => {
        
        let result = contentTypeList.find(item => item.value === value);
        console.log({value,result});
        setContentType(result);

        if (value && value !== '') setShowSuggestionsModal(true);        
    }
    


    return (
        <>
            <div className="bg-[#f5f4f6] p-4 rounded-xl mb-4">
                <div className="flex gap-2 mb-2">
                    <p className="bg-[#fff] rounded-md py-1 capitalize text-xs px-3">{story?.storyType}</p>
                    {
                        story?.autoDetectStructure === true && <p className="bg-[#fff] rounded-md py-1  text-xs px-3">Auto-detect structure</p>
                    }
                    {
                        story?.autoDetectStructure === false && <p className="bg-[#fff] rounded-md py-1 text-xs px-3">{story?.structure}</p>
                    }
                </div>
                
                <input 
                value={title}
                onChange={(e) => setTitle(e.target.value) }
                type="text" 
                placeholder='Title' 
                className='py-3 px-3 w-full outline-0 text-2xl placeholder:text-gray-300 bg-white rounded-lg font-bold' />
            </div>

            <div className="">
                <h1 className='capitalize text-2xl mb-2'>Ideation.</h1>
                <p className='text-xs mb-2'>Fill in the details below</p>
            </div>

            <div className="mt-12">
                <h1 className='capitalize text-md mb-1 font-bold'>Description</h1>
                <p className='mb-3 text-xs'>Tell us what you'd like to create</p>

                <div className='flex flex-col gap-1 rounded-xl bg-white p-1'>
                    <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value) }
                    className='text-xs w-full p-3 bg-white outline-0 resize-none' rows={4}></textarea>
                    <div className='flex justify-end'>
                        <button className='text-white cursor-pointer flex items-center justify-center p-2 rounded-lg m-2 bg-gradient-to-r from-[#AA4A41] to-[#33164C] hover:to-[#AA4A41] hover:from-[#33164C] transition-all'>
                            <Mic size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl mt-7 ">

                <div className="">
                    <div>
                        <h1 className='capitalize text-md mb-1 font-bold'>Target Audience</h1>
                        <p className='text-xs'>Who are you writing for?</p>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3 overflow-y-auto max-h-[300px] ">

                        {targetAudiences.map((vibe, index) => (
                            <div
                                key={index}
                                className={`inline-flex items-center px-4 py-2 bg-[#F5F5F5] rounded-lg cursor-pointer ${selectedTargetAudience.includes(vibe?.value) ? 'border border-[#FF877B]' : ''
                                    }`}
                                onClick={() => handleAudienceChange(vibe?.value)}
                            >
                                <label
                                    htmlFor={`checkbox-${index}`}
                                    className="mr-2 text-gray-600 text-xs font-medium cursor-pointer"
                                >
                                    {vibe?.label}
                                </label>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id={`checkbox-${index}`}
                                        checked={selectedTargetAudience.includes(vibe.value)}
                                        onChange={() => handleAudienceChange(vibe.value)}
                                        className="sr-only peer"
                                    />
                                    <div
                                        className="w-5 h-5 border border-gray-300 rounded-md bg-white peer-checked:bg-[#FF877B] peer-checked:border-[#FF877B] flex items-center justify-center cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent double triggering from parent's onClick
                                            handleAudienceChange(vibe.value);
                                        }}
                                    >
                                        {selectedTargetAudience.includes(vibe.value) && (
                                            <Check size={14} color="white" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6">                    
                    <h1 className='capitalize text-md mb-2 font-bold'>Content Type</h1>
                    <div className="">
                        <ReusableCombobox
                            options={contentTypeList}
                            placeholder="Select tag..."
                            defaultValue={contentType}
                            onSelect={(value) => updateContentType(value)}
                            className="my-custom-class w-full text-xs"
                            emptyMessage="No tag found."
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <MultiSelectDropdownComponent
                        options={genres}
                        selectedValues={selectedGenres}
                        onChange={setSelectedGenres}
                        placeholder="Select Genre"
                        maxSelections={4}
                        title="Genre"
                        className="w-full"
                    />
                </div>

                <div className="mt-6">
                    <MultiSelectDropdownComponent
                        options={tones}
                        selectedValues={selectedTones}
                        onChange={setSelectedTones}
                        placeholder="Select Tone"
                        // maxSelections={4}
                        title="Tone"
                        className="w-full"
                    />
                </div>



            </div>

            <div className="bg-white p-4 rounded-xl mt-7">
                <h1 className='capitalize text-md mb-1 font-bold'>Save</h1>
                <p className='mb-4 text-xs'>Click "start writing" to save parameters</p>
                <div className="flex items-center gap-5">
                    <button onClick={saveIdeation} className="flex items-center cursor-pointer bg-[#33164C] text-white px-7 py-3 gap-2 rounded-xl ">
                        <Image src="/icon/feather-white.svg" alt="feather icon" className=" " width={13} height={13} />
                        <p className='text-xs'>Start Writing</p>
                    </button>

                    <button className="flex items-center cursor-pointer bg-[#F5F5F5]  px-4 py-3 gap-2 rounded-xl ">
                        <p className='text-xs'>Discard</p>
                        <Image src="/icon/waste.svg" alt="feather icon" className=" " width={13} height={13} />
                    </button>
                </div>
            </div>




            <ModalBoxComponent
                isOpen={showSuggestionsModal}
                onClose={() => setShowSuggestionsModal(false)}
                width="w-[95%] xs:w-[95%] sm:w-[90%] md:w-[80%] lg:w-[50%] xl:w-[65%] "
                useDefaultHeader={false}
            >
                <ContentTypeModal
            
                    contentType={contentType}
                />
            </ModalBoxComponent>
            

        </>
    )
}

export default IdeationComponent
