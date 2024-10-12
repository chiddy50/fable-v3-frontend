"use client";

import React, { useEffect, useState } from 'react'
import { ComboboxComponent } from '@/components/combobox-component';
import { storyGenres } from '@/lib/data'
import { thematicElementList } from '@/lib/thematicElement';
import { Button } from '../ui/button';
import { suspenseTechniques } from '@/lib/suspenceTechnique';

import { ChatGroq } from "@langchain/groq";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ArrowRight, SaveIcon, FilmIcon } from 'lucide-react';
// import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { ReusableCombobox } from '../ReusableCombobox';
import { storyBuilderSteps } from '@/lib/constants';
import { CreatePlotPayloadInterface } from '@/interfaces/PlotInterface';
import { ThematicElementInterface } from '@/types/stories';
import { ThematicOptionInterface } from '@/interfaces/ThematicOptionInterface';
import { SuspenseTechniqueInterface } from '@/interfaces/SuspenseTechniqueInterface';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { hidePageLoader, showPageLoader, storyStarterGuide } from '@/lib/helper';
import { validateStoryStarterForm } from '@/services/StoryStarterHelper';
import { Textarea } from '@/components/ui/textarea'
import { StoryStarterPayloadInterface } from '@/interfaces/StoryStarterInterface';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { Steps } from 'intro.js-react';
import { extractTemplatePrompts, queryLLM, threeActStructureDefinition } from '@/services/LlmQueryHelper';

interface StoryStarterComponentProps {
    data?: StoryInterface;
    currentFormStep: number;
    moveToPlotSelection: (val: string) => void;
    saveStory:(payload: any) => Promise<StoryInterface | null>;
}
  
const StoryStarterComponent: React.FC<StoryStarterComponentProps> = ({
    moveToPlotSelection,
    currentFormStep,
    data,
    saveStory
}) => {
    // console.log({data});
    const [protagonistSuggestionsModalOpen, setProtagonistSuggestionsModalOpen] = useState<boolean>(false);
    const [openStoryIdeaModal, setOpenStoryIdeaModal] = useState<boolean>(false);
    const [storyIdea, setStoryIdea] = useState<string>('');
    const [storyData, setStoryData] = useState<StoryInterface|null>(null);
    
    const [loadingPlotSuggestions, setLoadingPlotSuggestions] = useState<boolean>(false);
    const [genre, setGenre] = useState(null);
    const [genres, setGenres] = useState<Option[]>(data?.genres ?? []);
    
    const [suspenseTechnique, setSuspenseTechnique] = useState<SuspenseTechniqueInterface>(data?.suspenseTechnique ?? null);
    const [thematicElements, setThematicElements] = useState<string[]>(data?.thematicElements?.length > 0 ? data.thematicElements : [] );
    const [selectedThematicElements, setSelectedThematicElements] = useState({});
    
    const [thematicOptions, setThematicOptions] = useState<ThematicOptionInterface[]>(data?.thematicOptions?.length > 0 ? data.thematicOptions : []);
    const [thematicOption, setThematicOption] = useState<ThematicOptionInterface[]>([])
    const [plotSuggestions, setPlotSuggestions] = useState<[]>(data?.plotSuggestions.length > 0 ? data?.plotSuggestions : []);
    const [protagonistSuggestions, setProtagonistSuggestions] = useState<[]>(data?.storyStructure?.protagonistSuggestions ? data?.storyStructure?.protagonistSuggestions : []);

    const [openNewStoryModal, setOpenNewStoryModal] = useState<boolean>(data ? false : true);

    // const dynamicJwtToken = getAuthToken();
    // const { user, setShowAuthFlow } = useDynamicContext();
    const { push } = useRouter();

    useEffect(() => {
        if (data) {
          setGenres(data.genres || []);
          setSuspenseTechnique(data.suspenseTechnique || null);
          setThematicElements(data?.thematicElements || []);
          setThematicOptions(data?.thematicOptions || []);
          setPlotSuggestions(data?.plotSuggestions || []);
          setProtagonistSuggestions(data?.storyStructure?.protagonistSuggestions || []);
        }
      }, [data]);

    useEffect(() => {
        setThematicOptions(prevOptions => {
            const updatedOptions = thematicElements.map(selectedElement => {
                // Find existing option for this element, if any
                const existingOption = prevOptions.find(
                    option => option.thematicElement === selectedElement
                );
    
                let result = {
                    thematicElement: selectedElement,
                    options: [],
                    // Preserve existing thematicOption if it exists
                    thematicOption: existingOption ? existingOption.thematicOption : null
                };
    
                const matchingElement = thematicElementList.find(
                    element => selectedElement === element.label
                );
    
                if (matchingElement) {
                    result.options = matchingElement.options;
                }
    
                return result;
            });
    
            return updatedOptions;
        });
    }, [thematicElements, thematicElementList]);

    function resetThematicOptions(options: any, data: any) {
        if (!data?.thematicOptions) {
            return options;
        }
      
        const dataMap = new Map(data.thematicOptions.map(item => [item.thematicElement, item.thematicOption]));
        console.log({dataMap});
        
        return options.map(option => {
            const newThematicOption = dataMap.get(option.thematicElement);
            if (newThematicOption !== undefined) {
                return { ...option, thematicOption: newThematicOption };
            }
            return option;
        });
    }
    
    const justWriteFromScratch = async () => {

        try {
            
            // if (!user) {
            //     // setShowAuthFlow(true);   
            //     return 
            // }
    
            // const genrePrompt = genres.map(genre => genre.value).join(', ');
            // const thematicElementsPrompt = thematicOptions.map(
            //     item => `For ${item.thematicElement} as the thematic element, the thematic option is ${item.thematicOption}.`
            // ).join(' ');
    
            showPageLoader();
    
            // const startingTemplate = `
            // You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
            // Based on the genre, suspense technique, thematic element and thematic option provided. Generate at least five unique characters and list of settings that fits these genres, suspense technique, thematic element and thematic option provided:
    
            // Return your response in a json or javascript object format like:    
            // protagonistSuggestions(array of objects with keys like name(string), age(string), role(string), habits(string), innerConflict(string), gender(string), relevanceToAudience(string), motivations(array), skinTone(string), hair(string. If the character has hair describe it if not just indicate no hair), facialFeatures(string), motivations(array), personalityTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string), and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)),                  
            // and settingSuggestions(array, these would be list of settings to introduce the story and protagonist) as keys. 
            // Please ensure the only keys in the objects are protagonistSuggestions(Ensure the protagonist suggestions are different and unique characters) and settingSuggestions only.
            // Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
            // genre: {genre}
            // thematic element & option: {thematicElement}
            // suspense technique: {suspenseTechnique}
            // suspense technique description: {suspenseTechniqueDescription}
            // `;
    
            // const response = await queryLLM(startingTemplate, {
            //     genre: genrePrompt,
            //     suspenseTechnique: suspenseTechnique?.value,
            //     suspenseTechniqueDescription: suspenseTechnique?.description,
            //     thematicElement: thematicElementsPrompt,
            // });      
            
            // if (response) {
                
                const storyStarterSaved = await saveStory({ 
                    writeFromScratch: {
                        // protagonistSuggestions: response?.protagonistSuggestions,
                        // settingSuggestions: response?.settingSuggestions,
                        genre: genres.map(genre => genre.value).join(', '),
                        genres,
                        suspenseTechnique: suspenseTechnique,
                        suspenseTechniqueDescription: suspenseTechnique?.description,
                        thematicOptions,
                        thematicElements,  
                    }, 
                    currentStep: 2,
                    currentStepUrl: 'story-plot'
                });   
    
                push(`/story-board-from-scratch?current-step=story-plot&story-id=${data?.id}`);
            // }
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }

    }

    const generateProtagonistSuggestions = async () => {
        let story = data ?? storyData;

        let suggestPlot = story?.projectDescription ? false : true;

        const genrePrompt = genres.map(genre => genre.value).join(', ');
        const thematicElementsPrompt = thematicOptions.map(
            item => `For ${item?.thematicElement} as the thematic element, the thematic option is ${item?.thematicOption}.`
        ).join(' ');
    
        const storyStarter: StoryStarterPayloadInterface = {
            genre: genrePrompt,
            thematicOptions,
            thematicElements,
            genres,
            suspenseTechnique,
            suspenseTechniqueDescription: suspenseTechnique?.description,
        }

        showPageLoader();
        
        try {
            const startingTemplate = generatePromptTemplate(suggestPlot);

            const payload = {
                genre: genrePrompt,
                tone: genrePrompt,
                suspenseTechnique: suspenseTechnique?.value,
                suspenseTechniqueDescription: suspenseTechnique?.description,
                thematicElement: thematicElementsPrompt,
                ...(suggestPlot ? {} : { storyIdea: story?.projectDescription })
            };

            let response = await queryLLM(startingTemplate, payload);            
            
            if (!response) {
                console.log("NO CHARACTERS AND SETTINGS GENERATED");     
                toast.error("Try again please, network error");           
                return false; 
            }
            return response;            
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }

    }

    const moveToSelectedPlot = () => push(`/dashboard/story-project?current-step=story-plot&story-id=${data?.id}`);

    const generatePromptTemplate = (suggestPlot = true) => {
        const specificInstructions = suggestPlot
        ? `Based on the provided genre, suspense technique, thematic element, and thematic option, generate at least 4 protagonists and 5 settings for the story.`
        : `Based on the provided story idea, genre, suspense technique, thematic element, and thematic option, generate at least 4 protagonists and 5 settings for the story from the story idea {storyIdea}.`;
        
        const commonInstructions = `
        You are a professional storyteller with a talent for crafting compelling narratives, intricate characters, and immersive worlds. 
        
        Each suggestion should be related to the genre, thematic element, thematic option & suspense technique.

        Each character should naturally incorporate the following elements:
          - Define the protagonist's identity, traits, strengths, weaknesses, motivations, and goals.
          - Highlight what drives the protagonist, including desires, fears, and motivations that influence their decisions and actions.
          - Outline the external and internal obstacles the protagonist faces, and describe how they navigate these challenges using strategies and adaptations.
          - Show how relationships and connections shape the protagonist's journey, goals, conflicts, and personal growth.
        
        Return your response in a json format like:
        protagonistSuggestions: (array of objects with keys like name(string), age(string), role(string), habits(string), innerConflict(string), antagonistForce(string), gender(string), relevanceToAudience(string), motivations(array), skinTone(string), height(string), weight(string), hairTexture(string), hairLength(string), hairQuirk(string), facialHair(string), facialFeatures(string), motivations(array), personalityTraits(array), angst(string), backstory(string), weaknesses(array), strengths(array), coreValues(array), skills(array), speechPattern(string))
        settingSuggestions: (array of strings of suggestions for the story)

        Do not add any extra lines or text beyond the JSON response just the JSON or JavaScript array of objects. Adhere strictly to this format.
        `;
    

        const contextInfo = `
        ${suggestPlot ? '' : 'story idea: {storyIdea}'}
        genre: {genre}
        tone: {tone}
        thematic element & option: {thematicElement}
        suspense technique: {suspenseTechnique}
        suspense technique description: {suspenseTechniqueDescription}
        `;
    
        return `
        ${specificInstructions}
    
        ${commonInstructions}
    
        ${contextInfo}
        `.trim();
    }

    const saveStoryStarter = async (storyStarter) => {

        // try {
        //     let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch`;
        //     let currentStepUrl = storyBuilderSteps.find(storyBuilderStep => storyBuilderStep.step === currentFormStep );
        //     const response = await fetch(url, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${dynamicJwtToken}`
        //         },
        //         body: JSON.stringify({ 
        //             storyStarter: storyStarter, 
        //             currentStep: currentFormStep,
        //             currentStepUrl: currentStepUrl?.link,
        //         })
        //     });
        //     const json = await response.json();
        //     console.log(json);
            
        // } catch (error) {
        //     console.log(error);            
        // }
    }

    const handleThematicElementCheckboxChange = (e, element) => {
        const updatedCheckedThematicElements = [...thematicElements];
        
        if (e.target.checked) {
            // Add the checked item to the array
            updatedCheckedThematicElements.push(element.value);
        } else {
            // Remove the unchecked item from the array
            const index = updatedCheckedThematicElements.indexOf(element.value);
            if (index > -1) {
                updatedCheckedThematicElements.splice(index, 1);
            }
        }        

        // Update the state with the new checked items
        setThematicElements(updatedCheckedThematicElements);
    };
    
    const updateThematicOptions = (selectedThematicElement: string, selectedThematicOption: string) => {
        setThematicOptions(prevThematicOptions => 
            prevThematicOptions.map(item => {
                if (item.thematicElement === selectedThematicElement) {
                    return {
                        ...item,
                        thematicOption: selectedThematicOption
                    };
                }
                return item;
            })
        );
    }

    const updateSuspenseTechnique = (value) => {        
        let suspenseTechniqueResult = suspenseTechniques.find(suspenseTechnique => suspenseTechnique.value === value);
        setSuspenseTechnique(suspenseTechniqueResult);
        
        if (value && value !== '') {            
            toast.message(`${value}`, {
                description: `${suspenseTechniqueResult?.description}`,
            });
        }
    }   

    const validateForm = async () => {
        // if (!user) {
        //     setShowAuthFlow(true);   
        //     return; 
        // }

        const storyStarter: StoryStarterPayloadInterface = {
            thematicOptions,
            thematicElements,
            genres,
            suspenseTechnique,
            suspenseTechniqueDescription: suspenseTechnique?.description,
        }
        
        // Validate Story Starter Form
        let validated = validateStoryStarterForm(storyStarter);
        if (!validated) {
            return;
        }
        
        // setOpenStoryIdeaModal(true);

        // GENERATE SETTINGS AND PROTAGONISTS
        const response = await generateProtagonistSuggestions();
        if (!response) {
            return;
        }
        
        const storyProjectUpdated = await saveSetting(storyStarter, response)
    }

    const saveSetting = async (payload, response) => {
        const storyStarterSaved = await saveStory({ 
            storyStarter: {
                ...payload,
                protagonistSuggestions: response?.protagonistSuggestions,
                settingSuggestions: response?.settingSuggestions,
            }, 
            currentStep: 1,
            currentStepUrl: 'story-starter', //'story-plot' 
            storyId: data?.id
        });        

        if (!storyStarterSaved) {  
            toast.error("Try again please, network error");           
            return;
        }

        setStoryData(storyStarterSaved);       
        push(`/dashboard/story-project?current-step=story-plot&story-id=${data?.id}`);
    }

    const onExit = (val: any)=> {
        console.log(val);   
    }

    return (
        <>
            <div className='grid grid-cols-3 gap-5'>
                <div className='md:col-span-3 lg:col-span-3 xl:col-span-2'>                

                    <div className='my-5 genre-input'>
                        <p className='mb-2 text-sm font-semibold'>Genre (Max. 4)</p>
                        <MultipleSelector
                            maxSelected={4}
                            value={genres}
                            onChange={setGenres}
                            defaultOptions={storyGenres}
                            placeholder="Choose genres"
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                    no results found.
                                </p>
                            }
                            className='outline-none bg-white'
                        />
                    </div>

                    <div className='mb-10 thematic-element-input'>
                        <p className='mb-1 text-sm font-semibold'>Select Thematic Elements (Max. 4)</p>
                        <div className='grid grid-cols-2'>
                            {
                                thematicElementList.map((element, index) => (
                                    <div className="flex items-center gap-3 mb-2" key={index}>
                                        <input 
                                            type='checkbox' 
                                            className='' 
                                            value={element.value}
                                            checked={thematicElements.includes(element.value)}
                                            disabled={
                                                thematicElements.length >= 4 && !thematicElements.includes(element.value)
                                            }
                                            onChange={(e) => handleThematicElementCheckboxChange(e, element)}
                                            id={`${element.value}`}
                                        />
                                        <label htmlFor={`${element.value}`} className='text-xs'>{element.label}</label>
                                    </div>
                                ))
                            }                    
                        </div>
                    </div>

                    {
                        thematicOptions && thematicOptions.length > 0 &&
                        <div className='mb-10'>                        
                            {
                                thematicOptions.map(thematicOption => (
                                    <div key={thematicOption.thematicElement} className='mb-3'>
                                        <p className='mb-1 text-sm font-semibold'>Thematic Options for {thematicOption.thematicElement}</p>
                                        <ReusableCombobox
                                            options={thematicOption.options}
                                            placeholder="Select framework..."
                                            defaultValue={thematicOption.thematicOption}  // or { value: "next.js", label: "Next.js" }
                                            onSelect={(value) => updateThematicOptions(thematicOption.thematicElement, value)}
                                            className="my-custom-class w-full text-xs"
                                            emptyMessage="No framework found."
                                        />
                                    </div>
                                ))
                            }
                            
                        </div>
                    }

                    <div className='mb-5 suspense-technique-input'>
                        <p className='mb-1 text-sm font-semibold'>Suspense Technique</p>
                        {/* <ComboboxComponent 
                        value={suspenseTechnique} 
                        setValue={setSuspenseTechnique} 
                        label="Suspense Technique" 
                        data={suspenseTechniques} 
                        className='w-full'
                        // defaultValue={{ value: data?.suspenseTechnique, label: data?.suspenseTechnique }}
                        /> */}

                        <ReusableCombobox
                            options={suspenseTechniques}
                            placeholder="Select suspense technique..."
                            defaultValue={suspenseTechnique}  // or { value: "next.js", label: "Next.js" }
                            onSelect={(value) => updateSuspenseTechnique(value)}
                            className="my-custom-class w-full text-xs"
                            emptyMessage="No suspense technique found."
                        />
                    </div>

                    <div className="my-5">
                        { 
                            // !data?.overview &&
                            <div className="flex items-center gap-5">
                                {/* {
                                    // data?.storyStructure?.protagonistSuggestions && data?.storyStructure?.protagonistSuggestions?.length < 1 &&
                                    <Button 
                                    onClick={() => validateForm()}
                                    >
                                        Share Idea
                                        <ArrowRight className='w-4 h-4 ml-2'/>
                                    </Button>
                                } */}
                                {
                                    // data?.storyStructure?.protagonistSuggestions && data?.storyStructure?.protagonistSuggestions?.length > 0 && 
                                    // <Button onClick={() => setProtagonistSuggestionsModalOpen(true)} className='bg-blue-600'>
                                    //     View Suggestions
                                    //     <FilmIcon className='w-4 h-4 ml-2'/>
                                    // </Button>
                                }
                            </div>
                        }

                        {
                            !data?.genres &&
                            <Button 
                            onClick={() => validateForm()}
                            className='bg-custom_green'
                            >
                                Start Writing
                                <FilmIcon className='w-4 h-4 ml-2'/>
                            </Button>
                        }

                        {
                            data?.genres &&
                            <Button 
                            onClick={moveToSelectedPlot} 
                            className='bg-custom_green'
                            >
                                Continue
                                <FilmIcon className='w-4 h-4 ml-2'/>
                            </Button>
                        }
                    </div>
                </div>

                {/* <div className='flex items-center justify-center'>
                    { loadingPlotSuggestions && <i className='bx bx-loader-circle bx-spin bx-rotate-90 text-[12rem]' ></i> }            
                </div> */}
            </div>

            <Steps
                enabled={true}
                steps={storyStarterGuide}
                initialStep={0}
                onExit={onExit}
            />
        </>
    )
}

export default StoryStarterComponent
