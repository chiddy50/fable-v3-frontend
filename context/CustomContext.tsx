"use client"
import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { MainContext } from '@/context/MainContext' 
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';

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
  const createUser = async (payload: any) => {
    try {
      let res = await axiosInterceptorInstance.post("/users", payload)
      console.log(res);        
    } catch (error) {
      console.log(error);            
    }
  }

  const { push } = useRouter();

  return (
      <DynamicContextProvider 
        settings={{ 
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? "",
          walletConnectors: [ SolanaWalletConnectors ],
          eventsCallbacks: {
            onAuthSuccess: (args) => {
              console.log('onLinkSuccess was called', args);
              let { authToken, primaryWallet, user } = args

                let payload = {
                  // token: authToken,
                  publicAddress: primaryWallet?.address,
                  email: user?.email,
                  username: user?.username,
                  id: user?.userId,
                }

                createUser(payload)
            },
            onLogout(user) {
              console.log(user);
              toast.error("Session Expired");
              push("/");
            },
          }
        }}
      > 
          <MainContext>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

          </MainContext>  

      </DynamicContextProvider>

  )
}

export default CustomContext