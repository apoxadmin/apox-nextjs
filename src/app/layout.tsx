import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alpha Phi Omega - Chi Chapter",
  description: "Be a leader. Be a friend. Be of service."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/logo.png" sizes="any" />
      <body className={inter.className}>
          <AuthProvider>
            <main className="flex flex-col min-h-[calc(100dvh)] bg-gray-100">
              <Navbar />
              {children}
            </main>
            <Toaster />
          </AuthProvider>
        
      </body>
    </html>
  );
}
