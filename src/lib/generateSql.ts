import type { Edge, Node } from '@xyflow/react';
import {
  columnIdFromHandleId,
  type ColumnDef,
  type TableNodeData,
} from '@/components/db-builder/types';

function quoteIdent(name: string): string {
  const cleaned = name.trim() || 'unnamed';
  return `"${cleaned.replace(/"/g, '""')}"`;
}

export function isTableNode(node: Node): node is Node<TableNodeData, 'table'> {
  return node.type === 'table' && !!node.data && typeof node.data === 'object' && 'columns' in node.data;
}

export function findColumn(
  columns: ColumnDef[],
  handleId: string | null | undefined,
): ColumnDef | undefined {
  const columnId = columnIdFromHandleId(handleId);
  if (!columnId) return undefined;
  return columns.find((c) => c.id === columnId);
}

/**
 * Generates CREATE TABLE statements from table nodes, then ALTER TABLE ... ADD FOREIGN KEY
 * for each edge. Edge direction: source column is the FK side; target column is referenced.
 */
export function generateSql(nodes: Node[], edges: Edge[]): string {
  const tableNodes = nodes.filter(isTableNode);
  const nodeById = new Map(tableNodes.map((node) => [node.id, node]));

  const createStatements = tableNodes.map((node) => {
    const tableName = quoteIdent(node.data.tableName || 'unnamed_table');
    const columnLines = node.data.columns.map((col) => {
      const colName = quoteIdent(col.name || 'unnamed_column');
      return `  ${colName} ${col.type}`;
    });

    const pkColumns = node.data.columns
      .filter((col) => col.isPrimaryKey)
      .map((col) => quoteIdent(col.name || 'unnamed_column'));

    if (pkColumns.length > 0) {
      columnLines.push(`  PRIMARY KEY (${pkColumns.join(', ')})`);
    }

    return `CREATE TABLE ${tableName} (\n${columnLines.join(',\n')}\n);`;
  });

  const fkStatements = edges.flatMap((edge, index) => {
    const sourceNode = nodeById.get(edge.source);
    const targetNode = nodeById.get(edge.target);
    if (!sourceNode || !targetNode) {
      return [];
    }

    const sourceCol = findColumn(sourceNode.data.columns, edge.sourceHandle);
    const targetCol = findColumn(targetNode.data.columns, edge.targetHandle);
    if (!sourceCol || !targetCol) {
      return [];
    }

    const constraintName = quoteIdent(
      `fk_${(sourceNode.data.tableName || 'src').trim()}_${(sourceCol.name || 'col').trim()}_${index + 1}`,
    );

    return [
      `ALTER TABLE ${quoteIdent(sourceNode.data.tableName || 'unnamed_table')}\n` +
        `  ADD CONSTRAINT ${constraintName}\n` +
        `  FOREIGN KEY (${quoteIdent(sourceCol.name || 'unnamed_column')})\n` +
        `  REFERENCES ${quoteIdent(targetNode.data.tableName || 'unnamed_table')} (${quoteIdent(targetCol.name || 'unnamed_column')});`,
    ];
  });

  const sections = [...createStatements, ...fkStatements].filter(Boolean);
  return sections.length > 0 ? `${sections.join('\n\n')}\n` : '-- No tables to export\n';
}
