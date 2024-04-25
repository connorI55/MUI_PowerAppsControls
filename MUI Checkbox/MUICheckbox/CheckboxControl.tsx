import * as React from 'react';
import { Checkbox, FormControlLabel, createTheme, ThemeProvider} from '@mui/material';
import { Box } from '@mui/system';
import * as Utils from '../../utils';

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
  //handleAutoSizing: (height: number, width: number) => void;
  rippleEffect: boolean;
  font?: string;
  fontSize?: number;
  fontColor?: string;
  fontWeight?: "Lighter" | "Normal" | "Semibold" | "Bold";
  primaryColor?: string;
  focus?: boolean;
}

const MUICheckboxControl: React.FC<ICheckboxProps> = (props) => {

  const boxRef = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState<boolean>(props.value || false);
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
  const key = React.useMemo(() => Utils.generateGUID(), []);
  const onChange = React.useCallback(() => {props.onChange(!state)}, [props.onChange]);

  React.useLayoutEffect(() => {
    if (boxRef.current && formRef.current) {
      const style = window.getComputedStyle(boxRef.current);
      const marginLeft = parseFloat(style.marginLeft);
      const marginRight = parseFloat(style.marginRight);
      const totalMargin = marginLeft + marginRight;

      const currentHeight = formRef.current.clientHeight;
      const currentWidth = formRef.current.clientWidth + totalMargin + 1;
      //props.handleAutoSizing(currentHeight, currentWidth);
    }
  }, [props.font, props.fontSize, props.fontWeight, props.label, props.size, props.labelPosition, props.align, props.verticalAlign, boxRef.current?.clientWidth, props.wrap]);


   const handleChange = React.useCallback((currentState: boolean) => {
    setState(!currentState);
    onChange();
    console.log("handle change called ")
  }, []);


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
              '& .MuiSvgIcon-root': { fontSize: Utils.boxMultiplier(props.size, String(theme.typography.body1.fontSize)) },
              }}
              checked={state} 
              onClick={() => handleChange(state)}
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