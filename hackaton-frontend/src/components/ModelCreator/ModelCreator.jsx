import React, { useEffect, useRef, useState } from "react";
import ModelCreationFlow from "../ModelCreationFlow/ModelCreationFlow";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axios from "axios";
import {
  GET_LAYERS,
  GET_ACTIVATION,
  SAVE_MODEL,
} from "../../utils/apiEndpoints";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Cookies from "js-cookie";

function ModelCreator() {
  const [isCreatingLayer, setIsCreatingLayer] = useState(false);
  const [isCreatingActvFunc, setIsCreatingActvFunc] = useState(false);

  const [layers, setLayers] = useState(null);
  const [activation, setActivation] = useState(null);

  const [layerCount, setLayerCount] = useState(1);
  const [actvFuncCount, setActvFuncCount] = useState(1);

  const [selectedLayer, setSelectedLayer] = useState(null);
  const [selectedActivation, setSelectedActivation] = useState(null);

  const [yAxis, setYAxis] = useState(100);
  const [createdNode, setCreatedNode] = useState(null);

  const isLayerCreateRun = useRef(false);
  const isActvFuncCreateRun = useRef(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [modelName, setModelName] = useState(null);
  const [classesCount, setClassesCount] = useState(null);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateLayerClick = async () => {
    setIsCreatingLayer(true);
  };

  const handleCreateActvFuncClick = async () => {
    setIsCreatingActvFunc(true);
  };

  const handleSaveModelClick = async () => {
    handleCloseDialog();

    let jsonData = {};
    jsonData.name = modelName;
    jsonData.user_id = Cookies.get("userID");
    jsonData.layers = [];
    try {
      for (let node of layers) {
        jsonData.layers.push({ name: node.label, params: node.data.inputs });
      }
      jsonData.num_classes = classesCount;
      // await axios.post(SAVE_MODEL, jsonData);
      openSnackbar("Success: Model has been saved!");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLayerCreateRun.current) return;
    isLayerCreateRun.current = true;
    const getLayers = async () => {
      try {
        const layersResponse = await axios.get(GET_LAYERS);

        setLayers(layersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getLayers();
  });

  useEffect(() => {
    if (isActvFuncCreateRun.current) return;
    isActvFuncCreateRun.current = true;
    const getActivationFunction = async () => {
      try {
        const activationsResponse = await axios.get(GET_ACTIVATION);

        setActivation(activationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getActivationFunction();
  });

  const handleCancelCreateLayerClick = () => {
    setIsCreatingLayer(false);
    setSelectedLayer(null);
  };

  const handleCancelCreateActvFuncClick = () => {
    setIsCreatingActvFunc(false);
    setSelectedActivation(null);
  };

  const handleAddLayer = () => {
    setCreatedNode({
      id: `Layer-${layerCount}`,
      type: "modelNode",
      data: {
        label: selectedLayer,
        type: "layer",
        inputs: layers.find((layer) => layer.name === selectedLayer).inputs,
      },
      position: { x: 100, y: yAxis },
    });
    setYAxis(yAxis + 200);
    setLayerCount(layerCount + 1);

    setIsCreatingLayer(false);
    setSelectedLayer(null);
  };

  const handleAddActvFunc = () => {
    if (actvFuncCount < 2) {
      setCreatedNode({
        id: `Activation-${actvFuncCount}`,
        type: "modelNode",
        data: {
          label: selectedActivation,
          type: "activation-function",
          inputs: activation.find(
            (actvFunc) => actvFunc.name === selectedActivation
          ).inputs,
        },
        position: { x: 300, y: yAxis },
      });
      setYAxis(yAxis + 200);
      setActvFuncCount(actvFuncCount + 1);

      setIsCreatingActvFunc(false);
      setSelectedActivation(null);
    } else {
      openSnackbar("Error: Can't have more than 1 activation function");
    }
  };

  return (
    <div style={{ width: "100%", height: "90vh", position: "relative" }}>
      <ModelCreationFlow data={createdNode} layerName={createdNode?.id} />

      {isCreatingLayer ? (
        <Grid
          container
          item
          xs={10}
          sm={6}
          md={4}
          lg={3}
          sx={{
            position: "absolute",
            top: "30px",
            left: "30px",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "var(--mainColor)",
            border: "3px solid var(--secondaryColor)",
          }}
        >
          <Grid xs={12} container item sx={{ pb: "20px" }}>
            <Typography
              variant="h5"
              sx={{ color: "var(--textColor)", p: "10px" }}
            >
              Layer Details
            </Typography>
            <Divider
              sx={{
                backgroundColor: "var(--secondaryColor)",
                width: "100%",
                height: "1px",
                borderRadius: 50,
              }}
            ></Divider>
          </Grid>
          <Grid
            xs={12}
            item
            container
            sx={{
              justifyContent: "center",
              alignContent: "center",
              paddingBottom: "15px",
            }}
          >
            <Autocomplete
              disablePortal
              id="layer-architecture"
              options={
                layers ? layers.map((item) => item.name) : ["Loading ..."]
              }
              value={selectedLayer}
              onChange={(event, newValue) => setSelectedLayer(newValue)}
              sx={{
                width: "90%",
                "& .MuiAutocomplete-inputRoot": {
                  border: "1px solid var(--secondaryColor)",
                  borderRadius: "20px",
                  "&:hover": {
                    borderColor: "var(--textColor)",
                  },
                },
                "& .MuiInputLabel-outlined": {
                  color: "var(--textColor)",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                },
                "&.Mui-focused .MuiInputLabel-outlined": {
                  color: "var(--textColor)",
                },
              }}
              renderInput={(params) => (
                <TextField
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "var(--textColor)",
                    },
                  }}
                  {...params}
                  label="Layer Architecture"
                />
              )}
            />
          </Grid>
          <Grid
            xs={12}
            item
            container
            sx={{
              justifyContent: "center",
              alignContent: "center",
              paddingBottom: "15px",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "var(--textColor)",
                whiteSpace: "pre-wrap",
                width: "90%",
                display: "flex",
              }}
            >
              <InfoOutlinedIcon sx={{ pr: "10px" }} />
              {selectedLayer && selectedLayer !== "Loading ..."
                ? layers.find((layer) => layer.name === selectedLayer)
                    .description
                : "No layer selected"}
            </Typography>
          </Grid>
          <Grid
            xs={12}
            container
            item
            sx={{ justifyContent: "space-evenly", alignContent: "center" }}
          >
            <Grid
              xs={5}
              item
              container
              sx={{ justifyContent: "center", alignContent: "center" }}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={handleCancelCreateLayerClick}
                sx={{
                  padding: "10px",
                  pr: "20px",
                  pl: "20px",
                  borderRadius: "5px",
                  borderColor: "var(--secondaryColor)",
                  backgroundColor: "var(--mainColor)",
                  color: "var(--textColor)",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "var(--textColor)",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid
              xs={5}
              item
              container
              sx={{ justifyContent: "center", alignContent: "center" }}
            >
              <Button
                fullWidth
                disabled={
                  selectedLayer && selectedLayer !== "Loading ..."
                    ? false
                    : true
                }
                variant="outlined"
                onClick={handleAddLayer}
                sx={{
                  padding: "10px",
                  pr: "20px",
                  pl: "20px",
                  borderRadius: "5px",
                  borderColor: "var(--secondaryColor)",
                  backgroundColor: "var(--mainColor)",
                  color: "var(--textColor)",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "var(--textColor)",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Add Layer
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Button
          variant="contained"
          onClick={handleCreateLayerClick}
          sx={{
            display: isCreatingActvFunc ? "none" : "flex",
            position: "absolute",
            width: "120px",
            top: "30px",
            left: "30px",
            padding: "10px",
            pr: "20px",
            pl: "20px",
            borderRadius: "5px",
            backgroundColor: "var(--mainColor)",
            color: "var(--textColor)",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "var(--secondaryColor)",
            },
          }}
        >
          Add Layer
        </Button>
      )}
      {isCreatingActvFunc ? (
        <Grid
          container
          item
          xs={10}
          sm={6}
          md={4}
          lg={3}
          sx={{
            position: "absolute",
            top: "30px",
            left: "30px",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "var(--mainColor)",
            border: "3px solid var(--secondaryColor)",
          }}
        >
          <Grid xs={12} container item sx={{ pb: "20px" }}>
            <Typography
              variant="h5"
              sx={{ color: "var(--textColor)", p: "10px" }}
            >
              Activation Function Details
            </Typography>
            <Divider
              sx={{
                backgroundColor: "var(--secondaryColor)",
                width: "100%",
                height: "1px",
                borderRadius: 50,
              }}
            ></Divider>
          </Grid>
          <Grid
            xs={12}
            item
            container
            sx={{
              justifyContent: "center",
              alignContent: "center",
              paddingBottom: "15px",
            }}
          >
            <Autocomplete
              disablePortal
              id="activation-func"
              options={
                activation
                  ? activation.map((item) => item.name)
                  : ["Loading ..."]
              }
              value={selectedActivation}
              onChange={(event, newValue) => setSelectedActivation(newValue)}
              sx={{
                width: "90%",
                "& .MuiAutocomplete-inputRoot": {
                  border: "1px solid var(--secondaryColor)",
                  borderRadius: "20px",
                  "&:hover": {
                    borderColor: "var(--textColor)",
                  },
                },
                "& .MuiInputLabel-outlined": {
                  color: "var(--textColor)",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                },
                "&.Mui-focused .MuiInputLabel-outlined": {
                  color: "var(--textColor)",
                },
              }}
              renderInput={(params) => (
                <TextField
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "var(--textColor)",
                    },
                  }}
                  {...params}
                  label="Activation Function"
                />
              )}
            />
          </Grid>
          <Grid
            xs={12}
            item
            container
            sx={{
              justifyContent: "center",
              alignContent: "center",
              paddingBottom: "15px",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "var(--textColor)",
                whiteSpace: "pre-wrap",
                width: "90%",
                display: "flex",
              }}
            >
              <InfoOutlinedIcon sx={{ pr: "10px" }} />
              {selectedActivation && selectedActivation !== "Loading ..."
                ? activation.find(
                    (actvFunc) => actvFunc.name === selectedActivation
                  ).description
                : "No activation function selected"}
            </Typography>
          </Grid>
          <Grid
            xs={12}
            container
            item
            sx={{ justifyContent: "space-evenly", alignContent: "center" }}
          >
            <Grid
              xs={5}
              item
              container
              sx={{ justifyContent: "center", alignContent: "center" }}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={handleCancelCreateActvFuncClick}
                sx={{
                  padding: "10px",
                  pr: "20px",
                  pl: "20px",
                  borderRadius: "5px",
                  borderColor: "var(--secondaryColor)",
                  backgroundColor: "var(--mainColor)",
                  color: "var(--textColor)",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "var(--textColor)",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid
              xs={5}
              item
              container
              sx={{ justifyContent: "center", alignContent: "center" }}
            >
              <Button
                fullWidth
                disabled={
                  selectedActivation && selectedActivation !== "Loading ..."
                    ? false
                    : true
                }
                variant="outlined"
                onClick={handleAddActvFunc}
                sx={{
                  padding: "10px",
                  pr: "20px",
                  pl: "20px",
                  borderRadius: "5px",
                  borderColor: "var(--secondaryColor)",
                  backgroundColor: "var(--mainColor)",
                  color: "var(--textColor)",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "var(--textColor)",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Add A.F.
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Button
          variant="contained"
          onClick={handleCreateActvFuncClick}
          sx={{
            display: isCreatingLayer ? "none" : "flex",
            position: "absolute",
            width: "120px",
            top: "30px",
            left: "170px",
            padding: "10px",
            pr: "20px",
            pl: "20px",
            borderRadius: "5px",
            backgroundColor: "var(--mainColor)",
            color: "var(--textColor)",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "var(--secondaryColor)",
            },
          }}
        >
          Add A.F
        </Button>
      )}

      <Button
        variant="contained"
        onClick={handleOpenDialog}
        sx={{
          display:
            layerCount + actvFuncCount < 6 ||
            isCreatingLayer ||
            isCreatingActvFunc
              ? "none"
              : "flex",
          position: "absolute",
          width: "140px",
          top: "100px",
          left: "30px",
          padding: "10px",
          pr: "20px",
          pl: "20px",
          borderRadius: "5px",
          backgroundColor: "var(--mainColor)",
          color: "var(--textColor)",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "var(--secondaryColor)",
          },
        }}
      >
        Save Model
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarMessage.toLowerCase().split(":")[0]}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Save Model</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to save this model?</Typography>
          <TextField
            autoFocus
            margin="dense"
            id="modelName"
            label="Model Name"
            type="text"
            fullWidth
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="numClasses"
            label="Number of Classes"
            type="number"
            fullWidth
            value={classesCount}
            onChange={(e) => setClassesCount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveModelClick}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ModelCreator;
