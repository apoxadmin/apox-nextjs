'use client'

import EventForm from "@/components/EventForm";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { FaPenToSquare } from "react-icons/fa6";
import Autoplay from "embla-carousel-autoplay";
import { Cinzel } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const cinzel = Cinzel({ subsets: ["latin"] });

export default function Home() {
    return (
        <main className="flex max-h-screen flex-col items-center space-y-8 py-10 md:p-24">
            <div className="flex flex-col items-center">
                <h1 className={
                    cn(
                        cinzel.className,
                        'text-2xl md:text-4xl text-indigo-700'
                    )
                }>
                    Alpha Phi Omega
                </h1>
                <h1 className={
                    cn(
                        cinzel.className,
                        'text-xl sm: text-2xl text-indigo-700'
                    )
                }>
                    Chi Chapter
                </h1>
            </div>
            <Carousel
                opts={{
                    align: 'start',
                    loop: true
                }}
                plugins={[
                    Autoplay({
                        delay: 5000
                    })
                ]}
            >
                <CarouselContent>
                    <CarouselItem className="flex justify-center">
                        <img src="bleach.jpg" alt="bleach" className="h-[200px] md:h-[500px]"/>
                    </CarouselItem>
                    <CarouselItem className="flex justify-center">
                    <img src="bestvps.jpg" alt="bleach" className="h-[200px] md:h-[500px]"/>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
            <div className="flex space-x-1 text-sm md:text-base">
                <h1 className="italic text-neutral-400">
                    sometimes you
                </h1>
                <h1 className="font-bold italic text-neutral-400">
                    can
                </h1>
                <h1 className="italic text-neutral-400">
                    capture greatness
                </h1>
            </div>
            <Link href="/login">
                <Button className="bg-indigo-600 hover:bg-indigo-500">
                    Login
                </Button>
            </Link>
        </main>
    );
}
