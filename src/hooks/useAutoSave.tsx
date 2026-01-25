import { useCallback, useRef, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AutoSaveOptions {
  debounceMs?: number;
  onSaveStart?: () => void;
  onSaveEnd?: () => void;
  onError?: (error: Error) => void;
}

type SaveableTable = 'sections' | 'pages' | 'sites';

interface SaveOperation {
  table: SaveableTable;
  id: string;
  data: Record<string, unknown>;
}

export function useAutoSave(options: AutoSaveOptions = {}) {
  const { debounceMs = 1000, onSaveStart, onSaveEnd, onError } = options;
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const pendingOperations = useRef<Map<string, SaveOperation>>(new Map());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const flushSave = useCallback(async () => {
    if (pendingOperations.current.size === 0) return;

    const operations = Array.from(pendingOperations.current.values());
    pendingOperations.current.clear();

    setIsSaving(true);
    onSaveStart?.();

    try {
      // Group operations by table for batch updates
      const grouped = operations.reduce((acc, op) => {
        if (!acc[op.table]) acc[op.table] = [];
        acc[op.table].push(op);
        return acc;
      }, {} as Record<SaveableTable, SaveOperation[]>);

      for (const [table, ops] of Object.entries(grouped)) {
        for (const op of ops) {
          const { error } = await supabase
            .from(table as SaveableTable)
            .update(op.data)
            .eq('id', op.id);

          if (error) throw error;
        }
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save error:', error);
      onError?.(error as Error);
      toast.error('שגיאה בשמירה אוטומטית');
    } finally {
      setIsSaving(false);
      onSaveEnd?.();
    }
  }, [onSaveStart, onSaveEnd, onError]);

  const queueSave = useCallback((operation: SaveOperation) => {
    const key = `${operation.table}:${operation.id}`;
    
    // Merge with existing pending operation
    const existing = pendingOperations.current.get(key);
    if (existing) {
      pendingOperations.current.set(key, {
        ...existing,
        data: { ...existing.data, ...operation.data },
      });
    } else {
      pendingOperations.current.set(key, operation);
    }

    // Debounce the save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(flushSave, debounceMs);
  }, [debounceMs, flushSave]);

  const saveSection = useCallback((sectionId: string, content: Record<string, unknown>, settings?: Record<string, unknown>) => {
    queueSave({
      table: 'sections',
      id: sectionId,
      data: {
        content,
        ...(settings && { settings }),
        updated_at: new Date().toISOString(),
      },
    });
  }, [queueSave]);

  const savePage = useCallback((pageId: string, data: Record<string, unknown>) => {
    queueSave({
      table: 'pages',
      id: pageId,
      data: {
        ...data,
        updated_at: new Date().toISOString(),
      },
    });
  }, [queueSave]);

  const saveSite = useCallback((siteId: string, data: Record<string, unknown>) => {
    queueSave({
      table: 'sites',
      id: siteId,
      data: {
        ...data,
        updated_at: new Date().toISOString(),
      },
    });
  }, [queueSave]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      flushSave();
    };
  }, [flushSave]);

  return {
    isSaving,
    lastSaved,
    saveSection,
    savePage,
    saveSite,
    flushSave,
  };
}
