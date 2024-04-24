import { prisma } from "@/lib/db";
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
                    message: "Unauthorized!",
                    code: "UNAUTHORIZED",
                },
                { status: 401 }
            );
        }

        // Calculate the date range for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Fetch transactions for the last 30 days
        const transactions = await prisma.transactions.findMany({
            where: {
                memberID,
                date: {
                    gte: thirtyDaysAgo.toISOString(), // Greater than or equal to thirtyDaysAgo
                },
                deletedAt: null,
            },
            select: { type: true, amount: true },
        });

        // Filter income and expense transactions
        const totalIncome = transactions
            .filter((x) => x.type === "income")
            .reduce((acc, cur) => acc + Number(cur.amount), 2);
        const totalExpense = transactions
            .filter((x) => x.type === "expense")
            .reduce((acc, cur) => acc + Number(cur.amount), 2);

        // Prepare response data
        const responseData = {
            totalIncome,
            totalExpense,
            currencyCode: hasMember.countries?.currencyCode,
        };

        return NextResponse.json(responseData);
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", code: "INTERNAL_SERVER_ERROR" },
            { status: 500 }
        );
    }
}
