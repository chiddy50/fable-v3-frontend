"use client"

import { Check, ChevronUp, Mic, X } from 'lucide-react';
import React, { useState, Suspense, useEffect, useCallback } from 'react'
import { storyGenres } from "@/data/genres";
import Image from 'next/image';
import StepperComponent from '@/components/dashboard/StepperComponent';
import { useRouter, useSearchParams } from 'next/navigation';
import IdeationComponent from '@/components/story/ai/IdeationComponent';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import ModalBoxComponent from '@/components/shared/ModalBoxComponent';
import ChooseStructureComponent from '@/components/story/ai/ChooseStructureComponent';
import SaveStoryTitleComponent from '@/components/story/ai/SaveStoryTitleComponent';
import { useQuery } from '@tanstack/react-query';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { StoryInterface, TargetAudienceInterface } from '@/interfaces/StoryInterface';
import CharactersComponent from '@/components/story/ai/CharactersComponent';
import axios from 'axios';
import { GenreInterface } from '@/interfaces/GenreInterface';
import SynopsisComponent from '@/components/story/ai/SynopsisComponent';


const steps = [
	{
		id: 1,
		title: "Idea",
		description: "Generate idea."
	},
	{
		id: 2,
		title: "Characters",
		description: "Generate Characters."
	},
	{
		id: 3,
		title: "Outline",
		description: "Set story outline."
	},
	{
		id: 4,
		title: "Write Story",
		description: "Write the masterpiece!"
	}
];

// Client component that uses useSearchParams
function AIStoryContent() {
	const searchParams = useSearchParams();
	const step = searchParams.get('current-step');
	const storyId = searchParams.get('story-id');

	const [currentStep, setCurrentStep] = useState<number>(1);
	const [currentStepUrl, setCurrentStepUrl] = useState<string>("idea");
	
	
	const [selectedStoryType, setSelectedStoryType] = useState<string>('novel'); // The story type user chooses
	const [selectedStoryStructure, setSelectedStoryStructure] = useState<string>(''); // The story type user chooses
	const [autoDetectStructure, setAutoDetectStructure] = useState<boolean>(false);

	const [openProjectTitleModal, setOpenProjectTitleModal] = useState<boolean>(false);
	const [story, setStory] = useState<StoryInterface | null>(null);
	
	const [isModalOpen, setIsModalOpen] = useState<boolean>(storyId ? false : true);
	const [modalSize, setModalSize] = useState<string>('md');
	
	const [targetAudiences, setTargetAudiences] = useState<TargetAudienceInterface[] | []>([]);
	const [genres, setGenres] = useState<GenreInterface[] | []>([]);
	

	

	useEffect(() => {
		// setCurrentStep(story?.currentStep ?? 1)

		if (!storyId) {
			setStory(null)
			setCurrentStep(1)
			setIsModalOpen(true)
			setCurrentStepUrl("idea")
		}else{
			setCurrentStep(story?.currentStep ?? 1)			
			setCurrentStepUrl(story?.currentStepUrl ?? "idea")
		}
	}, [storyId])

	const { data: storyData, isFetching, isError, refetch } = useQuery({
        queryKey: ['storyFromScratchFormData', storyId],
        queryFn: async () => {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/${storyId}`;

            const response = await axiosInterceptorInstance.get(url);
            if (response?.data?.story) {
                setStory(response?.data?.story);
                setCurrentStep(response?.data?.story?.currentStep);                
                setCurrentStepUrl(response?.data?.story?.currentStepUrl ?? "idea");                
            }
            return response?.data?.story;
        },
        enabled: !!storyId && !story
    });

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

                setTargetAudiences(formattedAudiences);
            }
        } catch (error) {
            console.error('Error fetching target audiences:', error);
        }
    }, []);

	const fetchStoryGenres = useCallback(async () => {
		try {
			const url = `${process.env.NEXT_PUBLIC_BASE_URL}/genres`;
			const response = await axios.get(url);
			
			if (response?.data?.genres) {
				const formattedGenres = response.data.genres.map((genre: { id: number, name: string }) => ({
					value: genre.id,
					label: genre.name
				}));

				setGenres(formattedGenres);
			}
		} catch (error) {
			console.error('Error fetching genres:', error);
		}
	}, []);

	useEffect(() => {
		fetchStoryGenres();
		fetchTargetAudiences();
	}, [fetchStoryGenres, fetchTargetAudiences]);
	

	const openModal = (size: string) => {
		setModalSize(size);
		setIsModalOpen(true);
	};

	const decideStructureForUser = () => {
        setIsModalOpen(false);
        setAutoDetectStructure(true);

		// Open project title modal
		setOpenProjectTitleModal(true);
    }

	const returnToStoryStructureModal = () => {
		setOpenProjectTitleModal(false);
		setIsModalOpen(true)
    }

	console.log({currentStepUrl});
	
	return (
		<div className='md:px-5 grid grid-cols-12 h-full'>
			{story && 
				<div className="col-span-12 md:col-span-9 overflow-y-auto pr-5">
					{currentStepUrl === "idea" && 
						<IdeationComponent 
							autoDetectStructure={autoDetectStructure}
							selectedStoryStructure={selectedStoryStructure}
							selectedStoryType={selectedStoryType}
							story={story}
							setCurrentStep={setCurrentStep}
							setCurrentStepUrl={setCurrentStepUrl}
							currentStep={currentStep}	
							refetch={refetch}
							setStory={setStory}
						/>
					}
					{currentStepUrl === "synopsis" && 
						<SynopsisComponent 
							autoDetectStructure={autoDetectStructure}
							selectedStoryStructure={selectedStoryStructure}
							selectedStoryType={selectedStoryType}
							story={story}
							setStory={setStory}
							setCurrentStep={setCurrentStep}
							setCurrentStepUrl={setCurrentStepUrl}
							currentStep={currentStep}
							targetAudiences={targetAudiences}
							genres={genres}
							refetch={refetch}
						/>
					}

					{currentStepUrl === "characters" && 
						<CharactersComponent 
							autoDetectStructure={autoDetectStructure}
							selectedStoryStructure={selectedStoryStructure}
							selectedStoryType={selectedStoryType}
							story={story}
							setStory={setStory}
							setCurrentStep={setCurrentStep}
							setCurrentStepUrl={setCurrentStepUrl}
							currentStep={currentStep}
							targetAudiences={targetAudiences}
							genres={genres}
							refetch={refetch}
						/>
					}
					{currentStep === 3 && <div>Outline</div>}
					{currentStep === 4 && <div>Write Story</div>}
				</div>
			}
			{story && 
				<div className="hidden md:block md:col-span-3 sticky top-0 self-start">
					<StepperComponent setCurrentStep={setCurrentStep} currentStep={currentStep} steps={steps} />
				</div>
			}

			<ChooseStructureComponent 
				isModalOpen={isModalOpen} 
				setIsModalOpen={setIsModalOpen}
				setSelectedStoryType={setSelectedStoryType}
				setSelectedStoryStructure={setSelectedStoryStructure}
				selectedStoryType={selectedStoryType}
				decideStructureForUser={decideStructureForUser}
				setOpenProjectTitleModal={setOpenProjectTitleModal}
			/>

			<ModalBoxComponent
                isOpen={openProjectTitleModal}
                onClose={returnToStoryStructureModal}
                width="w-[30%]"
                useDefaultHeader={false}
				closeOnOutsideClick={false}
            >
                <SaveStoryTitleComponent 
					setOpenProjectTitleModal={setOpenProjectTitleModal}
					autoDetectStructure={autoDetectStructure}
					selectedStoryType={selectedStoryType}
					selectedStoryStructure={selectedStoryStructure}
				/>
            </ModalBoxComponent>
		</div>
	)
}

// Main page component with Suspense boundary
const WriteAiStoryPage = () => {
	return (
		<Suspense fallback={<div className="px-5 py-10">Loading AI story editor...</div>}>
			<AIStoryContent />
		</Suspense>
	)
}

export default WriteAiStoryPage