import { atom } from "jotai";
import { DateRange } from "react-day-picker";
interface Filter {
    sortByDate: "newer" | "older";
    type: string;
    days: DateRange | undefined;
}
export const filterAtom = atom<Filter>({
    sortByDate: "newer",
    type: "all",
    days: undefined,
});
