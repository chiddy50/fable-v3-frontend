"use client"

import { NarrativeConceptInterface, StoryInterface, TargetAudienceInterface } from '@/interfaces/StoryInterface';
import { ArrowDownCircle, CheckCircle, ChevronDownCircle, ChevronLeft, ChevronRight, RefreshCcw, Save } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import StoryDetailsComponent from './StoryDetailsComponent';
import { GenreInterface } from '@/interfaces/GenreInterface';
import GradientButton from '@/components/shared/GradientButton';
import { hidePageLoader, scrollToBottom, showPageLoader } from '@/lib/helper';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { generateSynopsisPrompt } from '@/data/prompts/generateSynopsis';
import { novelStructures, shortStoryStructures } from '@/data/structures';
import NarrativeConceptGuide from './NarrativeConceptGuide';
import ModalBoxComponent from '@/components/shared/ModalBoxComponent';
import NarrativeConceptSelector from './NarrativeConceptSelector';
import { CreateStorySynopsisInterface, SynopsisListInterface } from '@/interfaces/SynopsisInterface';
import { updateStory } from '@/lib/requests';
import { AlertDialogComponent } from '@/components/shared/AlertDialogComponent';
import { v4 as uuidv4 } from 'uuid';
import SynopsisInputComponent from './SynopsisInputComponent';
import { toast } from 'sonner';



interface Props {
    autoDetectStructure: boolean;
    selectedStoryStructure: string;
    selectedStoryType: string;
    story: StoryInterface;    
    setStory: React.Dispatch<React.SetStateAction<StoryInterface>>;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    setCurrentStepUrl: React.Dispatch<React.SetStateAction<string>>;
    currentStep: number;
    targetAudiences: TargetAudienceInterface[] | [];
    genres: GenreInterface[] | [];
    refetch: () => void;
}

interface SaveSynopsisPayload {
    storyStructureReason?: string; 
    synopsis: {
        id: string;
        content: string;
        active: boolean;
    }; 
    structure?: string; 
    narrativeConcept: NarrativeConceptInterface; 
    refinedProjectDescription: string 
}

const SynopsisComponent: React.FC<Props> = ({
    autoDetectStructure,
    selectedStoryStructure,
    selectedStoryType,
    setCurrentStep,
    setCurrentStepUrl,
    currentStep,
    story,
    setStory,
    targetAudiences,
    genres,
    refetch
}) => {

    const [narrativeConcept, setNarrativeConcept] = useState<NarrativeConceptInterface|null>(null);
    const [showNarrativeConceptGuide, setShowNarrativeConceptGuide] = useState<boolean>(true);
    const [accordionValue, setAccordionValue] = useState<string>("item-1");
    const [openConfirmSynopsisRegenerationModal, setOpenConfirmSynopsisRegenerationModal] = useState<boolean>(false);
    
    const [synopsisList, setSynopsisList] = useState<SynopsisListInterface[]>([]);
    const [content, setContent] = useState<string>('');
    const [activeSynopsisId, setActiveSynopsisId] = useState<string|null>(null);

    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();

    const handleContentChange = (content: string) => {
        console.log(content);

        setContent(content);
    };

    useEffect(() => {
        setContent(story?.synopsis ?? "")
        setNarrativeConcept(story?.narrativeConcept ?? "")
        setShowNarrativeConceptGuide(story?.narrativeConcept ? false : true)

        setAccordionValue(story?.synopsis ? "" : "item-1")
        setSynopsisList(story?.synopsisList ?? [])

        
        const currentActiveSynopsis = story?.synopsisList?.find((item: SynopsisListInterface) => item?.active === true);
        
        // let lastSynopsisIndex = story?.synopsisList?.length ? story?.synopsisList?.length - 1 : 0;
        // setActiveSynopsisId(story.currentChapterId ?? result?.[lastSynopsisIndex]?.id)

        setActiveSynopsisId(currentActiveSynopsis?.id);
        
        if(story?.synopsis){
            scrollToBottom("synopsis-form")
        }
    }, []); // Empty array ensures this runs only once on mount
    
    const startSynopsisGeneration = async () => {
        try {
            const audiences = story?.storyAudiences?.map(item => item?.targetAudience?.name);
            const payload: CreateStorySynopsisInterface = {
                description: story?.projectDescription,
                tone: story?.tone,
                genres: story?.storyGenres?.map(item => item?.storyGenre?.name),
                storyAudiences: audiences,
                contentType: story?.contentType,
                storyType: story?.storyType,
                structure: story?.structure,
                narrativeConcept: `${narrativeConcept?.title}, ${narrativeConcept?.description}`,
            };
            console.log(payload);

            const availableStructures = story?.storyType === "short-story" ? shortStoryStructures : novelStructures;

            const prompt = generateSynopsisPrompt(payload, availableStructures);
            console.log(prompt);

            if(!prompt) return;

            await makeSynopsisGenerationRequest(prompt);

        } catch (error) {
            console.error(error);                
            toast.error("Try again please")
        }finally{
            hidePageLoader()
        }
        if (!story?.synopsis) {

        } else {
            console.log("Do not generate synopsis");
        }
    };

    const makeSynopsisGenerationRequest = async (prompt: any) => {
        try {
            
            showPageLoader();
            let res = await axios.post(`/api/json-llm-response`, { prompt, type: "generate-synopsis" } );
            console.log(res);
        
            let response = res?.data;
        
            if (response) {   
                
                let synopsisData = {
                    id: uuidv4(),
                    content: response?.synopsis,
                    characters: response?.characters,
                    active: true
                }
        
                let payload = {
                    structure: story?.structure ?? response?.storyStructure,
                    storyStructureReason: story?.storyStructureReason ?? response?.reason,
                    synopsis: synopsisData,
                    narrativeConcept,
                    refinedProjectDescription: response?.projectDescription
                }
                if (story?.autoDetectStructure === true) {
                    payload.structure = response?.storyStructure;
                    payload.storyStructureReason = response?.reasone;
                }
        
                await saveSynopsis(payload)
                // refetch()
        
                scrollToBottom("synopsis-form")
            }
        } catch (error) {
            console.error(error);            
        }
    }
    
    const returnToIdea = async () => {
        try {

            showPageLoader();

            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/getting-started/${story?.id}`;
            await axiosInterceptorInstance.put(url, {
                currentStepUrl: "idea",
                currentStep: 1,
            });
            // const redirectUrl = `/dashboard/write-ai-story?story-id=${story?.id}&current-step=1`;
            // router.push(redirectUrl);
            setCurrentStep(1);
            setCurrentStepUrl("idea")
            // refetch()
        } catch (error) {
            console.error('Error saving ideation:', error);
        } finally {
            hidePageLoader();
        }
    }

    const saveSynopsis = async (payload: SaveSynopsisPayload) => {
        try {
            showPageLoader();

            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/${story?.id}`;
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

    const moveToCharacters = async () => {
        const response = await updateStory({ currentStepUrl: "characters", currentStep: 2 }, story?.id);
        setStory(response?.data?.story ?? story);
        setCurrentStepUrl("characters");
        setCurrentStep(2);
    }
   

    return (
        <>
            <div className='mb-4'>
                <h1 className="capitalize font-extrabold text-2xl mb-2">Idea</h1>
            </div>
            <StoryDetailsComponent 
                title={story?.projectTitle} 
                prompt={story?.projectDescription} 
                story={story} 
                setStory={setStory}
                targetAudiences={targetAudiences} 
                refetch={refetch} 
                genres={genres} 
            />

            {
                <NarrativeConceptSelector 
                    story={story} 
                    narrativeConcept={narrativeConcept} 
                    setNarrativeConcept={setNarrativeConcept} 
                    startSynopsisGeneration={startSynopsisGeneration}
                    setAccordionValue={setAccordionValue}
                    accordionValue={accordionValue}
                    setShowNarrativeConceptGuide={setShowNarrativeConceptGuide}
                />
            }

            {
                showNarrativeConceptGuide === false && narrativeConcept && story?.synopsisList?.length > 0 &&
                <>
                    <SynopsisInputComponent 
                        content={content}
                        story={story}
                        handleContentChange={handleContentChange}
                        synopsisList={synopsisList}
                        activeSynopsisId={activeSynopsisId}
                        setActiveSynopsisId={setActiveSynopsisId}
                        setStory={setStory}
                        setOpenConfirmSynopsisRegenerationModal={setOpenConfirmSynopsisRegenerationModal}
                    />

                    {story?.autoDetectStructure === true && 
                    <div className="bg-white p-5 rounded-xl space-y-6 mt-5">
                        <div className="">
                            <h3 className="capitalize text-md mb-1 font-bold">Suggested Story Structure </h3>
                            <div className="flex">
                                <p className="bg-[#eadff4] dark:bg-[#e7daf3] text-[#33164C] dark:text-[#c0aad3] px-4 py-2 rounded-lg text-xs font-medium">
                                    {story?.structure} Story Structure
                                </p>
                            </div>
                        </div>
                        <div className="mt-3">
                            <h3 className="capitalize text-md mb-1 font-bold">Reason</h3>
                            <p className='text-xs text-gray-400'>{story?.storyStructureReason}</p>
                        </div>
                    </div>
                    }

                </>
            }
            <div className="bg-white p-4 rounded-xl mt-7">
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={returnToIdea}
                            className="flex items-center cursor-pointer bg-[#F5F5F5] px-4 py-3 gap-2 rounded-xl hover:bg-gray-200 transition-colors">

                            <span className="text-xs">Refine Idea</span>
                            <Image
                                src="/icon/redo.svg"
                                alt="redo icon"
                                width={20}
                                height={20}
                            />

                        </button>

                        <GradientButton handleClick={moveToCharacters} 
                        disabled={story?.synopsisList?.length > 0 ? false : true}
                        className={`${story?.synopsisList?.length > 0 ? "opacity-100" : "opacity-20"}`}>
                            <Image
                                src="/icon/arrow-guide.svg"
                                alt="arrow-guide icon"
                                width={15}
                                height={15}
                            />
                            <span className="text-xs">Characters</span>
                        </GradientButton>

                    </div>

                    <button className="flex items-center cursor-pointer bg-[#F5F5F5]  px-4 py-3 gap-2 rounded-xl ">
                        <p className='text-xs'>Discard</p>
                        <Image src="/icon/waste.svg" alt="feather icon" className=" " width={13} height={13} />
                    </button>
                </div>
            </div>



            <ModalBoxComponent
                isOpen={showNarrativeConceptGuide}
                onClose={() => setShowNarrativeConceptGuide(false) }
                width="w-[95%] xs:w-[95%] sm:w-[90%] md:w-[80%] lg:w-[50%] xl:w-[45%]"
                useDefaultHeader={false}
            >
                <NarrativeConceptGuide story={story} />
            </ModalBoxComponent>


             <AlertDialogComponent
             	title="Confirm Synopsis Regeneration"
             	description="Are you sure you want to proceed?"
             	actionText="Yes, Continue"
             	onAction={() => startSynopsisGeneration()}
                open={openConfirmSynopsisRegenerationModal}
	            onOpenChange={setOpenConfirmSynopsisRegenerationModal}
             />

        </>
    )
}

export default SynopsisComponent
