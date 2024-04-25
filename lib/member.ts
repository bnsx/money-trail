import { $Enums, Prisma } from "@prisma/client";
import { prisma } from "./db";

interface createMemberProps {
    username: string;
    email: string;
    role: $Enums.MemberRole;
    provider: string;
}
interface hasMemberForSigninOnlyProps<T> {
    username?: string;
    select: T;
}
interface hasMemberProps<T> {
    memberID?: string;
    select: T;
}
interface deactivateProps {
    memberID: string;
}

class Member {
    async createMember({ username, email, role, provider }: createMemberProps) {
        return await prisma.members.create({
            data: {
                username,
                email,
                role,
                provider,
            },
            select: { memberID: true },
        });
    }
    async hasMember<T extends Prisma.membersSelect>({
        memberID,
        select,
    }: hasMemberProps<T>) {
        return await prisma.members.findUnique({
            where: { memberID, username, email },
            select,
        });
    }
    async deactivate({ memberID }: deactivateProps) {
        return await prisma.members.update({
            where: { memberID, status: true, deletedAt: null },
            data: {
                status: false,
                updatedAt: new Date(),
                deletedAt: new Date(),
            },
            select: { status: true },
        });
    }
}
export const member = new Member();
