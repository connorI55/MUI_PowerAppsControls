import * as React from 'react';
import Box from '@mui/material/Box';
import { TextField, FormControlLabel, createTheme, ThemeProvider} from '@mui/material';
import * as Utils from '../../utils';
import MUITextField_Control from './TextFieldControl';
import { ITextFieldProps } from './TextFieldControl';

export default class MUITextField_Class extends React.Component<ITextFieldProps> {
  public render(): React.ReactNode {
    const props = this.props;
    return (
      <MUITextField_Control {...props} />
    )
  }
}
