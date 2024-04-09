import { member } from "@/lib/member";
import { transaction } from "@/lib/transaction";
import { transactionSchema } from "@/zod/transaction";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req });
        const memberID = token?.id as string;
        const hasMember = await member.hasMember({ memberID });
        if (!hasMember || hasMember.isoNumeric === null) {
            return NextResponse.json(
                {
                    message: "Unauthorized!",
                    code: "UNAUTHORIZED",
                },
                { status: 401 }
            );
        }
        const rawData = await req.json();
        const body = transactionSchema.create
            .transform((x) => ({ ...x, description: x.description || null }))
            .safeParse(rawData);
        if (!body.success) {
            return NextResponse.json(
                { message: "Invalid Schema", code: "INVALID_SCHEMA" },
                { status: 400 }
            );
        }
        const merge = {
            ...body.data,
            memberID,
            isoNumeric: hasMember.isoNumeric,
        };
        await transaction.create(merge);
        return NextResponse.json(
            {
                message: "Transaction created successfully",
                code: "SUCCESS",
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", code: "INTERNAL_SERVER_ERROR" },
            { status: 500 }
        );
    }
}
