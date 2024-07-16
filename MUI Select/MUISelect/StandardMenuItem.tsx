import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';


interface StandardMenuItemProps {
  id: string;
  formattedPrimaryValue: string;
  selectedItemIDs: string[];
  multiSelect: boolean;
  multiSelectStyle: "default" | "checkmarks" | "chips";
  handleClick: (id: string) => void;
  displayColumns: string[];
  record: {
    getFormattedValue: (column: string) => string;
  };
  Utils: {
    validateHTML: (html: string) => { isValid: boolean, sanitizedHTML: string };
  };
}

const StandardMenuItemComponent: React.FC<StandardMenuItemProps> = (props) => {
  const {
    id,
    formattedPrimaryValue,
    selectedItemIDs,
    multiSelect,
    multiSelectStyle,
    handleClick,
    displayColumns,
    record,
    Utils
  } = props;

  return (
    <MenuItem 
      key={id} 
      value={id}
      onClick={() => handleClick(id)}
      selected={selectedItemIDs.includes(id)}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {multiSelectStyle === "checkmarks" ? <Checkbox checked={selectedItemIDs.indexOf(id) > -1} /> : null}
          <Typography variant="body1" color="textPrimary">
            {formattedPrimaryValue}
          </Typography>
        </div>
        <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
          {displayColumns.map((otherColumn) => {
            const formattedValue = record?.getFormattedValue(otherColumn);
            const isHTML = formattedValue && formattedValue.trim().startsWith('<');

            if (!isHTML) {
              return (
                <Typography variant="body2" color="textSecondary" key={`${id}-${otherColumn}`}>
                  <div>{formattedValue}</div>
                </Typography>
              );
            } else if (isHTML) {
              const validatedHTML = Utils.validateHTML(formattedValue);
              if (validatedHTML.isValid) {
                return <span key={`${id}-${otherColumn}`} dangerouslySetInnerHTML={{ __html: validatedHTML.sanitizedHTML as string }} />;
              } else {
                return (
                  <Typography variant="body2" color="textSecondary" key={`${id}-${otherColumn}`}>
                    <div>HTML detected, but is invalid</div>
                  </Typography>
                );
              }
            }
          })}
        </div>
      </div>
    </MenuItem>
  );
};

export default StandardMenuItemComponent;