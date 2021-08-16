import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import * as xlsx from 'xlsx';
import _ from 'underscore';
import { Grid } from '@material-ui/core';
import { colorSet } from '../colors';
import { formatDate, getMiddleDate } from 'src/utils/formatDate';
import { SYSTEMS_FILE2 } from 'src/constants';
import { Chart } from 'src/types/system';
import GanttChart from './GanttChart';

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
  link: string;
  band: string;
}

const INIT_AXIS: Axis = {
  start: 0,
  stop: 0,
  step: 0
};

const SystemGantt: FC<SystemGanttProps> = ({ status }) => {
  const [source, setSource] = useState([]);
  const [traces, setTraces] = useState([]);
  const [startDate, setStartDate] = useState(0);
  const [axis, setAxis] = useState(INIT_AXIS);
  const [annots, setAnnots] = useState([]);

  useEffect(() => {
    if (status.band === 'none') return;

    let sheetList: Object = {};
    let req = new XMLHttpRequest();
    req.open('GET', SYSTEMS_FILE2, true);
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
        item['data'] = sheetList[status.band];
      });
      setSource(sheetList[Object.keys(sheetList)[0]]);
    };

    req.send();
  }, [status.band]);

  useEffect(() => {
    let xStart = 0,
      yStart = 0,
      yStep = 0,
      yStop = 0;
    let traceList = [],
      annotList = [],
      data = [];

    source.forEach((item: Chart) => {
      if (item.Chart_Type !== status.band) return;

      data =
        status.link === 'all'
          ? item.data
          : item.data.filter(el => el.Link_Type === status.link);
      xStart = item.X_Axis_Start;
      yStep = item.Y_Axis_Step_Size;
      yStart = item.Y_Axis_Start;
      yStop = item.Y_Axis_Stop;

      if (data.length > 0) {
        xStart = data[0].SDate;

        data.forEach((dt, index) => {
          const item_date = new Date(dt.SDate);
          const c_date = new Date(xStart);
          const y_point =
            dt.SFreq_GHz + Math.abs(dt.SFreq_GHz - dt.EFreq_GHz) / 2;

          if (item_date < c_date) xStart = dt.SDate;
          data.forEach((d, idx) => {
            if (idx < index && d.System === dt.System) {
              index = idx;
            }
          });

          const trace = {
            name: dt.Id + '. ' + dt.System,
            x: [formatDate(dt.SDate, 0), formatDate(dt.EDate, 0)],
            y: [y_point, y_point],
            showlegend: true,
            mode: 'lines',
            line: {
              width:
                (Math.abs(dt.SFreq_GHz - dt.EFreq_GHz) / (yStep * 10)) * 340,
              color: colorSet[index % colorSet.length]
            }
          };
          const annot = {
            x: getMiddleDate(dt.SDate, dt.EDate),
            y: y_point,
            text: dt.Id,
            showarrow: false,
            font: { color: '#fff', size: 14 }
          };
          annotList.push(annot);
          traceList.push(trace);
        });
      } else {
        const trace = {
          name: '',
          x: [xStart, xStart + 10],
          y: [yStart, yStart],
          mode: 'lines',
          line: {
            width: (Math.abs(yStart - yStop) / (yStep * 10)) * 340,
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
    });

    const isValid =
      data.length > 1 ||
      data.every(item => Object.keys(item).every(key => Boolean(item[key])));

    if (isValid) {
      setTraces(traceList);
      setAnnots(annotList);
    } else {
      setTraces([]);
      setAnnots([]);
    }

    setStartDate(xStart);
    setAxis({ start: yStart, stop: yStop, step: yStep });
    // eslint-disable-next-line
  }, [status.link, source]);

  return (
    <Grid container alignItems="center" justify="center" spacing={3}>
      <Grid item md={12}>
        <GanttChart
          traces={traces}
          startDate={startDate}
          axis={axis}
          annots={annots}
        />
      </Grid>
    </Grid>
  );
};

SystemGantt.propTypes = {
  className: PropTypes.string
};

export default SystemGantt;
