import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Utils from '../../utils';
import { Typography } from '@mui/material';

export interface ISelectProps {
    items: ComponentFramework.PropertyTypes.DataSet;
    displayColumns?: string[];
    label?: string;
    //size: "small" | "medium" | "large";
    default?: string;
    placeholder?: string;
    helperText?: string;
    style?: "standard" | "filled" | "outlined";
    multiSelect: boolean;
    //rows?: number;
    size: "small" | "medium" ;
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
  console.log("rendered")
  const [selectedItemID, setSelected] = React.useState<string | string[]>((props.multiSelect ? [] : ''));
  const parentKey = React.useMemo(() => Utils.generateGUID(), []);
  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    if (props.multiSelect) {
      setSelected(event.target.value as string[]);
  } else {
    setSelected(event.target.value as string);
  }
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const id = event.currentTarget.id;
    id === selectedItemID ? setSelected('') : setSelected(id);
  };
  const records = props.items.sortedRecordIds.map(id => props.items?.records[id]) ?? [];
  const columns = props.items.columns;
  const columnNames = columns.map(col => col.name);
  const displayColumns = Utils.handleDisplayColumns(props.displayColumns ?? [], columnNames);
  const selectedRecords: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[] = 
    Array.isArray(selectedItemID) ? 
    records.filter(record => selectedItemID.some(id => id === record?.getRecordId())) as ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[] 
    : [records.find(record => record?.getRecordId() === selectedItemID)] as ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[] ;
  const selectedValue = selectedRecords?.map(record => record.getFormattedValue(displayColumns.primaryColumn)).join(', ');
  const cleanedHelperText = Utils.handleDefault(props.helperText);

  return (
      <FormControl 
        variant={props.style}
        fullWidth={true} 
        key={parentKey} 
        required={props.required} 
        disabled={props.isEnabled} 
        error = {props.validationState == "error"}
        size={props.size}
      >
        <InputLabel 
          id={parentKey + "-label"}>{props?.label}
        </InputLabel>
        <Select
          labelId={parentKey + "-select-label"}
          id={parentKey + "-select-id"}
          multiple={props.multiSelect}
          value={selectedItemID}
          label={props?.label} 
          onChange={handleChange}
          renderValue={() => {
            if (selectedItemID) {
              return <div>{selectedValue}</div>;
            }
            return <em>{Utils.handleDefault(props.placeholder)}</em>;
          }}
        >
      
          {records.map((record) => {
            const id = record?.getRecordId();
            const formattedPrimaryValue = record?.getFormattedValue(displayColumns.primaryColumn);
            return (
              <MenuItem 
              key={id} 
              value={id}
              onClick={handleClick}>
                <div>
                  <Typography variant="body1" color="textPrimary">
                    {formattedPrimaryValue}
                  </Typography>
                  {displayColumns.displayColumns.map((otherColumn) => (
                    <Typography variant="body2" color="textSecondary" key={id + "-" + otherColumn}>
                      {record?.getFormattedValue(otherColumn)}
                    </Typography>
                  ))}
                </div>
              </MenuItem>
            );
          })}
          
        </Select>
        {cleanedHelperText && <FormHelperText>{cleanedHelperText}</FormHelperText>}
      </FormControl>
    );
  }

export default MUISelectControl;