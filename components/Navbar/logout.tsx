"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export function LogOut() {
    const onClicked = () => signOut({ redirect: true, callbackUrl: "/login" });
    return (
        <Button type="button" variant={"ghost"} className="w-full" onClick={onClicked}>
            Logout
        </Button>
    );
}
