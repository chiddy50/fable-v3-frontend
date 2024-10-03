// "use client";

// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

// const DashboardPage = () => {

//   const { user } = useDynamicContext();
  
//   return (
//     <div className='h-full min-h-screen relative w-full'>


//       <h1 className="text-3xl text-gray-700 font-semibold mt-10 text-center ">
//         <span className='capitalize text-xl'>Hi {user?.username}</span>,<br/> What are you doing today?
//       </h1>

//       <div className="mt-10">
//         <div className='grid gap-5 mx-auto  bg-white p-7 rounded-2xl 
//         grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2
//         w-[95%] md:w-[80%] lg:w-[60%] xl:w-[50%]
//         '>
          
//           <Link href="/dashboard/story-books" className='border rounded-2xl hover:border-gray-700 cursor-pointer'>
//             <div>
//               <Image src="/book_2.svg" alt="image" className="w-full object-cover rounded-tl-2xl rounded-tr-2xl" width={200} height={200} />
//             </div>
//             <div className='p-5 bg-gray-50 flex justify-center rounded-bl-2xl rounded-br-2xl'>
//               <h1 className='font-bold text-gray-700 '>Story Book</h1>
//             </div>
//           </Link>

//           <Link href="/dashboard/stories" className='border rounded-2xl hover:border-gray-700 cursor-pointer'>
//             <div>
//               <Image src="/wizard_2.svg" alt="image" className="w-full object-cover rounded-tl-2xl rounded-tr-2xl" width={200} height={200} />
//             </div>
//             <div className='p-5 bg-gray-50 flex justify-center rounded-bl-2xl rounded-br-2xl'>
//               <h1 className='font-bold text-gray-700'>Write Story</h1>
//             </div>
//           </Link>

//         </div>
//       </div>

//     </div>
//   )
// }

// export default DashboardPage
"use client";

import React, { useEffect, useState } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowDown, ArrowUp, Wallet } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { cn } from '@/lib/utils';
import { trimWords, truncateString } from '@/lib/helper';
import { TransactionInterface } from '@/interfaces/TransactionInterface';

const DashboardPage = () => {
    const [transactions, setTransactions] = useState<[]>([])

    const dynamicJwtToken = getAuthToken();
    const { user } = useDynamicContext();

    useEffect(() => {
        getTransactions()
        
    }, [])
    // const { data: transactionData, isFetching, isError, refetch } = useQuery({
    //     queryKey: ['storyFromScratchFormData', user?.email],
    //     queryFn: async () => {
    //         let url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/user`;
    
    //         const response = await axiosInterceptorInstance.get(url,
    //           {
    //             headers: {
    //               Authorization: `Bearer ${dynamicJwtToken}`
    //             }
    //           }
    //         );
    //         console.log(response);
            
    //         if (response?.data?.transactions) {
    //             setTransactions(response?.data?.transactions);
    //         }
    //         return response?.data?.transactions;
    //     },
    //     // enabled: !transactions
    // });
    const getTransactions = async () => {
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/user`;
    
        const response = await axiosInterceptorInstance.get(url,
            {
                headers: {
                    Authorization: `Bearer ${dynamicJwtToken}`
                }
            }
        );
        console.log(response);
        
        if (response?.data?.transactions) {
            setTransactions(response?.data?.transactions);
        }
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
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-3xl text-gray-700 font-semibold mt-10 text-center ">
                <span className='capitalize text-xl'>Welcome, {user?.username}</span>
            </h1>

            <div className='grid gap-5 mt-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                <div className='flex gap-5 bg-gray-50 p-5 rounded-2xl'>
                    <div className='flex items-center justify-center w-10 h-10 bg-custom_green text-gray-50 rounded-full'>
                        <ArrowDown />
                    </div>
                    <div className="flex flex-col justify-between">
                        <p className="font-bold text-md">+$12,000.00</p>
                        <p className='text-xs font-light'>Income</p>
                    </div>
                </div>

                <div className='flex gap-5 bg-gray-50 p-5 rounded-2xl'>
                    <div className='flex items-center justify-center w-10 h-10 bg-red-600 text-gray-50 rounded-full'>
                        <ArrowUp />
                    </div>
                    <div className="flex flex-col justify-between">
                        <p className="font-bold text-md">-$12,000.00</p>
                        <p className='text-xs font-light'>Outcome</p>
                    </div>
                </div>

                <div className='flex gap-5 bg-gray-50 p-5 rounded-2xl'>
                    <div className='flex items-center justify-center w-10 h-10 bg-blue-600 text-gray-50 rounded-full'>
                        <Wallet />
                    </div>
                    <div className="flex flex-col justify-between">
                        <p className="font-bold text-md">$12,000.00</p>
                        <p className='text-xs font-light'>Balance</p>
                    </div>
                </div>
            </div>

            <div className="my-10 bg-white p-7 rounded-2xl">
                <h1 className="text-xl font-bold mb-5">Transactions</h1>

                {
                    transactions.length > 0 && transactions?.map((transaction: TransactionInterface) =>  (
                        <div key={transaction?.id} className='flex gap-5 bg-gray-50 p-5 mb-3 border rounded-2xl'>
                            <div className={
                                cn(
                                    "flex items-center self-center justify-center w-7 h-7 border  text-gray-50 rounded-full",
                                    transaction?.type === 'create-story' ? "border-red-600" : "border-custom_green"
                                )
                            }>
                                
                                { transaction?.type === 'create-story' && <ArrowUp className='w-5 h-5 text-red-600'/> }
                                { transaction?.type === 'read-story' && <ArrowDown className='w-5 h-5 text-custom_green'/> }
                            </div>
                            <div className='flex flex-[80%] flex-col'>
                                <div className='flex xs:flex-col sm:flex-row xs:gap-2 sm:gap-2 justify-between'>
                                    <p className="text-sm font-bold">{transaction?.narration}</p>
                                    {
                                      transaction?.status === 'initiated' && <p className="text-xs text-blue-600 capitalize font-semibold">{transaction?.status}</p>
                                    }
                                    {
                                        transaction?.status === 'completed' && <p className="text-xs text-custom_green capitalize font-semibold">{transaction?.status}</p>
                                    }
                                </div>
                                <div className='flex xs:flex-col sm:flex-row xs:gap-2 sm:gap-2 justify-between'>
                                    <p className="text-[10px] text-gray-500">${transaction?.amount}</p>
                                    {/* <p className="text-[10px] text-gray-500">July 12th 2025</p> */}
                                    <p className="text-[10px]">{truncateString(transaction?.deposit_address)}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }


            </div>
        </div>
    )
}

export default DashboardPage
