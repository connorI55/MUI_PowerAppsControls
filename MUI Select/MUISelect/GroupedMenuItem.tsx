import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { ListSubheader } from '@mui/material';
import { DisplayColumns } from '../../utils/handleDisplayColumns';


interface GroupedMenuItemProps {
  id: string;
  formattedPrimaryValue: string;
  selectedItemIDs: string[];
  multiSelect: boolean;
  multiSelectStyle: "default" | "checkmarks" | "chips";
  handleClick: (id: string) => void;
  displayColumns: DisplayColumns;
  record: {
    getFormattedValue: (column: string) => string;
  };
  Utils: {
    validateHTML: (html: string) => { isValid: boolean, sanitizedHTML: string };
  };
  formattedGroupName: string;
  filteredRecords: any[];
}

const GroupedMenuItemComponent: React.FC<GroupedMenuItemProps> = (props) => {
    const {
      formattedGroupName,
      filteredRecords,
      selectedItemIDs,
      multiSelect,
      multiSelectStyle,
      handleClick,
      displayColumns,
      Utils
    } = props;
  
    return (
      <React.Fragment key={formattedGroupName}>
        <ListSubheader>
          <Typography variant="subtitle1">{formattedGroupName}</Typography>
        </ListSubheader>
        {filteredRecords.map((record) => {
          const id = record?.getRecordId();
          const formattedPrimaryValue = record?.getFormattedValue(displayColumns.primaryColumn);
  
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
                  {displayColumns.displayColumns.map((otherColumn) => {
                    const formattedValue = record?.getFormattedValue(otherColumn);
                    const isHTML = formattedValue && formattedValue.trim().startsWith('<');
  
                    if (!isHTML) {
                      return (
                        <Typography variant="body2" color="textSecondary" key={`${id}-${otherColumn}`}>
                          {formattedValue}
                        </Typography>
                      );
                    } else if (isHTML) {
                      const validatedHTML = Utils.validateHTML(formattedValue);
                      if (validatedHTML.isValid) {
                        return <span key={`${id}-${otherColumn}`} dangerouslySetInnerHTML={{ __html: validatedHTML.sanitizedHTML as string }} />;
                      } else {
                        return (
                          <Typography variant="body2" color="textSecondary" key={`${id}-${otherColumn}`}>
                            HTML detected, but is invalid
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
      </React.Fragment>
    );
  };

export default GroupedMenuItemComponent;