"use client";

import { ReloadIcon } from "@radix-ui/react-icons";

export function Loading() {
    return (
        <div className="w-full min-h-[400px] flex justify-center items-center">
            <ReloadIcon className="animate-spin w-32 h-32 text-red-500" />
        </div>
    );
}
