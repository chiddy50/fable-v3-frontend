"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Info, Mic, Save } from 'lucide-react';
import Image from 'next/image';
import { toast } from "sonner";
import axios from 'axios';

import { tones } from "@/data/storyTones";
import { contentTypeList } from '@/data/contentType';
import { novelStructures, shortStoryStructures } from '@/data/structures';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';

import { GenreInterface } from '@/interfaces/GenreInterface';
import { StoryInterface } from '@/interfaces/StoryInterface';

import MultiSelectDropdownComponent from '@/components/shared/MultiSelectDropdownComponent';
import { ReusableCombobox } from '@/components/shared/ReusableCombobox';
import { GenreSuggestionsModal, ToneSuggestionsModal } from '@/components/story/ContentTypeModal';
import ModalBoxComponent from '@/components/shared/ModalBoxComponent';
import GradientButton from '@/components/shared/GradientButton';
import { generateNarrativeConceptsPrompt } from '@/data/prompts/generateNarrativeConceptsPrompt';
import { updateStory } from '@/lib/requests';

// Types
interface Props {
    autoDetectStructure: boolean;
    selectedStoryStructure: string;
    selectedStoryType: string;
    story: StoryInterface | null;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    setCurrentStepUrl: React.Dispatch<React.SetStateAction<string>>;      
    currentStep: number;
    refetch: () => void;
    setStory: React.Dispatch<React.SetStateAction<StoryInterface>>;
}

interface ContentType {
    value: string;
    label: string;
    id: string;
    description?: string;
    recommendedGenres?: string[];
    recommendedTones?: string[];
}

interface StructureData {
    title: string;
    label?: string;
    bestGenres?: string[];
    recommendedTones?: string[];
    description?: string;
    suggestedContentType?: {
        name: string;
    };
}

interface TargetAudience {
    id: string;
    name: string;
    value: string;
    label: string;
}

interface GenerateNarrativeConceptSuggestionInterface {
    description: string;
    tone: string[];
    genres: string[];
    audiences: string[];
    contentType: string;
    storyType: string;
    structure: string;
}

// Constants
const VALIDATION_MESSAGES = {
    TITLE_REQUIRED: "Title is required",
    DESCRIPTION_REQUIRED: "Description is required",
    CONTENT_TYPE_REQUIRED: "Content Type is required",
    TARGET_AUDIENCE_REQUIRED: "Please provide at least one target audience",
    GENRE_REQUIRED: "Please provide at least one genre",
    TONE_REQUIRED: "Please provide at least one tone"
} as const;

const IdeationComponent: React.FC<Props> = ({
    autoDetectStructure,
    selectedStoryStructure,
    selectedStoryType,
    setCurrentStep,
    setCurrentStepUrl,
    currentStep,
    story,
    setStory,
    refetch
}) => {
    // State
    const [formData, setFormData] = useState({
        title: story?.projectTitle ?? "",
        description: story?.projectDescription ?? "",
        selectedTargetAudience: [] as string[],
        selectedGenres: [] as number[],
        selectedTones: [] as string[],
    });

    const [options, setOptions] = useState({
        genres: [] as GenreInterface[],
        targetAudiences: [] as TargetAudience[],
    });

    const [contentType, setContentType] = useState<ContentType | null>(null);
    const [structureData, setStructureData] = useState<StructureData | null>(null);
    
    const [suggestions, setSuggestions] = useState({
        genres: [] as string[],
        tones: [] as string[],
        description: "",
        title: ""
    });

    const [modals, setModals] = useState({
        showGenreSuggestions: false,
        showToneSuggestions: false
    });

    const router = useRouter();

    // Memoized values
    const selectedContentType = useMemo(() => 
        contentTypeList.find(type => type.value === story?.contentType) ?? null,
        [story?.contentType]
    );

    const storyStructures = useMemo(() => 
        story?.storyType === "short-story" ? shortStoryStructures : novelStructures,
        [story?.storyType]
    );

    // Handlers
    const updateFormData = useCallback((field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const toggleModal = useCallback((modalName: keyof typeof modals) => {
        setModals(prev => ({ ...prev, [modalName]: !prev[modalName] }));
    }, []);

    const handleAudienceChange = useCallback((audienceValue: string) => {
        setFormData(prev => ({
            ...prev,
            selectedTargetAudience: prev.selectedTargetAudience.includes(audienceValue)
                ? prev.selectedTargetAudience.filter(g => g !== audienceValue)
                : [...prev.selectedTargetAudience, audienceValue]
        }));
    }, []);

    // API calls
    const fetchStoryGenres = useCallback(async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/genres`;
            const response = await axios.get(url);
            
            if (response?.data?.genres) {
                const formattedGenres = response.data.genres.map((genre: { id: number, name: string }) => ({
                    value: genre.id,
                    label: genre.name
                }));
                setOptions(prev => ({ ...prev, genres: formattedGenres }));
            }
        } catch (error) {
            console.error('Error fetching genres:', error);
            toast.error('Failed to load genres');
        }
    }, []);

    const fetchTargetAudiences = useCallback(async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/target-audiences`;
            const response = await axios.get(url);
            
            if (response?.data?.targetAudiences) {
                const formattedAudiences = response.data.targetAudiences.map((item: { id: string, name: string }) => ({
                    id: item.id,
                    name: item.name,
                    value: item.id,
                    label: item.name
                }));
                setOptions(prev => ({ ...prev, targetAudiences: formattedAudiences }));
            }
        } catch (error) {
            console.error('Error fetching target audiences:', error);
            toast.error('Failed to load target audiences');
        }
    }, []);

    // Structure data logic
    const updateStructureData = useCallback(() => {
        if (!story) return;

        const { storyType, structure, autoDetectStructure } = story;

        if (!autoDetectStructure && structure) {
            const data = storyStructures.find(item => item.title === structure);
            if (data) {
                setStructureData(data);
                setSuggestions({
                    genres: data.bestGenres || [],
                    tones: data.recommendedTones || [],
                    description: data.description || "",
                    title: data.label ? `${data.label} Story Structure` : ""
                });
            }
        } else if (autoDetectStructure && contentType) {
            const isNonFiction = contentType.value === "Non-Fiction";
            setSuggestions({
                genres: contentType.recommendedGenres || [],
                tones: contentType.recommendedTones || [],
                description: isNonFiction 
                    ? "Writing based on facts, real events, and real people, such as biography or history."
                    : contentType.description || "",
                title: isNonFiction ? "Non-Fiction Story" : `${contentType.label || ""} Story Structure`
            });
        }
    }, [story, contentType, storyStructures]);

    // Validation
    const validateForm = useCallback(() => {
        const { title, description, selectedTargetAudience, selectedGenres, selectedTones } = formData;

        if (!title.trim()) {
            toast.error(VALIDATION_MESSAGES.TITLE_REQUIRED);
            return false;
        }

        if (!description.trim()) {
            toast.error(VALIDATION_MESSAGES.DESCRIPTION_REQUIRED);
            return false;
        }

        if (!contentType) {
            toast.error(VALIDATION_MESSAGES.CONTENT_TYPE_REQUIRED);
            return false;
        }

        if (selectedTargetAudience.length === 0) {
            toast.error(VALIDATION_MESSAGES.TARGET_AUDIENCE_REQUIRED);
            return false;
        }

        if (selectedGenres.length === 0) {
            toast.error(VALIDATION_MESSAGES.GENRE_REQUIRED);
            return false;
        }

        if (selectedTones.length === 0) {
            toast.error(VALIDATION_MESSAGES.TONE_REQUIRED);
            return false;
        }

        return true;
    }, [formData, contentType]);

    // Build payload
    const buildPayload = useCallback(() => {
        const genresWithLabel = formData.selectedGenres
            .map((genreId: number) => {
                const genre = options.genres.find(item => item.value === genreId);
                return genre?.label;
            })
            .filter(Boolean);

        return {
            projectTitle: formData.title,
            projectDescription: formData.description,
            selectedTargetAudience: formData.selectedTargetAudience,
            selectedGenres: formData.selectedGenres,
            genres: genresWithLabel,
            selectedTones: formData.selectedTones,
            contentType: contentType?.value,
            type: 'ai',
            currentStep: 1,
            currentStepUrl: "synopsis"
        };
    }, [formData, options.genres, contentType]);

    // Save ideation
    const saveIdeation = useCallback(async () => {
        if (!validateForm() || !story?.id) return;

        try {
            const payload = buildPayload();
            showPageLoader();

            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/getting-started/${story.id}`;
            await axiosInterceptorInstance.put(url, payload);

            // const redirectUrl = `/dashboard/write-ai-story?story-id=${story.id}&current-step=${currentStep + 1}`;
            // setCurrentStep(currentStep + 1);
            // router.push(redirectUrl);
        } catch (error) {
            console.error('Error saving ideation:', error);
            toast.error('Failed to save ideation');
        } finally {
            hidePageLoader();
        }
    }, [validateForm, buildPayload, story?.id, currentStep, setCurrentStep, router]);

    const moveToGenerateIdea = async () => {
        await saveIdeation()
        
        try {
            showPageLoader()
            if (!story?.narrativeConceptSuggestions) {
                let data = await generateNarrativeConceptSuggestions();
                console.log(data);
                
                const narrativeSuggestions = data?.narrativeConceptSuggestions;
                if(!narrativeSuggestions) return;
                let payload = { narrativeConceptSuggestions: narrativeSuggestions, currentStepUrl: "synopsis" }
                let response = await updateStory(payload, story?.id)
                
                if(!response) return;
                setStory(response?.data?.story);

                setCurrentStepUrl("synopsis");
                setCurrentStep(1);
                refetch()
    
            }else{
                let response = await updateStory({ currentStepUrl: "synopsis" }, story?.id)
                
                if(!response) return;
                setStory(response?.data?.story);
                
                setCurrentStepUrl("synopsis");
                setCurrentStep(1);
                refetch()
            }
        } catch (error) {
            console.error(error);
            
        }finally{
            hidePageLoader()
        }
        
        // const redirectUrl = `/dashboard/write-ai-story?story-id=${story?.id}&current-step=${currentStep + 1}`;
        // setCurrentStep(currentStep + 1);
        // router.push(redirectUrl);
    }

    const generateNarrativeConceptSuggestions = async () => {
        if (!story?.narrativeConceptSuggestions) {
            const {
                projectDescription: description,
                tone,
                genres,
                storyAudiences,
                // contentType,
                storyType,
                structure,
            } = story || {}; 
            
            const audiences = storyAudiences?.map(item => item?.targetAudience?.name);

            const availableStructures = storyType === "short-story" ? shortStoryStructures : novelStructures;

            const choosenGenres = formData.selectedGenres.map(id => options.genres.find(item => item.value === id)?.label).filter(Boolean);
            const choosenAudience = formData?.selectedTargetAudience?.map(id => options.targetAudiences.find(item => item.value === id)?.label).filter(Boolean);

            const payload: GenerateNarrativeConceptSuggestionInterface = {
                description: formData?.description,
                tone: formData.selectedTones,
                genres: choosenGenres,
                audiences: choosenAudience,
                contentType: contentType.id,
                storyType,
                structure,
            };

            console.log({formData, options, contentTypeList, payload});
            

            const prompt = generateNarrativeConceptsPrompt(payload, availableStructures);
            console.log(prompt);

            return await makeGenerateNarrativeConceptSuggestionsLLMRequest(prompt);  
        }
    }

    const makeGenerateNarrativeConceptSuggestionsLLMRequest = async (prompt: string) => {        
        try {
                let res = await axios.post(`/api/json-llm-response`,
                {
                    prompt,
                    type: "generate-narrative-concept"
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );
                console.log(res);
            let response = res?.data;
            return response;
            
        } catch (error) {
            console.error(error);            
        }
    }

    // Content type update
    const updateContentType = useCallback((value: string) => {
        const result = contentTypeList.find(item => item.value === value);
        setContentType(result || null);
    }, []);

    // Effects
    useEffect(() => {
        fetchStoryGenres();
        fetchTargetAudiences();
    }, [fetchStoryGenres, fetchTargetAudiences]);

    useEffect(() => {
        if (selectedContentType) {
            setContentType(selectedContentType);
        }
    }, [selectedContentType]);

    useEffect(() => {
        if (story) {
            // Initialize form data from story
            const audiences = story.storyAudiences?.map((item: any) => item?.targetAudience?.id) ?? [];
            const storyGenres = story.storyGenres?.map((item: any) => item?.storyGenre?.id) ?? [];
            const storyTones = story.tone ?? [];

            setFormData({
                title: story.projectTitle ?? "",
                description: story.projectDescription ?? "",
                selectedTargetAudience: audiences,
                selectedGenres: storyGenres,
                selectedTones: storyTones,
            });
        }
    }, [story]);

    useEffect(() => {
        updateStructureData();
    }, [updateStructureData]);

    // Render helpers
    const renderContentTypeSuggestions = () => {
        if (!story?.autoDetectStructure || !structureData) return null;

        const { suggestedContentType } = structureData;
        if (!suggestedContentType) return null;

        const buttonClasses = "flex items-center gap-1 text-[10px] py-1.5 px-2 rounded-md cursor-pointer bg-[#f5eafd] text-[#33164C]";
        const hoverClasses = "hover:bg-[#33164C] hover:text-white transition-all";

        if (suggestedContentType.name === "Both") {
            return (
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px]">Suggestion:</span>
                    <span className={buttonClasses}>Fiction</span>
                    <span className="text-[10px]">or</span>
                    <span className={buttonClasses}>Non-Fiction</span>
                </div>
            );
        }

        if (suggestedContentType.name === "Fiction" || suggestedContentType.name === "Non-Fiction") {
            return (
                <div className="mt-2 flex">
                    <span className={`${buttonClasses} ${hoverClasses}`}>
                        {suggestedContentType.name}
                    </span>
                </div>
            );
        }

        return null;
    };

    const renderSuggestionButton = (type: 'genre' | 'tone') => {
        if (!story?.structure && !contentType?.value) return null;

        const isGenre = type === 'genre';
        const onClick = () => toggleModal(isGenre ? 'showGenreSuggestions' : 'showToneSuggestions');
        
        let text = "";
        if (story?.structure && contentType?.value === "Fiction") {
            text = `View ${type} suggestions for ${story.structure} Story Structure`;
        } else if (contentType?.value === "Non-Fiction") {
            text = `View the best ${type} suggestions for Non-Fiction`;
        } else if (story?.autoDetectStructure && contentType?.value === "Fiction") {
            text = `View the best ${type} suggestions for Fiction`;
        } else if (contentType?.value) {
            text = `View the best ${type} suggestions for ${contentType.value}`;
        }

        if (!text) return null;

        return (
            <div className="mt-2 flex">
                <button
                    onClick={onClick}
                    className="flex items-center gap-1 text-[10px] py-2 px-3 rounded-md cursor-pointer transition-all bg-[#f5eafd] text-[#33164C] hover:bg-[#33164C] hover:text-white"
                >
                    <Info size={10} />
                    <span>{text}</span>
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-[#f5f4f6] p-4 rounded-xl">
                <div className="flex gap-2 mb-2">
                    <span className="bg-white rounded-md py-1 capitalize text-xs px-3">
                        {story?.storyType}
                    </span>
                    {story?.autoDetectStructure ? (
                        <span className="bg-white rounded-md py-1 text-xs px-3">
                            Auto-detect structure
                        </span>
                    ) : (
                        <span className="bg-white rounded-md py-1 text-xs px-3">
                            {story?.structure}
                        </span>
                    )}
                </div>

                <input
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    type="text"
                    placeholder="Title"
                    className="py-3 px-3 w-full outline-0 text-2xl placeholder:text-gray-300 bg-white rounded-lg font-bold"
                />
            </div>

            {/* Ideation Header */}
            <div>
                <h1 className="capitalize text-2xl mb-2">Ideation</h1>
                <p className="text-xs mb-2">Fill in the details below</p>
            </div>

            {/* Description Section */}
            <div>
                <h2 className="capitalize text-md mb-1 font-bold">Description</h2>
                <p className="mb-3 text-xs">Tell us what you'd like to create</p>

                <div className="flex flex-col gap-1 rounded-xl bg-white p-1">
                    <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        className="text-xs w-full p-3 bg-white outline-0 resize-none"
                        rows={4}
                        placeholder="Describe your story idea..."
                    />
                    <div className="flex justify-end">
                        <button className="text-white cursor-pointer flex items-center justify-center p-2 rounded-lg m-2 bg-gradient-to-r from-[#AA4A41] to-[#33164C] hover:to-[#AA4A41] hover:from-[#33164C] transition-all">
                            <Mic size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Form Section */}
            <div className="bg-white p-5 rounded-xl space-y-6">
                {/* Target Audience */}
                <div className='mb-7'>
                    <h3 className="capitalize text-md mb-1 font-bold">Target Audience</h3>
                    <p className="text-xs mb-3">Who are you writing for?</p>
                    
                    <div className="flex flex-wrap gap-3 max-h-[300px] overflow-y-auto">
                        {options.targetAudiences.map((audience) => (
                            <div
                                key={audience.id}
                                className={`inline-flex items-center px-4 py-2 bg-[#F5F5F5] rounded-lg cursor-pointer transition-colors ${
                                    formData.selectedTargetAudience.includes(audience.value) 
                                        ? 'border border-[#FF877B]' 
                                        : 'border border-transparent'
                                }`}
                                onClick={() => handleAudienceChange(audience.value)}
                            >
                                <label className="mr-2 text-gray-600 text-xs font-medium cursor-pointer">
                                    {audience.label}
                                </label>
                                <div className="relative">
                                    <div className={`w-5 h-5 border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                                        formData.selectedTargetAudience.includes(audience.value)
                                            ? 'bg-[#FF877B] border-[#FF877B]'
                                            : 'bg-white border-gray-300'
                                    }`}>
                                        {formData.selectedTargetAudience.includes(audience.value) && (
                                            <Check size={14} color="white" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Type */}
                <div className='mb-7'>
                    <h3 className="capitalize text-md mb-2 font-bold">Content Type</h3>
                    <ReusableCombobox
                        options={contentTypeList}
                        placeholder="Select content type..."
                        defaultValue={contentType}
                        onSelect={updateContentType}
                        className="w-full text-xs"
                        emptyMessage="No content type found."
                    />
                    {renderContentTypeSuggestions()}
                </div>

                {/* Genres */}
                <div className='mb-7'>
                    <MultiSelectDropdownComponent
                        options={options.genres}
                        selectedValues={formData.selectedGenres}
                        onChange={(values) => updateFormData('selectedGenres', values)}
                        placeholder="Select Genre"
                        maxSelections={4}
                        title="Genre"
                        className="w-full"
                    />
                    {renderSuggestionButton('genre')}
                </div>

                {/* Tones */}
                <div>
                    <MultiSelectDropdownComponent
                        options={tones}
                        selectedValues={formData.selectedTones}
                        onChange={(values) => updateFormData('selectedTones', values)}
                        placeholder="Select Tone"
                        title="Tone"
                        className="w-full"
                    />
                    {renderSuggestionButton('tone')}
                </div>
            </div>

            {/* Save Section */}
            <div className="bg-white p-5 rounded-xl flex items-center justify-between">
                
                <div className="flex items-center gap-5">
                    <GradientButton handleClick={() => moveToGenerateIdea()}>                        
                        <Image 
                            src="/icon/arrow-guide.svg" 
                            alt="arrow-guide icon" 
                            width={15} 
                            height={15} 
                        />
                        <span className="text-xs">Generate Idea</span>
                    </GradientButton>
                    <button onClick={saveIdeation} className="flex items-center cursor-pointer bg-[#F5F5F5] px-4 py-3 gap-2 rounded-xl hover:bg-gray-200 transition-colors">
                        <span className="text-xs">Save Idea</span>
                        <Save size={16}/>
                    </button>
                </div>
                

                <button className="flex items-center cursor-pointer bg-[#F5F5F5] px-4 py-3 gap-2 rounded-xl hover:bg-gray-200 transition-colors">
                    <span className="text-xs">Discard</span>
                    <Image 
                        src="/icon/waste.svg" 
                        alt="waste icon" 
                        width={13} 
                        height={13} 
                    />
                </button>
            </div>

            {/* Modals */}
            <ModalBoxComponent
                isOpen={modals.showGenreSuggestions}
                onClose={() => toggleModal('showGenreSuggestions')}
                width="w-[95%] xs:w-[95%] sm:w-[90%] md:w-[80%] lg:w-[50%] xl:w-[45%]"
                useDefaultHeader={false}
            >
                <GenreSuggestionsModal
                    label={suggestions.title}
                    description={suggestions.description}
                    recommendedGenres={suggestions.genres}
                />
            </ModalBoxComponent>

            <ModalBoxComponent
                isOpen={modals.showToneSuggestions}
                onClose={() => toggleModal('showToneSuggestions')}
                width="w-[95%] xs:w-[95%] sm:w-[90%] md:w-[80%] lg:w-[50%] xl:w-[45%]"
                useDefaultHeader={false}
            >
                <ToneSuggestionsModal
                    label={suggestions.title}
                    description={suggestions.description}
                    recommendedTones={suggestions.tones}
                />
            </ModalBoxComponent>
        </div>
    );
};

export default IdeationComponent;