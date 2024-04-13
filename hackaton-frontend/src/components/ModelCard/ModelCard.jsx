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
import { GET_ARCHITECTURE, GET_MODELS } from '../../utils/apiEndpoints';
import Cookies from 'js-cookie';
import Axios from 'axios';
import Editor from "@monaco-editor/react";

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
        localStorage.setItem(Cookies.get('userID') + "-" + model_name + "-architecture" , JSON.stringify(response.data));
        setArchitectureData(response.data);
        setmodelName(model_name);
      }
    } catch (error) {
      console.error('Error fetching data for Architecture:', error);
    }
  };

  const handleDatasetButtonClick = async (model_name) => {
    try {
      const storedData = localStorage.getItem(Cookies.get('userID') + "-" + model_name + "-image");
      if (storedData) {
        setDatasetData(JSON.parse(storedData));
        setmodelName(model_name);
        setcontentType("image");
      } else {
        const storedData = localStorage.getItem(Cookies.get('userID') + "-" + model_name + "-csv");

        if (storedData) {
          setDatasetData(JSON.parse(storedData));
          setmodelName(model_name);
          setcontentType("csv");
        } else {
          const response = await Axios.get(GET_ARCHITECTURE(Cookies.get('userID'), model_name), {
            responseType: 'blob'
          });

          const contentType = response.headers['x-file-type'];

          const parseCsvString = (csvString) => {
            const [headers, ...rows] = csvString.replace("\r", "").split('\n').map((line) => line.split(','));
            return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]])));
          };

          const parsingDataset = parseCsvString(response.data)
          if (contentType.includes('image')){
            localStorage.setItem(Cookies.get('userID') + "-" + model_name + "-image" , parsingDataset);
            setcontentType('image');
          } else {
            localStorage.setItem(Cookies.get('userID') + "-" + model_name + "-csv" , parsingDataset);
            setcontentType('csv');
          }
          setDatasetData(parsingDataset);
          setmodelName(model_name);
        }
      }
    } catch (error) {
      console.error('Error fetching data for Dataset:', error);
    }
  };

  const handleTrainButtonClick = async (param) => {
    try {
      // Make your Axios request for Train
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
              <TableCell>Name</TableCell>
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
                <TableCell component="th" scope="row">
                  {name}
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained" onClick={() =>handleArchitectureButtonClick(name)} sx={{
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
                  <Button variant="contained" onClick={() =>handleDatasetButtonClick(name)} sx={{
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
                  <Button variant="contained" onClick={() =>handleTrainButtonClick(name)} sx={{
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
    </div>

  );
}
