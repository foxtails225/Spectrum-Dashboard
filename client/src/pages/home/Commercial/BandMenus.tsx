import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as xlsx from 'xlsx';
import { Select, MenuItem, makeStyles, Theme, colors } from '@material-ui/core';
import { SYSTEMS_FILE1 } from 'src/constants';

interface Status {
  system: string;
  band: string;
  scope: number | null;
}
interface BandMenusProps {
  className?: string;
  status: Status;
  onUids: (param: number[]) => void;
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

const BandMenus: FC<BandMenusProps> = ({
  className,
  status,
  onUids,
  onChange
}) => {
  const [bands, setBands] = useState<string[]>([]);
  const classes = useStyles();

  useEffect(() => {
    let result: string[] = [];
    let tuids: number[] = [];
    let req = new XMLHttpRequest();
    req.open('GET', SYSTEMS_FILE1, true);
    req.responseType = 'arraybuffer';

    req.onload = (e: ProgressEvent<EventTarget>) => {
      const data = new Uint8Array(req.response);
      const workbook = xlsx.read(data, { type: 'array' });
      const sdata = workbook.Sheets[workbook.SheetNames[1]];
      const worksheet: any = xlsx.utils.sheet_to_json(sdata, { header: 1 });

      worksheet.forEach((el: any) => {
        if (el[0] === status.system) {
          el[2] && tuids.push(el[2]);
          !result.includes(el[1]) && result.push(el[1]);
        }
      });
      setBands(result);
      onUids(tuids);
    };

    req.send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.system]);

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
  onUids: PropTypes.func,
  onChange: PropTypes.func
};

export default BandMenus;
