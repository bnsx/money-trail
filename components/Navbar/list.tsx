import Link from "next/link";

interface PathListProps {
    label: string;
    href: string;
}
export const pathList: PathListProps[] = [
    { label: "Trail", href: "/trail" },
    // { label: "Q & A", href: "/trail#question" },
];

export function PathList() {
    return (
        <div className="hidden xl:block space-x-5">
            {pathList.map((x) => (
                <Link key={x.href} href={x.href}>
                    {x.label}
                </Link>
            ))}
        </div>
    );
}
