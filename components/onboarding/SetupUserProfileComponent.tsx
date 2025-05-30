"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import DatePickerComponent from '../shared/DatePickerComponent';
import axios from 'axios';
import FormData from 'form-data';
import { toast } from "sonner"
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { UserInterface } from '@/interfaces/UserInterface';
import { convertToISODate } from '@/lib/date';
import { hidePageLoader, showPageLoader, uploadToCloudinary } from '@/lib/helper';
interface SaveProfileImageInterface {
    signature: string;
    publicId: string;
    imageUrl: string;
    metaData: any;
}
interface Props {
    setCurrentOnboardingStep: React.Dispatch<React.SetStateAction<number>>;
    user: UserInterface|null;
    getAuthor: () => void;
}

const SetupUserProfileComponent: React.FC<Props> = ({
    setCurrentOnboardingStep,
    user,
    getAuthor
}) => {

    const [dateOfBirth, setDateOfBirth] = useState<string>('');
    // convertToReadableDate

    const [username, setUsername] = useState<string>(user?.name ?? "");
    const [email, setEmail] = useState<string>(user?.email ?? '');
    const [profileImage, setProfileImage] = useState<string>('');

    const [imagePreview, setImagePreview] = useState<string|null>(user?.imageUrl ?? null);
    const [imagePublicId, setImagePublicId] = useState<string>("");
    const [imageSignature, setImageSignature] = useState<string>("");
    const [imageId, setImageId] = useState<string>("");
    

    useEffect(() => {
        setImagePreview(user?.imageUrl ?? null)   
        setEmail(user?.email ?? "");     
    }, []);


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            // setFormData(prev => ({ ...prev, profileImage: file }));
            setProfileImage(file)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (profileImage) {            
            await uploadImage(profileImage);
        }
        
        if(!validateForm()) {
            toast("Kindly provide a username")
            return
        };

        let updated = await updateUserInformation()
        
        await getAuthor()
        // Proceed to next step

        setCurrentOnboardingStep(2)
    };

    const updateUserInformation = async () => {
        // if(!validateForm()) return;
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/users`;
            showPageLoader()
            const response = await axiosInterceptorInstance.put(url, 
                {
                    name: username,
                    email,
                    dateOfBirth: dateOfBirth ? convertToISODate(dateOfBirth) : null   
                }
            );

        } catch (error) {
            console.error(error);
        } finally {
            hidePageLoader();
        }
    }

    const validateForm = () => {
        if (!username) {
            toast("Username is required");
            return false;
        }

        return true;
    }


    const uploadImage = async (file: any) => {
        try {
            showPageLoader()

            const preset_key: string = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_KEY ?? "" as string
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

            if (file) {
                const res = await uploadToCloudinary(file);
                if(!res) return false;
                
                setImageId(res?.data?.secure_url)
                setImageSignature(res?.data?.signature)
                setImagePublicId(res?.data?.public_id)
    
                let imageSaved = await saveProfileImageToDB({
                    signature: res?.data?.signature,
                    publicId: res?.data?.public_id,
                    imageUrl: res?.data?.secure_url,
                    metaData: res?.data
                });
    
                toast("Profile image uploaded successfully", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                });
    
                return res?.data?.secure_url
            }
            return false;
        } catch (error) {
            console.log(error)
            return false;
        }  finally {
            hidePageLoader();
        }
    }


    const saveProfileImageToDB = async (payload: SaveProfileImageInterface) => {

		let body = { ...payload, 
			ownerType: "User",
			description: "profile-image",
			source: "uploaded"
		}
        
		try {
			const updated = await axiosInterceptorInstance.post(`/images`, body);
		} catch (error) {
			console.error(error);			
		}
	}


    return (
        <div className="w-full max-w-6xl flex rounded-2xl overflow-hidden ">

            {/* Left side - Form */}
            <div className="w-full md:w-1/2 p-7 md:p-12 flex flex-col items-start">
                {/* Profile picture upload */}
                <div className="relative mb-10">
                    <div className="w-24 h-24 rounded-4xl overflow-hidden flex items-center justify-center">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Profile"
                                // layout="fill"
                                // objectFit="cover"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-3xl bg-purple-900 flex items-center justify-center">
                                <Image
                                    src="/avatar/default-avatar.png"
                                    alt="Default profile"
                                    width={96}
                                    height={96}
                                />
                            </div>
                        )}
                    </div>
                    <label htmlFor="upload-profile" className="cursor-pointer">
                        <div className="flex items-center mt-3 text-purple-900 bg-gray-50 px-5 py-3 rounded-xl">
                            <span className="text-xs mr-2">Upload Picture</span>
                            <Image
                                src="/icon/edit.svg"
                                alt="default avatar"
                                className=""
                                width={20}
                                height={20}
                            />
                        </div>
                        <input
                            id="upload-profile"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </label>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm text-gray-600">Username</label>
                        <div className="flex items-center p-3 rounded-lg bg-gray-100">
                            <Image
                                src="/icon/user.svg"
                                alt="user icon"
                                className="mr-2"
                                width={20}
                                height={20}
                            />
                            <input
                                type="text"
                                name="username"
                                placeholder="@Username"
                                className="w-full bg-transparent text-sm focus:outline-none text-gray-500"
                                value={username}
                                onChange={(e) => setUsername(e.target.value) }
                            />
                        </div>
                    </div>

                    <DatePickerComponent 
                        initialValue={user?.dateOfBirth ?? ""} 
                        setDisplayValue={setDateOfBirth}
                        displayValue={dateOfBirth}
                    />
                    
                    <div className="space-y-2">
                        <label className="block text-sm text-gray-600">Email </label>
                        <div className="flex items-center p-3 rounded-lg bg-gray-100">
                            <Image
                                src="/icon/email.svg"
                                alt="email icon"
                                className="mr-2"
                                width={20}
                                height={20}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="example@gmail.com"
                                className="w-full bg-transparent focus:outline-none text-sm text-gray-500"
                                value={email}
                                disabled
                                // onChange={handleInputChange}
                                // onChange={(e) => setEmail(e.target.value) }
                            />
                        </div>
                    </div>

                    <div className="mt-10 flex items-center justify-between">
                        <button
                            // onClick={() => setCurrentOnboardingStep(2)}
                            type="submit"
                            className="flex items-center gap-3 py-3 px-5 cursor-pointer transition-all bg-[#33164C] hover:bg-purple-800 text-white text-xs rounded-2xl"
                        >
                            <span>Next</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Progress indicators */}
                        <div className="flex justify-center space-x-2 pt-4">
                            <div className="w-8 h-1 bg-[#33164C] rounded"></div>
                            <div className="w-8 h-1 bg-gray-200 rounded"></div>
                            <div className="w-8 h-1 bg-gray-200 rounded"></div>
                            <div className="w-8 h-1 bg-gray-200 rounded"></div>
                        </div>

                    </div>

                </form>
            </div>

            {/* Right side - Image */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center p-6">
                <div className="rounded-3xl overflow-hidden w-full h-full relative">
                    <Image
                        src="/img/background-2.jpeg"
                        alt="Registration artwork"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-3xl"
                    />
                </div>
            </div>
        </div>
    )
}

export default SetupUserProfileComponent
