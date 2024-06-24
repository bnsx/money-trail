import { IBM_Plex_Sans_Thai } from "next/font/google";

export const defaultFont = IBM_Plex_Sans_Thai({
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    subsets: ["thai", "latin"],
    style: ["normal"],
});
