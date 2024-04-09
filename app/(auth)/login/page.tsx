"use client";
import { SocialMediaIcons } from "@/components/SocialMediaIcons";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
    searchParams: { callbackUrl?: string };
}

export default function Page({ searchParams: { callbackUrl = "/trail" } }: Props) {
    const [isSubmit, setSubmit] = useState(false);

    const LoginWithGoogle = () => {
        setSubmit(true);
        signIn("google", { callbackUrl });
    };
    return (
        <>
            <div className="w-full flex justify-center translate-y-28 xl:translate-y-32">
                <Card className="w-full md:w-[400px] xl:w-[400px]">
                    <CardHeader>
                        <CardTitle>Log In</CardTitle>
                        <CardDescription>
                            Easy and Secure with Google login.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="flex justify-center">
                            <Image
                                src={"/black-cat-savage.jpg"}
                                width={1000}
                                height={1000}
                                className="w-32 rounded-full"
                                alt="Black Cat Savage"
                            />
                        </div>
                        <Button
                            type="button"
                            variant={"outline"}
                            onClick={LoginWithGoogle}
                            disabled={isSubmit}
                            className="w-full"
                        >
                            <SocialMediaIcons.google className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                    </CardContent>
                    <CardFooter className="flex flex-col xl:flex-row justify-between">
                        <div>
                            <Link
                                href={"/tos"}
                                className="hover:text-muted-foreground/50 text-muted-foreground text-sm"
                            >
                                Term of Service
                            </Link>
                        </div>
                        <div>
                            <Link
                                href={"/how-to-delete-account"}
                                className="hover:text-muted-foreground/50 text-muted-foreground text-sm"
                            >
                                Delete Account?
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
