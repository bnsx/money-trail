"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useAtom } from "jotai";
import { DateRange } from "react-day-picker";
import { filterAtom } from "./state";

interface Props {
    isDesktop: boolean;
}

export function FilterByDateRange({ isDesktop }: Props) {
    const [filter, setFilter] = useAtom(filterAtom);
    const defaultFromDate = new Date();
    defaultFromDate.setDate(defaultFromDate.getDate() - 5);

    const onReset = () => {
        // Reset the date range to default values
        setFilter({ ...filter, days: undefined });
    };
    return (
        <div className="grid justify-center gap-1">
            <Calendar
                mode="range"
                toDate={new Date()}
                selected={filter.days}
                onSelect={(newDays: DateRange | undefined) =>
                    setFilter({
                        ...filter,
                        days: newDays,
                    })
                }
                className="border rounded-md"
            />
            <div className="flex gap-1">
                <Button
                    type="button"
                    onClick={onReset}
                    className="w-full"
                    variant={"outline"}
                >
                    Reset Date
                </Button>
            </div>
        </div>
    );
}
