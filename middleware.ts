export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/trail/:path*",
        "/profile/:path*",
        "/setup/:path*",
        "/api/setup/",
    ],
};