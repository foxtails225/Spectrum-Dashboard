import React, { FC } from 'react';
import PropTypes from 'prop-types';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';
import { formatDate } from 'src/utils/formatDate';

interface SystemTableProps {
  className?: string;
  rows: any[];
  columns: any[];
}

const SystemTable: FC<SystemTableProps> = ({ rows, columns }) => {
  const renderColumn = (name: string, row: any, idx: number, index: number) => {
    if (idx !== 0) {
      switch (name) {
        case 'SFreq_GHz':
        case 'EFreq_GHz':
          return row[name].toFixed(7);
        case 'SDate':
        case 'EDate':
          return formatDate(row[name], 0);
        default:
          return row[name];
      }
    } else {
      return index + 1;
    }
  };

  return (
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
                  {renderColumn(column.id, row, idx, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

SystemTable.propTypes = {
  className: PropTypes.string
};

export default SystemTable;
