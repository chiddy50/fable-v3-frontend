"use client"

import { MainContext } from '@/context/MainContext' 
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { toast } from 'sonner';

export const queryClient = new QueryClient(
  // {
  //   defaultOptions: {
  //     queries: {
  //       refetchOnWindowFocus: false,
  //       retry: 0,
  //       keepPreviousData: true,
  //     },
  //   },
  // }
);


const CustomContext = ({ children }) => {

  return (

    <MainContext>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MainContext> 

  )
}

export default CustomContext