import { useEffect, useState } from 'react';
import type { Edge } from '@xyflow/react';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  generateSchemaFromPrompt,
  schemaToNodesAndEdges,
} from '@/lib/aiSchemaGenerator';
import type { TableFlowNode } from '@/components/db-builder/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const STORAGE_KEY = 'gadgetsurge_ai_agent_config';

const PROVIDERS = [{ value: 'openai', label: 'OpenAI' }] as const;

const OPENAI_MODELS = [
  { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
  { value: 'gpt-4o', label: 'gpt-4o' },
  { value: 'gpt-4.1-mini', label: 'gpt-4.1-mini' },
] as const;

type AiProvider = (typeof PROVIDERS)[number]['value'];

type AiAgentConfig = {
  provider: AiProvider;
  apiKey: string;
  model: string;
};

type AiAgentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingNodeCount: number;
  onApply: (nodes: TableFlowNode[], edges: Edge[]) => void;
};

function loadConfig(): AiAgentConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AiAgentConfig>;
    if (
      typeof parsed.apiKey !== 'string' ||
      !parsed.apiKey.trim() ||
      typeof parsed.provider !== 'string' ||
      typeof parsed.model !== 'string'
    ) {
      return null;
    }
    return {
      provider: 'openai',
      apiKey: parsed.apiKey,
      model: parsed.model,
    };
  } catch {
    return null;
  }
}

function saveConfig(config: AiAgentConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function AiAgentDialog({
  open,
  onOpenChange,
  existingNodeCount,
  onApply,
}: AiAgentDialogProps) {
  const [config, setConfig] = useState<AiAgentConfig | null>(null);
  const [editingKey, setEditingKey] = useState(false);
  const [provider, setProvider] = useState<AiProvider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState<string>(OPENAI_MODELS[0].value);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!open) return;
    const stored = loadConfig();
    setConfig(stored);
    setEditingKey(!stored);
    setError(null);
    if (stored) {
      setProvider(stored.provider);
      setApiKey(stored.apiKey);
      setModel(stored.model);
    } else {
      setProvider('openai');
      setApiKey('');
      setModel(OPENAI_MODELS[0].value);
    }
  }, [open]);

  const showKeyForm = editingKey || !config;

  const handleSaveKey = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setError('Enter your OpenAI API key.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const next: AiAgentConfig = {
        provider,
        apiKey: trimmed,
        model,
      };
      saveConfig(next);
      setConfig(next);
      setEditingKey(false);
      toast.success('API key saved locally');
    } catch {
      setError('Could not save API key to localStorage.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!config) {
      setEditingKey(true);
      setError('Save an API key before generating.');
      return;
    }

    setGenerating(true);
    setError(null);
    try {
      const schema = await generateSchemaFromPrompt(prompt, config.apiKey, config.model);
      const { nodes, edges } = schemaToNodesAndEdges(schema, existingNodeCount);
      if (nodes.length === 0) {
        throw new Error('No tables were generated. Try a more specific prompt.');
      }
      onApply(nodes, edges);
      onOpenChange(false);
      toast.success(
        `Added ${nodes.length} table${nodes.length === 1 ? '' : 's'}${
          edges.length > 0
            ? ` and ${edges.length} relation${edges.length === 1 ? '' : 's'}`
            : ''
        }`,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate schema.';
      setError(message);
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Agent
          </DialogTitle>
          <DialogDescription>
            {showKeyForm
              ? 'Bring Your Own Key — your API key is stored locally in this browser and never sent to our servers. Requests go directly from your browser to OpenAI.'
              : 'Describe the database you want. Tables and relationships will be added to the canvas.'}
          </DialogDescription>
        </DialogHeader>

        {showKeyForm ? (
          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="ai-provider">Provider</Label>
              <Select
                value={provider}
                onValueChange={(value) => setProvider(value as AiProvider)}
              >
                <SelectTrigger id="ai-provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDERS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-api-key">API key</Label>
              <Input
                id="ai-api-key"
                type="password"
                autoComplete="off"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-model">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="ai-model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {OPENAI_MODELS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter className="gap-2 sm:gap-0">
              {config && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingKey(false);
                    setError(null);
                    setApiKey(config.apiKey);
                    setProvider(config.provider);
                    setModel(config.model);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="button" onClick={handleSaveKey} disabled={saving}>
                {saving ? 'Saving…' : 'Save Key & Start'}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="ai-schema-prompt">Describe your schema</Label>
              <Textarea
                id="ai-schema-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="an e-commerce app with users, orders, products"
                className="min-h-[120px]"
                disabled={generating}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button
                type="button"
                variant="link"
                className="h-auto px-0 text-xs text-muted-foreground"
                onClick={() => {
                  setEditingKey(true);
                  setError(null);
                }}
                disabled={generating}
              >
                Change API Key
              </Button>
              <Button type="button" onClick={() => void handleGenerate()} disabled={generating}>
                <Sparkles className="h-4 w-4" />
                {generating ? 'Generating…' : 'Generate'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
