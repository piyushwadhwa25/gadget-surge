import pkg from 'node-sql-parser';
import {
  normalizeSqlTypeDetailed,
  type GeneratedRelationship,
  type GeneratedSchema,
  type GeneratedTable,
} from '@/lib/aiSchemaGenerator';

const { Parser } = pkg;

export type FallbackColumn = {
  table: string;
  column: string;
  rawType: string;
};

export type ImportSqlResult = {
  schema: GeneratedSchema;
  fallbackColumns: FallbackColumn[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function identFromMaybeColumn(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (!isRecord(value)) return '';

  if (typeof value.value === 'string') return value.value.trim();

  if (isRecord(value.expr) && typeof value.expr.value === 'string') {
    return value.expr.value.trim();
  }

  if (isRecord(value.column)) {
    return identFromMaybeColumn(value.column);
  }

  return '';
}

function tableNameFromAst(tableField: unknown): string {
  if (Array.isArray(tableField) && tableField.length > 0 && isRecord(tableField[0])) {
    const name = tableField[0].table;
    return typeof name === 'string' ? name.trim() : '';
  }
  if (isRecord(tableField) && typeof tableField.table === 'string') {
    return tableField.table.trim();
  }
  return '';
}

function formatDataType(definition: unknown): string {
  if (!isRecord(definition) || typeof definition.dataType !== 'string') {
    return '';
  }
  const dataType = definition.dataType;
  const length = definition.length;
  const scale = definition.scale;
  if (typeof length === 'number' || typeof length === 'string') {
    if (typeof scale === 'number' || typeof scale === 'string') {
      return `${dataType}(${length},${scale})`;
    }
    return `${dataType}(${length})`;
  }
  return dataType;
}

function constraintTypeOf(value: unknown): string {
  if (!isRecord(value) || typeof value.constraint_type !== 'string') return '';
  return value.constraint_type.trim().toLowerCase();
}

function extractReference(
  referenceDefinition: unknown,
): { toTable: string; toColumn: string } | null {
  if (!isRecord(referenceDefinition)) return null;
  const toTable = tableNameFromAst(referenceDefinition.table);
  const defs = referenceDefinition.definition;
  if (!toTable || !Array.isArray(defs) || defs.length === 0) return null;
  const toColumn = identFromMaybeColumn(defs[0]);
  if (!toColumn) return null;
  return { toTable, toColumn };
}

function parseSqlAst(sql: string): unknown[] {
  const parser = new Parser();
  const options = [
    { database: 'PostgreSQL' as const },
    { database: 'MySQL' as const },
  ];

  let lastError: unknown = null;
  for (const opt of options) {
    try {
      const ast = parser.astify(sql, opt);
      if (Array.isArray(ast)) return ast;
      return [ast];
    } catch (err) {
      lastError = err;
    }
  }

  const detail =
    lastError instanceof Error && lastError.message
      ? lastError.message
      : 'Unexpected SQL syntax.';
  throw new Error(
    `Could not parse SQL. Paste valid CREATE TABLE statements (optionally with ALTER TABLE foreign keys). ${detail}`,
  );
}

/**
 * Parses CREATE TABLE / ALTER TABLE ... FOREIGN KEY SQL into a GeneratedSchema
 * compatible with schemaToNodesAndEdges.
 */
export function importSql(sql: string): ImportSqlResult {
  const trimmed = sql.trim();
  if (!trimmed) {
    throw new Error('Paste one or more CREATE TABLE statements to import.');
  }

  let statements: unknown[];
  try {
    statements = parseSqlAst(trimmed);
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('Could not parse SQL. Check the syntax and try again.');
  }

  const tables: GeneratedTable[] = [];
  const relationships: GeneratedRelationship[] = [];
  const fallbackColumns: FallbackColumn[] = [];
  const pkByTable = new Map<string, Set<string>>();

  const ensurePkSet = (tableName: string) => {
    const key = tableName.toLowerCase();
    let set = pkByTable.get(key);
    if (!set) {
      set = new Set();
      pkByTable.set(key, set);
    }
    return set;
  };

  const addRelationship = (
    fromTable: string,
    fromColumn: string,
    toTable: string,
    toColumn: string,
  ) => {
    if (!fromTable || !fromColumn || !toTable || !toColumn) return;
    const duplicate = relationships.some(
      (rel) =>
        rel.fromTable.toLowerCase() === fromTable.toLowerCase() &&
        rel.fromColumn.toLowerCase() === fromColumn.toLowerCase() &&
        rel.toTable.toLowerCase() === toTable.toLowerCase() &&
        rel.toColumn.toLowerCase() === toColumn.toLowerCase(),
    );
    if (!duplicate) {
      relationships.push({ fromTable, fromColumn, toTable, toColumn });
    }
  };

  for (const stmt of statements) {
    if (!isRecord(stmt)) continue;

    if (stmt.type === 'create' && stmt.keyword === 'table') {
      const tableName = tableNameFromAst(stmt.table);
      if (!tableName) continue;

      const columns: GeneratedTable['columns'] = [];
      const defs = Array.isArray(stmt.create_definitions) ? stmt.create_definitions : [];

      for (const def of defs) {
        if (!isRecord(def)) continue;

        if (def.resource === 'column') {
          const colName = identFromMaybeColumn(def.column);
          if (!colName) continue;

          const rawType = formatDataType(def.definition) || 'VARCHAR(255)';
          const { type, usedFallback } = normalizeSqlTypeDetailed(rawType);
          if (usedFallback) {
            fallbackColumns.push({ table: tableName, column: colName, rawType });
          }

          const inlinePk =
            def.primary_key === 'primary key' ||
            (typeof def.primary_key === 'string' &&
              def.primary_key.toLowerCase() === 'primary key');

          if (inlinePk) {
            ensurePkSet(tableName).add(colName.toLowerCase());
          }

          columns.push({
            name: colName,
            type,
            isPrimaryKey: inlinePk,
          });

          const ref = extractReference(def.reference_definition);
          if (ref) {
            addRelationship(tableName, colName, ref.toTable, ref.toColumn);
          }
          continue;
        }

        if (def.resource === 'constraint') {
          const ctype = constraintTypeOf(def);
          if (ctype === 'primary key' && Array.isArray(def.definition)) {
            for (const colRef of def.definition) {
              const colName = identFromMaybeColumn(colRef);
              if (colName) ensurePkSet(tableName).add(colName.toLowerCase());
            }
          } else if (ctype === 'foreign key' && Array.isArray(def.definition)) {
            const fromColumn = identFromMaybeColumn(def.definition[0]);
            const ref = extractReference(def.reference_definition);
            if (fromColumn && ref) {
              addRelationship(tableName, fromColumn, ref.toTable, ref.toColumn);
            }
          }
        }
      }

      const pkSet = ensurePkSet(tableName);
      for (const col of columns) {
        if (pkSet.has(col.name.toLowerCase())) {
          col.isPrimaryKey = true;
        }
      }

      if (columns.length === 0) {
        throw new Error(`Table "${tableName}" has no columns to import.`);
      }

      tables.push({ name: tableName, columns });
      continue;
    }

    if (stmt.type === 'alter' && (stmt.keyword === 'table' || stmt.keyword == null)) {
      const fromTable = tableNameFromAst(stmt.table);
      if (!fromTable || !Array.isArray(stmt.expr)) continue;

      for (const expr of stmt.expr) {
        if (!isRecord(expr) || expr.action !== 'add') continue;
        const createDef = expr.create_definitions;
        if (!isRecord(createDef)) continue;

        const ctype = constraintTypeOf(createDef);
        if (ctype !== 'foreign key') continue;
        if (!Array.isArray(createDef.definition) || createDef.definition.length === 0) continue;

        const fromColumn = identFromMaybeColumn(createDef.definition[0]);
        const ref = extractReference(createDef.reference_definition);
        if (fromColumn && ref) {
          addRelationship(fromTable, fromColumn, ref.toTable, ref.toColumn);
        }
      }
    }
  }

  if (tables.length === 0) {
    throw new Error('No CREATE TABLE statements found in the pasted SQL.');
  }

  return {
    schema: { tables, relationships },
    fallbackColumns,
  };
}
