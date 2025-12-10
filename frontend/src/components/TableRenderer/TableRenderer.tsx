import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableSortLabel,
  Chip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { TableConfig } from '../../types';

interface TableRendererProps {
  config: TableConfig;
}

const TableRenderer: React.FC<TableRendererProps> = ({ config }) => {
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (fieldName: string) => {
    const isAsc = orderBy === fieldName && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(fieldName);
  };

  const sortedData = React.useMemo(() => {
    if (!orderBy) return config.data;
    
    return [...config.data].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      
      if (order === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });
  }, [config.data, orderBy, order]);

  const renderCellValue = (value: any, fieldName: string) => {
    if (fieldName === 'isActive') {
      return (
        <Chip
          label={value ? 'Active' : 'Inactive'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      );
    }
    
    if (fieldName === 'joinDate' || fieldName === 'lastLogin') {
      return new Date(value).toLocaleDateString();
    }
    
    return value;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {config.headers.map((header) => (
              <TableCell key={header.fieldName}>
                {header.sortable ? (
                  <TableSortLabel
                    active={orderBy === header.fieldName}
                    direction={orderBy === header.fieldName ? order : 'asc'}
                    onClick={() => handleSort(header.fieldName)}
                  >
                    {header.label}
                  </TableSortLabel>
                ) : (
                  header.label
                )}
              </TableCell>
            ))}
            {(config.showActions !== false) && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow key={row._id}>
              {config.headers.map((header) => (
                <TableCell key={header.fieldName}>
                  {renderCellValue(row[header.fieldName], header.fieldName)}
                </TableCell>
              ))}
              <TableCell>
                {config.onEditClick && (
                  <IconButton
                    onClick={() => config.onEditClick?.(row)}
                    color="primary"
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                )}
                {config.onDeleteClick && (
                  <IconButton
                    onClick={() => config.onDeleteClick?.(row)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                )}
                {!config.onEditClick && !config.onDeleteClick && (
                  <Chip label="View Only" size="small" variant="outlined" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableRenderer;