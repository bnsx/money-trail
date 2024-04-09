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
                    const retriveData = await member.hasMember({
                        username: account.providerAccountId,
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
                    if (retriveData.status === false) {
                        return false;
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
                const data = await member.hasMember({ username: user.id });
                if (!data) {
                    return token;
                }
                token.id = data.memberID;
                token.currencyCode = data.countries?.currencyCode;
                return token;
            }
            return token;
        },
        session: async ({ session, token }) => {
            session.user.id = token.id;
            session.user.email = token.email;
            session.user.currencyCode = token.currencyCode;
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
            });
            if (!hasMember) {
                session.user.forceSignOut = true;
            }
        },
    },
};
