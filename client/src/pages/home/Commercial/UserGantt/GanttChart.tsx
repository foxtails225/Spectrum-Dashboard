import React, { FC } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import useWindowSize from 'src/hooks/useWindowSize';

interface Axis {
  start: number;
  stop: number;
}

interface GanttChartsProps {
  className?: string;
  traces: any[];
  axis: Axis;
}

const GanttChart: FC<GanttChartsProps> = ({ traces, axis }) => {
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
          range: [axis.start, axis.stop],
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
  );
};

GanttChart.propTypes = {
  className: PropTypes.string
};

export default GanttChart;
