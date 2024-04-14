import React from 'react';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Axios from 'axios';
import { DOWNLOAD_WEIGHTS, GET_TRANSACTIONS } from '../../utils/apiEndpoints';
import Cookies from 'js-cookie';



const SelectModal = ({ open, model_name, handleClose, options, handleSnackbar }) => {
    const [selectedOption, setSelectedOption] = React.useState('');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const hexToString = (hex) => {
        if (hex.startsWith('0x')) {
          hex = hex.slice(2);
        }
    
        if (hex !== null && hex.length > 0) {
          const pairs = hex.match(/.{1,2}/g);
    
          const chars = pairs.map(pair => String.fromCharCode(parseInt(pair, 16)));
    
          return chars.join('');
        } else {
          return JSON.stringify({ title: "Nothing to show" });
        }
    }

    const convertWeiToEther = (wei) => {
        return wei / Math.pow(10, 18);
    }
    

    const handleDownload = async () => {
        try {
        if (selectedOption) {
                if (typeof window !== 'undefined' && window.ethereum) {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const userAddress = accounts[0];
        
                    const response = await Axios.get(GET_TRANSACTIONS(userAddress));
        
                    const mappedTransactions = response.data.map((transaction) => ({
                        hash: transaction.hash,
                        to: transaction.to,
                        value: convertWeiToEther(+transaction.value),
                        input: hexToString(transaction.input),
                        user_id: JSON.parse(hexToString(transaction.input)).user_id,
                        model_name: JSON.parse(hexToString(transaction.input)).model_name,
                        data_hash: JSON.parse(hexToString(transaction.input)).data_hash,
                        version: JSON.parse(hexToString(transaction.input)).version,
                    }));
                    
                    
                    mappedTransactions.forEach(async (transaction) => {
                        if (transaction.user_id === Cookies.get('userID') && transaction.model_name === model_name && transaction.version === selectedOption) {
                            
                            try {
                                const response_download = await Axios.get(DOWNLOAD_WEIGHTS(Cookies.get('userID'), model_name, selectedOption, transaction.data_hash), {
                                    responseType: 'blob'
                                });
                            
                                if (response_download && response_download.data) {
                                    const blob = new Blob([response_download.data], { type: 'application/octet-stream' });
                                    const url = window.URL.createObjectURL(blob);
                                    
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.setAttribute('download', `${selectedOption}.pth`);
                                    link.style.display = 'none';
                                    
                                    document.body.appendChild(link);
                                    link.click();
                                    
                                    window.URL.revokeObjectURL(url);
                                    link.remove();
                                } else {
                                    console.error('Error: File data not received');
                                }
                            } catch (error) {
                                console.error('Error downloading file:', error);
                            }
                            
                            
                        }
                    });
                }
        } else {
            handleSnackbar('No option selected', 'error');
        }
    } catch (error) {
        //handleSnackbar('Error downloading weights: ' + error.message, 'error');
    }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', maxWidth: '50%', minHeight: '20%', maxHeight: '80%', overflow: 'auto' }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Version</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedOption}
                        label="Version"
                        onChange={handleChange}
                    >
                        {options.map((option, index) => (
                            <MenuItem key={index} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <Button variant="contained" onClick={handleClose} style={{ marginRight: '10px' }} sx={{
                        backgroundColor: "var(--mainColor)",
                        color: "var(--textColor)",
                        cursor: "pointer",
                        "&:hover": {
                            backgroundColor: "var(--secondaryColor)",
                        },
                    }}>Close</Button>
                    <Button variant="contained" onClick={handleDownload} sx={{
                        backgroundColor: "var(--mainColor)",
                        color: "var(--textColor)",
                        cursor: "pointer",
                        "&:hover": {
                            backgroundColor: "var(--secondaryColor)",
                        },
                    }}>Download</Button>
                </div>
            </div>
        </Modal>
    );
};

export default SelectModal;
