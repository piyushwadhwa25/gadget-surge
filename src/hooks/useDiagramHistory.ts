import { useCallback, useEffect, useRef, useState } from 'react';
import type { Edge } from '@xyflow/react';
import type { TableFlowNode } from '@/components/db-builder/types';

export type DiagramSnapshot = {
  nodes: TableFlowNode[];
  edges: Edge[];
};

const TEXT_DEBOUNCE_MS = 500;

function cloneSnapshot(nodes: TableFlowNode[], edges: Edge[]): DiagramSnapshot {
  return {
    nodes: structuredClone(nodes),
    edges: structuredClone(edges),
  };
}

/** Fingerprint of structure only — excludes names and positions so typing/dragging debounce. */
function structuralFingerprint(nodes: TableFlowNode[], edges: Edge[]): string {
  return JSON.stringify({
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      collapsed: !!node.data?.isCollapsed,
      columns: (node.data?.columns ?? []).map((col) => ({
        id: col.id,
        type: col.type,
        pk: col.isPrimaryKey,
      })),
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle ?? null,
      targetHandle: edge.targetHandle ?? null,
    })),
  });
}

function snapshotsEqual(a: DiagramSnapshot, b: DiagramSnapshot): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useDiagramHistory(
  nodes: TableFlowNode[],
  edges: Edge[],
  setNodes: (nodes: TableFlowNode[] | ((nodes: TableFlowNode[]) => TableFlowNode[])) => void,
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void,
) {
  const [past, setPast] = useState<DiagramSnapshot[]>([]);
  const [future, setFuture] = useState<DiagramSnapshot[]>([]);

  const applyingRef = useRef(false);
  const lastRef = useRef<DiagramSnapshot>(cloneSnapshot(nodes, edges));
  const lastStructuralRef = useRef(structuralFingerprint(nodes, edges));
  const textTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textBaselineRef = useRef<DiagramSnapshot | null>(null);

  const clearTextDebounce = useCallback(() => {
    if (textTimerRef.current !== null) {
      clearTimeout(textTimerRef.current);
      textTimerRef.current = null;
    }
    textBaselineRef.current = null;
  }, []);

  const pushPast = useCallback((snapshot: DiagramSnapshot) => {
    setPast((prev) => [...prev, snapshot]);
    setFuture([]);
  }, []);

  useEffect(() => {
    if (applyingRef.current) {
      applyingRef.current = false;
      lastRef.current = cloneSnapshot(nodes, edges);
      lastStructuralRef.current = structuralFingerprint(nodes, edges);
      clearTextDebounce();
      return;
    }

    const nextStructural = structuralFingerprint(nodes, edges);
    const previous = lastRef.current;

    if (nextStructural !== lastStructuralRef.current) {
      clearTextDebounce();
      pushPast(cloneSnapshot(previous.nodes, previous.edges));
      lastStructuralRef.current = nextStructural;
      lastRef.current = cloneSnapshot(nodes, edges);
      return;
    }

    const nextSnapshot = cloneSnapshot(nodes, edges);
    if (snapshotsEqual(previous, nextSnapshot)) {
      return;
    }

    // Names / positions — debounce into one history entry.
    if (!textBaselineRef.current) {
      textBaselineRef.current = cloneSnapshot(previous.nodes, previous.edges);
    }

    if (textTimerRef.current !== null) {
      clearTimeout(textTimerRef.current);
    }

    textTimerRef.current = setTimeout(() => {
      const baseline = textBaselineRef.current;
      textBaselineRef.current = null;
      textTimerRef.current = null;
      if (baseline && !snapshotsEqual(baseline, lastRef.current)) {
        pushPast(baseline);
      }
    }, TEXT_DEBOUNCE_MS);

    lastRef.current = nextSnapshot;
  }, [nodes, edges, clearTextDebounce, pushPast]);

  useEffect(
    () => () => {
      if (textTimerRef.current !== null) {
        clearTimeout(textTimerRef.current);
      }
    },
    [],
  );

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const present = cloneSnapshot(nodes, edges);
    applyingRef.current = true;
    clearTextDebounce();
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [present, ...f]);
    setNodes(structuredClone(previous.nodes));
    setEdges(structuredClone(previous.edges));
  }, [past, nodes, edges, setNodes, setEdges, clearTextDebounce]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const present = cloneSnapshot(nodes, edges);
    applyingRef.current = true;
    clearTextDebounce();
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, present]);
    setNodes(structuredClone(next.nodes));
    setEdges(structuredClone(next.edges));
  }, [future, nodes, edges, setNodes, setEdges, clearTextDebounce]);

  return {
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
