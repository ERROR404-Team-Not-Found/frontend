import { useState } from "react";
import { Handle, Position } from "reactflow";
import {
  Button,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Modal,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function ModelNode({ data, isConnectable }) {
  const [nodeParameters, setNodeParameters] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [textFieldValueModal, setTextFieldValueModal] = useState("");
  const [dataAuxiliary, setDataAuxiliary] = useState(data);

  const handleOpenModal = (element) => {
    setNodeParameters(element);
    setModalOpen(true);
  };

  const handleSetProperty = () => {
    if (nodeParameters) {
      let updatedDataAuxiliary = { ...dataAuxiliary };

      updatedDataAuxiliary.inputs = updatedDataAuxiliary.inputs.map(
        (element) => {
          if (element.name === nodeParameters.name) {
            return { ...element, value: textFieldValueModal };
          } else {
            return element;
          }
        }
      );
      localStorage.setItem("newData", JSON.stringify(updatedDataAuxiliary));
      setDataAuxiliary(updatedDataAuxiliary);
      setTextFieldValueModal("");
      setModalOpen(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--mainColor)",
        border: "3px solid var(--secondaryColor)",
        borderRadius: 15,
        justifyContent: "center",
        alignContent: "center",
        width: "300px",
        height: "fit-content",
      }}
    >
      <Stack textAlign="center" sx={{ padding: "10px" }}>
        <Typography variant="h6" sx={{ color: "var(--textColor)" }}>
          {data.label}
        </Typography>
        <Grid container item>
          {data.inputs &&
            data.inputs.map((element, index) => {
              return (
                <Grid container item key={index}>
                  <Grid xs={8} container item>
                    <Tooltip
                      enterDelay={500}
                      title={element.description}
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "var(--secondaryColor)",
                            color: "var(--textColor)",
                            padding: "10px",
                          },
                        },
                      }}
                    >
                      <Button
                        onClick={() => handleOpenModal(element)}
                        sx={{
                          padding: "10px",
                          borderRadius: "5px",
                          borderColor: "var(--secondaryColor)",
                          backgroundColor: "var(--mainColor)",
                          color: "var(--textColor)",
                          cursor: "pointer",
                          "&:hover": {
                            borderColor: "var(--textColor)",
                            backgroundColor: "var(--secondaryColor)",
                          },
                        }}
                      >
                        {element?.name}
                      </Button>
                    </Tooltip>
                  </Grid>
                  <Grid
                    xs={4}
                    container
                    item
                    sx={{ justifyContent: "flex-end", alignContent: "center" }}
                  >
                    <Typography sx={{ pr: "10px", color: "var(--textColor)" }}>
                      {dataAuxiliary.inputs.find(
                        (item) => item.name === element.name
                      )?.value || ""}
                    </Typography>
                  </Grid>
                  <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <Grid
                      sx={{
                        position: "absolute",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "300px", sm: "400px" },
                        height: "fit-content",
                        top: "50%",
                        left: "50%",
                        borderRadius: 5,
                        backgroundColor: "var(--mainColor)",
                        padding: "20px",
                      }}
                    >
                      <Grid
                        xs={12}
                        item
                        container
                        sx={{ justifyContent: "center" }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ pb: "10px", color: "var(--textColor)" }}
                        >
                          {nodeParameters?.name}
                        </Typography>
                      </Grid>
                      <Grid xs={12} item container justifyContent="center">
                        <TextField
                          type="number"
                          sx={{
                            width: "90%",
                            pb: "20px",
                            "& .MuiInputBase-input": {
                              color: "var(--textColor)",
                            },
                          }}
                          value={textFieldValueModal}
                          onChange={(e) =>
                            setTextFieldValueModal(e.target.value)
                          }
                        />
                      </Grid>
                      <Grid
                        xs={12}
                        item
                        container
                        alignContent="center"
                        pb="20px"
                        justifyContent="center"
                        width="90%"
                      >
                        <div style={{ display: "flex" }}>
                          <InfoOutlinedIcon
                            sx={{ pr: "10px", color: "var(--textColor)" }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: "var(--textColor)",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {nodeParameters?.description}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid
                        xs={12}
                        item
                        container
                        sx={{ justifyContent: "space-evenly" }}
                      >
                        <Grid
                          xs={4}
                          item
                          container
                          sx={{ justifyContent: "center" }}
                        >
                          <Button
                            variant="outline"
                            fullWidth
                            sx={{
                              padding: "10px",
                              pr: "20px",
                              pl: "20px",
                              width: "100px",
                              borderRadius: "5px",
                              border: "1px solid var(--textColor)",
                              backgroundColor: "var(--mainColor)",
                              color: "var(--textColor)",
                              cursor: "pointer",
                              "&:hover": {
                                borderColor: "var(--textColor)",
                                backgroundColor: "var(--secondaryColor)",
                              },
                            }}
                            onClick={() => {
                              setModalOpen(false);
                              setTextFieldValueModal("");
                            }}
                          >
                            Cancel
                          </Button>
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          container
                          sx={{ justifyContent: "center" }}
                        >
                          <Button
                            variant="outline"
                            onClick={handleSetProperty}
                            sx={{
                              padding: "10px",
                              pr: "20px",
                              pl: "20px",
                              width: "100px",
                              borderRadius: "5px",
                              border: "1px solid var(--textColor)",
                              backgroundColor: "var(--mainColor)",
                              color: "var(--textColor)",
                              cursor: "pointer",
                              "&:hover": {
                                borderColor: "var(--textColor)",
                                backgroundColor: "var(--secondaryColor)",
                              },
                            }}
                          >
                            Set
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Modal>
                </Grid>
              );
            })}
        </Grid>
      </Stack>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default ModelNode;
