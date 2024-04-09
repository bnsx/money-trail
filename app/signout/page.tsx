"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
    const [loading, setLoading] = useState("");
    useEffect(() => {
        setInterval(() => {
            if (loading.length === 3) {
                setLoading("");
            } else {
                setLoading(loading + ".");
            }
        }, 800);
    }, [loading]);
    useEffect(() => {
        setTimeout(() => {
            signOut({ redirect: true, callbackUrl: "/" });
        }, 3000);
    }, []);
    return (
        <div className="translate-y-28">
            <div className="flex justify-center">
                <Image
                    src={"/black-cat-savage.jpg"}
                    width={1000}
                    height={1000}
                    className="w-32 rounded-full animate-bounce"
                    alt="Black Cat Savage"
                />
            </div>
            <h1 className="text-center text-xl">Bye Bye{loading}</h1>
        </div>
    );
}
