import type { MouseEvent } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import { useDiagramEditMode } from './DiagramEditModeContext';

/**
 * Default bezier edge with a midpoint × control shown when the edge is selected.
 * Registered as edgeTypes.default so all existing edges pick it up automatically.
 */
export function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  markerStart,
  selected,
  interactionWidth,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const { readOnly } = useDiagramEditMode();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const removeEdge = (event: MouseEvent) => {
    event.stopPropagation();
    if (readOnly) return;
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={style}
        markerEnd={markerEnd}
        markerStart={markerStart}
        interactionWidth={interactionWidth}
      />
      {selected && !readOnly && (
        <EdgeLabelRenderer>
          <button
            type="button"
            className="nodrag nopan flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-xs font-medium text-muted-foreground shadow-sm hover:border-destructive hover:text-destructive"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              // EdgeLabelRenderer portal has pointer-events: none by default.
              pointerEvents: 'all',
            }}
            onClick={removeEdge}
            aria-label="Delete relation"
          >
            ×
          </button>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
