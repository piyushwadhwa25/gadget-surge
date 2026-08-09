import type { Node } from '@xyflow/react';

export const SQL_TYPES = [
  'INTEGER',
  'VARCHAR(255)',
  'TEXT',
  'BOOLEAN',
  'TIMESTAMP',
  'UUID',
  'DECIMAL',
] as const;

export type SqlType = (typeof SQL_TYPES)[number];

export type ColumnDef = {
  id: string;
  name: string;
  type: SqlType;
  isPrimaryKey: boolean;
};

export type TableNodeData = {
  tableName: string;
  columns: ColumnDef[];
  /** When true, column list is hidden; persists via serializeDiagram. */
  isCollapsed?: boolean;
};

export type TableFlowNode = Node<TableNodeData, 'table'>;

export function columnTargetHandleId(columnId: string) {
  return `target-${columnId}`;
}

export function columnSourceHandleId(columnId: string) {
  return `source-${columnId}`;
}

export function columnIdFromHandleId(handleId: string | null | undefined): string | null {
  if (!handleId) return null;
  if (handleId.startsWith('target-')) return handleId.slice('target-'.length);
  if (handleId.startsWith('source-')) return handleId.slice('source-'.length);
  return handleId;
}
