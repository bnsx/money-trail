"use client";

import { useAtom } from "jotai";
import { filterAtom } from "./state";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
const typeList = ["all", "income", "expense"];

export function FilterType() {
    const [filter, setFilter] = useAtom(filterAtom);
    const onValueChange = (value: string) =>
        setFilter({ ...filter, type: value });
    return (
        <div className="space-y-0.5">
            <Label
                htmlFor="tx_type"
                className="text-xs xl:text-sm font-semibold"
            >
                Transaction Type
            </Label>
            <Select
                name="tx_type"
                onValueChange={onValueChange}
                defaultValue={
                    !typeList.includes(filter.type) ? "all" : filter.type
                }
            >
                <SelectTrigger id="tx_type" className="max-w-[160px]">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
