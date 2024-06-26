import { toDateTime } from "@/lib/date";
import { prisma } from "@/lib/db";
import { member } from "@/lib/member";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const pageSizeList = [10, 25, 50, 100];
const typeList = ["all", "income", "expense"];

export const dynamic = "force-dynamic";

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
                    message: "Unauhtorized!",
                    code: "UNAUTHORIZED",
                },
                { status: 401 }
            );
        }
        const fromDateUnix = Number(
            req.nextUrl.searchParams.get("fromDate") || undefined
        );
        const toDateUnix = Number(
            req.nextUrl.searchParams.get("toDate") || undefined
        );
        const sortByDate = (req.nextUrl.searchParams.get("sortByDate") ||
            "desc") as "asc" | "desc";
        const fromDate = fromDateUnix ? toDateTime(fromDateUnix) : undefined;
        const toDate = toDateUnix ? toDateTime(toDateUnix) : undefined;
        let pageIndex = parseInt(
            req.nextUrl.searchParams.get("pageIndex") || "1",
            10
        );

        let pageSize = parseInt(
            req.nextUrl.searchParams.get("pageSize") || "10",
            10
        );

        if (!pageSizeList.includes(pageSize)) {
            pageSize = 10;
        }

        let type = (req.nextUrl.searchParams.get("type") || "all") as
            | "all"
            | "income"
            | "expense";
        if (!typeList.includes(type)) {
            type = "all";
        }

        const whereCondition: {
            type?: "income" | "expense";
            date?: { gte: Date; lte: Date };
            memberID: string;
            deletedAt: Date | null;
        } = {
            memberID,
            deletedAt: null,
        };
        if (type !== "all") {
            whereCondition.type = type;
        }
        if (fromDate && toDate) {
            whereCondition.date = {
                gte: new Date(fromDate),
                lte: new Date(toDate),
            };
        }
        const data = await prisma.transactions.findMany({
            where: whereCondition,
            select: {
                txid: true,
                title: true,
                amount: true,
                description: true,
                type: true,
                date: true,
                createdAt: true,
                updatedAt: true,
                countries: { select: { currencyCode: true } },
                categories: { select: { categoryID: true, name: true } },
            },
            orderBy: { date: sortByDate },
        });

        const pageCount = Math.ceil(data.length / pageSize);
        const start = (pageIndex - 1) * pageSize;
        const end = start + Number(pageSize);
        const entries = data
            // .sort(
            //     (a, b) =>
            //         new Date(a.date).getTime() - new Date(b.date).getTime()
            // )
            .slice(start, end)
            .map((x) => ({
                ...x,
                amount: Number(x.amount),
                currencyCode: x.countries.currencyCode,
                category:
                    {
                        id: x.categories?.categoryID,
                        name: x.categories?.name,
                    } || null,
                categories: undefined,
                countries: undefined,
            }));
        return NextResponse.json(
            { data: entries, pageIndex, pageSize, pageCount },
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
