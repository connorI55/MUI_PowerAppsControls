import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import StandardMenuItemComponent from './StandardMenuItem';
import GroupedMenuItemComponent from './groupedMenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Utils from '../../utils';
import { ThemeProvider, Typography, createTheme } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { Theme, useTheme } from '@mui/material/styles';
import Zoom from '@mui/material/Zoom'; 

export interface ISelectProps {
    records: ComponentFramework.PropertyTypes.DataSet["records"];
    columns: ComponentFramework.PropertyTypes.DataSet["columns"];
    sortedRecordIDs: ComponentFramework.PropertyTypes.DataSet["sortedRecordIds"];
    displayColumns: string[];
    groupByColumn: string;
    label?: string;
    default?: string;
    placeholder?: string;
    helperText?: string;
    style?: "standard" | "filled" | "outlined";
    multiSelect: boolean;
    multiSelectStyle: "default" | "checkmarks" | "chips";
    size: "small" | "medium" ;
    required: boolean;
    expandWidth: boolean;
    expandHeight: boolean;
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
    containerHeight: number,
    containerWidth: number
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
  const records = props.sortedRecordIDs.map(id => props.records[id]) ?? [];
  const columns = props.columns;
  const columnNames = columns.map(col => col.name);
  const displayColumns = Utils.handleDisplayColumns(props.displayColumns ?? [], columnNames);
  const selectedRecords: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[] = 
    records.filter(record => selectedItemIDs.some(id => id === record?.getRecordId()));
  const groupByCategories = Array.from(new Set(records.map(record => record.getFormattedValue(props.groupByColumn))));
  const selectedDisplayValue = selectedRecords[0] ? selectedRecords?.map(record => record.getFormattedValue(displayColumns.primaryColumn)).join(', ') : '';
  const selectValue = props.multiSelect ? selectedItemIDs : selectedItemIDs[0] ?? '';
  const cleanedHelperText = Utils.handleDefault(props.helperText);

  const handleClick = (id: string) => {
    if (props.multiSelect) {
      if (selectedItemIDs.includes(id)) {
        setSelectedIDs(selectedItemIDs.filter(item => item !== id));
      } else {
        setSelectedIDs([...selectedItemIDs, id]);
      }
    } else {
      setSelectedIDs(selectedItemIDs[0] === id ? [] : [id]);
    }
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
    const returnColumns = 
      props.displayColumns.length > 0 ? props.displayColumns : props.columns.map(record => record.name);
    const selectedRecordValues = selectedRecords.map(record => {
      const values: { [key: string]: string } = {};
      returnColumns.forEach(column => {
        values[column] = record.getFormattedValue(column);
      });
      return values;
    });
    //const selectedIDValues = selectedItemIDs.map((id) => parseInt(id.replace("id", "")));
    
    props.onChange(JSON.stringify(selectedRecordValues));

  }, [selectedItemIDs]);

  React.useEffect(() => {
      setSelectedIDs([] as string[]);
  }, [props.multiSelect, props.groupByColumn, props.default])

  React.useEffect(() => {
    if (formRef.current) {
      const style = window.getComputedStyle(formRef.current);
      const marginLeft = parseFloat(style.marginLeft);
      const marginRight = parseFloat(style.marginRight);
      const totalMargin = marginLeft + marginRight;

      const currentHeight = formRef.current.clientHeight;
      const currentWidth = formRef.current.clientWidth + totalMargin + 1;
      props.handleAutoSizing(currentHeight, currentWidth);
    }
  }, [props.expandHeight, props.expandWidth, props.size, props.containerHeight, props.containerWidth, props.label, props.helperText, props.validationState, props.multiSelect, props.placeholder, props.style]);
 
    console.log("height log: " + formRef.current?.clientHeight)

  return (
    <ThemeProvider theme={theme} key={parentKey}>
    <Box 
      ref={boxRef}
      sx={
        { 
          display: "flex",
          flexDirection: "column",
          justifyContent: props.verticalAlign,
          width: props.containerWidth + "px",
          height: props.containerHeight + "px"
        }
        }>
      <FormControl 
        ref={formRef}
        variant={props.style}
        fullWidth={props.expandWidth} 
        key={parentKey} 
        required={props.required} 
        disabled={props.isEnabled} 
        error = {props.validationState == "error"}
        size={props.size}
        sx={{ 
          minWidth: 80,
          margin: "5px",
          alignSelf: props.align,
          height: props.expandHeight ? "100%" : "auto"
        }}
      >
        <InputLabel 
          id={parentKey + "-label"}>{props?.label}
        </InputLabel>
        <Select
          labelId={parentKey + "-select-label"}
          id={parentKey + "-select-id"}
          multiple={props.multiSelect}
          autoWidth={props.expandWidth}
          value={selectValue}
          label={props?.label} 
          MenuProps={{
            TransitionComponent: Zoom
          }}
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
      
      {
        Utils.handleDefault(props.groupByColumn) === "" || props.groupByColumn === null ? (
          records.map((record) => {
            const id = record?.getRecordId();
            const formattedPrimaryValue = record?.getFormattedValue(displayColumns.primaryColumn);
            return (
              <StandardMenuItemComponent
                key={id}
                id={id}
                formattedPrimaryValue={formattedPrimaryValue}
                selectedItemIDs={selectedItemIDs}
                multiSelect={props.multiSelect}
                multiSelectStyle={props.multiSelectStyle}
                handleClick={handleClick}
                displayColumns={displayColumns.displayColumns}
                record={record}
                Utils={Utils}
              />
            );
          })
        ) : (
          groupByCategories.map((thiscategory) => {
            const filteredRecords = records.filter(record => record.getFormattedValue(props.groupByColumn) === thiscategory);
            const formattedGroupName = thiscategory;
            return (
              <GroupedMenuItemComponent
                key={formattedGroupName}
                id={formattedGroupName}
                formattedPrimaryValue={formattedGroupName}
                selectedItemIDs={selectedItemIDs}
                multiSelect={props.multiSelect}
                multiSelectStyle={props.multiSelectStyle}
                handleClick={handleClick}
                displayColumns={displayColumns}
                record={records[0]}
                Utils={Utils}
                formattedGroupName={formattedGroupName}
                filteredRecords={filteredRecords}
              />
            );
          })
        )
      }
          
        </Select>
        {cleanedHelperText && <FormHelperText>{cleanedHelperText}</FormHelperText>}
      </FormControl>
      </Box>
    </ThemeProvider>
    );
  }

export default MUISelectControl;