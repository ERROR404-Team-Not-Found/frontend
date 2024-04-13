import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

function ModelCreationFlow({ data, layerName }) {
  const [displayedNodes, setDisplayedNodes] = useState([]);
  const [edgeArray, setEdgeArray] = useState([]);

  const [nodes, setNodes, onNodesChange] = useNodesState(displayedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgeArray);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {}, [data, layerName]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={displayedNodes}
        edges={edgeArray}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
export default ModelCreationFlow;
