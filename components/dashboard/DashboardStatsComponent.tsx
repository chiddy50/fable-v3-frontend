"use client"

import React, { useContext, useEffect } from 'react'
import { ArrowDown, ArrowUp, Eye, Plus } from 'lucide-react';
import Image from 'next/image';
import { AppContext } from '@/context/MainContext';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';

const DashboardStatsComponent = () => {
    const { setShowTopUpCreditModal, user, setUser } = useContext(AppContext)

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
            const response = await axiosInterceptorInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/auth`)
            setUser(response?.data?.user)
        } catch (error) {
            console.error(error);            
        }
    }

    return (
        <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1">
                <p className='font-bold bg-white flex items-center text-sm p-3 rounded-xl mb-2 h-[30%]'>Credit Balance</p>
                <div className='flex flex-col justify-between bg-white p-2 rounded-xl h-[70%]'>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Image src="/icon/coins.svg" alt="icon" className=" " width={20} height={20} />
                            <p className="font-bold text-2xl">{user?.credits ?? 0}
                                {/* .<span className='text-xs font-normal'>00</span> */}
                            </p>
                        </div>

                        <div className="bg-[#F5F5F5] rounded-xl p-1 cursor-pointer border border-[#F5F5F5] text-gray-500">
                            <Eye size={14} />
                        </div>
                    </div>

                    <div 
                    onClick={() => setShowTopUpCreditModal(true)}
                    className="bg-black p-2 cursor-pointer text-white flex items-center justify-between rounded-lg hover:bg-gray-800 transition-all">
                        <div className="flex items-center gap-3">
                            <Plus size={15} className='' />
                            <p className='text-xs'>TopUp Credit</p>
                        </div>

                        <Image src="/icon/getcode.svg" alt="icon" className=" " width={25} height={25} />
                    </div>
                </div>
            </div>
            <div className="col-span-1">
                <div className=' bg-white p-3 rounded-xl mb-2 h-[50%]'>
                    <p className=" text-gray-500 mb-1 text-sm">Total Earnings</p>

                    <div className="flex items-center justify-between"> 
                        <div className="flex items-center gap-2">
                            <Image src="/icon/coins.svg" alt="icon" className=" " width={16} height={16} />
                            <p className="font-bold text-2xl">200,000</p>
                        </div>
                        <ArrowUp size={15} className='text-green-600' />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-2 bg-white p-2 rounded-xl h-[50%]'>
                    <div className='bg-[#F5F5F5] p-2 rounded-xl'>
                        <p className=" text-gray-500 mb-1 text-xs">Fees</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Image src="/icon/coins.svg" alt="icon" className=" " width={15} height={15} />
                                <p className="font-bold text-md text-gray-500">200,000</p>
                            </div>

                            <ArrowDown size={15} className='text-red-600' />
                        </div>
                    </div>
                    <div className='bg-[#F5F5F5] p-2 rounded-xl'>
                        <p className=" text-gray-500 mb-1 text-xs">Spent</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Image src="/icon/coins.svg" alt="icon" className=" " width={15} height={15} />
                                <p className="font-bold text-md text-gray-500">200,000</p>
                            </div>

                            <ArrowDown size={15} className='text-red-600' />
                        </div>
                    </div>
                </div>

            </div>
            <div className="col-span-1">
                <div className="flex items-center justify-between bg-white p-3 rounded-xl mb-2 h-[30%]">
                    <p className=" text-gray-500 text-sm">Total Stories</p>
                    <p className="font-bold text-xl">200</p>
                </div>

                <div className='grid grid-cols-2 gap-2 rounded-xl h-[70%]'>
                    <div className="flex flex-col justify-between bg-white p-3 rounded-xl">
                        <Image src="/icon/pen.svg" alt="generate icon" width={17} height={17} />
                        <p className="text-xs">Original</p>
                        <p className="font-bold text-2xl">200</p>
                    </div>
                    <div className="flex flex-col justify-between bg-white p-3 rounded-xl">
                        <Image src="/icon/magic-pen.svg" alt="generate icon" width={17} height={17} />

                        <p className="text-xs">With AI</p>
                        <p className="font-bold text-2xl">200</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default DashboardStatsComponent
