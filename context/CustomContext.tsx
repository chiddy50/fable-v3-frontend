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
      return true;
      console.log(res);        
    } catch (error) {
      return false;
      console.log(error);            
    }
  }

  function getCurrentPath() {
    // Get the full path
    let path = window?.location?.pathname;
    
    // Remove any trailing slash, except if the path is just "/"
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    return path;
  }

  const { push } = useRouter();

  return (
      <DynamicContextProvider 
        settings={{ 
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? "b12e98f0-cc6b-496b-9981-28c4b6a685c6",
          walletConnectors: [ SolanaWalletConnectors ],
          eventsCallbacks: {
            onAuthSuccess: async (args) => {
              console.log('onLinkSuccess was called', args);
              
              console.log({ currentPath: getCurrentPath() });
              
              let { authToken, primaryWallet, user } = args

              let payload = {
                // token: authToken,
                publicAddress: primaryWallet?.address,
                email: user?.email,
                username: user?.username,
                id: user?.userId,
              }

              const userCreated = await createUser(payload);

              if (userCreated && getCurrentPath() && getCurrentPath() === "/") {
                // push("/dashboard");                
              }

              const redirectRoute = window?.localStorage?.getItem('redirectRoute');
              if (userCreated && getCurrentPath() === "/" && redirectRoute) {                
                window?.localStorage?.removeItem('redirectRoute');
                push(`${redirectRoute}`);                
              }

            },
            onLogout(user) {
              console.log(user);
              window?.localStorage?.removeItem('redirectRoute')
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