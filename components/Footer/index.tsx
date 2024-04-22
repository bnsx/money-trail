"use client";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-foreground text-white w-full text-sm text-center p-3">
            Money <span className="text-red-500">Trail</span> made by{" "}
            <Link href={"https://github.com/bnsx"} className="font-bold">
                BNSX
            </Link>{" "}
            with 🤍
        </footer>
    );
}
