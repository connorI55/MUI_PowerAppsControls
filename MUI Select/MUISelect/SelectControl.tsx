import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Utils from '../../utils';
import { Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { Theme, useTheme } from '@mui/material/styles';

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
    autoWidth: boolean;
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

  function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
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
  const handleClick = (id: string) => {
    selectedItemIDs[0] === id ? setSelectedIDs([]) : setSelectedIDs([id]);
  }
  const records = props.items.sortedRecordIds.map(id => props.items?.records[id]) ?? [];
  const columns = props.items.columns;
  const columnNames = columns.map(col => col.name);
  const displayColumns = Utils.handleDisplayColumns(props.displayColumns ?? [], columnNames);
  const selectedRecords: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[] = 
    records.filter(record => selectedItemIDs.some(id => id === record?.getRecordId()));
  const selectedDisplayValue = selectedRecords[0] ? selectedRecords?.map(record => record.getFormattedValue(displayColumns.primaryColumn)).join(', ') : '';
  const selectValue = props.multiSelect ? selectedItemIDs : selectedItemIDs[0] ?? '';
  const cleanedHelperText = Utils.handleDefault(props.helperText);

  React.useEffect(() => {
      setSelectedIDs([] as string[]);
  }, [props.multiSelect])

  return (
      <FormControl 
        variant={props.style}
        fullWidth={!props.autoWidth} 
        key={parentKey} 
        required={props.required} 
        disabled={props.isEnabled} 
        error = {props.validationState == "error"}
        size={props.size}
        sx={{ minWidth: 80 }}
      >
        <InputLabel 
          id={parentKey + "-label"}>{props?.label}
        </InputLabel>
        <Select
          labelId={parentKey + "-select-label"}
          id={parentKey + "-select-id"}
          multiple={props.multiSelect}
          autoWidth={props.autoWidth}
          value={selectValue}
          label={props?.label} 
          onChange={handleChange}
          renderValue={(selected) => {
            if (props.multiSelectStyle === "chips" && props.multiSelect && Array.isArray(selected)) {
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const record = selectedRecords.find(record => record.getRecordId() === value);
                    const formattedValue = record ? record.getFormattedValue(displayColumns.primaryColumn) : value;
                    return <Chip key={value} label={formattedValue}/>;
                  })}
                </Box>
              );
            }

            else if (selectedItemIDs.length > 0) {
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
              onClick={() => !props.multiSelect ? handleClick(id) : null}
              >
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%'}}>
                    {props.multiSelectStyle === "checkmarks" ? <Checkbox checked={selectedItemIDs.indexOf(id) > -1} /> : null}
                    <Typography variant="body1" color="textPrimary">
                      {formattedPrimaryValue}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                    {displayColumns.displayColumns.map((otherColumn) => (
                    <Typography variant="body2" color="textSecondary" key={id + "-" + otherColumn}>
                      {record?.getFormattedValue(otherColumn)}
                    </Typography>
                  ))}
                  </div>
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