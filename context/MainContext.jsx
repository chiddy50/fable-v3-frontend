"use client"

import { createContext, useContext, useState, useEffect } from "react";

export const AppContext = createContext();

export function MainContext({ children }) {
    const [chatbotConversation, setChatbotConversation] = useState([]);


    return (
        <AppContext.Provider value={{ 
            chatbotConversation, setChatbotConversation,
            
        }}>
            {children}
        </AppContext.Provider>
    );
}