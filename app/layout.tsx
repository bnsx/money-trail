import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

import { Footer } from "@/components/Footer";
import { fontStyle } from "@/lib/font";

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
            <body id="_BNSX_" className={fontStyle.className}>
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
