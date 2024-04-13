import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

const CSVModal = ({ data, handleCloseModal }) => {
  return (
    <Modal
      open={true} // Set to true to always open the modal
      onClose={handleCloseModal}
      aria-labelledby="csv-modal-title"
      aria-describedby="csv-modal-description"
    >
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', maxWidth: '80%', maxHeight: '80%', overflow: 'auto' }}>
        <h2 style={{ textAlign: 'left', marginBottom: '20px' }}>DATASET</h2>
        <TableContainer component={Paper}>
          <Table aria-label="csv table">
            <TableHead>
              <TableRow>
                {Object.keys(data[0]).map((header, index) => (
                  <TableCell align="center"  key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, index) => (
                    <TableCell align="center" key={index}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <Button variant="contained" onClick={handleCloseModal}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default CSVModal;
