"use client";

import { StoryInterface, SuggestionItem } from '@/interfaces/StoryInterface';
import React, { useCallback, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { extractTemplatePrompts, queryLLM } from '@/services/LlmQueryHelper';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { Card, CardContent } from "@/components/ui/card";
import { CharacterInterface, SuggestedCharacterInterface } from '@/interfaces/CharacterInterface';
import { Input } from '@/components/ui/input';
import { Plus, Save, Trash2, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { ProtagonistInterface } from '@/interfaces/ProtagonistInterface';
import CharacterSuggestionsModal from '../CharacterSuggestionsModal';


interface AddProtagonistComponentProps {
    protagonistSuggestions: CharacterInterface[],
    openAddProtagonistModal: boolean;
    setOpenAddProtagonistModal: React.Dispatch<React.SetStateAction<boolean>>;   
    selectedProtagonist: [],
    setSelectedProtagonist: React.Dispatch<React.SetStateAction<[]>>;   
    newProtagonist: ProtagonistInterface[],
    setNewProtagonist: React.Dispatch<React.SetStateAction<ProtagonistInterface[]>>;    
    initialStory: StoryInterface;
    saveStory: (val: any) => null|object;
    refetch:() => void;
}

const AddProtagonistComponent: React.FC<AddProtagonistComponentProps> = ({
    protagonistSuggestions,
    openAddProtagonistModal,
    setOpenAddProtagonistModal,
    selectedProtagonist,
    setSelectedProtagonist,
    newProtagonist,
    setNewProtagonist,
    initialStory,
    saveStory,
    refetch,
}) => {
    
    const [openCharacterSuggestionsModal, setOpenCharacterSuggestionsModal] = useState<boolean>(false);
    const [additionalCharacterSuggestions, setAdditionalCharacterSuggestions] = useState<SuggestedCharacterInterface[]>([]);
    
    const addMoreProtagonist = () => {
        setNewProtagonist(prevProtagonists => [...prevProtagonists, { name: "", backstory: "" }])        
    }

    const removeProtagonist = (option: ProtagonistInterface) => {
        if (newProtagonist.length < 2) return;
        
        setSelectedProtagonist(prev => prev.filter(protagonist => protagonist.name !== option.name));
        setNewProtagonist(prev => prev.filter((protagonist: ProtagonistInterface) => protagonist.name !== option.name))         
    }

    const haveSuggestionBeenChecked = useCallback((suggestion: ProtagonistInterface) => {
        return selectedProtagonist.some(protagonist => protagonist.name === suggestion.name);
    }, [selectedProtagonist]);

    const handleSuggestionCheckboxChange = useCallback((suggestion: ProtagonistInterface, isChecked: boolean) => {
        if (isChecked) {
            setNewProtagonist(prevProtagonists => [...prevProtagonists, suggestion]);        
            setSelectedProtagonist(prev => [...prev, suggestion]);
        } else {
            setNewProtagonist(prevProtagonists => prevProtagonists.filter((protagonist: ProtagonistInterface) => protagonist.name !== suggestion.name));        
            setSelectedProtagonist(prev => prev.filter(protagonist => protagonist.name !== suggestion.name));
        }
    }, []);

    const validateNewProtagonists = () => {
        try {            
            let protagonistCount = newProtagonist.length;
    
            console.log(newProtagonist);
            let errorCount = 0;
            newProtagonist.forEach(protagonist => {
                if (protagonist.name === "" || !protagonist.name) errorCount += 1;        
                if (protagonist.backstory === "" || !protagonist.backstory) errorCount += 1;        
            });
            
            if (errorCount > 0) {
                toast.error(protagonistCount > 1 ? "Kindly provide a name & backstory for all protagonists" : "Kindly provide a name & backstory for the protagonist");        
                return false;
            }
            return true;
        } catch (error) {
            console.error(error);            
            return false;            
        }
    }

    const saveNewProtagonists = async () => {
        try {
            let validated = validateNewProtagonists();
            if (!validated) {
                return;
            }

            showPageLoader();

            // Get next question suggestions
            const response = await getProtagonistGoalSuggestions(newProtagonist);
            if (!response) {                
                return;
            }
            
            const storyStarterSaved = await saveStory({ 
                addProtagonist: {
                    protagonists: newProtagonist.map(protagonist => ({...protagonist, isProtagonist: true})), 
                    protagonistSuggestions,    
                    // protagonistGoalSuggestions: response.protagonistGoalSuggestions           
                }, 
                introductionStep: 2,
            });   

            if (!storyStarterSaved) {
                return;
            }

            if (response?.suggestedCharacters && response?.suggestedCharacters.length > 0) {                
                setAdditionalCharacterSuggestions(response?.suggestedCharacters);
                setOpenCharacterSuggestionsModal(true);
            }
    
            refetch();
            setOpenAddProtagonistModal(false);
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const getProtagonistGoalSuggestions = async (protagonists) => {
        let { genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(initialStory);

        let question = protagonists.length > 1 ? `What common goal do these characters share or what conflicts do they have with each other?` : `What does the character want? and Who has it`;
        let protagonistCount = protagonists.length;

        const prompt = `
        You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
        After introducing the protagonist, We currently trying to the next question in order to explore our character and the question is {question}, so you would generate at least 4 suggestions answers to the question. 
        Analyze the protagonist, genre, suspense technique, thematic element & option, and also ensure you suggestions relate to these information. 
        The suggestions should show the protagonist's motivations, desires, and relationships.
        We have {protagonistCount} protagonist(s): {protagonists}. If there is a need for new characters to support the protagonist's journey, kindly generate them. If no additional characters are needed, do not create any.

        Return your response in a JSON format with the following keys:
        - protagonistGoalSuggestions: an array of objects, each containing:
          - "whatTheyWant" (what the protagonist desires)
          - "whoHasIt" (who or what holds what they want)
        - suggestedCharacters: an array of objects with keys, this can be empty if there is no need to generate any characters:
          - "name" (character name)
          - "backstory" (backstory of the character)
          - "role" (role in the story, ensure its not a long role description, as single word if possible)
          - "relationshipToProtagonist" (the character's relationship to the protagonist)
          - "disabled" (boolean, should have false value always)
    
        Please ensure the only key in the object is the protagonistGoalSuggestions and suggestedCharacters key only.
        Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
        Ensure you response is a json object string, we need to avoid the SyntaxError: Unexpected token error after parsing the response.

        protagonists: {protagonists}
        question: {question}
        number of protagonist: {protagonistCount}
        genre: {genre}
        thematic element & option: {thematicElement}
        suspense technique: {suspenseTechnique}
        suspense technique description: {suspenseTechniqueDescription}
        `;
        
        const response = await queryLLM(prompt, {
            protagonistCount, 
            protagonists: protagonists.map((item) => `${item.name}: ${item.backstory}.`).join(" "),
            question,
            genre: genrePrompt,
            suspenseTechnique: initialStory.suspenseTechnique?.value,
            suspenseTechniqueDescription: initialStory.suspenseTechnique?.description,
            thematicElement: thematicElementsPrompt,
        });  
        
        if (!response) {
            toast.error("Try again there was an issue");        
            return false;
        }

        return response;
    }

    const setProtagonistBackstory = (backstory: string, protagonist: ProtagonistInterface) => {
        setNewProtagonist(prevProtagonists => 
            prevProtagonists.map(item => {
                if (item.name === protagonist.name) {
                    return { ...item, backstory };
                }
                return item;
            })
        );
    }

    const setProtagonistName = (name: string, protagonist: ProtagonistInterface) => {
        setNewProtagonist(prevProtagonists => 
            prevProtagonists.map(item => {
                if (item.name === protagonist.name) {
                    return { ...item, name };
                }
                return item;
            })
        );
    }

    return (
        <>        
            <Sheet open={openAddProtagonistModal} onOpenChange={setOpenAddProtagonistModal}>
                <SheetContent className="bg-[#cfead1] border border-[#cfead1] overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
                    <SheetHeader className=''>
                        <SheetTitle className='font-bold text-2xl mb-4'>Let's introduce the protagonist:</SheetTitle>
                        <SheetDescription className='text-black'>Protagonist Suggestions</SheetDescription>

                        <div className='mt-5'>
                            <div className='p-5 bg-gray-50 rounded-2xl'>
                                {
                                    initialStory?.introductionStep < 2 &&
                                    protagonistSuggestions?.map((suggestion, index) => (
                                        <div className="flex items-center gap-3 mb-2" key={index}>
                                            <input 
                                                type='checkbox' 
                                                className='' 
                                                value={suggestion.name}
                                                checked={haveSuggestionBeenChecked(suggestion)}
                                                onChange={(e) => handleSuggestionCheckboxChange(suggestion, e.target.checked)}
                                                id={`_${suggestion.name}_`}
                                            />
                                            <label htmlFor={`_${index}_`} className='text-xs'>{suggestion.name}: {suggestion.backstory} </label>
                                        </div>
                                    ))
                                }
                            </div>
            
                            <div className='my-7'>
                                <div className='mb-3'>
                                    <Button
                                    onClick={addMoreProtagonist}
                                    className='text-custom_green border-custom_green'
                                    variant='outline' size='sm'>
                                        <Plus className='w-3 h-3 mr-1' />
                                        Add More
                                    </Button>
                                </div>

                                {
                                    newProtagonist?.map((protagonist, key) => (
                                        <Card className='mb-4 relative' key={key}>
                                            <CardContent className="p-6">
                                                <div className="">
                                                    <div className='mb-3'>
                                                        <p className='text-xs mb-1 text-gray-500 font-semibold'>Name</p>
                                                        <Input value={protagonist.name} onChange={(e) => setProtagonistName(e.target.value, protagonist) } className='w-full outline-none text-xs'/>
                                                    </div>

                                                    <div className=''>
                                                        <p className='text-xs mb-1 text-gray-500 font-semibold'>Backstory</p>
                            
                                                        <Textarea value={protagonist.backstory} 
                                                        onChange={(e) => setProtagonistBackstory(e.target.value, protagonist)} 
                                                        onKeyUp={(e) => setProtagonistBackstory(e.target.value, protagonist)}
                                                        className='w-full outline-none text-xs'/>
                                                    </div>
                                                </div>


                                                <X onClick={() => removeProtagonist(protagonist)}                                                 
                                                className='absolute top-2 right-2 w-5 h-5 cursor-pointer'/>

                                            </CardContent>
                                        </Card>
                                    ))
                                }

                                <Button className='mt-1 bg-custom_green text-white' onClick={saveNewProtagonists}>
                                    Save 
                                    <Save className='ml-2 w-4 h-4 '/>
                                </Button>  
                            </div>    
            
                        </div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>   


            <CharacterSuggestionsModal 
            refetch={refetch}
                initialStory={initialStory}
                openCharacterSuggestionsModal={openCharacterSuggestionsModal}
                setOpenCharacterSuggestionsModal={setOpenCharacterSuggestionsModal}
                setAdditionalCharacterSuggestions={setAdditionalCharacterSuggestions}
                additionalCharacterSuggestions={additionalCharacterSuggestions}
            />
            
        </>
    )
}

export default AddProtagonistComponent
