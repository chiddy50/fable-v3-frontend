"use client"

import React, { useContext, useEffect, useState } from "react";
import { usePrivy, useLoginWithOAuth, useLogin } from '@privy-io/react-auth';
import { AppContext } from "@/context/MainContext";
import axios from "axios"
import { useRouter } from 'next/navigation'


interface PrivyLoginInterface{
	id: string;
	google: {
		name: string;
		email: string;
		subject: string;
	}
}

interface Props {
    children: React.ReactNode;
    newUserRedirectUrl: string;
    existingUserRedirectUrl?: string;
    redirect: boolean;
}

const PrivyLoginComponent: React.FC<Props> = ({
    children,
    newUserRedirectUrl,
    existingUserRedirectUrl,
    redirect
}) => {
	const { getAccessToken, ready, authenticated, logout } = usePrivy();
    const router = useRouter();

    const { 
        user, setUser, 
    } = useContext(AppContext)

    const { login } = useLogin();
	const { state, loading, initOAuth } = useLoginWithOAuth({
        onComplete: ({ user, isNewUser }) => {
			console.log('User logged in successfully', user, {isNewUser});
			
			if (isNewUser) {
				authenticateUser(user, "register", isNewUser)				
            }else{
				authenticateUser(user, "login", isNewUser)
			}
        },
        onError: (error) => {
            console.error('Login failed', error);
        },
    });

    const authenticateUser = async (user: PrivyLoginInterface, route: string, isNewUser: boolean) => {
		try{
			const authToken = await getAccessToken();

			let payload = {
				privyId: user?.id,
				name: user?.google?.name,
				email: user?.google?.email,
			}

			const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/auth/${route}`, 
				payload,
				{
					headers: {
						Authorization: `Bearer ${authToken}`
					}
				}
			);

			console.log(res)
			let userResponse = res?.data?.user;
			localStorage.setItem("user", JSON.stringify(userResponse)); 
            setUser(userResponse)
            if (redirect) {
                const redirectUrl = isNewUser ? newUserRedirectUrl : existingUserRedirectUrl;
                router.push(redirectUrl);                
            }

		}catch(e){
			console.error(e)
		}
	}

    const handleLogin = async () => {
		try {
			// The user will be redirected to OAuth provider's login page
			await initOAuth({ provider: 'google' });
		} catch (err) {
			// Handle errors (network issues, validation errors, etc.)
			console.error(err);
		}
	};

    return (
        <div onClick={handleLogin}>
            {children}
        </div>
    )
}

export default PrivyLoginComponent
