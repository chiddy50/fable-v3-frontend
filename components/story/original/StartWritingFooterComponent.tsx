"use client";

import { ArrowRight, BookOpenCheck, CheckCircle, DollarSign, Minus, Save, XCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button';
import { ChapterInterface } from '@/interfaces/ChapterInterface';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from 'sonner';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { convertNumberToWords, hidePageLoader, showPageLoader } from '@/lib/helper';
import ModalBoxComponent from '@/components/shared/ModalBoxComponent';
 

interface Props {    
    nextStep: (value: number) => void;
    story: StoryInterface | null; 
    saveChaptersProgress: () => any; 
    activeChapterData: ChapterInterface | null;
    refetch: () => void;
    setActiveChapter: React.Dispatch<React.SetStateAction<string>>;    
}

const StartWritingFooterComponent: React.FC<Props> = ({
    nextStep,
    story,
    saveChaptersProgress,
    activeChapterData,
    refetch,
    setActiveChapter,
}) => {

    const [isFree, setIsFree] = useState<boolean>(true);
    const [isSetFeeOpen, setIsSetFeeOpen] = useState<boolean>(false);
    const [price, setPrice] = useState<number>(0);
    const [tokenPrice, setTokenPrice] = useState<number>(0);

    const [applyFeeToAll, setApplyFeeToAll] = useState<boolean>(false);
    const [makeFree, setMakeFree] = useState<boolean>(false);
    const [savingFee, setSavingFee] = useState<boolean>(false);

    const [showConfirmPublishModal, setShowConfirmPublishModal] = useState<boolean>(false);

    

    useEffect(() => {
        let generalPricePerChapter = story?.applyFeeToAllChapters === true ? (Number(story?.generalChapterFee) ?? 0) : (Number(activeChapterData?.price) ?? 0)

        setPrice(generalPricePerChapter);
        setTokenPrice(generalPricePerChapter * 100);
        
        setMakeFree(activeChapterData?.isFree ? activeChapterData?.isFree : false)
        
        setApplyFeeToAll(story?.applyFeeToAllChapters ? story?.applyFeeToAllChapters : false)
    }, [activeChapterData]);

    
    const setFeeRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    
    const toggleIsSetFeeOpen = () => {
        setIsSetFeeOpen(!isSetFeeOpen);
    };

    const convertTokenValue = (amount: number) => {
        console.log(amount, typeof amount);
        
        let tokenValue = Number(amount) * 100;
        setPrice(Number(amount));
        setTokenPrice(tokenValue);
    }

    const done = () => {
        let redirectUrl = `/dashboard/write-original-story?story-id=${story?.id}&current-step=${Number(story?.currentStep) + 1}`;
        router.push(redirectUrl);
    }

    const changeApplyFeeToAll = async (value: boolean) => {
        setApplyFeeToAll(value)      


        await saveChaptersProgress();

        showPageLoader();

        try {            
            const updated = await axiosInterceptorInstance.put(`/v2/stories/${story?.id}`, { 
                applyFeeToAllChapters: value === true ? "true" : "false",
                generalChapterFee: (price < 0) ? 0 : price
            });
            let chapterId = activeChapterData.id;
            refetch();
            setActiveChapter(story?.currentChapterId)

        } catch (error) {
            console.log(error);          
        }finally{
            hidePageLoader()
        }
    }

    const changeMakeFree = async (value: boolean) => {
        setMakeFree(value);
        
        showPageLoader()

        await saveChaptersProgress();
        try {            
            const response = await axiosInterceptorInstance.put(`/v2/chapters/${activeChapterData?.id}`, { 
                isFree: value === true ? "true" : "false"
            });
            let chapterId = activeChapterData?.id
            refetch();
            setActiveChapter(story.currentChapterId)

        } catch (error) {
            console.log(error);          
        }finally{
            hidePageLoader()
        }
    }

    const saveChapterFee = async () => {
        if(!price){
            toast("Kindly provide a price")
            return;
        }

        await saveChaptersProgress();

        setSavingFee(true)
        try {            
            const response = await axiosInterceptorInstance.put(`/v2/chapters/${activeChapterData?.id}`, { 
                price
            });
            toast("Price saved!"); 
            let chapterId = activeChapterData?.id;
            refetch();
            setActiveChapter(story.currentChapterId)

        } catch (error) {
            console.log(error);        
        }finally{
            setSavingFee(false);
        }
    }

    const publishChapter = async () => {
        try {
            showPageLoader();

            let status = activeChapterData?.readersHasAccess === true ? "draft" : "published"

            const response = await axiosInterceptorInstance.put(`/v2/chapters/publish/${activeChapterData?.id}`, { 
                status: status,
                publishedAt: status === "published" ? new Date : null,
                readersHasAccess: status === "published" ? "true" : "false"
            });
            toast(`Chapter ${activeChapterData?.index} has been ${status === "draft" ? "unpublished" :  "published"}!`); 
            
            refetch();
            setActiveChapter(story?.currentChapterId)
        } catch (error) {
            console.log(error);       
        }finally{
            hidePageLoader()
            setShowConfirmPublishModal(false)
        }
    }

    const checkToDisable = () => {
        return !price || price <= 0 || savingFee;
    }

    return (
        <div className='bg-white p-4 rounded-xl mt-7'>
            <h1 className='capitalize text-md mb-2 font-bold'>Publish & Fee Setting </h1>
            <p className='mb-7 text-xs'>Set reading fee for readers, also publish per chapter, or after you’ve completed your piece.</p>

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                    <div
                        onClick={toggleIsSetFeeOpen}
                        className="flex items-center relative gap-2 bg-gray-800 cursor-pointer py-2 px-3 rounded-xl" >
                        <Image src="/icon/coins-white.svg" alt="coins icon" width={13} height={13} />
                        <span className="text-xs text-white">Set Fees</span>
                        <i className={`bx bx-chevron-down text-xl text-white ${isSetFeeOpen ? 'transform rotate-180' : ''}`}></i>

                        {isSetFeeOpen && (
                            <div
                                ref={setFeeRef}
                                className="absolute left-0 bg-white shadow-lg rounded-xl w-70 z-20"
                                // className="absolute left-0 -top-56 bg-white shadow-sm rounded-lg w-70 z-20"
                                style={{
                                    top: "-18rem"
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="relative p-3 text-[#626262]">
                                    <div
                                        onClick={() => setIsSetFeeOpen(false)}
                                        className="h-7 w-7 cursor-pointer bg-white border border-[#F5F5F5] shadow-xl absolute top-0 -right-3 rounded-full flex items-center justify-center">
                                        <XCircle size={14} />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Image src="/icon/coins-light.svg" alt="coins icon" width={34} height={34} />
                                        <div className='flex flex-col'>
                                            <span className='font-bold'>Fees</span>
                                            <span className="text-xs text-gray-500 font-light">Set your rate for this piece</span>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <p className='font-semibold text-xs mb-1'>Amount</p>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border bg-[#F5F5F5] px-2 rounded-xl border-[#e1e1e1]">
                                                <DollarSign size={19} />
                                                <input type="number" 
                                                onChange={(e) => convertTokenValue(e.target.value)} 
                                                value={price}                                                 
                                                className='w-full h-full py-2 px-1 border-none outline-0 text-sm' 
                                                placeholder="0.00" />
                                            </div>

                                            <Minus size={40} className='text-[#D0D0D0]'/>

                                            <div className="flex items-center bg-[#F5F5F5] border border-[#F5F5F5] px-2 rounded-xl ">
                                                <Image src="/icon/coins.svg" alt="coins icon" width={18} height={18} />
                                                <input 
                                                type="text" disabled 
                                                value={tokenPrice}                                                 
                                                className='w-full h-full p-2 border-none font-bold outline-0 text-sm' 
                                                placeholder="0.00" />
                                            </div>

                                        </div>
                                    </div>

                                    { (price || price > 0) &&
                                        <div className="mt-4 flex items-center justify-between">
                                            <Label htmlFor="airplane-mode" className='font-semibold text-xs'>Apply to all</Label>
                                            <Switch id="airplane-mode" checked={applyFeeToAll} onCheckedChange={changeApplyFeeToAll}/>
                                        </div>
                                    }

                                    <button onClick={saveChapterFee} 
                                    disabled={ price || price > 0 ? false : true}
                                    className={`flex mt-4 items-center w-full justify-center gap-2 bg-[#5D4076] text-white cursor-pointer py-2 px-3 rounded-lg
                                    ${ price > 0 ? "  hover:bg-[#765d8c]" : "opacity-50"}
                                    `}>
                                        { !savingFee && <Image src="/icon/money-add.svg" alt="coins icon" width={14} height={14} /> }
                                        <span className="text-xs ">{savingFee ? "Please wait..." : "Set Fee"}</span>
                                        { savingFee && <i className='bx bx-loader-circle bx-spin bx-flip-horizontal text-lg'></i>}
                                    </button>

                                    <Separator className='mt-3 mb-5' />

                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="make-free" className='font-semibold text-xs'>Make free</Label>
                                        <Switch id="make-free" checked={makeFree} onCheckedChange={changeMakeFree}  />
                                    </div>
                                    <p className="text-[10px] mt-1">You are about to make this free for your readers.</p>


                                </div>
                            </div>
                        )}
                    </div>

                    {/* <div className="flex items-center gap-2 bg-[#CACACA29] cursor-pointer hover:bg-gray-200 py-2 px-3 rounded-xl">
                        <span className="text-xs ">Next Chapter</span>
                        <i className="bx bx-right-arrow-alt text-xl "></i>
                    </div> */}


                    <Button onClick={() => setShowConfirmPublishModal(true)} className='flex items-center capitalize cursor-pointer gap-2 text-white rounded-xl bg-gradient-to-r from-[#33164C] to-[#AA4A41] hover:bg-gradient-to-l transition-all'>
                        <span className="text-xs ">{activeChapterData?.readersHasAccess ? "Unpublish": "Publish"}  Chapter {convertNumberToWords(activeChapterData?.index)}</span>
                        <CheckCircle size={15} />
                    </Button>
                    
                </div>
                <Button 
                onClick={() => nextStep(3)}
                className="flex items-center gap-2 bg-[#CACACA29] text-black cursor-pointer hover:bg-gray-200 rounded-xl">
                    <span className="text-xs ">Next</span>
                    <ArrowRight size={15} />
                </Button>

            </div>





            
            <ModalBoxComponent
                isOpen={showConfirmPublishModal}
                onClose={() => setShowConfirmPublishModal(false)}
                // title={`Save progress & proceed?`}
                width="w-[30%]"
                useDefaultHeader={false}
            >
                <div className="bg-white p-6 rounded-2xl">

                    <div className="flex mt-4 justify-center">
                        <div className="flex items-center justify-center text-[#535353] bg-[#e6e6e6] w-25 h-25 rounded-full">
                            <BookOpenCheck size={50} />
                        </div>
                    </div>
                    <h1 className="mb-7 mt-5 text-gray-600 text-center">You're about to publish Chapter {activeChapterData?.index}?</h1>
                    <div className="grid grid-cols-2 gap-3 ">
                        <button 
                        onClick={() => setShowConfirmPublishModal(false)}
                        className="text-sm py-3 px-4 font-semibold flex items-center justify-center cursor-pointer text-[#232323] bg-[#e6e6e6] hover:bg-[#cdcdcd] transition-all rounded-md gap-3">
                            Cancel
                        </button>
                        <button 
                        onClick={publishChapter}
                        className="text-sm py-3 px-4 font-semibold flex items-center justify-center cursor-pointer  text-white bg-[#33164C] hover:bg-[#33164C] transition-all rounded-md gap-3">
                            Proceed
                        </button>
                    </div>
                </div>
            </ModalBoxComponent>




        </div>
    )
}

export default StartWritingFooterComponent
