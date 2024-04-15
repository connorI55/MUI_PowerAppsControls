export function mapFontWeight(value: string | undefined, appTheme?: ComponentFramework.Theme) {
    switch(value) {
        case "Lighter":
        return 300;
        case "Normal":
        return appTheme?.fontWeightRegular || 400;
        case "Semibold":
        return appTheme?.fontWeightSemibold | 600;
        case "Bold":
        return appTheme?.fontWeightBold || 700;
        case 'val':
        return null;
        case "":
        return null;
        case null:
        return null;
        default:
        throw new Error("Invalid font weight value");
    }
}