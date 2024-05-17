export function handleDefault(value: string | undefined | null | string[]) {

    if (Array.isArray(value) && value.length > 0) {
        return value[0] === "val" ? "" : value
    }
    return value === 'val' ? "" : value;
}