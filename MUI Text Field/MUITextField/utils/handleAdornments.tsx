import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { handleDefault } from '../../../utils';

export function handleAdornments (value: string | undefined, position: "start" | "end") {
    if (position === "start") {
        return {
            startAdornment:
            <InputAdornment position="start">{value}</InputAdornment>
        }
    }
    else if (position === "end") {
        return {
            endAdornment:
            <InputAdornment position="end">{value}</InputAdornment>
        }
    }
    else {
        throw new Error("Invalid adornment values");
    }
}