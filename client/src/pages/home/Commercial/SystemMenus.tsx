import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as xlsx from 'xlsx';
import { Select, MenuItem, makeStyles, Theme, colors } from '@material-ui/core';
import { SYSTEMS_FILE1 } from 'src/constants';

interface SystemMenusProps {
  className?: string;
  system: string;
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

const SystemMenus: FC<SystemMenusProps> = ({ className, system, onChange }) => {
  const [systems, setSystems] = useState<string[]>([]);
  const classes = useStyles();

  useEffect(() => {
    let result: string[] = [];
    let req = new XMLHttpRequest();
    req.open('GET', SYSTEMS_FILE1, true);
    req.responseType = 'arraybuffer';

    req.onload = function(e) {
      const data = new Uint8Array(req.response);
      const workbook = xlsx.read(data, { type: 'array' });
      const sdata = workbook.Sheets[workbook.SheetNames[1]];
      const worksheet: any = xlsx.utils.sheet_to_json(sdata, { header: 1 });

      worksheet.forEach((el: Array<any>, index: number) => {
        index > 0 && !result.includes(el[0]) && result.push(el[0]);
      });
      setSystems(result);
    };

    req.send();
  }, []);

  useEffect(() => {
    systems.length > 0 && onChange('system', systems[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systems]);

  const handleChange = (event): void => {
    const { name, value } = event.target;
    onChange(name, value);
  };

  return (
    <Select
      name="system"
      value={system}
      onChange={handleChange}
      className={clsx(classes.root, className)}
      defaultValue="none"
      fullWidth
    >
      <MenuItem value="none" className={classes.default} disabled>
        Select System
      </MenuItem>
      {systems.map((item: string) => (
        <MenuItem value={item} key={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  );
};

SystemMenus.propTypes = {
  className: PropTypes.string,
  system: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default SystemMenus;
