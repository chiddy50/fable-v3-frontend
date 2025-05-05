"use client"

import React, { useContext, useEffect, useState } from 'react';
import SetupUserProfileComponent from "@/components/onboarding/SetupUserProfileComponent";
import GenreChoiceComponent from "@/components/onboarding/GenreChoiceComponent";
import VibeChoiceComponent from '@/components/onboarding/VibeChoiceComponent';
import UserTypeSelection from '@/components/onboarding/ChooseRoleComponent';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { UserInterface } from '@/interfaces/UserInterface';
import { AppContext } from '@/context/MainContext';

export default function RegistrationForm() {
	
	const [currentOnboardingStep, setCurrentOnboardingStep] = useState<number>(1);
    // const [user, setUser] = useState<UserInterface|null>(null);

	const { user, setUser } = useContext(AppContext);

	useEffect(() => {
        getAuthor();
    }, []);

    const getAuthor = async () => {
        try {
            const response = await axiosInterceptorInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/auth`)
            console.log(response);
            setUser(response?.data?.user)
			localStorage?.setItem("user", JSON.stringify(response?.data?.user));

			
        } catch (error) {
            console.error(error);            
        }
    }

	return (
		<div className="flex items-center justify-center min-h-screen bg-white">
			{ (currentOnboardingStep === 1 && user) && 
				<SetupUserProfileComponent 
					setCurrentOnboardingStep={setCurrentOnboardingStep} 
					user={user} 
					getAuthor={getAuthor} 
				/> 
			}

			{ (currentOnboardingStep === 2 && user) && 
				<GenreChoiceComponent 
					setCurrentOnboardingStep={setCurrentOnboardingStep}  
					user={user} 			
					getAuthor={getAuthor} 
				/> 			
			}

			{ (currentOnboardingStep === 3 && user) && 
				<VibeChoiceComponent 
					setCurrentOnboardingStep={setCurrentOnboardingStep} 
					user={user} 			
					getAuthor={getAuthor}
				/> 
			}
			{ (currentOnboardingStep === 4 && user) && 
				<UserTypeSelection 
					setCurrentOnboardingStep={setCurrentOnboardingStep} 
					user={user} 			
					getAuthor={getAuthor}
				/> 
			}
			
		</div>
	);
}