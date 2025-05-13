"use client"

import Image from 'next/image';
import { useState } from 'react';

type SafeImageProps = {
    src: string | null | undefined;
    alt: string;
    defaultSrc?: string;
    fill?: boolean;
    className?: string;
    priority?: boolean;
    width?: number;
    height?: number;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
};

const SafeImage = ({
    src,
    alt,
    defaultSrc = '/img/placeholder6.jpg',
    fill = false,
    className = '',
    priority = false,
    width,
    height,
    objectFit = 'cover',
}: SafeImageProps) => {
    const [imageSrc, setImageSrc] = useState(src || defaultSrc);

    const handleImageError = () => {
        // If the original image fails to load, switch to the default image
        if (imageSrc !== defaultSrc) {
            setImageSrc(defaultSrc);
        }
    };

    // If no source is provided, use the default image
    const finalSrc = imageSrc || defaultSrc;

    // If using fill prop, use a different rendering approach
    if (fill) {
        return (
            <Image
                src={finalSrc}
                alt={alt}
                fill
                onError={handleImageError}
                className={`${className} object-${objectFit}`}
                priority={priority}
            />
        );
    }

    // If not using fill, use standard Image component with width/height
    return (
        <Image
            src={finalSrc}
            alt={alt}
            width={width}
            height={height}
            onError={handleImageError}
            className={className}
            priority={priority}
            style={{ objectFit }}
        />
    );
};

export default SafeImage;







// // Basic usage with fill prop
// <SafeImage 
//   src={user?.backgroundImage} 
//   alt={`${user?.name ?? "Anonymous"}'s banner`} 
//   fill 
//   className="rounded-b-3xl" 
//   priority 
// />

// // Standard usage with width and height
// <SafeImage 
//   src={user?.profilePicture} 
//   alt={user?.name ?? "Anonymous"} 
//   width={200} 
//   height={200} 
//   className="rounded-full"
// />

// // With custom default image
// <SafeImage 
//   src={product?.image} 
//   alt={product?.name} 
//   defaultSrc="/img/default-product.png"
//   width={300} 
//   height={300} 
// />