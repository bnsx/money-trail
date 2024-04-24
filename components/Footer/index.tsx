"use client";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-foreground text-white w-full text-xs xl:text-sm text-center p-3">
            <span className="font-semibold">Money</span>{" "}
            <span className="font-semibold text-red-500">Trail</span> made by{" "}
            <Link
                target="_blank"
                href={"https://github.com/bnsx"}
                className="font-bold"
            >
                BNSX
            </Link>{" "}
            with 🤍
        </footer>
    );
}
