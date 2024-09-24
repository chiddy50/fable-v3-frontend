"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Frame } from '@gptscript-ai/gptscript'
import { toast } from 'sonner'
import renderEventMessage from '@/lib/renderEventMessage'
import { hidePageLoader, showPageLoader } from '@/lib/helper'
import { ComboboxComponent } from '@/components/combobox-component'
import { storyGenres } from '@/lib/data'
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";


function CreateStorySceneComponent() {
    const [story, setStory] = useState<string>("");
    const [genre, setGenre] = useState<string>("");
    const [progress, setProgress] = useState("");
    const [currentTool, setCurrentTool] = useState("");
    const [runStarted, setRunStarted] = useState<boolean>(false);
    const [runFinished, setRunFinished] = useState<boolean | null>(null);
    const [events, setEvents] = useState<Frame[]>([]);
    const [storyGenerated, setStoryGenerated] = useState<boolean>(false);
    
    const router = useRouter();
    const dynamicJwtToken = getAuthToken();
    const { user, setShowAuthFlow } = useDynamicContext();
    
    const storiesPath = `public/scenes/${user?.email}`;

    const runScript = async () => {
        if (!user) {
            setShowAuthFlow(true);
            return;
        }

        setRunStarted(true);
        setRunFinished(false)        

        try {            
            const response = await fetch("/api/create-story-scene-script", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ story, genre, path: storiesPath })
            })

            if (response.ok && response.body) {
                setStoryGenerated(true)
                console.log('streaming has started');            

                const reader = response.body.getReader()
                const decoder = new TextDecoder()

                handleStream(reader, decoder)
                
            }else{
                setRunStarted(false)
                setRunFinished(true)
                console.error('Failed to start streaming');            
            }
        } catch (error) {
            console.error(error);            
        }finally{
            setRunStarted(false)
            setRunFinished(true)
        }
    }

    const saveStoryScenes = async () => {
        try {
            const response = await fetch("/api/save-story-scenes", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dynamicJwtToken, email: user?.email })
            });
            const json = await response.json();
            console.log(json);
            
        } catch (error) {
            console.log(error);            
        }
    }

    const handleStream = async (reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder) => {
        // Manage the stream from api...
        showPageLoader()
        while (true) {
            const { done, value } = await reader.read();
            
            if(done) {
                console.log({done});
                await saveStoryScenes();

                hidePageLoader()
                
                console.log("STORY HAS BEEN GENERATED AND BREAKING OUT OF INFINITE LOOP", {storyGenerated});                
                // saveStories()
                toast.success("Story generated successfully!", {
                    action: (
                        <Button
                        onClick={() => router.push("/story-scenes")}
                        className='bg-blue-500 ml-auto'
                        >
                            View Stories
                        </Button>
                    )
                });
                break;
            }; // break out of the infinity loop

            // Explanation: the decoder is used to decode the Unit8Array into a string
            const chunk = decoder.decode(value, { stream: true });

            // Explanation: We split the chunk into events by splitting it by the event: keyword
            const eventData = chunk
            .split("\n\n")
            .filter((line) => line.startsWith("event: "))
            .map((line) => line.replace(/^event: /, ""));

            // Explanation: We parse the json data and update the state accordingly
            eventData.forEach(data => {
                try {
                    console.log(data);
                    const parsedData = JSON.parse(data)
                    console.log(parsedData);
                    
                    if (parsedData.type === "callProgress") {
                        setProgress(
                            parsedData.output[parsedData.output.length - 1].content
                        );
                        setCurrentTool(parsedData.tool?.description || "");
                    }else if (parsedData.type === "callStart") {
                        setCurrentTool(parsedData.tool?.description || "");
                    }else if (parsedData.type === "runFinish") {
                        setRunFinished(true);
                        setRunStarted(false);
                    } else {
                        setEvents((prevEvents) => [...prevEvents, parsedData]);
                    }
                } catch (error) {
                    console.error("Failed to parse json", error);                        
                }
            });

        }
    }

    return (
        <div className='flex flex-col container w-1/2'>
            <section className='flex-1 flex flex-col border border-gray-300 rounded-md p-10 space-y-2'>
                <textarea 
                value={story}
                onChange={e => setStory(e.target.value)}
                className=' text-black outline-none border rounded-lg p-5 text-sm'
                placeholder='Write a story about a robot and a human who become friends...'
                />

                <ComboboxComponent value={genre} setValue={setGenre} label="Genre" data={storyGenres} className='w-full' />

                <Button onClick={runScript} disabled={!story || !genre || runStarted} className='w-full' size='lg'>
                    Generate
                </Button>

                <Button onClick={saveStoryScenes}>Test</Button>

            </section>
        
        </div>
    )
}

export default CreateStorySceneComponent
