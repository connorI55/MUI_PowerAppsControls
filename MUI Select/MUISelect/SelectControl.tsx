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
    multiSelectStyle: "default" | "checkmarks" | "chips";
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
  const [selectedItemIDs, setSelectedIDs] = React.useState<string[]>(([]));
  const parentKey = React.useMemo(() => Utils.generateGUID(), []);
  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    let newValues = event.target.value;
    if(Array.isArray(newValues)){
      setSelectedIDs(newValues)
    }
    else if(!Array.isArray(newValues) && newValues === selectedItemIDs[0]) {
      setSelectedIDs([])
    }
    else if (!Array.isArray(newValues)) {
      setSelectedIDs([newValues])
    }

  };
  const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    selectedItemIDs[0] === id ? setSelectedIDs([]) : setSelectedIDs([id]);
  }
  const records = props.items.sortedRecordIds.map(id => props.items?.records[id]) ?? [];
  const columns = props.items.columns;
  const columnNames = columns.map(col => col.name);
  const displayColumns = Utils.handleDisplayColumns(props.displayColumns ?? [], columnNames);
  const selectedRecords: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[] = 
    records.filter(record => selectedItemIDs.some(id => id === record?.getRecordId())) as ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[];
  const selectedDisplayValue = selectedRecords[0] ? selectedRecords?.map(record => record.getFormattedValue(displayColumns.primaryColumn)).join(', ') : '';
  const selectValue = props.multiSelect ? selectedItemIDs : selectedItemIDs[0] ?? '';
  const cleanedHelperText = Utils.handleDefault(props.helperText);


  React.useEffect(() => {
      setSelectedIDs([] as string[]);
  }, [props.multiSelect])

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
          value={selectValue}
          label={props?.label} 
          onChange={handleChange}
          renderValue={() => {
            if (selectedItemIDs.length > 0) {
              return <div>{selectedDisplayValue}</div>;
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
              onClick={(event) => !props.multiSelect ? handleClick(event, id) : null}
              >
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