import React, { useState } from "react";
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
  const [selectedLayer, setSelectedLayer] = useState(null); // State to store selected layer
  const [selectedActivation, setSelectedActivation] = useState(null); // State to store selected activation function

  const handleCreateLayerClick = async () => {
    setIsCreatingLayer(true);

    try {
      const layersResponse = await axios.get(GET_LAYERS);

      setLayers(layersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreateActvFuncClick = async () => {
    setIsCreatingActvFunc(true);

    try {
      const activationsResponse = await axios.get(GET_ACTIVATION);

      setActivation(activationsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCancelCreateLayerClick = () => {
    setIsCreatingLayer(false);
  };

  const handleCancelCreateActvFuncClick = () => {
    setIsCreatingActvFunc(false);
  };

  const handleAddLayer = (formData) => {
    const data = {};
  };

  const handleAddActvFunc = (formData) => {
    const data = {};
  };

  return (
    <div style={{ width: "100%", height: "90vh", position: "relative" }}>
      <ModelCreationFlow data={{}} layerName={`Layer ${layerCount}`} />
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
              {selectedLayer
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
                disabled={selectedLayer ? false : true}
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
              {selectedActivation
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
                disabled={selectedActivation ? false : true}
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
