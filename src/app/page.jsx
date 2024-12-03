import Navbar from "@/components/Navbar";
import { Caprasimo, Rubik } from "next/font/google";

const titleFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });
const textFont = Rubik({ subsets: ["latin"], style: ['normal', 'italic'], });

export default function Home() {
  return (
    <>
    <Navbar />
    <div className="grow flex flex-col items-center space-y-4">
        <div className="grow relative p-10 w-full flex flex-col items-center justify-evenly bg-no-repeat bg-[linear-gradient(to_bottom,rgba(20,20,20,0.3),rgba(1,1,1,0.65),rgba(1,1,1,0.9)),url('/bt_class.JPG')] bg-cover bg-[50%_30%]">
          <div className={`mt-16z-10 flex items-center text-white text-4xl space-x-8 [&>*]:drop-shadow-lg ${titleFont.className}`}>
            {/* <h1 className="text-2xl md:text-4xl text-blue-700 drop-shadow-lg">
                Alpha Phi Omega
            </h1>
            <h1 className="text-lg sm:text-xl text-blue-500 drop-shadow-lg">
                Chi Chapter
            </h1> */}
            {/* <p className={`text-neutral-400 italic ${textFont.className}`}>
              Co-Ed Community Service Fraternity at UCLA
            </p> */}
            <p>Be a leader.</p>
            <p>Be a friend.</p>
            <p>Be of service.</p>
          </div>
          
          <div className="z-10 flex flex-col space-y-4 text-white text-lg drop-shadow-xl max-w-xl">
            <p className="text-base text-center">
              Alpha Phi Omega is the nation's largest co-educational community service fraternity.
              From working with children with Reading to Kids at elementary schools,
              to helping out at our school on Bruin Day,
              to feeding seniors and veterans with Meals on Wheels,
              our chapter is dedicated to supporting and uplifting our local community.
            </p>
            <p className="text-base text-center">
              We welcome anyone to join our brotherhood!<br/>If you are interested, click here to visit our rush page.
            </p>
          </div>
            
        </div>
    </div>
    </>
  );
}
