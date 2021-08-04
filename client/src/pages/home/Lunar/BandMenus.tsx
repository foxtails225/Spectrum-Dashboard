import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as xlsx from 'xlsx';
import { Select, MenuItem, makeStyles, Theme, colors } from '@material-ui/core';
import { SYSTEMS_FILE2 } from 'src/constants';

interface Status {
  link: string;
  band: string;
}
interface BandMenusProps {
  className?: string;
  status: Status;
  onChange: (name: string, value: string) => void;
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

const BandMenus: FC<BandMenusProps> = ({ className, status, onChange }) => {
  const [bands, setBands] = useState<string[]>([]);
  const classes = useStyles();

  useEffect(() => {
    let req = new XMLHttpRequest();
    req.open('GET', SYSTEMS_FILE2, true);
    req.responseType = 'arraybuffer';

    req.onload = (e: ProgressEvent<EventTarget>) => {
      const data = new Uint8Array(req.response);
      const workbook = xlsx.read(data, { type: 'array' });
      workbook.SheetNames.shift()
      setBands(workbook.SheetNames);
    };

    req.send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bands.length > 0 && onChange('band', bands[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bands]);

  const handleChange = (event): void => {
    const { name, value } = event.target;
    onChange(name, value);
  };

  return (
    <Select
      name="band"
      value={status.band}
      onChange={handleChange}
      className={clsx(classes.root, className)}
      defaultValue="none"
      fullWidth
    >
      <MenuItem value="none" className={classes.default} disabled>
        Select Frequency Band
      </MenuItem>
      {bands.map(item => (
        <MenuItem value={item} key={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  );
};

BandMenus.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func
};

export default BandMenus;
