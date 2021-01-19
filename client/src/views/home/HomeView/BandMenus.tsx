import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import * as xlsx from 'xlsx';
import { Select, MenuItem, makeStyles, Theme, colors } from '@material-ui/core';
import clsx from 'clsx';

interface Status {
  system: string;
  band: string;
}
interface BandMenusProps {
  className?: string;
  status: Status;
  onChange: (param: any) => void;
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
    let result: string[] = [];
    let req = new XMLHttpRequest();
    req.open('GET', 'static/excel/systems.xlsx', true);
    req.responseType = 'arraybuffer';

    req.onload = (e: ProgressEvent<EventTarget>) => {
      const data = new Uint8Array(req.response);
      const workbook = xlsx.read(data, { type: 'array' });
      const sdata = workbook.Sheets[workbook.SheetNames[0]];
      const worksheet: any = xlsx.utils.sheet_to_json(sdata, { header: 1 });

      worksheet.forEach((el: any) => {
        if (el[0] === status.system && !result.includes(el[1]))
          result.push(el[1]);
      });
      setBands(result);
    };

    req.send();
  }, [status.system]);

  return (
    <Select
      name="band"
      value={status.band}
      onChange={onChange}
      className={clsx(classes.root, className)}
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
