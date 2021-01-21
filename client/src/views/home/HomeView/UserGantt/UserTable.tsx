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

interface UserTableProps {
  className?: string;
  rows: any[];
  columns: any[];
}

const UserTable: FC<UserTableProps> = ({ rows, columns }) => {
  const renderColumn = (name: string, row: any, idx: number, index: number) => {
    return idx === 0 ? index + 1 : row[name];
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
            <TableRow hover key={`user-row-${index}`}>
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

UserTable.propTypes = {
  className: PropTypes.string
};

export default UserTable;
