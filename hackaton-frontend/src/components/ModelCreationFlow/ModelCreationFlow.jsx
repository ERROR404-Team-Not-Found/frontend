import React, { useEffect, useRef } from "react";
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

function ModelCreationFlow({ data }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const areNodesUpdating = useRef(false);
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
  }, [data, nodes, setNodes, setEdges]);

  useEffect(() => {
    if (nodes) {
      areNodesUpdating.current = true;
      let auxArray = nodes;
      for (let i = 0; i < nodes.length - 1; i++) {
        if (auxArray[i + 1].data.type !== "activation-function")
          for (let elem of auxArray[i + 1].data.inputs) {
            if (
              elem.name.toLowerCase().includes("in") &&
              auxArray[i].data.type !== "activation-function"
            ) {
              elem.value = auxArray[i].data.inputs.find(
                (el) => el.name.toLowerCase().includes("out")[0]
              );
            }
          }
      }
      setNodes(auxArray);
      areNodesUpdating.current = false;
    }
  }, [nodes, setNodes]);

  useEffect(() => {
    const localNode = JSON.parse(localStorage.getItem("newData"));
    if (localNode && !areNodesUpdating.current) {
      setNodes((prevNodes) => {
        const index = prevNodes.findIndex((node) => node.id === localNode.id);

        if (index !== -1) {
          const updatedNodes = [...prevNodes];
          updatedNodes[index] = localNode;
          return updatedNodes;
        } else {
          return [...prevNodes];
        }
      });
    }
  }, [nodes, setNodes]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
