import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import * as Utils from '../../utils';
import { DisplayColumns } from '../../utils/handleDisplayColumns';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface CustomMenuItemProps {
    displayColumns: DisplayColumns;
    record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord;
    value: string; 
    handleChange: (selectedID: string) => void; 
}

const CustomMenuItem: React.FC<CustomMenuItemProps> = (props) => {
    const id = props.record?.getRecordId();
    const formattedValue = props.record?.getFormattedValue(props.displayColumns.primaryColumn);
    const handleClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        props.handleChange(id);
    }
    return (
        <MenuItem 
        key={id} 
        value={props.value} 
        onClick={handleClick}>{formattedValue}
        </MenuItem>
    );
};

export default CustomMenuItem;
