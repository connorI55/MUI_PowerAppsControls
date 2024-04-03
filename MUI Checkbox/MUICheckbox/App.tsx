import * as React from 'react';
import { Checkbox, FormControlLabel, createTheme, ThemeProvider, appBarClasses } from '@mui/material';
import { Box } from '@mui/system';

export interface ICheckboxProps {
  label?: string;
  size: "small" | "medium" | "large";
  value: boolean;
  labelPosition: "end" | "start" | "top" | "bottom";
  align: "flex-start" | "center" | "flex-end";
  verticalAlign: "flex-start" | "center" | "flex-end";
  wrap: boolean;
  appTheme: ComponentFramework.Theme,
  isEnabled: boolean;
  onChange: (newValue: boolean) => void;
  handleAutoSizing: (height: number, width: number) => void;
  rippleEffect: boolean;
  font?: string;
  fontSize?: number;
  fontColor?: string;
  fontWeight?: "Lighter" | "Normal" | "Semibold" | "Bold";
  primaryColor?: string;
}

const MUICheckboxControl: React.FC<ICheckboxProps> = (props) => {

  function mapFontWeight(value: string | undefined) {
    switch(value) {
      case "Lighter":
        return 300;
      case "Normal":
        return props.appTheme?.fontWeightRegular || 400;
      case "Semibold":
        return props.appTheme?.fontWeightSemibold | 600;
      case "Bold":
        return props.appTheme?.fontWeightBold || 700;
      case 'val':
        return null;
      case "":
        return null;
      case null:
        return null;
      default:
        throw new Error("Invalid font weight value");
    }
  }

  function boxMultiplier(size: string, fontSize: string) {
    const fontSizeValue = Number(fontSize.replace('px', '').replace('pt', ''));
    switch(size) {
      case "small": 
        return fontSizeValue * 1.3;
      case "medium": 
        return fontSizeValue * 2;
      case "large": 
        return fontSizeValue * 2.5;
      default:
        throw new Error("Invalid size value");
    }
  }
  const boxRef = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState<boolean>(props.value || false);
  const theme = createTheme({
    palette: {
      primary: {
        main: handleDefault(props.primaryColor) || props.appTheme?.colorBrandForeground1 || "#0078d4"
      }
    },
    typography: {
      fontFamily: handleDefault(props.font) || props.appTheme?.fontFamilyBase || "Segoe UI",
      //fontSize: props.appTheme?.fontSizeBase300, 
      body1: {
        fontSize: props.fontSize || props.appTheme?.fontSizeBase300 || 14,
        fontWeight: mapFontWeight(props.fontWeight) || props.appTheme?.fontWeightRegular || "Normal",
      }
    }
  });

  const [key] = React.useState(() => {
    function generateGUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
      });
    }
    return generateGUID();
  });

  React.useLayoutEffect(() => {
    if (boxRef.current && formRef.current) {
      const style = window.getComputedStyle(boxRef.current);
      const marginLeft = parseFloat(style.marginLeft);
      const marginRight = parseFloat(style.marginRight);
      const totalMargin = marginLeft + marginRight;

      const currentHeight = formRef.current.clientHeight;
      const currentWidth = formRef.current.clientWidth + totalMargin + 1;
      props.handleAutoSizing(currentHeight, currentWidth);
    }
  }, [props.font, props.fontSize, props.fontWeight, props.label, props.size, props.labelPosition, props.align, props.verticalAlign, boxRef.current?.clientWidth, props.wrap]);

   React.useEffect(() => {
     setState(props.value);
   }, [props.value]);

  //  React.useEffect(() => {
  //    props.onChange(state);
  //  }, [state]);

   function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const newValue = event.target.checked;
      setState(newValue);
      props.onChange(newValue); 
   }

  console.log("Control rendered, key: " + key)

  return (
    <ThemeProvider theme={theme} key={key}>
      <Box 
      ref={boxRef}
        sx={
          { 
            margin: "5px",
            display: "flex",
            width: "100%",
            justifyContent: props.align,
            overflow: "hidden",
          }
          }>
        <FormControlLabel
          sx={{ 
            marginLeft: '0',
            marginRight: '0',
            alignSelf: props.verticalAlign,
            whiteSpace: props.wrap ? 'normal' : 'nowrap',
          }}
          ref={formRef}
          control={
            <Checkbox
            sx={{
              '& .MuiSvgIcon-root': { fontSize: boxMultiplier(props.size, String(theme.typography.body1.fontSize)) },
              }}
              checked={state} 
              onChange={(event) => handleChange(event)}
              disabled={props.isEnabled}
              disableRipple={!props.rippleEffect}
            />
          }
          label={props.label}
          labelPlacement={props.labelPosition}
        />
      </Box>
    </ThemeProvider>
  );
}

export default MUICheckboxControl;

function handleDefault(value: string | undefined) {
  return value === 'val' ? null : value;
}
