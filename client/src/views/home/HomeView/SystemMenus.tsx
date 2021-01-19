import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as xlsx from 'xlsx';
import { Select, MenuItem, makeStyles, Theme, colors } from '@material-ui/core';

interface SystemMenusProps {
  className?: string;
  system: string;
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

const SystemMenus: FC<SystemMenusProps> = ({ className, system, onChange }) => {
  const [systems, setSystems] = useState<string[]>([]);
  const classes = useStyles();

  useEffect(() => {
    let result: string[] = [];
    let req = new XMLHttpRequest();
    req.open('GET', 'static/excel/systems.xlsx', true);
    req.responseType = 'arraybuffer';

    req.onload = function(e) {
      const data = new Uint8Array(req.response);
      const workbook = xlsx.read(data, { type: 'array' });
      const sdata = workbook.Sheets[workbook.SheetNames[0]];
      const worksheet: any = xlsx.utils.sheet_to_json(sdata, { header: 1 });

      worksheet.forEach((el: any, index: number) => {
        index > 0 && !result.includes(el[0]) && result.push(el[0]);
      });
      setSystems(result);
    };

    req.send();
  }, []);

  return (
    <Select
      name="system"
      value={system}
      onChange={onChange}
      className={clsx(classes.root, className)}
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
