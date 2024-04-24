import { category } from "@/lib/category";
import { member } from "@/lib/member";
import { transaction } from "@/lib/transaction";
import { transactionSchema } from "@/zod/transaction";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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
        const rawData = await req.json();
        const body = transactionSchema.create.safeParse(rawData);
        if (!body.success) {
            return NextResponse.json(
                { message: "Invalid Schema", code: "INVALID_SCHEMA" },
                { status: 400 }
            );
        }
        let { data } = body;

        if (data.categoryID !== null) {
            if (data.categoryID === "null") {
                // yes i mean null in string
                data.categoryID = null;
            } else {
                const hasCategory = await category.hasCategory({
                    categoryID: data.categoryID,
                    memberID,
                    select: { categoryID: true },
                });
                if (!hasCategory) {
                    data.categoryID = null;
                }
            }
        }
        const merge = {
            ...data,
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
