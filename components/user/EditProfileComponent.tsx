"use client"

// EditProfileComponent.tsx
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronUp, ChevronDown, Check, Calendar, Mail, User, Pencil, Edit, Save } from 'lucide-react';
import { UserAvatarComponent } from '../shared/UserAvatarComponent';
import { Button } from '../ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import CustomRadioSelector from '../shared/CustomRadioSelector';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { toast } from 'sonner';
import { UserInterface } from '@/interfaces/UserInterface';
import DatePickerComponent from '../shared/DatePickerComponent';
import GradientButton from '../shared/GradientButton';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { convertToISODate } from '@/lib/date';
import { Skeleton } from '../ui/skeleton';




// Define the profile types
type UserType = 'Creator' | 'Reader' | 'Both';
type OccupationType = 'Hobbyist' | 'Student' | 'Novelist' | 'Educator' | 'Journalist';

const creatorTypes = [
    { id: 'hobbyist', label: 'Hobbyist' },
    { id: 'student', label: 'Student' },
    { id: 'novelist', label: 'Novelist' },
    { id: 'educator', label: 'Educator' },
    { id: 'journalist', label: 'Journalist' },
];

interface EditProfileComponentProps {
    //   initialUsername?: string;
    //   initialEmail?: string;
    //   initialDateOfBirth?: string;
    //   initialUserType?: UserType;
    //   initialOccupation?: OccupationType;
    //   initialProfileImage?: string;
}

const EditProfileComponent: React.FC<EditProfileComponentProps> = ({

}) => {
    // State
    // const [userType, setUserType] = useState<UserType>(initialUserType);
    // const [occupation, setOccupation] = useState<OccupationType>(initialOccupation);
    // const [profileImage, setProfileImage] = useState(initialProfileImage);
    
    // const [selectedType, setSelectedType] = useState<string>(authUser?.userType ?? '');
    
    const [bannerImage, setBannerImage] = useState<File | null>(null);
    const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [authUser, setAuthUser] = useState<UserInterface | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    
    const [username, setUsername] = useState(authUser?.name ?? "");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");

    const [selectedType, setSelectedType] = useState<string>(authUser?.userType ?? '');
    const [selectedCreatorTypes, setSelectedCreatorTypes] = useState(authUser?.info?.typeOfCreator ?? []);

    const bannerInputRef = useRef(null);

    useEffect(() => {
        getUserInformation();
    }, [])

    const getUserInformation = async () => {
        try {
            setLoading(true)
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/auth`;

            const response = await axiosInterceptorInstance.get(url, {
                params: null,
            });
            console.log(response);


            const user = response?.data?.user;
            if (!user) {
                toast.error("Something went wrong");
                return;
            }
            setSelectedType(user?.userType ?? '')
            setSelectedCreatorTypes(user?.info?.typeOfCreator ?? [])
            // setDateOfBirth()
            
            setUsername(user?.name ?? '')
            setEmail(user?.email ?? '')

            setAuthUser(user);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    const triggerBannerUpload = () => {
        bannerInputRef?.current?.click();
    };

    const handleBannerUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setBannerImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            // setFormData(prev => ({ ...prev, profileImage: file }));
            setBannerImage(file)
        }
    };


    const handleTypeSelect = (type: string) => {
        console.log(type);

        setSelectedType(type);
        if (type !== 'creator') {
            // setIsDropdownOpen(false);
        }
    };

    const toggleCreatorType = (typeId) => {
        setSelectedCreatorTypes(prev => {
            if (prev.includes(typeId)) {
                return prev.filter(id => id !== typeId);
            } else {
                return [...prev, typeId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (profileImage) {            
        //     await uploadImage(profileImage);
        // }

        if(!validateForm()) {
            toast("Kindly provide a username")
            return
        };

        let updated = await updateUserInformation()

        await getUserInformation()
    };

    const updateUserInformation = async () => {     

        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/users`;
            showPageLoader()
            const response = await axiosInterceptorInstance.put(url, 
                {
                    name: username,
                    email,
                    dateOfBirth: dateOfBirth ? convertToISODate(dateOfBirth) : null,
                    userType: selectedType,
                    typeOfCreator: selectedCreatorTypes,   
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


    if (loading) {
        return (
            <div className="w-full px-5 md:px-10 ">
                <Skeleton className="w-full h-[150px] rounded-xl" />

                <div className="flex items-start gap-3 my-5">
                    <Skeleton className="h-[60px] w-[60px] rounded-xl" />

                    <div className="flex gap-3 flex-col">
                        <Skeleton className="h-[25px] w-[100px] rounded-xl" />
                        <Skeleton className="h-[25px] w-[60px] rounded-xl" />

                    </div>

                </div>

                <Skeleton className="w-[400px] h-[50px] mb-5 rounded-xl" />
                <Skeleton className="w-[300px] mb-3 h-[50px] rounded-xl" />
                <Skeleton className="w-[300px] mb-3 h-[50px] rounded-xl" />
                <Skeleton className="w-[300px] mb-3 h-[50px] rounded-xl" />

            </div>
        )
    }

    if (!loading) {
        
        return (
            <div className="w-full px-5 md:px-10 ">
    
                {/* UPLOAD USER IMAGE */}
                <div
                    className={`relative border-2 h-[150px] mb-5 border-dashed rounded-lg overflow-hidden ${authUser?.bannerImage ? 'border-transparent' : 'border-gray-300'}`}
                // style={{ aspectRatio: '16/9' }}
                >
                    <div
                        className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                        onClick={triggerBannerUpload}
                    >
                        <button
                            className="bg-[#D8D1DE29] text-xs hover:bg-gray-50 cursor-pointer font-medium py-2 px-4 rounded-md transition-all duration-200"
                        >
                            Upload Banner Image
                        </button>
                    </div>

                    <input
                        type="file"
                        ref={bannerInputRef}
                        onChange={handleBannerUpload}
                        accept="image/jpeg,image/png,image/gif"
                        className="hidden"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UserAvatarComponent
                            width={60}
                            height={60}
                            borderRadius='rounded-xl'
                            imageUrl={authUser?.imageUrl ?? "/avatar/default-avatar.png"}
                        />
                        <div>
                            <p className="font-bold text-lg">@{authUser?.name ?? "Anonymous"}</p>
                            <p className="text-[10px] font-light capitalize text-gray-500">{authUser?.userType === "both" ? "Reader & Creator" : authUser?.userType}</p>
                        </div>
                    </div>
                    <Button className="cursor-pointer">
                        Edit
                        <Edit size={16} />
                    </Button>
                </div>

                <div className='flex relative mt-7'>

                    <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                        <PopoverTrigger asChild>
                            <div className='flex flex-col md:flex-row items-center gap-5'>
                                <div className="flex items-center bg-[#F5F5F5] max-w-fit cursor-pointer rounded-lg gap-5 justify-between px-1 py-1">
                                    <div className="flex items-center gap-2 bg-[#F9F9F9] rounded-lg px-4 py-2">
                                        <span className='text-xs text-gray-600 capitalize'>{selectedType}</span>
                                        <div className={`w-5 h-5 rounded-md bg-[#D45C51] flex items-center justify-center cursor-pointer`}                                >
                                            <Check size={16} color="white" />
                                        </div>
                                    </div>
                                    <i className={`bx ${isDropdownOpen ? "bx-chevron-up text-[#D45C51]" : "bx-chevron-down"} text-2xl`}></i>
                                    {/* <ChevronDown size={16} color='black'/> */}
                                </div>

                                {
                                    selectedType !== "reader" &&
                                    <div className="flex flex-wrap items-center gap-2">
                                        {
                                            selectedCreatorTypes?.map(type => (
                                                <p className="flex items-center justify-center capitalize font-semibold text-[#626262] bg-[#FFE2DF3D] px-3 py-2 rounded-lg text-xs">{type}</p>
                                            ))
                                        }
                                    </div>
                                }
                            </div>
                        </PopoverTrigger>

                        <PopoverContent className="w-96 h-[295px]">

                            <div className="flex">

                                <div className="flex flex-col gap-3 border-r border-gray-100 pr-4">
                                    <p className="text-sm font-bold text-[#898989]">
                                        Are you a creator, reader or both?
                                    </p>

                                    <div className="flex flex-col gap-3">
                                        <CustomRadioSelector option="creator" selectedOption={selectedType} handleTypeSelect={handleTypeSelect} />
                                        <CustomRadioSelector option="reader" selectedOption={selectedType} handleTypeSelect={handleTypeSelect} />
                                        <p className="font-semibold text-sm text-center text-gray-500">or</p>
                                        <CustomRadioSelector option="both" selectedOption={selectedType} handleTypeSelect={handleTypeSelect} />
                                    </div>
                                </div>


                                <div className="flex flex-col gap-5 pl-3 w-full">
                                    {selectedType !== "reader" &&
                                        <>
                                            {
                                                creatorTypes.map((type: { id: string, label: string }) => (
                                                    <div key={type.id} className="flex items-center w-full justify-between px-4 py-2 bg-[#F5F5F5] rounded-md">
                                                        <span className="text-gray-700 text-xs">{type?.label}</span>
                                                        <div
                                                            className={`w-5 h-5 rounded-md border ${selectedCreatorTypes.includes(type?.id)
                                                                ? 'bg-[#FF877B] border-[#FF877B]'
                                                                : 'border-gray-300'
                                                                } flex items-center justify-center cursor-pointer`}
                                                            onClick={() => toggleCreatorType(type?.id)}
                                                        >
                                                            {selectedCreatorTypes.includes(type?.id) && (
                                                                <Check size={16} color="white" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </>
                                    }

                                    {
                                        selectedType === "reader" &&
                                        <>
                                            <img src="/img/reader.svg" alt="reader image" className="object-fit w-full h-full" />
                                        </>
                                    }
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>


                {/* Form fields */}
                <form onSubmit={handleSubmit} className="w-full space-y-6 mt-7">
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
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <DatePickerComponent
                        initialValue={authUser?.dateOfBirth ?? ""}
                        setDisplayValue={setDateOfBirth}
                        displayValue={dateOfBirth}
                    />

                    <div className="space-y-2 mb-4">
                        <label className="block text-sm text-gray-600">Email</label>
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
                                // onChange={handleInputChange}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-7">

                        <GradientButton handleClick={() => console.log()}>
                            <span className="text-xs">Save Changes</span>
                            <Save size={15} />
                        </GradientButton>
                    </div>
                </form>
    
            </div>
        );
    }

};

export default EditProfileComponent;