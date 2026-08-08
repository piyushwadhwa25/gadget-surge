import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Helmet } from 'react-helmet-async';
import { Copy, Plus, Database } from 'lucide-react';
import { TableNode, createColumn } from '@/components/db-builder/TableNode';
import type { TableFlowNode } from '@/components/db-builder/types';
import { generateSql } from '@/lib/generateSql';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const nodeTypes = { table: TableNode };

function createTableNode(index: number): TableFlowNode {
  return {
    id: crypto.randomUUID(),
    type: 'table',
    position: { x: 80 + index * 36, y: 80 + index * 36 },
    data: {
      tableName: `table_${index + 1}`,
      columns: [createColumn({ name: 'id', type: 'UUID', isPrimaryKey: true })],
    },
  };
}

function VisualDbBuilderCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<TableFlowNode>([createTableNode(0)]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [sqlOpen, setSqlOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sql = useMemo(() => generateSql(nodes, edges), [nodes, edges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges],
  );

  const addTable = () => {
    setNodes((current) => [...current, createTableNode(current.length)]);
  };

  const copySql = async () => {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[480px] flex-col">
      <Helmet>
        <title>Visual DB Builder | GadgetSurge</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-base font-semibold leading-tight">Visual DB Builder</h1>
            <p className="text-xs text-muted-foreground">
              Design tables and foreign keys, then export SQL. Diagram is not saved yet.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={addTable}>
            <Plus className="h-4 w-4" />
            Add Table
          </Button>
          <Button type="button" onClick={() => setSqlOpen(true)}>
            Export SQL
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={18} size={1} />
          <Controls />
          <MiniMap pannable zoomable />
        </ReactFlow>
      </div>

      <Dialog open={sqlOpen} onOpenChange={setSqlOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Exported SQL</DialogTitle>
            <DialogDescription>
              CREATE TABLE statements for each table, plus ALTER TABLE foreign keys for each
              relationship (source column → referenced column).
            </DialogDescription>
          </DialogHeader>
          <pre className="max-h-[50vh] overflow-auto rounded-md border border-border bg-muted/40 p-4 text-xs leading-relaxed">
            <code>{sql}</code>
          </pre>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={copySql}>
              <Copy className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy to Clipboard'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function VisualDbBuilder() {
  return (
    <ReactFlowProvider>
      <VisualDbBuilderCanvas />
    </ReactFlowProvider>
  );
}
