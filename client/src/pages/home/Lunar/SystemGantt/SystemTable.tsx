import React, { FC, useState, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  withStyles,
  colors
} from '@material-ui/core';
import { formatDate } from 'src/utils/formatDate';
import { useEffect } from 'react';

interface SystemTableProps {
  className?: string;
  rows: any[];
  columns: any[];
}

interface Status {
  page: number;
  limit: number;
}

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'white'
    },
    '&:nth-of-type(even)': {
      backgroundColor: colors.grey[300]
    }
  }
}))(TableRow);

const initialStatus: Status = {
  page: 0,
  limit: 5
};

const SystemTable: FC<SystemTableProps> = ({ rows, columns }) => {
  const [results, setResults] = useState<any[]>([]);
  const [status, setStatus] = useState<Status>(initialStatus);

  useEffect(() => {
    const data = rows.slice(
      status.page * status.limit,
      (status.page + 1) * status.limit
    );
    setResults(data);
  }, [status, rows]);

  const renderColumn = (name: string, row: any, idx: number, index: number) => {
    if (idx !== 0) {
      switch (name) {
        case 'SFreq_GHz':
        case 'EFreq_GHz':
          return row[name].toFixed(7);
        case 'SDate':
        case 'EDate':
          return formatDate(row[name], 0, 'table');
        default:
          return row[name];
      }
    } else {
      return index + 1;
    }
  };

  const handleChangePage = (event: unknown, newPage: number) =>
    setStatus(prevState => ({ ...prevState, page: newPage }));

  const handleChangeLimit = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(prevState => ({
      ...prevState,
      limit: parseInt(event.target.value, 10),
      page: 0
    }));
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
          {results.map((row, index) => (
            <StyledTableRow hover key={index}>
              {columns.map((column, idx) => (
                <TableCell key={column.id} align="center">
                  {renderColumn(column.id, row, idx, index)}
                </TableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={status.limit}
        page={status.page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeLimit}
      />
    </TableContainer>
  );
};

SystemTable.propTypes = {
  className: PropTypes.string
};

export default SystemTable;
