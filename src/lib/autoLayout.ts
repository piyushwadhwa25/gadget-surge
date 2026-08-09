import { Graph, layout } from '@dagrejs/dagre';
import type { Edge } from '@xyflow/react';
import type { TableFlowNode } from '@/components/db-builder/types';

/** Matches TableNode.tsx card width / row metrics for collapsed vs expanded height. */
const NODE_WIDTH = 340;
const HEADER_HEIGHT = 49;
const LIST_PADDING_TOP = 8;
const ROW_HEIGHT = 46;
const FOOTER_HEIGHT = 49;
const COLLAPSED_BODY_HEIGHT = 32;

function getNodeSize(node: TableFlowNode): { width: number; height: number } {
  const width = node.measured?.width ?? node.width ?? NODE_WIDTH;

  if (typeof node.measured?.height === 'number') {
    return { width, height: node.measured.height };
  }
  if (typeof node.height === 'number') {
    return { width, height: node.height };
  }

  const columnCount = node.data.columns?.length ?? 1;
  const height = node.data.isCollapsed
    ? HEADER_HEIGHT + COLLAPSED_BODY_HEIGHT
    : HEADER_HEIGHT + LIST_PADDING_TOP + columnCount * ROW_HEIGHT + FOOTER_HEIGHT;

  return { width, height };
}

/**
 * Dagre top-to-bottom layout for schema diagrams (wide table cards read cleaner stacked).
 * Uses measured node height when React Flow has it; otherwise estimates from collapse/columns.
 */
export function getLayoutedNodes(
  nodes: TableFlowNode[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB',
): TableFlowNode[] {
  const graph = new Graph().setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: direction,
    nodesep: 56,
    ranksep: 80,
    marginx: 24,
    marginy: 24,
  });

  for (const node of nodes) {
    const { width, height } = getNodeSize(node);
    graph.setNode(node.id, { width, height });
  }

  for (const edge of edges) {
    if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
      graph.setEdge(edge.source, edge.target);
    }
  }

  layout(graph);

  return nodes.map((node) => {
    const laidOut = graph.node(node.id);
    if (!laidOut) return node;

    const { width, height } = getNodeSize(node);
    return {
      ...node,
      position: {
        x: laidOut.x - width / 2,
        y: laidOut.y - height / 2,
      },
    };
  });
}
