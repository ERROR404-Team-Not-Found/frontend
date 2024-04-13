import React, { useState } from "react";
import ModelCreationFlow from "../ModelCreationFlow/ModelCreationFlow";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { GET_LAYERS, GET_ACTIVATION } from "../../utils/apiEndpoints";

function ModelCreator() {
  const [isCreating, setIsCreating] = useState(false);
  const [layers, setLayers] = useState(null);
  const [activation, setActivation] = useState(null);
  const [layerCount, setLayerCount] = useState(1);

  const handleCreateClick = async () => {
    setIsCreating(true);

    try {
      const activationsResponse = await axios.get(GET_ACTIVATION);
      const layersResponse = await axios.get(GET_LAYERS);

      setActivation(activationsResponse.data);
      setLayers(layersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCancelClick = () => {
    setIsCreating(false);
  };

  const handleAddLayer = (formData) => {
    const data = {};
  };

  return (
    <div style={{ width: "100%", height: "90vh", position: "relative" }}>
      <ModelCreationFlow data={{}} layerName={`Layer ${layerCount}`} />
      {isCreating ? (
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
            <Autocomplete
              disablePortal
              id="activation-func"
              options={
                activation
                  ? activation.map((item) => item.name)
                  : ["Loading ..."]
              }
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
                onClick={handleCancelClick}
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
          onClick={handleCreateClick}
          sx={{
            position: "absolute",
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
    </div>
  );
}

export default ModelCreator;
