"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { IncomeAndExpense } from "./income-expense";

interface Props {
    incomeAndExpense: {
        totalIncome: string;
        totalExpense: string;
    };
    // currencyCode: string | null | undefined;
}
export function OverView({ incomeAndExpense }: Props) {
    function RenderCard({ className }: { className: string }) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="xl:min-w-96 xl:max-w-96">
                    <IncomeAndExpense data={incomeAndExpense} />
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">Updated data at last 30 Day</CardFooter>
            </Card>
        );
    }
    return (
        <div>
            <Accordion type="single" collapsible className="xl:hidden">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Overview</AccordionTrigger>
                    <AccordionContent>
                        <RenderCard className="xl:hidden" />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <RenderCard className="xl:block hidden" />
        </div>
    );
}
