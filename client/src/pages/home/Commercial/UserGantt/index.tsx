import React, { useState, useEffect, FC, ChangeEvent } from 'react';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import * as xlsx from 'xlsx';
import {
  AppBar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  Theme
} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from 'src/components/TabPanel';
import { colorSet } from '../colors';
import { formatDate } from 'src/utils/formatDate';
import { USER_FILE } from 'src/constants';
import UserTable from './UserTable';
import GanttChart from './GanttChart';

interface UserGanttProps {
  className?: string;
  scope: number;
  system: string;
}

interface User {
  User: string;
  System: string;
  SDate: Date;
  EDate: Date;
}

const columns = [
  { id: 'no', name: 'no' },
  { id: 'User', name: 'user' },
  { id: 'System', name: 'system' },
  { id: 'SDate', name: 'start date' },
  { id: 'EDate', name: 'end date' }
];

const INIT_Y_AXIS = {
  start: 0,
  stop: 0
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

const UserGantt: FC<UserGanttProps> = ({ scope, system }) => {
  const [tab, setTab] = useState(0);
  const [source, setSource] = useState([]);
  const [traces, setTraces] = useState([]);
  const [axis, setAxis] = useState(INIT_Y_AXIS);
  const classes = useStyles();

  useEffect(() => {
    let result = [];
    let req = new XMLHttpRequest();
    req.open('GET', USER_FILE, true);
    req.responseType = 'arraybuffer';

    req.onload = function(e) {
      const data = new Uint8Array(req.response);
      const workbook = xlsx.read(data, { type: 'array' });
      const worksheet: any = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
        {
          header: 1
        }
      );

      worksheet.forEach((item, idx: number) => {
        if (idx > 0 && system === item[1])
          result.push({
            User: item[0],
            System: item[1],
            SDate: formatDate(item[2], 0),
            EDate: formatDate(item[3], 0)
          });
      });
      setSource(result);
    };

    req.send();
  }, [scope, system]);

  useEffect(() => {
    const start = (source.length / 5) * 3;
    const stop = 0;
    let traceList = [];

    source.forEach((item: User, idx: number) => {
      var trace = {
        x: [item.SDate, item.EDate],
        y: [item.User, item.User],
        name: item.User,
        mode: 'lines',
        line: { width: 20, color: colorSet[idx % colorSet.length] }
      };
      traceList.push(trace);
    });

    setTraces(traceList);
    setAxis({ start, stop });
  }, [source]);

  const handleChange = (event: ChangeEvent<{}>, value: number) => {
    setTab(value);
  };

  return (
    <>
      <Grid container alignItems="center" justify="center" spacing={3}>
        <Grid item md={12}>
          <Typography variant="h6" component="strong">
            Space Missions Using Commercial Systems
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
                  <GanttChart axis={axis} traces={traces} />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <UserTable rows={source} columns={columns} />
                </TabPanel>
              </SwipeableViews>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

UserGantt.propTypes = {
  className: PropTypes.string
};

export default UserGantt;
