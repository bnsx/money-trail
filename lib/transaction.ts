import { Prisma } from "@prisma/client";
import { prisma } from "./db";

interface createTransactionProps {
    title: string;
    description: string | null;
    type: "income" | "expense";
    date: Date;
    amount: number;
    memberID: string;
    categoryID: string | null;
    isoNumeric: number;
}
interface deleteTransactionProps {
    txid: string;
    memberID: string;
}
interface patchTransactionProps {
    txid: string;
    memberID: string;
    title: string;
    description: string | null;
    type: "income" | "expense";
    date: Date;
    amount: number;
    categoryID: string | null;
}

interface hasTransactionProps<T extends Prisma.transactionsSelect> {
    txid: string;
    memberID: string;
    deletedAt?: null;
    select: T;
}

interface getAllProps {
    memberID?: string;
    isoNumeric?: number;
    categoryID?: string | null;
    deletedAt?: null;
}
class Transaction {
    async create(data: createTransactionProps) {
        if (data.categoryID) {
            return await prisma.$transaction([
                prisma.categories.update({
                    where: {
                        categoryID: data.categoryID,
                        memberID: data.memberID,
                    },
                    data: { count: { increment: 1 }, updatedAt: new Date() },
                }),
                prisma.transactions.create({ data }),
            ]);
        }
        return await prisma.transactions.create({ data });
    }

    async delete({ txid, memberID }: deleteTransactionProps) {
        return await prisma.transactions.update({
            where: { txid, memberID, deletedAt: null },
            data: { updatedAt: new Date(), deletedAt: new Date() },
        });
    }

    async patch(data: patchTransactionProps) {
        await prisma.transactions.update({
            where: {
                txid: data.txid,
                memberID: data.memberID,
                deletedAt: null,
            },
            data: { ...data, updatedAt: new Date() },
        });
    }

    async hasTransaction<T extends Prisma.transactionsSelect>({
        txid,
        memberID,
        deletedAt,
        select,
    }: hasTransactionProps<T>) {
        return await prisma.transactions.findUnique({
            where: { txid, memberID, deletedAt },
            select,
        });
    }

    async getAll({ memberID, isoNumeric, categoryID, deletedAt }: getAllProps) {
        return await prisma.transactions.findMany({
            where: { memberID, isoNumeric, categoryID, deletedAt },
        });
    }
}
export const transaction = new Transaction();
