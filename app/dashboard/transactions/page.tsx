import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ArrowDown, ArrowUp, Wallet } from 'lucide-react'

const DashboardTransactionsPage = () => {
    return (
        <div>
            <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbPage>Transactions</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
            </Breadcrumb>

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

                <div className='flex gap-5 bg-gray-50 p-5 mb-3 border rounded-2xl'>
                    <div className='flex items-center self-center justify-center w-7 h-7 border border-custom_green text-gray-50 rounded-full'>
                        <ArrowDown className='w-5 h-5 text-custom_green'/>
                    </div>
                    <div className='flex flex-[80%] flex-col'>
                        <div className='flex justify-between'>
                            <p className="text-sm font-bold">Sample narration</p>
                            <p className="text-[10px] text-custom_green">Completed</p>
                        </div>
                        <div className='flex justify-between'>
                            <p className="text-[10px] text-gray-500">July 12th 2025</p>
                            <p className="text-[10px]">MS3MMDMDSLD</p>
                        </div>
                    </div>
                </div>

                <div className='flex gap-5 bg-gray-50 p-5 border rounded-2xl'>
                    <div className='flex items-center self-center justify-center w-7 h-7 border border-red-600 text-gray-50 rounded-full'>
                        <ArrowUp className='w-5 h-5 text-red-600'/>
                    </div>
                    <div className='flex flex-[80%] flex-col'>
                        <div className='flex justify-between'>
                            <p className="text-sm font-bold">Sample narration</p>
                            <p className="text-[10px] text-red-600">Completed</p>
                        </div>
                        <div className='flex justify-between'>
                            <p className="text-[10px] text-gray-500">July 12th 2025</p>
                            <p className="text-[10px]">MS3MMDMDSLD</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardTransactionsPage
