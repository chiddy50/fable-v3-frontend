"use client"

import React, { useContext, useEffect, useState } from 'react'
import { Button } from './ui/button'
// import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { LogIn, LogOut } from 'lucide-react';

import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Adapters
import { getDefaultExternalAdapters, getInjectedAdapters } from "@web3auth/default-solana-adapter"; // All default Solana Adapters
import { SolanaPrivateKeyProvider, SolanaWallet } from "@web3auth/solana-provider";
import SolanaRpc from '@/app/solanaRPC';
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import { AppContext } from '@/context/MainContext';
import { useRouter } from 'next/navigation';
import { getUserAuthParams } from '@/services/AuthenticationService';

const clientId = "BHrmTySBsuDsBTQEQs4pMNXNI3Vf76pU41iX_eQ4FUPzAe8JguWC4u64-libfTfJPN1YPj8nKuIVz8g6OQ_fPaw"; // get from https://dashboard.web3auth.io

const AuthenticationButton = () => {
    // const { user, setShowAuthFlow, handleLogOut } = useDynamicContext()
    const [isMounted, setIsMounted] = useState(false);
    
    const { 
        web3auth, setWeb3auth,
        provider, setProvider,
        loggedIn, setLoggedIn,
    } = useContext(AppContext)
    const [openLogoutModal, setOpenLogoutModal] = useState<boolean>(false);

    const { push } = useRouter()

    const chainConfig = {
        chainId: "0x2",
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        rpcTarget: "https://api.devnet.solana.com",
        tickerName: "SOLANA",
        ticker: "SOL",
        decimals: 9,
        blockExplorerUrl: "https://explorer.solana.com/?cluster=devnet",
        logo: "https://images.toruswallet.io/sol.svg",
    };


    useEffect(() => {
        setIsMounted(true)
        if (isMounted === true) {
            
            const init = async () => {
                try {
                    const solanaPrivateKeyProvider = new SolanaPrivateKeyProvider({
                        config: { chainConfig: chainConfig },
                    });
    
                    const web3auth = new Web3Auth({
                        clientId,
                        // uiConfig refers to the whitelabeling options, which is available only on Growth Plan and above
                        // Please remove this parameter if you're on the Base Plan
                        uiConfig: {
                            appName: "W3A Heroes",
                            mode: "light",
                            // loginMethodsOrder: ["apple", "google", "twitter"],
                            logoLight: "https://web3auth.io/images/web3authlog.png",
                            logoDark: "https://web3auth.io/images/web3authlogodark.png",
                            defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
                            loginGridCol: 3,
                            primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
                            uxMode: "redirect",
                        },
                        web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
                        privateKeyProvider: solanaPrivateKeyProvider,
                    });
    
                    // Setup external adapaters
                    const adapters = await getInjectedAdapters({
                        options: {
                            clientId,
                            chainConfig,
                        },
                    });
                    adapters.forEach((adapter) => {
                        web3auth.configureAdapter(adapter);
                    });
    
                    setWeb3auth(web3auth);
    
                    await web3auth.initModal();
                    setProvider(web3auth.provider);
    
                    console.log("Web3Auth initialized")
    
                    if (web3auth.connected) {
                        console.log("CONNECTED");
                        getUserAuthParams(web3auth);

                        setLoggedIn(true)                
                        // const authenticated = await authenticateUser(web3auth);
                    }else{
                        console.log("NOT CONNECTED");                                               
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            init();
        }

    }, [isMounted]);

    function uiConsole(...args: any[]): void {
        const el = document.querySelector("#console>p");
        if (el) {
            el.innerHTML = JSON.stringify(args || {}, null, 2);
        }
    }

    const getUserInfo = async () => {
        if (!web3auth) {
          uiConsole("web3auth not initialized yet");
          return;
        }
        const user = await web3auth.getUserInfo();
        console.log(user);
        
        uiConsole(user);
    };
    

    const login = async () => {
        try {
            console.log(web3auth);
            
            if (!web3auth) {
                uiConsole("web3auth not initialized yet");
                return;
            } 
    
            const web3authProvider = await web3auth.connect();
            console.log({connected: web3auth.connected});
            
            setProvider(web3authProvider);
            
            if (web3auth.connected) {  
                console.log("CONNECTED AFTER LOGIN");
                setLoggedIn(true);
                const authenticated = await authenticateUser(web3auth)
            }else{
                console.log("NOT CONNECTED AFTER LOGIN");
                
            }
            
        } catch (error) {
            console.error(error);            
        }        
    };

    const authenticateUser = async (web3auth: Web3Auth) => {
        try {
            
            if (!web3auth.provider) {
                return;
            }
            const user = await web3auth.getUserInfo();
            console.log(user);
            const token = await web3auth.authenticateUser(); // Get JWT token
            console.log(token);
    
            let payload = {}
            // Get user's Solana public address for wallet logins
            const solanaWallet = new SolanaWallet(web3auth.provider);
            const address = await solanaWallet?.requestAccounts(); 

            localStorage.setItem("idToken", token.idToken);

            if (Object.keys(user).length === 0) {
                console.log("WALLET AUTHENTICATION");
                console.log({address});
                payload.publicAddress = address[0];
                localStorage.setItem("publicAddress", address?.[0]);
            }
    
            if (Object.keys(user).length > 0) {
                console.log("SOCIAL AUTHENTICATION");
    
                let { email, name, typeOfLogin, verifierId, verifier } = user;
                
                // get users public key for social logins
                const app_scoped_privkey: any = await web3auth?.provider?.request({
                    method: "solanaPrivateKey",
                });            
                const ed25519Key = getED25519Key(Buffer.from(app_scoped_privkey.padStart(64, "0"), "hex"));
                const app_pub_key = ed25519Key.pk.toString("hex"); 
                console.log({app_pub_key});
                payload.appPubKey = app_pub_key;
                localStorage.setItem("appPubKey", app_pub_key);
            }
            
    
            // pass either address or app_pub_key
    
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/verify-jwt`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token.idToken, // or token.idToken
                },
                body: JSON.stringify(payload),
            });
            const parsedResponse = res.json();
            console.log(parsedResponse);
            
            // Save idToken to localStorage for further requests
            user?.idToken && localStorage.setItem("authToken", user?.idToken);
        } catch (error) {
            console.error(error);            
        }
    }

    const getUserPubKey = async () => {
        if (!web3auth) {
            uiConsole("web3auth not initialized yet");
            return;
        }
        const app_scoped_privkey = await web3auth.provider?.request({
            method: "solanaPrivateKey",
        });
        
        const ed25519Key = getED25519Key(Buffer.from(app_scoped_privkey.padStart(64, "0"), "hex"));
        const app_pub_key = ed25519Key.pk.toString("hex");
        console.log(app_pub_key);
        return app_pub_key;         
    }

    const logout = async () => {
        console.log(web3auth);
        
        if (!web3auth) {
          uiConsole("web3auth not initialized yet");
          return;
        }

        // setOpenLogoutModal(true);    
        await web3auth.logout();

        localStorage.removeItem("idToken");
        localStorage.removeItem("publicAddress");
        localStorage.removeItem("appPubKey")
        setProvider(null);
        setLoggedIn(false);
        setOpenLogoutModal(false);
        push(`/`)    
    };

    const confirmLogout = async () => {
        await web3auth.logout();

        localStorage.removeItem("idToken");
        localStorage.removeItem("publicAddress");
        localStorage.removeItem("appPubKey")
        setProvider(null);
        setLoggedIn(false);
        setOpenLogoutModal(false);
        push(`/`)
    }

    const loggedInView = (
        <div className='flex items-center gap-4'>
            <div className="flex items-center bg-white py-2 px-3 border gap-2 rounded-3xl">
                <div className="border cursor-pointer flex items-center rounded-full hover:bg-gray-700 hover:text-white hover:border-white pr-2">                        
                    <div className="h-6 w-6 rounded-full flex items-center justify-center ">
                        <i className='bx bx-copy text-xs'></i>
                    </div>
                    <p className="text-[9px]" id="primary-wallet-address">
                        zkdmdv...vdsmds
                    </p>
                </div>
                <div className="border cursor-pointer h-6 w-6 rounded-full flex items-center justify-center hover:bg-gray-700 hover:text-white hover:border-white">
                    <i className="bx bx-user text-xs"></i>
                </div>
            </div>
            <Button
            onClick={logout} 
            variant="outline" 
            className='flex items-center gap-1 border-green-400 text-green-500 hover:text-green-400'>
                <span>Logout</span>
                <LogIn className='w-4 h-4'></LogIn>
            </Button>
        {/* <Button
        onClick={getUserPubKey} 
        variant="outline" 
        className='flex items-center gap-1 border-green-400 text-green-500 hover:text-green-400'>
            <span>Test</span>
        </Button> */}
        </div>
    )

    const unloggedInView = (
        <>
        <Button
        onClick={login} 
        variant="outline" 
        className='flex items-center gap-1 border-green-400 text-green-500 hover:text-green-400'>
            <span>Login</span>
            <LogIn className='w-4 h-4'></LogIn>
        </Button>
        
        </>
        
    )

    return (
        <div className=''>
            {/* <div className='absolute top-5 right-5'> */}
            <div className="">{loggedIn ? loggedInView : unloggedInView}</div>

            <AlertDialog open={openLogoutModal} onOpenChange={setOpenLogoutModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={confirmLogout}>Logout</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default AuthenticationButton
