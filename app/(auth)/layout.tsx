import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

interface Props {
    children: React.ReactNode;
}
export const metadata = { title: "LogIn" };
export default async function Layout({ children }: Props) {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/trail");
    }
    return <div>{children}</div>;
}
