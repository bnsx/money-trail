import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type Metadata } from "next";
import { member } from "@/lib/member";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DeactivateComponent } from "./deactivate";

export const metadata: Metadata = { title: "Profile" };
export default async function Page() {
    const session = await getServerSession(authOptions);
    const hasMember = await member.hasMember({
        memberID: session?.user.id,
        select: { isoNumeric: true, countries: { select: { name: true } } },
    });
    return (
        <div className="xl:flex md:flex justify-center md:translate-y-32 xl:translate-y-32 translate-y-10">
            <Card className="w-full max-w-96">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription className="text-xs">
                        This is your information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 ">
                    <div className="space-y-1">
                        <Label>Your Name</Label>
                        <Input value={session?.user.name} disabled />
                    </div>
                    <div className="space-y-1">
                        <Label>Email</Label>
                        <Input value={session?.user.email} disabled />
                    </div>
                    <div className="space-y-1">
                        <Label>Your Country</Label>
                        <Input
                            value={
                                hasMember?.countries?.name
                                    ? hasMember?.countries?.name
                                    : "Please click below for setup!"
                            }
                            disabled
                        />
                        {!hasMember?.isoNumeric && (
                            <Button asChild type="button" className="w-full">
                                <Link href={"/setup"}>Setup My Country</Link>
                            </Button>
                        )}
                    </div>
                    <DeactivateComponent />
                </CardContent>
            </Card>
        </div>
    );
}
