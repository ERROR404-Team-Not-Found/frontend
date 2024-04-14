import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';

export default function TrainingModal({ open, onClose, onSubmit }) {
  const [batch_size, setBatchSize] = useState('');
  const [learning_rate, setLearningRate] = useState('');
  const [optimizer, setOptimizer] = useState('');
  const [epochs, setEpochs] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const handleSubmit = () => {
    if (parseInt(batch_size) % 2 !== 0 && (parseFloat(learning_rate) > 1 || parseFloat(learning_rate) < 0)){
      setAlertOpen(true);
      return;
    }

    onSubmit({ batch_size, learning_rate, optimizer, epochs });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        width: 400,
        maxWidth: '90vw',
      }}>
        <h2>Training Parameters</h2>
        <TextField
          label="Batch Size"
          type="number"
          value={batch_size}
          onChange={(e) => setBatchSize(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Learning Rate"
          value={learning_rate}
          type="number"
          onChange={(e) => setLearningRate(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Optimizer</InputLabel>
          <Select
            value={optimizer}
            onChange={(e) => setOptimizer(e.target.value)}
          >
            <MenuItem value="SGD">SGD</MenuItem>
            <MenuItem value="Adam">Adam</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Epochs"
          type="number"
          value={epochs}
          onChange={(e) => setEpochs(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "var(--mainColor)",
            color: "var(--textColor)",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "var(--secondaryColor)",
            },
          }}
        >
          Submit
        </Button>
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
        >
          Batch size must be a multiple of 2 and learning rate between 0 and 1.
        </Alert>
      </Box>
    </Modal>
  );
}
