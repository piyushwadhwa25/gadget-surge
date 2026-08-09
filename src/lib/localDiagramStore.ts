import Dexie, { type Table } from 'dexie';
import type { SerializedDiagram } from '@/components/db-builder/serializeDiagram';

export type LocalDiagram = {
  id: string;
  name: string;
  data: SerializedDiagram;
  updatedAt: string;
};

class LocalDiagramDatabase extends Dexie {
  diagrams!: Table<LocalDiagram, string>;

  constructor() {
    super('gadget-surge-visual-db');
    this.version(1).stores({
      diagrams: 'id, updatedAt',
    });
  }
}

const db = new LocalDiagramDatabase();

export async function saveDiagramLocal(
  diagram: Omit<LocalDiagram, 'id' | 'updatedAt'> & { id?: string },
): Promise<LocalDiagram> {
  const id = diagram.id ?? crypto.randomUUID();
  const record: LocalDiagram = {
    id,
    name: diagram.name,
    data: diagram.data,
    updatedAt: new Date().toISOString(),
  };
  await db.diagrams.put(record);
  return record;
}

export async function listDiagramsLocal(): Promise<LocalDiagram[]> {
  return db.diagrams.orderBy('updatedAt').reverse().toArray();
}

export async function deleteDiagramLocal(id: string): Promise<void> {
  await db.diagrams.delete(id);
}

export async function getDiagramLocal(id: string): Promise<LocalDiagram | undefined> {
  return db.diagrams.get(id);
}
