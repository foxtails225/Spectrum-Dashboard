import React, { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  MenuItem,
  makeStyles,
  Theme,
  colors
} from '@material-ui/core';
import { options } from './options';
import clsx from 'clsx';

interface BandMenusProps {
  className?: string;
  menu: string;
  onMenu: (param: any) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlignLast: 'center'
  },
  default: {
    color: colors.grey[500],
    opacity: 0.9
  }
}));

const BandMenus: FC<BandMenusProps> = ({ className, menu, onMenu }) => {
  const classes = useStyles();

  return (
    <Select
      name=""
      value={menu}
      onChange={onMenu}
      className={clsx(classes.root, className)}
      fullWidth
    >
      <MenuItem value="none" className={classes.default} disabled>
        Select Frequency Band
      </MenuItem>
      {options.map(item => (
        <MenuItem value={item.name} key={item.name}>
          {item.label}
        </MenuItem>
      ))}
    </Select>
  );
};

BandMenus.propTypes = {
  className: PropTypes.string,
  menu: PropTypes.string.isRequired,
  onMenu: PropTypes.func
};

export default BandMenus;
