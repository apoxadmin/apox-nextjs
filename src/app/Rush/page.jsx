// app/rush/page.tsx
import Navbar from "@/components/Navbar";
import { Caprasimo, Rubik } from "next/font/google";

const titleFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });
const textFont = Rubik({ subsets: ["latin"], style: ["normal", "italic"] });

const faqs = [
  {
    question: "What is Alpha Phi Omega about?",
    answer:
      "We’re an international co-ed service fraternity and the largest in the nation. As a service fraternity, we are NOT a social fraternity. However, we do have social components. Our cardinal principles are Leadership, Friendship and Service, which our events/activities are framed around. ",
  },
  {
    question: "What types of service events do you do?",
    answer:
      "We have a multitude of services: pet adoption fairs (Ace of Hearts), food deliveries to those with disabilities (Meals on Wheels), environmental (beach and Westwood cleanups), etc...",
  },
  {
    question: "Why do I need to pledge to join Alpha Phi Omega?",
    answer:
      "The pledging process is what distinguishes us as a fraternity and differentiates ourselves from being a club. Pledging seeks to foster Brotherhood and in having pledging requirements, we are held to a standard that unites us in knowing that every Brother before us has also had to pledge. Pledging seeks to integrate pledges into the Active body who they will one day be Brothers with.",
  },
  {
    question: "Wait! I still have more questions",
    answer:
      "Don't hesitate to reach out to apoxpparents@gmail.com",
  },  
];

export default function Rush() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen overflow-hidden shadow-lg">
        <img
          src="/rushpic.JPG"
          alt="Rush Photo"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 flex flex-col justify-center items-center text-white px-4 sm:px-8 md:px-16 text-center">
          <p
            className={`drop-shadow-md max-w-3xl ${textFont.className} text-lg sm:text-2xl md:text-4xl font-semibold`}
          >
            Rush Alpha Phi Omega Fall 2025
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-white text-black">
        {/* Rush Flyers */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className={`${titleFont.className} text-4xl font-bold text-center mb-10`}>
            Recruitment Schedule
          </h2>
          <div className="flex flex-col items-center gap-10">
            <img
              src="/flyer1.jpeg"
              alt="Rush Flyer 1"
              className="w-[500px] max-w-full h-auto rounded-lg shadow-md"
            />
            <img
              src="/flyer2.jpeg"
              alt="Rush Flyer 2"
              className="w-[500px] max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </section>

        {/* Interest Form Section */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className={`${titleFont.className} text-4xl font-bold text-center mb-6`}>
            Interest Form
          </h2>
          <p className="text-center text-lg text-gray-700 mb-8">
            Interested in rushing? Fill out our interest form below so we can keep in touch!
          </p>
          <div className="w-full">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScdqPgcScOSdEd_7jWXMaCW6zs0di3VSR3weXJNTnlC3c2hUQ/viewform"
              width="100%"
              height="800"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              className="border rounded-md shadow-lg"
              title="Interest Form"
            >
              Loading…
            </iframe>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className={`${titleFont.className} text-4xl font-bold text-center mb-10`}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqs.map(({ question, answer }, index) => (
              <div key={index} className="border-b pb-4">
                <h4 className="text-2xl font-semibold mb-2">{question}</h4>
                <p className="text-gray-700 text-lg">{answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}