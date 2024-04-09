"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Optional smooth scrolling behavior
        });
    };

    const handleScroll = () => {
        const scrollTop = window.pageYOffset;

        if (scrollTop > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Add scroll event listener when component mounts
    React.useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <Button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 px-4 py-2 bg-red-500 text-white rounded-md ${
                isVisible ? "block" : "hidden"
            }`}
        >
            Jump to Top
        </Button>
    );
}
