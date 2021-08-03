import React, { FC } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import useWindowSize from 'src/hooks/useWindowSize';
import { formatDate } from 'src/utils/formatDate';

interface Axis {
  start: number;
  stop: number;
  step: number;
}

interface GanttChartsProps {
  className?: string;
  traces: any[];
  startDate: number;
  axis: Axis;
}

const GanttChart: FC<GanttChartsProps> = ({ traces, startDate, axis }) => {
  const size = useWindowSize();

  return (
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
          range: [axis.start, axis.stop],
          dtick: axis.step,
          showgrid: true,
          zerolinecolor: '#969696',
          zerolinewidth: 1
        },
        legend: {
          orientation: 'h',
          xanchor: 'left',
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
  );
};

GanttChart.propTypes = {
  className: PropTypes.string
};

export default GanttChart;
