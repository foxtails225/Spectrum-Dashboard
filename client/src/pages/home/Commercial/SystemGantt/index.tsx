import React, { useState, useEffect, FC, ChangeEvent } from 'react';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import * as xlsx from 'xlsx';
import _ from 'underscore';
import {
  AppBar,
  Grid,
  Card,
  CardContent,
  Typography,
  Theme
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from 'src/components/TabPanel';
import { colorSet } from '../colors';
import { formatDate } from 'src/utils/formatDate';
import { SYSTEMS_FILE1 } from 'src/constants';
import { Chart } from 'src/types/system';
import GanttChart from './GanttChart';
import SystemTable from './SystemTable';

interface SystemGanttProps {
  className?: string;
  status: Status;
}

interface Axis {
  start: number;
  stop: number;
  step: number;
}

interface Status {
  system: string;
  band: string;
  scope: number | null;
}

const columns = [
  { id: 'no', name: 'no' },
  { id: 'System', name: 'system' },
  { id: 'Chart_Type', name: 'band' },
  { id: 'Link_Type', name: 'link type' },
  { id: 'SFreq_GHz', name: 'min freq (ghz)' },
  { id: 'EFreq_GHz', name: 'max freq (ghz)' },
  { id: 'SDate', name: 'start date' },
  { id: 'EDate', name: 'end date' }
];

const INIT_AXIS: Axis = {
  start: 0,
  stop: 0,
  step: 0
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  appBar: {
    boxShadow: theme.shadows[1]
  },
  title: {
    marginBottom: theme.spacing(2)
  }
}));

const SystemGantt: FC<SystemGanttProps> = ({ status }) => {
  const [tab, setTab] = useState(0);
  const [source, setSource] = useState([]);
  const [traces, setTraces] = useState([]);
  const [startDate, setStartDate] = useState(0);
  const [axis, setAxis] = useState(INIT_AXIS);
  const [rows, setRows] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    let sheetList: Object = {};
    let req = new XMLHttpRequest();
    req.open('GET', SYSTEMS_FILE1, true);
    req.responseType = 'arraybuffer';

    req.onload = function(e) {
      const data = new Uint8Array(req.response);
      const workbook = xlsx.read(data, { type: 'array' });

      workbook.SheetNames.forEach(item => {
        let worksheetList = [];
        let worksheet: any = xlsx.utils.sheet_to_json(workbook.Sheets[item], {
          header: 1
        });
        sheetList[item] = [];

        worksheet.forEach((el: any, index: number) => {
          if (index > 0) worksheetList.push(_.object(worksheet[0], el));
        });
        sheetList[item] = worksheetList;
      });

      sheetList[Object.keys(sheetList)[0]].forEach(item => {
        item['data'] = sheetList[Object.keys(sheetList)[1]].filter(
          el => el.Chart_Type === status.band && el.Item_No === status.scope
        );
      });
      setSource(sheetList[Object.keys(sheetList)[0]]);
    };

    req.send();
  }, [status.scope, status.band]);

  useEffect(() => {
    let x_start = 0,
      y_start = 0,
      y_step = 0,
      y_stop = 0;
    let traceList = [];

    source.forEach((item: Chart) => {
      let preItem = item;

      if (item.Chart_Type === status.band) {
        if (Object.keys(item).includes('data') && item.data.length > 0) {
          let idx = item.data.map(dt => dt.System).indexOf(status.system);
          item.data.splice(
            item.data.length - 1,
            0,
            item.data.splice(idx, 1)[0]
          );
          x_start = item.data[0].SDate;
        } else {
          x_start = item.X_Axis_Start;
        }

        y_step = item.Y_Axis_Step_Size;
        y_start = item.Y_Axis_Start;
        y_stop = item.Y_Axis_Stop;

        if (Object.keys(preItem).includes('data') && preItem.data.length > 0) {
          item.data.forEach((dt, index) => {
            let item_date = new Date(dt.SDate);
            let c_date = new Date(x_start);
            let y_point =
              dt.SFreq_GHz + Math.abs(dt.SFreq_GHz - dt.EFreq_GHz) / 2;
            let isLegend = true;

            if (item_date < c_date) {
              x_start = dt.SDate;
            }

            item.data.forEach((d, idx) => {
              if (idx < index && d.System === dt.System) {
                index = idx;
                isLegend = false;
              }
            });

            let trace = {
              name: dt.System,
              x: [formatDate(dt.SDate, 0), formatDate(dt.EDate, 0)],
              y: [y_point, y_point],
              mode: 'lines',
              line: {
                width:
                  (Math.abs(dt.SFreq_GHz - dt.EFreq_GHz) / (y_step * 10)) * 340,
                color: colorSet[index % colorSet.length]
              },
              showlegend: isLegend
            };

            traceList.push(trace);
          });
        } else {
          let trace = {
            name: '',
            x: [x_start, x_start + 10],
            y: [y_start, y_start],
            mode: 'lines',
            line: {
              width: (Math.abs(y_start - y_stop) / (y_step * 10)) * 340,
              color: 'transparent'
            },
            showlegend: false,
            marker: {
              size: 12,
              shape: [
                'line-ew',
                'diamond-open',
                'line-ew',
                'line-ew',
                'diamond-open',
                'line-ew'
              ]
            }
          };
          traceList.push(trace);
        }
        setRows(item.data);
      }
    });
    setTraces(traceList);
    setStartDate(x_start);
    setAxis({ start: y_start, stop: y_stop, step: y_step });
  }, [status.band, status.system, source]);

  const handleChange = (event: ChangeEvent<{}>, value: number) => {
    setTab(value);
  };

  return (
    <>
      <Grid container alignItems="center" justify="center" spacing={3}>
        <Grid item md={12} className={classes.title}>
          <Typography variant="h6" component="strong">
            Band Overview – Commercial Relay Systems
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" justify="center" spacing={3}>
        <Grid item md={12}>
          <Card>
            <CardContent>
              <AppBar
                position="static"
                color="default"
                className={classes.appBar}
              >
                <Tabs
                  value={tab}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  aria-label="Gantt and Data View"
                >
                  <Tab label="Gantt View" />
                  <Tab label="Data View" />
                </Tabs>
              </AppBar>
              <SwipeableViews index={tab}>
                <TabPanel value={tab} index={0}>
                  <GanttChart
                    traces={traces}
                    startDate={startDate}
                    axis={axis}
                  />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <SystemTable rows={rows} columns={columns} />
                </TabPanel>
              </SwipeableViews>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

SystemGantt.propTypes = {
  className: PropTypes.string
};

export default SystemGantt;
