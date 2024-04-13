import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

function createData(name) {
  return { name };
}

const backendData = ['Name1', 'Name2', 'Name3', 'Name4', 'Name5'];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Action 1</TableCell>
            <TableCell align="right">Action 2</TableCell>
            <TableCell align="right">Action 3</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {backendData.map((name, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell align="right">
                <Button variant="contained" color="primary">
                  Action 1
                </Button>
              </TableCell>
              <TableCell align="right">
                <Button variant="contained" color="primary">
                  Action 2
                </Button>
              </TableCell>
              <TableCell align="right">
                <Button variant="contained" color="primary">
                  Action 3
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
