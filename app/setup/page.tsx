import { prisma } from "@/lib/db";
import { type Metadata } from "next";
import { FormValue } from "./form";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { member } from "@/lib/member";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Setup" };
export default async function Page() {
    const session = await getServerSession(authOptions);
    const hasMember = await member.hasMember({ memberID: session?.user.id });
    if (hasMember && hasMember.isoNumeric !== null) {
        return redirect("/trail");
    }
    const countries = await prisma.countries.findMany();
    return (
        <div className="space-y-5">
            <h1 className="text-xl font-bold">
                Choose Your <span className="text-red-500">Currency</span>
            </h1>
            <FormValue data={countries} />
            <ScrollToTopButton />
        </div>
    );
}
