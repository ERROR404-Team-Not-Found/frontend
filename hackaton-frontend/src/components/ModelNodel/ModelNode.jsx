import * as React from "react";
import { Handle, Position } from "reactflow";
import {
  TextField
} from "@mui/material";


function ModelNode({ data, isConnectable }) {
  return (
    <div className="text-updater-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <TextField>Pula</TextField>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default ModelNode;
