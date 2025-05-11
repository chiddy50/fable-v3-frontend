"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { ArrowDownUp, ArrowRight, DollarSign, Info, ShieldCheck } from 'lucide-react';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { UserInterface } from '@/interfaces/UserInterface';
import BuyCreditComponent from '../credit/BuyCreditComponent';
import WalletIndicator from '../wallet/WalletIndicator';
import { useWallet } from "@solana/wallet-adapter-react";
import { getTokensInUsersWallet } from '@/lib/solana';
import TokenDropdown from '../credit/TokenDropdown';
import { toast } from 'sonner';

const TopUpCreditComponent = () => {
    const [price, setPrice] = useState<number>(1);
    const [tokenPrice, setTokenPrice] = useState<number>(0);
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [user, setUser] = useState<UserInterface|null>(null);

    const [tokens, setTokens] = useState([]);
    const [tokenSelected, setTokenSelected] = useState({
        name: null,
        price: null,
        mint: null,
    })
    const { publicKey, connected, sendTransaction, signTransaction } = useWallet();
    const network =  "https://mainnet.helius-rpc.com/?api-key=" 
    // const network = process.env.NEXT_PUBLIC_VITE_ENV == "dev" ? "https://devnet.helius-rpc.com/?api-key=" : "https://mainnet.helius-rpc.com/?api-key="
    const API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY 


    useEffect(() => {
        const fetchTokensList = async () => {
          if (!connected || !publicKey || !API_KEY) return
          // Please connect your Helius RPC 
          const userTokens = await getTokensInUsersWallet(publicKey, network, API_KEY);
          console.log(userTokens);
          
          setTokens(userTokens)
          if (userTokens?.length <= 0) return;

        //   const price = (totalPrice * userTokens[0].balance) / userTokens[0].usdc_price;
        //   setTokenSelected({ name: userTokens[0].name, price, mint: userTokens[0].mint })
        }
    
        fetchTokensList();
    }, [connected, publicKey, 
        // totalPrice
    ])

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

    const handleTokenSelect = (token) => {
        console.log('Selected token:', token);
        // Do something with the selected token
        let amount = token?.usdc_price ? Number(token?.usdc_price) : 0;
        convertTokenValue(amount)
    };

    const handlePayment = async () => {
        if (!publicKey) {
          toast.error("Please connect your wallet");
          return;
        }
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
                    value={price}                                                 
                    className='w-full h-full py-3 px-1 border-none bg-white outline-0 text-sm' 
                    placeholder="0.00" />
                </div>
                <div className="flex items-center gap-2 mt-2 text-gray-500">
                    <Info size={14} onClick={() => setShowInfo(!showInfo)} className='cursor-pointer hover:text-gray-400'/>
                    <p className='text-[10px]'>
                        More info
                        {/* Max amount is $5 */}
                    </p>
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
                {/* <BuyCreditComponent amount={price} getAuthor={getAuthor}  />

                <div className="flex items-center justify-center my-2 text-gray-400">
                    or
                </div> */}
                <div className="flex flex-col items-start gap-1 ">
                    <label className='font-bold text-xs mb-2 text-gray-600'>Choose token to pay with</label>
                    <TokenDropdown
                        tokens={tokens.length > 0 ? tokens : []} 
                        onSelect={handleTokenSelect} 
                        placeholder="Choose a token" 
                    />
                </div>
                <div className="flex items-center justify-center mt-4">
					<WalletIndicator />
                    

                </div>

                <div onClick={handlePayment} className="flex justify-center mt-4">
                    <button className="py-3 px-3 w-[222px] font-bold flex items-center justify-center cursor-pointer text-white bg-black hover:bg-[#3f3f3f] rounded-md gap-3">
                        <span className='text-xs'>Make Payment</span>
                        <i className="bx bx-money text-2xl"></i>
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
