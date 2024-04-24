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
        const body = transactionSchema.delete_.safeParse(rawData);
        if (!body.success) {
            return NextResponse.json(
                { message: "Invalid Schema", code: "INVALID_SCHEMA" },
                { status: 400 }
            );
        }
        const hasTransaction = await transaction.hasTransaction({
            txid: body.data.txid,
            memberID,
            deletedAt: null,
            select: { txid: true },
        });
        if (!hasTransaction) {
            return NextResponse.json(
                { message: "Transaction not found!", code: "TRANSACTION_404" },
                { status: 404 }
            );
        }
        await transaction.delete({ txid: body.data.txid, memberID });
        return NextResponse.json(
            {
                message: "Transaction deleted successfully",
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
