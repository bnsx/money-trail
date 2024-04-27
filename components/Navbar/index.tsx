import Link from "next/link";
import { PathList } from "./list";
import { ProfilePortal } from "./profile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function Navbar() {
    const session = await getServerSession(authOptions);
    return (
        <nav className="sticky top-0 z-[1]">
            <div className="flex items-center justify-between xl:px-32 px-4 py-4 backdrop-blur bg-transparent">
                <Link href={"/trail"} className="flex gap-2">
                    <h1 className="text-lg xl:text-xl font-bold">Money</h1>
                    <h1 className="text-lg xl:text-xl font-bold  text-red-500">
                        Trail
                    </h1>
                </Link>
                <div className="flex items-center gap-5">
                    <PathList />
                    {session ? (
                        <>
                            <ProfilePortal session={session} />
                        </>
                    ) : (
                        <Link href={"/login"}>Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
