import * as Utils from '../utils';

export interface DisplayColumns {
    primaryColumn: string;
    displayColumns: string[] | [];
}

export function handleDisplayColumns(displayColumns: string[] | [], columnNames: string[] | []): DisplayColumns {


    const cleanedDisplayColumns = Utils.handleDefault(displayColumns) as string[] | [];
    

    if (Array.isArray(cleanedDisplayColumns) && cleanedDisplayColumns.length > 0) {
        return {
            primaryColumn: cleanedDisplayColumns[0],
            displayColumns: cleanedDisplayColumns.slice(1) as string[]
        };
    }
    return {
        primaryColumn: columnNames[0],
        displayColumns: []
    };
}