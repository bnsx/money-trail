import { member } from "@/lib/member";
import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
export const authOptions: NextAuthOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    callbacks: {
        signIn: async ({ account, profile }) => {
            try {
                if (account && profile && profile.email !== undefined) {
                    const retriveData = await member.hasMemberForSigninOnly({
                        username: account.providerAccountId,
                        select: { memberID: true },
                    });
                    if (!retriveData) {
                        const username = account.providerAccountId;
                        const email = profile.email;
                        await member.createMember({
                            username,
                            email,
                            role: "staff",
                            provider: "google",
                        });
                        return true;
                    }
                    return true;
                }
                return false;
            } catch (error) {
                // console.log(error)
                return false;
            }
        },
        jwt: async ({ token, account, user }) => {
            if (account) {
                const data = await member.hasMemberForSigninOnly({
                    username: user.id,
                    select: { memberID: true },
                });
                if (!data) {
                    return token;
                }
                token.id = data.memberID;
                return token;
            }
            return token;
        },
        session: async ({ session, token }) => {
            session.user.id = token.id;
            session.user.email = token.email;
            return session;
        },
        redirect: async ({ url, baseUrl }) => {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    events: {
        async session({ token, session }) {
            const hasMember = await member.hasMember({
                memberID: session.user.id,
                select: { memberID: true, status: true },
            });
            if (!hasMember || hasMember.status === false) {
                session.user.forceSignOut = true;
            }
        },
    },
};
