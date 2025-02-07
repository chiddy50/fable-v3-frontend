"use client";

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, Suspense, useRef, useEffect, ChangeEvent } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useQuery } from '@tanstack/react-query';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Download, ImageIcon, Users } from 'lucide-react';
import axios from 'axios';
import { queryLLM, streamLLMResponse } from '@/services/LlmQueryHelper';
import { ChatGroq } from '@langchain/groq';
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { toast } from 'sonner';
import { hidePageLoader, isValidSolanaAddress, shareStory, showPageLoader } from '@/lib/helper';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import * as animationData from "@/public/animations/balloons.json"
import Lottie from 'react-lottie';
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label'
import { Slider } from "@/components/ui/slider"

const inter = Inter({ subsets: ['latin'] });


const CHAPTER_IMAGE_MAP = {
    introduction: 'introductionImage',
    incitingIncident: 'incitingIncidentImage',
    firstPlotPoint: 'firstPlotPointImage',
    risingActionAndMidpoint: 'risingActionAndMidpointImage',
    pinchPointsAndSecondPlotPoint: 'pinchPointsAndSecondPlotPointImage',
    climaxAndFallingAction: 'climaxAndFallingActionImage',
    resolution: 'resolutionImage'
} as const;
  
type ChapterKey = keyof typeof CHAPTER_IMAGE_MAP;

const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
};

function MyComponent() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectSummaryPage />
      </Suspense>
    );
}

const ProjectSummaryPage = () => {
    const [story, setStory] = useState<StoryInterface|null>(null)
    const [charactersModalOpen, setCharactersModalOpen] = useState<boolean>(false);
    const [generating, setGenerating] = useState<boolean>(false);
    const [storyOverview, setStoryOverview] = useState<string>(story?.overview ?? "");
    const [depositAddress, setDepositAddress]= useState<string>('');    
    const [tipLink, setTipLink]= useState<string>('');  
    const [isFree, setIsFree] = useState<boolean>(false);
    const [price, setPrice] = useState<number>(0);  
    const [paidStoryTransaction, setPaidStoryTransaction] = useState(null)
    // const [price, setPrice] = useState<number[]>([0]);  

    const [mounted, setMounted] = useState<boolean>(false);
    const [openAddAddressModal, setOpenAddAddressModal] = useState<boolean>(false);
    const [isPublished, setIsPublished] = useState<boolean>(false);

    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true)
        // if(mounted && accessRecord?.hasAccess === false){
        //     const { button } = code.elements.create('button', {
        //         currency: 'usd',
        //         destination: depositAddress,
        //         amount: 0.05,
        //         // idempotencyKey: `${story?.id}`,
        //     });
        
        //     if (button 
        //         // && story
        //     ) {   
        //         console.log({el});
                
        //         button?.mount(el?.current!);

        //         button?.on('invoke', async () => {
        //             // Get a payment intent from our own server
        //             let url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/create-intent/${story?.id}`;
            
        //             const res = await fetch(url, {
        //                 method: 'POST',
        //                 headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': `Bearer ${dynamicJwtToken}`,
        //                 },
        //                 body: JSON.stringify({
        //                     narration: "Read Story",
        //                     type: "read-story",
        //                     depositAddress
        //                 })
        //             });
                        
        //             const json = await res.json();
        //             console.log(json);
        //             const clientSecret = json?.data?.clientSecret;
                    
        //             if (clientSecret) {
        //                 button.update({ clientSecret });                    
        //             }              
        //         });            
        
        //         button?.on('success', async (event) => {

        //             console.log("==PAYMENT SUCCESSFUL EVENT===", event);
                    
        //             if (event) {
        //                 const { amount, clientSecret, currency, destination, locale, mode } = event?.options;
        //                 const intent = event?.intent;
                        
        //                 if (!story?.isPaid) {            
        //                     let response = await makeRequest({
        //                         url: `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/confirm/${intent}`,
        //                         method: "POST", 
        //                         body: {
        //                             storyId: story?.id,
        //                             amount, clientSecret, currency, destination, locale, mode,
        //                             type: 'read-story'
        //                         }, 
        //                         token: dynamicJwtToken,
        //                     });

        //                     if (response) {
        //                         refetch();
        //                     }
        //                 }
        //             }
                    
        //             return true; // Return true to prevent the browser from navigating to the optional success URL provided in the confirmParams
        //         });
        
        //         button?.on('cancel', async (event) => {
        //             // Handle cancelled payment, the intent ID will be provided in the event object
        //             console.log("==PAYMENT CANCELLED EVENT===", event);
        //             if (event) {
        //                 const { amount, clientSecret, currency, destination, locale, mode } = event?.options;
        //                 const intent = event?.intent;

        //                 let response = await makeRequest({
        //                     url: `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/${intent}`,
        //                     method: "DELETE", 
        //                     body: {
        //                         storyId: story?.id,
        //                         amount, clientSecret, currency, destination, locale, mode
        //                     }, 
        //                     token: dynamicJwtToken,
        //                 });
            
        //             }
        //             return true; // Return true to prevent the browser from navigating to the optional cancel URL provided in the confirmParams
        //         });
        //     }
        // }

    }, [mounted]);

    useEffect(() => {
        setStoryOverview(story?.overview ?? "");
    }, [story]);
    const storyId = useSearchParams().get('story-id');
    // const dynamicJwtToken = getAuthToken();

    const { push } = useRouter()
 
    const { data: storyData, isFetching, isError, refetch } = useQuery({
        queryKey: ['storyFromScratchFormData', storyId],
        queryFn: async () => {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/from-scratch/${storyId}`;
    
            const response = await axiosInterceptorInstance.get(url);
            if (response?.data?.story) {
                
                setPaidStoryTransaction(response?.data?.paidStoryTransaction);
                setStory(response?.data?.story);
                setDepositAddress(response?.data?.story?.user?.depositAddress)
                setTipLink(response?.data?.story?.user?.tipLink);
                const defaultPrice = response?.data?.story?.price ? response?.data?.story?.price : 0;
                setPrice(defaultPrice);
                setIsFree(response?.data?.story?.isFree)
            }
            return response?.data?.story;
        },
        enabled: !!storyId && !story
    });

    const extractProtagonistFeatures = () => {
        let protagonistFeatures = ``;

        storyData.protagonistSuggestions.forEach(protagonist => {
            protagonistFeatures += `Name: ${protagonist.name}. Facial features: ${protagonist?.facialFeatures}. skills: ${protagonist.skills}
            Facial hair: ${protagonist.facialHair}. Age: ${protagonist.age}. Skin tone: ${protagonist.skinTone}. Weight: ${protagonist.weight}.
            Cloth description: ${protagonist.clothDescription}. Hair length: ${protagonist.hairLength}. 
            Hair quirk: ${protagonist.hairQuirk}. Hair texture: ${protagonist.hairTexture}. Role: ${protagonist.role}.
            Height: ${protagonist.height}.
            `;
        });
        return protagonistFeatures;
    }

    const generateBanner = async () => {

        try {
            showPageLoader();
            let prompt = await getGenerationPrompt()

            if (!prompt) {
                return;
            }
            
            showPageLoader();
            let res = await axios.post(
                // `https://modelslab.com/api/v6/images/text2img`, 
                `https://modelslab.com/api/v6/realtime/text2img`,
                {
                    "key": process.env.NEXT_PUBLIC_STABLE_FUSION_API_KEY,
                    "model_id": process.env.NEXT_PUBLIC_IMAGE_MODEL ?? "flux",
                    "prompt": `ultra realistic photograph ${prompt}`,
                    "negative_prompt": "painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime",
                    "width": "1288",
                    "height": "768",
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
            console.log(res);
            console.log(res?.data?.output?.[0]);

            if (res.data.status !== "success") {
                // Handle failure
                saveChapterBanner({
                    imageId: res?.data?.id?.toString(),
                    imageStatus: res.data.status,
                    imgUrl: null,
                });
                return;
            }

            let imgUrl = res?.data?.output?.[0] ?? res?.data?.proxy_links?.[0] ?? res?.data?.future_links?.[0];
            if (!imgUrl) {
                toast.error("Unable to generate image banner");
                return;
            }


            await saveChapterBanner({
                imgUrl,
                imageStatus: res?.data?.status,
                imageId: storyData?.imageId
            });
            
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
            refetch()
        }
    }

    const getGenerationPrompt = async () => {
        try {
            showPageLoader();
            
            const protagonistFeatures = extractProtagonistFeatures();
    
            const prompt = `
            Analyze the following chapters of a story and a story idea and generate a prompt that can be used to create an image banner that visually represents the story. Ensure the image captures a sense of motion and involves actions from the characters. 
            The following sections of the story have already been generated:
            - The introduction (Chapter 1): {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident (Chapter 2): {incitingIncident}
            - First Plot Point (Chapter 3): {firstPlotPoint}
            - Rising Action & Midpoint (Chapter 4): {risingActionAndMidpoint}
            - Pinch Points & Second Plot Point (Chapter 5): {pinchPointsAndSecondPlotPoint}
            - Climax and Falling Action (Chapter 6): {climaxAndFallingAction}
            - Resolution & Epilogue: (Chapter 7) {resolution}

            Here are the physical details of the protagonist(s): {protagonistFeatures}.
            Use the physical details to represent the character(s).

            Analyze the chapters one after the order and come up with a fitting movie or story banner that describes the story.
            Return a simple description that includes dynamic elements and character activity, avoiding titles, subtitles, or any unwanted symbols—just a detailed image description.

            **INPUT**
            story idea: {storyIdea}`;
    
            const llm = new ChatGroq({
                apiKey: "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", //process.env.NEXT_PUBLIC_GROQ_API_KEY,
                // model: "llama-3.1-70b-versatile",
                model: "llama3-70b-8192",
                // model: "3.1-8b-instant",  // "llama3-70b-8192",
            });
            
            const startingPrompt = ChatPromptTemplate.fromMessages([
                ["system", "You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also an expert at answering any question directly even if its not related to storytelling. And you always follow instruction"],
                ["human", prompt],
            ]);
            
            const chain = startingPrompt.pipe(llm).pipe(new StringOutputParser());
            
            const response = await chain.invoke({
                storyIdea: story?.projectDescription,
                introduceProtagonistAndOrdinaryWorld: story?.storyStructure?.introductionSummary,
                incitingIncident: story?.storyStructure?.incitingIncidentSummary,
                firstPlotPoint: story?.storyStructure?.firstPlotPointSummary,
                risingActionAndMidpoint: story?.storyStructure?.risingActionAndMidpointSummary,
                pinchPointsAndSecondPlotPoint: story?.storyStructure?.pinchPointsAndSecondPlotPointSummary,
                climaxAndFallingAction: story?.storyStructure?.climaxAndFallingActionSummary,    
                resolution: story?.storyStructure?.resolutionSummary,    
                protagonistFeatures                             
            });
            return response;
        } catch (error) {
            console.error(error);  
            hidePageLoader()

        }finally{
            hidePageLoader()
        }
    }

    const unpublishStory = async () => {
        if (paidStoryTransaction) {
            toast.error("A user has already paid for this content");
            return;
        }
        await proceedRequest();        
    }

    const publishStory = async () => {
        if (!isValidSolanaAddress(depositAddress)) {
            toast.error("Invalid Code Wallet deposit address");
            return;
        }
        await proceedRequest();
    }

    const proceedRequest = async () => {
        let published = storyData?.status === "draft" ? false : true;
        
        console.log({ isFree, price: price });

        try {
            showPageLoader()
            setOpenAddAddressModal(false);

            const updated = await axiosInterceptorInstance.put(`/stories/publish/${storyId}`, 
                {
                    status: published === true ? "draft" : "published",
                    publishedAt: published === true ? null : new Date,
                    depositAddress,
                    tipLink,
                    isFree, 
                    price: price
                }
            );

            if (updated && !published) {
                refetch();
                // push("/dashboard/stories")
                setIsPublished(true);

            }else{
                refetch();
            }
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }
    }

    const validateData = async () => {
        if (!storyData?.introductionImage) {
            // toast.error("Kindly add a story banner image") 
            // return
        }
        if (!storyOverview) {
            toast.error("Kindly provide the story overview") 
            return
        }

        setOpenAddAddressModal(true);

        // if (!storyData?.user?.publicKey) {
        //     setOpenAddAddressModal(true);
        //     return;
        // }
        // await proceedRequest()
    }

    const saveChapterBanner = async (payload: { imageId?: number|null, imageStatus?: string|null, imgUrl?: string|null }) => {
        // const payload = { [CHAPTER_IMAGE_MAP[chapter]]: imgUrl };
        const { imageId, imageStatus, imgUrl } = payload;

        try {
            const updated = await axiosInterceptorInstance.put(`/stories/build-from-scratch/${storyId}`, 
                {
                    introductionImage: imgUrl,
                    imageUrl: imgUrl,
                    imageStatus,
                    imageId
                }
            );

            if (updated) {
                refetch();
            }
        } catch (error) {
          console.error('Error saving chapter banner:', error);
        }
    };

    const generateStoryOverview = async () => {
        try {
            
            const prompt = `
            Based on the following chapters, generate a concise synopsis of the story:
            - Introduction (Chapter 1): {introduceProtagonistAndOrdinaryWorld}
            - Inciting Incident (Chapter 2): {incitingIncident}
            - First Plot Point (Chapter 3): {firstPlotPoint}
            - Rising Action & Midpoint (Chapter 4): {risingActionAndMidpoint}
            - Pinch Points & Second Plot Point (Chapter 5): {pinchPointsAndSecondPlotPoint}
            - Climax and Falling Action (Chapter 6): {climaxAndFallingAction}
            - Resolution & Epilogue (Chapter 7): {resolution}

            Summarize the story in a brief and engaging way. Not more than 50 to 100 words.
            Note: Do not add any headers or descriptions, just generate the short synopsis.

            **INPUT**
            Story idea: {storyIdea}
        `;

            setGenerating(true);   
            
            const response = await streamLLMResponse(prompt, {
                storyIdea: story?.projectDescription,
                introduceProtagonistAndOrdinaryWorld: story?.storyStructure?.introductionSummary,
                incitingIncident: story?.storyStructure?.incitingIncidentSummary,
                firstPlotPoint: story?.storyStructure?.firstPlotPointSummary,
                risingActionAndMidpoint: story?.storyStructure?.risingActionAndMidpointSummary,
                pinchPointsAndSecondPlotPoint: story?.storyStructure?.pinchPointsAndSecondPlotPointSummary,
                climaxAndFallingAction: story?.storyStructure?.climaxAndFallingActionSummary,    
                resolution: story?.storyStructure?.resolutionSummary,                     
            });
    
            if (!response) {
                setGenerating(false);   
                toast.error("Try again please");
                return;
            }
            let overview:string = ``;
            for await (const chunk of response) {
                overview += chunk;   
                setStoryOverview(overview);                     
            }

            await updateStory(overview);
        } catch (error) {
            console.error(error);            
        }finally{
            setGenerating(false);   
        }
    }

    const fetchPendingImage = async () => {
        
        // let response = await axios.post("https://modelslab.com/api/v6/images/fetch", {
        let response = await axios.post("https://modelslab.com/api/v3/fetch/D9Rv3euth4rpObwPtkuChkO4Jf1elG0eKNlMGoZWOasXAOZuGyJxk9eLpjsE", {
            "key": process.env.NEXT_PUBLIC_STABLE_FUSION_API_KEY,
            // "request_id": "D9Rv3euth4rpObwPtkuChkO4Jf1elG0eKNlMGoZWOasXAOZuGyJxk9eLpjsE"
        });
        console.log(response);        
        if (response.data.status !== "success") {
            // Handle failure
            toast.error("Image is still being processed")
            return
        }

        const imgUrl = response?.data?.output?.[0] ?? response?.data?.proxy_links?.[0];
        await saveChapterBanner({ 
            imgUrl,  
            imageStatus: response.data.status,
            imageId: storyData?.imageId
        });
    }
 
    const updateStory = async (overview = "") => {
        if (!storyOverview && !overview) {
            toast.error("Provide a story overview");
            return;
        }
        
        let payload = storyOverview !== "" && storyOverview ? storyOverview : overview;

        try {
            showPageLoader();
            const updated = await axiosInterceptorInstance.put(`/stories/build-from-scratch/${storyId}`, 
                {
                    overview: payload,
                    isFree, 
                    price
                }
            );
        
            if (updated) {
                refetch();
            }
        } catch (error) {
            console.error('Error updating story:', error);
        }finally{
            hidePageLoader()
        }
    }

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        console.log({file});
        
        if (!file) {
           return 
        }
        
        // // let res = await uploadImage(file);

        // if (file) {

        //     setChallengeImage(null)
        //     setChallengeImage(file)

        //     const reader = new FileReader();
        //     setInPreview(true)

        //     reader.onload = (e) => {

        //         let preview_box = document.getElementById('preview') as HTMLElement
        //         if (preview_box) {  
        //             setUploadedImage(e?.target?.result)
        //             setImagePlaceholder(e?.target?.result)
        //             preview_box.src = e?.target?.result;
        //         }
        //     };
        //     reader.readAsDataURL(file);
        // }
    }

    return (
        <div>
            
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Publish</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-between mt-7">
                <Link href={`/dashboard/refine-story?story-id=${storyId}`}>
                    <Button size='sm' variant="outline">Return</Button>
                </Link>
                {/* <Button size='sm'>View Chapters</Button> */}
                
            </div>

            <div className='my-10 p-7 bg-gray-50 rounded-2xl'>
                <div>
                    <h1 className="font-bold text-2xl mb-4">Story banner</h1>

                    <div className="flex mb-3 w-full items-center h-[400px] justify-center border-gray-200 border bg-gray-100 rounded-2xl">
                        {!storyData?.introductionImage &&
                        <div className="flex flex-col items-center gap-2 ">
                            <ImageIcon/>
                            <span className='text-xs'>Generate a banner</span>
                        </div>}
                        {storyData?.introductionImage &&
                            <img src={storyData?.introductionImage} alt="story banner" className='w-full object-cover rounded-2xl h-[400px]'/>
                        }
                    </div>

                    {/* <div className=" bg-[#343434] w-full h-[280px] mb-3 rounded-lg overflow-hidden">
                        <img id='preview'
                            src={ storyData?.introductionImage ? storyData?.introductionImage : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN4AAACUCAMAAADLemePAAAAMFBMVEXx8/XCy9L09ve/yNDGztXN1Nrs7/HT2d/o6+7Z3uPh5enJ0dfk6Ovc4eXQ19zV299BB7LwAAAEOElEQVR4nO2a2baDIAwAkU0Utf//t9e17gUCgtyTea7LNBgSgBT/GpL6BZ4F9XIG9XIG9XIG9XIG9XIG9XIG9XIG9XIG9XIG9XIG9XIG9XIG9XIG9XIG9XIG9XIG9XIG9eLDgt3pXXq84KKsqupTdpqHuOF79BgXn0YRukBUW2rO/CL5Fj3Gq0GNbKFUqkp4Cb5Dj+lakr3bbEikKj0E36DHivZKbVWswLdOr9cPy8vA7QU1LILJ9ZhQBrlRUFYcIphaj1XSwm4U/AD8Uus1dnKjoHIPYFI9pi1Dtwg6j9CUeky42Q0BFG5+CfVYJ93kBj/i9gUm1Cud5UZql4o7nV7pODC/AZQOAzSVHgPGjowD1PoxifRYB7YbaG2fk0hPeNkR2lg+x1ePQcp5xv3shg/Qrtv10us70LLshPviget8d+VnlWA89Jhuxw5UNqXjlQ6V2D2ys3gSXI99vx9KbD+FiZ/dnQOdOX5gPbadt6jLbapAdoSWRj+oHtvnPqqAF/r5GSs0cPSaw6PM/+RkFyCtbDD5QfVOMbANX5C0Yu0H1TulB7tEzdqgcsbvD6jHjmPTPE5G/Goxdz+o3qlVo5WFHrdZNnLl1/wH1VMQPRb4w5sR4fXOg9OcOhm0xTOhQ+sVn1NquX/Ggn5Grud2hQmqd3pVi7rsHPFQ3C4Rgqf1+hA+cwFYPWbX9383/RFYT+9yJ22Nds8NzR/Ph5fUfONHa3NecV/1C+Dn0RDxZt7ZodI8KbBQXdCt32VZ4dWtd+0w/SmL3amQfcIdV1+/32JEwXusfnoqA8IjL/7lSCtlTw/NAarO/3QcvQhDc/BrTuGLo/dEJX3ld0qfMfRYsNUVI8fC91ovyImgLzqa3amp3umxQnftdDCoz/f1R/Agx7siZM2FY3rZ6LGiq+XmYNBw7qkuQQcSdjxYa1747eunVW+tQra/JrL2PNf1aK154bf7/FY9cXt4pgGemRm5aHwfZvu2ix479acbqAJsk8z3jZc1F7abR4ueqayoHY8kLHaRh+b0ric94/IjlU5b9l8iZs2Vdcdq1LMbQdJiR+YYvKhZc+U7PAc9216MuuaYGG3QJXJ5TzJs49t+/VQ6blRGqjXPL7oUn2Q4+uRwYf3bZx+843JTRObZjxTcaRHE4VgeE+nsyFycEecdKYs90YkUc8L6llPvR35N5zdXtlYNBU8yJ6xvOS4tga5UNhk09E6eM8NLAi811jCPbZdYM273Q681bVZGbGFv6WcH6KX096k1/eyatCUCrDfsWtwHMHFamemHp8fV6r7GfmYX1hnqVfJeLQuPaSVVLRYWer2px18SuwBcJFD9P2I3cdz6gpzefzP7Jv7xbbzYUCmKaaWQFbwMeh7uFVBSf4TmXIvqP311K5RIqZSS9F/aIQiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCICn4A49MS2/QrYSCAAAAAElFTkSuQmCC' }
                            className='w-full h-full object-cover object-center'                     
                            alt="Picture of the image"
                        />
                    </div> */}

                    <div className=" flex justify-between w-full mx-auto">
                        {/* <div className="flex items-center justify-between">
                        
                            <label htmlFor="uploader">
                                <div className="cursor-pointer flex items-center">
                                    <div className=" bg-gray-300 w-10 h-10 rounded-l flex justify-center items-center ">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M246.309-148.001q-41.308 0-69.808-28.5-28.5-28.5-28.5-69.808v-65.461q0-17.769 12.616-30.384 12.615-12.615 30.384-12.615t30.384 12.615Q234-329.539 234-311.77v65.461q0 4.616 3.846 8.463 3.847 3.846 8.463 3.846h467.382q4.616 0 8.463-3.846 3.846-3.847 3.846-8.463v-65.461q0-17.769 12.615-30.384 12.615-12.615 30.384-12.615t30.384 12.615q12.616 12.615 12.616 30.384v65.461q0 41.308-28.5 69.808-28.5 28.5-69.808 28.5H246.309Zm189.692-499.462-76.923 76.923q-12.923 12.923-30.192 13.308-17.269.384-30.577-12.923-13.692-13.308-13.499-30.576.192-17.269 13.499-30.577l146.384-146.383q7.615-7.615 15.846-10.923 8.23-3.308 18.461-3.308 10.231 0 18.461 3.308 8.231 3.308 15.846 10.923l146.384 146.383q12.923 12.923 13.307 29.884.385 16.961-13.307 30.269-13.308 13.307-30.384 13.115-17.077-.192-30.385-13.5l-76.923-75.923v282.002q0 17.768-12.615 30.384-12.615 12.615-30.384 12.615t-30.384-12.615q-12.615-12.616-12.615-30.384v-282.002Z"/></svg>
                                    </div>
                                    <p className="text-xs uppercase w-max pl-3 pr-4 h-10 flex items-center justify-center bg-gray-200 rounded-r ">upload</p>

                                </div>
                            </label>
                            <input type="file" onChange={handleFileChange} accept=".jpg, .jpeg, .png" name="uploader" id="uploader" className="hidden"/>

                        </div> */}
                            
                        {
                            !storyData?.introductionImage && (storyData?.imageStatus === null || storyData?.imageStatus === "error") &&
                            <Button onClick={generateBanner} size="sm">Generate Banner</Button>
                        }

                        {
                            storyData?.imageStatus === "processing" &&
                            <Button onClick={fetchPendingImage} size="sm">Fetch Banner</Button>
                        }

                    </div>
                </div>

                <div className='mt-7 mb-7'>
                    <p className="mb-2 font-semibold text-sm">Story Overview</p>
                    <textarea rows={7} 
                    onChange={(e) => setStoryOverview(e.target.value) } 
                    value={storyOverview} 
                    placeholder='Kindly share your story idea or any keywords'
                    className='p-5 outline-none text-sm border rounded-lg w-full' 
                    />

                    {/* <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 mt-3 gap-4"> */}
                        <Button disabled={generating} onClick={generateStoryOverview} className='mt-2'>
                            Generate Overview
                            {generating && <i className='bx bx-loader-alt bx-spin text-white ml-2' ></i> }
                        </Button>
                        {/* <Button onClick={() => updateStory()} disabled={!storyOverview || generating}>Save</Button> */}
                    {/* </div> */}
                </div>

                <div className="flex items-center space-x-2 mb-3">
                    <Switch
                        id="story-free"
                        checked={isFree}
                        onCheckedChange={(value) => setIsFree(value)}
                    />
                    <Label htmlFor="story-free">Free Story</Label>
                </div>

                {
                !isFree && 
                <div className="mb-3">
                    <Label htmlFor="price">Price - ${price}</Label>     
                
                    <div className="mt-2">                            
                        {/* <Slider 
                            onValueChange={(values) => setPrice(values)}
                            defaultValue={[0]} minStepsBetweenThumbs={5} min={0} max={1} step={0.01} 
                        /> */}
                        <input
                            type="range"
                            className="w-full"
                            min={0}
                            max={1}
                            step={0.1}
                            value={price}
                            onChange={e => setPrice(parseFloat(e.target.value))}
                        />

                    </div>
                </div>
                }
             
                {/* <Button disabled={generating} onClick={() => setCharactersModalOpen(true)} variant="outline" className='w-full mt-3 '>
                    Characters                        
                    <Users className='w-4 h-4 ml-2' />        
                </Button> */}

                <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 mt-5 gap-4">
                    {
                        storyData?.status === "draft" &&
                        <Button disabled={generating} onClick={validateData} className='w-full flex items-center gap-2 bg-custom_green'>
                            Publish
                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" className='w-4 h-4' viewBox="0 0 96 96" preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0,96) scale(0.1,-0.1)" fill="#FFFFFF" stroke="none">
                                    <path d="M431 859 c-81 -16 -170 -97 -186 -169 -5 -22 -15 -32 -42 -41 -46 -15 -99 -63 -125 -112 -27 -54 -27 -140 1 -194 40 -78 157 -151 181 -112 12 18 4 27 -38 45 -76 31 -112 85 -112 167 0 62 25 108 79 144 44 29 132 32 176 5 35 -22 55 -18 55 9 0 22 -66 59 -105 59 -23 0 -25 3 -20 23 11 35 57 88 95 108 46 25 134 25 180 0 19 -10 48 -35 64 -55 41 -50 49 -145 17 -206 -24 -46 -26 -66 -9 -76 14 -9 54 39 69 84 10 30 14 33 38 27 14 -3 41 -21 60 -40 27 -27 35 -43 39 -84 2 -27 2 -61 -2 -75 -9 -36 -62 -84 -107 -96 -28 -8 -39 -16 -39 -30 0 -30 56 -26 106 6 112 73 131 213 42 310 -23 25 -57 49 -81 57 -38 12 -42 17 -49 57 -22 127 -155 215 -287 189z"/>
                                    <path d="M464 460 c-29 -11 -104 -99 -104 -121 0 -30 32 -23 62 13 l27 33 1 -127 c0 -139 4 -158 30 -158 26 0 30 19 30 158 l1 127 27 -33 c29 -35 62 -43 62 -14 0 19 -72 107 -98 121 -10 5 -26 5 -38 1z"/>
                                </g>
                            </svg>
                        </Button>
                    }

                    {
                        storyData?.status !== "draft" &&
                        <Button disabled={generating} onClick={unpublishStory} className='w-full flex items-center gap-2 bg-red-600'>
                            Unpublish                        
                            <Download className='w-4 h-4'/> 
                        </Button>
                    }

                    <Button onClick={() => updateStory()} disabled={!storyOverview || generating}>Save</Button>
                </div>
                
            </div>

            <Sheet open={charactersModalOpen} onOpenChange={setCharactersModalOpen}>
                <SheetContent className="overflow-y-scroll xs:min-w-[90%] sm:min-w-[96%] md:min-w-[65%] lg:min-w-[65%] xl:min-w-[55%]">
                    <SheetHeader className=''>
                        <SheetTitle>Edit Chapter</SheetTitle>
                        <SheetDescription> </SheetDescription>
                    </SheetHeader>

                    <div className='my-10 p-7 bg-gray-50 rounded-2xl'>
                        <p className={cn("font-semibold text-xl first-letter:text-4xl whitespace-pre-wrap", inter.className)}>{story?.storyStructure?.introduceProtagonistAndOrdinaryWorld}</p>
                    </div>
                </SheetContent>
            </Sheet>

            <Dialog open={openAddAddressModal} onOpenChange={setOpenAddAddressModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className=''>Provide your tip address</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <div className="mb-4">
                            <p className="mb-1 text-xs font-semibold">Code Wallet Address <span className='text-red-500 text-md font-bold'>*</span></p>
                            <div className="flex border items-center rounded-2xl p-1.5">
                                <div className='flex items-center'>
                                    <img src="/images/codeImage.png" className='w-6 h-6' alt="code wallet icon" />
                                </div>
                                <input type="text" 
                                value={depositAddress}
                                className='w-full h-full text-xs pr-4 pl-2 py-2 outline-none border-none'
                                placeholder='5wBP4XzTEVoVxkEm4e5NJ2Dgg45DHkH2kSweGEJaJ91w'
                                onChange={(e) => setDepositAddress(e.target.value)} 
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <p className="mb-1 text-xs font-semibold">Tip card link</p>

                            <div className="flex border items-center rounded-2xl p-1.5">
                                <div className='flex items-center'>
                                    <img src="/images/codeImage.png" className='w-6 h-6' alt="code wallet icon" />
                                </div>
                                <input type="text" 
                                className='w-full h-full text-xs pr-4 pl-2 py-2 outline-none border-none'
                                placeholder='https://tipcard.getcode.com/X/x-handle'
                                value={tipLink}
                                onChange={(e) => setTipLink(e.target.value)} 
                                />
                            </div>
                        </div>
                        
                        <div className="mb-3 bg-red-100 border border-red-300 p-3 rounded-2xl">
                            <p className='text-[10px] text-red-500'>
                            Caution: Please ensure you provide a valid Code Wallet deposit address. Not all Solana addresses are compatible with Code Wallet transactions. If the address is incorrect, you may not receive tips or payments for your content. Double-check your Code Wallet wallet address to avoid missing out on rewards.
                            </p>
                        </div>
                        <Button onClick={publishStory} className='text-gray-50 mr-5 w-full bg-[#46aa41]'>Proceed</Button>

                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isPublished} onOpenChange={setIsPublished}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className=''>Story Published!</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center mb-3">
                        {/* <i className='bx bx-party bx-tada text-[6rem] text-green-600' ></i> */}
                        <div className="w-[40%]">                            
                            <Lottie options={defaultOptions}           
                                isStopped={false}
                                isPaused={false}/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div onClick={() => shareStory(storyData)} className="flex gap-1 items-center cursor-pointer px-3 py-2 border border-gray-800 rounded-2xl">
                            <span className="text-xs">Post on </span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="w-4 h-4"><path fill="#000" d="M13.346 10.932 18.88 4.5h-1.311l-4.805 5.585L8.926 4.5H4.5l5.803 8.446L4.5 19.69h1.311l5.074-5.898 4.053 5.898h4.426zM11.55 13.02l-.588-.84-4.678-6.693h2.014l3.776 5.4.588.842 4.907 7.02h-2.014z"></path></svg>
                        </div>
                        <Link href="/dashboard/stories">
                            <Button>View Stories</Button>
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
            
        </div>
    );
}

export default MyComponent
