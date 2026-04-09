/**
 * Regenerates scripts/toolContentData.mjs from src/lib/toolContentMap.ts
 * so prerender stays in sync. Run after editing toolContentMap.ts:
 *   node scripts/sync-tool-content-data.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const ts = readFileSync(resolve(root, 'src/lib/toolContentMap.ts'), 'utf8');
const start = ts.indexOf('export const toolContentMap');
if (start < 0) throw new Error('toolContentMap not found in toolContentMap.ts');
const eq = ts.indexOf('=', start);
const brace = ts.indexOf('{', eq);
let depth = 0;
let i = brace;
for (; i < ts.length; i++) {
  const c = ts[i];
  if (c === '{') depth++;
  else if (c === '}') {
    depth--;
    if (depth === 0) {
      i++;
      break;
    }
  }
}
const obj = ts.slice(brace, i);
const out =
  '/** Auto-generated from src/lib/toolContentMap.ts — do not edit by hand. Run: node scripts/sync-tool-content-data.mjs */\n' +
  'export const toolContentMap = ' +
  obj +
  ';\n';
writeFileSync(resolve(__dirname, 'toolContentData.mjs'), out);
console.log('Wrote scripts/toolContentData.mjs');
