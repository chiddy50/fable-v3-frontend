"use client"
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle, Cog } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { NarrativeConceptInterface, StoryInterface } from "@/interfaces/StoryInterface";





interface Props {
	story: StoryInterface;
	narrativeConcept: {
		title: string;
		description: string;
	} | null;
	setNarrativeConcept: React.Dispatch<React.SetStateAction<{ title: string, description: string } | null>>;
	setAccordionValue: React.Dispatch<React.SetStateAction<string>>;
	setShowNarrativeConceptGuide: React.Dispatch<React.SetStateAction<boolean>>;
	startSynopsisGeneration: () => void;
	accordionValue: string;
}


const NarrativeConceptSelector: React.FC<Props> = ({
	story,
	narrativeConcept,
	setNarrativeConcept,
	startSynopsisGeneration,
	accordionValue,
	setAccordionValue,
	setShowNarrativeConceptGuide
}) => {
	const [arrow, setArrow] = useState<string>("bx-down-arrow-alt")
	const handleSelect = (suggestion: NarrativeConceptInterface) => {
		console.log(suggestion);

		setNarrativeConcept(suggestion)
	};

	const generateSynopsis = () => {
		// setAccordionValue("")
		startSynopsisGeneration()
	}

	return (
		<div className="">
			<Accordion type="single" collapsible
				// defaultValue={accordionValue} 
				value={accordionValue}
				onValueChange={setAccordionValue}
				className="w-full bg-white px-4 py-0 rounded-xl">
				<AccordionItem value="item-1">
					<AccordionTrigger className="cursor-pointer font-bold text-lg hover:no-underline ">
						<h1 className='flex items-center gap-2'>Narrative Concept <ArrowRight size={15} /> <span className='text-xs text-gray-400'>{"(What's the main idea behind your story?)"}</span></h1>
					</AccordionTrigger>
					<AccordionContent className="relative">
						<div className="flex flex-col md:flex-row mb-3 items-center gap-3">
							<p className="text-xs italic text-gray-500">You have {story?.narrativeConceptSuggestions?.length} suggestions to choose from</p>
							<span onClick={() => setShowNarrativeConceptGuide(true)} className="flex items-center gap-1  px-2 py-1 ml-4 rounded-lg bg-[#fbf1f1] text-[#D45C51] transition-all hover:text-white hover:bg-[#D45C51] cursor-pointer">
								<i className='bx bxs-info-circle bx-flashing text-md' ></i>
								<span className="text-[11px]">Learn more</span>
							</span>
						</div>
						<ScrollableDiv
							story={story}
							narrativeConcept={narrativeConcept}
							handleSelect={handleSelect}
							generateSynopsis={generateSynopsis}
							onScrollToTop={() => setArrow("bx-chevrons-down top-5")}
							onScrollToBottom={() => setArrow("bx-chevrons-up bottom-5")}
						/>


						<i className={`bx ${arrow} bx-fade-down bg-white rounded-full text-3xl absolute  right-3`}></i>

					</AccordionContent>
				</AccordionItem>

			</Accordion>
		</div>
	);
}





interface ScrollableDivProps {
	story: StoryInterface;
	narrativeConcept: {
		title: string;
		description: string;
	} | null;
	handleSelect: (value: NarrativeConceptInterface) => void;
	generateSynopsis: () => void;
	onScrollToTop: () => void;
	onScrollToBottom: () => void;
}

const ScrollableDiv: React.FC<ScrollableDivProps> = ({
	story,
	narrativeConcept,
	handleSelect,
	generateSynopsis,
	onScrollToTop, // Function to call when scrolled to top
	onScrollToBottom // Function to call when scrolled to bottom
}) => {
	const divRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (divRef.current) {
				const { scrollTop, scrollHeight, clientHeight } = divRef.current;
				const bottomThreshold = scrollHeight - clientHeight - 10; // 10px buffer

				// Check if scrolled to bottom
				if (scrollTop >= bottomThreshold) {
					onScrollToBottom();
				}

				// Check if scrolled to top
				if (scrollTop === 0) {
					onScrollToTop();
				}
			}
		};

		const currentRef = divRef.current;
		currentRef?.addEventListener('scroll', handleScroll);

		return () => {
			currentRef?.removeEventListener('scroll', handleScroll);
		};
	}, [onScrollToTop, onScrollToBottom]);

	return (
		<div
			ref={divRef}
			className="h-[300px] overflow-y-auto"
		>
			{story?.narrativeConceptSuggestions && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
					{story.narrativeConceptSuggestions?.map((suggestion, index) => (
						<div
							key={index}
							onClick={() => handleSelect(suggestion)}
							className={`relative rounded-xl p-4 cursor-pointer transition-all hover:text-white hover:bg-gradient-to-r hover:to-[#AA4A41] hover:from-[#33164C]
                ${suggestion?.title === narrativeConcept?.title
									? "bg-gradient-to-r to-[#AA4A41] from-[#33164C] text-white"
									: "bg-white shadow-xl border border-gray-100"
								// : "bg-[#f4f4f4]"
								}`}
						>
							<h1 className="text-lg font-extrabold mb-1 tracking-wide">
								{suggestion?.title}
							</h1>
							<p className="text-xs font-light">
								{suggestion?.description}
							</p>

							{suggestion?.title === narrativeConcept?.title && (
								<>
									<CheckCircle
										size={20}
										className="absolute top-2 text-white right-2"
									/>
									<button
										onClick={(e) => {
											e.stopPropagation();
											generateSynopsis();
										}}
										className="flex items-center text-gray-600 cursor-pointer bg-[#F5F5F5] mt-3 px-4 py-3 gap-2 rounded-lg hover:bg-gray-200 transition-colors"
									>
										<span className="text-xs">
											{story?.synopsis ? "Regenerate Synopsis" : "Generate Synopsis"}
										</span>
										<Cog size={16} />
									</button>
								</>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

// Usage example:
// <ScrollableDiv 
//   story={story}
//   narrativeConcept={narrativeConcept}
//   handleSelect={handleSelect}
//   generateSynopsis={generateSynopsis}
//   onScrollToTop={() => console.log('Reached top')}
//   onScrollToBottom={() => console.log('Reached bottom')}
// />


export default NarrativeConceptSelector



