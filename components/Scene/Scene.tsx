"use client"

import { useEffect, useState } from 'react'
import { Story as StoryType } from "@/types/stories"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
  } from "@/components/ui/carousel"
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import { DM_Sans, Dosis } from "next/font/google";
import { cn } from '@/lib/utils'

const sans = Dosis({ subsets: ['latin'] });
const dosis = DM_Sans({ subsets: ['latin-ext'] });

interface Props {
    story: StoryType
}

function Scene({ story }: Props) {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if(!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <div>
            
        </div>
    )
}

export default Scene
