import { member } from "@/lib/member";
import { category } from "@/lib/category";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });
        const memberID = token?.id as string;
        const hasMember = await member.hasMember({
            memberID,
            select: { status: true, isoNumeric: true },
        });
        if (
            !hasMember ||
            hasMember.status === false ||
            hasMember.isoNumeric === null
        ) {
            return NextResponse.json(
                {
                    message: "Unauthorized!",
                    code: "UNAUTHORIZED",
                },
                { status: 401 }
            );
        }
        const data = await category.getMyCategories({
            memberID,
            deletedAt: null,
        });
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", code: "INTERNAL_SERVER_ERROR" },
            { status: 500 }
        );
    }
}
