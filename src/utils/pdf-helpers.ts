export function formatBytes(b: number): string {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(2) + ' MB';
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function parsePdfError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/encrypt|password/i.test(msg)) {
    return 'This PDF is password-protected. Remove the password and try again.';
  }
  if (/invalid|corrupt|parse/i.test(msg)) {
    return 'Could not read PDF. The file may be corrupted or not a valid PDF.';
  }
  return msg || 'An error occurred while processing the PDF.';
}

/** Parse page spec like "2, 5, 7-9" into sorted unique 1-based page numbers. */
export function parsePageList(input: string, totalPages: number): number[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const pages = new Set<number>();
  const parts = trimmed.split(',').map(p => p.trim()).filter(Boolean);

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (start > end) throw new Error(`Invalid range "${part}": start must be ≤ end.`);
      for (let i = start; i <= end; i++) pages.add(i);
    } else if (/^\d+$/.test(part)) {
      pages.add(parseInt(part, 10));
    } else {
      throw new Error(`Invalid page specification: "${part}". Use numbers or ranges like 2, 5, 7-9.`);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);
  for (const p of sorted) {
    if (p < 1 || p > totalPages) {
      throw new Error(`Page ${p} is out of range. This PDF has ${totalPages} page${totalPages !== 1 ? 's' : ''}.`);
    }
  }
  return sorted;
}

/** Parse split ranges like "1-3, 5-7" into array of [start, end] pairs (1-based, inclusive). */
export function parsePageRanges(input: string, totalPages: number): Array<[number, number]> {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Enter page ranges like 1-3, 5-7.');

  const ranges: Array<[number, number]> = [];
  const parts = trimmed.split(',').map(p => p.trim()).filter(Boolean);

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    const singleMatch = part.match(/^(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (start > end) throw new Error(`Invalid range "${part}": start must be ≤ end.`);
      if (start < 1 || end > totalPages) {
        throw new Error(`Range ${part} is out of bounds (1–${totalPages}).`);
      }
      ranges.push([start, end]);
    } else if (singleMatch) {
      const page = parseInt(singleMatch[1], 10);
      if (page < 1 || page > totalPages) {
        throw new Error(`Page ${page} is out of bounds (1–${totalPages}).`);
      }
      ranges.push([page, page]);
    } else {
      throw new Error(`Invalid range: "${part}". Use formats like 1-3 or 5.`);
    }
  }
  return ranges;
}
