"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
    data: {
        totalIncome: string;
        totalExpense: string;
    };
}
export function IncomeAndExpense({
    data: { totalIncome, totalExpense },
}: Props) {
    return (
        <div className="space-y-1">
            <Label>Total Income And Expense</Label>
            <div className="xl:flex gap-1 space-y-1 xl:space-y-0">
                <Button
                    type="button"
                    aria-disabled
                    variant={"secondary"}
                    className="relative text-xs h-20 w-full xl:w-1/2 text-red-600"
                >
                    -{totalExpense}
                    <Badge
                        className="absolute top-2 left-2"
                        variant={"outline"}
                    >
                        Expense
                    </Badge>
                </Button>
                <Button
                    type="button"
                    aria-disabled
                    variant={"secondary"}
                    className="relative text-xs h-20 w-full xl:w-1/2 text-green-600"
                >
                    +{totalIncome}
                    <Badge
                        className="absolute top-2 left-2"
                        variant={"outline"}
                    >
                        Income
                    </Badge>
                </Button>
            </div>
        </div>
    );
}
