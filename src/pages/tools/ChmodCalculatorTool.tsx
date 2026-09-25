import { useState, useCallback, useMemo } from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props {
  tool: ToolConfig;
}

type PermBits = {
  owner: { r: boolean; w: boolean; x: boolean };
  group: { r: boolean; w: boolean; x: boolean };
  others: { r: boolean; w: boolean; x: boolean };
  special: { setuid: boolean; setgid: boolean; sticky: boolean };
};

const PRESETS = [644, 755, 600, 700, 400, 777] as const;

function bitsToOctal(p: PermBits): string {
  const special =
    (p.special.setuid ? 4 : 0) + (p.special.setgid ? 2 : 0) + (p.special.sticky ? 1 : 0);
  const triplet = (r: boolean, w: boolean, x: boolean) =>
    (r ? 4 : 0) + (w ? 2 : 0) + (x ? 1 : 0);
  const o = triplet(p.owner.r, p.owner.w, p.owner.x);
  const g = triplet(p.group.r, p.group.w, p.group.x);
  const t = triplet(p.others.r, p.others.w, p.others.x);
  if (special > 0) return `${special}${o}${g}${t}`;
  return `${o}${g}${t}`;
}

function octalToBits(octal: string): PermBits | null {
  const cleaned = octal.replace(/\s/g, '');
  if (!/^\d{3,4}$/.test(cleaned)) return null;
  let special = 0;
  let o: number, g: number, t: number;
  if (cleaned.length === 4) {
    special = parseInt(cleaned[0], 10);
    o = parseInt(cleaned[1], 10);
    g = parseInt(cleaned[2], 10);
    t = parseInt(cleaned[3], 10);
    if (special > 7 || o > 7 || g > 7 || t > 7) return null;
  } else {
    o = parseInt(cleaned[0], 10);
    g = parseInt(cleaned[1], 10);
    t = parseInt(cleaned[2], 10);
    if (o > 7 || g > 7 || t > 7) return null;
  }
  const fromDigit = (d: number) => ({
    r: (d & 4) !== 0,
    w: (d & 2) !== 0,
    x: (d & 1) !== 0,
  });
  return {
    owner: fromDigit(o),
    group: fromDigit(g),
    others: fromDigit(t),
    special: {
      setuid: (special & 4) !== 0,
      setgid: (special & 2) !== 0,
      sticky: (special & 1) !== 0,
    },
  };
}

function bitsToSymbolic(p: PermBits): string {
  const char = (r: boolean, w: boolean, x: boolean, special: 'setuid' | 'setgid' | 'sticky' | null) => {
    let c = `${r ? 'r' : '-'}${w ? 'w' : '-'}${x ? 'x' : '-'}`;
    if (special === 'setuid' && p.special.setuid) {
      c = `${r ? 'r' : '-'}${w ? 'w' : '-'}${x ? 's' : 'S'}`;
    }
    if (special === 'setgid' && p.special.setgid) {
      c = `${r ? 'r' : '-'}${w ? 'w' : '-'}${x ? 's' : 'S'}`;
    }
    if (special === 'sticky' && p.special.sticky) {
      c = `${r ? 'r' : '-'}${w ? 'w' : '-'}${x ? 't' : 'T'}`;
    }
    return c;
  };
  return (
    char(p.owner.r, p.owner.w, p.owner.x, 'setuid') +
    char(p.group.r, p.group.w, p.group.x, 'setgid') +
    char(p.others.r, p.others.w, p.others.x, 'sticky')
  );
}

function symbolicToBits(sym: string): PermBits | null {
  const s = sym.trim();
  if (!/^[rwxsStT-]{9}$/.test(s)) return null;
  const parseTriplet = (chunk: string, special: 'setuid' | 'setgid' | 'sticky') => {
    const r = chunk[0] === 'r';
    const w = chunk[1] === 'w';
    const x = chunk[2] === 'x' || chunk[2] === 's' || chunk[2] === 't';
    let sp = false;
    if (special === 'setuid' && (chunk[2] === 's' || chunk[2] === 'S')) sp = true;
    if (special === 'setgid' && (chunk[2] === 's' || chunk[2] === 'S')) sp = true;
    if (special === 'sticky' && (chunk[2] === 't' || chunk[2] === 'T')) sp = true;
    return { r, w, x, sp };
  };
  const o = parseTriplet(s.slice(0, 3), 'setuid');
  const g = parseTriplet(s.slice(3, 6), 'setgid');
  const t = parseTriplet(s.slice(6, 9), 'sticky');
  return {
    owner: { r: o.r, w: o.w, x: o.x },
    group: { r: g.r, w: g.w, x: g.x },
    others: { r: t.r, w: t.w, x: t.x },
    special: { setuid: o.sp, setgid: g.sp, sticky: t.sp },
  };
}

function bitsToSymbolicCommand(p: PermBits): string {
  const part = (label: string, r: boolean, w: boolean, x: boolean) => {
    const chars = `${r ? 'r' : ''}${w ? 'w' : ''}${x ? 'x' : ''}`;
    return `${label}=${chars || '-'}`;
  };
  return `chmod ${part('u', p.owner.r, p.owner.w, p.owner.x)},${part('g', p.group.r, p.group.w, p.group.x)},${part('o', p.others.r, p.others.w, p.others.x)} filename`;
}

const DEFAULT_BITS: PermBits = {
  owner: { r: true, w: true, x: true },
  group: { r: true, w: false, x: true },
  others: { r: true, w: false, x: true },
  special: { setuid: false, setgid: false, sticky: false },
};

export function ChmodCalculatorTool({ tool }: Props) {
  const [perms, setPerms] = useState<PermBits>(DEFAULT_BITS);
  const [octalInput, setOctalInput] = useState('755');
  const [symbolicInput, setSymbolicInput] = useState('rwxr-xr-x');
  const [octalError, setOctalError] = useState('');
  const [symbolicError, setSymbolicError] = useState('');

  const syncFromPerms = useCallback((p: PermBits) => {
    const oct = bitsToOctal(p);
    const sym = bitsToSymbolic(p);
    setOctalInput(oct);
    setSymbolicInput(sym);
    setOctalError('');
    setSymbolicError('');
  }, []);

  const applyPerms = useCallback(
    (p: PermBits) => {
      setPerms(p);
      syncFromPerms(p);
      trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'update' });
    },
    [syncFromPerms, tool.slug],
  );

  const toggle = (
    section: 'owner' | 'group' | 'others',
    bit: 'r' | 'w' | 'x',
  ) => {
    const next = {
      ...perms,
      [section]: { ...perms[section], [bit]: !perms[section][bit] },
    };
    applyPerms(next);
  };

  const toggleSpecial = (bit: 'setuid' | 'setgid' | 'sticky') => {
    const next = {
      ...perms,
      special: { ...perms.special, [bit]: !perms.special[bit] },
    };
    applyPerms(next);
  };

  const handleOctalChange = (value: string) => {
    setOctalInput(value);
    const parsed = octalToBits(value);
    if (!parsed) {
      setOctalError('Enter a valid 3- or 4-digit octal mode (digits 0–7 only).');
      return;
    }
    setOctalError('');
    setPerms(parsed);
    setSymbolicInput(bitsToSymbolic(parsed));
    setSymbolicError('');
  };

  const handleSymbolicChange = (value: string) => {
    setSymbolicInput(value);
    const parsed = symbolicToBits(value);
    if (!parsed) {
      setSymbolicError('Enter 9 characters: r, w, x, -, s, S, t, or T (e.g. rwxr-xr-x).');
      return;
    }
    setSymbolicError('');
    setPerms(parsed);
    setOctalInput(bitsToOctal(parsed));
    setOctalError('');
  };

  const octalOut = useMemo(() => bitsToOctal(perms), [perms]);
  const symbolicOut = useMemo(() => bitsToSymbolic(perms), [perms]);
  const chmodCmd = `chmod ${octalOut} filename`;
  const symCmd = bitsToSymbolicCommand(perms);

  const worldWritable = perms.others.w;

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
    trackEvent({ type: 'copy_result', slug: tool.slug });
  };

  const OutputRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-input bg-muted/30 px-3 py-2">
      <div className="min-w-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        <p className="font-code text-sm text-foreground truncate">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => copy(value)}
        className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <Copy className="h-3 w-3" /> Copy
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Permissions</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-input rounded-lg">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-2 text-left font-medium" />
                <th className="p-2 text-center font-medium">Read (4)</th>
                <th className="p-2 text-center font-medium">Write (2)</th>
                <th className="p-2 text-center font-medium">Execute (1)</th>
              </tr>
            </thead>
            <tbody>
              {(['owner', 'group', 'others'] as const).map(row => (
                <tr key={row} className="border-t border-input">
                  <td className="p-2 font-medium capitalize">{row}</td>
                  {(['r', 'w', 'x'] as const).map(bit => (
                    <td key={bit} className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={perms[row][bit]}
                        onChange={() => toggle(row, bit)}
                        className="h-4 w-4 rounded border-input"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-2">Special bits</p>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={perms.special.setuid}
              onChange={() => toggleSpecial('setuid')}
              className="h-4 w-4 rounded border-input"
            />
            setuid (4)
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={perms.special.setgid}
              onChange={() => toggleSpecial('setgid')}
              className="h-4 w-4 rounded border-input"
            />
            setgid (2)
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={perms.special.sticky}
              onChange={() => toggleSpecial('sticky')}
              className="h-4 w-4 rounded border-input"
            />
            sticky (1)
          </label>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Octal</label>
          <input
            value={octalInput}
            onChange={e => handleOctalChange(e.target.value)}
            placeholder="755 or 4755"
            className="font-code w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
          {octalError && <p className="mt-1 text-xs text-destructive">{octalError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Symbolic</label>
          <input
            value={symbolicInput}
            onChange={e => handleSymbolicChange(e.target.value)}
            placeholder="rwxr-xr-x"
            className="font-code w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
          {symbolicError && <p className="mt-1 text-xs text-destructive">{symbolicError}</p>}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-2">Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                const parsed = octalToBits(String(mode));
                if (parsed) applyPerms(parsed);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                octalOut === String(mode) || octalOut.endsWith(String(mode))
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {worldWritable && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/40 p-3 text-sm text-amber-900 dark:text-amber-200">
          Warning: others have write permission (e.g. mode 777). World-writable files are a security risk — avoid this on production servers.
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Output</p>
        <OutputRow label="Octal" value={octalOut} />
        <OutputRow label="Symbolic" value={symbolicOut} />
        <OutputRow label="Command" value={chmodCmd} />
        <OutputRow label="Symbolic command" value={symCmd} />
      </div>
    </div>
  );
}
