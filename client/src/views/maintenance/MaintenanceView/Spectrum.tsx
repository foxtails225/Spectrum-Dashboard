import React, { useState, useEffect, FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as XLSX from 'xlsx';
import _ from 'underscore';
import { Grid, Typography, makeStyles, Theme } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

interface SpectrumProps {
  className?: string;
  scope: string;
  menu: string;
  onScope: (param: string) => void;
  onContent: (param: string) => void;
}

interface Entry {
  master: number;
  service: string;
  chart_type: string;
  remark: string;
  color: string;
  Hex: string;
  start: number;
  end: number;
  vertical: boolean;
  content: string;
}

const calWidth = (start: number, end: number, length: number) => {
  const value = (Math.abs(start - end) / length) * 95;
  return { width: value + '%' };
};

const getKey = (value: string): string => {
  return value.split(' ').join('_');
};

const getStyle = (dt: Entry, length: number) => {
  const len = 40 / length + 'vh';
  let value = {};

  if (dt.vertical) {
    value = {
      writingMode: 'vertical-rl',
      backgroundColor: dt.Hex,
      minHeight: len,
      maxHeight: len,
      transform: 'rotate(-180deg)'
    };
  } else {
    value = {
      backgroundColor: dt.Hex,
      minHeight: len,
      maxHeight: len,
      textAlign: 'center'
    };
  }

  return value;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative'
  },
  grid: {
    minHeight: theme.spacing(2),
    '&:before': {
      content: 'attr(data-start)'
    },
    '&:after': {
      content: 'attr(data-end)',
      position: 'absolute',
      right: theme.spacing(3),
      top: 0
    }
  },
  block: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #000',
    cursor: 'pointer'
  },
  scoped: {
    boxShadow: theme.shadows[10],
    zIndex: 1000
  },
  service: {
    fontSize: theme.typography.pxToRem(12)
  },
  remark: {
    fontSize: theme.typography.pxToRem(10)
  },
  announce: {
    marginTop: theme.spacing(1)
  }
}));

const Spectrum: FC<SpectrumProps> = ({
  className,
  menu,
  scope,
  onScope,
  onContent
}) => {
  const [source, setSource] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [length, setLength] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const classes = useStyles();
  const amount = 8;

  useEffect(() => {
    let req = new XMLHttpRequest();
    req.open('GET', '/static/excel/dataset.xlsx', true);
    req.responseType = 'arraybuffer';

    req.onload = (e: ProgressEvent<EventTarget>) => {
      const data = new Uint8Array(req.response);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet: any = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
        { header: 1 }
      );
      let sheetList = [];
      let result = [];

      worksheet.forEach((el: any, idx: number) => {
        if (idx > 0) sheetList.push(_.object(worksheet[0], el));
      });

      sheetList.forEach((item: Entry) => {
        const data = sheetList.filter(el => item.master === el.master);
        const count = _.filter(result, el => item.master === el.master);

        if (count.length < 1 && item.master) {
          result.push({
            master: item.master,
            start: item.start,
            end: item.end,
            data: data,
            vertical: item.vertical
          });
        }
      });

      setSource(result);
      setTotalPage(Object.keys(result).length / amount);
      onScope(result[0].data[0].chart_type);
      onContent(result[0].data[0].content);
    };

    req.send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  useEffect(() => {
    if (Object.keys(source).length > 0) {
      const pointX = source[(page - 1) * amount];
      const pointY = source[page * amount - 1];
      const len = Math.abs(pointX.start - pointY.end);

      let data = Object.values(source).filter(
        (item: Entry) =>
          item.master > (page - 1) * amount && item.master <= page * amount
      );
      setLength(len);
      setDataSource(data);
    }
  }, [page, source]);

  const handleClick = (type: string, content: string): void => {
    onScope(type);
    onContent(content);
  };

  const handleChangePage = (e: ChangeEvent, page: number): void => {
    setPage(page);
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        justify="center"
        style={{ position: 'relative' }}
        className={clsx(className, classes.root)}
      >
        {Object.keys(dataSource).length > 0 &&
          Object.values(dataSource).map((el, idx) => (
            <Grid
              item
              key={el.master}
              className={classes.grid}
              style={calWidth(el.start, el.end, length)}
              data-start={el.start}
              data-end={idx === amount - 1 ? el.end : ''}
            >
              <Grid container alignItems="center" justify="center">
                {el.data.map((dt: Entry) => (
                  <Grid
                    item
                    md={12}
                    id={getKey(dt.chart_type)}
                    key={getKey(dt.service)}
                    onClick={() => handleClick(dt.chart_type, dt.content)}
                    style={getStyle(dt, el.data.length)}
                    className={clsx(
                      classes.block,
                      dt.chart_type === scope && classes.scoped
                    )}
                  >
                    <Typography className={classes.service}>
                      {dt.service}
                    </Typography>
                    {dt.remark !== '' && (
                      <Typography className={classes.remark}>
                        {dt.remark}
                      </Typography>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
      </Grid>
      <Grid
        container
        alignItems="center"
        justify="center"
        spacing={3}
        className={classes.announce}
      >
        <Grid item md={10}>
          <Typography variant="body1">
            This chart will only work with 1024 x 768. We recommend full screen
            mode.
          </Typography>
        </Grid>
        <Grid item md={2}>
          <Pagination
            count={totalPage}
            defaultPage={1}
            variant="outlined"
            shape="rounded"
            onChange={handleChangePage}
          />
        </Grid>
      </Grid>
    </>
  );
};

Spectrum.propTypes = {
  className: PropTypes.string,
  scope: PropTypes.string.isRequired,
  menu: PropTypes.string.isRequired,
  onScope: PropTypes.func,
  onContent: PropTypes.func
};

export default Spectrum;
