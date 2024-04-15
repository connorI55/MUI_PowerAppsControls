import * as React from 'react';
import MUISelectControl from './SelectControl';
import { ISelectProps } from './SelectControl';

export default class MUISelectControl_Class extends React.Component<ISelectProps> {
  public render(): React.ReactNode {
    const props = this.props;
    return (
      <MUISelectControl {...props} />
    )
  }
}
