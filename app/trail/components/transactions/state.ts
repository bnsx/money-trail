import { atom } from "jotai";
import { DateRange } from "react-day-picker";
interface Filter {
    sortByDate: "asc" | "desc";
    type: string;
    days: DateRange | undefined;
}
export const filterAtom = atom<Filter>({
    sortByDate: "desc",
    type: "all",
    days: undefined,
});
