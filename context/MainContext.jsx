"use client"

import { createContext, useContext, useState, useEffect } from "react";


export const AppContext = createContext();

export function MainContext({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [address, setAddress] = useState("");
    const [firstTimeLogin, setFirstTimeLogin] = useState(true);
    const [showTopUpCreditModal, setShowTopUpCreditModal] = useState(false);
    const [mobileSideNavIsOpen, setMobileSideNavIsOpen] = useState(false);

    useEffect(() => {
        if (typeof window === 'object') {
            let userData = localStorage?.getItem("user");
            setUser(JSON?.parse(userData))
        }
    }, []);

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("storyId");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("storyId");
        setIsLoggedIn(false);
        window.location.href = "/"
    };

    return (
        <AppContext.Provider value={{
            isLoggedIn, setIsLoggedIn,
            loggedIn, setLoggedIn,
            isMounted, setIsMounted,
            address, setAddress,
            firstTimeLogin, setFirstTimeLogin,
            user, setUser,
            showTopUpCreditModal, setShowTopUpCreditModal,
            mobileSideNavIsOpen, setMobileSideNavIsOpen,
            logout
        }}>
            {children}
        </AppContext.Provider>
    );
}