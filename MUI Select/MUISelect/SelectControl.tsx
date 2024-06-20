import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Utils from '../../utils';
import { ThemeProvider, Typography, createTheme } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { Theme, useTheme } from '@mui/material/styles';
import { on } from 'events';

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
    align: "flex-start" | "center" | "flex-end";
    verticalAlign: "flex-start" | "center" | "flex-end";
    appTheme: ComponentFramework.Theme,
    isEnabled: boolean;
    handleEvent: (newValue: string) => void;
    handleAutoSizing: (height: number, width: number) => void;
    onChange: (newValue: string) => void;
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
  const boxRef = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef<HTMLDivElement>(null);
  const records = props.items.sortedRecordIds.map(id => props.items?.records[id]) ?? [];
  const columns = props.items.columns;
  const columnNames = columns.map(col => col.name);
  const displayColumns = Utils.handleDisplayColumns(props.displayColumns ?? [], columnNames);
  const selectedRecords: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[] = 
    records.filter(record => selectedItemIDs.some(id => id === record?.getRecordId()));
  const selectedRecordValues = selectedRecords.map(record => {
    const values: { [key: string]: string } = {};
    columnNames.forEach(column => {
      values[column] = record.getFormattedValue(column);
    });
    return values;
  });
  const selectedDisplayValue = selectedRecords[0] ? selectedRecords?.map(record => record.getFormattedValue(displayColumns.primaryColumn)).join(', ') : '';
  const selectValue = props.multiSelect ? selectedItemIDs : selectedItemIDs[0] ?? '';
  const cleanedHelperText = Utils.handleDefault(props.helperText);

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    let newValues = event.target.value;
    let selectedRecords: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[];
  
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

  
  const theme = createTheme({
    palette: {
      primary: {
        main: Utils.handleDefault(props.primaryColor) || props.appTheme?.colorBrandForeground1 || "#0078d4",
      },
    },
    typography: {
      fontFamily: Utils.handleDefault(props.font) || props.appTheme?.fontFamilyBase || "Segoe UI",
      body1: {
        fontSize: props.fontSize || props.appTheme?.fontSizeBase300 || 14,
        fontWeight: Utils.mapFontWeight(props.fontWeight, props) || props.appTheme?.fontWeightRegular || "Normal",
        color: props.fontColor || "",
      },
    },
    components: {
      MuiFormControl: {
        styleOverrides: {
          root: {
            height: '100%' //? '100%' : 'auto', 
          },
        },
      },
   
      MuiInputBase: {
        styleOverrides: {
          root: {
            height: '100%' //? '100%' : 'auto', 
          },
          input: { 
            color: props.fontColor || "", 
          },
        },
      },
    },
  });

  React.useEffect(() => {
   
    const selectedRecords: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[] = 
      records.filter(record => selectedItemIDs.some(id => id === record?.getRecordId()));
    const selectedRecordValues = selectedRecords.map(record => {
      const values: { [key: string]: string } = {};
      columnNames.forEach(column => {
        values[column] = record.getFormattedValue(column);
      });
      return values;
    });
    
    props.onChange(JSON.stringify(selectedRecordValues));

  }, [selectedItemIDs, props.items]);

  React.useEffect(() => {
      setSelectedIDs([] as string[]);
  }, [props.multiSelect])

  React.useEffect(() => {
    if (boxRef.current && formRef.current) {
      const style = window.getComputedStyle(boxRef.current);
      const marginLeft = parseFloat(style.marginLeft);
      const marginRight = parseFloat(style.marginRight);
      const totalMargin = marginLeft + marginRight;

      const currentHeight = formRef.current.clientHeight;
      const currentWidth = formRef.current.clientWidth + totalMargin + 1;
      props.handleAutoSizing(currentHeight, currentWidth);
    }
  }, [props.font, props.fontSize, props.fontWeight, props.label, props.size, props.align, props.verticalAlign, boxRef.current?.clientWidth]);
 

  return (
    <ThemeProvider theme={theme} key={parentKey}>
    <Box 
      ref={boxRef}
      sx={
        { 
          display: "flex",
          flexDirection: "column",
          justifyContent: props.verticalAlign,
          width: "100%"
        }
        }>
      <FormControl 
        variant={props.style}
        fullWidth={!props.autoWidth} 
        key={parentKey} 
        required={props.required} 
        disabled={props.isEnabled} 
        error = {props.validationState == "error"}
        size={props.size}
        sx={{ 
          minWidth: 80,
          margin: "5px",
          alignSelf: props.verticalAlign
        }}
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
          renderValue={() => {
            if (selectedRecords.length === 0) 
              {return <em>{Utils.handleDefault(props.placeholder)}</em>}
            else if (props.multiSelectStyle === "chips" && props.multiSelect) {
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedRecords.map((record) => {
                    const id = record.getRecordId();
                    const formattedValue = record.getFormattedValue(displayColumns.primaryColumn);
                    return <Chip key={id} label={formattedValue}/>;
                  })}
                </Box>
              );
            }

            else {
              return (<div>{selectedDisplayValue}</div>)
            }
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
                  {displayColumns.displayColumns.map((otherColumn) => {
                    const formattedValue = record?.getFormattedValue(otherColumn);
                    const isHTML = formattedValue && formattedValue.trim().startsWith('<');

                    if (isHTML) {
                      const validatedHTML = Utils.validateHTML(formattedValue);
                      if (validatedHTML.isValid) {
                        return <span key={`${id}-${otherColumn}`} dangerouslySetInnerHTML={{ __html: validatedHTML.sanitizedHTML as string }} />
                      }
                      else {
                        return (
                          <Typography variant="body2" color="textSecondary" key={`${id}-${otherColumn}`}>
                            <div>"{formattedValue}"</div>
                          </Typography>
                        );
                      
                      }
                    }
                })}
                  </div>
                </div>
              </MenuItem>
            );
          })}
          
        </Select>
        {cleanedHelperText && <FormHelperText>{cleanedHelperText}</FormHelperText>}
      </FormControl>
      </Box>
    </ThemeProvider>
    );
  }

export default MUISelectControl;