import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import { Copy, FolderOpen, Plus, Database, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { TableNode, createColumn } from '@/components/db-builder/TableNode';
import { serializeDiagram } from '@/components/db-builder/serializeDiagram';
import type { TableFlowNode } from '@/components/db-builder/types';
import { generateSql } from '@/lib/generateSql';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const TOOL_SLUG = 'visual-db-builder';
const FREE_DIAGRAM_LIMIT = 3;

const nodeTypes = { table: TableNode };

type Entitlement = {
  plan: 'free' | 'premium';
  status: string;
};

type SavedDiagramListItem = {
  id: string;
  name: string;
  updated_at: string;
  data: {
    nodes?: TableFlowNode[];
    edges?: Edge[];
  } | null;
};

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

async function fetchEntitlement(accessToken: string): Promise<Entitlement> {
  const response = await fetch('/api/entitlement', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      (body && typeof body.error === 'string' && body.error) ||
      `Failed to load entitlement (${response.status})`;
    throw new Error(message);
  }
  return response.json() as Promise<Entitlement>;
}

function VisualDbBuilderCanvas() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState<TableFlowNode>([createTableNode(0)]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [sqlOpen, setSqlOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [diagramId, setDiagramId] = useState<string | null>(null);
  const [diagramName, setDiagramName] = useState('');
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [myDiagramsOpen, setMyDiagramsOpen] = useState(false);
  const [diagrams, setDiagrams] = useState<SavedDiagramListItem[]>([]);
  const [diagramsLoading, setDiagramsLoading] = useState(false);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);

  const sql = useMemo(() => generateSql(nodes, edges), [nodes, edges]);

  const loadDiagrams = useCallback(async () => {
    setDiagramsLoading(true);
    const { data, error } = await supabase
      .from('workspace_data')
      .select('id, name, updated_at, data')
      .eq('tool_slug', TOOL_SLUG)
      .order('updated_at', { ascending: false });

    if (error) {
      toast.error(error.message || 'Failed to load diagrams');
      setDiagrams([]);
    } else {
      setDiagrams((data ?? []) as SavedDiagramListItem[]);
    }
    setDiagramsLoading(false);
  }, []);

  useEffect(() => {
    const accessToken = session?.access_token;
    if (!accessToken) {
      setEntitlement(null);
      return;
    }

    let cancelled = false;
    fetchEntitlement(accessToken)
      .then((data) => {
        if (!cancelled) setEntitlement(data);
      })
      .catch(() => {
        if (!cancelled) setEntitlement(null);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.access_token]);

  useEffect(() => {
    if (!session?.access_token) {
      setDiagrams([]);
      return;
    }
    void loadDiagrams();
  }, [session?.access_token, loadDiagrams]);

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

  const persistDiagram = async (name: string, existingId: string | null) => {
    const accessToken = session?.access_token;
    if (!accessToken) {
      toast.error('You must be signed in to save.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/save-diagram', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagramId: existingId ?? undefined,
          name,
          data: serializeDiagram(nodes, edges),
        }),
      });

      const body = await response.json().catch(() => null);

      if (response.status === 403) {
        const message =
          (body && typeof body.error === 'string' && body.error) ||
          'Free plan limit reached. Upgrade to save more.';
        toast.error(message, {
          action: {
            label: 'Upgrade',
            onClick: () => navigate('/dashboard'),
          },
        });
        return;
      }

      if (!response.ok) {
        const message =
          (body && typeof body.error === 'string' && body.error) ||
          `Failed to save diagram (${response.status})`;
        throw new Error(message);
      }

      const saved = body as { id: string; updated_at: string };
      setDiagramId(saved.id);
      setDiagramName(name);
      toast.success('Diagram saved');
      void loadDiagrams();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save diagram');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClick = () => {
    if (!diagramId) {
      setNameDraft(diagramName || 'Untitled diagram');
      setNameDialogOpen(true);
      return;
    }
    void persistDiagram(diagramName || 'Untitled diagram', diagramId);
  };

  const handleConfirmNameSave = () => {
    const name = nameDraft.trim();
    if (!name) {
      toast.error('Enter a diagram name');
      return;
    }
    setNameDialogOpen(false);
    void persistDiagram(name, null);
  };

  const handleLoadDiagram = (item: SavedDiagramListItem) => {
    const loadedNodes = Array.isArray(item.data?.nodes) ? item.data.nodes : [];
    const loadedEdges = Array.isArray(item.data?.edges) ? item.data.edges : [];
    setNodes(loadedNodes);
    setEdges(loadedEdges);
    setDiagramId(item.id);
    setDiagramName(item.name);
    setMyDiagramsOpen(false);
    toast.success(`Loaded “${item.name}”`);
  };

  const handleDeleteDiagram = async (item: SavedDiagramListItem) => {
    const { error } = await supabase.from('workspace_data').delete().eq('id', item.id);
    if (error) {
      toast.error(error.message || 'Failed to delete diagram');
      return;
    }
    if (diagramId === item.id) {
      setDiagramId(null);
      setDiagramName('');
    }
    toast.success('Diagram deleted');
    void loadDiagrams();
  };

  const planLabel = (() => {
    if (!entitlement) return null;
    if (entitlement.plan === 'premium') return 'Premium — unlimited';
    return `Free plan — ${diagrams.length}/${FREE_DIAGRAM_LIMIT} diagrams used`;
  })();

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
              {diagramName
                ? `Editing: ${diagramName}`
                : 'Design tables and foreign keys, then export SQL.'}
              {planLabel ? ` · ${planLabel}` : null}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setMyDiagramsOpen(true);
              void loadDiagrams();
            }}
          >
            <FolderOpen className="h-4 w-4" />
            My Diagrams
          </Button>
          <Button type="button" variant="outline" onClick={addTable}>
            <Plus className="h-4 w-4" />
            Add Table
          </Button>
          <Button type="button" variant="outline" onClick={handleSaveClick} disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save'}
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

      <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save diagram</DialogTitle>
            <DialogDescription>Choose a name for this diagram.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="diagram-name">Name</Label>
            <Input
              id="diagram-name"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleConfirmNameSave();
                }
              }}
              placeholder="Untitled diagram"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNameDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirmNameSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={myDiagramsOpen} onOpenChange={setMyDiagramsOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>My Diagrams</SheetTitle>
            <SheetDescription>
              Load a saved diagram or delete one to free a slot.
              {entitlement?.plan === 'free' ? (
                <>
                  {' '}
                  Free plan: {diagrams.length}/{FREE_DIAGRAM_LIMIT}.{' '}
                  <Link to="/dashboard" className="underline underline-offset-2">
                    Upgrade
                  </Link>
                </>
              ) : null}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-2">
            {diagramsLoading && (
              <p className="text-sm text-muted-foreground">Loading diagrams…</p>
            )}
            {!diagramsLoading && diagrams.length === 0 && (
              <p className="text-sm text-muted-foreground">No saved diagrams yet.</p>
            )}
            {!diagramsLoading &&
              diagrams.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-md border border-border px-3 py-2"
                >
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => handleLoadDiagram(item)}
                  >
                    <div className="truncate text-sm font-medium text-foreground">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Updated {new Date(item.updated_at).toLocaleString()}
                    </div>
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${item.name}`}
                    onClick={() => void handleDeleteDiagram(item)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
          </div>
        </SheetContent>
      </Sheet>
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
