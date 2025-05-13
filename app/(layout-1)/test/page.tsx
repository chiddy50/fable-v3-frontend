"use client"

import { usePrivy, useLoginWithOAuth, useLogin } from '@privy-io/react-auth';
import { Button } from "@/components/ui/button";
import axios from "axios"

interface PrivyLoginInterface{
	id: string;
	google: {
		name: string;
		email: string;
		subject: string;
	}
}


export default function TestPage() {
	
	const { getAccessToken, ready, authenticated, logout } = usePrivy();

	const { login } = useLogin();
	const { state, loading, initOAuth } = useLoginWithOAuth({
        onComplete: ({ user, isNewUser }) => {
            console.log('User logged in successfully', user, {isNewUser});
			authenticateUser(user, "login")
			// redirect to dashboard

            if (isNewUser) {
				authenticateUser(user, "register")
                // Perform actions for new users
				console.log("A new user has to be created")

				// redirect to on-boarding screen
				
            }
        },
        onError: (error) => {
            console.error('Login failed', error);
        },
    });

	const disableLogout = !ready || (ready && !authenticated);
	const disableLogin = !ready || (ready && authenticated);

	const authenticateUser = async (user: PrivyLoginInterface, route: string) => {
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

			let userStored = localStorage.getItem("user");
			if(!userStored){
				console.log("Store the user")
				localStorage.setItem("user", JSON.stringify(user));  
			}
			 

			console.log(res)

		}catch(e){
			console.error(e)
		}
	}

	const getToken = async () => {
		const authToken = await getAccessToken();
		console.log({
			authToken
		})
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

	if (!ready) {
		return <div>Loading...</div>;
	}

	return (
		<div className="relative w-full flex items-center gap-5">
	
			<Button onClick={handleLogin} disabled={disableLogin || loading}>
				{loading ? 'Logging in...' : 'Log in with Google'}
			</Button>

			{/* <Button disabled={disableLogin} onClick={login}>
				Log in
			</Button> */}

			<Button onClick={getToken}>Get Token</Button>

			<Button disabled={disableLogout} onClick={logout}>
			Log out
			</Button>
		</div>
	);
}