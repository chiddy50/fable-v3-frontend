// "use client";

// import React, { useEffect, useState } from 'react';
// import axiosInterceptorInstance from '@/axiosInterceptorInstance';
// import CreateCharactersComponent from '@/components/StoryBoardFromScratch/CreateCharactersComponent';
// import CreatePlotComponent from '@/components/StoryBoardFromScratch/CreatePlotComponent';
// import GenerateStoryComponent from '@/components/StoryBoardFromScratch/GenerateStoryComponent';
// import StoryStarterComponent from '@/components/StoryBoardFromScratch/StoryStarterComponent';
// import { storyBuilderSteps } from '@/lib/constants';
// import { hidePageLoader, showPageLoader } from '@/lib/helper';
// import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core';
// import { useQuery } from '@tanstack/react-query';
// import { CheckCircle } from 'lucide-react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { toast } from 'sonner';
// import StoryStepComponent from '@/components/Dashboard/BuildFromScratch/StoryStepComponent';
// import {
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbLink,
//     BreadcrumbList,
//     BreadcrumbPage,
//     BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"

// const StoryProjectPage = () => {
//     const [currentTab, setCurrentTab]= useState<string>('story-starter');
//     const [projectTitle, setProjectTitle]= useState<string>('');    
//     const [projectDescription, setProjectDescription]= useState<string>('');    
    
//     const [currentFormStep, setCurrentFormStep]= useState<number>(1);
//     const [plotSuggestions, setPlotSuggestions] = useState<[]>([])
//     const [story, setStory] = useState(null)

//     const currentStepUrl = useSearchParams().get('current-step');
//     const storyId = useSearchParams().get('story-id');
    
//     const { push } = useRouter();
//     const dynamicJwtToken = getAuthToken();
//     const { user, setShowAuthFlow } = useDynamicContext();

//     const { data: storyData, isFetching, isError, refetch } = useQuery({
//         queryKey: ['storyFromScratchFormData', currentStepUrl],
//         queryFn: async () => {
//             let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/from-scratch/${storyId}`;

//             const response = await axiosInterceptorInstance.get(url,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${dynamicJwtToken}`
//                     }
//                 }
//             );
//             if (response?.data?.story) {
//                 setStory(response?.data?.story);
//             }
//             return response.data.story;
//         },
//         enabled: !!storyId && !story,
//     });

//     const saveStory = async (payload: { 
//         currentStep?: number, 
//         currentStepUrl?: string 
//         storyId?: string | null
//     }) => {
        
//         try {
//             let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch/${storyId}`;

//             let body = payload;                        

//             if (storyData?.id) {                
//                 body.storyId = storyData?.id;
//             }
//             console.log(body);

//             const response = await fetch(url, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${dynamicJwtToken}`
//                 },
//                 body: JSON.stringify(body)
//             });

//             const json = await response.json();
//             console.log(json);
//             if (json?.data?.story) {
//                 setStory(json?.data?.story);
//                 refetch();                    
//                 return json?.data?.story;             
//             }

//             return null;
            
//         } catch (error) {
//             console.log(error);            
//             return null;
//         }
//     }

//     const getCurrentForm = () => {
//         switch (currentStepUrl) {
//             case storyBuilderSteps[0].link:
//             return {
//                 step: 1,
//                 form: (
//                     <StoryStarterComponent 
//                         moveToPlotSelection={moveToPlotSelection}     
//                         currentFormStep={currentFormStep + 1}    
//                         data={storyData ?? story} 
//                         saveStory={saveStory}          
//                     />
//                 ),
//             };

//             case storyBuilderSteps[1].link:
//             return {
//                 step: 2,
//                 form: (
//                     <CreatePlotComponent 
//                     initialStoryData={storyData}
//                     saveStory={saveStory}   
//                     currentPlotStep={storyData?.currentPlotStep}
//                     refetch={refetch}
//                     />
//                 ),
//             };

//             case storyBuilderSteps[2].link:
//             return {
//                 step: 3,
//                 form: (
//                     <CreateCharactersComponent 
//                         initialStoryData={storyData}
//                         refetch={refetch}
//                     />
//                 ),
//             };

//             case storyBuilderSteps[3].link:
//             return {
//                 step: 4,
//                 form: (
//                     <GenerateStoryComponent 
//                     initialStory={storyData}
//                     refetch={refetch}
//                     />
//                 ),
//             };
        
//             default:
//                 return {
//                     step: 1,
//                     form: (
//                         <StoryStarterComponent 
//                             moveToPlotSelection={moveToPlotSelection}
//                             currentFormStep={currentFormStep + 1}  
//                             data={storyData}   
//                             saveStory={saveStory}          
//                         />
                        
//                     ),
//                 };
//         }
//     }

//     const moveToPlotSelection = (storyId: string) => {
//         push(
//             `/story-board-from-scratch?current-step=${storyBuilderSteps[getCurrentForm().step].link}&story-id=${storyId}`
//         );
//         // setPlotSuggestions(plots);
//     }

//     const totalSteps = storyBuilderSteps.length;
//     const activeFormStep = getCurrentForm().step;

//     const generateSettingSuggestions = () => {

//     }

//     useEffect(() => {
//         setCurrentFormStep(getCurrentForm().step)
//     }, [])

//     if (isFetching) {
//         return (
//             <div className='h-full w-full flex items-center justify-center min-h-80 '>            
//                 <i className='bx bx-loader-alt bx-spin text-custom_green text-8xl' ></i>
//             </div>
//         )
//     }

//     return (
//         <div>

//             {storyData && 
//                 <div className="flex justify-between items-center">
//                     <Breadcrumb>
//                         <BreadcrumbList>
//                             <BreadcrumbItem>
//                             <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
//                             </BreadcrumbItem>
//                             <BreadcrumbSeparator />
//                             <BreadcrumbItem>
//                             <BreadcrumbLink href="/dashboard/stories">Stories</BreadcrumbLink>
//                             </BreadcrumbItem>
//                             <BreadcrumbSeparator />
//                             <BreadcrumbItem>
//                             <BreadcrumbPage>Story</BreadcrumbPage>
//                             </BreadcrumbItem>
//                         </BreadcrumbList>
//                     </Breadcrumb>
//                     <p className='my-5 bg-gray-50 py-1 px-7 rounded-lg text-md text-gray-600 font-light capitalize'>
//                         Title: {storyData?.projectTitle}
//                     </p>        
//                 </div>
//             }                    
             

//             <StoryStepComponent 
//                 data={storyData ?? story} 
//                 activeFormStep={activeFormStep}        
//             />

            
//             <div className='min-h-full mt-4'>                        
//                 {storyId && getCurrentForm().form}
//             </div>

//         </div>
//     )
// }

// export default StoryProjectPage

"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { storyBuilderSteps } from '@/lib/constants';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import StoryStepComponent from '@/components/Dashboard/BuildFromScratch/StoryStepComponent';

// Import other components...

const StoryProjectPage = () => {
    const router = useRouter();
    const dynamicJwtToken = getAuthToken();
    const { user, setShowAuthFlow } = useDynamicContext();

    return (
        <Suspense fallback={<LoadingFallback />}>
            <StoryProjectPageContent />
        </Suspense>
    );
}

const StoryProjectPageContent = () => {
    const [currentTab, setCurrentTab] = useState<string>('story-starter');
    const [projectTitle, setProjectTitle] = useState<string>('');
    const [projectDescription, setProjectDescription] = useState<string>('');
    const [currentFormStep, setCurrentFormStep] = useState<number>(1);
    const [plotSuggestions, setPlotSuggestions] = useState<[]>([]);
    const [story, setStory] = useState(null);

    const searchParams = useSearchParams();
    const currentStepUrl = searchParams.get('current-step');
    const storyId = searchParams.get('story-id');

    const router = useRouter();
    const dynamicJwtToken = getAuthToken();
    const activeFormStep = "getCurrentForm().step";

    const { data: storyData, isFetching, isError, refetch } = useQuery({
        queryKey: ['storyFromScratchFormData', currentStepUrl],
        queryFn: async () => {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/from-scratch/${storyId}`;
            const response = await axiosInterceptorInstance.get(url, {
                headers: {
                    Authorization: `Bearer ${dynamicJwtToken}`
                }
            });
            if (response?.data?.story) {
                setStory(response?.data?.story);
            }
            return response.data.story;
        },
        enabled: !!storyId && !story,
    });

    // ... (rest of the component logic)

    if (isFetching) {
        return <LoadingFallback />;
    }

    return (
        <div>
            {storyData && (
                <div className="flex justify-between items-center">
                    <Breadcrumb>
                        {/* ... (Breadcrumb content) */}
                    </Breadcrumb>
                    <p className='my-5 bg-gray-50 py-1 px-7 rounded-lg text-md text-gray-600 font-light capitalize'>
                        Title: {storyData?.projectTitle}
                    </p>
                </div>
            )}

            <StoryStepComponent
                data={storyData ?? story}
                activeFormStep={activeFormStep}
            />

            <div className='min-h-full mt-4'>
                {/* {storyId && getCurrentForm().form} */}
            </div>
        </div>
    );
}

const LoadingFallback = () => (
    <div className='h-full w-full flex items-center justify-center min-h-80 '>
        <i className='bx bx-loader-alt bx-spin text-custom_green text-8xl'></i>
    </div>
);

export default StoryProjectPage;