import * as React from 'react';
import { TextField, createTheme, ThemeProvider} from '@mui/material';
import * as Utils from '../../utils';
import { handleAdornments } from './utils/handleAdornments';
import { Box } from '@mui/system';

export interface ITextFieldProps {
  label?: string;
  //size: "small" | "medium" | "large";
  default?: string;
  placeholder?: string;
  helperText?: string;
  style?: "filled" | "outlined" ;
  mode: "singleline" | "multiline" ;
  rows?: number;
  size: "small" | "medium" ;
  required: boolean;
  adornmentValue?: string;
  adornmnetPosition: "start" | "end";
  //align: "flex-start" | "center" | "flex-end";
  verticalAlign: "flex-start" | "center" | "flex-end";
  appTheme: ComponentFramework.Theme,
  isEnabled: boolean;
  handleEvent: (newValue: string) => void;
  //handleAutoSizing: (height: number, width: number) => void;
  font?: string;
  fontSize?: number;
  fontColor?: string;
  fontWeight?: "Lighter" | "Normal" | "Semibold" | "Bold";
  primaryColor?: string;
  focus?: boolean;
  validationState: "error" | "none";
}


const MUITextField_Control: React.FC<ITextFieldProps> = (props) => {

  const key = Utils.generateGUID();
  const theme = createTheme({
    palette: {
      primary: {
        main: Utils.handleDefault(props.primaryColor) || props.appTheme?.colorBrandForeground1 || "#0078d4"
      }
    },
    typography: {
      fontFamily: Utils.handleDefault(props.font) || props.appTheme?.fontFamilyBase || "Segoe UI",
      body1: {
        fontSize: props.fontSize || props.appTheme?.fontSizeBase300 || 14,
        fontWeight: Utils.mapFontWeight(props.fontWeight, props) || props.appTheme?.fontWeightRegular || "Normal",
      }
    }
  });
  const adornmentProps = 
    Utils.handleDefault(props.adornmentValue) && props.adornmnetPosition 
      ? { InputProps: handleAdornments(props.adornmentValue, props.adornmnetPosition) } 
      : {};
  const boxRef = React.useRef<HTMLDivElement>(null);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={
          { 
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }
        }
      >
        <TextField 
          fullWidth
          hiddenLabel
          required = {props.required}
          multiline= {props.mode === "multiline"}
          rows={props.mode === "multiline" ? props.rows : 0}
          id={key} 
          defaultValue={Utils.handleDefault(props.default)}
          placeholder={props.placeholder}
          label={props.label}
          variant={props.style} 
          size = {props.size}
          helperText = {Utils.handleDefault(props.helperText)}
          {...adornmentProps}
          error = {props.validationState == "error"}
          onChange={(event) => props.handleEvent(event.target.value)}
          margin="dense"
        />
      </Box>
   
    </ThemeProvider>
  );
}

export default MUITextField_Control;