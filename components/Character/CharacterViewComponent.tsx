"use client";

import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { CharacterInterface } from '@/interfaces/CharacterInterface';
import axios from 'axios';
import { updateCharacter } from '@/services/request';

interface CharacterViewComponentProps {
    character: CharacterInterface;
    onClickEvent:(character: CharacterInterface) => void;
    refetch: () => void;
}

const CharacterViewComponent: React.FC<CharacterViewComponentProps> = ({
    character,
    onClickEvent,
    refetch
}) => {
    
    const updateCharacterImage = async (character: CharacterInterface) => {
        try {
            let { 
                backstory, age, facialFeatures, 
                gender, skinTone, 
                height, weight, facialHair,
                hairTexture, hairLength, hairQuirk,
            } = character;

            const prompt = `ultra realistic photograph, profile shot or character headshot of a character and the character is facing the camera. Facial features: ${facialFeatures},  age: ${age},  gender: ${gender},  skin tone: ${skinTone}, backstory: ${backstory},`;             

            let res = await axios.post(
                `https://modelslab.com/api/v6/images/text2img`, 
                {
                    "key": process.env.NEXT_PUBLIC_STABLE_FUSION_API_KEY,
                    "model_id": "flux",
                    "prompt": prompt,
                    // "negative_prompt": "painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime",
                    "width": "512",
                    "height": "512",
                    "samples": "1",
                    "num_inference_steps": "30",
                    "seed": null,
                    "guidance_scale": 7.5,
                    "scheduler": "UniPCMultistepScheduler",
                    "webhook": null,
                    "track_id": null
                }, 
                {                    
                    headers: {
                        'Content-Type': 'application/json'
                    },                
                }
            );
            console.log(res?.data);
            console.log(res?.data?.output[0]);

            if (res?.data?.output[0]) {                
                let characterUpdated = await updateCharacter({
                    imageUrl: res?.data?.output[0],
                    storyId: character?.storyId
                }, character?.id);
            }

    
            refetch();
            
        } catch (error) {
            console.error(error);            
        }
    }

    return (
        <div className="responsive h-full " >            
            <div className='flex relative h-full flex-col shadow-xl overflow-y-clip rounded-xl bg-white'>
            <div className='relative overflow-hidden h-[300px]'>                    
                <Image
                fill={true}
                src={character?.imageUrl ?? '/user-image.jpeg'}
                alt={character?.name ?? 'character description'}                        
                className='w-full rounded-t-xl h-full object-cover object-center'                     
                loading="lazy"
                sizes="(max-width: 768px) 100%, (max-width: 1200px) 100%, 100%"
                />
            </div>
            <div className="h-1/2 p-4 flex flex-col  bg-gray-100 justify-between">
                <h2 className='font-semibold text-lg tracking-wider text-gray-800 text-center mb-2'>{character?.name}</h2>
                {/* <p className='text-lg text-gray-50 tracking-wider font-bold text-center mb-1'>{character?.name}</p> */}
                <p className='text-xs text-center text-gray-700'>
                    
                    {character.isProtagonist ? "Protagonist" : character.role}
                </p>                                          
                <Button 
                onClick={() => onClickEvent(character)}  className='bg-custom_green w-full mt-2'>Explore</Button>
                {/* <Button 
                onClick={() => updateCharacterImage(character)}
                className='bg-custom_green w-full mt-2'>Generate Image</Button> */}
            </div>

            </div>
        </div>
    )
}

export default CharacterViewComponent
