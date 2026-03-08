import { useState, useCallback } from 'react';
import { Copy, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { timestampToDate, dateToTimestamp } from '@/utils/tool-logic';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props {
  tool: ToolConfig;
}

export function TimestampConverterTool({ tool }: Props) {
  const [tsInput, setTsInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [tsOutput, setTsOutput] = useState('');
  const [dateOutput, setDateOutput] = useState('');
  const [tsError, setTsError] = useState('');
  const [dateError, setDateError] = useState('');

  const handleTimestampToDate = useCallback(() => {
    setTsError('');
    setTsOutput('');
    try {
      setTsOutput(timestampToDate(tsInput));
    } catch (e: any) {
      setTsError(e.message);
    }
  }, [tsInput]);

  const handleDateToTimestamp = useCallback(() => {
    setDateError('');
    setDateOutput('');
    try {
      setDateOutput(dateToTimestamp(dateInput));
    } catch (e: any) {
      setDateError(e.message);
    }
  }, [dateInput]);

  const handleNow = () => {
    const now = Math.floor(Date.now() / 1000);
    setTsInput(String(now));
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-8">
      {/* Timestamp to Date */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Timestamp → Date</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            value={tsInput}
            onChange={e => setTsInput(e.target.value)}
            placeholder="Enter Unix timestamp (e.g., 1700000000)"
            className="font-code flex-1 min-w-[200px] rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button onClick={handleNow} className="px-3 py-2.5 rounded-lg border border-input bg-background text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Now
          </button>
          <button onClick={handleTimestampToDate} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
            Convert
          </button>
        </div>
        {tsError && <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">{tsError}</div>}
        {tsOutput && (
          <div className="relative">
            <pre className="font-code text-sm bg-muted/50 rounded-lg p-4 border border-input text-foreground whitespace-pre-wrap">{tsOutput}</pre>
            <button onClick={() => handleCopy(tsOutput)} className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-muted transition-colors">
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-border" />

      {/* Date to Timestamp */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Date → Timestamp</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            value={dateInput}
            onChange={e => setDateInput(e.target.value)}
            placeholder='Enter date (e.g., 2024-01-15 or "Jan 15, 2024")'
            className="font-code flex-1 min-w-[200px] rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button onClick={handleDateToTimestamp} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
            Convert
          </button>
        </div>
        {dateError && <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">{dateError}</div>}
        {dateOutput && (
          <div className="relative">
            <pre className="font-code text-sm bg-muted/50 rounded-lg p-4 border border-input text-foreground whitespace-pre-wrap">{dateOutput}</pre>
            <button onClick={() => handleCopy(dateOutput)} className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-muted transition-colors">
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
