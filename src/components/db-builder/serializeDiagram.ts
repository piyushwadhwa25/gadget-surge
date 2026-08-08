import type { Edge } from '@xyflow/react';
import type { TableFlowNode } from './types';

export type SerializedNode = {
  id: string;
  type: string | undefined;
  position: { x: number; y: number };
  data: TableFlowNode['data'];
};

export type SerializedEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null | undefined;
  targetHandle: string | null | undefined;
  animated: boolean | undefined;
};

export type SerializedDiagram = {
  nodes: SerializedNode[];
  edges: SerializedEdge[];
};

/** Strip React Flow runtime fields; persist only schema-relevant node/edge data. */
export function serializeDiagram(nodes: TableFlowNode[], edges: Edge[]): SerializedDiagram {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: { x: node.position.x, y: node.position.y },
      data: node.data,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      animated: edge.animated,
    })),
  };
}
