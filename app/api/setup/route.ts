import { prisma } from "@/lib/db";
import { member } from "@/lib/member";
import { setupSchema } from "@/zod/setup";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req });
        const memberID = token?.id;
        const hasMember = await member.hasMember({ memberID });
        if (!hasMember || hasMember.isoNumeric !== null) {
            return NextResponse.json(
                {
                    message: "Unauthorized!",
                    code: "UNAUTHORIZED",
                },
                { status: 401 }
            );
        }
        const rawData = await req.json();
        const body = setupSchema.currency.safeParse(rawData);
        if (!body.success) {
            return NextResponse.json(
                { message: "Invalid Schema", code: "INVALID_SCHEMA" },
                { status: 400 }
            );
        }
        const { isoNumeric } = body.data;
        const lookupCountry = await prisma.countries.findUnique({
            where: { isoNumeric },
        });
        if (lookupCountry === null) {
            // Impossible except sender is hacker!
            return NextResponse.json(
                {
                    message: "Country not found!",
                    code: "COUNTRY_404",
                },
                { status: 404 }
            );
        }
        // can do that
        await prisma.$transaction([
            prisma.members.update({
                where: { memberID },
                data: { isoNumeric, updatedAt: new Date() },
            }),
            prisma.countries.update({
                where: { isoNumeric },
                data: { count: { increment: 1 } },
            }),
        ]);
        return NextResponse.json(
            { message: "Successfully updated your country!", code: "SUCCESS" },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal Server Error", code: "INTERNAL_SERVER_ERROR" },
            { status: 500 }
        );
    }
}
