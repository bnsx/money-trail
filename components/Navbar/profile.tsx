"use client";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { LogOut } from "./logout";
import { pathList } from "./list";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

interface Props {
    session: Session;
}
export function ProfilePortal({ session }: Props) {
    useEffect(() => {
        if (session.user.forceSignOut === true) {
            signOut({ redirect: true, callbackUrl: "/" });
        }
    }, [session.user.forceSignOut]);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" size={"icon"} variant={"link"}>
                    <Image
                        src={session.user.image}
                        width={50}
                        height={50}
                        className="w-8 rounded-full"
                        alt="Profile"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="xl:hidden">
                    <DropdownMenuLabel>Navigate</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {pathList.map((x) => (
                        <DropdownMenuItem asChild key={x.href}>
                            <Link href={x.href}>{x.label}</Link>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                </div>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={"/profile"}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <LogOut />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
