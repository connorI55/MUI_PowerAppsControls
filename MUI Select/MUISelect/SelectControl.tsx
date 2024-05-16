import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Utils from '../../utils';

export interface ISelectProps {
    items: ComponentFramework.PropertyTypes.DataSet;
    displayFields?: string[];
    label?: string;
    //size: "small" | "medium" | "large";
    default?: string;
    placeholder?: string;
    helperText?: string;
    //style?: "filled" | "outlined" ;
    //mode: "singleline" | "multiline" ;
    //rows?: number;
    //size: "small" | "medium" ;
    required: boolean;
    //adornmentValue?: string;
    //adornmnetPosition: "start" | "end";
    //align: "flex-start" | "center" | "flex-end";
    //verticalAlign: "flex-start" | "center" | "flex-end";
    appTheme: ComponentFramework.Theme,
    isEnabled: boolean;
    //handleEvent: (newValue: string) => void;
    //handleAutoSizing: (height: number, width: number) => void;
    font?: string;
    fontSize?: number;
    fontColor?: string;
    fontWeight?: "Lighter" | "Normal" | "Semibold" | "Bold";
    primaryColor?: string;
    focus?: boolean;
    validationState: "error" | "none";
  }
  

const MUISelectControl: React.FC<ISelectProps> = (props) => {
    const [selectedItemID, setSelected] = React.useState('');
    const parentKey = React.useMemo(() => Utils.generateGUID(), []);
    const handleChange = (event: SelectChangeEvent) => {
      setSelected(event.target.value as string);
    };
    const records = props.items.sortedRecordIds.map(id => props.items?.records[id]) ?? [];
    const columns = props.items.columns;
    const displayColumn = props.displayFields ? props.displayFields[0] : columns[0].name;
    return (
        <FormControl fullWidth={true} key={parentKey}>
          <InputLabel id={parentKey + "-label"}>{props?.label}</InputLabel>
          <Select
            labelId={parentKey + "-select-label"}
            id={parentKey + "-select-id"}
            value={selectedItemID}
            label={displayColumn}
            onChange={handleChange}
          >
        
            {records.map((record) => {
              const id = record?.getRecordId();
              const formattedValue = record?.getFormattedValue(displayColumn);
              return (
                <MenuItem key={id} value={id}>{formattedValue}</MenuItem>
              );
            })}
            
          </Select>
        </FormControl>
    );
  }

export default MUISelectControl;