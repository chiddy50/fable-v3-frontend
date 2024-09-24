"use client";

import { StoryInterface } from '@/interfaces/StoryInterface';
import React, { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { charactersToString, extractTemplatePrompts, queryLLM, threeActStructureDefinition } from '@/services/LlmQueryHelper';


interface ModifyIncitingEventComponentProps {
    openModifyIncitingEventModal: boolean;
    setOpenModifyIncitingEventModal: React.Dispatch<React.SetStateAction<boolean>>;    
    selectedIncitingEvent: string[];
    setSelectedIncitingEvent: React.Dispatch<React.SetStateAction<string[]>>;
    incitingEventSuggestions: string[];
    setIncitingEventSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
    initialStoryData: StoryInterface;
    saveStory: (val: any) => null|object;
}

const ModifyIncitingEventComponent: React.FC<ModifyIncitingEventComponentProps> = ({
    openModifyIncitingEventModal,
    setOpenModifyIncitingEventModal,
    selectedIncitingEvent,
    setSelectedIncitingEvent,
    incitingEventSuggestions,
    setIncitingEventSuggestions,
    initialStoryData,
    saveStory
}) => {
    const [newIncitingEvent, setNewIncitingEvent] = useState<string>("");
    const [error, setError] = useState<string>("");

    const { refresh } = useRouter();

    const applyIncitingEventModification = async () => {
        try {
            let { expositionPrompt, hookPrompt, genrePrompt, thematicElementsPrompt } = extractTemplatePrompts(initialStoryData);

            // const startingTemplate = `
            //     You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
            //     Based on the three act structure, we need to incorporate some inciting events into a story and then generate some first plot point's. Based on the plot, story title, exposition, hooks, genre, suspense technique, thematic element, and thematic option provided, analyze the all this information then try to incorporate the inciting events into the story and generate some options for our first plot point's to carry our story further without changing the narrative:
    
            //     - **The Hook**: Identify the most intriguing aspect of the story that will grab the audience's attention immediately, lets give the audience a reason to keep watching. 
            //     - **The Inciting Event**: the inciting event is the catalyst that sets the story in motion, triggering a chain of events that drives the plot forward and propels the main characters towards the climax.
            //     The inciting event is typically the first dramatic turning point in the story, and it raises the stakes for the characters, setting the tone for the rest of the narrative. It's often a key event that challenges the status quo, disrupts the characters' normal way of life, or sets them on a collision course with their goals.
                                
            //     You would create or extract at least 4 new characters from the additional hooks, and all the inciting events are going to be summarized and finally used to generate first plot point's and a new plot.  
            //     Return your response in a json or javascript object format like: newPlot(string, this will be a new plot), incitingEventSummary(string), firstPlotPoint(array), firstPlotPointSuggestions(array, this refers to suggestions for the first plot point), firstPlotPointSummary(string) and characters(array of objects with keys like name(string), role(string), motivations(array), personalityTraits(array), backstory(string), weaknesses(array), strengths(array), coreValues(array) and relationshipsWithOtherCharacters(array of object. This is the characters relationship to other characters, with two keys like characterName which is a string and relationship which is a string)) as keys. Please ensure the only keys in the objects are newPlot, incitingEventSummary, firstPlotPoint, firstPlotPointSuggestions, firstPlotPointSummary and characters only.
            //     Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
            //     exposition: {exposition}
            //     hooks: {hook}
            //     inciting event: {incitingEvent}
            //     plot: {storyPlot}
            //     story title: {storyTitle}
            //     genre: {genre}
            //     thematic element & option: {thematicElement}
            //     suspense technique: {suspenseTechnique}
            //     suspense technique description: {suspenseTechniqueDescription}
            // `;

            // const startingTemplate = `
            //     You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.

            //     Based on the plot, story title, exposition, hooks, genre, suspense technique, thematic element, and thematic option provided, analyze the story plot exposition & hooks. Incorporate the hooks into the story without changing the narrative, using the three-act structure.

            //     ${threeActStructureDefinition}

            //     Generate a story using the three-act structure to analyze and create inciting events for the plot. You would create or extract at least 4 new characters from the additional hooks, and all the hooks are summarized and used to generate inciting events that align with each act.

            //     Return your response in a json or javascript object format like:
                
            //     - newPlot(string, this will be a new plot)
            //     - hookSummary(string)
            //     - incitingEvents(array)
            //     - incitingEventSuggestions(array, suggestions for inciting events across the acts)
            //     - incitingEventSummary(string)
            //     - characters(array of objects with keys like name(string), role(string), motivations(array), personalityTraits(array), backstory(string), weaknesses(array), strengths(array), coreValues(array) and relationshipsWithOtherCharacters(array of object with characterName (string) and relationship (string)))

            //     Please ensure the only keys in the object are newPlot, hookSummary, incitingEvents, incitingEventSuggestions, incitingEventSummary, and characters only.
            //     Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   

            //     plot: {storyPlot}
            //     genre: {genre}
            //     exposition: {exposition}
            //     hook: {hook}
            //     inciting event: {incitingEvent}
            //     story title: {storyTitle}
            //     thematic element & option: {thematicElement}
            //     suspense technique: {suspenseTechnique}
            //     suspense technique description: {suspenseTechniqueDescription}
            // `;
            // console.log(startingTemplate);
            // return;

            showPageLoader();

            // const response = await queryLLM(startingTemplate, {
            //     exposition: expositionPrompt,
            //     hook: hookPrompt,
            //     incitingEvent: selectedIncitingEvent.map(event => event).join(" "),
            //     genre: genrePrompt,
            //     thematicElement: thematicElementsPrompt,
            //     storyTitle: initialStoryData.title,
            //     storyPlot: initialStoryData.overview,
            //     suspenseTechnique: initialStoryData.suspenseTechnique?.value,
            //     suspenseTechniqueDescription: initialStoryData.suspenseTechnique?.description,
            // });

            const storyStarterSaved = await saveStory({ 
                updateIncitingEvent: {
                    incitingEvent: selectedIncitingEvent,
                    incitingEventSuggestions: incitingEventSuggestions
                }
            });   

            setOpenModifyIncitingEventModal(false);
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const createIncitingEvent = async () => {
        try {
            let { expositionPrompt, hookPrompt, genrePrompt, thematicElementsPrompt, incitingEventPrompt } = extractTemplatePrompts(initialStoryData);
    
            setError("");
    
            const startingTemplate = `
                You are a professional storyteller, author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic.        
                A new inciting event which is {incitingEvent} is being added to the existing inciting event of the story, analyze the story plot, title, exposition, hook, genre, suspense technique, thematic element, and thematic option provided then try to incorporate the new inciting event {incitingEvent} into the story without changing the narrative:
                
                Ensure the new inciting event or inciting incident answers at least one of the following questions:
                How does the Inciting Incident disrupt the protagonist’s ordinary world and challenge their initial goal?
                What problem or conflict is introduced, and who or what is the source of it?
                How does the protagonist react emotionally to the event, and do they immediately recognize its importance?
                How does this event complicate or raise the stakes established in the introduction?
                Does the Inciting Incident introduce the antagonist or opposing force?
                What new goal, mission, or obstacle is created for the protagonist as a result?
                What irreversible decision or action does the protagonist take in response to it?
                How does the Inciting Incident reinforce the tone and genre of the story?
                How does it connect to or hint at the story’s theme and protagonist’s internal struggle?
                What immediate consequences follow, and how does it propel the plot forward or raise the stakes?

                However, if the inciting event which is {incitingEvent} does not make sense or is not a valid inciting event, return a message indicating what is wrong with the inciting event or sentence. For example, you could say something like:
                - "I'm not sure what you mean by '{incitingEvent}'. Could you please rephrase it?".
                - " '{incitingEvent}' doesn't seem to fit with the existing inciting event. Could you provide more context?".
                - "I'm not familiar with the term '{incitingEvent}'. Could you define it?".
                These should be inside the reason string in the response.
                On the other hand, if the inciting event is valid and fits into the story's narrative, proceed to incorporate it into the story's inciting event as usual.
    
                Return your response in a json or javascript object format like: 
                valid(boolean, true if it is valid & false if it is not), 
                newIncitingEvent(string, this should contain only the newly added {incitingEvent} and if there are any grammatical errors, kindly correct it) and reason(string, this is the reason it is not a valid inciting event if it is not) as keys. 
                Please ensure the only keys in the objects are valid, newIncitingEvent and reason only.
                Do not add any text extra line or text with the json response, just a json or javascript object no acknowledgement or saying anything just json. Do not go beyond this instruction.                   
                new inciting event: {incitingEvent}
                plot: {storyPlot}
                characters: {characters}
                story title: {storyTitle}
                genre: {genre}
                thematic element & option: {thematicElement}
                suspense technique: {suspenseTechnique}
                suspense technique description: {suspenseTechniqueDescription}
            `;
    
            showPageLoader();

            const response = await queryLLM(startingTemplate, {
                incitingEvent: newIncitingEvent,
                genre: genrePrompt,
                characters: charactersToString(initialStoryData),
                thematicElement: thematicElementsPrompt,
                storyTitle: initialStoryData.title,
                storyPlot: initialStoryData.overview,
                suspenseTechnique: initialStoryData.suspenseTechnique?.value,
                suspenseTechniqueDescription: initialStoryData.suspenseTechnique?.description,
            });
    
            if (!response) {
                return;
            }
    
            if (!response?.valid) {
                setError(response?.reason);
            }else{
                setIncitingEventSuggestions(item => [...item, newIncitingEvent]);
            }
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader();
        }
    }

    const haveIncitingEventBeenChecked = (event: string): boolean => {
        return selectedIncitingEvent.includes(event);
    };

    const handleIncitingEventCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, incitingEvent: string) => {
        
        const updatedCheckedIncitingEvent = [...selectedIncitingEvent];
        
        if (e.target.checked) {
            // Add the checked item to the array
            updatedCheckedIncitingEvent.push(incitingEvent);
        } else {
            // Remove the unchecked item from the array
            const index = updatedCheckedIncitingEvent.indexOf(incitingEvent);
            if (index > -1) {
                updatedCheckedIncitingEvent.splice(index, 1);
            }
        }                
        // Update the state with the new checked items
        setSelectedIncitingEvent(updatedCheckedIncitingEvent);
    };

    return (
        <Sheet open={openModifyIncitingEventModal} onOpenChange={setOpenModifyIncitingEventModal}>
            <SheetContent className="overflow-y-scroll md:min-w-[96%] lg:min-w-[60%]">
                <SheetHeader className=''>
                    <SheetTitle className='font-bold text-2xl'>Let's modify the inciting event of the story:</SheetTitle>
                    <SheetDescription className=''></SheetDescription>
                    
                    <div className=''>
                        <p className='text-sm font-bold mb-2 text-gray-500 italic'>Inciting Event Suggestions:</p>
                        <div className='mb-7'>
                            <Textarea 
                            value={newIncitingEvent}
                            onChange={e => setNewIncitingEvent(e.target.value)}
                            className='flex-1 text-black mb-3'
                            placeholder='Add more inciting events...'/>
                            <div>
                                <p className='text-xs text-red-600'>{error || ''}</p>
                            </div>
                            <Button className='mt-1' onClick={createIncitingEvent}>Add</Button>
                        </div>
                        <div className='my-3'>
       
                            {
                                incitingEventSuggestions.map((event, index) => (
                                    <div className="flex items-center gap-3 mb-2" key={index}>
                                        <input 
                                            type='checkbox' 
                                            className='' 
                                            value={event}
                                            checked={haveIncitingEventBeenChecked(event)}
                                            onChange={(e) => handleIncitingEventCheckboxChange(e, event)}
                                            id={`_${index}_`}
                                        />
                                        <label htmlFor={`_${index}_`} className='text-xs'>{event}</label>
                                    </div>
                                ))
                            }
                        </div>                                                    

                        <Button onClick={applyIncitingEventModification}>Save</Button>


                    </div>
                </SheetHeader>  
            </SheetContent>
        </Sheet>  
    );
}

export default ModifyIncitingEventComponent
