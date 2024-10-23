"use client"

import { createContext, useContext, useState, useEffect } from "react";
import { Web3Auth } from "@web3auth/modal";
import { IProvider } from "@web3auth/base";

export const AppContext = createContext();

export function MainContext({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [web3auth, setWeb3auth] = useState(null);
    const [provider, setProvider] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [address, setAddress] = useState("");

    const login = async () => {
        console.log(web3auth);        
        try {            
            if (!web3auth) {
                uiConsole("web3auth not initialized yet");
                return;
            } 
    
            const web3authProvider = await web3auth.connect();
            setProvider(web3authProvider);
            console.log({connected: web3auth.connected});
            
            if (web3auth.connected) {            
                setLoggedIn(true);    
            }
            
        } catch (error) {
            console.error(error);            
        }        
    };

    function uiConsole(...args) {
        const el = document.querySelector("#console>p");
        if (el) {
            el.innerHTML = JSON.stringify(args || {}, null, 2);
        }
    }

    return (
        <AppContext.Provider value={{ 
            isLoggedIn, setIsLoggedIn,
            web3auth, setWeb3auth,
            provider, setProvider,
            loggedIn, setLoggedIn,
            isMounted, setIsMounted,
            address, setAddress,
            login, uiConsole
        }}>
            {children}
        </AppContext.Provider>
    );
}