import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

import { Martian_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
const font = Martian_Mono({
    subsets: ["latin"],
    weight: ["100", "200", "400", "600", "800"],
});

export const metadata: Metadata = {
    title: {
        template: "%s | Money Trail",
        default: "Welcome to Money Trail!",
    },
    description: "Powered by Hypersonix.net",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body id="_BNSX_" className={font.className}>
                <Providers>
                    <Navbar />
                    <div className="px-5 xl:px-32 py-5 bg-slate-50 min-h-screen">
                        {children}
                    </div>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
