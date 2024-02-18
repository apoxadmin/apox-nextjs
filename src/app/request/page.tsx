import EventForm from "@/components/EventForm";
import { FaPenToSquare } from "react-icons/fa6";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-8 py-8 px-6 md:p-24">
      <h1 className="text-2xl md:text-4xl text-gray-800">
        Event Request Form
      </h1>
      <div className="inline-flex items-center justify-center w-full">
      <hr className="w-full max-w-lg h-1 my-8 bg-slate-200 border-0 rounded" />
      <div className="absolute px-4 -translate-x-1/2 bg-gray-100 text-slate-700 text-2xl left-1/2">
        <FaPenToSquare />
      </div>
      </div>
      
      <EventForm/>
    </main>
  );
}
