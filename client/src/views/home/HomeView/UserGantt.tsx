import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import * as xlsx from 'xlsx';
import {
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from '@material-ui/core';
import { colorSet } from './colors';
import useWindowSize from 'src/hooks/useWindowSize';
import formatDate from 'src/utils/formatDate';
import { USER_FILE } from 'src/constants';

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
  end: 0
};

const UserGantt: FC<UserGanttProps> = ({ scope, system }) => {
  const [source, setSource] = useState([]);
  const [traces, setTraces] = useState([]);
  const [yAxis, setYAxis] = useState(INIT_Y_AXIS);
  const size = useWindowSize();

  useEffect(() => {
    let result = [];
    let req = new XMLHttpRequest();
    req.open('GET', USER_FILE, true);
    req.responseType = 'arraybuffer';

    req.onload = function(e) {
      const data = new Uint8Array(req.response);
      const workbook = xlsx.read(data, { type: 'array' });
      const worksheet: any = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[1]],
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
    const start = source.length / 5;
    const end = (source.length / 5) * 4;
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
    setYAxis({ start, end });
  }, [source]);

  useEffect(() => {}, [traces]);

  return (
    <>
      <Grid container alignItems="center" justify="center" spacing={3}>
        <Grid item md={12}>
          <Typography variant="h6" component="strong">
            Known LEO's supported by system
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" justify="center" spacing={3}>
        <Grid item md={12}>
          <Plot
            data={traces}
            layout={{
              width: size.width * 0.7,
              xaxis: {
                title: '',
                titlefont: {
                  size: 10,
                  color: '#212529'
                },
                tickfont: {
                  size: 12
                },
                dtick: 'M12',
                showgrid: true,
                zerolinecolor: '#969696',
                zerolinewidth: 1
              },
              yaxis: {
                titlefont: {
                  size: 12,
                  color: '#212529'
                },
                tickfont: {
                  size: 12
                },
                range: [yAxis.start, yAxis.end],
                dtick: 1,
                showgrid: true,
                zerolinecolor: '#969696',
                zerolinewidth: 1
              },
              margin: {
                l: 60,
                b: 80,
                r: 30,
                t: 30,
                pad: 5
              },
              showlegend: false
            }}
            config={{ displayModeBar: false }}
          />
        </Grid>
        <Grid item md={12}>
          <TableContainer style={{ maxHeight: 440 }}>
            <Table
              stickyHeader
              aria-label="sticky table"
              className="customized-gantt-chart-table"
            >
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell key={column.id} align="center">
                      {column.name.toUpperCase()}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {source.map((row, index) => (
                  <TableRow hover key={`user-row-${index}`}>
                    {columns.map((column, idx) => (
                      <TableCell key={column.id} align="center">
                        {idx === 0 ? index + 1 : row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

UserGantt.propTypes = {
  className: PropTypes.string
};

export default UserGantt;
