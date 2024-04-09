import { $Enums } from "@prisma/client";
import { prisma } from "./db";

interface createMemberProps {
    username: string;
    email: string;
    role: $Enums.MemberRole;
    provider: string;
}
interface hasMemberProps {
    memberID?: string;
    username?: string;
    email?: string;
    status?: boolean;
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
        });
    }
    async hasMember({
        memberID,
        username,
        email,
        status = true,
    }: hasMemberProps) {
        return await prisma.members.findUnique({
            where: { memberID, username, email, status },
            select: {
                memberID: true,
                username: true,
                email: true,
                status: true,
                role: true,
                provider: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
                isoNumeric: true,
                countries: { select: { currencyCode: true } },
            },
        });
    }
}
export const member = new Member();
