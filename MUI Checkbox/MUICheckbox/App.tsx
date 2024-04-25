import * as React from 'react';
import MUICheckboxControl, { ICheckboxProps } from './CheckboxControl';

export default class MUI_CheckboxControl_Class extends React.PureComponent<ICheckboxProps> {
  public render(): React.ReactNode {
    const props = this.props;
    return (
      <MUICheckboxControl {...props} />
    )
  }
}