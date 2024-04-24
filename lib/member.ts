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
    select?: {
        username?: boolean;
        email?: boolean;
        role?: boolean;
        status?: boolean;
        provider?: boolean;
        countries?: {
            select?: {
                name?: boolean;
                currencyCode?: boolean;
            };
        };
        memberID?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        deletedAt?: boolean;
        isoNumeric?: boolean;
    };
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
        });
    }
    async hasMember({
        memberID,
        username,
        email,
        select = {
            username: true,
            email: true,
            role: true,
            status: true,
            provider: true,
            countries: { select: { name: true, currencyCode: true } },
            memberID: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            isoNumeric: true,
        },
    }: hasMemberProps) {
        return await prisma.members.findUnique({
            where: { memberID, username, email },
            select,
            // select: {
            //     memberID: true,
            //     username: true,
            //     email: true,
            //     status: true,
            //     role: true,
            //     provider: true,
            //     createdAt: true,
            //     updatedAt: true,
            //     deletedAt: true,
            //     isoNumeric: true,
            //     countries: { select: { currencyCode: true } },
            // },
        });
    }
    async deactivate({ memberID }: deactivateProps) {
        return await prisma.members.update({
            where: { memberID, status: true, deletedAt: null },
            data: { status: false, deletedAt: new Date() },
            select: { status: true },
        });
    }
}
export const member = new Member();
