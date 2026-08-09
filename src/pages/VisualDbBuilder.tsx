import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  ViewportPortal,
  addEdge,
  getNodesBounds,
  getViewportForBounds,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toJpeg, toPng, toSvg } from 'html-to-image';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cloud,
  Copy,
  FileInput,
  FolderOpen,
  ImageDown,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  Database,
  Redo2,
  Save,
  Sparkles,
  Trash2,
  Undo2,
} from 'lucide-react';
import { toast } from 'sonner';
import { AiAgentDialog } from '@/components/db-builder/AiAgentDialog';
import { DeletableEdge } from '@/components/db-builder/DeletableEdge';
import { TableNode, createColumn } from '@/components/db-builder/TableNode';
import { serializeDiagram } from '@/components/db-builder/serializeDiagram';
import type { TableFlowNode } from '@/components/db-builder/types';
import { schemaToNodesAndEdges } from '@/lib/aiSchemaGenerator';
import { getLayoutedNodes } from '@/lib/autoLayout';
import { generatePrisma } from '@/lib/generatePrisma';
import { generateSql } from '@/lib/generateSql';
import { useDiagramHistory } from '@/hooks/useDiagramHistory';
import {
  deleteDiagramLocal,
  listDiagramsLocal,
  saveDiagramLocal,
  type LocalDiagram,
} from '@/lib/localDiagramStore';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CLOUD_TOOL_SLUG = 'visual-db-builder';
const EXPORT_IMAGE_WIDTH = 1024;
const EXPORT_IMAGE_HEIGHT = 768;
const WATERMARK_TEXT = 'Made with GadgetSurge — gadgetsurge.com';

type CloudDiagramMeta = {
  id: string;
  name: string;
  updated_at: string;
};

type CloudListGate = 'ready' | 'login' | 'upgrade';

const EXPORT_CHROME_CLASSES = [
  'react-flow__controls',
  'react-flow__minimap',
  'react-flow__panel',
  'react-flow__attribution',
  'db-builder-chrome',
];

function isExportChromeNode(node: HTMLElement): boolean {
  if (!node?.classList) return false;
  return EXPORT_CHROME_CLASSES.some((className) => node.classList.contains(className));
}

function isWatermarkNode(node: HTMLElement): boolean {
  return Boolean(node?.classList?.contains('db-builder-watermark'));
}

function sanitizeFilename(name: string): string {
  const cleaned = name.trim().replace(/[^\w\-]+/g, '_').replace(/^_+|_+$/g, '');
  return cleaned || 'schema-diagram';
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

const nodeTypes = { table: TableNode };
const edgeTypes = { default: DeletableEdge };

type Entitlement = {
  plan: 'free' | 'premium';
  status: string;
};

type ExportFormat = 'sql' | 'prisma' | 'png' | 'svg' | 'jpeg';
type ImageExportFormat = 'png' | 'svg' | 'jpeg';

function isImageExportFormat(format: ExportFormat): format is ImageExportFormat {
  return format === 'png' || format === 'svg' || format === 'jpeg';
}

function DbBuilderWatermark({ nodes }: { nodes: TableFlowNode[] }) {
  const bounds =
    nodes.length > 0
      ? getNodesBounds(nodes)
      : { x: 0, y: 0, width: 0, height: 0 };

  return (
    <ViewportPortal>
      <div
        className="db-builder-watermark pointer-events-none select-none"
        style={{
          position: 'absolute',
          left: bounds.x + Math.max(bounds.width, 200),
          top: bounds.y + bounds.height + 14,
          transform: 'translateX(-100%)',
          zIndex: 10,
          fontSize: '12px',
          lineHeight: 1.2,
          // Explicit color so export (white background) stays legible regardless of theme tokens.
          color: 'rgba(63, 63, 70, 0.62)',
          whiteSpace: 'nowrap',
        }}
        aria-hidden
      >
        {WATERMARK_TEXT}
      </div>
    </ViewportPortal>
  );
}

function createTableNode(index: number): TableFlowNode {
  return {
    id: crypto.randomUUID(),
    type: 'table',
    dragHandle: '.drag-handle__table-node',
    position: { x: 80 + index * 36, y: 80 + index * 36 },
    data: {
      tableName: `table_${index + 1}`,
      columns: [createColumn({ name: 'id', type: 'UUID', isPrimaryKey: true })],
      isCollapsed: false,
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
  const { fitView, getNodes } = useReactFlow();
  const flowWrapperRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<TableFlowNode>([createTableNode(0)]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { undo, redo, applyChange, canUndo, canRedo } = useDiagramHistory(
    nodes,
    edges,
    setNodes,
    setEdges,
  );
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('sql');
  const [copied, setCopied] = useState(false);
  const [diagramId, setDiagramId] = useState<string | null>(null);
  const [diagramName, setDiagramName] = useState('');
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [nameDialogMode, setNameDialogMode] = useState<'save' | 'cloud-sync'>('save');
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [exportingImage, setExportingImage] = useState(false);
  const [myDiagramsOpen, setMyDiagramsOpen] = useState(false);
  const [diagramsTab, setDiagramsTab] = useState<'local' | 'cloud'>('local');
  const [diagrams, setDiagrams] = useState<LocalDiagram[]>([]);
  const [diagramsLoading, setDiagramsLoading] = useState(false);
  const [cloudDiagrams, setCloudDiagrams] = useState<CloudDiagramMeta[]>([]);
  const [cloudDiagramsLoading, setCloudDiagramsLoading] = useState(false);
  const [cloudListGate, setCloudListGate] = useState<CloudListGate>('ready');
  const [cloudPrompt, setCloudPrompt] = useState<'login' | 'upgrade' | null>(null);
  const [aiAgentOpen, setAiAgentOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importSqlText, setImportSqlText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const exportText = useMemo(() => {
    if (exportFormat === 'prisma') return generatePrisma(nodes, edges);
    if (exportFormat === 'sql') return generateSql(nodes, edges);
    return '';
  }, [nodes, edges, exportFormat]);

  const loadDiagrams = useCallback(async () => {
    setDiagramsLoading(true);
    try {
      const items = await listDiagramsLocal();
      setDiagrams(items);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load diagrams');
      setDiagrams([]);
    } finally {
      setDiagramsLoading(false);
    }
  }, []);

  const loadCloudDiagrams = useCallback(async () => {
    setCloudDiagramsLoading(true);
    try {
      if (!session?.access_token) {
        setCloudListGate('login');
        setCloudDiagrams([]);
        return;
      }

      const entitlement = await fetchEntitlement(session.access_token);
      if (entitlement.plan !== 'premium') {
        setCloudListGate('upgrade');
        setCloudDiagrams([]);
        return;
      }

      setCloudListGate('ready');
      const { data, error } = await supabase
        .from('workspace_data')
        .select('id, name, updated_at')
        .eq('tool_slug', CLOUD_TOOL_SLUG)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCloudDiagrams(
        (data ?? []).map((row) => ({
          id: String(row.id),
          name: typeof row.name === 'string' ? row.name : 'Untitled diagram',
          updated_at: typeof row.updated_at === 'string' ? row.updated_at : '',
        })),
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load cloud diagrams');
      setCloudDiagrams([]);
    } finally {
      setCloudDiagramsLoading(false);
    }
  }, [session?.access_token]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges],
  );

  const addTable = () => {
    setNodes((current) => [...current, createTableNode(current.length)]);
  };

  const handleTidyUp = () => {
    if (nodes.length === 0) {
      toast.error('Add a table before tidying up');
      return;
    }
    const layouted = getLayoutedNodes(nodes, edges, 'TB');
    applyChange(layouted, edges);
    window.requestAnimationFrame(() => {
      void fitView({ padding: 0.16, duration: 300 });
    });
    toast.success('Diagram tidied up');
  };

  const handleExportImage = async (format: ImageExportFormat) => {
    // Official @xyflow/react download-image recipe: capture `.react-flow__viewport`
    // (edges + nodes live inside it), fit all nodes via getNodesBounds +
    // getViewportForBounds, and apply the transform through html-to-image's
    // `style` option (clone-only — live canvas viewport is not mutated).
    const viewportEl = flowWrapperRef.current?.querySelector(
      '.react-flow__viewport',
    ) as HTMLElement | null;
    if (!viewportEl) {
      toast.error('Canvas not ready to export');
      return;
    }

    const measuredNodes = getNodes();
    if (measuredNodes.length === 0) {
      toast.error('Add a table before exporting an image');
      return;
    }

    setExportingImage(true);
    try {
      let plan: Entitlement['plan'] = 'free';
      if (session?.access_token) {
        try {
          const entitlement = await fetchEntitlement(session.access_token);
          plan = entitlement.plan;
        } catch {
          plan = 'free';
        }
      }

      const nodesBounds = getNodesBounds(measuredNodes);
      const viewport = getViewportForBounds(
        nodesBounds,
        EXPORT_IMAGE_WIDTH,
        EXPORT_IMAGE_HEIGHT,
        0.5,
        2,
        0.16,
      );

      const filter = (node: HTMLElement) =>
        !isExportChromeNode(node) && !(isWatermarkNode(node) && plan === 'premium');

      const exportOptions = {
        filter,
        cacheBust: true,
        backgroundColor: '#ffffff',
        width: EXPORT_IMAGE_WIDTH,
        height: EXPORT_IMAGE_HEIGHT,
        style: {
          width: `${EXPORT_IMAGE_WIDTH}px`,
          height: `${EXPORT_IMAGE_HEIGHT}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      };

      const basename = sanitizeFilename(diagramName || 'schema-diagram');
      const dataUrl =
        format === 'png'
          ? await toPng(viewportEl, { ...exportOptions, pixelRatio: 2 })
          : format === 'jpeg'
            ? await toJpeg(viewportEl, { ...exportOptions, pixelRatio: 2, quality: 0.92 })
            : await toSvg(viewportEl, exportOptions);

      downloadDataUrl(dataUrl, `${basename}.${format === 'jpeg' ? 'jpg' : format}`);
      toast.success(`Exported ${format.toUpperCase()}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to export image');
    } finally {
      setExportingImage(false);
    }
  };

  const copyExport = async () => {
    await navigator.clipboard.writeText(exportText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const persistDiagramLocal = async (name: string, existingId: string | null) => {
    setSaving(true);
    try {
      const saved = await saveDiagramLocal({
        id: existingId ?? undefined,
        name,
        data: serializeDiagram(nodes, edges),
      });
      setDiagramId(saved.id);
      setDiagramName(saved.name);
      toast.success('Diagram saved');
      void loadDiagrams();
      return saved;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save diagram');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const pushDiagramToCloud = async (id: string, name: string) => {
    const accessToken = session?.access_token;
    if (!accessToken) {
      setCloudPrompt('login');
      return;
    }

    setSyncing(true);
    try {
      const response = await fetch('/api/save-diagram', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagramId: id,
          name,
          data: serializeDiagram(nodes, edges),
        }),
      });

      const body = await response.json().catch(() => null);

      if (response.status === 403) {
        const message =
          (body && typeof body.error === 'string' && body.error) ||
          'Cloud sync requires a premium plan.';
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
          `Failed to sync diagram (${response.status})`;
        throw new Error(message);
      }

      toast.success('Diagram synced to cloud');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to sync diagram');
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveClick = () => {
    if (!diagramId) {
      setNameDialogMode('save');
      setNameDraft(diagramName || 'Untitled diagram');
      setNameDialogOpen(true);
      return;
    }
    void persistDiagramLocal(diagramName || 'Untitled diagram', diagramId);
  };

  const handleConfirmNameSave = async () => {
    const name = nameDraft.trim();
    if (!name) {
      toast.error('Enter a diagram name');
      return;
    }
    setNameDialogOpen(false);
    const mode = nameDialogMode;
    const saved = await persistDiagramLocal(name, null);
    if (mode === 'cloud-sync' && saved) {
      await pushDiagramToCloud(saved.id, saved.name);
    }
  };

  const handleCloudSyncClick = async () => {
    if (!session?.access_token) {
      setCloudPrompt('login');
      return;
    }

    setSyncing(true);
    try {
      const entitlement = await fetchEntitlement(session.access_token);
      if (entitlement.plan !== 'premium') {
        setCloudPrompt('upgrade');
        return;
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to check plan');
      return;
    } finally {
      setSyncing(false);
    }

    if (!diagramId) {
      setNameDialogMode('cloud-sync');
      setNameDraft(diagramName || 'Untitled diagram');
      setNameDialogOpen(true);
      return;
    }

    const saved = await persistDiagramLocal(diagramName || 'Untitled diagram', diagramId);
    if (saved) {
      await pushDiagramToCloud(saved.id, saved.name);
    }
  };

  const handleImportSql = async () => {
    setImportError(null);
    setImporting(true);
    try {
      const { importSql } = await import('@/lib/importSql');
      const { schema, fallbackColumns } = importSql(importSqlText);
      const { nodes: newNodes, edges: newEdges } = schemaToNodesAndEdges(schema, nodes.length);
      if (newNodes.length === 0) {
        throw new Error('No tables were imported from the pasted SQL.');
      }

      applyChange([...nodes, ...newNodes], [...edges, ...newEdges]);
      setImportOpen(false);
      setImportSqlText('');
      toast.success(
        `Imported ${newNodes.length} table${newNodes.length === 1 ? '' : 's'}${
          newEdges.length > 0
            ? ` and ${newEdges.length} relation${newEdges.length === 1 ? '' : 's'}`
            : ''
        }`,
      );

      if (fallbackColumns.length > 0) {
        const sample = fallbackColumns
          .slice(0, 3)
          .map((col) => `${col.table}.${col.column} (${col.rawType})`)
          .join(', ');
        const more =
          fallbackColumns.length > 3 ? ` and ${fallbackColumns.length - 3} more` : '';
        toast.warning(
          `${fallbackColumns.length} column type${
            fallbackColumns.length === 1 ? '' : 's'
          } approximated as VARCHAR(255): ${sample}${more}`,
        );
      }
    } catch (err: unknown) {
      setImportError(err instanceof Error ? err.message : 'Failed to import SQL.');
    } finally {
      setImporting(false);
    }
  };

  const handleLoadDiagram = (item: LocalDiagram) => {
    const loadedNodes = Array.isArray(item.data?.nodes) ? (item.data.nodes as TableFlowNode[]) : [];
    const loadedEdges = Array.isArray(item.data?.edges) ? (item.data.edges as Edge[]) : [];
    setNodes(loadedNodes);
    setEdges(loadedEdges);
    setDiagramId(item.id);
    setDiagramName(item.name);
    setMyDiagramsOpen(false);
    toast.success(`Loaded “${item.name}”`);
  };

  const handleLoadCloudDiagram = async (item: CloudDiagramMeta) => {
    try {
      const { data: row, error } = await supabase
        .from('workspace_data')
        .select('id, name, data')
        .eq('id', item.id)
        .eq('tool_slug', CLOUD_TOOL_SLUG)
        .maybeSingle();

      if (error) {
        throw error;
      }
      if (!row) {
        throw new Error('Diagram not found in cloud');
      }

      const payload =
        row.data && typeof row.data === 'object' && !Array.isArray(row.data)
          ? (row.data as { nodes?: unknown; edges?: unknown })
          : null;
      const loadedNodes = Array.isArray(payload?.nodes)
        ? (payload.nodes as TableFlowNode[])
        : [];
      const loadedEdges = Array.isArray(payload?.edges) ? (payload.edges as Edge[]) : [];
      const name = typeof row.name === 'string' ? row.name : item.name;
      const cloudId = String(row.id);

      setNodes(loadedNodes);
      setEdges(loadedEdges);
      setDiagramId(cloudId);
      setDiagramName(name);

      await saveDiagramLocal({
        id: cloudId,
        name,
        data: serializeDiagram(loadedNodes, loadedEdges),
      });

      setMyDiagramsOpen(false);
      toast.success(`Loaded “${name}”`);
      void loadDiagrams();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load cloud diagram');
    }
  };

  const handleDeleteDiagram = async (item: LocalDiagram) => {
    try {
      await deleteDiagramLocal(item.id);
      if (diagramId === item.id) {
        setDiagramId(null);
        setDiagramName('');
      }
      toast.success('Diagram deleted');
      void loadDiagrams();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete diagram');
    }
  };

  const handleDeleteCloudDiagram = async (item: CloudDiagramMeta) => {
    try {
      const { error } = await supabase
        .from('workspace_data')
        .delete()
        .eq('id', item.id)
        .eq('tool_slug', CLOUD_TOOL_SLUG);

      if (error) {
        throw error;
      }

      toast.success('Cloud diagram deleted');
      void loadCloudDiagrams();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete cloud diagram');
    }
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
              {diagramName
                ? `Editing: ${diagramName}`
                : 'Design tables and foreign keys, then export SQL.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setMyDiagramsOpen(true);
              if (diagramsTab === 'cloud') {
                void loadCloudDiagrams();
              } else {
                void loadDiagrams();
              }
            }}
          >
            <FolderOpen className="h-4 w-4" />
            My Diagrams
          </Button>
          <Button type="button" variant="outline" onClick={addTable}>
            <Plus className="h-4 w-4" />
            Add Table
          </Button>
          <Button type="button" variant="outline" onClick={() => setAiAgentOpen(true)}>
            <Sparkles className="h-4 w-4" />
            AI Agent
          </Button>
          <Button type="button" variant="outline" onClick={handleSaveClick} disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setImportError(null);
              setImportOpen(true);
            }}
          >
            <FileInput className="h-4 w-4" />
            Import
          </Button>
          <Button
            type="button"
            onClick={() => {
              setCopied(false);
              setExportOpen(true);
            }}
          >
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" aria-label="More actions">
                <MoreHorizontal className="h-4 w-4" />
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={handleTidyUp}>
                <LayoutGrid className="mr-2 h-4 w-4" />
                Tidy Up
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden />
          <Button
            type="button"
            variant="secondary"
            onClick={() => void handleCloudSyncClick()}
            disabled={syncing || saving}
          >
            <Cloud className="h-4 w-4" />
            {syncing ? 'Syncing…' : 'Cloud Sync'}
          </Button>
        </div>
      </div>

      <div ref={flowWrapperRef} className="relative min-h-0 flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          // Default is Backspace only; include Delete. Library skips when focus is in
          // INPUT/SELECT/TEXTAREA via isInputDOMNode (typing table/column names is safe).
          // Connected edges are removed automatically by getElementsToRemove.
          deleteKeyCode={['Backspace', 'Delete']}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={18} size={1} />
          <Controls />
          <MiniMap pannable zoomable />
          <DbBuilderWatermark nodes={nodes} />
        </ReactFlow>
        <div className="db-builder-chrome pointer-events-none absolute bottom-3 left-14 z-10 rounded-md border border-border bg-background/95 px-2.5 py-1 text-xs text-muted-foreground shadow-sm">
          {nodes.length} Tables · {edges.length} Relations
        </div>
      </div>

      <AiAgentDialog
        open={aiAgentOpen}
        onOpenChange={setAiAgentOpen}
        existingNodeCount={nodes.length}
        onApply={(newNodes, newEdges) => {
          setNodes((current) => [...current, ...newNodes]);
          setEdges((current) => [...current, ...newEdges]);
        }}
      />

      <Dialog
        open={importOpen}
        onOpenChange={(open) => {
          setImportOpen(open);
          if (!open) setImportError(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileInput className="h-5 w-5 text-primary" />
              Import SQL
            </DialogTitle>
            <DialogDescription>
              Paste CREATE TABLE statements (and optional ALTER TABLE foreign keys). Tables are
              added to the canvas without replacing what you already have.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-1">
            <Label htmlFor="import-sql">SQL</Label>
            <Textarea
              id="import-sql"
              value={importSqlText}
              onChange={(e) => setImportSqlText(e.target.value)}
              placeholder={`CREATE TABLE "users" (\n  "id" UUID,\n  "email" VARCHAR(255),\n  PRIMARY KEY ("id")\n);`}
              className="min-h-[220px] font-mono text-xs"
              disabled={importing}
            />
            {importError && (
              <p className="text-sm text-destructive" role="alert">
                {importError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setImportOpen(false)}
              disabled={importing}
            >
              Cancel
            </Button>
            <Button type="button" onClick={() => void handleImportSql()} disabled={importing}>
              {importing ? 'Importing…' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {exportFormat === 'prisma'
                ? 'Exported Prisma schema'
                : exportFormat === 'sql'
                  ? 'Exported SQL'
                  : `Export ${exportFormat.toUpperCase()}`}
            </DialogTitle>
            <DialogDescription>
              {exportFormat === 'prisma'
                ? 'Prisma model blocks for each table, with relations derived from foreign-key edges (source column → referenced column).'
                : exportFormat === 'sql'
                  ? 'CREATE TABLE statements for each table, plus ALTER TABLE foreign keys for each relationship (source column → referenced column).'
                  : 'Downloads the full diagram (all tables and relations), independent of the current canvas zoom or pan.'}
            </DialogDescription>
          </DialogHeader>
          <Tabs
            value={exportFormat}
            onValueChange={(value) => {
              setExportFormat(value as ExportFormat);
              setCopied(false);
            }}
          >
            <TabsList className="flex h-auto flex-wrap gap-1">
              <TabsTrigger value="sql">SQL</TabsTrigger>
              <TabsTrigger value="prisma">Prisma</TabsTrigger>
              <TabsTrigger value="png">PNG</TabsTrigger>
              <TabsTrigger value="svg">SVG</TabsTrigger>
              <TabsTrigger value="jpeg">JPEG</TabsTrigger>
            </TabsList>
          </Tabs>
          {!isImageExportFormat(exportFormat) ? (
            <pre className="max-h-[50vh] overflow-auto rounded-md border border-border bg-muted/40 p-4 text-xs leading-relaxed">
              <code>{exportText}</code>
            </pre>
          ) : (
            <div className="rounded-md border border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
              Download a white-background image of the full diagram at {EXPORT_IMAGE_WIDTH}×
              {EXPORT_IMAGE_HEIGHT}px.
            </div>
          )}
          <DialogFooter>
            {!isImageExportFormat(exportFormat) ? (
              <Button type="button" variant="outline" onClick={copyExport}>
                <Copy className="h-4 w-4" />
                {copied ? 'Copied' : 'Copy to Clipboard'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => void handleExportImage(exportFormat)}
                disabled={exportingImage}
              >
                <ImageDown className="h-4 w-4" />
                {exportingImage ? 'Exporting…' : 'Download'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {nameDialogMode === 'cloud-sync' ? 'Name before syncing' : 'Save diagram'}
            </DialogTitle>
            <DialogDescription>
              {nameDialogMode === 'cloud-sync'
                ? 'Save this diagram locally, then sync it to the cloud.'
                : 'Choose a name for this diagram. Saved in this browser.'}
            </DialogDescription>
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
                  void handleConfirmNameSave();
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
            <Button type="button" onClick={() => void handleConfirmNameSave()} disabled={saving || syncing}>
              {saving || syncing
                ? nameDialogMode === 'cloud-sync'
                  ? 'Syncing…'
                  : 'Saving…'
                : nameDialogMode === 'cloud-sync'
                  ? 'Save & Sync'
                  : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={cloudPrompt !== null}
        onOpenChange={(open) => {
          if (!open) setCloudPrompt(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cloud Sync</DialogTitle>
            <DialogDescription>
              {cloudPrompt === 'login'
                ? 'Log in to sync your diagrams across devices.'
                : 'Cloud sync is a premium feature. Upgrade to sync diagrams across devices.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCloudPrompt(null)}>
              Cancel
            </Button>
            {cloudPrompt === 'login' ? (
              <Button type="button" asChild>
                <Link to="/login">Log in</Link>
              </Button>
            ) : (
              <Button type="button" asChild>
                <Link to="/dashboard">Upgrade</Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={myDiagramsOpen} onOpenChange={setMyDiagramsOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>My Diagrams</SheetTitle>
            <SheetDescription>
              Local diagrams stay in this browser. Cloud diagrams sync across devices for premium
              accounts.
            </SheetDescription>
          </SheetHeader>
          <Tabs
            value={diagramsTab}
            onValueChange={(value) => {
              const next = value === 'cloud' ? 'cloud' : 'local';
              setDiagramsTab(next);
              if (next === 'cloud') {
                void loadCloudDiagrams();
              } else {
                void loadDiagrams();
              }
            }}
            className="mt-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="local">Local</TabsTrigger>
              <TabsTrigger value="cloud">Cloud</TabsTrigger>
            </TabsList>
            <TabsContent value="local" className="mt-4 space-y-2">
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
                      <div className="truncate text-sm font-medium text-foreground">
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Updated {new Date(item.updatedAt).toLocaleString()}
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
            </TabsContent>
            <TabsContent value="cloud" className="mt-4 space-y-2">
              {cloudListGate === 'login' && (
                <div className="space-y-3 rounded-md border border-border px-3 py-4">
                  <p className="text-sm text-muted-foreground">
                    Log in to see your synced diagrams.
                  </p>
                  <Button type="button" asChild>
                    <Link to="/login">Log in</Link>
                  </Button>
                </div>
              )}
              {cloudListGate === 'upgrade' && (
                <div className="space-y-3 rounded-md border border-border px-3 py-4">
                  <p className="text-sm text-muted-foreground">
                    Cloud sync is a premium feature. Upgrade to sync diagrams across devices.
                  </p>
                  <Button type="button" asChild>
                    <Link to="/dashboard">Upgrade</Link>
                  </Button>
                </div>
              )}
              {cloudListGate === 'ready' && cloudDiagramsLoading && (
                <p className="text-sm text-muted-foreground">Loading diagrams…</p>
              )}
              {cloudListGate === 'ready' && !cloudDiagramsLoading && cloudDiagrams.length === 0 && (
                <p className="text-sm text-muted-foreground">No synced diagrams yet.</p>
              )}
              {cloudListGate === 'ready' &&
                !cloudDiagramsLoading &&
                cloudDiagrams.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 rounded-md border border-border px-3 py-2"
                  >
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => void handleLoadCloudDiagram(item)}
                    >
                      <div className="truncate text-sm font-medium text-foreground">
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Updated{' '}
                        {item.updated_at
                          ? new Date(item.updated_at).toLocaleString()
                          : '—'}
                      </div>
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${item.name}`}
                      onClick={() => void handleDeleteCloudDiagram(item)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
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
