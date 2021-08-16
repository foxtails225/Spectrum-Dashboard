import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as xlsx from 'xlsx';
import { Select, MenuItem, makeStyles, Theme, colors } from '@material-ui/core';
import { SYSTEMS_FILE2 } from 'src/constants';

interface Status {
  band: string;
  link: string;
}

interface SystemMenusProps {
  className?: string;
  status: Status;
  onChange: (name: string, value: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlignLast: 'center',
    color: '#fff'
  },
  default: {
    color: colors.grey[500],
    opacity: 0.9
  }
}));

const LinkMenus: FC<SystemMenusProps> = ({ className, status, onChange }) => {
  const [links, setLinks] = useState<string[]>([]);
  const classes = useStyles();

  useEffect(() => {
    let result: string[] = [];
    let req = new XMLHttpRequest();
    req.open('GET', SYSTEMS_FILE2, true);
    req.responseType = 'arraybuffer';

    req.onload = function(e) {
      const data = new Uint8Array(req.response);
      const workbook = xlsx.read(data, { type: 'array' });
      const sdata = workbook.Sheets[status.band];
      const worksheet: any = xlsx.utils.sheet_to_json(sdata, { header: 1 });

      worksheet.forEach((el: Array<any>, index: number) => {
        // @ts-ignore
        index > 0 && !result.includes(el[2]) && result.push(el[2]);
      });
      setLinks(result);
    };

    req.send();
  }, [status.band]);

  useEffect(() => {
    links.length > 0 && onChange('link', links[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links]);

  const handleChange = (event): void => {
    const { name, value } = event.target;
    onChange(name, value);
  };

  return (
    <Select
      name="link"
      value={status.link}
      onChange={handleChange}
      className={clsx(classes.root, className)}
      defaultValue="none"
      fullWidth
    >
      <MenuItem value="none" className={classes.default} disabled>
        Select Link Type
      </MenuItem>
      <MenuItem value="all">All</MenuItem>
      {links.map((item: string) => (
        <MenuItem value={item} key={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  );
};

LinkMenus.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  status: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

export default LinkMenus;
