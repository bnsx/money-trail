"use client";
import { Badge } from "@/components/ui/badge";
import { defaultFont } from "@/lib/font";

interface Props {
    data: string | null | undefined;
}
export function CategoryBadge({ data }: Props) {
    return (
        <Badge
            className={`${defaultFont.className} text-sm w-fit h-fit`}
            variant={"secondary"}
        >
            {data || "Uncategory"}
        </Badge>
    );
}
