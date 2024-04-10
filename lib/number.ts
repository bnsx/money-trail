export function NumberThousand(data: number | string) {
    return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
