import { Rubik } from "next/font/google";
import "./globals.css";

const textFont = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Alpha Phi Omega - Chi Chapter",
  description: "Be a leader. Be a friend. Be of service.",
};

export default function RootLayout({ children }) {
  return (
        <html lang="en" className="h-full">
          <body
              className={`${textFont.className} h-full`}
              suppressHydrationWarning={true}
          >
              <main className={`flex flex-col h-full ${textFont.className}`}>
                  {children}
              </main>
          </body>
    </html>
  );
}
