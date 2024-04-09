"use client";

import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
    children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: Props) {
    return (
        <div>
            <SessionProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                    <Toaster position="top-right" richColors={true} />
                </QueryClientProvider>
            </SessionProvider>
        </div>
    );
}
