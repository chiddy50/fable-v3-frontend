"use client";

import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { BookOpenText } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'
import { hidePageLoader, showPageLoader } from '@/lib/helper';


interface Props {
    setOpenProjectTitleModal: React.Dispatch<React.SetStateAction<boolean>>;    
    autoDetectStructure: boolean;
    selectedStoryType: string;
    selectedStoryStructure: string;
}

const SaveStoryTitleComponent: React.FC<Props> = ({
    setOpenProjectTitleModal,
    autoDetectStructure,
    selectedStoryType,
    selectedStoryStructure,
}) => {
    const [projectTitle, setProjectTitle] = useState<string>("");
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const router = useRouter();
    
    const saveTitle = async () => {
        try {
            
            if(!projectTitle){
                setError(true);
                toast("Provide a title");    
                return;
            }
    
            setError(false);    
            showPageLoader();               
    
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories`;
            const response = await axiosInterceptorInstance.post(url, {
                projectTitle,
                currentStep: 1,
                type: "ai",
                autoDetectStructure: autoDetectStructure === true ? "true" : "false",
                storyType: selectedStoryType,
                storyStructure: selectedStoryStructure,
            }); 
            let newStory = response?.data?.data?.newStory;
            setOpenProjectTitleModal(false);

            let redirectUrl = `/dashboard/write-ai-story?story-id=${newStory?.id}&current-step=1`;
            router.push(redirectUrl);
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }

    }
    
    return (
        <div className=' bg-white rounded-2xl p-5'>

            <h1 className="font-bold text-2xl text-center mt-5">Project Title</h1>
            <p className="font-light text-sm text-center mt-2 mb-7 text-gray-500">Kindly provide a project title</p>

            <div className="">
                <div className={`flex items-center p-3 gap-2 rounded-lg bg-gray-100 ${error ? "border border-red-400" : ""}`}>
                    <BookOpenText size={17}/>
                    <input
                        type="text"
                        name="title"
                        placeholder=""
                        className="w-full bg-transparent text-sm focus:outline-none text-gray-700"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value) }
                    />
                </div>
            </div>

            <button 
            onClick={saveTitle}
            className="py-3 px-4 w-full mt-5 font-bold flex items-center justify-center cursor-pointer text-white bg-black hover:bg-[#3f3f3f] rounded-md gap-3">
                <span className='text-xs'>{saving ? "Saving..." : "Get Started"}</span>
                { !saving && <i className="bx bx-send text-2xl"></i>}
                { saving && <i className='bx bx-loader-circle bx-spin bx-flip-horizontal text-2xl'></i>}
            </button>
        </div>
    )
}

export default SaveStoryTitleComponent
