import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import { GET_ARCHITECTURE, GET_MODELS, GET_DATASET, GET_TRANSACTIONS} from '../../utils/apiEndpoints';
import Cookies from 'js-cookie';
import Axios from 'axios';
import Editor from "@monaco-editor/react";
import ImageModal from '../ImageModal/ImageModal';
import CSVModal from '../CSVModal/CSVModal';
import { json } from 'react-router-dom';
import Papa from 'papaparse';

function createData(name) {
  return { name };
}

export default function BasicTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [backendData, setBackendData] = useState([]);
  const [architectureData, setArchitectureData] = useState(null);
  const [datasetData, setDatasetData] = useState(null);
  const [modelName, setmodelName] = useState(null);
  const [contentType, setcontentType] = useState(null);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Axios.get(GET_MODELS(Cookies.get('userID')));
      setBackendData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseEditor = () => {
    setArchitectureData(null);
    setmodelName(null);
  };

  const handleArchitectureButtonClick = async (model_name) => {
    try {
      const storedData = localStorage.getItem(Cookies.get('userID') + "-" + model_name + "-architecture");
      if (storedData) {
        setArchitectureData(JSON.parse(storedData));
        setmodelName(model_name);
      } else {
        const response = await Axios.get(GET_ARCHITECTURE(Cookies.get('userID'), model_name));
        localStorage.setItem(Cookies.get('userID') + "-" + model_name + "-architecture", JSON.stringify(response.data));
        setArchitectureData(response.data);
        setmodelName(model_name);
      }
    } catch (error) {
      console.error('Error fetching data for Architecture:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDatasetData(null);
    setmodelName(null);
    setcontentType(null);
  };

  const stringToHex = (str) => {
    return '0x' + Array.from(new TextEncoder().encode(str)).map((byte) => {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  }

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

  const handleDatasetButtonClick = async (model_name) => {
    try {
      const storedImageData = localStorage.getItem(Cookies.get('userID') + "-" + model_name + "-images");
      const storedCsvData = localStorage.getItem(Cookies.get('userID') + "-" + model_name + "-csv");

      if (storedImageData) {
        setDatasetData(JSON.parse(storedImageData));
        setmodelName(model_name);
        setcontentType("images");
        setShowModal(true);
      } else if (storedCsvData) {
        setDatasetData(JSON.parse(storedCsvData));
        setmodelName(model_name);
        setcontentType("csv");
        setShowModal(true);
      } else {

        const response = await Axios.get(GET_DATASET(Cookies.get('userID'), model_name), {
          responseType: 'blob'
        });

        const blob = new Blob([response.data]);
        const reader = new FileReader();
        let jsonData;
        reader.onload = () => {
          try {
            jsonData = JSON.parse(reader.result);

            const parseCsvString = (csvString) => {
              const lines = csvString.split('\n');
              const headers = lines[0].replace("\r", "").split(',');
              const rows = [];
            
              for (let i = 1; i < lines.length; i++) {
                const row = [];
                let currentField = '';
                let withinQuotes = false;
            
                for (let j = 0; j < lines[i].length; j++) {
                  const char = lines[i][j];
            
                  if (char === '"') {
                    withinQuotes = !withinQuotes;
                  } else if (char === ',' && !withinQuotes) {
                    row.push(currentField.trim());
                    currentField = '';
                  } else {
                    currentField += char;
                  }
                }
            
                row.push(currentField.trim());
                const isEmptyRow = row.every(value => value === '');
                if (!isEmptyRow) {
                  rows.push(row);
                }
              }
            
              return rows.map(row => {
                const obj = {};
                for (let i = 0; i < headers.length; i++) {
                  obj[headers[i]] = row[i];
                }
                return obj;
              });
            };
            
          
    
            const parsingDataset = parseCsvString(jsonData["csv_data"])
            if (jsonData["dataset_type"] === "images") {
              localStorage.setItem(Cookies.get('userID') + "-" + model_name + "-images", JSON.stringify(parsingDataset));
              setcontentType('images');
            } else {
              localStorage.setItem(Cookies.get('userID') + "-" + model_name + "-csv", JSON.stringify(parsingDataset));
              setcontentType('csv');
            }
            setDatasetData(parsingDataset);
            setmodelName(model_name);
            setShowModal(true);
          
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        };

        reader.readAsText(blob);
      }
    } catch (error) {
      console.error('Error fetching data for Dataset:', error);
    }
  };

  const convertWeiToEther = (wei) => {
    return wei / Math.pow(10, 18);
  }

  const handleTrainButtonClick = async (model_name) => {
    try {




      //la final dupa ce facem tot train ul facem faza asta cu weighturile
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];

        const message = {
                          "user_id": Cookies.get('userID'),
                          "model_name": model_name,
                          "hash": "this is a hash"
                        }
        
        const messageHex = stringToHex(JSON.stringify(message));
        const transactionObject = {
          from: userAddress,
          to: "0xCFEc104a5234493A463915e29A9b32D90D6b9c5B",
          value: '0x' + (parseInt(1, 10)* 1e18).toString(16),
          gasLimit: '0x000000001',
          data: messageHex,
        };

        const signedTransaction = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionObject],
        });
        
        const response = await Axios.get(GET_TRANSACTIONS(userAddress));

        // const mappedTransactions = response.data.map((transaction) => ({
        //   hash: transaction.hash,
        //   to: transaction.to,
        //   value: convertWeiToEther(+transaction.value),
        //   input: hexToString(transaction.input),
        //   user_id: JSON.parse(hexToString(transaction.input)).user_id,
        //   model_name: JSON.parse(hexToString(transaction.input)).model_name,
        //   hash: JSON.parse(hexToString(transaction.input)).hash
        // }));

        // console.log(mappedTransactions);

      }
    } catch (error) {
      console.error('Error fetching data for Train:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '120vh', marginTop: '15vh' }}>
      <TableContainer component={Paper} sx={{ width: '80vw' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Architecture</TableCell>
              <TableCell align="center">Dataset</TableCell>
              <TableCell align="center">Train</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {backendData && backendData.length > 0 && (rowsPerPage > 0
              ? backendData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : backendData
            ).map((name, index) => (
              <TableRow key={index}>
                <TableCell align="center" component="th" scope="row">
                  {name}
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained" onClick={() => handleArchitectureButtonClick(name)} sx={{
                    backgroundColor: "var(--mainColor)",
                    color: "var(--textColor)",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "var(--secondaryColor)",
                    },
                  }}>
                    Architecture
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained" onClick={() => handleDatasetButtonClick(name)} sx={{
                    backgroundColor: "var(--mainColor)",
                    color: "var(--textColor)",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "var(--secondaryColor)",
                    },
                  }}>
                    Dataset
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained" onClick={() => handleTrainButtonClick(name)} sx={{
                    backgroundColor: "var(--mainColor)",
                    color: "var(--textColor)",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "var(--secondaryColor)",
                    },
                  }}>
                    Train
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={backendData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {architectureData && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', zIndex: '9999', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ textAlign: 'left', marginBottom: '20px' }}>Model: {modelName.toUpperCase()}</h2>
            <Editor height="50vh" width="140vh" theme="vs-dark" defaultLanguage="python" value={architectureData} options={{ readOnly: true }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="contained" onClick={handleCloseEditor} sx={{
                backgroundColor: "var(--mainColor)",
                color: "var(--textColor)",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "var(--secondaryColor)",
                },
              }}>Close</Button>
            </div>
          </div>
        </div>

      )}

      {showModal && contentType === 'images' && (
        <ImageModal data={datasetData} handleCloseModal={handleCloseModal} />
      )}

      {showModal && contentType === 'csv' && (
        <CSVModal data={datasetData} handleCloseModal={handleCloseModal} />
      )}

    </div>

  );
}
