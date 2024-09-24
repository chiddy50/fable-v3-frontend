"use client";

import React, { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Frame } from '@gptscript-ai/gptscript'
import renderEventMessage from '@/lib/renderEventMessage'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { hidePageLoader, showPageLoader } from '@/lib/helper'
import { Input } from "@/components/ui/input"
import { getAuthToken, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ComboboxComponent } from '@/components/combobox-component';
import { storyGenres } from '@/lib/data'


function CreateStoryBookComponent() {
    const [story, setStory] = useState<string>("")
    const [pages, setPages] = useState<number>()
    const [genre, setGenre] = useState<string>("")
    const [progress, setProgress] = useState("")
    const [currentTool, setCurrentTool] = useState("")
    const [runStarted, setRunStarted] = useState<boolean>(false)
    const [runFinished, setRunFinished] = useState<boolean | null>(null)
    const [storyGenerated, setStoryGenerated] = useState<boolean>(false)

    const [events, setEvents] = useState<Frame[]>([])
    const router = useRouter();
    const dynamicJwtToken = getAuthToken();

    const { user, setShowAuthFlow } = useDynamicContext();

    const runScript = async () => {

        if (!user) {
            setShowAuthFlow(true);
            return;
        }

        setRunStarted(true);
        setRunFinished(false);

        const storiesPath = `public/books/${user?.email}`;
        
        try {            
            const response = await fetch("/api/run-script", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    story, 
                    pages, 
                    genre: genre?.value, 
                    path: storiesPath 
                })
            });

            if (response.ok && response.body) {
                setStoryGenerated(true);
                console.log('streaming has started');            

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                handleStream(reader, decoder);
                
            }else{
                setRunStarted(false)
                setRunFinished(true)
                console.error('Failed to start streaming');            
            }
        } catch (error) {
            console.error(error);            
        }finally{
            setRunStarted(false)
            setRunFinished(true);
            hidePageLoader();
        }
    }

    const saveStoryBooks = async () => {
        try {
            const response = await fetch("/api/save-story-books", {
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
                await saveStoryBooks();
                hidePageLoader()
                
                console.log("STORY HAS BEEN GENERATED AND BREAKING OUT OF INFINITE LOOP", {storyGenerated});                
                // saveStories()
                toast.success("Story generated successfully!", {
                    action: (
                        <Button
                        onClick={() => router.push("/story-books")}
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

    const test = async () => {
        try {            
            const response = await fetch("/api/test", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify({ story, pages, path: storiesPath })
            })            
            
            if (response.ok && response.body) {
                const data = await response.json()
                console.log(data);
                console.log('SUCCESS');            
                
            }else{
                console.error('Failed');            
            }
        } catch (error) {
            console.error(error);            
        }
    }

    return (
        <div className='flex flex-col container'>
            <section className='flex-1 flex flex-col border border-blue-300 rounded-md p-10 space-y-2'>
                <Textarea 
                value={story}
                onChange={e => setStory(e.target.value)}
                className='flex-1 text-black'
                placeholder='Write a story about a robot and a human who become friends...'/>
                
                <Select onValueChange={value => setPages(parseInt(value))}>
                    <SelectTrigger>
                        <SelectValue placeholder='How many pages should the story be?' />
                    </SelectTrigger>
                    <SelectContent className='w-full'>
                        {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem value={String(i + 1)} key={i}>{i + 1}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* <Input placeholder="Genre" value={genre}
                onChange={e => setGenre(e.target.value)}/> */}

                <ComboboxComponent value={genre} setValue={setGenre} label="Genre" data={storyGenres} className='w-full' />

                <Button onClick={runScript} disabled={!story || !pages || !genre || runStarted} className='w-full' size='lg'>
                    Generate Story
                </Button>
                <Button onClick={saveStoryBooks}>Test</Button>
            </section>

            <section className='flex-1 pb-5 mt-5'>
                <div className='flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-mono p-10 h-96 overflow-y-auto'>
                    <div>
                        {runFinished === null && (
                            <>
                                <p className='animate-pulse mr-5 text-xs'>Im waiting for you to Generate a story above...</p>
                                <br />
                            </>
                        )}
                        
                        <span className='mr-5'>{">>"}</span>
                        {progress}

                    </div>

                    {/* Current tool */}
                    { currentTool && (
                        <div className='py-10'>
                            <span className='mr-5'>{"--- [Current Tool] ---"}</span>
                            {currentTool}
                        </div>
                    )}

                    {/* Render Events */}
                    <div className='space-y-5'>
                        {events.map((event, index) => (
                            <div key={Math.random() + index * 9999999}>
                                <span className='mr-5'>{">>"}</span>
                                {renderEventMessage(event)}
                            </div>
                        ))}
                    </div>

                    {runStarted && (
                        <div>
                            <span className='mr-5 animate-in'>
                                {"--- [Fable AI Storyteller Has Started] ---"}
                            </span>
                            <br />
                        </div>
                    )}
                </div>

            </section>
        </div>
    )
}

export default CreateStoryBookComponent
