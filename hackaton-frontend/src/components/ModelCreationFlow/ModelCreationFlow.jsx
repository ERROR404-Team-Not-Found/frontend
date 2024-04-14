import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "../../utils/nodeTypes";

function ModelCreationFlow({ data, layerName }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    if (data) {
      const addEdgeToNewNode = (currentNodeId, newNodeId) => {
        const edge = {
          id: `e-${currentNodeId}-${newNodeId}`,
          source: currentNodeId,
          target: newNodeId,
          type: "default",
        };
        setEdges((eds) => addEdge(edge, eds));
      };

      setNodes((prevNodes) => [...prevNodes, data]);

      addEdgeToNewNode(nodes[nodes?.length - 1]?.id, data?.id);
    }
  }, [data, layerName, setNodes]);
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default ModelCreationFlow;
