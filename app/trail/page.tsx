import { type Metadata } from "next";
import { TransactionsDisplay } from "./components/transactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { member } from "@/lib/member";
import { redirect } from "next/navigation";
import { CreateCategory } from "./createCategory";
import { AddTransactionForm } from "./addTransactionForm";
import { OverView } from "./components/overview";
import { getIncomeAndExpense } from "./components/overview/lib/fetch";
import { AddTransactionButton } from "./addTransactionButton";

export const metadata: Metadata = { title: "Trail" };
export default async function Page() {
    const session = await getServerSession(authOptions);
    const hasMember = await member.hasMember({ memberID: session?.user.id });
    if (!session || hasMember?.isoNumeric === null) {
        return redirect("/setup");
    }
    const incomeAndExpense = await getIncomeAndExpense({
        memberID: session.user.id,
    });
    return (
        <section>
            <div className="space-y-5">
                <div className="flex justify-between">
                    <div></div>
                    <div className="flex gap-1">
                        <CreateCategory />
                    </div>
                </div>
                <div className="xl:flex gap-10 justify-between space-y-5 xl:space-y-0">
                    <OverView incomeAndExpense={incomeAndExpense} />
                    <TransactionsDisplay />
                    <AddTransactionForm />
                </div>
            </div>
            <AddTransactionButton />
        </section>
    );
}
