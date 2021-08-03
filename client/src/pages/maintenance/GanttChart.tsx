import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import * as XLSX from 'xlsx';
import _ from 'underscore';
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
import { formatDate } from 'src/utils/formatDate';

interface GanttChartProps {
  className?: string;
  scope: string;
}

const columns = [
  { id: 'no', name: 'no' },
  { id: 'Customer', name: 'name' },
  { id: 'Chart_Type', name: 'band' },
  { id: 'Link_Type', name: 'link type' },
  { id: 'SFreq_GHz', name: 'min freq (ghz)' },
  { id: 'EFreq_GHz', name: 'max freq (ghz)' },
  { id: 'SDate', name: 'start date' },
  { id: 'EDate', name: 'end date' }
];

const INIT_Y_AXIS = {
  y_start: 0,
  y_stop: 0,
  y_step: 0
};

const GanttChart: FC<GanttChartProps> = ({ scope }) => {
  const [source, setSource] = useState([]);
  const [traces, setTraces] = useState([]);
  const [startDate, setStartDate] = useState(0);
  const [yAxis, setYAxis] = useState(INIT_Y_AXIS);
  const [rows, setRows] = useState([]);
  const size = useWindowSize();

  useEffect(() => {
    let sheetList: Object = {};
    let req = new XMLHttpRequest();
    req.open('GET', 'static/excel/data.xlsx', true);
    req.responseType = 'arraybuffer';

    req.onload = function(e) {
      const data = new Uint8Array(req.response);
      const workbook = XLSX.read(data, { type: 'array' });

      workbook.SheetNames.forEach(item => {
        let worksheetList = [];
        let worksheet: any = XLSX.utils.sheet_to_json(workbook.Sheets[item], {
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
          el => item.Chart_Type === el.Chart_Type
        );
      });

      setSource(sheetList[Object.keys(sheetList)[0]]);
    };

    req.send();
  }, []);

  useEffect(() => {
    let x_start = 0,
      y_start = 0,
      y_step = 0,
      y_stop = 0;
    let traceList = [];

    source.forEach(item => {
      let preItem = item;
      if (item.Chart_Type === scope.split('_').join(' ')) {
        if (Object.keys(item).includes('data') && item.data.length > 0) {
          x_start = item.data[0].SDate;
        } else {
          x_start = item.X_Axis_Start;
        }

        y_step = item.Y_Axis_Step_Size;
        y_start = item.Y_Axis_Start;
        y_stop = item.Y_Axis_Stop;

        if (Object.keys(preItem).includes('data') && preItem.data.length > 0) {
          item.data.forEach(function(dt, index) {
            let item_date = new Date(dt.SDate);
            let c_date = new Date(x_start);
            let y_point =
              dt.SFreq_GHz + Math.abs(dt.SFreq_GHz - dt.EFreq_GHz) / 2;
            let isLegend = true;

            if (item_date < c_date) {
              x_start = dt.SDate;
            }

            item.data.forEach((d, idx) => {
              if (idx < index && d.Customer === dt.Customer) {
                index = idx;
                isLegend = false;
              }
            });

            let trace = {
              name: dt.Customer,
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
    setYAxis({ y_start: y_start, y_stop: y_stop, y_step: y_step });
  }, [scope, source]);

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
              width: size.width * 0.75,
              xaxis: {
                title: '',
                titlefont: {
                  size: 10,
                  color: '#212529'
                },
                tickfont: {
                  size: 12
                },
                range: [formatDate(startDate, -1), formatDate(startDate, 7)],
                dtick: 'M12',
                showgrid: true,
                zerolinecolor: '#969696',
                zerolinewidth: 1
              },
              yaxis: {
                title: 'Frequency (GHZ)',
                titlefont: {
                  size: 12,
                  color: '#212529'
                },
                tickfont: {
                  size: 12
                },
                range: [yAxis.y_start, yAxis.y_stop],
                dtick: yAxis.y_step,
                showgrid: true,
                zerolinecolor: '#969696',
                zerolinewidth: 1
              },
              legend: {
                orientation: 'h',
                xanchor: 'right',
                x: 1,
                traceorder: 'normal',
                font: {
                  family: 'sans-serif',
                  size: 12,
                  color: '#000'
                },
                bordercolor: '#212529',
                borderwidth: 1,
                tracegroupgap: 100
              },
              margin: {
                l: 60,
                b: 80,
                r: 30,
                t: 30,
                pad: 5
              },
              showlegend: true
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
                {rows.map((row, index) => (
                  <TableRow
                    hover
                    key={`${row.Chart_Type.split(' ').join('_')}_${index}`}
                  >
                    {columns.map((column, idx) => (
                      <TableCell key={column.id} align="center">
                        {idx !== 0
                          ? column.id === 'SFreq_GHz' ||
                            column.id === 'EFreq_GHz'
                            ? row[column.id].toFixed(7)
                            : column.id === 'SDate' || column.id === 'EDate'
                            ? formatDate(row[column.id], 0)
                            : row[column.id]
                          : index + 1}
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

GanttChart.propTypes = {
  className: PropTypes.string,
  scope: PropTypes.string.isRequired
};

export default GanttChart;
