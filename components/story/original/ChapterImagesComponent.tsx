"use client"

import React, { useState, useEffect } from 'react';
import ImageUploaderComponent from './ImageUploaderComponent';
import { hidePageLoader, showPageLoader, uploadToCloudinary } from '@/lib/helper';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { toast } from "sonner";

interface ImageData {
    signature: string;
    publicId: string;
    imageUrl: string;
    metaData: any;
    description: string;
}

interface ChapterImage {
    image?: string | null;
    coverImage?: string | null;
    id: string;
}

interface Props {
    activeChapterData: ChapterImage | null;
    refetch: () => void;
}

const ChapterImagesComponent: React.FC<Props> = ({ activeChapterData, refetch }) => {
    const [bannerImage, setBannerImage] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<'banner' | 'cover' | null>(null);
    const [uploadingCoverImage, setUploadingCoverImage] = useState<boolean>(false);
    const [uploadingBannerImage, setUploadingBannerImage] = useState<boolean>(false);

    // Reset previews when active chapter changes
    useEffect(() => {
        setBannerImagePreview(activeChapterData?.image ?? null);
        setCoverImagePreview(activeChapterData?.coverImage ?? null);
        setBannerImage(null);
        setCoverImage(null);
    }, [activeChapterData]);

    const saveChapterImagesToDB = async (payload: ImageData) => {
        try {
            const body = {
                ...payload,
                ownerType: "Chapter",
                ownerId: activeChapterData?.id,
                source: "uploaded"
            };

            await axiosInterceptorInstance.post('/images', body);
            return true;
        } catch (error) {
            console.error('Failed to save image to DB:', error);
            throw error;
        }
    };

    const handleImageUpload = async (imageFile: File | null, type: 'banner' | 'cover') => {
        if (!imageFile || !activeChapterData?.id) return false;

        setIsUploading(type);

        try {
            if(type === 'cover') setUploadingCoverImage(true);
            if(type === 'banner') setUploadingBannerImage(true);

            const res = await uploadToCloudinary(imageFile);
            if (!res?.data) {
                toast("Unable to upload image")
                return false;
            };

            showPageLoader()
            await saveChapterImagesToDB({
                signature: res.data.signature,
                publicId: res.data.public_id,
                imageUrl: res.data.secure_url,
                metaData: res.data,
                description: `${type}-image`,
            });

            // Update preview with new image URL
            if (type === 'banner') {
                setBannerImagePreview(res.data.secure_url);
            } else {
                setCoverImagePreview(res.data.secure_url);
            }

            // refetch();

            return true;
        } catch (error) {
            console.error(`Failed to upload ${type} image:`, error);
            return false;
        } finally {
            setIsUploading(null);
            hidePageLoader()
            if(type === 'cover') setUploadingCoverImage(false);
            if(type === 'banner') setUploadingBannerImage(false);
        }
    };

    const uploadBanner = () => handleImageUpload(bannerImage, 'banner');
    const uploadCoverImage = () => handleImageUpload(coverImage, 'cover');

    if (!activeChapterData) return null;

    return (
        <ImageUploaderComponent
            bannerImage={bannerImage}
            setBannerImage={setBannerImage}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            bannerImagePreview={bannerImagePreview}
            setBannerImagePreview={setBannerImagePreview}
            coverImagePreview={coverImagePreview}
            setCoverImagePreview={setCoverImagePreview}
            uploadBanner={uploadBanner}
            uploadCoverImage={uploadCoverImage}
            isUploading={isUploading}
            uploadingCoverImage={uploadingCoverImage} 
            uploadingBannerImage={uploadingBannerImage}
        />
    );
};

export default ChapterImagesComponent;