import type { Edge, Node } from '@xyflow/react';
import type { ColumnDef, SqlType } from '@/components/db-builder/types';
import { findColumn, isTableNode } from '@/lib/generateSql';

function toPascalCase(name: string): string {
  const parts = name
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
  if (parts.length === 0) return 'Unnamed';
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

function toFieldName(name: string): string {
  const cleaned = name.trim().replace(/[^a-zA-Z0-9_]/g, '_');
  if (!cleaned) return 'unnamed';
  if (/^[0-9]/.test(cleaned)) return `field_${cleaned}`;
  return cleaned;
}

function prismaTypeFor(sqlType: SqlType): { type: string; native?: string } {
  switch (sqlType) {
    case 'INTEGER':
      return { type: 'Int' };
    case 'VARCHAR(255)':
    case 'TEXT':
      return { type: 'String' };
    case 'BOOLEAN':
      return { type: 'Boolean' };
    case 'TIMESTAMP':
      return { type: 'DateTime' };
    case 'UUID':
      return { type: 'String', native: '@db.Uuid' };
    case 'DECIMAL':
      return { type: 'Decimal', native: '@db.Decimal' };
    default:
      return { type: 'String' };
  }
}

function uniqueName(base: string, used: Set<string>): string {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  let i = 2;
  while (used.has(`${base}${i}`)) i += 1;
  const name = `${base}${i}`;
  used.add(name);
  return name;
}

/**
 * Generates Prisma model blocks from table nodes and edges.
 * Edge direction matches generateSql: source column is the FK side; target is referenced.
 */
export function generatePrisma(nodes: Node[], edges: Edge[]): string {
  const tableNodes = nodes.filter(isTableNode);
  if (tableNodes.length === 0) {
    return '// No tables to export\n';
  }

  const nodeById = new Map(tableNodes.map((node) => [node.id, node]));
  const modelNameByNodeId = new Map<string, string>();
  const usedModelNames = new Set<string>();

  for (const node of tableNodes) {
    modelNameByNodeId.set(
      node.id,
      uniqueName(toPascalCase(node.data.tableName || 'unnamed_table'), usedModelNames),
    );
  }

  const extraLinesByNodeId = new Map<string, string[]>();
  const reservedFieldsByNodeId = new Map<string, Set<string>>();

  for (const node of tableNodes) {
    reservedFieldsByNodeId.set(
      node.id,
      new Set(node.data.columns.map((c) => toFieldName(c.name || 'unnamed_column'))),
    );
    extraLinesByNodeId.set(node.id, []);
  }

  edges.forEach((edge, index) => {
    const sourceNode = nodeById.get(edge.source);
    const targetNode = nodeById.get(edge.target);
    if (!sourceNode || !targetNode) return;

    const sourceCol = findColumn(sourceNode.data.columns, edge.sourceHandle);
    const targetCol = findColumn(targetNode.data.columns, edge.targetHandle);
    if (!sourceCol || !targetCol) return;

    const sourceModel = modelNameByNodeId.get(sourceNode.id)!;
    const targetModel = modelNameByNodeId.get(targetNode.id)!;
    const fkField = toFieldName(sourceCol.name || 'unnamed_column');
    const refField = toFieldName(targetCol.name || 'unnamed_column');
    const relationName = `${sourceModel}_${fkField}_to_${targetModel}_${index + 1}`;

    const sourceReserved = reservedFieldsByNodeId.get(sourceNode.id)!;
    const targetReserved = reservedFieldsByNodeId.get(targetNode.id)!;

    const forwardBase = toFieldName(targetModel.charAt(0).toLowerCase() + targetModel.slice(1));
    const backBase = toFieldName(`${sourceModel.charAt(0).toLowerCase()}${sourceModel.slice(1)}s`);
    const forwardName = uniqueName(forwardBase, sourceReserved);
    const backName = uniqueName(backBase, targetReserved);

    extraLinesByNodeId.get(sourceNode.id)!.push(
      `  ${forwardName} ${targetModel} @relation("${relationName}", fields: [${fkField}], references: [${refField}])`,
    );
    extraLinesByNodeId.get(targetNode.id)!.push(
      `  ${backName} ${sourceModel}[] @relation("${relationName}")`,
    );
  });

  const models = tableNodes.map((node) => {
    const modelName = modelNameByNodeId.get(node.id)!;
    const usedFields = new Set<string>();

    const fieldLines = node.data.columns.map((col: ColumnDef) => {
      const fieldName = uniqueName(toFieldName(col.name || 'unnamed_column'), usedFields);
      const { type, native } = prismaTypeFor(col.type);
      const parts = [`  ${fieldName} ${type}`];
      if (col.isPrimaryKey) parts.push('@id');
      if (native) parts.push(native);
      return parts.join(' ');
    });

    fieldLines.push(...(extraLinesByNodeId.get(node.id) ?? []));

    return `model ${modelName} {\n${fieldLines.join('\n')}\n}`;
  });

  return `${models.join('\n\n')}\n`;
}
