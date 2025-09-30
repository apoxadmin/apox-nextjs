import { Rubik } from "next/font/google";
// import "./globals.css";
import Navbar from "@/components/Navbar";

const textFont = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Alpha Phi Omega - Chi Chapter",
  description: "Be a leader. Be a friend. Be of service.",
};

export default function RootLayout({ children }) {
  return (
    <>
     
     {children}
    </>
  );
}