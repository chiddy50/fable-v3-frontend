"use client"

import { Check, ChevronUp, Mic, X } from 'lucide-react';
import React, { useState } from 'react'
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
import TestCarousel from '@/components/story/TestCarousel';
import ModalBoxComponent from '@/components/shared/ModalBoxComponent';
import ChooseStructureComponent from '@/components/story/ai/ChooseStructureComponent';
import SaveStoryTitleComponent from '@/components/story/ai/SaveStoryTitleComponent';
import { useQuery } from '@tanstack/react-query';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { StoryInterface } from '@/interfaces/StoryInterface';


const steps = [
	{
		id: 1,
		title: "Idea",
		description: "Generate idea."
	},
	{
		id: 2,
		title: "Framework",
		description: "Generate framework."
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

const WriteAiStoryPage = () => {
	const step = useSearchParams().get('current-step');
	const storyId = useSearchParams().get('story-id');

	const [currentStep, setCurrentStep] = useState(step ? Number(step) : 1);
	
	const [selectedStoryType, setSelectedStoryType] = useState<string>('novel'); // The story type user chooses
	const [selectedStoryStructure, setSelectedStoryStructure] = useState<string>(''); // The story type user chooses
	const [autoDetectStructure, setAutoDetectStructure] = useState<boolean>(false);

	const [openProjectTitleModal, setOpenProjectTitleModal] = useState<boolean>(false);
	const [story, setStory] = useState<StoryInterface | null>(null);
	

	const [isModalOpen, setIsModalOpen] = useState<boolean>(storyId ? false : true);
	const [modalSize, setModalSize] = useState<string>('md');


	const { data: storyData, isFetching, isError, refetch } = useQuery({
        queryKey: ['storyFromScratchFormData', storyId],
        queryFn: async () => {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/${storyId}`;

            const response = await axiosInterceptorInstance.get(url);
            if (response?.data?.story) {
                setStory(response?.data?.story);
                setCurrentStep(response?.data?.story?.currentStep);                
            }
            return response?.data?.story;
        },
        enabled: !!storyId  
    });

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


	return (
		<div className='px-5 grid grid-cols-12'>
			{story && <div className="col-span-9">
				<IdeationComponent 
					autoDetectStructure={autoDetectStructure}
					selectedStoryStructure={selectedStoryStructure}
					selectedStoryType={selectedStoryType}
					story={story}
				/>
			</div>}
			<div className="col-span-3">
				<StepperComponent setCurrentStep={setCurrentStep} currentStep={currentStep} steps={steps} />
			</div>





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
                // title="Project Title"
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

export default WriteAiStoryPage
