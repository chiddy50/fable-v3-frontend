"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { makeRequest } from '@/services/request';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';

interface CharacterSuggestionsModalProps {
    openAddCharacterModal: boolean;
    setOpenAddCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;   
    storyId: string;
}


const AddNewCharacterComponent: React.FC<CharacterSuggestionsModalProps> = ({
    openAddCharacterModal,
    setOpenAddCharacterModal,
    storyId
}) => {
    const [name, setName] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [backstory, setBackstory] = useState<string>("");
    const [relationshipToProtagonist, setRelationshipToProtagonist] = useState<string>("");
    
    const [saving, setSaving] = useState<boolean>(false);

    const dynamicJwtToken = getAuthToken();

    const addNewCharacter = async () => {
        try {            
            const validated = validateForm();
            if (!validated) {
                return;
            }
    
            setSaving(true);
            let response = await makeRequest({
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/characters`,
                method: "POST", 
                body: {
                    storyId,
                    name,
                    role,
                    backstory,
                    relationshipToProtagonist,
                    isProtagonist: false,
                }, 
                token: dynamicJwtToken,
            });
            console.log(response);
            
        } catch (error) {
            console.error(error);            
        }finally{
            setSaving(false);            
        }

    }

    const validateForm = () => {
        const validations = [
            { condition: !name, message: "Kindly provide a name" },
            { condition: !role, message: "Kindly provide a role" },
            { condition: !backstory, message: "Kindly provide a backstory" },
            { condition: !relationshipToProtagonist, message: "We need to know the character's relationship with the protagonist(s)" }
        ];
    
        for (const { condition, message } of validations) {
            if (condition) {
                toast.error(message);
                return false;
            }
        }
    
        return true;
    }

    return (
        <Dialog open={openAddCharacterModal} onOpenChange={setOpenAddCharacterModal}>
            <DialogContent className='xs:min-w-[95%] sm:min-w-[80%] md:min-w-[50%] lg:min-w-[40%]'>
                <DialogHeader>
                    <DialogTitle className=''>Add Character</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <div className='w-full'>
                    <div className='mb-3'>
                        <p className='mb-1 text-xs'>Name</p>
                        <Input className='w-full' onChange={(e) => setName(e.target.value) } value={name} />
                    </div>
                    <div className='mb-3'>
                        <p className='mb-1 text-xs'>Backstory</p>
                        <textarea rows={3} onChange={(e) => setBackstory(e.target.value) } value={backstory} className='py-2 px-4 outline-none border text-xs rounded-lg w-full' />
                    </div>
                    <div className='mb-3'>
                        <p className='text-xs mb-1'>Role</p>
                        <textarea rows={3} onChange={(e) => setRole(e.target.value) } value={role} className='py-2 px-4 outline-none border text-xs rounded-lg w-full' />
                    </div>
                    <div className='mb-3'>
                        <p className="text-xs mb-1">Relationship to Protagonist</p>
                        <textarea rows={3} onChange={(e) => setRelationshipToProtagonist(e.target.value)} value={relationshipToProtagonist} className='py-2 px-4 outline-none border text-xs rounded-lg w-full' />
                    </div>     

                    <Button 
                    disabled={saving}
                    onClick={addNewCharacter}
                    className='bg-custom_green hover:bg-custom_green text-white w-full gap-1'>
                        Save
                        { saving && <i className='bx bx-loader bx-spin bx-flip-vertical text-white text-xl' ></i> }                        
                    </Button>                           
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default AddNewCharacterComponent
