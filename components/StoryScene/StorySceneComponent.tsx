"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { PlusIcon, UserCircle } from 'lucide-react';
import { ChatOpenAI, DallEAPIWrapper } from "@langchain/openai";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { useParams } from 'next/navigation';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { getAuthToken } from "@dynamic-labs/sdk-react-core";

function StorySceneComponent() {

    const [story, setStory] = useState(null)
    const params = useParams<{ id: string }>() 
    const dynamicJwtToken = getAuthToken();
    
    const fetchStoryScene = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/${params.id}`;

            const response = await axiosInterceptorInstance.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${dynamicJwtToken}`
                    }
                }
            );
            console.log(response);
            if(response?.data){
                setStory(response?.data.story)
                return response?.data.story
            }
            return false;
            
        } catch (error) {
            console.log(error);
            return false;            
        }
    }
 
    useEffect(() => {
        fetchStoryScene()
    }, [])


    
    const updateCharacterImage = async (story, character) => {
        console.log({story, character});

        let prompt = await mergeStorytellingFormWithIdea(character, story.overview)
        
        const description = `${character.description}`
        const tool = new DallEAPIWrapper({
            n: 1, // Default
            model: "dall-e-3", // Default
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        });
        
        const imageURL = await tool.invoke(prompt);
        
        console.log(imageURL);
    }

    const mergeStorytellingFormWithIdea = async (character: Object, story: string) => {
        let { name, description, age, role } = character
        console.log({name, description, age, role});
        
        const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
        const llm = new ChatOpenAI({ 
            openAIApiKey,
            model: "gpt-4-vision-preview",        
        })
        const startingTemplate = `From the following description of a character: {prompt}. 
        Here is the story too: {story}
        characters name {character_name}
        characters description {character_description}
        characters age {character_age}
        characters role {character_role}
        Ensure the image relates to the story and the character's description, age and role.
        Generate an image description that is allowed for OPENAI's safety system so that it can be used to generate an image`;

        const startingPrompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a professional prompt generator and assistant"],
            ["human", startingTemplate],
        ]);
        const chain = startingPrompt.pipe(llm).pipe(new StringOutputParser());
        

        const response = await chain.invoke({
            prompt: prompt,
            story: story,
            character_name: name,
            character_age: age,
            character_description: description,
            character_role: role,
            
        });
        console.log(response);
        return response
        // const jsonObject = JSON.parse(response);
        // console.log(jsonObject);
    }  

    return (
        <>
            {story && <div className='px-20'>
                <h1 className="first-letter:text-6xl font-light text-2xl tracking-widest mb-2 capitalize">{story?.title}</h1>
                <div className="mb-4 text-gray-400 flex items-center gap-2">
                    <p className="font-bold text-sm uppercase">Genre:</p>
                    <p className="font-bold text-sm uppercase">{story?.genre}</p>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div className='col-span-1'>

                        <div className="rounded-xl bg-gray-50 p-5 mb-5">
                            <h1 className="font-bold text-xl mb-5">Overview</h1>
                                                        
                            <Image
                                src={story?.imageUrl ?? '/no-image.png'}
                                alt={story?.slug}
                                width={500}
                                height={500}
                                loading="lazy"
                                className=' w-52 h-52 rounded-xl xl:order-last'
                            />
                            <p className='text-sm mt-5 whitespace-pre-wrap'>{story?.overview}</p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-5">
                            <h1 className="font-bold text-xl mb-5">Scenes</h1>

                            {
                                story?.scenes?.map((scene, index) => (
                                    <div className='flex mb-4 gap-5 bg-white p-4' key={index}>
                                        {
                                            scene?.imageUrl &&
                                            <Image
                                                src={scene?.imageUrl}
                                                alt={`Scene ${index + 1}`}
                                                width={500}
                                                height={500}
                                                loading="lazy"
                                                className=' w-32 h-32 rounded-xl'
                                            />
                                        }
                                        {
                                            !scene?.imageUrl && 
                                            <Image
                                                src='/no-image.png'
                                                alt='No image'
                                                width={500}
                                                height={500}
                                                className=' w-32 h-32 rounded-xl'
                                            />
                                        }
                                        <p className='text-xs'>
                                            {scene?.content}
                                        </p>
                                    </div>
                                ))
                            }
                        </div>

                    </div>

                    <div className='col-span-1'>
                        <div className="rounded-xl bg-gray-50 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="font-bold text-xl mb-5">Cast</h1>
                                <Button className='bg-gray-300 text-black flex items-center gap-2 hover:bg-gray-400' >
                                    <PlusIcon className='w-4 h-4' />
                                    New Character
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">

                                {
                                    story?.characters?.map((character, index) => (
                                        <div onClick={() => updateCharacterImage(story, character)} className='rounded-xl bg-white p-5 cursor-pointer hover:border-gray-400 border transition-all' key={index}>
                                            <Image
                                                src={character?.imageUrl ?? '/no-image.png'}
                                                alt={character?.name}
                                                width={500}
                                                height={500}
                                                loading="lazy"
                                                className='w-full rounded-xl xl:order-last'
                                            />
                                            <p className="text-md mt-4 text-center first-letter:text-3xl font-light">
                                                {character?.name}
                                            </p>      
                                            <p className="text-sm mt-2 font-normal text-center">
                                                {character?.role}
                                            </p>       
                                            {/* <Button onClick={updateCharacterImage}>Generate</Button>     */}
                                        </div>
                                    ))
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default StorySceneComponent
