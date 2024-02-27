import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Cinzel } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClientServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const cinzel = Cinzel({ subsets: ["latin"] });

export default async function Home() {
    const supabase = createClientServer();
    const { error, data } = await supabase.auth.getUser();

    return (
        <div className="-mt-20 grow justify-center flex flex-col items-center space-y-4">
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
            {/* <Carousel
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
                <CarouselContent className="h-1/2">
                    <CarouselItem className="flex justify-center">
                        <img src="bleach.jpg" alt="bleach" className="object-contain" />
                    </CarouselItem>
                    <CarouselItem className="flex justify-center">
                        <img src="bestvps.jpg" alt="bleach" className="object-contain" />
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
            </div> */}
            {
                (error || !data.user) &&
                <Link href="/login">
                    <Button
                        className={cn(cinzel.className, 'rounded-full bg-indigo-500 hover:bg-indigo-300')}>
                        Login
                    </Button>
                </Link>
            }
        </div>
    );
}
