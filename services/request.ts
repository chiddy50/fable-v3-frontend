import axiosInterceptorInstance from "@/axiosInterceptorInstance";
import { SuggestedCharacterInterface } from "@/interfaces/CharacterInterface";
import { StoryInterface } from "@/interfaces/StoryInterface";
import { hidePageLoader, showPageLoader } from "@/lib/helper";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { toast } from "sonner";

const dynamicJwtToken = getAuthToken();

export const updateCharacter = async (payload, characterId: string) => {
    console.log({dynamicJwtToken});
    let authentication_token = dynamicJwtToken;
    if (!authentication_token && window?.localStorage) {        
        let token = localStorage?.getItem("dynamic_authentication_token")
        authentication_token = token ? JSON.parse(token) : null;
        console.log("TOKEN FROM LOCAL STORAGE",{authentication_token});        
    }


    if (!authentication_token) {
        toast.error("Kindly login again or refresh")
        return false;
    }

    try {
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/characters/${characterId}`;

        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authentication_token}`
            },
            body: JSON.stringify(payload)
        });

        const json = await res.json();
        if (json?.data?.character) {                
            return json?.data?.character;                   
        }
        return false;                   
    } catch (error) {
        console.log(error);            
        return false;                   
    }
}

export const createCharacter = async (character: SuggestedCharacterInterface, storyId: string) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/characters`;

        showPageLoader();

        const response = await axiosInterceptorInstance.post(url,
            {
                storyId,
                name: character.name,
                role: character.role,
                backstory: character.backstory,
                disabled: true,
                relationshipToProtagonist: character.relationshipToProtagonist,
                isProtagonist: false,
            },
            {
                headers: {
                    Authorization: `Bearer ${dynamicJwtToken}`
                }
            }
        );
        
        if (!response) {
            return false;   
        }
        toast.success(`${character.name} added as a character`);
        
        return true;
        
    } catch (error) {
        console.log(error);
        return false;            
    }finally{
        hidePageLoader();
    }
}

export const makeRequest = async ({
    url, method, body, token
}: {
    url: string, 
    method: string, 
    body: object, 
    token: string
}) => {
    if (!token) {
        console.log("NO AUTH TOKEN", token);        
        return;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const navigateToStoryStep = async (storyId: string, payload: object) => {
    try {
        showPageLoader();
        let response = await makeRequest({
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/stories/build-from-scratch/${storyId}`,
            method: "PUT", 
            body:  {
                ...payload,
                storyId,                                   
            }, 
            token: dynamicJwtToken,
          });

         return response;
    } catch (error) {
        console.error(error);            
    }finally{
        hidePageLoader();
    }
}