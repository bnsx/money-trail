import { member } from "@/lib/member";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });
        const memberID = token?.id as string;
        const hasMember = await member.hasMember({ memberID });
        if (!hasMember || hasMember.status === false) {
            return Response.json(
                {
                    message: "Unauhtorized!",
                    code: "UNAUTHORIZED",
                },
                { status: 401 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", code: "INTERNAL_SERVER_ERROR" },
            { status: 500 }
        );
    }
}
