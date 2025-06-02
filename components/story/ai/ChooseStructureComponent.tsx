"use client"

import { Feather, FileText, Hourglass, Info, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { shortStoryStructures, novelStructures } from "@/data/structures"




const NOVEL_STRUCTURES = [
    {
        id: 'three-act',
        title: 'Three-Act',
        label: 'Three-Act Structure',
        type: "Novel",
        chapters: 9,
        description: 'A classic beginning, middle, and end structure divided into setup, confrontation, and resolution. Perfect for traditional storytelling with clear dramatic arcs.',
        examples: 'Star Wars, The Hunger Games, Harry Potter',
        image: '/img/story-structures/three-act2.png',
        learnMoreUrl: '/learn/three-act-structure'
    },
    {
        id: 'heros-journey',
        title: 'Hero\'s Journey',
        label: "Hero's Journey",
        chapters: 12,
        type: "Novel",
        description: 'A circular story path where the hero leaves ordinary life, faces trials, and returns transformed. Ideal for character-driven epics and adventures.',
        examples: 'Lord of the Rings, The Lion King, The Matrix',
        image: '/img/story-structures/hero-journey2.png',
        learnMoreUrl: '/learn/heros-journey'
    },
    {
        id: 'seven-point',
        title: 'Seven-Point',
        label: 'Seven-Point Structure',
        chapters: 7,
        type: "Novel",
        description: 'A focused approach with hook, plot turn, pinch points, midpoint, and resolution. Great for paced narratives with clear turning points.',
        examples: 'Jurassic Park, The Martian, Gone Girl',
        image: '/img/story-structures/seven-point.png',
        learnMoreUrl: '/learn/seven-point-structure'
    },
    {
        id: 'freytags-pyramid',
        title: 'Freytag\'s Pyramid',
        label: "Freytag's Pyramid",
        chapters: 7,
        type: "Novel",
        description: 'A symmetrical structure with rising action, climax, and falling action. Works best for dramatic stories with a clear peak moment.',
        examples: 'Romeo and Juliet, The Great Gatsby, Titanic',
        image: '/img/story-structures/freytag-pyramid.png',
        learnMoreUrl: '/learn/freytags-pyramid'
    },
    {
        id: 'five-act',
        title: 'Five-Act',
        label: 'Five-Act Structure',
        chapters: 9,
        type: "Novel",
        description: 'A traditional dramatic structure with exposition, rising action, climax, falling action, and resolution. Ideal for complex narratives with multiple plot threads.',
        examples: 'Hamlet, Pride and Prejudice, Inception',
        image: '/img/story-structures/five-act.png',
        learnMoreUrl: '/learn/five-act-structure'
    }
];

const SHORT_STORY_STRUCTURES = [
    
    {
        id: 'freytags-pyramid-short',
        title: 'Freytag\'s Pyramid',
        label: "Freytag's Pyramid",
        chapters: '1-3',
        type: "Short Story",
        description: 'A compact version focusing on buildup, climax, and resolution. Great for emotional stories with a powerful central moment.',
        examples: 'Hills Like White Elephants, The Necklace, The Most Dangerous Game',
        image: '/img/story-structures/freytag-pyramid.png',
        learnMoreUrl: '/learn/freytags-pyramid'
    },
    {
        id: 'single-effect',
        title: 'Single-Effect',
        label: 'Single-Effect Structure',
        chapters: '1-3',
        type: "Short Story",
        description: 'Everything in the story works toward creating one powerful emotional impact. Perfect for atmospheric stories with lingering effects.',
        examples: 'The Fall of the House of Usher, The Yellow Wallpaper, The Monkey\'s Paw',
        image: '/img/story-structures/single-effect.png',
        learnMoreUrl: '/learn/single-effect-structure'
    },
    {
        id: 'three-act-short',
        title: 'Three-Act',
        label: 'Three-Act Structure',
        chapters: '3-5',
        type: "Short Story",
        description: 'A concise beginning, middle, and end that focuses on a single conflict. Perfect for efficient storytelling with clear resolution.',
        examples: 'The Gift of the Magi, The Lottery, The Tell-Tale Heart',
        image: '/img/story-structures/three-act2.png',
        learnMoreUrl: '/learn/three-act-structure'
    },
    {
        id: 'in-medias-res',
        title: 'In Medias Res',
        label: 'In Medias Res',
        chapters: '1-3',
        type: "Short Story",
        description: 'Starts in the middle of action, then fills in context through flashbacks. Great for engaging readers immediately with excitement or intrigue.',
        examples: 'Slaughterhouse-Five, The Usual Suspects, Fight Club',
        image: '/img/story-structures/in-medias-res.png',
        learnMoreUrl: '/learn/in-medias-res'
    }
];


const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};

interface Props {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;    
    setOpenProjectTitleModal: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedStoryType: React.Dispatch<React.SetStateAction<string>>;    
    setSelectedStoryStructure: React.Dispatch<React.SetStateAction<string>>;   
    selectedStoryType: string; 
    decideStructureForUser: () => void;
}

const ChooseStructureComponent: React.FC<Props> = ({
    isModalOpen,
    setIsModalOpen,
    setSelectedStoryStructure,
    setSelectedStoryType,
    selectedStoryType,
    decideStructureForUser,
    setOpenProjectTitleModal
}) => {
        
    const structures = selectedStoryType === 'novel' ? novelStructures : shortStoryStructures;

    const chooseStructure = (structure: { title: string }) => {
        console.log(structure);    
        setSelectedStoryStructure(structure.title);    
        setIsModalOpen(false)

        setOpenProjectTitleModal(true);
    }


    return (
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex z-30 items-center justify-center ${isModalOpen ? '' : 'hidden'}`}>

            {/* Modal Container */}
            <div
                className="grid grid-cols-10 gap-0 relative w-[90%]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className='col-span-2 flex flex-col justify-between bg-white p-5 rounded-3xl h-[500px]'>
                    
                    <Link href="/dashboard"
                    // onClick={() => setIsModalOpen(false)}
                    className="h-7 w-7 cursor-pointer hover:text-gray-600 bg-white border border-[#F5F5F5] absolute -top-1 -left-2 rounded-full flex items-center justify-center">
                        {/* <i className='bx bx-x-circle cursor-pointer text-lg'></i> */}
                        <XCircle size={14} className='cursor-pointer'/>
                    </Link>

                    <div>
                        <div className="flex items-center gap-2">
                            <Image src="/icon/magic-pen.svg" alt="feather icon" className=" " width={15} height={15} />
                            <span className="text-gray-400 font-medium">With AI</span>
                        </div>

                        <h1 className="text-2xl mt-2 font-bold">What Structure?</h1>
                        <p className="pt-2 font-light mt-2 text-xs leading-5">We provide you with different structures to help guide your creative genius.</p>
                        <div className="border-t border-gray-300 my-6"></div>

                        <div className="mb-6">
                            <p className="font-bold">Novel or Short Story?</p>
                            <span className="font-light text-gray-600 text-xs">Select either to get started.</span>
                        </div>

                        <div>
                            <button onClick={() => setSelectedStoryType("novel")} className={`flex items-center w-full mb-5 gap-3 cursor-pointer transition-all ${selectedStoryType === 'novel' ? " text-[#D45C51] hover:text-gray-500" : "hover:text-[#D45C51] text-gray-500"} `}>
                                <Feather size={18}/>
                                <span className="font-medium text-sm">Novel</span>
                            </button>
                            <button onClick={() => setSelectedStoryType("short-story")} className={`flex items-center w-full mb-5 gap-3 cursor-pointer transition-all ${selectedStoryType === 'short-story' ? " text-[#D45C51] hover:text-gray-500" : "hover:text-[#D45C51] text-gray-500"} `}>
                                <Feather size={18}/>
                                <span className="font-medium text-sm">Short Story</span>
                            </button>
                        </div>
                    </div>

                    <div>                        
                        <button 
                        // onClick={decideStructureForUser}
                        className='flex items-center gap-2 py-1.5 pl-1.5 pr-3 bg-gradient-to-r from-[#AA4A41] to-[#33164C] rounded-xl cursor-pointer border transition-all '>
                            <div className='flex items-center border border-[#FFE2DF] justify-center p-2 rounded-lg bg-gradient-to-br from-[#AA4A41] to-[#33164C]'>
                                {/* <Image src="/icon/magic-pen.svg" alt="generate icon" width={17} height={17} /> */}
                                <Hourglass size={16} className='text-[#AA4A41]' />
                            </div>
                            <p className="text-sm font-medium text-[#FBFBFB]">
                                {/* Help me decide */}
                                Coming Soon
                            </p>
                        </button>
                    </div>
                </div>
                <div className='col-span-8 h-[500px]'>
                    <Carousel
                        swipeable={false}
                        draggable={false}
                        showDots={false}
                        responsive={responsive}
                        ssr={true} // means to render carousel on server-side.
                        infinite={false}
                        autoPlay={false}
                        autoPlaySpeed={1000}
                        keyBoardControl={true}
                        customTransition="all .5"
                        transitionDuration={500}
                        containerClass="carousel-container"
                        removeArrowOnDeviceType={["tablet", "mobile"]}
                        // deviceType={this.props.deviceType}
                        dotListClass="custom-dot-list-style"
                        itemClass="carousel-item-padding-40-px"
                    >
                        {structures.map(structure => (
                            <div id="master" className="h-[500px] flex flex-col justify-between mr-2 rounded-3xl overflow-clip bg-gray-600 border-2 border-gray-50 mx-2 relative">
                                {/* Background Image */}
                                <div className="absolute inset-0 bg-cover bg-center transition-all duration-300 hover:blur-xs"
                                    style={{
                                        backgroundImage: `url(${structure.image})`,
                                        opacity: 1
                                    }}>
                                </div>

                                {/* Info Button at the top */}
                                <div className="relative z-10 p-3 flex justify-end">
                                    <Info size={14} className="text-white cursor-pointer" />
                                </div>

                                {/* Space filler to push content to bottom */}
                                <div className="flex-grow"></div>

                                {/* Content at the bottom */}
                                <div id="carousel-content" className="relative z-10 p-5 text-white w-full">
                                    {/* Top Section */}
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center space-x-2">
                                            <Image src="/icon/feather-pink.svg" alt="feather icon" width={13} height={13} />
                                            <span className="text-white font-medium text-shadow-dark">{structure.type}</span>
                                        </div>
                                        <div className="text-white font-medium text-shadow-dark">{structure?.chapterAmount} Chapters</div>
                                    </div>

                                    {/* Divider Line */}
                                    <div className="border-t border-gray-500 mb-2"></div>

                                    {/* Title and Description */}
                                    <div className="mb-4 text-white">
                                        <h1 className="text-2xl font-extrabold mb-1 text-shadow-dark">{structure.title}</h1>
                                        <p className="text-xs font-semibold leading-relaxed h-[85px] text-shadow-dark">{structure.description}</p>
                                    </div>

                                    {/* Examples Section */}
                                    <div className="flex items-center text-xs space-x-2 mb-3 text-white h-[32px] text-shadow-dark">
                                        <Image src="/icon/write.svg" alt="write icon" width={13} height={13} />
                                        <span>{structure.examples}</span>
                                    </div>

                                    <div className="mt-2 flex">
                                        {/* <button 
                                        onClick={() => chooseStructure(structure)}
                                        className="flex items-center gap-2 bg-white cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-[#D45C51] hover:bg-[#D45C51] hover:text-white transition-colors" 
                                        aria-label={`Select ${structure.title}`}
                                        >
                                            <Image src="/icon/magic-pen.svg" alt="write icon" width={14} height={14} />
                                            <span>Choose</span>
                                        </button> */}
                                        <button 
                                        className="flex items-center gap-2 bg-white cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-[#D45C51] hover:bg-[#D45C51] hover:text-white transition-colors" 
                                        aria-label={`Select ${structure.title}`}
                                        >
                                            <span>Coming Soon</span>
                                            <Hourglass size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </Carousel>
                </div>
            </div>
        </div>
    )
    // return createPortal(
    // <div></div>,
    //     document.body
    // );
}

export default ChooseStructureComponent
