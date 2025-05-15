"use client"

import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ChapterInterface } from '@/interfaces/ChapterInterface';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { ArrowLeft, DollarSign, Minus, XCircle, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';


interface Props {    
    isOpen: boolean;
    story: StoryInterface | null; 
    chapter: ChapterInterface | null;
    refetch: () => void;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;  
    setReviewFeesPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;        
    // saveChaptersProgress: () => any; 
}

const EditChapterFeeComponent: React.FC<Props> = ({ 
    isOpen, 
    story,
    chapter,
    refetch,
    setIsOpen, 
    setReviewFeesPopupOpen
    // saveChaptersProgress,

}) => {
    const setFeeRef = useRef<HTMLDivElement>(null);

    const [isFree, setIsFree] = useState<boolean>(true);
    const [isSetFeeOpen, setIsSetFeeOpen] = useState<boolean>(false);
    const [price, setPrice] = useState<number>(0);
    const [tokenPrice, setTokenPrice] = useState<number>(0);

    const [applyFeeToAll, setApplyFeeToAll] = useState<boolean>(false);
    const [makeFree, setMakeFree] = useState<boolean>(false);
    const [savingFee, setSavingFee] = useState<boolean>(false);
    

    useEffect(() => {
        let generalPricePerChapter = story?.applyFeeToAllChapters === true ? (Number(story?.generalChapterFee) ?? 0) : (Number(chapter?.price) ?? 0)

        setPrice(generalPricePerChapter);
        setTokenPrice(generalPricePerChapter * 100);
        
        setMakeFree(chapter?.isFree ? chapter?.isFree : false)
        
        setApplyFeeToAll(story?.applyFeeToAllChapters ? story?.applyFeeToAllChapters : false)
    }, [chapter]);

    const convertTokenValue = (amount: number) => {
        console.log(amount, typeof amount);
        
        let tokenValue = Number(amount) * 100;
        setPrice(Number(amount));
        setTokenPrice(tokenValue);
    }

    const changeApplyFeeToAll = async (value: boolean) => {
        setApplyFeeToAll(value)      


        // await saveChaptersProgress();

        showPageLoader();

        try {            
            const updated = await axiosInterceptorInstance.put(`/v2/stories/${story?.id}`, { 
                applyFeeToAllChapters: value === true ? "true" : "false",
                generalChapterFee: (price < 0) ? 0 : price
            });
            let chapterId = chapter?.id;
            refetch();
            // setActiveChapter(story?.currentChapterId)

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

        // await saveChaptersProgress();

        setSavingFee(true)
        try {            
            const response = await axiosInterceptorInstance.put(`/v2/chapters/${chapter?.id}`, { 
                price
            });
            toast("Price saved!"); 
            let chapterId = chapter?.id;
            refetch();
            // setActiveChapter(story.currentChapterId)

        } catch (error) {
            console.log(error);        
        }finally{
            setSavingFee(false);
        }
    }

    const changeMakeFree = async (value: boolean) => {
        setMakeFree(value);
        
        showPageLoader()

        // await saveChaptersProgress();
        try {            
            const response = await axiosInterceptorInstance.put(`/v2/chapters/${chapter?.id}`, { 
                isFree: value === true ? "true" : "false"
            });
            let chapterId = chapter?.id
            refetch();
            // setActiveChapter(story.currentChapterId)

        } catch (error) {
            console.log(error);          
        }finally{
            hidePageLoader()
        }
    }

    const returnToReview = () => {
        setIsOpen(false)
        setReviewFeesPopupOpen(true) 
    }

    return (
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
                    onClick={() => setIsOpen(false)}
                    className="h-7 w-7 cursor-pointer bg-white border border-[#F5F5F5] shadow-xl absolute top-0 -right-3 rounded-full flex items-center justify-center">
                    <X size={14} />
                </div>

                <div className="flex items-center text-gray-600 gap-7 mb-3">
                    <ArrowLeft onClick={returnToReview} className='cursor-pointer' size={16}/>
                    <h1 className="text-sm font-bold">Chapter {chapter?.index}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Image src="/icon/coins-light.svg" alt="coins icon" width={32} height={32} />
                    <div className='flex flex-col'>
                        <span className='font-bold text-sm'>Fees</span>
                        <span className="text-[10px] text-gray-500 font-light">Set your rate for Chapter {chapter?.index}</span>
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

                        <Minus size={40} className='text-[#D0D0D0]' />

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

                {(price || price > 0) &&
                    <div className="mt-4 flex items-center justify-between">
                        <Label htmlFor="airplane-mode" className='font-semibold text-xs'>Apply to all</Label>
                        <Switch id="airplane-mode" checked={applyFeeToAll} onCheckedChange={changeApplyFeeToAll} />
                    </div>
                }

                <button onClick={saveChapterFee}
                    disabled={price || price > 0 ? false : true}
                    className={`flex mt-4 items-center w-full justify-center gap-2 bg-[#5D4076] text-white cursor-pointer py-2 px-3 rounded-lg
                                    ${price > 0 ? "  hover:bg-[#765d8c]" : "opacity-50"}
                                    `}>
                    {!savingFee && <Image src="/icon/money-add.svg" alt="coins icon" width={14} height={14} />}
                    <span className="text-xs ">{savingFee ? "Please wait..." : "Set Fee"}</span>
                    {savingFee && <i className='bx bx-loader-circle bx-spin bx-flip-horizontal text-lg'></i>}
                </button>

                <Separator className='mt-3 mb-5' />

                <div className="flex items-center justify-between">
                    <Label htmlFor="make-free" className='font-semibold text-xs'>Make free</Label>
                    <Switch id="make-free" checked={makeFree} onCheckedChange={changeMakeFree} />
                </div>
                <p className="text-[10px] mt-1">You are about to make this free for your readers.</p>


            </div>
        </div>
    )
}

export default EditChapterFeeComponent
