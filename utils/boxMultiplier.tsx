export function boxMultiplier(size: string, fontSize: string) {
    const fontSizeValue = Number(fontSize.replace('px', '').replace('pt', ''));
    switch(size) {
        case "small": 
        return fontSizeValue * 1.3;
        case "medium": 
        return fontSizeValue * 2;
        case "large": 
        return fontSizeValue * 2.5;
        default:
        throw new Error("Invalid size value");
    }
}