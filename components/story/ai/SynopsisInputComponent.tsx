// "use client"

// import { ChevronLeft, ChevronRight, RefreshCcw, Save } from 'lucide-react';
// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import { updateStory } from '@/lib/requests';
// import { StoryInterface } from '@/interfaces/StoryInterface';
// import { SynopsisListInterface } from '@/interfaces/SynopsisInterface';
// import axiosInterceptorInstance from '@/axiosInterceptorInstance';
// import { hidePageLoader, showPageLoader } from '@/lib/helper';




// interface Props {
//     content: string;
//     story: StoryInterface;   
//     setStory: React.Dispatch<React.SetStateAction<StoryInterface>>;
//     handleContentChange: (content: string) => void; 
//     synopsisList: SynopsisListInterface[];
//     activeSynopsisId: string;    
//     setActiveSynopsisId: React.Dispatch<React.SetStateAction<string>>;    
//     setOpenConfirmSynopsisRegenerationModal: React.Dispatch<React.SetStateAction<boolean>>;    
// }


// const SynopsisInputComponent: React.FC<Props> = ({
//     content,
//     story,
//     setStory,
//     handleContentChange,
//     synopsisList,
//     activeSynopsisId,
//     setActiveSynopsisId,
//     setOpenConfirmSynopsisRegenerationModal
// }) => {
//     const textareaRef = useRef<HTMLTextAreaElement>(null);
    
//     const [currentIndex, setCurrentIndex] = useState(1);
//     const [allSynopsis, setAllSynopsis] = useState<SynopsisListInterface[]>([]);

//     useEffect(() => {
//         if (story?.synopsisList && story?.synopsisList.length > 0) {            
//             setAllSynopsis(story?.synopsisList)
//         }
//     }, []);

//     useEffect(() => {
        
//         const currentActiveSynopsis = story?.synopsisList?.find((item: SynopsisListInterface) => item?.active === true);
//         setActiveSynopsisId(currentActiveSynopsis?.id); 
        
//     }, [story])

//     const activeSynopsisData = useMemo(() => {
//         const synopsisList = story?.synopsisList || [];
//         return synopsisList.find(synopsis => synopsis.active === true) || synopsisList.find(synopsis => synopsis.id === activeSynopsisId) || synopsisList[synopsisList?.length - 1];
//     }, [activeSynopsisId, story?.synopsisList]);

//     const previousSynopsis = async (activeSynopsis: SynopsisListInterface) => {
//         const synopsisIndex = story?.synopsisList.findIndex(item => item.id === activeSynopsis?.id);

//         const prevSynopsisIndex = synopsisIndex - 1; 
//         if (prevSynopsisIndex < 0) {
//             return;
//         }
//         setCurrentIndex(prevSynopsisIndex + 1)

//         const prevSynopsis = story?.synopsisList[prevSynopsisIndex]        
//         setActiveSynopsisId(prevSynopsis.id)   
        
//         await updateSynopsisList(prevSynopsis);
//     }

//     const nextSynopsis = async (activeSynopsis: SynopsisListInterface) => {        
//         const synopsisIndex = story?.synopsisList.findIndex(item => item.id === activeSynopsis?.id);
//         const nextSynopsisIndex = synopsisIndex + 1; 

//         if (nextSynopsisIndex > (story?.synopsisList?.length - 1)) {
//             return;
//         }
//         setCurrentIndex(nextSynopsisIndex + 1)
//         const nextSynopsis = story?.synopsisList[nextSynopsisIndex]

//         setActiveSynopsisId(nextSynopsis.id)

//         await updateSynopsisList(nextSynopsis);

//         // await updateCurrentChapter(id);
//         // setActiveChapter(id);
//         // setIsChapterListOpen(false);
//     };

//     const updateSynopsisList = async (synopsis: SynopsisListInterface) => {        
    
//         try {            
//             showPageLoader();
//             const url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/${story?.id}/synopsis-list`;
//             let res = await axiosInterceptorInstance.put(url, { synopsis });
//             setStory(res?.data?.story);

//         } catch (error) {
//             console.error(error);            
//         }finally{
//             hidePageLoader();
//         }

//     };

//     const handleSynopsisChange = (content: string) => {
//         console.log(content);

//         setAllSynopsis(prevSynopsis => {
//             return prevSynopsis.map(synopsis => {
                
//                 if (synopsis.id === activeSynopsisData.id) {
//                     console.log({synopsis, activeSynopsisData});
                    
//                     return {
//                         ...synopsis,
//                         content: content
//                     };
//                 }

//                 return synopsis;
//             });
//         });
//     };

//     const saveAllSynopsisProgress = async () => {
//         console.log(allSynopsis);
        
//         await updateStory({ synopsis: content }, story?.id);
//     }

//     return (
//         <div id="synopsis-form" className="mt-10">
//             <h1 className='capitalize text-lg mt-4 font-bold'>Synopsis</h1>

//             <div className="flex flex-col gap-1 mt-2 p-1 bg-white rounded-xl">
//                 <textarea
//                     ref={textareaRef}
//                     value={activeSynopsisData?.content}
//                     onChange={(e) => handleSynopsisChange(e.target.value)}
//                     placeholder="Start writing the synopsis..."
//                     className="flex-1 outline-none resize-none text-sm p-3 text-gray-700 placeholder:italic placeholder-gray-400 min-h-[230px]"
//                 />
//                 <div className="flex justify-between items-center p-2">
//                     <div className="flex gap-2 items-center">
//                         <button
//                             onClick={() => previousSynopsis(activeSynopsisData)}
//                             disabled={story?.synopsisList?.length > 0 ? false : true }
//                             className={`bg-[#F5F5F5] cursor-pointer flex items-center justify-center p-2 rounded-lg transition-all
//                                          ${story?.synopsisList?.length > 0 ? "hover:bg-gray-600 hover:text-white" : "opacity-30"}
//                                          `}>
//                             <ChevronLeft size={16} />
//                         </button>
//                         <div className='text-xs text-gray-500 font-bold'>
//                             <span>{activeSynopsisData?.index}</span>
//                             <span>/</span>
//                             <span>{story?.synopsisList?.length ?? 0}</span>
//                         </div>
//                         <button
//                             onClick={() => nextSynopsis(activeSynopsisData)}
//                             disabled={story?.synopsisList?.length > 0 ? false : true }
//                             className={`bg-[#F5F5F5] cursor-pointer flex items-center justify-center p-2 rounded-lg transition-all
//                                          ${story?.synopsisList?.length > 0 ? "hover:bg-gray-600 hover:text-white" : "opacity-30"}
//                                          `}
//                         >
//                             <ChevronRight size={16} />
//                         </button>
//                     </div>

//                     <div className="flex gap-2 items-center">
//                         <button onClick={saveAllSynopsisProgress} className="text-white bg-gray-800 hover:bg-gray-600 cursor-pointer flex items-center justify-center p-2 rounded-lg transition-all">
//                             <Save size={16} />
//                         </button>
//                         <button onClick={() => setOpenConfirmSynopsisRegenerationModal(true)} className="text-white cursor-pointer flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-[#AA4A41] to-[#33164C] hover:to-[#AA4A41] hover:from-[#33164C] transition-all">
//                             <RefreshCcw size={16} />
//                         </button>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     )
// }

// export default SynopsisInputComponent


"use client"

import { ArrowRight, ChevronLeft, ChevronRight, RefreshCcw, Save } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { updateStory } from '@/lib/requests';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { SynopsisListInterface } from '@/interfaces/SynopsisInterface';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { hidePageLoader, showPageLoader } from '@/lib/helper';

interface Props {
    content: string;
    story: StoryInterface;   
    setStory: React.Dispatch<React.SetStateAction<StoryInterface>>;
    handleContentChange: (content: string) => void; 
    synopsisList: SynopsisListInterface[];
    activeSynopsisId: string;    
    setActiveSynopsisId: React.Dispatch<React.SetStateAction<string>>;    
    setOpenConfirmSynopsisRegenerationModal: React.Dispatch<React.SetStateAction<boolean>>;    
}

const SynopsisInputComponent: React.FC<Props> = ({
    content,
    story,
    setStory,
    handleContentChange,
    synopsisList,
    activeSynopsisId,
    setActiveSynopsisId,
    setOpenConfirmSynopsisRegenerationModal,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const [currentIndex, setCurrentIndex] = useState(1);
    const [allSynopsis, setAllSynopsis] = useState<SynopsisListInterface[]>([]);

    // Sync allSynopsis with story.synopsisList whenever it changes
    useEffect(() => {
        if (story?.synopsisList && story?.synopsisList.length > 0) {            
            setAllSynopsis([...story.synopsisList]); // Create a copy to avoid mutation issues
        }
    }, [story?.synopsisList]); // Add dependency

    useEffect(() => {
        const currentActiveSynopsis = story?.synopsisList?.find((item: SynopsisListInterface) => item?.active === true);
        if (currentActiveSynopsis?.id) {
            setActiveSynopsisId(currentActiveSynopsis.id); 
        }
    }, [story, setActiveSynopsisId]);

    // Get active synopsis from local state instead of story state
    const activeSynopsisData = useMemo(() => {
        return allSynopsis.find(synopsis => synopsis.active === true) || 
               allSynopsis.find(synopsis => synopsis.id === activeSynopsisId) || 
               allSynopsis[allSynopsis?.length - 1];
    }, [activeSynopsisId, allSynopsis]);

    const previousSynopsis = async (activeSynopsis: SynopsisListInterface) => {
        const synopsisIndex = allSynopsis.findIndex(item => item.id === activeSynopsis?.id);

        const prevSynopsisIndex = synopsisIndex - 1; 
        if (prevSynopsisIndex < 0) {
            return;
        }
        setCurrentIndex(prevSynopsisIndex + 1)

        const prevSynopsis = allSynopsis[prevSynopsisIndex];        
        setActiveSynopsisId(prevSynopsis.id);   
        
        await updateSynopsisList(prevSynopsis);
    }

    const nextSynopsis = async (activeSynopsis: SynopsisListInterface) => {        
        const synopsisIndex = allSynopsis.findIndex(item => item.id === activeSynopsis?.id);
        const nextSynopsisIndex = synopsisIndex + 1; 

        if (nextSynopsisIndex > (allSynopsis?.length - 1)) {
            return;
        }
        setCurrentIndex(nextSynopsisIndex + 1)
        const nextSynopsis = allSynopsis[nextSynopsisIndex];

        setActiveSynopsisId(nextSynopsis.id);

        await updateSynopsisList(nextSynopsis);
    };

    const updateSynopsisList = async (synopsis: SynopsisListInterface) => {        
        try {            
            showPageLoader();
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/${story?.id}/synopsis-list`;
            let res = await axiosInterceptorInstance.put(url, { synopsis });
            setStory(res?.data?.story);
        } catch (error) {
            console.error(error);            
        } finally {
            hidePageLoader();
        }
    };

    const handleSynopsisChange = (content: string) => {
        console.log(content);

        setAllSynopsis(prevSynopsis => {
            return prevSynopsis.map(synopsis => {
                if (synopsis.id === activeSynopsisData?.id) {
                    console.log({synopsis, activeSynopsisData});
                    
                    return {
                        ...synopsis,
                        content: content
                    };
                }
                return synopsis;
            });
        });
    };

    const saveAllSynopsisProgress = async () => {
        console.log(allSynopsis);
        
        // Save the current active synopsis content
        // const currentActiveSynopsis = allSynopsis.find(synopsis => synopsis.id === activeSynopsisData?.id);
        // if (currentActiveSynopsis) {
        //     await updateStory({ synopsis: currentActiveSynopsis.content }, story?.id);
        // }
        await updateStory({ synopsisList: allSynopsis }, story?.id);
    }

    return (
        <div id="synopsis-form" className="mt-10">
            {/* <h1 className='capitalize text-lg mt-4 font-bold'>Synopsis</h1> */}            
            <h1 className='flex items-center gap-2 capitalize text-lg mt-4 font-bold'>Synopsis <ArrowRight size={15} /> <span className='text-xs text-gray-400'>{"(Here's what happens in your story...)"}</span></h1>


            <div className="flex flex-col gap-1 mt-2 p-1 bg-white rounded-xl">
                <textarea
                    ref={textareaRef}
                    value={activeSynopsisData?.content || ''}
                    onChange={(e) => handleSynopsisChange(e.target.value)}
                    placeholder="Start writing the synopsis..."
                    className="flex-1 outline-none resize-none text-sm p-3 text-gray-700 placeholder:italic placeholder-gray-400 min-h-[230px]"
                />
                <div className="flex justify-between items-center p-2">
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => previousSynopsis(activeSynopsisData)}
                            disabled={allSynopsis?.length === 0}
                            className={`bg-[#F5F5F5] cursor-pointer flex items-center justify-center p-2 rounded-lg transition-all
                                         ${allSynopsis?.length > 0 ? "hover:bg-gray-600 hover:text-white" : "opacity-30"}
                                         `}>
                            <ChevronLeft size={16} />
                        </button>
                        <div className='text-xs text-gray-500 font-bold'>
                            <span>{activeSynopsisData?.index || 0}</span>
                            <span>/</span>
                            <span>{allSynopsis?.length ?? 0}</span>
                        </div>
                        <button
                            onClick={() => nextSynopsis(activeSynopsisData)}
                            disabled={allSynopsis?.length === 0}
                            className={`bg-[#F5F5F5] cursor-pointer flex items-center justify-center p-2 rounded-lg transition-all
                                         ${allSynopsis?.length > 0 ? "hover:bg-gray-600 hover:text-white" : "opacity-30"}
                                         `}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="flex gap-2 items-center">
                        <button onClick={saveAllSynopsisProgress} className="text-white bg-gray-800 hover:bg-gray-600 cursor-pointer flex items-center justify-center p-2 rounded-lg transition-all">
                            <Save size={16} />
                        </button>
                        <button onClick={() => setOpenConfirmSynopsisRegenerationModal(true)} className="text-white cursor-pointer flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-[#AA4A41] to-[#33164C] hover:to-[#AA4A41] hover:from-[#33164C] transition-all">
                            <RefreshCcw size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SynopsisInputComponent