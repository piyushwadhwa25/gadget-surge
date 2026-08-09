import type { Edge } from '@xyflow/react';
import { createColumn } from '@/components/db-builder/TableNode';
import {
  SQL_TYPES,
  columnSourceHandleId,
  columnTargetHandleId,
  type SqlType,
  type TableFlowNode,
} from '@/components/db-builder/types';

export type GeneratedColumn = {
  name: string;
  type: string;
  isPrimaryKey: boolean;
};

export type GeneratedTable = {
  name: string;
  columns: GeneratedColumn[];
};

export type GeneratedRelationship = {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
};

export type GeneratedSchema = {
  tables: GeneratedTable[];
  relationships: GeneratedRelationship[];
};

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';

const SQL_TYPE_LIST = SQL_TYPES.join(', ');

const SYSTEM_PROMPT = `You are a database schema designer. Given a plain-English description of an application or domain, produce a relational schema as JSON.

Rules:
- Use only these SQL column types: ${SQL_TYPE_LIST}
- Every table must have exactly one primary key column (usually named "id" with type UUID)
- Prefer UUID for primary keys
- Foreign key columns should use the same type as the referenced primary key (usually UUID)
- Use clear snake_case table and column names
- Include sensible relationships between tables
- Do not invent types outside the allowed list`;

const RESPONSE_JSON_SCHEMA = {
  name: 'database_schema',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      tables: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            columns: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: {
                    type: 'string',
                    enum: [...SQL_TYPES],
                  },
                  isPrimaryKey: { type: 'boolean' },
                },
                required: ['name', 'type', 'isPrimaryKey'],
                additionalProperties: false,
              },
            },
          },
          required: ['name', 'columns'],
          additionalProperties: false,
        },
      },
      relationships: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fromTable: { type: 'string' },
            fromColumn: { type: 'string' },
            toTable: { type: 'string' },
            toColumn: { type: 'string' },
          },
          required: ['fromTable', 'fromColumn', 'toTable', 'toColumn'],
          additionalProperties: false,
        },
      },
    },
    required: ['tables', 'relationships'],
    additionalProperties: false,
  },
} as const;

export type NormalizeSqlTypeResult = {
  type: SqlType;
  /** True when the raw type was unrecognized and mapped to the default VARCHAR(255). */
  usedFallback: boolean;
};

/**
 * Maps a raw SQL type string onto the builder's SqlType union.
 * Explicit aliases (INT → INTEGER, CHAR(n) → VARCHAR(255), etc.) are not fallbacks;
 * only truly unrecognized types set usedFallback.
 */
export function normalizeSqlTypeDetailed(raw: string): NormalizeSqlTypeResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { type: 'VARCHAR(255)', usedFallback: true };
  }

  const exact = SQL_TYPES.find((t) => t === trimmed);
  if (exact) return { type: exact, usedFallback: false };

  const upper = trimmed.toUpperCase();
  const byUpper = SQL_TYPES.find((t) => t.toUpperCase() === upper);
  if (byUpper) return { type: byUpper, usedFallback: false };

  // Character / string families (order matters: CHARACTER VARYING before CHAR)
  if (
    upper.startsWith('VARCHAR') ||
    upper.startsWith('CHARACTER VARYING') ||
    upper.startsWith('NVARCHAR')
  ) {
    return { type: 'VARCHAR(255)', usedFallback: false };
  }
  if (
    upper === 'CHAR' ||
    upper.startsWith('CHAR(') ||
    upper === 'CHARACTER' ||
    upper.startsWith('CHARACTER(') ||
    upper === 'NCHAR' ||
    upper.startsWith('NCHAR(') ||
    upper === 'STRING'
  ) {
    return { type: 'VARCHAR(255)', usedFallback: false };
  }

  // Integer family
  if (
    upper === 'INT' ||
    upper === 'INT2' ||
    upper === 'INT4' ||
    upper === 'INT8' ||
    upper === 'TINYINT' ||
    upper === 'SMALLINT' ||
    upper === 'MEDIUMINT' ||
    upper === 'BIGINT' ||
    upper === 'SERIAL' ||
    upper === 'SMALLSERIAL' ||
    upper === 'BIGSERIAL' ||
    upper.startsWith('INT(') ||
    upper.startsWith('INTEGER(')
  ) {
    return { type: 'INTEGER', usedFallback: false };
  }

  // Boolean
  if (upper === 'BOOL') {
    return { type: 'BOOLEAN', usedFallback: false };
  }

  // Temporal
  if (
    upper === 'DATETIME' ||
    upper === 'DATE' ||
    upper === 'TIME' ||
    upper.startsWith('TIMESTAMP') ||
    upper.startsWith('TIMESTAMPTZ')
  ) {
    return { type: 'TIMESTAMP', usedFallback: false };
  }

  // Numeric / floating
  if (
    upper === 'NUMERIC' ||
    upper.startsWith('NUMERIC(') ||
    upper === 'FLOAT' ||
    upper.startsWith('FLOAT(') ||
    upper === 'DOUBLE' ||
    upper.startsWith('DOUBLE') ||
    upper === 'REAL' ||
    upper.startsWith('DECIMAL')
  ) {
    return { type: 'DECIMAL', usedFallback: false };
  }

  // TEXT-family variants (exact TEXT already handled above)
  if (
    upper === 'TINYTEXT' ||
    upper === 'MEDIUMTEXT' ||
    upper === 'LONGTEXT' ||
    upper === 'CLOB' ||
    upper.startsWith('TEXT(')
  ) {
    return { type: 'TEXT', usedFallback: false };
  }

  // UUID-ish
  if (upper === 'UNIQUEIDENTIFIER' || upper === 'GUID') {
    return { type: 'UUID', usedFallback: false };
  }

  return { type: 'VARCHAR(255)', usedFallback: true };
}

export function normalizeSqlType(raw: string): SqlType {
  return normalizeSqlTypeDetailed(raw).type;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseGeneratedSchema(value: unknown): GeneratedSchema {
  if (!isRecord(value)) {
    throw new Error('Schema response was not a JSON object.');
  }

  if (!Array.isArray(value.tables) || !Array.isArray(value.relationships)) {
    throw new Error('Schema response must include tables and relationships arrays.');
  }

  const tables: GeneratedTable[] = value.tables.map((table, tableIndex) => {
    if (!isRecord(table)) {
      throw new Error(`Table at index ${tableIndex} is invalid.`);
    }
    const name = typeof table.name === 'string' ? table.name.trim() : '';
    if (!name) {
      throw new Error(`Table at index ${tableIndex} is missing a name.`);
    }
    if (!Array.isArray(table.columns) || table.columns.length === 0) {
      throw new Error(`Table "${name}" must include at least one column.`);
    }

    const columns: GeneratedColumn[] = table.columns.map((col, colIndex) => {
      if (!isRecord(col)) {
        throw new Error(`Column at index ${colIndex} in table "${name}" is invalid.`);
      }
      const colName = typeof col.name === 'string' ? col.name.trim() : '';
      if (!colName) {
        throw new Error(`Column at index ${colIndex} in table "${name}" is missing a name.`);
      }
      const type = typeof col.type === 'string' ? col.type : 'VARCHAR(255)';
      return {
        name: colName,
        type,
        isPrimaryKey: col.isPrimaryKey === true,
      };
    });

    return { name, columns };
  });

  const relationships: GeneratedRelationship[] = value.relationships.map((rel, relIndex) => {
    if (!isRecord(rel)) {
      throw new Error(`Relationship at index ${relIndex} is invalid.`);
    }
    const fromTable = typeof rel.fromTable === 'string' ? rel.fromTable.trim() : '';
    const fromColumn = typeof rel.fromColumn === 'string' ? rel.fromColumn.trim() : '';
    const toTable = typeof rel.toTable === 'string' ? rel.toTable.trim() : '';
    const toColumn = typeof rel.toColumn === 'string' ? rel.toColumn.trim() : '';
    if (!fromTable || !fromColumn || !toTable || !toColumn) {
      throw new Error(`Relationship at index ${relIndex} is missing required fields.`);
    }
    return { fromTable, fromColumn, toTable, toColumn };
  });

  if (tables.length === 0) {
    throw new Error('Schema response contained no tables.');
  }

  return { tables, relationships };
}

async function readOpenAiError(response: Response): Promise<string> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // ignore parse errors; fall through to status-based messages
  }

  const apiMessage =
    isRecord(body) &&
    isRecord(body.error) &&
    typeof body.error.message === 'string' &&
    body.error.message
      ? body.error.message
      : null;

  if (response.status === 401) {
    return (
      apiMessage ||
      'Invalid or expired API key. Use “Change API Key” to update it, then try again.'
    );
  }

  if (response.status === 429) {
    return (
      apiMessage ||
      'OpenAI rate limit or quota exceeded. Check your plan and billing, then retry.'
    );
  }

  return apiMessage || `OpenAI request failed (${response.status}).`;
}

/**
 * Calls OpenAI Chat Completions from the browser with structured JSON schema output.
 * The API key is sent only to api.openai.com.
 */
export async function generateSchemaFromPrompt(
  prompt: string,
  apiKey: string,
  model: string,
): Promise<GeneratedSchema> {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    throw new Error('Enter a description of the schema you want to generate.');
  }
  if (!apiKey.trim()) {
    throw new Error('API key is missing. Use “Change API Key” to add one.');
  }

  let response: Response;
  try {
    response = await fetch(OPENAI_CHAT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Design a database schema for:\n\n${trimmedPrompt}`,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: RESPONSE_JSON_SCHEMA,
        },
      }),
    });
  } catch {
    throw new Error('Could not reach OpenAI. Check your network connection and try again.');
  }

  if (!response.ok) {
    throw new Error(await readOpenAiError(response));
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error('OpenAI returned a non-JSON response.');
  }

  if (!isRecord(payload) || !Array.isArray(payload.choices) || payload.choices.length === 0) {
    throw new Error('OpenAI response was missing choices.');
  }

  const firstChoice = payload.choices[0];
  if (!isRecord(firstChoice) || !isRecord(firstChoice.message)) {
    throw new Error('OpenAI response choice was malformed.');
  }

  if (typeof firstChoice.message.refusal === 'string' && firstChoice.message.refusal) {
    throw new Error(firstChoice.message.refusal);
  }

  const content = firstChoice.message.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('OpenAI returned an empty schema response.');
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(content);
  } catch {
    throw new Error('Failed to parse schema JSON from the model response.');
  }

  try {
    return parseGeneratedSchema(parsedJson);
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? `Invalid schema shape: ${err.message}`
        : 'Invalid schema shape in the model response.',
    );
  }
}

function tableKey(name: string): string {
  return name.trim().toLowerCase();
}

function columnKey(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Converts a generated schema into React Flow table nodes and FK edges,
 * matching createTableNode / onConnect conventions.
 */
export function schemaToNodesAndEdges(
  schema: GeneratedSchema,
  existingNodeCount = 0,
): { nodes: TableFlowNode[]; edges: Edge[] } {
  const gridCols = 3;
  const colWidth = 380;
  const rowHeight = 300;
  const originOffset = existingNodeCount;

  const nodes: TableFlowNode[] = [];
  const columnIdByTableAndColumn = new Map<string, string>();
  const nodeIdByTable = new Map<string, string>();

  schema.tables.forEach((table, index) => {
    const layoutIndex = originOffset + index;
    const columns = table.columns.map((col) =>
      createColumn({
        name: col.name,
        type: normalizeSqlType(col.type),
        isPrimaryKey: col.isPrimaryKey,
      }),
    );

    const node: TableFlowNode = {
      id: crypto.randomUUID(),
      type: 'table',
      position: {
        x: 80 + (layoutIndex % gridCols) * colWidth,
        y: 80 + Math.floor(layoutIndex / gridCols) * rowHeight,
      },
      data: {
        tableName: table.name,
        columns,
        isCollapsed: false,
      },
    };

    nodes.push(node);
    nodeIdByTable.set(tableKey(table.name), node.id);
    for (const col of columns) {
      columnIdByTableAndColumn.set(`${tableKey(table.name)}::${columnKey(col.name)}`, col.id);
    }
  });

  const edges: Edge[] = [];
  for (const rel of schema.relationships) {
    const sourceNodeId = nodeIdByTable.get(tableKey(rel.fromTable));
    const targetNodeId = nodeIdByTable.get(tableKey(rel.toTable));
    const sourceColId = columnIdByTableAndColumn.get(
      `${tableKey(rel.fromTable)}::${columnKey(rel.fromColumn)}`,
    );
    const targetColId = columnIdByTableAndColumn.get(
      `${tableKey(rel.toTable)}::${columnKey(rel.toColumn)}`,
    );

    if (!sourceNodeId || !targetNodeId || !sourceColId || !targetColId) {
      continue;
    }

    edges.push({
      id: crypto.randomUUID(),
      source: sourceNodeId,
      target: targetNodeId,
      sourceHandle: columnSourceHandleId(sourceColId),
      targetHandle: columnTargetHandleId(targetColId),
      animated: true,
    });
  }

  return { nodes, edges };
}
