"use client";
import { Badge } from "@/components/ui/badge";
import { sarabunFont } from "@/lib/font";

interface Props {
    data: string | null | undefined;
}
export function CategoryBadge({ data }: Props) {
    return (
        <Badge
            className={`${sarabunFont.className} w-fit h-fit`}
            variant={"secondary"}
        >
            {data || "Uncategory"}
        </Badge>
    );
}
