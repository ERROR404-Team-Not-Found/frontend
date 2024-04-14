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
import { GET_ARCHITECTURE, GET_MODELS, GET_DATASET, GET_VERSIONS, TRAIN, STATUS, VERSION} from '../../utils/apiEndpoints';
import Cookies from 'js-cookie';
import Axios from 'axios';
import Editor from "@monaco-editor/react";
import ImageModal from '../ImageModal/ImageModal';
import CSVModal from '../CSVModal/CSVModal';
import SelectModal from '../SelectModal/SelectModal';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TrainingModal from '../TrainingModal/TrainingModal';

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
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectOptions, setSelectOptions] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('error');

  const [modelToTrain, setModelToTrain] = useState(null);
  const [trainingModalOpen, setTrainingModalOpen] = useState(false);

  const [trainingStatusIntervalId, setTrainingStatusIntervalId] = useState(null);

  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Axios.get(GET_MODELS(Cookies.get("userID")));
      setBackendData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      const storedData = localStorage.getItem(
        Cookies.get("userID") + "-" + model_name + "-architecture"
      );
      if (storedData) {
        setArchitectureData(JSON.parse(storedData));
        setmodelName(model_name);
      } else {
        const response = await Axios.get(
          GET_ARCHITECTURE(Cookies.get("userID"), model_name)
        );
        localStorage.setItem(
          Cookies.get("userID") + "-" + model_name + "-architecture",
          JSON.stringify(response.data)
        );
        setArchitectureData(response.data);
        setmodelName(model_name);
      }
    } catch (error) {
      console.error("Error fetching data for Architecture:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDatasetData(null);
    setmodelName(null);
    setcontentType(null);
  };

  const handleCloseSelectModal = () => {
    setSelectOptions(null);
    setmodelName(null);
    setShowSelectModal(false);
  }
  const stringToHex = (str) => {
    return (
      "0x" +
      Array.from(new TextEncoder().encode(str))
        .map((byte) => {
          return ("0" + (byte & 0xff).toString(16)).slice(-2);
        })
        .join("")
    );
  };

  const handleDatasetButtonClick = async (model_name) => {
    try {
      const storedImageData = localStorage.getItem(
        Cookies.get("userID") + "-" + model_name + "-images"
      );
      const storedCsvData = localStorage.getItem(
        Cookies.get("userID") + "-" + model_name + "-csv"
      );

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
        const response = await Axios.get(
          GET_DATASET(Cookies.get("userID"), model_name),
          {
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data]);
        const reader = new FileReader();
        let jsonData;
        reader.onload = () => {
          try {
            jsonData = JSON.parse(reader.result);

            const parseCsvString = (csvString) => {
              const lines = csvString.split("\n");
              const headers = lines[0].replace("\r", "").split(",");
              const rows = [];

              for (let i = 1; i < lines.length; i++) {
                const row = [];
                let currentField = "";
                let withinQuotes = false;

                for (let j = 0; j < lines[i].length; j++) {
                  const char = lines[i][j];

                  if (char === '"') {
                    withinQuotes = !withinQuotes;
                  } else if (char === "," && !withinQuotes) {
                    row.push(currentField.trim());
                    currentField = "";
                  } else {
                    currentField += char;
                  }
                }

                row.push(currentField.trim());
                const isEmptyRow = row.every((value) => value === "");
                if (!isEmptyRow) {
                  rows.push(row);
                }
              }

              return rows.map((row) => {

                const obj = {};
                for (let i = 0; i < headers.length; i++) {
                  obj[headers[i]] = row[i];
                }
                return obj;
              });
            };

            const parsingDataset = parseCsvString(jsonData["csv_data"]);

            if (jsonData["dataset_type"] === "images") {
              localStorage.setItem(
                Cookies.get("userID") + "-" + model_name + "-images",
                JSON.stringify(parsingDataset)
              );
              setcontentType("images");
            } else {
              localStorage.setItem(
                Cookies.get("userID") + "-" + model_name + "-csv",
                JSON.stringify(parsingDataset)
              );
              setcontentType("csv");
            }
            setDatasetData(parsingDataset);
            setmodelName(model_name);
            setShowModal(true);

          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        };

        reader.readAsText(blob);
      }
    } catch (error) {
      console.error("Error fetching data for Dataset:", error);
    }
  };

  const handleTrainButtonClick = async (model_name) => {
    if (localStorage.getItem('training') === true) {

    } else {
      setModelToTrain(model_name);
      setTrainingModalOpen(true);
    }
  };

  const fetchTrainingStatus = async (model_name) => {
    try {
      const response = await Axios.get(STATUS(Cookies.get('userID')));

      if (response.status === 200) {
        localStorage.removeItem('training');
        const data_hash = response.data.hash;

        console.log(data_hash)

        const response_version = await Axios.get(VERSION(Cookies.get('userID'), model_name));
        console.log(response_version)

        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const userAddress = accounts[0];
  
          const message = {
            "user_id": Cookies.get('userID'),
            "model_name": model_name,
            "version": response_version.data,
            "data_hash": data_hash,
  
          }
  
          const messageHex = stringToHex(JSON.stringify(message));
          const transactionObject = {
            from: userAddress,
            to: "0x3370f9123C27768E5DD26238813e2405Fc76b3d3",
            value: '0x' + (parseInt(1, 10) * 1e18).toString(16),
            gasLimit: '0x000000001',
            data: messageHex,
          };
  
          const signedTransaction = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionObject],
          });
        }
        
        setStatus(status);
      } else if (status === 500) {
        localStorage.removeItem('training');
        handleSnackbar('Error fetching training status: Internal Server Error', 'error');
      } else {
        console.log('aici')
      }
    } catch (error) {
      console.error('Error fetching training status:', error);
      handleSnackbar('Error fetching training status: Network Error', 'error');
    }
  };

  const handleSubmitTrainingModal = async (formData) => {
    try {
      const data = {
        ...formData,
        user_id: Cookies.get('userID'),
        model_name: modelToTrain,
        batch_size: parseInt(formData.batch_size),
        epochs: parseInt(formData.epochs),
        learning_rate: parseFloat(formData.learning_rate)
      };


      localStorage.setItem('training', JSON.stringify(true));
      const response = await Axios.post(TRAIN, data);

      setTrainingModalOpen(false);
    } catch (error) {
      console.error('Error fetching data for Train:', error);

    }
  };

  const handleDownloadWeights = async (model_name) => {
    const response = await Axios.get(GET_VERSIONS(Cookies.get('userID'), model_name));
    setSelectOptions(response.data);
    setmodelName(model_name);
    setShowSelectModal(true);
  }

  const handleSnackbar = (message, severity) => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarMessage(null);
    setSnackbarOpen(false);
  };


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "120vh",
        marginTop: "15vh",
      }}
    >
      <TableContainer component={Paper} sx={{ width: "80vw" }}>
        <Table aria-label="simple table">
          <TableHead sx={{ borderBottom: "2px solid var(--secondaryColor)" }}>
            <TableRow>
              <TableCell align="center">NAME</TableCell>
              <TableCell align="center">ARCHITECTURE</TableCell>
              <TableCell align="center">DATASET</TableCell>
              <TableCell align="center">TRAIN</TableCell>
              <TableCell align="center">DOWNLOAD WEIGHTS</TableCell>
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
                    ARCHITECTURE
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
                    DATASET
                  </Button>
                </TableCell>
                <TableCell align="center">
                  {localStorage.getItem('training') ? (
                    <Button variant="contained" onClick={() =>  fetchTrainingStatus(name)} sx={{
                      backgroundColor: "var(--mainColor)",
                      color: "var(--textColor)",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "var(--secondaryColor)",
                      },
                    }}>
                      Training in progress
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={() => handleTrainButtonClick(name)} sx={{
                      backgroundColor: "var(--mainColor)",
                      color: "var(--textColor)",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "var(--secondaryColor)",
                      },
                    }}>
                      TRAIN
                    </Button>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained" onClick={() => handleDownloadWeights(name)} sx={{
                    backgroundColor: "var(--mainColor)",
                    color: "var(--textColor)",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "var(--secondaryColor)",
                    },
                  }}>
                    SELECT VERSION
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
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            zIndex: "9999",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <h2 style={{ textAlign: "left", marginBottom: "20px" }}>
              Model:{" "}
              {modelName.charAt(0).toUpperCase() +
                modelName.slice(1).toLowerCase()}
            </h2>
            <Editor
              height="50vh"
              width="140vh"
              theme="vs-dark"
              defaultLanguage="python"
              value={architectureData}
              options={{ readOnly: true }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <Button
                variant="contained"
                onClick={handleCloseEditor}
                sx={{
                  backgroundColor: "var(--mainColor)",
                  color: "var(--textColor)",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "var(--secondaryColor)",
                  },
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {showModal && contentType === 'images' && (
        <ImageModal data={datasetData} handleCloseModal={handleCloseModal} />
      )}

      {showModal && contentType === "csv" && (
        <CSVModal data={datasetData} handleCloseModal={handleCloseModal} />
      )}
      

      {showSelectModal && (
        <SelectModal open={showSelectModal} model_name={modelName} handleSnackbar={handleSnackbar} handleClose={handleCloseSelectModal} options={selectOptions} />
      )}

      <TrainingModal
        open={trainingModalOpen}
        onClose={() => setTrainingModalOpen(false)}
        onSubmit={handleSubmitTrainingModal}
      />
    </div>
  );
}
