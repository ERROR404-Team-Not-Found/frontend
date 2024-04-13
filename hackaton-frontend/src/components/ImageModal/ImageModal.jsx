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

const ImageModal = ({ data, handleCloseModal }) => {
  return (
    <Modal
      open={true}
      onClose={handleCloseModal}
      aria-labelledby="image-modal-title"
      aria-describedby="image-modal-description"
    >
    
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', minWidth: '80%', maxHeight: '80%', overflow: 'auto' }}>
        <h2 style={{ textAlign: 'left', marginBottom: '20px' }}>DATASET</h2>
        <TableContainer component={Paper}>
          <Table aria-label="image table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Label Value</TableCell>
                <TableCell align="center">Label Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    <img src={row.image} alt={`Image ${index}`} style={{ width: '100px' }} />
                  </TableCell>
                  <TableCell align="center">{row.label_value}</TableCell>
                  <TableCell align="center">{row.label_name}</TableCell>
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

export default ImageModal;
