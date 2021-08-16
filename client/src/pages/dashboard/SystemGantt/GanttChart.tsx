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
  annots: any[];
  axis: Axis;
}

const GanttChart: FC<GanttChartsProps> = ({
  traces,
  annots,
  startDate,
  axis
}) => {
  const size = useWindowSize();

  return (
    <Plot
      data={traces}
      layout={{
        width: size.width * 0.85,
        annotations: annots,
        plot_bgcolor: '#444',
        paper_bgcolor: '#444',
        font: {
          color: 'white'
        },
        xaxis: {
          title: '',
          titlefont: {
            size: 10,
            color: '#fff'
          },
          tickfont: {
            size: 12
          },
          range: [formatDate(startDate, -1), formatDate(startDate, 7)],
          dtick: 'M12',
          showgrid: true,
          zerolinecolor: '#fff',
          zerolinewidth: 1,
          gridcolor: '#fff'
        },
        yaxis: {
          title: 'Frequency (GHZ)',
          titlefont: {
            size: 12,
            color: '#fff'
          },
          tickfont: {
            size: 12
          },
          range: [axis.start, axis.stop],
          dtick: axis.step,
          showgrid: true,
          zerolinecolor: '#fff',
          zerolinewidth: 1,
          gridcolor: '#fff'
        },
        legend: {
          orientation: 'h',
          xanchor: 'left',
          traceorder: 'normal',
          font: {
            family: 'sans-serif',
            size: 12,
            color: '#fff'
          },
          bordercolor: '#fff',
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
