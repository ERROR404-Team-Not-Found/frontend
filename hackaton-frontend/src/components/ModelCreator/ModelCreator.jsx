import React, { useEffect, useRef, useState } from "react";
import ModelCreationFlow from "../ModelCreationFlow/ModelCreationFlow";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axios from "axios";
import { GET_LAYERS, GET_ACTIVATION } from "../../utils/apiEndpoints";

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

  const handleCreateLayerClick = async () => {
    setIsCreatingLayer(true);
  };

  const handleCreateActvFuncClick = async () => {
    setIsCreatingActvFunc(true);
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
    setYAxis(yAxis + 50);
    setLayerCount(layerCount + 1);

    setIsCreatingLayer(false);
    setSelectedLayer(null);
  };

  const handleAddActvFunc = () => {
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
    setYAxis(yAxis + 50);
    setActvFuncCount(actvFuncCount + 1);

    setIsCreatingActvFunc(false);
    setSelectedActivation(null);
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
    </div>
  );
}

export default ModelCreator;
