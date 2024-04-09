import { prisma } from "@/lib/db";

export async function getIncomeAndExpense({ memberID }: { memberID: string }) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

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
        .reduce((acc, cur) => acc + Number(cur.amount), 0)
        .toFixed(2);
    const totalExpense = transactions
        .filter((x) => x.type === "expense")
        .reduce((acc, cur) => acc + Number(cur.amount), 0)
        .toFixed();
    return { totalIncome, totalExpense };
}
