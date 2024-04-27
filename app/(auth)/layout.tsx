import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface Props {
    children: React.ReactNode;
}
export const metadata = { title: "LogIn" };
export default async function Layout({ children }: Props) {
    const session = await getServerSession();
    if (session) {
        redirect("/trail");
    }
    return <div>{children}</div>;
}
