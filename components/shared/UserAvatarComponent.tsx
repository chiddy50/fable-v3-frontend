"use client"

import Image from 'next/image'
import React from 'react'
import SafeImage from './SafeImage'


export const UserAvatarComponent = ({
    width,
    height,
    imageUrl,
    borderRadius,
    isDouble = false,
    imageMargin,
    border
}: {
    width: number,
    height: number,
    imageUrl?: string | null,
    borderRadius?: string,
    isDouble?: boolean,
    imageMargin?: string,
    border?: string,
}) => {
    return (
        <>
            { isDouble &&
                <>
                    <div className={`flex -space-x-2 ${imageMargin}`}>
                        <Image 
                            src="/avatar/default-avatar.png" 
                            alt="User avatar"
                            width={width}
                            height={height}
                            className={`border-2 border-white ${borderRadius ?? 'rounded-xl'}`}
                        />
                        <Image 
                            src="/avatar/default-avatar.png" 
                            alt="User avatar"
                            width={width}
                            height={height}
                            className={`border-2 border-white ${borderRadius ?? 'rounded-xl'}`}
                        />
                    </div>
                </>
            }
            {!isDouble && 
            <Image
                src={imageUrl ?? `/avatar/default-avatar.png`} 
                alt="User avatar"
                width={width}
                height={height}
                className={`${borderRadius ?? 'rounded-xl'} object-cover ${imageMargin} ${border}`}
            />
            
            // <SafeImage 
            // src={imageUrl ?? `/avatar/default-avatar.png`} 
            // alt={"User avatar"} 
            // width={width} 
            // height={height} 
            // className={`${borderRadius ?? 'rounded-xl'} object-cover ${imageMargin} ${border}`}
            // />

            // <img
            //     src={imageUrl ?? `/avatar/default-avatar.png `} 
            //     alt="User avatar"
       
            //     className={`${borderRadius ?? 'rounded-xl'} w-[35px] h-[35px] object-cover ${imageMargin} ${border}`}
            // />
            }
        </>
    )
}

export const UserAvatarAndNameComponent = ({ 
    name, 
    username,
    nameTextSize, 
    usernameTextSize, 
    imageWidth,
    imageHeight,
    imageUrl
}: { 
    name: string, 
    username: string, 
    nameTextSize?: string, 
    usernameTextSize?: string, 
    imageWidth?: number,
    imageHeight?: number,
    imageUrl?: string
}) => {
    return (
        <div className="flex items-center gap-2">
            <UserAvatarComponent imageUrl={imageUrl} width={imageWidth ?? 40} height={imageHeight ?? 40} />

            <div className="flex flex-col">
                <p className={`text-gray-900 font-semibold ${nameTextSize ?? 'text-xs'} `}>{name}</p>
                {/* <p className={`text-gray-700 font-light ${usernameTextSize ?? 'text-[10px]'} `}>@{username}</p> */}
            </div>
        </div>
    )
}

