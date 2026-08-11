import { createContext, useContext, type ReactNode } from 'react';

type DiagramEditMode = {
  /** When true, all mutation UI and handlers must no-op. */
  readOnly: boolean;
};

const DiagramEditModeContext = createContext<DiagramEditMode>({ readOnly: false });

export function DiagramEditModeProvider({
  readOnly,
  children,
}: {
  readOnly: boolean;
  children: ReactNode;
}) {
  return (
    <DiagramEditModeContext.Provider value={{ readOnly }}>
      {children}
    </DiagramEditModeContext.Provider>
  );
}

export function useDiagramEditMode(): DiagramEditMode {
  return useContext(DiagramEditModeContext);
}
