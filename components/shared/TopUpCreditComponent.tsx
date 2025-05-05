"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { ArrowDownUp, ArrowRight, DollarSign, Info, ShieldCheck } from 'lucide-react';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { UserInterface } from '@/interfaces/UserInterface';
import BuyCreditComponent from '../credit/BuyCreditComponent';

const TopUpCreditComponent = () => {
    const [price, setPrice] = useState<number>(1);
    const [tokenPrice, setTokenPrice] = useState<number>(0);
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [user, setUser] = useState<UserInterface|null>(null);


    useEffect(() => {
        getAuthor();
    }, []);

    const getAuthor = async () => {
        try {
            const response = await axiosInterceptorInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/auth`)
            console.log(response);
            setUser(response?.data?.user)
        } catch (error) {
            console.error(error);            
        }
    }

    const convertTokenValue = (amount: string|number) => {
        let tokenValue = Number(amount) * 100;
        setPrice(Number(amount))
        setTokenPrice(tokenValue);
    }


    return (
        <div className="p-5 relative">

            <div className="flex items-center justify-center">
                <div className='flex items-center gap-3'>
                    <div className="bg-[#F5F5F5] flex items-center justify-center relative rounded-full w-12 h-12 ">
                        <Image src="/icon/dollar.svg" alt="dollar icon" className="" width={16} height={16} />                    
                    </div>
                    <ArrowRight size={16} className='text-gray-400'/>
                    <Image src="/icon/coins-light.svg" alt="coins icon" className=" " width={40} height={40} />                            
                    
                </div>

            </div>
            <h1 className="font-bold text-2xl text-center mt-2">Purchase Credits</h1>

            <div className="mt-7">

                <p className='font-bold text-xs mb-2 text-gray-600'>Amount</p>
                <div className="flex items-center border bg-white px-2 rounded-xl border-[#f0f0f0]">
                    <DollarSign size={19} />
                    <input type="number" 
                    onChange={(e) => convertTokenValue(e.target.value)} 
                    // value={price}                                                 
                    className='w-full h-full py-3 px-1 border-none bg-white outline-0 text-sm' 
                    placeholder="0.00" />
                </div>
                <div className="flex items-center gap-2 mt-2 text-gray-500">
                    <Info size={14} onClick={() => setShowInfo(!showInfo)} className='cursor-pointer hover:text-gray-400'/>
                    <p className='text-[10px]'>Max amount is $5</p>
                </div>
            </div>

            <div className="mt-5">
                <p className='font-bold text-xs mb-2 text-gray-600'>You'll receive</p>
                <div className="flex items-center bg-[#F5F5F5] border w-[30%] border-[#F5F5F5] px-2 rounded-xl ">
                    <Image src="/icon/coins-light.svg" alt="coins icon" width={18} height={18} />
                    <input 
                    type="text" disabled 
                    value={tokenPrice}                                                 
                    className='w-full h-full p-3 border-none outline-0 text-sm' 
                    placeholder="0.00" />
                </div>
            </div>

            <div className="mt-7">
                <BuyCreditComponent amount={price} getAuthor={getAuthor}  />

                <div className="flex items-center justify-center my-2 text-gray-400">
                    or
                    {/* <ArrowDownUp size={16} /> */}
                </div>
                <div className="flex items-center justify-center">

                    <button 
                    className="py-3 px-4 w-[222px] font-bold flex items-center justify-center cursor-pointer text-white bg-black hover:bg-[#3f3f3f] rounded-md gap-3">
                        <span className='text-xs'>Connect Wallet</span>
                        <i className="bx bx-wallet text-2xl"></i>
                    </button>
                </div>
                                
            </div>

            <div className="mt-5 flex items-center justify-center gap-1">
                <ShieldCheck className='text-[#57DE2A]' size={20} />
                <span className='text-[#A2A2A2] text-[10px] font-medium'>100% Secured</span>
            </div>




            {
                showInfo &&
                <div className={`absolute h-[45%] flex flex-col justify-around right-0 bottom-0 w-full bg-gray-100 rounded-2xl`}>
                    <div>
                        <h1 className="text-center mb-3  text-gray-600 font-bold">Coin System</h1>
                        <p className="text-xs text-center font-light px-5 text-gray-600">
                        $1 is equivalent to 50 FabCoins, the least amount is $0.5 that’s 25coins, with this you can generate AI stories, build characters and more.
                        </p>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className='flex items-center gap-3'>                    
                            <Image src="/icon/dollar.svg" alt="dollar icon" className="" width={16} height={16} />                    
                            <ArrowRight size={16} className='text-gray-400'/>
                            <Image src="/icon/coins-light.svg" alt="coins icon" className=" " width={40} height={40} />                            
                            
                        </div>
                    </div>

                </div>
            }

        </div>
    )
}

export default TopUpCreditComponent
