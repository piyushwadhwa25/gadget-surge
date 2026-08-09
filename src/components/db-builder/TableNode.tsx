import { useEffect } from 'react';
import {
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
  type NodeProps,
} from '@xyflow/react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  SQL_TYPES,
  columnSourceHandleId,
  columnTargetHandleId,
  type ColumnDef,
  type SqlType,
  type TableFlowNode,
} from './types';

/** Layout constants so Handles sit on the correct column row (RF positions them vs the node). */
const HEADER_HEIGHT = 49;
const LIST_PADDING_TOP = 8;
const ROW_HEIGHT = 46;

function createColumn(partial?: Partial<ColumnDef>): ColumnDef {
  return {
    id: crypto.randomUUID(),
    name: partial?.name ?? 'column',
    type: partial?.type ?? 'VARCHAR(255)',
    isPrimaryKey: partial?.isPrimaryKey ?? false,
  };
}

export function TableNode({ id, data }: NodeProps<TableFlowNode>) {
  const { updateNodeData, setEdges } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const isCollapsed = !!data.isCollapsed;

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, data.columns.length, isCollapsed, updateNodeInternals]);

  const patchColumns = (columns: ColumnDef[]) => {
    updateNodeData(id, { columns });
  };

  const updateColumn = (columnId: string, patch: Partial<ColumnDef>) => {
    patchColumns(
      data.columns.map((col) => (col.id === columnId ? { ...col, ...patch } : col)),
    );
  };

  const removeColumn = (columnId: string) => {
    const targetHandle = columnTargetHandleId(columnId);
    const sourceHandle = columnSourceHandleId(columnId);
    patchColumns(data.columns.filter((col) => col.id !== columnId));
    setEdges((edges) =>
      edges.filter(
        (edge) =>
          !(edge.source === id && edge.sourceHandle === sourceHandle) &&
          !(edge.target === id && edge.targetHandle === targetHandle) &&
          !(edge.source === id && edge.sourceHandle === columnId) &&
          !(edge.target === id && edge.targetHandle === columnId),
      ),
    );
  };

  const addColumn = () => {
    patchColumns([...data.columns, createColumn()]);
  };

  const toggleCollapsed = () => {
    updateNodeData(id, { isCollapsed: !isCollapsed });
  };

  const fieldCountLabel = `${data.columns.length} Fields`;

  return (
    <div className="w-[340px] rounded-md border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-2 py-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="nodrag nopan h-7 w-7 shrink-0 text-muted-foreground"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? 'Expand table' : 'Collapse table'}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Input
          value={data.tableName}
          onChange={(e) => updateNodeData(id, { tableName: e.target.value })}
          className="nodrag nopan h-8 flex-1 font-semibold"
          placeholder="table_name"
          aria-label="Table name"
        />
      </div>

      {isCollapsed ? (
        <div className="px-3 py-2 text-xs text-muted-foreground">{fieldCountLabel}</div>
      ) : (
        <>
          <div className="space-y-2 p-2">
            {data.columns.map((column, index) => {
              const handleTop =
                HEADER_HEIGHT + LIST_PADDING_TOP + index * ROW_HEIGHT + ROW_HEIGHT / 2;

              return (
                <div
                  key={column.id}
                  className="flex h-10 items-center gap-1.5 rounded-md border border-border/70 bg-background px-2"
                >
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={columnTargetHandleId(column.id)}
                    className="!h-2.5 !w-2.5 !bg-primary"
                    style={{ top: handleTop }}
                  />

                  <Input
                    value={column.name}
                    onChange={(e) => updateColumn(column.id, { name: e.target.value })}
                    className="nodrag nopan h-8 min-w-0 flex-1 text-xs"
                    placeholder="column"
                    aria-label="Column name"
                  />

                  <Select
                    value={column.type}
                    onValueChange={(value: SqlType) => updateColumn(column.id, { type: value })}
                  >
                    <SelectTrigger className="nodrag nopan h-8 w-[118px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="nodrag nopan">
                      {SQL_TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="text-xs">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="nodrag nopan flex items-center gap-1">
                    <Checkbox
                      id={`${column.id}-pk`}
                      checked={column.isPrimaryKey}
                      onCheckedChange={(checked) =>
                        updateColumn(column.id, { isPrimaryKey: checked === true })
                      }
                      aria-label="Primary key"
                    />
                    <Label
                      htmlFor={`${column.id}-pk`}
                      className="cursor-pointer text-[10px] text-muted-foreground"
                    >
                      PK
                    </Label>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="nodrag nopan h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeColumn(column.id)}
                    aria-label="Delete column"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>

                  <Handle
                    type="source"
                    position={Position.Right}
                    id={columnSourceHandleId(column.id)}
                    className="!h-2.5 !w-2.5 !bg-primary"
                    style={{ top: handleTop }}
                  />
                </div>
              );
            })}
          </div>

          <div className="border-t border-border px-2 py-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="nodrag nopan w-full"
              onClick={addColumn}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Column
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export { createColumn };
