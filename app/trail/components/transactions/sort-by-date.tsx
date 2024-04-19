"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAtom } from "jotai";
import { useState } from "react";
import { filterAtom } from "./state";

export function SortByRecordedDate() {
    const [filter, setFilter] = useAtom(filterAtom);
    const SortValueTranslator = () =>
        filter.sortByDate === "older" ? true : false;
    const [checked, setChecked] = useState(() => SortValueTranslator());

    const onCheckedChange = (value: boolean) => {
        setChecked(!checked);
        if (value === false) {
            setFilter({ ...filter, sortByDate: "newer" });
        } else {
            setFilter({ ...filter, sortByDate: "older" });
        }
    };

    return (
        <div className="space-y-0.5">
            <Label
                htmlFor="sortByDate"
                className="text-xs xl:text-sm font-semibold"
            >
                Sort by Date
            </Label>
            <div className="flex xl:gap-2 gap-1 items-center">
                <span className="text-xs xl:text-sm">Newer</span>
                <Switch
                    id="sortByDate"
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                />
                <span className="text-xs xl:text-sm">Older</span>
            </div>
        </div>
    );
}
